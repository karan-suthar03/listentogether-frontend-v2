import {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import SearchSection from './SearchSection';
import MusicPlayer from './MusicPlayer';
import Navigation, {type DesktopTab} from './Navigation';
import Queue from './Queue';
import Room from './Room';
import LoadingSpinner from './LoadingSpinner';
import roomService from '../services/room';
import queueService, {type QueueData} from '../services/queue';
import socketService from '../services/socket';
import type {QueueItem, RoomData, Song} from '../types';

type MobileTab = 'search' | 'queue' | 'room';

const RoomPage = () => {
    const {roomId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [mobileTab, setMobileTab] = useState<MobileTab>('search');
    const [desktopTab, setDesktopTab] = useState<DesktopTab>('search');
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState<number | undefined>();
    const [roomData, setRoomData] = useState<RoomData>({
        name: 'Loading...',
        description: 'Connecting to room...',
        listeners: 0,
        queue: [],
        roomCode: roomId || '',
        members: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [validatingRoom, setValidatingRoom] = useState(true);

    const userName = location.state?.userName || 'Guest';
    const userId = location.state?.userId;
    useEffect(() => {
        if (!roomId) {
            navigate('/');
            return;
        }

        let queueUnsubscribe: (() => void) | null = null;
        let isMounted = true;

        const initializeRoom = async () => {
            setValidatingRoom(true);
            try {
                const userFromNavigation = userName !== 'Guest' && userId;
                if (!userFromNavigation) {
                    const sessionResult = await roomService.restoreSession(roomId);
                    if (!sessionResult.success) {
                        if (sessionResult.roomNotFound) {
                            navigate('/', {
                                state: {
                                    error: `Room ${roomId} does not exist or has been deleted.`
                                }
                            });
                            return;
                        } else {
                            navigate(`/join/${roomId}`);
                            return;
                        }
                    }
                }

                await socketService.connect();

                if (!isMounted) return;

                await socketService.joinRoom(roomId, {
                    id: userId || `guest-${Date.now()}`,
                    name: userName
                });

                if (!isMounted) return;

                await socketService.getParticipants(roomId);

                await queueService.setupSocketListeners();

                queueUnsubscribe = queueService.subscribe((queueData: QueueData) => {
                    if (!isMounted) return;
                    setQueue(queueData.queue);
                    if (queueData.currentTrackIndex >= 0 && queueData.queue[queueData.currentTrackIndex]) {
                        const currentTrack = queueData.queue[queueData.currentTrackIndex];
                        setCurrentlyPlayingId(typeof currentTrack.id === 'string' ? parseInt(currentTrack.id) : currentTrack.id);
                    }
                });

                await queueService.getQueue(roomId);

                if (!isMounted) return;

                await socketService.on('queue-updated', (updatedQueue: QueueItem[]) => {
                    if (!isMounted) return;
                    setQueue(updatedQueue);
                });

                await socketService.on('playback-updated', (playbackData: any) => {
                    if (!isMounted) return;
                    if (playbackData.currentSong) {
                        setCurrentSong(playbackData.currentSong);
                        setCurrentlyPlayingId(typeof playbackData.currentSong.id === 'string' ? parseInt(playbackData.currentSong.id) : playbackData.currentSong.id);
                    }
                });

                await socketService.on('music-state', (musicState: any) => {
                    if (!isMounted) return;
                    if (musicState.queue) {
                        setQueue(musicState.queue);
                    }
                    if (musicState.currentTrackIndex >= 0 && musicState.queue && musicState.queue[musicState.currentTrackIndex]) {
                        const currentTrack = musicState.queue[musicState.currentTrackIndex];
                        setCurrentlyPlayingId(typeof currentTrack.id === 'string' ? parseInt(currentTrack.id) : currentTrack.id);
                    }
                });

                await socketService.onParticipantList((participants: any[]) => {
                    if (!isMounted) return;
                    setRoomData(prev => ({
                        ...prev,
                        listeners: participants.length,
                        members: participants.map((user: any) => ({
                            id: user.id,
                            name: user.name,
                            syncOffset: 0,
                            isConnected: user.isConnected,
                            joinedAt: new Date(user.joinedAt),
                            isHost: user.isHost
                        }))
                    }));
                });

            } catch (error: any) {
                console.error('Failed to initialize room:', error);
                const isRoomNotFound = error?.message?.toLowerCase().includes('room not found') ||
                    error?.message?.toLowerCase().includes('room does not exist') ||
                    error?.status === 404 ||
                    error?.statusCode === 404;

                if (isRoomNotFound) {
                    navigate('/', {
                        state: {
                            error: `Room ${roomId} does not exist or has been deleted.`
                        }
                    });
                } else {
                    navigate(`/join/${roomId}`);
                }
            } finally {
                setValidatingRoom(false);
                setIsLoading(false);
            }
        };

        initializeRoom();

        const roomUnsubscribe = roomService.subscribe((state) => {
            if (state.room) {
                const frontendRoomData = {
                    name: `Room ${state.room.code}`,
                    description: 'Live music room',
                    listeners: state.room.members.length,
                    queue: state.room.playback?.queue || [],
                    roomCode: state.room.code,
                    members: state.room.members.map(user => ({
                        id: user.id,
                        name: user.name,
                        syncOffset: 0,
                        isConnected: user.isConnected,
                        joinedAt: new Date(user.joinedAt),
                        isHost: user.isHost
                    })),
                    currentlyPlayingId: state.room.playback?.currentlyPlayingId
                };
                setRoomData(frontendRoomData);

                if (state.room.playback?.queue) {
                    setQueue(state.room.playback.queue);
                }
            }
            if (state.error) {
                console.error('Room service error:', state.error);
            }
        });
        return () => {
            isMounted = false;
            if (queueUnsubscribe) queueUnsubscribe();
            if (roomUnsubscribe) roomUnsubscribe();
            queueService.cleanup();
            socketService.offParticipantList();
            socketService.leaveRoom(roomId);
            socketService.disconnect();
        };
    }, [roomId, userName, userId, navigate]);

    if (isLoading || validatingRoom) {
        return (
            <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center">
                <LoadingSpinner/>
            </div>
        );
    }

    const handleSongSelect = (song: Song) => {
        const newQueueItem: QueueItem = {
            id: song.id,
            title: song.title,
            artist: song.artist,
            addedBy: "You",
            thumbnail: song.thumbnail
        };

        setQueue(prevQueue => [...prevQueue, newQueueItem]);
        setMobileTab('queue');
    };
    const handleRemoveFromQueue = (id: number | string) => {
        setQueue(prevQueue => prevQueue.filter(item => item.id !== id));

        const numericId = typeof id === 'string' ? parseInt(id) : id;
        if (currentlyPlayingId === numericId) {
            setCurrentlyPlayingId(undefined);
        }
    };
    const handlePlayNext = (item: QueueItem) => {
        const numericId = typeof item.id === 'string' ? parseInt(item.id) : item.id;
        setCurrentlyPlayingId(numericId);

        const song: Song = {
            id: numericId,
            title: item.title,
            artist: item.artist,
            album: 'Unknown Album',
            duration: item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : '3:30',
            thumbnail: item.thumbnail || item.coverUrl
        };
        setCurrentSong(song);
    };

    const handleDesktopTabChange = (tab: DesktopTab | MobileTab) => {
        if (tab === 'search' || tab === 'room') {
            setDesktopTab(tab);
        }
    };

    const renderDesktopContent = () => {
        switch (desktopTab) {
            case 'search':
                return (
                    <>
                        <SearchSection onSongSelect={handleSongSelect} roomCode={roomId} userName={userName}
                                       hasCurrentSong={!!currentSong}/>
                        <Queue
                            queue={queue}
                            currentlyPlayingId={currentlyPlayingId}
                            onAddToQueue={() => {
                            }}
                            onRemoveFromQueue={handleRemoveFromQueue}
                            onPlayNext={handlePlayNext}
                            isMobile={false}
                        />
                    </>
                );
            case 'room':
                return (
                    <>
                        <Queue
                            queue={queue}
                            currentlyPlayingId={currentlyPlayingId}
                            onAddToQueue={() => {
                            }}
                            onRemoveFromQueue={handleRemoveFromQueue}
                            onPlayNext={handlePlayNext}
                            isMobile={false}
                        />
                        <Room roomData={roomData} onExit={handleLeaveRoom} isMobile={false}
                              hasCurrentSong={!!currentSong}/>
                    </>
                );
            default:
                return null;
        }
    };

    const handleLeaveRoom = () => {
        navigate('/');
    };

    const renderMobileContent = () => {
        switch (mobileTab) {
            case 'search':
                return <SearchSection onSongSelect={handleSongSelect} roomCode={roomId} userName={userName}
                                      hasCurrentSong={!!currentSong}/>;
            case 'queue':
                return (
                    <Queue
                        queue={queue}
                        currentlyPlayingId={currentlyPlayingId}
                        onAddToQueue={() => setMobileTab('search')}
                        onRemoveFromQueue={handleRemoveFromQueue}
                        onPlayNext={handlePlayNext}
                        isMobile={true}
                    />
                );
            case 'room':
                return (
                    <Room
                        roomData={roomData}
                        onExit={handleLeaveRoom}
                        isMobile={true}
                        hasCurrentSong={!!currentSong}
                    />
                );
            default:
                return <SearchSection onSongSelect={handleSongSelect} roomCode={roomId} userName={userName}
                                      hasCurrentSong={!!currentSong}/>;
        }
    };
    return (
        <div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-20 bg-gradient-radial from-gray-900 via-black to-black animate-pulse-slow pointer-events-none"></div>
            <Navigation
                activeTab={mobileTab}
                onTabChange={(tab) => setMobileTab(tab as MobileTab)}
                isMobile={true}
                queueCount={queue.length}
            />

            <Navigation
                activeTab={desktopTab}
                onTabChange={handleDesktopTabChange}
                isMobile={false}
            />

            <div className="hidden lg:flex xl:hidden h-screen">
                {renderDesktopContent()}
            </div>

            <div className="hidden xl:flex h-screen">
                <SearchSection onSongSelect={handleSongSelect} roomCode={roomId} userName={userName}
                               hasCurrentSong={!!currentSong}/>
                <Queue
                    queue={queue}
                    currentlyPlayingId={currentlyPlayingId}
                    onAddToQueue={() => {
                    }}
                    onRemoveFromQueue={handleRemoveFromQueue}
                    onPlayNext={handlePlayNext}
                    isMobile={false}
                />
                <Room roomData={roomData} onExit={handleLeaveRoom} isMobile={false} hasCurrentSong={!!currentSong}/>
            </div>

            <div className="lg:hidden h-screen">
                {renderMobileContent()}
            </div>
            <MusicPlayer currentSong={currentSong}/>
        </div>
    );
};

export default RoomPage;

import {useEffect, useState} from 'react';
import SearchSection from './components/SearchSection';
import MusicPlayer from './components/MusicPlayer';
import Navigation, {type DesktopTab} from './components/Navigation';
import Queue from './components/Queue';
import Room from './components/Room';
import type {QueueItem, RoomData, Song} from './types';

type MobileTab = 'search' | 'queue' | 'room';

function App() {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [mobileTab, setMobileTab] = useState<MobileTab>('search');
    const [desktopTab, setDesktopTab] = useState<DesktopTab>('search');
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState<number | undefined>(undefined);
    const [roomData, setRoomData] = useState<RoomData>({
        name: "My Room",
        description: "Default room",
        listeners: 1,
        queue: [],
        roomCode: "ROOM123",
        members: [],
        currentlyPlayingId: undefined
    });

    // Sync roomData queue with the main queue state
    useEffect(() => {
        setRoomData(prevRoomData => ({
            ...prevRoomData,
            queue: queue,
            currentlyPlayingId: currentlyPlayingId
        }));
    }, [queue, currentlyPlayingId]);

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
        const numericId = typeof id === 'string' ? parseInt(id) : id;
        setQueue(prevQueue => prevQueue.filter(item => item.id !== numericId));

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
            duration: '3:30',
            thumbnail: item.thumbnail
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
                        <SearchSection onSongSelect={handleSongSelect} hasCurrentSong={!!currentSong}/>
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
                        <Room roomData={roomData} onExit={() => console.log('Exit room')} isMobile={false}
                              hasCurrentSong={!!currentSong}/>
                    </>
                );
            default:
                return null;
        }
    };
    const renderMobileContent = () => {
        switch (mobileTab) {
            case 'search':
                return <SearchSection onSongSelect={handleSongSelect} hasCurrentSong={!!currentSong}/>;
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
                        onExit={() => console.log('Exit room')}
                        isMobile={true}
                        hasCurrentSong={!!currentSong}
                    />
                );
            default:
                return <SearchSection onSongSelect={handleSongSelect} hasCurrentSong={!!currentSong}/>;
        }
    };
    return (<div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
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
                <SearchSection onSongSelect={handleSongSelect} hasCurrentSong={!!currentSong}/>
                <Queue
                    queue={queue}
                    currentlyPlayingId={currentlyPlayingId}
                    onAddToQueue={() => {
                    }}
                    onRemoveFromQueue={handleRemoveFromQueue}
                    onPlayNext={handlePlayNext}
                    isMobile={false}
                />
                <Room roomData={roomData} onExit={() => console.log('Exit room')} isMobile={false}
                      hasCurrentSong={!!currentSong}/>
            </div>
            <div className="lg:hidden h-screen">
                {renderMobileContent()}
            </div>
            <MusicPlayer currentSong={currentSong}/>
        </div>
    );
}

export default App;

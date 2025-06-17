import {Check, Copy, LogOut} from 'lucide-react';
import {useEffect, useState} from 'react';
import type {Member, RoomData} from '../types';
import roomService from '../services/room';
import socketService from '../services/socket';

interface RoomProps {
    roomData: RoomData;
    onExit: () => void;
    isMobile?: boolean;
    hasCurrentSong?: boolean;
}

export default function Room({roomData, onExit, isMobile = false, hasCurrentSong}: RoomProps) {
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const [realtimeRoomData, setRealtimeRoomData] = useState(roomData);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

    useEffect(() => {
        console.log('🏠 Room props changed, updating room data:', roomData);
        setRealtimeRoomData(roomData);

        if (socketService.isConnected() && roomData.roomCode) {
            console.log('🔍 Requesting participants due to prop change');
            socketService.getParticipants(roomData.roomCode);
        }
    }, [roomData]);

    useEffect(() => {
        let isMounted = true;

        const setupListeners = async () => {
            try {
                await socketService.connect();

                if (!isMounted) return;

                const handleRoomUpdate = (updatedRoom: any) => {
                    if (!isMounted) return;
                    console.log('🏠 Room updated:', updatedRoom);
                    const updatedRoomData: RoomData = {
                        name: `Room ${updatedRoom.code}`,
                        description: 'Live music room',
                        listeners: updatedRoom.members.length,
                        queue: updatedRoom.playback?.queue || [],
                        roomCode: updatedRoom.code,
                        members: updatedRoom.members.map((user: any) => ({
                            id: user.id,
                            name: user.name,
                            syncOffset: 0,
                            isConnected: user.isConnected,
                            joinedAt: new Date(user.joinedAt),
                            isHost: user.isHost
                        })),
                        currentlyPlayingId: updatedRoom.playback?.currentlyPlayingId
                    };
                    setRealtimeRoomData(updatedRoomData);
                };

                const handleUserJoined = (data: any) => {
                    if (!isMounted) return;
                    console.log('👤 User joined:', data);
                    handleRoomUpdate(data.room);
                };

                const handleUserLeft = (data: any) => {
                    if (!isMounted) return;
                    console.log('👤 User left:', data);
                    handleRoomUpdate(data.room);
                };

                const handleHostChanged = (data: any) => {
                    if (!isMounted) return;
                    console.log('👑 Host changed:', data);
                    handleRoomUpdate(data.room);
                };

                const handleConnect = () => {
                    if (!isMounted) return;
                    console.log('🔌 Socket connected in Room');
                    setConnectionStatus('connected');
                    if (realtimeRoomData.roomCode) {
                        socketService.getParticipants(realtimeRoomData.roomCode);
                    }
                };

                const handleDisconnect = (reason: string) => {
                    if (!isMounted) return;
                    console.log('🔌 Socket disconnected in Room:', reason);
                    setConnectionStatus('disconnected');
                };

                const handleParticipantList = (participants: any[]) => {
                    if (!isMounted) return;
                    console.log('👥 Participant list received:', participants);
                    const updatedRoomData = {
                        ...realtimeRoomData,
                        listeners: participants.length,
                        members: participants.map((user: any) => ({
                            id: user.id,
                            name: user.name,
                            syncOffset: 0,
                            isConnected: user.isConnected,
                            joinedAt: new Date(user.joinedAt),
                            isHost: user.isHost
                        }))
                    };
                    setRealtimeRoomData(updatedRoomData);
                };

                socketService.on('room-updated', handleRoomUpdate);
                socketService.on('user-joined', handleUserJoined);
                socketService.on('user-left', handleUserLeft);
                socketService.on('host-changed', handleHostChanged);
                socketService.on('connect', handleConnect);
                socketService.on('disconnect', handleDisconnect);
                socketService.onParticipantList(handleParticipantList);

                setConnectionStatus('connected');

            } catch (error) {
                if (!isMounted) return;
                console.error('🔌 Failed to connect socket in Room:', error);
                setConnectionStatus('disconnected');
            }
        };

        setupListeners();
        const unsubscribeRoom = roomService.subscribe((state: any) => {
            if (!isMounted) return;

            if (state.room) {
                const updatedRoomData: RoomData = {
                    ...realtimeRoomData,
                    name: `Room ${state.room.code}`,
                    description: 'Live music room',
                    listeners: state.room.members.length,
                    queue: state.room.playback?.queue || [],
                    roomCode: state.room.code,
                    members: state.room.members.map((user: any) => ({
                        id: user.id,
                        name: user.name,
                        syncOffset: 0,
                        isConnected: user.isConnected,
                        joinedAt: new Date(user.joinedAt),
                        isHost: user.isHost
                    })),
                    currentlyPlayingId: state.room.playback?.currentlyPlayingId
                };
                setRealtimeRoomData(updatedRoomData);
            }

            setConnectionStatus(state.isConnected ? 'connected' : 'disconnected');
        });

        return () => {
            isMounted = false;
            socketService.off('room-updated');
            socketService.off('user-joined');
            socketService.off('user-left');
            socketService.off('host-changed');
            socketService.off('connect');
            socketService.off('disconnect');
            socketService.offParticipantList();

            unsubscribeRoom();
        };
    }, []);

    const copyToClipboard = async (text: string, type: 'code' | 'link') => {
        try {
            await navigator.clipboard.writeText(text);

            setCopiedStates(prev => ({...prev, [type]: true}));

            setTimeout(() => {
                setCopiedStates(prev => ({...prev, [type]: false}));
            }, 2000);

        } catch (err) {
            console.error('Failed to copy:', err);
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopiedStates(prev => ({...prev, [type]: true}));
                setTimeout(() => {
                    setCopiedStates(prev => ({...prev, [type]: false}));
                }, 2000);
            } finally {
                document.body.removeChild(textArea);
            }
        }
    };
    const containerClasses = isMobile
        ? "lg:hidden flex flex-col h-screen bg-black text-gray-300 pt-16"
        : "hidden lg:flex xl:w-1/3 lg:w-1/2 bg-gradient-to-br from-gray-800/30 to-black/30 backdrop-blur-xl border-l border-white/5 xl:pt-0 lg:pt-16";
    const headerPadding = isMobile ? "p-4" : "p-6";
    const exitButtonPadding = isMobile
        ? (hasCurrentSong ? "p-4 pb-24" : "p-4 pb-8")
        : (hasCurrentSong ? "p-6 pb-32" : "p-6");
    const titleSize = isMobile ? "text-lg" : "text-xl";

    return (
        <div className={containerClasses}>
            <div className="flex-1 flex flex-col relative z-10">
                <div className={`flex-shrink-0 ${headerPadding} border-b border-white/5`}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className={`font-semibold text-white ${titleSize}`}>
                            Room
                        </h2>
                        <div className="flex items-center gap-1">
                            {connectionStatus === 'connected' ? (
                                <>
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-400">Live</span>
                                </>
                            ) : connectionStatus === 'connecting' ? (
                                <>
                                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-yellow-400">Connecting</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                    <span className="text-xs text-red-400">Offline</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={() => copyToClipboard(realtimeRoomData.roomCode || '', 'code')}
                            className={`w-full p-2.5 rounded-lg transition-colors border border-white/5 ${
                                copiedStates.code
                                    ? 'bg-green-500/20 hover:bg-green-500/30 border-green-500/20'
                                    : 'bg-gray-900/50 hover:bg-gray-800/60 hover:border-green-500/20'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2 text-xs">
                                {copiedStates.code ? (
                                    <Check className="w-3.5 h-3.5 text-green-400"/>
                                ) : (
                                    <Copy className="w-3.5 h-3.5 text-gray-400"/>
                                )}
                                <span className={copiedStates.code ? "text-green-400" : "text-gray-300"}>
                                    {copiedStates.code ? "Copied!" : `Code: ${realtimeRoomData.roomCode}`}
                                </span>
                            </div>
                        </button>

                        <button
                            onClick={() => copyToClipboard(`${window.location.origin}/join/${realtimeRoomData.roomCode}`, 'link')}
                            className={`w-full p-2.5 rounded-lg transition-colors border border-white/5 ${
                                copiedStates.link
                                    ? 'bg-green-500/20 hover:bg-green-500/30 border-green-500/20'
                                    : 'bg-gray-900/50 hover:bg-gray-800/60 hover:border-green-500/20'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2 text-xs">
                                {copiedStates.link ? (
                                    <Check className="w-3.5 h-3.5 text-green-400"/>
                                ) : (
                                    <Copy className="w-3.5 h-3.5 text-gray-400"/>
                                )}
                                <span className={copiedStates.link ? "text-green-400" : "text-gray-300"}>
                                    {copiedStates.link ? "Copied!" : "Copy Link"}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <div className={`${headerPadding} pb-2`}>
                        <h3 className="text-sm font-medium text-gray-400 mb-3">
                            Members ({realtimeRoomData.listeners})
                        </h3>
                    </div>

                    <div className={`flex-1 overflow-y-auto scrollbar-hide ${isMobile ? 'px-4 pb-32' : 'px-6 pb-8'}`}>
                        <div className="space-y-2">
                            {realtimeRoomData.members && realtimeRoomData.members.length > 0 ? (
                                realtimeRoomData.members.map((member: Member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/40 border border-white/5"
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                                member.isHost ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700/60 text-gray-300'
                                            }`}>
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-100 truncate">
                                                    {member.name}
                                                </span>
                                                {member.isHost && (
                                                    <span
                                                        className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded border border-green-500/30">
                                                        Host
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    member.isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                                                }`}></div>
                                                <span className="text-xs text-gray-500">
                                                    {member.isConnected ? 'Online' : 'Offline'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 text-sm">No members found</div>
                                    <div className="text-gray-600 text-xs mt-1">Waiting for participants...</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={`flex-shrink-0 ${exitButtonPadding} border-t border-white/5`}>
                    <button
                        onClick={onExit}
                        className="w-full py-3 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/20 text-red-400 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4"/>
                        Leave Room
                    </button>
                </div>
            </div>
        </div>
    );
}

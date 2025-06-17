import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeft, Loader2, Users} from 'lucide-react';
import roomService from '../services/room';
import SecureStorageService from '../services/storage';

const JoinRoomPage = () => {
    const {roomId} = useParams();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!roomId) {
            navigate('/');
            return;
        }

        const sessionData = SecureStorageService.getUserSession();
        if (sessionData && sessionData.roomCode === roomId) {
            setUserName(sessionData.userName);
        }
    }, [roomId, navigate]);

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!roomId || !userName.trim()) {
            setError('Please enter your name');
            return;
        }

        setIsJoining(true);
        setError(null);
        try {
            const response = await roomService.joinRoom(roomId, userName.trim());

            if (response) {
                navigate(`/room/${roomId}`, {
                    state: {
                        userName: response.user.name,
                        userId: response.user.id
                    }
                });
            }
        } catch (error: any) {
            console.error('Failed to join room:', error);
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
                setError(error instanceof Error ? error.message : 'Failed to join room. Please check the room code and try again.');
            }
        } finally {
            setIsJoining(false);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-black text-gray-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <button
                    onClick={handleBackToHome}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5"/>
                    Back to Home
                </button>
                <h1 className="text-xl font-bold text-white">Join Room</h1>
                <div className="w-20"></div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
                            <Users className="w-8 h-8 text-white"/>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Join Room</h2>
                        <p className="text-gray-400 mb-1">Room Code:</p>
                        <p className="text-xl font-mono text-purple-400 font-bold">{roomId}</p>
                    </div>

                    <form onSubmit={handleJoinRoom} className="space-y-6">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                disabled={isJoining}
                                maxLength={50}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isJoining || !userName.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            {isJoining ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin"/>
                                    Joining Room...
                                </>
                            ) : (
                                'Join Room'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 p-4 bg-gray-900/50 rounded-lg">
                        <p className="text-sm text-gray-400 text-center">
                            Make sure you have the correct room code. If you're having trouble joining,
                            check with the room host for the correct code.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinRoomPage;

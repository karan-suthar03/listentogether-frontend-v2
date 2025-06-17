import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {AlertCircle, Hash, Music, Plus, User} from 'lucide-react';
import roomService from '../services/room';

const LandingPage = () => {
    const [roomCode, setRoomCode] = useState('');
    const [createName, setCreateName] = useState('');
    const [joinName, setJoinName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.error) {
            setError(location.state.error);
            navigate(location.pathname, {replace: true, state: {}});
        }
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, [location, navigate]);

    const validateName = (name: string) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            return 'Name is required';
        }
        if (trimmedName.length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (trimmedName.length > 20) {
            return 'Name must be less than 20 characters';
        }
        return '';
    };

    const validateRoomCode = (code: string) => {
        const trimmedCode = code.trim();
        if (!trimmedCode) {
            return 'Room code is required';
        }
        if (trimmedCode.length < 4) {
            return 'Room code must be at least 4 characters';
        }
        if (!/^[a-zA-Z0-9]+$/.test(trimmedCode)) {
            return 'Room code can only contain letters and numbers';
        }
        return '';
    };
    const handleCreateRoom = async () => {
        const nameValidation = validateName(createName);
        if (nameValidation) {
            setError(nameValidation);
            return;
        }

        setIsCreating(true);
        setError('');
        try {
            const response = await roomService.createRoom('My Room', createName.trim());
            navigate(`/room/${response.room.code}`, {state: {userName: createName.trim(), userId: response.user.id}});
        } catch (err) {
            console.error('Failed to create room:', err);
            setError('Failed to create room. Please try again.');
            setIsCreating(false);
        }
    };

    const handleJoinRoom = async () => {
        const nameValidation = validateName(joinName);
        const codeValidation = validateRoomCode(roomCode);

        if (nameValidation) {
            setError(nameValidation);
            return;
        }
        if (codeValidation) {
            setError(codeValidation);
            return;
        }
        setError('');
        try {
            const response = await roomService.joinRoom(roomCode.trim(), joinName.trim());
            navigate(`/room/${roomCode.trim()}`, {state: {userName: joinName.trim(), userId: response.user.id}});
        } catch (err) {
            console.error('Failed to join room:', err);
            setError('Failed to join room. Please check the room code and try again.');
        }
    };
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleJoinRoom();
        }
    };

    const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomCode(e.target.value);
        if (error) setError('');
    };

    const handleCreateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreateName(e.target.value);
        if (error) setError('');
    };

    const handleJoinNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJoinName(e.target.value);
        if (error) setError('');
    };
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 opacity-20 bg-gradient-radial from-purple-900 via-black to-black animate-pulse-slow pointer-events-none"></div>

            <div
                className={`relative z-10 w-full max-w-sm lg:max-w-3xl mx-auto transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="text-center mb-6 lg:mb-8">
                    <div className="flex items-center justify-center mb-2">
                        <Music className="w-8 h-8 lg:w-10 lg:h-10 text-purple-400 mr-2"/>
                        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            ListenTogether
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm lg:text-base">
                        Listen to music together, in sync
                    </p>
                </div>
                {error && (
                    <div
                        className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0"/>
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}
                <div
                    className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 lg:items-stretch">
                    <div
                        className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 flex flex-col">
                        <div className="flex items-center mb-4">
                            <Plus className="w-5 h-5 text-green-400 mr-2"/>
                            <h2 className="text-lg font-semibold text-gray-100">Create Room</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4"/>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={createName}
                                    onChange={handleCreateNameChange}
                                    className={`w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-lg focus:outline-none text-gray-100 placeholder-gray-500 transition-all duration-300 ${
                                        error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500/20'
                                    }`}
                                    maxLength={20}
                                    autoComplete="name"
                                    aria-label="Your name"
                                />
                            </div>
                            <button
                                onClick={handleCreateRoom}
                                disabled={isCreating || !createName.trim()}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:transform-none"
                            >
                                {isCreating ? (
                                    <div className="flex items-center justify-center">
                                        <div
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Creating...
                                    </div>
                                ) : (
                                    'Create New Room'
                                )}
                            </button>
                        </div>
                    </div>

                    <div
                        className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 flex flex-col">
                        <div className="flex items-center mb-4">
                            <Hash className="w-5 h-5 text-blue-400 mr-2"/>
                            <h2 className="text-lg font-semibold text-gray-100">Join Room</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4"/>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={joinName}
                                    onChange={handleJoinNameChange}
                                    className={`w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-lg focus:outline-none text-gray-100 placeholder-gray-500 transition-all duration-300 ${
                                        error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                    }`}
                                    maxLength={20}
                                    autoComplete="name"
                                    aria-label="Your name"
                                />
                            </div>
                            <div className="relative">
                                <Hash
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4"/>
                                <input
                                    type="text"
                                    placeholder="Room code"
                                    value={roomCode}
                                    onChange={handleRoomCodeChange}
                                    onKeyPress={handleKeyPress}
                                    className={`w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-lg focus:outline-none text-gray-100 placeholder-gray-500 transition-all duration-300 ${
                                        error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                    }`}
                                    maxLength={20}
                                    autoComplete="off"
                                    aria-label="Room code input"
                                />
                            </div>
                            <button
                                onClick={handleJoinRoom}
                                disabled={!roomCode.trim() || !joinName.trim()}
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:transform-none"
                            >
                                Join Room
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-4 text-center">
                    <p className="text-xs text-gray-500">
                        No signup required
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

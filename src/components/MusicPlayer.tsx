import {useEffect, useState} from 'react';
import {
    ChevronDown,
    Heart,
    MoreHorizontal,
    Music,
    Pause,
    Play,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX
} from 'lucide-react';
import type {Song} from '../types';

interface MusicPlayerProps {
    currentSong: Song | null;
}

export default function MusicPlayer({currentSong}: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!isPlaying || !currentSong) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setIsPlaying(false);
                    return 0;
                }
                return prev + 0.5;
            });
        }, 300);

        return () => clearInterval(interval);
    }, [isPlaying, currentSong]);

    useEffect(() => {
        if (currentSong) {
            setProgress(0);
            setIsPlaying(true);
            setIsLiked(false);
        }
    }, [currentSong]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsExpanded(false);
            }
        };

        if (isExpanded) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isExpanded]);

    if (!currentSong) return null;
    return (
        <>
            <div className="lg:hidden fixed left-0 right-0 bottom-4 z-20 flex justify-center pointer-events-none">
                <div className="w-full max-w-lg mx-auto mb-2 px-4">
                    <div
                        className="relative rounded-xl bg-gray-900/90 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 pointer-events-auto overflow-hidden cursor-pointer hover:bg-gray-800/90 transition-all duration-300"
                        onClick={() => setIsExpanded(true)}
                    >
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-out"
                                style={{width: `${progress}%`}}
                            />
                        </div>

                        <div className="flex items-center gap-3 p-3">
                            <div
                                className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700/80 to-gray-900/80 flex items-center justify-center shadow-lg flex-shrink-0 border border-white/10">
                                <Music className="text-green-400/80 w-4 h-4"/>
                            </div>

                            <div className="flex-1 min-w-0 overflow-hidden">
                                <div className="font-medium text-gray-100 truncate text-sm leading-tight">
                                    {currentSong.title}
                                </div>
                                <div className="text-gray-400 text-xs truncate">
                                    {currentSong.artist}
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsPlaying(!isPlaying);
                                }}
                                className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4 text-black fill-current"/>
                                ) : (
                                    <Play className="w-4 h-4 text-black fill-current ml-0.5"/>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="hidden lg:block fixed left-0 right-0 bottom-0 z-20 bg-gray-900/95 backdrop-blur-xl border-t border-white/10">
                <div className="h-1 bg-gray-700/50 cursor-pointer group">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-out group-hover:from-green-300 group-hover:to-blue-400"
                        style={{width: `${progress}%`}}
                    />
                </div>

                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0 max-w-xs">
                        <div
                            className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-700/80 to-gray-900/80 flex items-center justify-center shadow-lg flex-shrink-0 border border-white/10">
                            <Music className="text-green-400/80 w-6 h-6"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-100 truncate text-base">
                                {currentSong.title}
                            </div>
                            <div className="text-gray-400 text-sm truncate">
                                {currentSong.artist}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                                isLiked ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/10 hover:bg-white/20 text-gray-300'
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}/>
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3">
                            <button
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105">
                                <SkipBack className="w-5 h-5 text-gray-300"/>
                            </button>

                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-green-500/30 hover:scale-105"
                            >
                                {isPlaying ? (
                                    <Pause className="w-5 h-5 text-black fill-current"/>
                                ) : (
                                    <Play className="w-5 h-5 text-black fill-current ml-0.5"/>
                                )}
                            </button>

                            <button
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105">
                                <SkipForward className="w-5 h-5 text-gray-300"/>
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                            <span>
                                {Math.floor((progress / 100) * 210)}:{String(Math.floor(((progress / 100) * 210) % 60)).padStart(2, '0')}
                            </span>
                            <span className="text-gray-600">•</span>
                            <span>{currentSong.duration}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-1 justify-end max-w-xs">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
                        >
                            {isMuted ? (
                                <VolumeX className="w-4 h-4 text-gray-300"/>
                            ) : (
                                <Volume2 className="w-4 h-4 text-gray-300"/>
                            )}
                        </button>

                        <div className="flex items-center gap-2 w-24">
                            <div
                                className="flex-1 h-1 bg-gray-700/50 rounded-full overflow-hidden group cursor-pointer">
                                <div
                                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-200 group-hover:from-green-300 group-hover:to-blue-400"
                                    style={{width: isMuted ? '0%' : '65%'}}
                                />
                            </div>
                        </div>

                        <button
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200">
                            <MoreHorizontal className="w-4 h-4 text-gray-300"/>
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsExpanded(false)}
                />
                <div
                    className={`absolute left-0 right-0 bottom-0 transition-transform duration-300 ease-out ${
                        isExpanded ? 'translate-y-0' : 'translate-y-full'
                    }`}>
                    <div
                        className="bg-gradient-to-br from-gray-950 via-gray-900 to-black rounded-t-3xl shadow-2xl border-t border-white/10 max-h-[85vh] overflow-hidden">
                        <div
                            className="absolute inset-0 opacity-10 bg-gradient-radial from-green-900/30 via-transparent to-blue-900/20"></div>

                        <div className="relative flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 pt-6">
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                                >
                                    <ChevronDown className="w-5 h-5 text-gray-300"/>
                                </button>
                                <div className="text-center">
                                    <div className="text-sm text-gray-400 font-medium">Playing from Search</div>
                                </div>
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                                >
                                    <MoreHorizontal className="w-5 h-5 text-gray-300"/>
                                </button>
                            </div>
                            <div className="flex items-center justify-center px-8 py-6">
                                <div
                                    className="w-60 h-60 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 flex items-center justify-center shadow-2xl border border-white/10 relative overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 animate-pulse-slow"></div>
                                    <Music className="text-green-400/60 w-20 h-20 relative z-10"/>
                                </div>
                            </div>

                            <div className="px-6 text-center mb-4">
                                <h1 className="text-xl font-bold text-white mb-2 truncate">
                                    {currentSong.title}
                                </h1>
                                <p className="text-gray-400 text-lg truncate">
                                    {currentSong.artist}
                                </p>
                                <p className="text-gray-500 text-sm mt-1 truncate">
                                    {currentSong.album}
                                </p>
                            </div>

                            <div className="px-6 mb-4">
                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="font-mono">
                    {Math.floor((progress / 100) * 210)}:{String(Math.floor(((progress / 100) * 210) % 60)).padStart(2, '0')}
                  </span>
                                    <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-out"
                                            style={{width: `${progress}%`}}
                                        />
                                    </div>
                                    <span className="font-mono">{currentSong.duration}</span>
                                </div>
                            </div>
                            <div className="px-6 pb-6">
                                <div className="flex items-center justify-center gap-8 mb-6">
                                    <button
                                        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200">
                                        <SkipBack className="w-6 h-6 text-gray-300"/>
                                    </button>

                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-7 h-7 text-black fill-current"/>
                                        ) : (
                                            <Play className="w-7 h-7 text-black fill-current ml-1"/>
                                        )}
                                    </button>

                                    <button
                                        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200">
                                        <SkipForward className="w-6 h-6 text-gray-300"/>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setIsLiked(!isLiked)}
                                        className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
                                            isLiked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 hover:bg-white/20 text-gray-300'
                                        }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}/>
                                    </button>

                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                                    >
                                        {isMuted ? (
                                            <VolumeX className="w-5 h-5 text-gray-300"/>
                                        ) : (
                                            <Volume2 className="w-5 h-5 text-gray-300"/>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

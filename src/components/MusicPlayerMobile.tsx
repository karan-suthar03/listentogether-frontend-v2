import { useState, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Heart, MoreHorizontal, ChevronDown } from 'lucide-react';
import type { Song } from '../types';

interface MusicPlayerMobileProps {
  currentSong: Song | null;
}

export default function MusicPlayerMobile({ currentSong }: MusicPlayerMobileProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Simulate song progress when playing
  useEffect(() => {
    if (!isPlaying || !currentSong) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.5; // Increment by 0.5% every 300ms for demo
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  // Reset progress when song changes
  useEffect(() => {
    if (currentSong) {
      setProgress(0);
      setIsPlaying(true);
      setIsLiked(false);
    }
  }, [currentSong]);

  // Close expanded view on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when expanded
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
    <>      {/* Compact Player Bar */}
      <div className="lg:hidden fixed left-0 right-0 bottom-20 z-20 flex justify-center pointer-events-none">
        <div className="w-full max-w-lg mx-auto mb-2 px-4">
          <div 
            className="relative rounded-xl bg-gray-900/90 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 pointer-events-auto overflow-hidden cursor-pointer hover:bg-gray-800/90 transition-all duration-300"
            onClick={() => setIsExpanded(true)}
          >
            {/* Progress bar at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex items-center gap-3 p-3">
              {/* Album art */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700/80 to-gray-900/80 flex items-center justify-center shadow-lg flex-shrink-0 border border-white/10">
                <Music className="text-green-400/80 w-4 h-4" />
              </div>
              
              {/* Song info */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="font-medium text-gray-100 truncate text-sm leading-tight">
                  {currentSong.title}
                </div>
                <div className="text-gray-400 text-xs truncate">
                  {currentSong.artist}
                </div>
              </div>
              
              {/* Play/Pause button only */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-green-500/25"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-black fill-current" />
                ) : (
                  <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>      {/* Expanded Player - Slides up from bottom */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
        
        {/* Expanded Player Container */}
        <div className={`absolute left-0 right-0 bottom-0 transition-transform duration-300 ease-out ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black rounded-t-3xl shadow-2xl border-t border-white/10 max-h-[85vh] overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-gradient-radial from-green-900/30 via-transparent to-blue-900/20"></div>
            
            <div className="relative flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 pt-6">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                >
                  <ChevronDown className="w-5 h-5 text-gray-300" />
                </button>
                <div className="text-center">
                  <div className="text-sm text-gray-400 font-medium">Playing from Search</div>
                </div>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              {/* Album Art - Smaller for non-fullscreen */}
              <div className="flex items-center justify-center px-8 py-6">
                <div className="w-60 h-60 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 flex items-center justify-center shadow-2xl border border-white/10 relative overflow-hidden">
                  {/* Subtle glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 animate-pulse-slow"></div>
                  <Music className="text-green-400/60 w-20 h-20 relative z-10" />
                </div>
              </div>

              {/* Song Info */}
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

              {/* Progress Bar */}
              <div className="px-6 mb-4">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="font-mono">
                    {Math.floor((progress / 100) * 210)}:{String(Math.floor(((progress / 100) * 210) % 60)).padStart(2, '0')}
                  </span>
                  <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="font-mono">{currentSong.duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-center gap-8 mb-6">
                  <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200">
                    <SkipBack className="w-6 h-6 text-gray-300" />
                  </button>
                  
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 text-black fill-current" />
                    ) : (
                      <Play className="w-7 h-7 text-black fill-current ml-1" />
                    )}
                  </button>
                  
                  <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200">
                    <SkipForward className="w-6 h-6 text-gray-300" />
                  </button>
                </div>

                {/* Secondary Controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
                      isLiked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 hover:bg-white/20 text-gray-300'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-gray-300" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-gray-300" />
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

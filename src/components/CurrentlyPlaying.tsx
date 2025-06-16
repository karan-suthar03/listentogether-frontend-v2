import { Music, SkipBack, SkipForward, Play } from 'lucide-react';
import type { Song } from '../types';

interface CurrentlyPlayingProps {
  currentSong: Song | null;
}

export default function CurrentlyPlaying({ currentSong }: CurrentlyPlayingProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-1/3 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border-l border-white/5">
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        {currentSong ? (
          <div className="w-full max-w-md animate-fadeIn">
            {/* Album Art Placeholder */}
            <div className="aspect-square w-full max-w-80 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl ring-1 ring-white/10 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-600/10"></div>
              <Music className="text-gray-600 w-24 h-24 relative z-10"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            {/* Song Info */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{currentSong.title}</h2>
              <p className="text-xl text-gray-400 mb-1">{currentSong.artist}</p>
              <p className="text-lg text-gray-500">{currentSong.album}</p>
            </div>

            {/* Progress Bar Placeholder */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>0:00</span>
                <span>{currentSong.duration}</span>
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" style={{width: '35%'}}></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-6">
              <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <SkipBack className="w-6 h-6 text-gray-400" />
              </button>
              <button className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all hover:scale-105 shadow-lg">
                <Play className="w-8 h-8 text-black fill-black" />
              </button>
              <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <SkipForward className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center opacity-40 select-none">
            <div className="aspect-square w-64 mx-auto mb-8 rounded-2xl bg-gray-900/50 ring-1 ring-white/5 flex items-center justify-center">
              <Music className="text-gray-700 w-20 h-20"/>
            </div>
            <h3 className="text-xl text-gray-500 font-medium mb-2">No song selected</h3>
            <p className="text-gray-600">Choose a track to start listening</p>
          </div>
        )}
      </div>
    </div>
  );
}

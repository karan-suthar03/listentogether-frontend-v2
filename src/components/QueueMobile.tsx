import { useState } from 'react';
import { Music, Play, Plus, Trash2, Check, Volume2 } from 'lucide-react';
import type { QueueItem } from '../types';

interface QueueMobileProps {
  queue: QueueItem[];
  currentlyPlayingId?: number;
  onAddToQueue?: () => void;
  onRemoveFromQueue?: (id: number) => void;
  onPlayNext?: (item: QueueItem) => void;
}

export default function QueueMobile({ 
  queue, 
  currentlyPlayingId,
  onAddToQueue, 
  onRemoveFromQueue, 
  onPlayNext 
}: QueueMobileProps) {
  const [actionStates, setActionStates] = useState<{[key: number]: string}>({});

  const handleAction = (itemId: number, action: 'play' | 'remove', callback?: () => void) => {
    // Set action state
    setActionStates(prev => ({ ...prev, [itemId]: action }));
    
    // Execute callback after brief delay for visual feedback
    setTimeout(() => {
      callback?.();
      // Reset state
      setActionStates(prev => ({ ...prev, [itemId]: '' }));
    }, 500);
  };  return (
    <div className="lg:hidden flex flex-col h-screen bg-black text-gray-300">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white">Queue</h2>
          <div className="flex items-center gap-1 text-green-400">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs">{queue.length} songs</span>
          </div>
        </div>
        <p className="text-gray-400 text-xs">Up next in the session</p>
      </div>{/* Queue Content */}
      <div className="flex-1 overflow-hidden">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center pb-32">
            <div className="w-20 h-20 rounded-2xl bg-gray-900/50 flex items-center justify-center mb-4">
              <Music className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Queue is empty</h3>
            <p className="text-gray-500 text-sm mb-6">Add some songs to get the party started!</p>
            {onAddToQueue && (
              <button
                onClick={onAddToQueue}
                className="py-3 px-6 rounded-xl bg-green-500 hover:bg-green-400 text-black font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Songs
              </button>
            )}
          </div>        ) : (
          <div className="px-4 h-full overflow-y-auto scrollbar-hide pb-40">
            <div className="space-y-3 pt-4">              {queue.map((item, index) => {
                const isCurrentlyPlaying = currentlyPlayingId === item.id;
                return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-colors border cursor-pointer ${
                    isCurrentlyPlaying 
                      ? 'bg-green-500/10 hover:bg-green-500/15 border-green-500/20' 
                      : 'bg-gray-900/40 hover:bg-gray-800/40 border-white/5'
                  }`}
                  onClick={() => onPlayNext && handleAction(item.id, 'play', () => onPlayNext(item))}
                >
                  {/* Position number or playing indicator */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    isCurrentlyPlaying ? 'bg-green-500/20' : 'bg-gray-800/60'
                  }`}>
                    {isCurrentlyPlaying ? (
                      <Volume2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <span className="text-xs font-medium text-gray-300">{index + 1}</span>
                    )}                  </div>

                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-800/60">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={`${item.title} by ${item.artist}`}
                        className="w-full h-full object-cover"                        onError={(e) => {
                          // Fallback to music icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallbackDiv) fallbackDiv.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full flex items-center justify-center ${item.thumbnail ? 'hidden' : 'flex'}`}
                    >
                      <Music className="w-6 h-6 text-gray-500" />
                    </div>
                  </div>

                  {/* Song info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate leading-tight mb-1 ${
                      isCurrentlyPlaying ? 'text-green-400' : 'text-gray-100'
                    }`}>
                      {item.title}
                      {isCurrentlyPlaying && (
                        <span className="ml-2 text-xs text-green-400/70">• Now Playing</span>
                      )}
                    </h3>
                    <div className="flex items-center text-gray-400 text-xs space-x-2">
                      <span className="truncate">{item.artist}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-green-400">by {item.addedBy}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">                    {onPlayNext && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(item.id, 'play', () => onPlayNext(item));
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                          actionStates[item.id] === 'play'
                            ? 'bg-green-500 scale-110'
                            : 'bg-green-500/20 hover:bg-green-500/40'
                        }`}
                      >
                        {actionStates[item.id] === 'play' ? (
                          <Check className="w-3.5 h-3.5 text-black" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-green-400 fill-current ml-0.5" />
                        )}
                      </button>
                    )}
                      {onRemoveFromQueue && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(item.id, 'remove', () => onRemoveFromQueue(item.id));
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                          actionStates[item.id] === 'remove'
                            ? 'bg-red-500 scale-110'
                            : 'bg-red-500/20 hover:bg-red-500/40'
                        }`}
                      >
                        {actionStates[item.id] === 'remove' ? (
                          <Check className="w-3.5 h-3.5 text-black" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        )}
                      </button>
                    )}                  </div>
                </div>
                );
              })}
            </div>

            {/* Add to queue button */}
            {onAddToQueue && (
              <div className="pt-6">
                <button
                  onClick={onAddToQueue}
                  className="w-full py-3 px-4 rounded-xl bg-green-500/15 hover:bg-green-500/25 border border-green-500/20 text-green-400 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add More Songs
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { Users, List, Plus, Share, LogOut } from 'lucide-react';
import type { RoomData } from '../types';

interface RoomDetailsProps {
  roomData: RoomData;
}

export default function RoomDetails({ roomData }: RoomDetailsProps) {
  return (
    <div className="hidden xl:flex xl:w-1/3 bg-gradient-to-br from-gray-800/30 to-black/30 backdrop-blur-xl border-l border-white/5">
      <div className="flex-1 flex flex-col p-6 relative z-10">
        {/* Room Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-white">{roomData.name}</h3>
            <div className="flex items-center gap-1 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-3">{roomData.description}</p>
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="w-5 h-5" />
            <span className="text-sm">{roomData.listeners} listening</span>
          </div>
        </div>

        {/* Room Queue */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <List className="w-5 h-5" />
            <h4 className="text-lg font-semibold text-gray-300">Up Next</h4>
          </div>
          
          <div className="space-y-3">
            {roomData.queue.map((queueItem, idx) => (
              <div
                key={queueItem.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/40 hover:bg-gray-800/60 transition-colors border border-white/5"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-400">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-200 text-sm truncate">{queueItem.title}</div>
                  <div className="text-gray-500 text-xs truncate">{queueItem.artist}</div>
                </div>
                <div className="text-xs text-gray-600">
                  by {queueItem.addedBy}
                </div>
              </div>
            ))}
          </div>

          {/* Add to Queue Button */}
          <button className="w-full mt-6 py-3 px-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-medium text-sm transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add to Queue
          </button>
        </div>

        {/* Room Actions */}
        <div className="border-t border-white/5 pt-4 mt-4">
          <div className="flex gap-2">
            <button className="flex-1 py-2 px-3 rounded-md bg-gray-800/50 hover:bg-gray-700/60 text-gray-400 text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Share className="w-4 h-4" />
              Share Room
            </button>
            <button className="flex-1 py-2 px-3 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" />
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Copy, LogOut, Check } from 'lucide-react';
import { useState } from 'react';
import type { RoomData, Member } from '../types';

interface RoomMobileProps {
  roomData: RoomData;
  onExit: () => void;
}

export default function RoomMobile({ roomData, onExit }: RoomMobileProps) {
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      
      // Set copied state
      setCopiedStates(prev => ({ ...prev, [type]: true }));
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }));
      }, 2000);
      
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };const getSyncStatus = (offset: number, isConnected: boolean) => {
    if (!isConnected) return { status: 'disconnected', color: 'text-gray-500' };
    
    const absOffset = Math.abs(offset);
    if (absOffset <= 50) return { status: 'excellent', color: 'text-green-400' };
    if (absOffset <= 150) return { status: 'good', color: 'text-yellow-400' };
    return { status: 'poor', color: 'text-red-400' };
  };

  const inviteLink = `https://listentogether.app/room/${roomData.roomCode}`;

  return (
    <div className="lg:hidden flex flex-col h-screen bg-black text-gray-300">      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Room</h2>
          <div className="flex items-center gap-1 text-green-400">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs">Live</span>
          </div>
        </div>
          {/* Room actions */}
        <div className="space-y-2">
          <button
            onClick={() => copyToClipboard(roomData.roomCode || '', 'code')}
            className={`w-full p-2.5 rounded-lg transition-colors border border-white/5 ${
              copiedStates.code 
                ? 'bg-green-500/20 hover:bg-green-500/30 border-green-500/20' 
                : 'bg-gray-900/50 hover:bg-gray-800/60 hover:border-green-500/20'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs">
              {copiedStates.code ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span className={copiedStates.code ? "text-green-400" : "text-gray-300"}>
                {copiedStates.code ? "Copied!" : `Code: ${roomData.roomCode}`}
              </span>
            </div>
          </button>
          
          <button
            onClick={() => copyToClipboard(inviteLink, 'link')}
            className={`w-full p-2.5 rounded-lg transition-colors border border-white/5 ${
              copiedStates.link 
                ? 'bg-green-500/20 hover:bg-green-500/30 border-green-500/20' 
                : 'bg-gray-900/50 hover:bg-gray-800/60 hover:border-green-500/20'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs">
              {copiedStates.link ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span className={copiedStates.link ? "text-green-400" : "text-gray-300"}>
                {copiedStates.link ? "Copied!" : "Copy Link"}
              </span>
            </div>
          </button>
        </div>
      </div>      {/* Members section */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 pb-2 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Members</h3>
            <span className="text-xs text-gray-500">{roomData.members?.length || 0}</span>
          </div>
        </div>        <div className="px-4 h-full overflow-y-auto scrollbar-hide pb-20">
          <div className="space-y-3 pt-4">
            {roomData.members?.map((member: Member) => {
              const syncStatus = getSyncStatus(member.syncOffset, member.isConnected);
              
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-900/40 hover:bg-gray-800/40 transition-colors border border-white/5"
                >                  {/* Member info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-100 truncate">{member.name}</span>
                        {member.isHost && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                            Host
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        Joined {member.joinedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>                  {/* Sync status */}
                  <div className="flex items-center justify-center">
                    {!member.isConnected ? (
                      <span className="text-xs text-gray-500">Offline</span>
                    ) : syncStatus.status === 'poor' ? (
                      <span className="text-xs text-red-400">Poor</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>      {/* Exit button */}
      <div className="flex-shrink-0 p-4 pb-40 border-t border-white/5">
        <button
          onClick={onExit}
          className="w-full py-3 px-4 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Leave Room
        </button>
      </div>
    </div>
  );
}
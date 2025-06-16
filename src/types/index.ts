export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  thumbnail?: string; // URL to song/album thumbnail
}

export interface QueueItem {
  id: number;
  title: string;
  artist: string;
  addedBy: string;
  thumbnail?: string; // URL to song/album thumbnail
}

export interface Member {
  id: string;
  name: string;
  syncOffset: number; // milliseconds offset from current playback
  isConnected: boolean;
  joinedAt: Date;
  isHost?: boolean;
}

export interface RoomData {
  name: string;
  description: string;
  listeners: number;
  queue: QueueItem[];
  roomCode?: string;
  members?: Member[];
  currentlyPlayingId?: number; // ID of the queue item currently playing
}

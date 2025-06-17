export interface Song {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: string;
    thumbnail?: string;
}

export interface QueueItem {
    id: string | number;
    title: string;
    artist: string;
    addedBy: string;
    thumbnail?: string;
    duration?: number;
    youtubeUrl?: string;
    videoId?: string;
    coverUrl?: string;
    addedAt?: number;
    downloadStatus?: 'pending' | 'downloading' | 'completed' | 'failed';
    downloadProgress?: number;
    mp3Url?: string;
    source?: 'youtube' | 'spotify';
}

export interface Member {
    id: string;
    name: string;
    syncOffset: number;
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
    currentlyPlayingId?: number;
}

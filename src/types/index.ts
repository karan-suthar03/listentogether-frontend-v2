export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
}

export interface QueueItem {
  id: number;
  title: string;
  artist: string;
  addedBy: string;
}

export interface RoomData {
  name: string;
  description: string;
  listeners: number;
  queue: QueueItem[];
}

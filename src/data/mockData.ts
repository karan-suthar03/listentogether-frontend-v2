import type { Song, RoomData } from '../types';

export const mockSongs: Song[] = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20' },
  { id: 2, title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54' },
  { id: 3, title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58' },
  { id: 4, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23' },
  { id: 5, title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3', duration: '2:21' },
];

export const mockRoomData: RoomData = {
  name: "Chill Vibes Room",
  description: "Late night music session",
  listeners: 12,
  queue: [
    { id: 6, title: "Sunflower", artist: "Post Malone", addedBy: "Alex" },
    { id: 7, title: "Circles", artist: "Post Malone", addedBy: "Sarah" },
    { id: 8, title: "Better Now", artist: "Post Malone", addedBy: "Mike" },
  ]
};

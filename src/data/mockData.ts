import type { Song, RoomData, Member } from '../types';

export const mockSongs: Song[] = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', thumbnail: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' },
  { id: 2, title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54', thumbnail: 'https://i.scdn.co/image/ab67616d0000b273277b3ff8e3114a8d4e0c7b57' },
  { id: 3, title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58', thumbnail: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a' },
  { id: 4, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23', thumbnail: 'https://i.scdn.co/image/ab67616d0000b273c9b6ee856d4d72c48d5e1b34' },
  { id: 5, title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3', duration: '2:21', thumbnail: 'https://i.scdn.co/image/ab67616d0000b273a7b39ba46a9a000b34bc2d63' },
];

export const mockMembers: Member[] = [
  { id: '1', name: 'Alex', syncOffset: 15, isConnected: true, joinedAt: new Date('2025-06-17T20:30:00'), isHost: true },
  { id: '2', name: 'Sarah', syncOffset: -32, isConnected: true, joinedAt: new Date('2025-06-17T20:25:00') },
  { id: '3', name: 'Mike', syncOffset: 150, isConnected: true, joinedAt: new Date('2025-06-17T20:35:00') },
  { id: '4', name: 'Emma', syncOffset: 5, isConnected: true, joinedAt: new Date('2025-06-17T20:28:00') },
  { id: '5', name: 'David', syncOffset: -78, isConnected: false, joinedAt: new Date('2025-06-17T20:32:00') },
  { id: '6', name: 'Lisa', syncOffset: 220, isConnected: true, joinedAt: new Date('2025-06-17T20:40:00') },
  { id: '2', name: 'Sarah', syncOffset: -32, isConnected: true, joinedAt: new Date('2025-06-17T20:25:00') },
  { id: '3', name: 'Mike', syncOffset: 150, isConnected: true, joinedAt: new Date('2025-06-17T20:35:00') },
  { id: '4', name: 'Emma', syncOffset: 5, isConnected: true, joinedAt: new Date('2025-06-17T20:28:00') },
  { id: '5', name: 'David', syncOffset: -78, isConnected: false, joinedAt: new Date('2025-06-17T20:32:00') },
  { id: '6', name: 'Lisa', syncOffset: 220, isConnected: true, joinedAt: new Date('2025-06-17T20:40:00') },
  { id: '2', name: 'Sarah', syncOffset: -32, isConnected: true, joinedAt: new Date('2025-06-17T20:25:00') },
  { id: '3', name: 'Mike', syncOffset: 150, isConnected: true, joinedAt: new Date('2025-06-17T20:35:00') },
  { id: '4', name: 'Emma', syncOffset: 5, isConnected: true, joinedAt: new Date('2025-06-17T20:28:00') },
  { id: '5', name: 'David', syncOffset: -78, isConnected: false, joinedAt: new Date('2025-06-17T20:32:00') },
  { id: '6', name: 'Lisa', syncOffset: 220, isConnected: true, joinedAt: new Date('2025-06-17T20:40:00') },
];

export const mockRoomData: RoomData = {
  name: "Chill Vibes Room",
  description: "Late night music session",
  listeners: 12,
  roomCode: "CV4M2K",
  currentlyPlayingId: 6, // Sunflower is currently playing
  queue: [
    { id: 6, title: "Sunflower", artist: "Post Malone", addedBy: "Alex", thumbnail: "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25" },
    { id: 7, title: "Circles", artist: "Post Malone", addedBy: "Sarah", thumbnail: "https://i.scdn.co/image/ab67616d0000b273b1c4b76e23414c9f20242268" },
    { id: 8, title: "Better Now", artist: "Post Malone", addedBy: "Mike", thumbnail: "https://i.scdn.co/image/ab67616d0000b273d85d6ab78e1f501c2b5f5703" },
  ],
  members: mockMembers
};

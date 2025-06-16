import { useState } from 'react';
import SearchSection from './components/SearchSection';
import CurrentlyPlaying from './components/CurrentlyPlaying';
import RoomDetails from './components/RoomDetails';
import { mockSongs, mockRoomData } from './data/mockData';
import type { Song } from './types';

function App() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-20 bg-gradient-radial from-gray-900 via-black to-black animate-pulse-slow"></div>
      
      {/* Desktop: Two-section layout, Mobile: Single section, Ultra-wide: Three sections */}
      <div className="flex h-screen">
        <SearchSection onSongSelect={handleSongSelect} mockSongs={mockSongs} />
        <CurrentlyPlaying currentSong={currentSong} />
        <RoomDetails roomData={mockRoomData} />
      </div>
    </div>
  );
}

export default App;

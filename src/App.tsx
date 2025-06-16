import { useState } from 'react';
import SearchSection from './components/SearchSection';
import CurrentlyPlaying from './components/CurrentlyPlaying';
import RoomDetails from './components/RoomDetails';
import MusicPlayerMobile from './components/MusicPlayerMobile';
import BottomNavigation, { type MobileTab } from './components/BottomNavigation';
import QueueMobile from './components/QueueMobile';
import RoomMobile from './components/RoomMobile';
import { mockSongs, mockRoomData } from './data/mockData';
import type { Song, QueueItem } from './types';

function App() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('search');
  const [queue, setQueue] = useState<QueueItem[]>(mockRoomData.queue);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<number | undefined>(mockRoomData.currentlyPlayingId);
  const handleSongSelect = (song: Song) => {
    // Convert Song to QueueItem and add to queue
    const newQueueItem: QueueItem = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      addedBy: "You", // In a real app, this would be the current user's name
      thumbnail: song.thumbnail
    };
    
    setQueue(prevQueue => [...prevQueue, newQueueItem]);
    
    // Switch to queue tab to show the added song
    setMobileTab('queue');
  };

  const handleRemoveFromQueue = (id: number) => {
    setQueue(prevQueue => prevQueue.filter(item => item.id !== id));
    
    // If the removed song was currently playing, clear the currently playing
    if (currentlyPlayingId === id) {
      setCurrentlyPlayingId(undefined);
    }
  };

  const handlePlayNext = (item: QueueItem) => {
    setCurrentlyPlayingId(item.id);
    
    // Convert QueueItem back to Song for the currently playing component
    const song: Song = {
      id: item.id,
      title: item.title,
      artist: item.artist,
      album: 'Unknown Album', // QueueItem doesn't have album info
      duration: '3:30', // Default duration since QueueItem doesn't have it
      thumbnail: item.thumbnail
    };
    setCurrentSong(song);
  };

  const handleTabChange = (tab: MobileTab) => {
    setMobileTab(tab);
  };

  const renderMobileContent = () => {
    switch (mobileTab) {
      case 'search':
        return <SearchSection onSongSelect={handleSongSelect} mockSongs={mockSongs} />;
      case 'queue':        return (
          <QueueMobile 
            queue={queue}
            currentlyPlayingId={currentlyPlayingId}
            onAddToQueue={() => setMobileTab('search')}
            onRemoveFromQueue={handleRemoveFromQueue}
            onPlayNext={handlePlayNext}
          />
        );
      case 'room':        return (          <RoomMobile 
            roomData={mockRoomData}
            onExit={() => console.log('Exit room')}
          />
        );
      default:
        return <SearchSection onSongSelect={handleSongSelect} mockSongs={mockSongs} />;
    }
  };
  return (    <div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-20 bg-gradient-radial from-gray-900 via-black to-black animate-pulse-slow pointer-events-none"></div>
      
      {/* Desktop: Three-section layout */}
      <div className="hidden lg:flex h-screen">
        <SearchSection onSongSelect={handleSongSelect} mockSongs={mockSongs} />
        <CurrentlyPlaying currentSong={currentSong} />
        <RoomDetails roomData={mockRoomData} />
      </div>      {/* Mobile: Single section with tabs */}
      <div className="lg:hidden h-screen">
        {renderMobileContent()}
      </div>
      
      {/* Mobile Music Player */}
      <MusicPlayerMobile currentSong={currentSong} />
      
      {/* Mobile Bottom Navigation */}
      <BottomNavigation 
        activeTab={mobileTab}
        onTabChange={handleTabChange}
        queueCount={mockRoomData.queue.length}
      />
    </div>
  );
}

export default App;

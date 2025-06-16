import { useState, useEffect } from 'react';

const mockSongs = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20' },
  { id: 2, title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54' },
  { id: 3, title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58' },
  { id: 4, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23' },
  { id: 5, title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3', duration: '2:21' },
];

// SVG Icons (Minimalist & Rich)
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
);

const MusicNoteIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-8 h-8 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6V3m12 3V3"></path>
  </svg>
);

const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
  </svg>
);

const EmptyResultsIcon = () => (
  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10v-.01M15 10v-.01"></path>
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);

const QueueIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
  </svg>
);

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockSongs>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentSong, setCurrentSong] = useState<typeof mockSongs[0] | null>(null);
  
  // Mock room data
  const roomData = {
    name: "Chill Vibes Room",
    description: "Late night music session",
    listeners: 12,
    queue: [
      { id: 6, title: "Sunflower", artist: "Post Malone", addedBy: "Alex" },
      { id: 7, title: "Circles", artist: "Post Malone", addedBy: "Sarah" },
      { id: 8, title: "Better Now", artist: "Post Malone", addedBy: "Mike" },
    ]
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]); // Clear results if query is empty
      return;
    }
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 600)); // Slightly longer for effect
    const filteredResults = mockSongs.filter(song =>
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filteredResults);
    setIsSearching(false);
  };

  // Debounce search on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    const debounceTimer = setTimeout(() => {
      handleSearch(new Event('submit') as any); // Trigger search
    }, 300); // Debounce time
    return () => clearTimeout(debounceTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  return (
    <div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-20 bg-gradient-radial from-gray-900 via-black to-black animate-pulse-slow"></div>
        {/* Desktop: Two-section layout, Mobile: Single section, Ultra-wide: Three sections */}
      <div className="flex h-screen">
        {/* Left Section: Search (Mobile: Full width, Desktop: Half width, Ultra-wide: 1/3 width) */}
        <div className="flex-1 lg:w-1/2 xl:w-1/3 lg:flex-none flex flex-col justify-between relative z-10">
          <main className="flex-1 flex flex-col items-center px-4 pt-12 sm:pt-20 pb-32">
            {/* Animated Title */}
            <h1 
              className={`select-none text-center font-bold tracking-tighter transition-all duration-500 ease-out mb-8 
                          ${isFocused || query ? 'text-2xl text-gray-500' : 'text-5xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600'}`}
            >
              ListenTogether
            </h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-lg mb-12">
              <div className={`relative transition-all duration-300 ease-out ${isFocused ? 'scale-105' : 'scale-100'}`}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 blur-lg opacity-0 transition-opacity duration-500 ${isFocused ? 'opacity-30' : ''}`}></div>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isFocused ? "What are you looking for?" : "Search for music..."}
                  className="relative w-full pl-12 pr-10 py-4 rounded-xl bg-gray-900/70 shadow-2xl ring-1 ring-white/10 focus:ring-2 focus:ring-green-400/80 outline-none text-lg placeholder-gray-500 transition-all duration-300 backdrop-blur-lg text-gray-200"
                  autoFocus
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <SearchIcon />
                </div>
                {isSearching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-400"></div>
                  </div>
                )}
              </div>
            </form>

            {/* Results */}
            <section className="w-full max-w-lg">
              {!query && !isSearching && (
                <div className="flex flex-col items-center mt-12 text-center opacity-50 select-none animate-fadeIn">
                  <MusicNoteIcon className="text-gray-700 mb-4 w-16 h-16"/>
                  <p className="text-lg text-gray-500 font-light">Let the music find you.</p>
                  <p className="text-sm text-gray-600">Search for songs, artists, or albums.</p>
                </div>
              )}
              {query && results.length === 0 && !isSearching && (
                <div className="flex flex-col items-center mt-12 text-center opacity-70 select-none animate-fadeIn">
                  <EmptyResultsIcon />
                  <p className="text-lg text-gray-400 font-medium mt-4">No vibes found for "{query}"</p>
                  <p className="text-sm text-gray-600">Try a different tune.</p>
                </div>
              )}
              {results.length > 0 && (
                <ul className="space-y-3">
                  {results.map((song, idx) => (
                    <li
                      key={song.id}
                      className="relative flex items-center gap-4 p-4 rounded-xl bg-gray-900/60 shadow-xl hover:bg-gray-800/80 transition-all duration-200 group backdrop-blur-md overflow-hidden ring-1 ring-white/5 hover:ring-green-500/50 cursor-pointer"
                      style={{ animation: `slideUpItem 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${idx * 100}ms both` }}
                      onClick={() => setCurrentSong(song)}
                    >
                      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-green-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                        <MusicNoteIcon className="text-green-400 w-6 h-6"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-100 truncate group-hover:text-green-300 transition-colors text-base">{song.title}</div>
                        <div className="text-gray-400 text-sm truncate group-hover:text-gray-300 transition-colors">{song.artist} <span className="mx-1 text-gray-600">•</span> {song.album}</div>
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        <span className="text-gray-500 text-xs mb-1 group-hover:text-gray-400 transition-colors">{song.duration}</span>
                        <button className="w-9 h-9 bg-green-500/80 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg transition-all scale-90 opacity-70 group-hover:scale-100 group-hover:opacity-100">
                          <PlayIcon />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </main>

          {/* Mobile Bottom Player Bar */}
          <div className="lg:hidden fixed left-0 right-0 bottom-0 z-20 flex justify-center pointer-events-none">
            <div className="w-full max-w-lg mx-auto mb-4 px-4 sm:mb-6">
              <div className="h-14 rounded-xl bg-gray-900/70 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 flex items-center justify-center pointer-events-auto">
                <span className="text-gray-500 text-sm font-medium">Player coming soon... Stay tuned!</span>
              </div>
            </div>
          </div>
        </div>        {/* Right Section: Currently Playing (Desktop only, Ultra-wide: Middle section) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-1/3 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border-l border-white/5">
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
            {currentSong ? (
              <div className="w-full max-w-md animate-fadeIn">
                {/* Album Art Placeholder */}
                <div className="aspect-square w-full max-w-80 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl ring-1 ring-white/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-600/10"></div>
                  <MusicNoteIcon className="text-gray-600 w-24 h-24 relative z-10"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                {/* Song Info */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{currentSong.title}</h2>
                  <p className="text-xl text-gray-400 mb-1">{currentSong.artist}</p>
                  <p className="text-lg text-gray-500">{currentSong.album}</p>
                </div>

                {/* Progress Bar Placeholder */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>0:00</span>
                    <span>{currentSong.duration}</span>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" style={{width: '35%'}}></div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-6">
                  <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
                    </svg>
                  </button>
                  <button className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all hover:scale-105 shadow-lg">
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                    </svg>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-40 select-none">
                <div className="aspect-square w-64 mx-auto mb-8 rounded-2xl bg-gray-900/50 ring-1 ring-white/5 flex items-center justify-center">
                  <MusicNoteIcon className="text-gray-700 w-20 h-20"/>
                </div>
                <h3 className="text-xl text-gray-500 font-medium mb-2">No song selected</h3>
                <p className="text-gray-600">Choose a track to start listening</p>
              </div>            )}
          </div>
        </div>

        {/* Far Right Section: Room Details (Ultra-wide screens only) */}
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
                <UsersIcon />
                <span className="text-sm">{roomData.listeners} listening</span>
              </div>
            </div>

            {/* Room Queue */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <QueueIcon />
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add to Queue
              </button>
            </div>

            {/* Room Actions */}
            <div className="border-t border-white/5 pt-4 mt-4">
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-3 rounded-md bg-gray-800/50 hover:bg-gray-700/60 text-gray-400 text-sm font-medium transition-colors">
                  Share Room
                </button>
                <button className="flex-1 py-2 px-3 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition-colors">
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

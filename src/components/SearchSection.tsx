import { useState, useEffect } from 'react';
import { Search, Music, Frown } from 'lucide-react';
import type { Song } from '../types';

interface SearchSectionProps {
  onSongSelect: (song: Song) => void;
  mockSongs: Song[];
}

export default function SearchSection({ onSongSelect, mockSongs }: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 600));
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
      handleSearch(new Event('submit') as any);
    }, 300);
    return () => clearTimeout(debounceTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
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
              <Search className="w-5 h-5" />
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
              <Music className="text-gray-700 mb-4 w-16 h-16"/>
              <p className="text-lg text-gray-500 font-light">Let the music find you.</p>
              <p className="text-sm text-gray-600">Search for songs, artists, or albums.</p>
            </div>
          )}
          {query && results.length === 0 && !isSearching && (
            <div className="flex flex-col items-center mt-12 text-center opacity-70 select-none animate-fadeIn">
              <Frown className="w-12 h-12 text-gray-600" />
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
                  onClick={() => onSongSelect(song)}
                >
                  <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-green-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                    <Music className="text-green-400 w-6 h-6"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-100 truncate group-hover:text-green-300 transition-colors text-base">{song.title}</div>
                    <div className="text-gray-400 text-sm truncate group-hover:text-gray-300 transition-colors">{song.artist} <span className="mx-1 text-gray-600">•</span> {song.album}</div>
                  </div>
                  <div className="flex flex-col items-end ml-2">
                    <span className="text-gray-500 text-xs mb-1 group-hover:text-gray-400 transition-colors">{song.duration}</span>
                    <button className="w-9 h-9 bg-green-500/80 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg transition-all scale-90 opacity-70 group-hover:scale-100 group-hover:opacity-100">
                      <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                      </svg>
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
    </div>
  );
}

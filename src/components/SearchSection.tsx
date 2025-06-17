import {useEffect, useState} from 'react';
import {Frown, Music, Plus, Search, Youtube} from 'lucide-react';
import {searchApi, type SearchResult} from '../services/api';
import queueService from '../services/queue';
import type {Song} from '../types';

interface SearchSectionProps {
    onSongSelect: (song: Song) => void;
    roomCode?: string;
    userName?: string;
    hasCurrentSong?: boolean;
}

export default function SearchSection({onSongSelect, roomCode, userName, hasCurrentSong}: SearchSectionProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputType, setInputType] = useState<'search' | 'spotify' | 'youtube'>('search');
    const [addedSongs, setAddedSongs] = useState<Set<string>>(new Set());
    const [addingSongs, setAddingSongs] = useState<Set<string>>(new Set());

    const handleSongAdd = async (searchResult: SearchResult) => {
        if (roomCode && userName) {
            try {
                setAddingSongs(prev => new Set(prev).add(searchResult.id));

                await queueService.addSearchResultToQueue(roomCode, searchResult, {id: 'user', name: userName});

                setAddedSongs(prev => new Set(prev).add(searchResult.id));

                setTimeout(() => {
                    setAddedSongs(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(searchResult.id);
                        return newSet;
                    });
                }, 2000);

            } catch (error) {
                console.error('Failed to add song to queue:', error);
            } finally {
                setAddingSongs(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(searchResult.id);
                    return newSet;
                });
            }
        } else {
            const song: Song = {
                id: parseInt(searchResult.id) || Math.random() * 1000000,
                title: searchResult.title,
                artist: searchResult.artist,
                album: searchResult.album,
                duration: searchResult.duration,
                thumbnail: searchResult.thumbnail
            };

            onSongSelect(song);
            setAddedSongs(prev => new Set(prev).add(searchResult.id));

            setTimeout(() => {
                setAddedSongs(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(searchResult.id);
                    return newSet;
                });
            }, 2000);
        }
    };

    const detectInputType = (input: string) => {
        if (input.includes('spotify.com/')) return 'spotify';
        if (input.includes('youtube.com/') || input.includes('youtu.be/')) return 'youtube';
        return 'search';
    };
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            setResults([]);
            setInputType('search');
            return;
        }

        const detectedType = detectInputType(query);
        setInputType(detectedType);
        setIsSearching(true);
        try {
            // Use the search API for all types of queries, including Spotify and YouTube URLs
            const searchResults = await searchApi.searchMusic(query);
            setResults(searchResults);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsSearching(false);
            setInputType('search');
            return;
        }

        setInputType(detectInputType(query));

        const debounceTimer = setTimeout(() => {
            handleSearch({
                preventDefault: () => {
                }
            } as React.FormEvent);
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);
    return (
        <div
            className="flex-1 xl:w-1/3 lg:w-1/2 lg:flex-none flex flex-col justify-between relative z-10 overflow-hidden lg:h-full h-screen pt-16 xl:pt-0">
            <main className={`flex-1 flex flex-col items-center px-4 pt-12 sm:pt-20 h-full ${
                hasCurrentSong ? 'pb-24 lg:pb-32' : 'pb-8 lg:pb-32'
            }`}>
                <h1
                    className={`select-none text-center font-bold tracking-tighter transition-all duration-500 ease-out mb-8 
                      ${isFocused || query ? 'text-2xl text-gray-500' : 'text-5xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600'}`}
                >
                    ListenTogether
                </h1>
                <form onSubmit={handleSearch} className="w-full max-w-lg mb-8">
                    <div
                        className={`relative transition-all duration-300 ease-out ${isFocused ? 'lg:scale-105 scale-100' : 'scale-100'}`}>
                        <div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 blur-lg opacity-0 transition-opacity duration-500 ${isFocused ? 'opacity-30' : ''}`}></div>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={
                                inputType === 'spotify' ? "Spotify link detected!" :
                                    inputType === 'youtube' ? "YouTube link detected!" :
                                        isFocused ? "Search songs, paste Spotify/YouTube links..." : "Search or paste links..."
                            }
                            className="relative w-full pl-12 pr-10 py-4 rounded-xl bg-gray-900/70 shadow-2xl ring-1 ring-white/10 focus:ring-2 focus:ring-green-400/80 outline-none text-lg placeholder-gray-500 transition-all duration-300 backdrop-blur-lg text-gray-200"
                            autoFocus
                        />
                        <div
                            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300">
                            {inputType === 'spotify' ? (
                                <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                                    <span className="text-black text-xs font-bold">♪</span>
                                </div>
                            ) : inputType === 'youtube' ? (
                                <Youtube className="w-5 h-5 text-red-500"/>
                            ) : (
                                <Search className="w-5 h-5 text-gray-500"/>
                            )}
                        </div>
                        {isSearching && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-400"></div>
                            </div>
                        )}
                    </div>
                </form>

                {!query && (
                    <div className="w-full max-w-lg mb-8">
                        <div className="grid grid-cols-1 gap-3">
                            <div
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/30 border border-white/5">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <Search className="w-4 h-4 text-blue-400"/>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-200">Search & add to queue</p>
                                    <p className="text-xs text-gray-500">Type song name, artist, or album</p>
                                </div>
                            </div>

                            <div
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/30 border border-white/5">
                                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center">
                                        <span className="text-black text-xs font-bold">♪</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-200">Add from Spotify</p>
                                    <p className="text-xs text-gray-500">Paste any spotify.com song or playlist URL</p>
                                </div>
                            </div>

                            <div
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/30 border border-white/5">
                                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                    <Youtube className="w-4 h-4 text-red-400"/>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-200">Add from YouTube</p>
                                    <p className="text-xs text-gray-500">Paste any youtube.com or youtu.be URL</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="w-full max-w-lg flex-1 min-h-0 relative">
                    <section
                        className={`h-full overflow-y-auto pb-8 scrollbar-custom ${results.length === 0 ? 'no-fade' : ''}`}>
                        {!query && !isSearching && (
                            <div
                                className="flex flex-col items-center mt-8 text-center opacity-60 select-none animate-fadeIn">
                                <Music className="text-gray-700 mb-3 w-12 h-12"/>
                                <p className="text-sm text-gray-500">Add songs to the queue</p>
                            </div>
                        )}
                        {query && results.length === 0 && !isSearching && (
                            <div
                                className="flex flex-col items-center mt-12 text-center opacity-70 select-none animate-fadeIn">
                                <Frown className="w-12 h-12 text-gray-600"/>
                                <p className="text-lg text-gray-400 font-medium mt-4">No vibes found for "{query}"</p>
                                <p className="text-sm text-gray-600">Try a different tune.</p>
                            </div>
                        )}
                        {results.length > 0 && (<ul className="space-y-2 w-full">
                            {results.map((result, idx) => (
                                <li
                                    key={result.id}
                                    className="relative flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-900/40 to-gray-800/40 hover:from-gray-800/60 hover:to-gray-700/60 transition-all duration-300 group backdrop-blur-xl border border-white/5 hover:border-green-500/30 cursor-pointer overflow-hidden"
                                    style={{animation: `slideUpItem 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${idx * 80}ms both`}}
                                    onClick={() => handleSongAdd(result)}
                                >
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                                    <div
                                        className={`relative w-11 h-11 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 flex-shrink-0 border border-white/10 ${inputType === 'spotify' ? 'bg-gradient-to-br from-green-600/30 to-green-800/30' :
                                            inputType === 'youtube' ? 'bg-gradient-to-br from-red-600/30 to-red-800/30' :
                                                'bg-gradient-to-br from-gray-700/80 to-gray-900/80'
                                        }`}>
                                        {inputType === 'spotify' ? (
                                            <div
                                                className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                                                <span className="text-black text-xs font-bold">♪</span>
                                            </div>
                                        ) : inputType === 'youtube' ? (
                                            <Youtube
                                                className="text-red-400 w-5 h-5 group-hover:text-red-300 transition-colors"/>
                                        ) : result.thumbnail ? (
                                            <img
                                                src={result.thumbnail}
                                                alt={`${result.title} by ${result.artist}`}
                                                className="w-full h-full object-cover rounded-xl"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                    if (fallback) fallback.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        {!result.thumbnail && inputType === 'search' && (
                                            <Music
                                                className="text-green-400/80 w-5 h-5 group-hover:text-green-400 transition-colors"/>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <h3 className="font-medium text-gray-100 truncate group-hover:text-white transition-colors text-sm leading-tight mb-1">
                                            {result.title}
                                        </h3>
                                        <div
                                            className="flex items-center text-gray-400 text-xs space-x-2 truncate group-hover:text-gray-300 transition-colors">
                                            <span className="truncate font-medium">{result.artist}</span>
                                            <span className="text-gray-600 opacity-60">•</span>
                                            <span className="truncate opacity-80">{result.album}</span>
                                            {inputType !== 'search' && (
                                                <>
                                                    <span className="text-gray-600 opacity-60">•</span>
                                                    <span
                                                        className={`text-xs font-medium ${inputType === 'spotify' ? 'text-green-400' : 'text-red-400'
                                                        }`}>
                                                        {inputType === 'spotify' ? 'Spotify' : 'YouTube'}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span
                                            className="text-gray-500 text-xs font-mono tracking-wide group-hover:text-gray-400 transition-colors">
                                            {result.duration}
                                        </span>
                                        <button
                                            className={`relative w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 border ${addedSongs.has(result.id)
                                                ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/25'
                                                : 'bg-white/10 hover:bg-green-500 border-white/20 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/25'
                                            } group/button`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSongAdd(result);
                                            }} disabled={addedSongs.has(result.id) || addingSongs.has(result.id)}
                                        >
                                            {addingSongs.has(result.id) ? (
                                                <div
                                                    className="w-3.5 h-3.5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"/>
                                            ) : (
                                                <Plus
                                                    className={`w-3.5 h-3.5 transition-colors ${addedSongs.has(result.id)
                                                        ? 'text-black'
                                                        : 'text-gray-300 group-hover/button:text-black'
                                                    }`}/>
                                            )}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>)}
                    </section>

                    {results.length > 0 && (
                        <div
                            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10"></div>
                    )}
                </div>
            </main>
        </div>
    );
}

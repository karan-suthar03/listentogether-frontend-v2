import {Music, Search, Users} from 'lucide-react';

type DesktopTab = 'search' | 'room';
type MobileTab = 'search' | 'queue' | 'room';

interface NavigationProps {
    activeTab: DesktopTab | MobileTab;
    onTabChange: (tab: DesktopTab | MobileTab) => void;
    isMobile?: boolean;
    queueCount?: number;
}

export default function Navigation({activeTab, onTabChange, isMobile = false, queueCount = 0}: NavigationProps) {
    if (isMobile) {
        return (
            <div className="lg:hidden fixed top-4 left-1/2 transform -translate-x-1/2 z-30">
                <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl border border-white/10 p-1 shadow-2xl">
                    <div className="flex space-x-1">
                        <button
                            onClick={() => onTabChange('search')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === 'search'
                                    ? 'bg-green-500 text-black shadow-lg shadow-green-500/25'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <Search className="w-4 h-4"/>
                            Search
                        </button>
                        <button
                            onClick={() => onTabChange('queue')}
                            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === 'queue'
                                    ? 'bg-green-500 text-black shadow-lg shadow-green-500/25'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <Music className="w-4 h-4"/>
                            Queue
                            {queueCount > 0 && (
                                <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                                    activeTab === 'queue'
                                        ? 'bg-black/20 text-black'
                                        : 'bg-green-500/20 text-green-400'
                                }`}>
                                    {queueCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => onTabChange('room')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === 'room'
                                    ? 'bg-green-500 text-black shadow-lg shadow-green-500/25'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <Users className="w-4 h-4"/>
                            Room
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="hidden lg:flex xl:hidden fixed top-4 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl border border-white/10 p-1 shadow-2xl">
                <div className="flex space-x-1">
                    <button
                        onClick={() => onTabChange('search')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === 'search'
                                ? 'bg-green-500 text-black shadow-lg shadow-green-500/25'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <Search className="w-4 h-4"/>
                        Search
                    </button>
                    <button
                        onClick={() => onTabChange('room')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === 'room'
                                ? 'bg-green-500 text-black shadow-lg shadow-green-500/25'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <Users className="w-4 h-4"/>
                        Room
                    </button>
                </div>
            </div>
        </div>
    );
}

export type {DesktopTab};

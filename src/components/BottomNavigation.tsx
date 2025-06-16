import { Search, List, Users } from 'lucide-react';

export type MobileTab = 'search' | 'queue' | 'room';

interface BottomNavigationProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  queueCount?: number;
}

export default function BottomNavigation({ activeTab, onTabChange, queueCount = 0 }: BottomNavigationProps) {
  const tabs = [
    {
      id: 'search' as MobileTab,
      label: 'Search',
      icon: Search,
    },
    {
      id: 'queue' as MobileTab,
      label: 'Queue',
      icon: List,
      badge: queueCount > 0 ? queueCount : undefined,
    },
    {
      id: 'room' as MobileTab,
      label: 'Room',
      icon: Users,
    },
  ];

  return (
    <div className="lg:hidden fixed left-0 right-0 bottom-0 z-10 bg-gray-900/95 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-green-400 bg-green-500/10'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-all duration-200 ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                isActive ? 'text-green-400' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-green-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

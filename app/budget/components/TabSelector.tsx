'use client';

import { useTheme } from '@/contexts/theme-context';

export type TabType = 'vue' | 'bilan' | 'correctifs' | 'analyse';

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'vue', label: 'Vue' },
  { id: 'bilan', label: 'Bilan' },
  { id: 'correctifs', label: 'Correctifs' },
  { id: 'analyse', label: 'Analyse' },
];

export function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-1 shadow-sm mb-4 flex border overflow-x-auto animate-fadeIn" 
      style={{ ...cardStyle, animationDelay: '100ms' }}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button 
            key={tab.id} 
            onClick={() => onTabChange(tab.id)} 
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]" 
            style={{
              ...(isActive 
                ? { 
                    background: theme.colors.primary, 
                    color: theme.colors.textOnPrimary,
                    boxShadow: `0 2px 10px ${theme.colors.primary}40`
                  } 
                : { 
                    color: theme.colors.textSecondary 
                  }
              ),
              animationDelay: `${index * 50}ms`
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
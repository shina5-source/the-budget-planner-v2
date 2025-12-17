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
    <div className="backdrop-blur-sm rounded-2xl p-1 shadow-sm mb-4 flex border overflow-x-auto" style={cardStyle}>
      {tabs.map((tab) => (
        <button 
          key={tab.id} 
          onClick={() => onTabChange(tab.id)} 
          className="flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all whitespace-nowrap" 
          style={activeTab === tab.id 
            ? { background: theme.colors.primary, color: theme.colors.textOnPrimary } 
            : { color: theme.colors.textSecondary }
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
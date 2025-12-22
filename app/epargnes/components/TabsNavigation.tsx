'use client';

import { useTheme } from '@/contexts/theme-context';
import { useMemo } from 'react';

type TabType = 'resume' | 'mensuel' | 'analyse' | 'historique';

interface Tab {
  id: TabType;
  label: string;
  emoji?: string;
}

interface TabsNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: Tab[] = [
  { id: 'resume', label: 'Résumé', emoji: '📊' },
  { id: 'mensuel', label: 'Mensuel', emoji: '📅' },
  { id: 'analyse', label: 'Analyse', emoji: '📈' },
  { id: 'historique', label: 'Historique', emoji: '📜' }
];

export default function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = useMemo(() => ({ 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  }), [theme.colors.cardBackground, theme.colors.cardBorder]);

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-1 shadow-sm mb-4 flex border animate-fadeIn"
      style={{ ...cardStyle, animationDelay: '0.2s' }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button 
            key={tab.id} 
            onClick={() => onTabChange(tab.id)} 
            className="flex-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1"
            style={isActive 
              ? { 
                  background: theme.colors.primary, 
                  color: theme.colors.textOnPrimary,
                  transform: 'scale(1.02)',
                  boxShadow: `0 4px 12px ${theme.colors.primary}40`
                } 
              : { 
                  color: theme.colors.textSecondary,
                  background: 'transparent'
                }
            }
          >
            <span className="hidden sm:inline">{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
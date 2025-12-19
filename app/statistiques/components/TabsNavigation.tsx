'use client';

import { useTheme } from '@/contexts/theme-context';
import { TabType } from './types';

interface TabsNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'resume', label: 'Résumé' },
  { id: 'revenus', label: 'Revenus' },
  { id: 'factures', label: 'Factures' },
  { id: 'depenses', label: 'Dépenses' },
  { id: 'epargnes', label: 'Épargnes' },
  { id: 'evolution', label: 'Évolution' },
  { id: 'calendrier', label: '📅' },
  { id: 'flux', label: '💸' },
  { id: 'objectifs', label: '🎯' }
];

export default function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  const { theme } = useTheme();

  return (
    <div 
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'scroll',
        paddingBottom: '8px',
        marginBottom: '16px',
        scrollbarWidth: 'none'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: isActive ? theme.colors.primary : `${theme.colors.primary}15`,
              color: isActive ? '#ffffff' : theme.colors.primary,
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isActive ? `0 4px 12px ${theme.colors.primary}40` : 'none'
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
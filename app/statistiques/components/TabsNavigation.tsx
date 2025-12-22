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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <>
      <style jsx global>{`
        @keyframes tab-glow-stats {
          0%, 100% { box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 4px 20px rgba(139, 92, 246, 0.5); }
        }
        @keyframes emoji-pulse-stats {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .animate-tab-glow-stats {
          animation: tab-glow-stats 2s ease-in-out infinite;
        }
        .animate-emoji-pulse-stats {
          animation: emoji-pulse-stats 2s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="backdrop-blur-sm rounded-2xl p-1 shadow-sm mb-4 flex border overflow-x-auto"
        style={{ 
          background: theme.colors.cardBackground, 
          borderColor: theme.colors.cardBorder
        }}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isEmoji = ['📅', '💸', '🎯'].includes(tab.label);
          
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] ${isActive ? 'animate-tab-glow-stats' : ''}`}
              style={{
                background: isActive ? theme.colors.primary : 'transparent',
                color: isActive ? (theme.colors.textOnPrimary || '#ffffff') : theme.colors.textSecondary,
                boxShadow: isActive ? `0 2px 10px ${theme.colors.primary}40` : 'none',
                minWidth: isEmoji ? '36px' : 'auto'
              }}
            >
              {isEmoji && isActive ? (
                <span className="animate-emoji-pulse-stats inline-block">{tab.label}</span>
              ) : (
                tab.label
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
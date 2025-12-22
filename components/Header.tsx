"use client";

import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';

interface HeaderProps {
  onMenuClick: () => void;
  onThemeClick: () => void;
}

export default function Header({ onMenuClick, onThemeClick }: HeaderProps) {
  const { theme, toggleDarkMode, isDarkMode } = useTheme();

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[999]"
      style={{ backgroundColor: theme.colors.secondary }}
    >
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Bouton menu à gauche */}
        <button
          onClick={onMenuClick}
          className="p-2 relative z-[1000]"
          type="button"
        >
          <Menu className="w-5 h-5" style={{ color: theme.colors.primary }} />
        </button>

        {/* Titre au centre (absolute pour être vraiment centré) */}
        <h1 
          className="text-sm font-medium absolute left-1/2 -translate-x-1/2"
          style={{ color: theme.colors.primary }}
        >
          The Budget Planner
        </h1>

        <div className="flex items-center gap-2">
          {/* Bouton thème */}
          <button
            onClick={onThemeClick}
            className="p-2 rounded-lg transition-all"
            style={{ 
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.colors.primary}20`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Changer le thème"
          >
            <span className="text-base">{theme.emoji}</span>
          </button>

          {/* Bouton Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg transition-all"
            style={{ 
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.colors.primary}20`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Basculer le mode sombre"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" style={{ color: theme.colors.primary }} />
            ) : (
              <Moon className="w-5 h-5" style={{ color: theme.colors.primary }} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
"use client";

import { Menu } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';

interface HeaderProps {
  onMenuClick: () => void;
  onThemeClick: () => void;
}

export default function Header({ onMenuClick, onThemeClick }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-[#5C1E2A]">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Bouton menu à gauche */}
        <button
          onClick={onMenuClick}
          className="p-2 relative z-[1000]"
          type="button"
        >
          <Menu className="w-5 h-5 text-[#D4AF37]" />
        </button>

        {/* Titre au centre */}
        <h1 className="text-sm font-medium text-[#D4AF37]">The Budget Planner</h1>

        {/* Bouton thème à droite */}
        <button
          onClick={onThemeClick}
          className="p-2 rounded-lg hover:bg-[#D4AF37]/20 transition-all"
          title="Changer le thème"
        >
          <span className="text-base">{theme.emoji}</span>
        </button>
      </div>
    </header>
  );
}

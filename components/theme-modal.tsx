'use client';

import React from 'react';
import { Check, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { getAllThemes, Theme, ThemeKey } from '../lib/themes';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeModal({ isOpen, onClose }: ThemeModalProps) {
  const { theme, themeKey, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const allThemes = getAllThemes();

  const handleSelectTheme = (key: ThemeKey) => {
    setTheme(key);
  };

  const pageTitleStyle = "text-lg font-medium text-[#D4AF37]";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-40 p-4 overflow-y-auto">
      <div className="bg-[#8B4557] rounded-2xl p-4 w-full max-w-md border border-[#D4AF37]/40 my-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className={pageTitleStyle}>Personnalisation</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-[#D4AF37]" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Toggle Mode sombre */}
          <div 
            onClick={toggleDarkMode}
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isDarkMode 
                ? 'bg-gray-900/50 border-[#D4AF37]' 
                : 'bg-[#722F37]/30 border-[#D4AF37]/30 hover:border-[#D4AF37]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDarkMode ? 'bg-indigo-500/30' : 'bg-amber-500/30'
              }`}>
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-indigo-300" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-[#D4AF37] text-sm">Mode sombre</p>
                <p className="text-[10px] text-[#D4AF37]/60">
                  {isDarkMode ? 'Activé' : 'Désactivé'}
                </p>
              </div>
            </div>
            <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
              isDarkMode ? 'bg-[#D4AF37]' : 'bg-[#722F37]/50'
            }`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
          </div>

          <p className="text-xs font-medium text-[#D4AF37]">Thèmes de couleurs</p>

          <div className="grid grid-cols-2 gap-3">
            {allThemes.map((t) => (
              <ThemeCard
                key={t.key}
                theme={t}
                isSelected={themeKey === t.key}
                onSelect={() => handleSelectTheme(t.key)}
              />
            ))}
          </div>

          <p className="text-[10px] text-center text-[#D4AF37]/60">
            Les préférences sont sauvegardées automatiquement 💾
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium"
            >
              Annuler
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
}

function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`relative rounded-xl overflow-hidden transition-all duration-200 p-3 ${
        isSelected
          ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#8B4557] shadow-lg scale-[1.02]'
          : 'hover:shadow-md hover:scale-[1.01] border border-[#D4AF37]/30'
      }`}
      style={{
        background: `linear-gradient(135deg, ${theme.colors.backgroundGradientFrom}, ${theme.colors.backgroundGradientTo})`,
      }}
    >
      {isSelected && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      <div className="flex gap-1 mb-2">
        <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: theme.colors.primary }} />
        <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: theme.colors.secondary }} />
        <div className="w-6 h-6 rounded-lg" style={{ background: `linear-gradient(135deg, ${theme.colors.gradientFrom}, ${theme.colors.gradientTo})` }} />
      </div>

      <div className="text-left">
        <span className="text-xs font-medium text-gray-700">{theme.emoji} {theme.name}</span>
      </div>
    </button>
  );
}

export default ThemeModal;
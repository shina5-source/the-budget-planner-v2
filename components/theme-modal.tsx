'use client';

import React, { useState, useEffect } from 'react';
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
  
  // Local state to track pending theme selection
  const [pendingThemeKey, setPendingThemeKey] = useState<ThemeKey>(themeKey);

  // Reset local state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setPendingThemeKey(themeKey);
    }
  }, [isOpen, themeKey]);

  const handleSelectTheme = (key: ThemeKey) => {
    setPendingThemeKey(key);
  };

  const handleValidate = () => {
    setTheme(pendingThemeKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-40 p-4 overflow-y-auto">
      <div 
        className="rounded-2xl p-4 w-full max-w-md border my-20"
        style={{ 
          backgroundColor: theme.colors.secondaryLight,
          borderColor: `${theme.colors.primary}40`
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-lg font-medium"
            style={{ color: theme.colors.primary }}
          >
            Personnalisation
          </h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5" style={{ color: theme.colors.primary }} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Toggle Mode sombre */}
          <div 
            onClick={toggleDarkMode}
            className="flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all"
            style={{
              backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.5)' : `${theme.colors.secondary}30`,
              borderColor: isDarkMode ? theme.colors.primary : `${theme.colors.primary}30`
            }}
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
                <p 
                  className="font-medium text-sm"
                  style={{ color: theme.colors.primary }}
                >
                  Mode sombre
                </p>
                <p 
                  className="text-[10px]"
                  style={{ color: `${theme.colors.primary}60` }}
                >
                  {isDarkMode ? 'Activé' : 'Désactivé'}
                </p>
              </div>
            </div>
            <div 
              className="w-12 h-7 rounded-full p-1 transition-colors"
              style={{ backgroundColor: isDarkMode ? theme.colors.primary : `${theme.colors.secondary}50` }}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
          </div>

          <p 
            className="text-xs font-medium"
            style={{ color: theme.colors.primary }}
          >
            Thèmes de couleurs
          </p>

          <div className="grid grid-cols-2 gap-3">
            {allThemes.map((t) => (
              <ThemeCard
                key={t.key}
                theme={t}
                currentTheme={theme}
                isSelected={pendingThemeKey === t.key}
                onSelect={() => handleSelectTheme(t.key)}
              />
            ))}
          </div>

          <p 
            className="text-[10px] text-center"
            style={{ color: `${theme.colors.primary}60` }}
          >
            Les préférences sont sauvegardées automatiquement 💾
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="flex-1 py-3 border rounded-xl font-medium"
              style={{ 
                borderColor: theme.colors.primary,
                color: theme.colors.primary
              }}
            >
              Annuler
            </button>
            <button
              onClick={handleValidate}
              className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.secondary
              }}
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
  currentTheme: Theme;
  isSelected: boolean;
  onSelect: () => void;
}

function ThemeCard({ theme, currentTheme, isSelected, onSelect }: ThemeCardProps) {
  // Use the 'light' palette for the preview card
  const displayColors = theme.colors.light;

  return (
    <button
      onClick={onSelect}
      className={`relative rounded-xl overflow-hidden transition-all duration-200 p-3 ${
        isSelected
          ? 'shadow-lg scale-[1.02]'
          : 'hover:shadow-md hover:scale-[1.01]'
      }`}
      style={{
        background: `linear-gradient(135deg, ${displayColors.backgroundGradientFrom}, ${displayColors.backgroundGradientTo})`,
        border: isSelected ? `2px solid ${currentTheme.colors.primary}` : `1px solid ${currentTheme.colors.primary}30`,
        boxShadow: isSelected ? `0 0 0 2px ${currentTheme.colors.secondaryLight}, 0 0 0 4px ${currentTheme.colors.primary}` : undefined
      }}
    >
      {isSelected && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: displayColors.primary }}
        >
          <Check className="w-3 h-3" style={{ color: displayColors.textOnPrimary }} />
        </div>
      )}

      <div className="flex gap-1 mb-2">
        <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: displayColors.primary }} />
        <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: displayColors.secondary }} />
        <div className="w-6 h-6 rounded-lg" style={{ background: `linear-gradient(135deg, ${displayColors.gradientFrom}, ${displayColors.gradientTo})` }} />
      </div>

      <div className="text-left">
        <span className="text-xs font-medium text-gray-700">{theme.emoji} {theme.name}</span>
      </div>
    </button>
  );
}

export default ThemeModal;
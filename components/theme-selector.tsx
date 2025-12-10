'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { getAllThemes, Theme, ThemeKey } from '../lib/themes';

interface ThemeSelectorProps {
  variant?: 'button' | 'inline';
}

export function ThemeSelector({ variant = 'button' }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, themeKey, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const allThemes = getAllThemes();

  // --- LOGIC FIX: Add pending state for theme selection ---
  const [pendingThemeKey, setPendingThemeKey] = useState<ThemeKey>(themeKey);

  useEffect(() => {
    setMounted(true);
    // Reset pending theme when the modal is opened or the global theme changes
    if (isOpen) {
      setPendingThemeKey(themeKey);
    }
  }, [isOpen, themeKey]);

  const handleSelectTheme = (key: ThemeKey) => {
    setPendingThemeKey(key);
  };

  const handleValidate = () => {
    setTheme(pendingThemeKey);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  // --- STYLE FIX: Use dynamic theme colors ---
  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[1000] p-4 overflow-y-auto">
      <div 
        className="rounded-2xl p-4 w-full max-w-md border my-20"
        style={{
          backgroundColor: theme.colors.secondaryLight,
          borderColor: theme.colors.cardBorder
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium" style={{ color: theme.colors.primary }}>
            Personnalisation
          </h2>
          <button onClick={handleCancel} className="p-1">
            <X className="w-5 h-5" style={{ color: theme.colors.primary }} />
          </button>
        </div>

        <div className="space-y-4">
          <div 
            onClick={toggleDarkMode}
            className="flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all"
            style={{
              backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.5)' : theme.colors.cardBackground,
              borderColor: isDarkMode ? theme.colors.primary : theme.colors.cardBorder
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
                <p className="font-medium text-sm" style={{ color: theme.colors.textPrimary }}>
                  Mode sombre
                </p>
                <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>
                  {isDarkMode ? 'Activé' : 'Désactivé'}
                </p>
              </div>
            </div>
            <div 
              className="w-12 h-7 rounded-full p-1 transition-colors"
              style={{ backgroundColor: isDarkMode ? theme.colors.primary : theme.colors.secondaryLight }}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
          </div>

          <p className="text-xs font-medium" style={{ color: theme.colors.textPrimary }}>
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

          <p className="text-[10px] text-center" style={{ color: theme.colors.textSecondary }}>
            Les préférences sont sauvegardées automatiquement 💾
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCancel}
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
                color: theme.colors.textOnPrimary
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

  if (variant === 'button') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-opacity-20"
          style={{backgroundColor: `${theme.colors.primary}20`}}
          title="Changer le thème"
        >
          <span className="text-base">{theme.emoji}</span>
        </button>

        {isOpen && mounted && createPortal(modalContent, document.body)}
      </>
    );
  }

  // --- Inline Variant Styling ---
  return (
    <div className="space-y-4">
      <div 
        onClick={toggleDarkMode}
        className="flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all"
        style={{
            backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.5)' : theme.colors.cardBackground,
            borderColor: isDarkMode ? theme.colors.primary : theme.colors.cardBorder
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
            <p className="font-medium text-sm" style={{ color: theme.colors.textPrimary }}>
              Mode sombre
            </p>
            <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>
              {isDarkMode ? 'Activé' : 'Désactivé'}
            </p>
          </div>
        </div>
        <div 
          className="w-12 h-7 rounded-full p-1 transition-colors"
          style={{ backgroundColor: isDarkMode ? theme.colors.primary : theme.colors.secondaryLight }}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
            isDarkMode ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </div>
      </div>

      <p className="text-xs font-medium" style={{ color: theme.colors.textPrimary }}>
        Thèmes de couleurs
      </p>

      <div className="grid grid-cols-2 gap-3">
        {allThemes.map((t) => (
          <ThemeCard
            key={t.key}
            theme={t}
            currentTheme={theme}
            isSelected={themeKey === t.key}
            onSelect={() => handleSelectTheme(t.key)}
          />
        ))}
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
      className={`relative rounded-xl overflow-hidden transition-all duration-200 p-3 text-left ${
        isSelected
          ? 'ring-2 shadow-lg scale-[1.02]'
          : 'hover:shadow-md hover:scale-[1.01] border'
      }`}
      style={{
        background: `linear-gradient(135deg, ${displayColors.backgroundGradientFrom}, ${displayColors.backgroundGradientTo})`,
        borderColor: isSelected ? currentTheme.colors.primary : displayColors.cardBorder,
        ringColor: currentTheme.colors.primary,
        '--tw-ring-offset-color': currentTheme.colors.secondaryLight // For ring-offset color
      } as React.CSSProperties}
    >
      {/* --- CHECKMARK FIX --- */}
      {isSelected && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: displayColors.primary, color: displayColors.textOnPrimary }}
        >
          <Check className="w-3 h-3" strokeWidth={3} />
        </div>
      )}

      <div className="flex gap-1 mb-2">
        <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: displayColors.primary }} />
        <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: displayColors.secondary }} />
        <div className="w-6 h-6 rounded-lg" style={{ background: `linear-gradient(135deg, ${displayColors.gradientFrom}, ${displayColors.gradientTo})` }} />
      </div>

      <div>
        <span className="text-xs font-medium" style={{color: displayColors.textPrimary}}>{theme.emoji} {theme.name}</span>
      </div>
    </button>
  );
}

export default ThemeSelector;
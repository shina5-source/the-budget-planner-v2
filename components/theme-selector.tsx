'use client';

import React, { useState } from 'react';
import { Palette, Check, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { getAllThemes, Theme, ThemeKey } from '../lib/themes';

interface ThemeSelectorProps {
  variant?: 'button' | 'inline';
}

export function ThemeSelector({ variant = 'button' }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, themeKey, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const allThemes = getAllThemes();

  const handleSelectTheme = (key: ThemeKey) => {
    setTheme(key);
    if (variant === 'button') {
      setIsOpen(false);
    }
  };

  // Version bouton avec modal
  if (variant === 'button') {
    return (
      <>
        {/* Bouton discret - juste l'emoji */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-[#D4AF37]/20 transition-all"
          title="Changer le thème"
        >
          <span className="text-base">{theme.emoji}</span>
        </button>

        {/* Modal de sélection */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="relative bg-[#8B4557] rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col border border-[#D4AF37]/40">
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#D4AF37]/30 bg-[#722F37]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                      <Palette className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-[#D4AF37]">
                        Personnalisation
                      </h2>
                      <p className="text-[10px] text-[#D4AF37]/70">
                        Thème et apparence
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-[#D4AF37]/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-[#D4AF37]" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Toggle Mode Sombre */}
                <div className="mb-6">
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
                        <p className="font-medium text-[#D4AF37] text-sm">
                          Mode sombre
                        </p>
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
                </div>

                {/* Titre thèmes */}
                <p className="text-xs font-medium text-[#D4AF37] mb-3">Thèmes de couleurs</p>

                {/* Liste des thèmes */}
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
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-[#D4AF37]/30 bg-[#722F37]/50">
                <p className="text-[10px] text-center text-[#D4AF37]/60">
                  Les préférences sont sauvegardées automatiquement 💾
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Version inline (pour la page Paramètres)
  return (
    <div className="space-y-4">
      {/* Toggle Mode Sombre */}
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

      {/* Titre */}
      <p className="text-xs font-medium text-[#D4AF37]">Thèmes de couleurs</p>

      {/* Grille des thèmes */}
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
    </div>
  );
}

// Composant carte de thème
interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
}

function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative rounded-xl overflow-hidden transition-all duration-200 p-3
        ${isSelected
          ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#8B4557] shadow-lg scale-[1.02]'
          : 'hover:shadow-md hover:scale-[1.01] border border-[#D4AF37]/30'
        }
      `}
      style={{
        background: `linear-gradient(135deg, ${theme.colors.backgroundGradientFrom}, ${theme.colors.backgroundGradientTo})`,
      }}
    >
      {/* Indicateur de sélection */}
      {isSelected && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Prévisualisation des couleurs */}
      <div className="flex gap-1 mb-2">
        <div
          className="w-6 h-6 rounded-lg"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div
          className="w-6 h-6 rounded-lg"
          style={{ backgroundColor: theme.colors.secondary }}
        />
        <div
          className="w-6 h-6 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.gradientFrom}, ${theme.colors.gradientTo})`,
          }}
        />
      </div>

      {/* Nom du thème */}
      <div className="text-left">
        <span className="text-xs font-medium text-gray-700">
          {theme.emoji} {theme.name}
        </span>
      </div>
    </button>
  );
}

export default ThemeSelector;
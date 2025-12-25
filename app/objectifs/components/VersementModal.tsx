"use client";

import { X, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface VersementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  montant: string;
  onMontantChange: (value: string) => void;
  devise: string;
}

export default function VersementModal({
  isOpen,
  onClose,
  onSubmit,
  montant,
  onMontantChange,
  devise
}: VersementModalProps) {
  const { theme, isDarkMode } = useTheme();

  if (!isOpen) return null;

  const modalStyle = { 
    background: isDarkMode ? theme.colors.cardBackground : theme.colors.secondary, 
    borderColor: theme.colors.cardBorder 
  };
  const inputStyle = { 
    background: isDarkMode ? theme.colors.backgroundGradientFrom : theme.colors.secondaryLight, 
    borderColor: theme.colors.cardBorder, 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  };
  const textStyle = { 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  };
  const buttonOutlineStyle = { 
    borderColor: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary, 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="rounded-2xl p-4 w-full max-w-sm border my-20 shadow-2xl animate-slideUp"
        style={modalStyle}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={textStyle}>Ajouter un versement</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110 hover:bg-white/10"
          >
            <X className="w-5 h-5" style={textStyle} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-2 block" style={textStyle}>
              Montant ({devise})
            </label>
            <input 
              type="number" 
              placeholder="0" 
              value={montant} 
              onChange={(e) => onMontantChange(e.target.value)} 
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
              style={inputStyle}
              autoFocus 
            />
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 py-3 border rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={buttonOutlineStyle}
            >
              Annuler
            </button>
            <button 
              onClick={onSubmit} 
              className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              style={{ 
                background: theme.colors.primary, 
                color: theme.colors.textOnPrimary,
                boxShadow: `0 4px 15px ${theme.colors.primary}40`
              }}
            >
              <Plus className="w-5 h-5" />Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
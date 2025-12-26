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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  if (!isOpen) return null;

  // ✅ PATTERN VALIDÉ - Même style que tous les autres modals
  const modalStyle = { 
    background: theme.colors.secondaryLight, 
    borderColor: `${theme.colors.primary}40`
  };
  
  const inputStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: `${theme.colors.primary}30`, 
    color: theme.colors.textPrimary
  };
  
  const textStyle = { 
    color: theme.colors.primary 
  };

  const buttonOutlineStyle = { 
    borderColor: theme.colors.primary, 
    color: theme.colors.primary 
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="rounded-2xl p-4 w-full max-w-sm border"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium" style={textStyle}>Ajouter un versement</h2>
          <button 
            onClick={onClose} 
            className="p-1"
          >
            <X className="w-5 h-5" style={textStyle} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: `${theme.colors.primary}99` }}>
              Montant ({devise})
            </label>
            <input 
              type="number" 
              placeholder="0" 
              value={montant} 
              onChange={(e) => onMontantChange(e.target.value)} 
              className="w-full rounded-xl px-4 py-2 text-sm border focus:outline-none"
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
              className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                background: theme.colors.primary, 
                color: theme.colors.textOnPrimary
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
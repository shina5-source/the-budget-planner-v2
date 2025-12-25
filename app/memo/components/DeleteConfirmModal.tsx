'use client';

import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemDescription: string;
  itemMontant: string;
  devise: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemDescription,
  itemMontant,
  devise
}: DeleteConfirmModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme, isDarkMode } = useTheme() as any;

  if (!isOpen) return null;

  const modalBackgroundStyle = { 
    background: isDarkMode ? theme.colors.cardBackground : theme.colors.secondary, 
    borderColor: theme.colors.cardBorder 
  };
  
  const textStyle = { 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  };
  
  const textSecondaryStyle = {
    color: isDarkMode ? theme.colors.textSecondary : `${theme.colors.textOnSecondary}99`
  };

  const buttonOutlineStyle = { 
    borderColor: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary, 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="rounded-2xl p-5 w-full max-w-sm border my-20 shadow-2xl animate-fadeInScale"
        style={modalBackgroundStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(239, 68, 68, 0.15)' }}
            >
              <AlertTriangle className="w-6 h-6" style={{ color: '#ef4444' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={textStyle}>
                Supprimer ce mémo ?
              </h2>
              <p className="text-xs" style={textSecondaryStyle}>
                Cette action est irréversible
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
            style={{ background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
          >
            <X className="w-5 h-5" style={textStyle} />
          </button>
        </div>

        {/* Content */}
        <div 
          className="rounded-xl p-4 mb-5"
          style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
        >
          <p className="text-sm font-medium mb-1" style={textStyle}>
            {itemDescription}
          </p>
          <p className="text-lg font-bold" style={{ color: '#ef4444' }}>
            {itemMontant} {devise}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="flex-1 py-3 border rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={buttonOutlineStyle}
          >
            Annuler
          </button>
          <button 
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{ 
              background: '#ef4444', 
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
            }}
          >
            <Trash2 className="w-5 h-5" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
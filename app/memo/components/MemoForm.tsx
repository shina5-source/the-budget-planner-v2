'use client';

import { X, Check, FileText, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface MemoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: { description: string; montant: string };
  onFormChange: (data: { description: string; montant: string }) => void;
  isEditing: boolean;
  monthLabel: string;
  selectedYear: number;
  devise: string;
}

export default function MemoForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  isEditing,
  monthLabel,
  selectedYear,
  devise
}: MemoFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme, isDarkMode } = useTheme() as any;

  if (!isOpen) return null;

  const modalBackgroundStyle = { 
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
  
  const textSecondaryStyle = {
    color: isDarkMode ? theme.colors.textSecondary : `${theme.colors.textOnSecondary}99`
  };

  const buttonOutlineStyle = { 
    borderColor: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary, 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  };

  // Suggestions rapides
  const suggestions = [
    'Anniversaire', 'Abonnement', 'Facture', 'Cadeau', 
    'Vacances', 'Réparation', 'Courses', 'Restaurant'
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="rounded-2xl p-5 w-full max-w-md border my-20 shadow-2xl"
        style={modalBackgroundStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center relative"
              style={{ background: `${theme.colors.primary}20` }}
            >
              <FileText className="w-6 h-6" style={{ color: theme.colors.primary }} />
              {!isEditing && (
                <div 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: theme.colors.primary }}
                >
                  <Sparkles className="w-3 h-3" style={{ color: theme.colors.textOnPrimary }} />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold" style={textStyle}>
                {isEditing ? 'Modifier le' : 'Nouveau'} mémo
              </h2>
              <p className="text-xs" style={textSecondaryStyle}>
                {monthLabel} {selectedYear}
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

        {/* Form */}
        <div className="space-y-4">
          {/* Description */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Description *
            </label>
            <input 
              type="text" 
              value={formData.description} 
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })} 
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
              style={inputStyle} 
              placeholder="Ex: Anniversaire de Maman..." 
            />
            
            {/* Suggestions rapides */}
            {!formData.description && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onFormChange({ ...formData, description: s })}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-200 hover:scale-105"
                    style={{ 
                      background: `${theme.colors.primary}15`, 
                      color: theme.colors.primary 
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Montant */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Montant estimé ({devise})
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.montant} 
                onChange={(e) => onFormChange({ ...formData, montant: e.target.value })} 
                className="w-full rounded-xl px-4 py-3 pr-12 text-lg font-semibold border focus:outline-none transition-all duration-200"
                style={inputStyle} 
                placeholder="0,00" 
              />
              <span 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={textSecondaryStyle}
              >
                {devise}
              </span>
            </div>
            
            {/* Montants rapides */}
            <div className="flex gap-2 mt-2">
              {['10', '25', '50', '100', '200'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onFormChange({ ...formData, montant: m })}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                  style={{ 
                    background: formData.montant === m ? theme.colors.primary : `${theme.colors.primary}15`,
                    color: formData.montant === m ? theme.colors.textOnPrimary : theme.colors.primary
                  }}
                >
                  {m}{devise}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-6">
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
            onClick={onSubmit}
            disabled={!formData.description}
            className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: theme.colors.primary, 
              color: theme.colors.textOnPrimary,
              boxShadow: `0 4px 15px ${theme.colors.primary}40`
            }}
          >
            <Check className="w-5 h-5" />
            {isEditing ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { X, Check, Building, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { CompteBancaire, CompteFormData } from './types';

interface CompteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: CompteFormData;
  onFormChange: (data: CompteFormData) => void;
  editingCompte: CompteBancaire | null;
  devise: string;
}

export default function CompteFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  editingCompte,
  devise
}: CompteFormModalProps) {
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

  return (
    <div 
      className="fixed inset-0 flex items-start justify-center z-50 p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-2xl p-5 w-full max-w-md border mb-20 mt-16 shadow-2xl"
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
              <Building className="w-6 h-6" style={{ color: theme.colors.primary }} />
              {!editingCompte && (
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
                {editingCompte ? 'Modifier' : 'Nouveau'} compte
              </h2>
              <p className="text-xs" style={textSecondaryStyle}>
                Compte bancaire
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
          {/* Nom */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Nom du compte *
            </label>
            <input 
              type="text" 
              placeholder="Ex: CCP La Banque Postale" 
              value={formData.nom} 
              onChange={(e) => onFormChange({ ...formData, nom: e.target.value })} 
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
              style={inputStyle} 
            />
          </div>

          {/* Solde de départ */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Solde de départ ({devise})
            </label>
            <input 
              type="number" 
              placeholder="0" 
              value={formData.soldeDepart} 
              onChange={(e) => onFormChange({ ...formData, soldeDepart: e.target.value })} 
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
              style={inputStyle} 
            />
          </div>

          {/* Compte épargne */}
          <div 
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <span className="text-xs" style={textStyle}>Compte épargne</span>
            </div>
            <button 
              type="button"
              onClick={() => onFormChange({ ...formData, isEpargne: !formData.isEpargne })} 
              className={`w-11 h-6 rounded-full transition-colors ${formData.isEpargne ? '' : 'bg-gray-400'}`}
              style={formData.isEpargne ? { background: theme.colors.primary } : {}}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.isEpargne ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
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
            disabled={!formData.nom}
            className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: theme.colors.primary, 
              color: theme.colors.textOnPrimary,
              boxShadow: `0 4px 15px ${theme.colors.primary}40`
            }}
          >
            <Check className="w-5 h-5" />
            {editingCompte ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}
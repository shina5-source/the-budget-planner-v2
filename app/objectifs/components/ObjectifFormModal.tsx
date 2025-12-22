"use client";

import { X, Check, RefreshCw, Palmtree, Car, Home, Wallet, Gift, Smartphone, GraduationCap, PartyPopper, Gem, Baby, Heart, ShoppingBasket } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface FormData {
  nom: string;
  montantCible: string;
  montantActuel: string;
  couleur: string;
  icone: string;
  dateEcheance: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  type: 'court' | 'long';
  recurrenceActif: boolean;
  recurrenceFrequence: 'mensuel' | 'bimensuel' | 'hebdomadaire';
  recurrenceMontant: string;
  recurrenceJour: string;
}

interface CouleurOption {
  id: string;
  nom: string;
  light: { bg: string; border: string; text: string; progress: string };
  dark: { bg: string; border: string; text: string; progress: string };
}

interface ObjectifFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: FormData;
  onFormChange: (data: Partial<FormData>) => void;
  isEditing: boolean;
  devise: string;
  couleursDisponibles: CouleurOption[];
}

const iconesDisponibles = [
  { id: 'palmtree', nom: 'Voyage', icon: Palmtree },
  { id: 'car', nom: 'Voiture', icon: Car },
  { id: 'home', nom: 'Maison', icon: Home },
  { id: 'wallet', nom: 'Épargne', icon: Wallet },
  { id: 'gift', nom: 'Cadeau', icon: Gift },
  { id: 'smartphone', nom: 'Tech', icon: Smartphone },
  { id: 'graduation', nom: 'Formation', icon: GraduationCap },
  { id: 'party', nom: 'Événement', icon: PartyPopper },
  { id: 'gem', nom: 'Luxe', icon: Gem },
  { id: 'baby', nom: 'Bébé', icon: Baby },
  { id: 'heart', nom: 'Santé', icon: Heart },
  { id: 'shopping', nom: 'Shopping', icon: ShoppingBasket },
];

const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function ObjectifFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  isEditing,
  devise,
  couleursDisponibles
}: ObjectifFormModalProps) {
  const { theme, isDarkMode } = useTheme();

  if (!isOpen) return null;

  // ✅ Styles utilisant les COULEURS DU THÈME (pas de couleurs fixes)
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
          <h2 className="text-lg font-semibold" style={textStyle}>
            {isEditing ? 'Modifier' : 'Nouvel'} objectif
          </h2>
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
              Nom de l&apos;objectif
            </label>
            <input 
              type="text" 
              placeholder="Ex: Voyage Japon, iPhone..." 
              value={formData.nom} 
              onChange={(e) => onFormChange({ nom: e.target.value })} 
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all duration-200"
              style={inputStyle}
            />
          </div>

          {/* Montants */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
                Montant cible ({devise})
              </label>
              <input 
                type="number" 
                placeholder="0" 
                value={formData.montantCible} 
                onChange={(e) => onFormChange({ montantCible: e.target.value })} 
                className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
                style={inputStyle} 
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
                Déjà épargné ({devise})
              </label>
              <input 
                type="number" 
                placeholder="0" 
                value={formData.montantActuel} 
                onChange={(e) => onFormChange({ montantActuel: e.target.value })} 
                className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
                style={inputStyle} 
              />
            </div>
          </div>

          {/* Date échéance */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Date d&apos;échéance (optionnel)
            </label>
            <input 
              type="date" 
              value={formData.dateEcheance} 
              onChange={(e) => onFormChange({ dateEcheance: e.target.value })} 
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
              style={inputStyle} 
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Type d&apos;objectif
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['court', 'long'] as const).map((t) => (
                <button 
                  key={t}
                  type="button"
                  onClick={() => onFormChange({ type: t })} 
                  className="py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 hover:scale-[1.02]"
                  style={formData.type === t 
                    ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } 
                    : inputStyle
                  }
                >
                  {t === 'court' ? '🎯 Court terme' : '🏔️ Long terme'}
                </button>
              ))}
            </div>
          </div>

          {/* Priorité */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Priorité
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['haute', 'moyenne', 'basse'] as const).map((p) => (
                <button 
                  key={p}
                  type="button"
                  onClick={() => onFormChange({ priorite: p })} 
                  className="py-2.5 rounded-xl text-xs font-medium border transition-all duration-200 hover:scale-[1.02]"
                  style={formData.priorite === p 
                    ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } 
                    : inputStyle
                  }
                >
                  {p === 'haute' ? '🔴 Haute' : p === 'moyenne' ? '🟠 Moyenne' : '🟢 Basse'}
                </button>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Couleur
            </label>
            <div className="grid grid-cols-4 gap-2">
              {couleursDisponibles.map((couleurOption) => {
                const displayColor = isDarkMode ? couleurOption.dark : couleurOption.light;
                const isSelected = formData.couleur === couleurOption.id;
                return (
                  <button 
                    key={couleurOption.id}
                    type="button"
                    onClick={() => onFormChange({ couleur: couleurOption.id })} 
                    className="h-12 rounded-xl border-2 transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: displayColor.bg,
                      borderColor: isSelected ? theme.colors.primary : displayColor.border,
                      boxShadow: isSelected ? `0 0 0 3px ${theme.colors.primary}40` : 'none'
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Icône */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Icône
            </label>
            <div className="grid grid-cols-6 gap-2">
              {iconesDisponibles.map((icone) => { 
                const IconComp = icone.icon;
                const isSelected = formData.icone === icone.id;
                return (
                  <button 
                    key={icone.id}
                    type="button"
                    onClick={() => onFormChange({ icone: icone.id })} 
                    className="h-11 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105"
                    style={isSelected 
                      ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } 
                      : inputStyle
                    }
                  >
                    <IconComp className="w-5 h-5" />
                  </button>
                ); 
              })}
            </div>
          </div>

          {/* Récurrence */}
          <div 
            className="p-4 rounded-xl border transition-all duration-200" 
            style={formData.recurrenceActif 
              ? { borderColor: theme.colors.primary, background: `${theme.colors.primary}15` } 
              : { ...inputStyle, background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }
            }
          >
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium flex items-center gap-2" style={textStyle}>
                <RefreshCw className="w-4 h-4" />
                Versement récurrent
              </label>
              <button 
                type="button"
                onClick={() => onFormChange({ recurrenceActif: !formData.recurrenceActif })} 
                className="w-12 h-6 rounded-full transition-colors"
                style={{ backgroundColor: formData.recurrenceActif ? '#22c55e' : (isDarkMode ? '#4b5563' : '#d1d5db') }}
              >
                <div 
                  className="w-5 h-5 rounded-full bg-white shadow transition-transform"
                  style={{ transform: formData.recurrenceActif ? 'translateX(24px)' : 'translateX(2px)' }}
                />
              </button>
            </div>
            
            {formData.recurrenceActif && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] block mb-1.5" style={textSecondaryStyle}>Fréquence</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['mensuel', 'bimensuel', 'hebdomadaire'] as const).map((f) => (
                      <button 
                        key={f}
                        type="button"
                        onClick={() => onFormChange({ recurrenceFrequence: f, recurrenceJour: '1' })} 
                        className="py-2 rounded-lg text-[10px] font-medium border transition-all duration-200"
                        style={formData.recurrenceFrequence === f 
                          ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } 
                          : inputStyle
                        }
                      >
                        {f === 'mensuel' ? 'Mensuel' : f === 'bimensuel' ? '2x/mois' : 'Hebdo'}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] block mb-1.5" style={textSecondaryStyle}>
                      Montant ({devise})
                    </label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={formData.recurrenceMontant} 
                      onChange={(e) => onFormChange({ recurrenceMontant: e.target.value })} 
                      className="w-full rounded-xl px-3 py-2.5 text-xs border focus:outline-none transition-all duration-200"
                      style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] block mb-1.5" style={textSecondaryStyle}>
                      {formData.recurrenceFrequence === 'hebdomadaire' ? 'Jour semaine' : 'Jour du mois'}
                    </label>
                    <select 
                      value={formData.recurrenceJour} 
                      onChange={(e) => onFormChange({ recurrenceJour: e.target.value })} 
                      className="w-full rounded-xl px-3 py-2.5 text-xs border focus:outline-none transition-all duration-200"
                      style={inputStyle}
                    >
                      {formData.recurrenceFrequence === 'hebdomadaire' 
                        ? joursSemaine.map((jour, i) => (<option key={i} value={i}>{jour}</option>)) 
                        : Array.from({ length: 31 }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))
                      }
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
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
              className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              style={{ 
                background: theme.colors.primary, 
                color: theme.colors.textOnPrimary,
                boxShadow: `0 4px 15px ${theme.colors.primary}40`
              }}
            >
              <Check className="w-5 h-5" />
              {isEditing ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
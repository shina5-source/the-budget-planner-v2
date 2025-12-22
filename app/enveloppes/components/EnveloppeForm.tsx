'use client';

import { X, Check, Mail, Sparkles, Plus, Star, Lock, TrendingUp, Calendar } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { EnveloppeFormData, ParametresData } from './types';
import { couleursDisponibles, iconesDisponibles, monthsShort } from './constants';

interface EnveloppeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: EnveloppeFormData;
  onFormChange: (data: EnveloppeFormData) => void;
  isEditing: boolean;
  parametres: ParametresData;
  selectedYear: number;
  showAddCategory: boolean;
  setShowAddCategory: (show: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  onAddCategory: () => void;
}

export default function EnveloppeForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  isEditing,
  parametres,
  selectedYear,
  showAddCategory,
  setShowAddCategory,
  newCategoryName,
  setNewCategoryName,
  onAddCategory
}: EnveloppeFormProps) {
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

  const toggleCategorie = (cat: string) => {
    onFormChange({
      ...formData,
      categories: formData.categories.includes(cat)
        ? formData.categories.filter(c => c !== cat)
        : [...formData.categories, cat]
    });
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
              <Mail className="w-6 h-6" style={{ color: theme.colors.primary }} />
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
                {isEditing ? 'Modifier' : 'Nouvelle'} enveloppe
              </h2>
              <p className="text-xs" style={textSecondaryStyle}>
                Budget par catégorie
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
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Nom */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Nom de l&apos;enveloppe *
            </label>
            <input 
              type="text" 
              value={formData.nom} 
              onChange={(e) => onFormChange({ ...formData, nom: e.target.value })} 
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
              style={inputStyle} 
              placeholder="Ex: Courses, Restaurant..." 
            />
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Budget mensuel ({parametres.devise}) *
            </label>
            <input 
              type="number" 
              value={formData.budget} 
              onChange={(e) => onFormChange({ ...formData, budget: e.target.value })} 
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
              style={inputStyle} 
              placeholder="0" 
            />
          </div>

          {/* Options toggles */}
          <div className="space-y-2">
            {/* Favorite */}
            <div 
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" style={{ color: formData.favorite ? '#facc15' : textSecondaryStyle.color }} />
                <span className="text-xs" style={textStyle}>Favorite</span>
              </div>
              <button 
                type="button"
                onClick={() => onFormChange({ ...formData, favorite: !formData.favorite })} 
                className={`w-11 h-6 rounded-full transition-colors ${formData.favorite ? 'bg-yellow-500' : 'bg-gray-400'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.favorite ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Locked */}
            <div 
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" style={{ color: formData.locked ? '#ef4444' : textSecondaryStyle.color }} />
                <span className="text-xs" style={textStyle}>Verrouillable à 100%</span>
              </div>
              <button 
                type="button"
                onClick={() => onFormChange({ ...formData, locked: !formData.locked })} 
                className={`w-11 h-6 rounded-full transition-colors ${formData.locked ? 'bg-red-500' : 'bg-gray-400'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.locked ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Report reste */}
            <div 
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: formData.reportReste ? '#22c55e' : textSecondaryStyle.color }} />
                <span className="text-xs" style={textStyle}>Reporter le reste</span>
              </div>
              <button 
                type="button"
                onClick={() => onFormChange({ ...formData, reportReste: !formData.reportReste })} 
                className={`w-11 h-6 rounded-full transition-colors ${formData.reportReste ? 'bg-green-500' : 'bg-gray-400'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.reportReste ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Budget variable */}
            <div 
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: formData.budgetVariable ? '#3b82f6' : textSecondaryStyle.color }} />
                <span className="text-xs" style={textStyle}>Budget variable par mois</span>
              </div>
              <button 
                type="button"
                onClick={() => onFormChange({ ...formData, budgetVariable: !formData.budgetVariable })} 
                className={`w-11 h-6 rounded-full transition-colors ${formData.budgetVariable ? 'bg-blue-500' : 'bg-gray-400'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.budgetVariable ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Budget variable par mois */}
          {formData.budgetVariable && (
            <div 
              className="p-3 rounded-xl border"
              style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: theme.colors.cardBorder }}
            >
              <p className="text-[10px] mb-2" style={textSecondaryStyle}>
                Budget par mois (laissez vide pour le budget par défaut)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {monthsShort.map((m, i) => {
                  const key = `${selectedYear}-${(i + 1).toString().padStart(2, '0')}`;
                  return (
                    <div key={i}>
                      <label className="text-[9px]" style={textSecondaryStyle}>{m}</label>
                      <input 
                        type="number" 
                        placeholder={formData.budget || '0'} 
                        value={formData.budgetsMensuels[key] || ''} 
                        onChange={(e) => onFormChange({ 
                          ...formData, 
                          budgetsMensuels: { ...formData.budgetsMensuels, [key]: e.target.value } 
                        })} 
                        className="w-full rounded-lg px-2 py-1 text-xs border focus:outline-none"
                        style={inputStyle} 
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Couleur */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>Couleur</label>
            <div className="grid grid-cols-6 gap-2">
              {couleursDisponibles.map((couleur) => (
                <button 
                  key={couleur.id} 
                  type="button"
                  onClick={() => onFormChange({ ...formData, couleur: couleur.id })} 
                  className={`h-8 rounded-lg ${couleur.bg} border-2 transition-all duration-200 hover:scale-110`}
                  style={formData.couleur === couleur.id 
                    ? { borderColor: theme.colors.primary, boxShadow: `0 0 0 2px ${theme.colors.primary}40` } 
                    : { borderColor: 'transparent' }
                  } 
                />
              ))}
            </div>
          </div>

          {/* Icône */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>Icône</label>
            <div className="grid grid-cols-8 gap-1">
              {iconesDisponibles.map((icone) => {
                const IconComp = icone.icon;
                return (
                  <button 
                    key={icone.id} 
                    type="button"
                    onClick={() => onFormChange({ ...formData, icone: icone.id })} 
                    className="h-8 rounded-lg flex items-center justify-center border transition-all duration-200 hover:scale-110"
                    style={formData.icone === icone.id 
                      ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } 
                      : { background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: theme.colors.cardBorder, ...textStyle }
                    }
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catégories */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium" style={textSecondaryStyle}>
                Catégories liées ({formData.categories.length})
              </label>
            </div>
            
            {!showAddCategory ? (
              <button 
                type="button"
                onClick={() => setShowAddCategory(true)} 
                className="w-full mb-2 flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed text-xs transition-all duration-200 hover:scale-[1.02]"
                style={{ borderColor: theme.colors.cardBorder, ...textSecondaryStyle }}
              >
                <Plus className="w-3 h-3" /> Ajouter une catégorie
              </button>
            ) : (
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)} 
                  placeholder="Nouvelle catégorie..." 
                  className="flex-1 rounded-lg px-3 py-2 text-sm border focus:outline-none"
                  style={inputStyle} 
                  autoFocus 
                />
                <button 
                  type="button"
                  onClick={onAddCategory} 
                  className="px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }} 
                  className="px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105"
                  style={{ borderColor: theme.colors.cardBorder, ...textSecondaryStyle }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div 
              className="max-h-40 overflow-y-auto rounded-xl p-2 space-y-1"
              style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              {parametres.categoriesDepenses.map((cat) => (
                <button 
                  key={cat} 
                  type="button"
                  onClick={() => toggleCategorie(cat)} 
                  className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 hover:scale-[1.01]"
                  style={formData.categories.includes(cat) 
                    ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, fontWeight: 500 } 
                    : textStyle
                  }
                >
                  {cat}
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
            disabled={!formData.nom || !formData.budget}
            className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
"use client";

import { useState } from 'react';
import { X, Check, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface PrevisionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  type: 'revenus' | 'factures' | 'depenses' | 'epargnes';
  categorie: string;
  montant: string;
  onCategorieChange: (value: string) => void;
  onMontantChange: (value: string) => void;
  categories: string[];
  isEditing: boolean;
  onAddCategory?: (name: string) => void;
}

export default function PrevisionFormModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  categorie,
  montant,
  onCategorieChange,
  onMontantChange,
  categories,
  isEditing,
  onAddCategory
}: PrevisionFormModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  if (!isOpen) return null;

  const getTypeLabel = () => {
    switch (type) {
      case 'revenus': return 'un revenu';
      case 'factures': return 'une facture';
      case 'depenses': return 'une dépense';
      case 'epargnes': return 'une épargne';
    }
  };

  const getTypeLabelForCategory = () => {
    switch (type) {
      case 'revenus': return 'revenus';
      case 'factures': return 'factures';
      case 'depenses': return 'dépenses';
      case 'epargnes': return 'épargnes';
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && onAddCategory) {
      onAddCategory(newCategoryName.trim());
      onCategorieChange(newCategoryName.trim());
      setNewCategoryName('');
      setShowNewCategory(false);
    }
  };

  const modalStyle = { 
    background: theme.colors.secondary, 
    borderColor: theme.colors.cardBorder 
  };
  const inputStyle = { 
    background: theme.colors.secondaryLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textOnSecondary 
  };
  const textStyle = { color: theme.colors.textOnSecondary };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="rounded-2xl p-5 w-full max-w-md border shadow-2xl animate-slideUp"
        style={modalStyle}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={textStyle}>
            {isEditing ? 'Modifier' : 'Ajouter'} {getTypeLabel()}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110 hover:bg-white/10"
          >
            <X className="w-5 h-5" style={textStyle} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Catégorie */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={textStyle}>
              Catégorie
            </label>
            
            {!showNewCategory ? (
              <div className="flex gap-2">
                <select 
                  value={categorie} 
                  onChange={(e) => onCategorieChange(e.target.value)} 
                  className="flex-1 rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
                  style={inputStyle}
                >
                  <option value="">Sélectionner...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                {/* Bouton + pour ajouter une catégorie */}
                {onAddCategory && (
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    className="p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ 
                      background: theme.colors.primary, 
                      color: theme.colors.textOnPrimary 
                    }}
                    title="Ajouter une catégorie"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder={`Nouvelle catégorie de ${getTypeLabelForCategory()}...`}
                    className="flex-1 rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
                    style={inputStyle}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                    className="p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                    style={{ 
                      background: theme.colors.primary, 
                      color: theme.colors.textOnPrimary 
                    }}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowNewCategory(false); setNewCategoryName(''); }}
                  className="text-xs underline transition-opacity hover:opacity-80"
                  style={textStyle}
                >
                  Annuler et choisir une catégorie existante
                </button>
              </div>
            )}
          </div>

          {/* Montant */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={textStyle}>
              Montant prévu (€)
            </label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={montant} 
              onChange={(e) => onMontantChange(e.target.value)} 
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition-all duration-200"
              style={inputStyle}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button 
              onClick={onClose} 
              className="flex-1 py-3 border rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ borderColor: theme.colors.textOnSecondary, color: theme.colors.textOnSecondary }}
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
              <Check className="w-5 h-5" />
              {isEditing ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from 'react';
import { X, Check, Plus, Wallet, TrendingUp, TrendingDown, Receipt, CreditCard } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import confetti from 'canvas-confetti';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  depuis?: string;
  vers?: string;
  moyenPaiement?: string;
  memo?: string;
  isCredit?: boolean;
  capitalTotal?: string;
  tauxInteret?: string;
  dureeMois?: string;
  dateDebut?: string;
}

interface FormData {
  date: string;
  montant: string;
  type: string;
  categorie: string;
  depuis: string;
  vers: string;
  moyenPaiement: string;
  memo: string;
  isCredit: boolean;
  capitalTotal: string;
  tauxInteret: string;
  dureeMois: string;
  dateDebut: string;
}

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  editingTransaction: Transaction | null;
  types: string[];
  getCategoriesForType: (type: string) => string[];
  getTypeLabelForCategory: (type: string) => string;
  comptes: string[];
  moyensPaiement: string[];
  devise: string;
  onAddCategory: (name: string, type: string) => void;
  onAddCompte: (name: string) => void;
  onAddMoyenPaiement: (name: string) => void;
}

// Configuration des types avec couleurs et icônes
const TYPE_CONFIG: Record<string, { color: string; bgColor: string; icon: React.ElementType; label: string }> = {
  'Revenus': { 
    color: '#22c55e', 
    bgColor: 'rgba(34, 197, 94, 0.2)', 
    icon: TrendingUp, 
    label: 'Revenu' 
  },
  'Factures': { 
    color: '#f97316', 
    bgColor: 'rgba(249, 115, 22, 0.2)', 
    icon: Receipt, 
    label: 'Facture' 
  },
  'Dépenses': { 
    color: '#ff4757', 
    bgColor: 'rgba(255, 71, 87, 0.2)', 
    icon: TrendingDown, 
    label: 'Dépense' 
  },
  'Épargnes': { 
    color: '#3b82f6', 
    bgColor: 'rgba(59, 130, 246, 0.2)', 
    icon: Wallet, 
    label: 'Épargne' 
  }
};

// Types valides (pour filtrer les doublons)
const VALID_TYPES = ['Revenus', 'Factures', 'Dépenses', 'Épargnes'];

export default function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction,
  types,
  getCategoriesForType,
  getTypeLabelForCategory,
  comptes,
  moyensPaiement,
  devise,
  onAddCategory,
  onAddCompte,
  onAddMoyenPaiement
}: TransactionFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme, isDarkMode } = useTheme() as any;

  // Fonction pour obtenir les données initiales du formulaire
  const getInitialFormData = (): FormData => {
    if (editingTransaction) {
      return {
        date: editingTransaction.date,
        montant: editingTransaction.montant,
        type: editingTransaction.type,
        categorie: editingTransaction.categorie,
        depuis: editingTransaction.depuis || '',
        vers: editingTransaction.vers || '',
        moyenPaiement: editingTransaction.moyenPaiement || '',
        memo: editingTransaction.memo || '',
        isCredit: editingTransaction.isCredit || false,
        capitalTotal: editingTransaction.capitalTotal || '',
        tauxInteret: editingTransaction.tauxInteret || '',
        dureeMois: editingTransaction.dureeMois || '',
        dateDebut: editingTransaction.dateDebut || ''
      };
    }
    // CORRECTION: Tous les champs vides sauf la date
    return {
      date: new Date().toISOString().split('T')[0],
      montant: '',  // Vide au lieu de '0.00'
      type: 'Dépenses',
      categorie: '',  // Vide
      depuis: '',
      vers: '',
      moyenPaiement: '',
      memo: '',
      isCredit: false,
      capitalTotal: '',
      tauxInteret: '',
      dureeMois: '',
      dateDebut: ''
    };
  };

  const [formData, setFormData] = useState<FormData>(getInitialFormData);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddCompteDepuis, setShowAddCompteDepuis] = useState(false);
  const [showAddCompteVers, setShowAddCompteVers] = useState(false);
  const [showAddMoyenPaiement, setShowAddMoyenPaiement] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCompteName, setNewCompteName] = useState('');
  const [newMoyenPaiementName, setNewMoyenPaiementName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CORRECTION: Reset form when modal opens (isOpen changes to true)
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      // Reset tous les états d'ajout
      setShowAddCategory(false);
      setShowAddCompteDepuis(false);
      setShowAddCompteVers(false);
      setShowAddMoyenPaiement(false);
      setNewCategoryName('');
      setNewCompteName('');
      setNewMoyenPaiementName('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingTransaction]);

  const currentTypeConfig = useMemo(() => 
    TYPE_CONFIG[formData.type] || TYPE_CONFIG['Dépenses'],
    [formData.type]
  );

  // CORRECTION: Filtrer les types pour n'avoir que les 4 valides sans doublons
  const filteredTypes = useMemo(() => {
    // Utiliser les types valides définis, en vérifiant qu'ils existent dans types passé en props
    return VALID_TYPES.filter(t => types.includes(t));
  }, [types]);

  // ✅ Styles utilisant les COULEURS DU THÈME (exactement comme ObjectifFormModal)
  const modalBackgroundStyle = useMemo(() => ({ 
    background: isDarkMode ? theme.colors.cardBackground : theme.colors.secondary, 
    borderColor: theme.colors.cardBorder 
  }), [isDarkMode, theme.colors.cardBackground, theme.colors.secondary, theme.colors.cardBorder]);
  
  const inputStyle = useMemo(() => ({ 
    background: isDarkMode ? theme.colors.backgroundGradientFrom : theme.colors.secondaryLight, 
    borderColor: theme.colors.cardBorder, 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  }), [isDarkMode, theme.colors.backgroundGradientFrom, theme.colors.secondaryLight, theme.colors.cardBorder, theme.colors.textPrimary, theme.colors.textOnSecondary]);
  
  const textStyle = useMemo(() => ({ 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  }), [isDarkMode, theme.colors.textPrimary, theme.colors.textOnSecondary]);
  
  const textSecondaryStyle = useMemo(() => ({
    color: isDarkMode ? theme.colors.textSecondary : `${theme.colors.textOnSecondary}99`
  }), [isDarkMode, theme.colors.textSecondary, theme.colors.textOnSecondary]);

  const buttonOutlineStyle = useMemo(() => ({ 
    borderColor: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary, 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  }), [isDarkMode, theme.colors.textPrimary, theme.colors.textOnSecondary]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [currentTypeConfig.color, theme.colors.primary, '#fbbf24']
    });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim(), formData.type);
    setFormData({ ...formData, categorie: newCategoryName.trim() });
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleAddCompte = (field: 'depuis' | 'vers') => {
    if (!newCompteName.trim()) return;
    onAddCompte(newCompteName.trim());
    setFormData({ ...formData, [field]: newCompteName.trim() });
    setNewCompteName('');
    setShowAddCompteDepuis(false);
    setShowAddCompteVers(false);
  };

  const handleAddMoyenPaiement = () => {
    if (!newMoyenPaiementName.trim()) return;
    onAddMoyenPaiement(newMoyenPaiementName.trim());
    setFormData({ ...formData, moyenPaiement: newMoyenPaiementName.trim() });
    setNewMoyenPaiementName('');
    setShowAddMoyenPaiement(false);
  };

  const handleSubmit = () => {
    if (!formData.montant || !formData.categorie) return;
    setIsSubmitting(true);
    
    // Confetti pour les revenus
    if (formData.type === 'Revenus' && !editingTransaction) {
      triggerConfetti();
    }
    
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const IconComponent = currentTypeConfig.icon;

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
        {/* Header amélioré */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{ background: currentTypeConfig.bgColor }}
            >
              <IconComponent 
                className="w-5 h-5" 
                style={{ color: currentTypeConfig.color }} 
              />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={textStyle}>
                {editingTransaction ? 'Modifier la' : 'Nouvelle'} transaction
              </h2>
              <p className="text-[10px]" style={textSecondaryStyle}>
                {editingTransaction ? 'Modifiez les détails' : 'Ajoutez une nouvelle entrée'}
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
        <div className="space-y-4">
          {/* Type selector - CORRECTION: Utiliser filteredTypes au lieu de types */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={textSecondaryStyle}>
              Type de transaction
            </label>
            <div className="grid grid-cols-4 gap-2">
              {filteredTypes.map(t => {
                const config = TYPE_CONFIG[t] || TYPE_CONFIG['Dépenses'];
                const Icon = config.icon;
                const isSelected = formData.type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { 
                      setFormData({ ...formData, type: t, categorie: '' }); 
                      setShowAddCategory(false); 
                    }}
                    className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all duration-200 border ${isSelected ? 'scale-[1.02]' : 'opacity-60 hover:opacity-80'}`}
                    style={{ 
                      background: isSelected ? config.bgColor : 'transparent',
                      borderColor: isSelected ? config.color : theme.colors.cardBorder
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                    <span className="text-[10px] font-medium" style={{ color: config.color }}>
                      {config.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Montant */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Montant *
            </label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="0.00" 
                value={formData.montant} 
                onChange={(e) => setFormData({ ...formData, montant: e.target.value })} 
                className="w-full px-4 py-3 pr-10 rounded-xl border text-lg font-semibold focus:outline-none transition-all duration-200"
                style={inputStyle}
              />
              <span 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={textSecondaryStyle}
              >
                {devise}
              </span>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Date
            </label>
            <input 
              type="date" 
              value={formData.date} 
              onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all duration-200"
              style={inputStyle}
            />
          </div>

          {/* Catégorie - Pills cliquables */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Catégorie *
            </label>
            {!showAddCategory ? (
              <div className="flex flex-wrap gap-2">
                {getCategoriesForType(formData.type).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, categorie: c })}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
                    style={formData.categorie === c 
                      ? { background: currentTypeConfig.color, color: '#ffffff', borderColor: currentTypeConfig.color }
                      : { ...inputStyle, background: 'transparent' }
                    }
                  >
                    {c}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowAddCategory(true)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border-2 border-dashed flex items-center gap-1 transition-all duration-200 hover:scale-105"
                  style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
                >
                  <Plus className="w-3 h-3" /> Ajouter
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)} 
                  placeholder={`Nouvelle catégorie ${getTypeLabelForCategory(formData.type)}...`}
                  className="flex-1 px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all duration-200"
                  style={inputStyle}
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={handleAddCategory} 
                  className="px-4 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }} 
                  className="px-3 rounded-xl border transition-all duration-200 hover:scale-105"
                  style={{ borderColor: theme.colors.cardBorder }}
                >
                  <X className="w-4 h-4" style={textSecondaryStyle} />
                </button>
              </div>
            )}
          </div>

          {/* Comptes - 2 colonnes */}
          <div className="grid grid-cols-2 gap-3">
            {/* Depuis */}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
                Depuis
              </label>
              {!showAddCompteDepuis ? (
                <select 
                  value={formData.depuis} 
                  onChange={(e) => { 
                    if (e.target.value === '__ADD__') { 
                      setShowAddCompteDepuis(true); 
                      setFormData({ ...formData, depuis: '' }); 
                    } else {
                      setFormData({ ...formData, depuis: e.target.value }); 
                    }
                  }} 
                  className="w-full px-4 py-3 rounded-xl border text-sm cursor-pointer focus:outline-none transition-all duration-200"
                  style={inputStyle}
                >
                  <option value="">Aucun</option>
                  {comptes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__ADD__">➕ Ajouter...</option>
                </select>
              ) : (
                <div className="flex gap-1">
                  <input 
                    type="text" 
                    value={newCompteName} 
                    onChange={(e) => setNewCompteName(e.target.value)} 
                    placeholder="Compte..."
                    className="flex-1 p-2 rounded-xl border text-xs focus:outline-none"
                    style={inputStyle}
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => handleAddCompte('depuis')} 
                    className="p-2 rounded-xl"
                    style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setShowAddCompteDepuis(false); setNewCompteName(''); }} 
                    className="p-2 rounded-xl border"
                    style={{ borderColor: theme.colors.cardBorder }}
                  >
                    <X className="w-3 h-3" style={textSecondaryStyle} />
                  </button>
                </div>
              )}
            </div>

            {/* Vers */}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
                Vers
              </label>
              {!showAddCompteVers ? (
                <select 
                  value={formData.vers} 
                  onChange={(e) => { 
                    if (e.target.value === '__ADD__') { 
                      setShowAddCompteVers(true); 
                      setFormData({ ...formData, vers: '' }); 
                    } else {
                      setFormData({ ...formData, vers: e.target.value }); 
                    }
                  }} 
                  className="w-full px-4 py-3 rounded-xl border text-sm cursor-pointer focus:outline-none transition-all duration-200"
                  style={inputStyle}
                >
                  <option value="">Aucun</option>
                  {comptes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__ADD__">➕ Ajouter...</option>
                </select>
              ) : (
                <div className="flex gap-1">
                  <input 
                    type="text" 
                    value={newCompteName} 
                    onChange={(e) => setNewCompteName(e.target.value)} 
                    placeholder="Compte..."
                    className="flex-1 p-2 rounded-xl border text-xs focus:outline-none"
                    style={inputStyle}
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => handleAddCompte('vers')} 
                    className="p-2 rounded-xl"
                    style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setShowAddCompteVers(false); setNewCompteName(''); }} 
                    className="p-2 rounded-xl border"
                    style={{ borderColor: theme.colors.cardBorder }}
                  >
                    <X className="w-3 h-3" style={textSecondaryStyle} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Moyen de paiement */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Moyen de paiement
            </label>
            {!showAddMoyenPaiement ? (
              <select 
                value={formData.moyenPaiement} 
                onChange={(e) => { 
                  if (e.target.value === '__ADD__') { 
                    setShowAddMoyenPaiement(true); 
                    setFormData({ ...formData, moyenPaiement: '' }); 
                  } else {
                    setFormData({ ...formData, moyenPaiement: e.target.value }); 
                  }
                }} 
                className="w-full px-4 py-3 rounded-xl border text-sm cursor-pointer focus:outline-none transition-all duration-200"
                style={inputStyle}
              >
                <option value="">Sélectionner...</option>
                {moyensPaiement.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
                <option value="__ADD__">➕ Ajouter...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newMoyenPaiementName} 
                  onChange={(e) => setNewMoyenPaiementName(e.target.value)} 
                  placeholder="Nouveau moyen de paiement..."
                  className="flex-1 px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all duration-200"
                  style={inputStyle}
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={handleAddMoyenPaiement} 
                  className="px-4 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  onClick={() => { setShowAddMoyenPaiement(false); setNewMoyenPaiementName(''); }} 
                  className="px-3 rounded-xl border transition-all duration-200 hover:scale-105"
                  style={{ borderColor: theme.colors.cardBorder }}
                >
                  <X className="w-4 h-4" style={textSecondaryStyle} />
                </button>
              </div>
            )}
          </div>

          {/* Checkbox Crédit avec style amélioré */}
          <div 
            className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.01]"
            style={{ 
              background: formData.isCredit ? 'rgba(168, 85, 247, 0.1)' : (isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
              borderColor: formData.isCredit ? '#a855f7' : theme.colors.cardBorder 
            }}
            onClick={() => setFormData({ ...formData, isCredit: !formData.isCredit })}
          >
            <div 
              className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-200"
              style={{ 
                background: formData.isCredit ? '#a855f7' : 'transparent',
                borderColor: formData.isCredit ? '#a855f7' : theme.colors.cardBorder
              }}
            >
              {formData.isCredit && <Check className="w-3 h-3 text-white" />}
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" style={{ color: formData.isCredit ? '#a855f7' : (isDarkMode ? theme.colors.textSecondary : theme.colors.textOnSecondary) }} />
              <span className="text-sm font-medium" style={{ color: formData.isCredit ? '#a855f7' : (isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary) }}>
                C&apos;est un crédit
              </span>
            </div>
          </div>

          {/* Infos crédit (conditionnel) */}
          {formData.isCredit && (
            <div 
              className="space-y-3 p-4 rounded-xl border animate-fadeIn"
              style={{ background: 'rgba(168, 85, 247, 0.05)', borderColor: '#a855f7' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-purple-500" />
                <p className="text-xs font-semibold text-purple-500">
                  Informations du crédit
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={textSecondaryStyle}>
                    Capital ({devise})
                  </label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.capitalTotal} 
                    onChange={(e) => setFormData({ ...formData, capitalTotal: e.target.value })} 
                    className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-all duration-200"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={textSecondaryStyle}>
                    Taux (%)
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="0.0" 
                    value={formData.tauxInteret} 
                    onChange={(e) => setFormData({ ...formData, tauxInteret: e.target.value })} 
                    className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-all duration-200"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={textSecondaryStyle}>
                    Durée (mois)
                  </label>
                  <input 
                    type="number"
                    placeholder="12" 
                    value={formData.dureeMois} 
                    onChange={(e) => setFormData({ ...formData, dureeMois: e.target.value })} 
                    className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-all duration-200"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={textSecondaryStyle}>
                    Date début
                  </label>
                  <input 
                    type="date" 
                    value={formData.dateDebut} 
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })} 
                    className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-all duration-200"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Memo */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={textSecondaryStyle}>
              Description (optionnel)
            </label>
            <textarea 
              placeholder="Ajouter une note..." 
              value={formData.memo} 
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none transition-all duration-200"
              style={inputStyle}
              rows={2}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-5">
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
            onClick={handleSubmit}
            disabled={!formData.montant || !formData.categorie || isSubmitting}
            className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: theme.colors.primary, 
              color: theme.colors.textOnPrimary
            }}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                {editingTransaction ? 'Modifier' : 'Créer'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
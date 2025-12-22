"use client";

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

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
  const { theme } = useTheme() as any;

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
    return {
      date: new Date().toISOString().split('T')[0],
      montant: '',
      type: 'Dépenses',
      categorie: '',
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

  // Reset form when editingTransaction changes
  useEffect(() => {
    setFormData(getInitialFormData());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTransaction]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddCompteDepuis, setShowAddCompteDepuis] = useState(false);
  const [showAddCompteVers, setShowAddCompteVers] = useState(false);
  const [showAddMoyenPaiement, setShowAddMoyenPaiement] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCompteName, setNewCompteName] = useState('');
  const [newMoyenPaiementName, setNewMoyenPaiementName] = useState('');

  const modalInputStyle = { 
    background: theme.colors.secondaryLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textOnSecondary 
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
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div 
        className="rounded-2xl p-4 w-full max-w-md border mb-20 mt-20"
        style={{ background: theme.colors.secondary, borderColor: theme.colors.cardBorder }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium" style={{ color: theme.colors.textOnSecondary }}>
            {editingTransaction ? 'Modifier la' : 'Nouvelle'} transaction
          </h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5" style={{ color: theme.colors.textOnSecondary }} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
              Date
            </label>
            <input 
              type="date" 
              value={formData.date} 
              onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
              className="w-full rounded-xl px-3 py-2 text-sm border"
              style={modalInputStyle}
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
              Type
            </label>
            <select 
              value={formData.type} 
              onChange={(e) => { 
                setFormData({ ...formData, type: e.target.value, categorie: '' }); 
                setShowAddCategory(false); 
              }} 
              className="w-full rounded-xl px-3 py-2 text-sm border cursor-pointer"
              style={modalInputStyle}
            >
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Montant */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
              Montant ({devise})
            </label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={formData.montant} 
              onChange={(e) => setFormData({ ...formData, montant: e.target.value })} 
              className="w-full rounded-xl px-3 py-2 text-sm border"
              style={modalInputStyle}
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
              Catégorie
            </label>
            {!showAddCategory ? (
              <select 
                value={formData.categorie} 
                onChange={(e) => { 
                  if (e.target.value === '__ADD__') { 
                    setShowAddCategory(true); 
                    setFormData({ ...formData, categorie: '' }); 
                  } else {
                    setFormData({ ...formData, categorie: e.target.value }); 
                  }
                }} 
                className="w-full rounded-xl px-3 py-2 text-sm border cursor-pointer"
                style={modalInputStyle}
              >
                <option value="">Sélectionner...</option>
                {getCategoriesForType(formData.type).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__ADD__">➕ Ajouter une catégorie...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)} 
                  placeholder={`Nouvelle catégorie ${getTypeLabelForCategory(formData.type)}...`}
                  className="flex-1 rounded-xl px-3 py-2 text-sm border"
                  style={modalInputStyle}
                  autoFocus
                />
                <button 
                  onClick={handleAddCategory} 
                  className="px-3 py-2 rounded-xl"
                  style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }} 
                  className="px-3 py-2 rounded-xl border"
                  style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Depuis */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
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
                className="w-full rounded-xl px-3 py-2 text-sm border cursor-pointer"
                style={modalInputStyle}
              >
                <option value="">Aucun</option>
                {comptes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__ADD__">➕ Ajouter un compte...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCompteName} 
                  onChange={(e) => setNewCompteName(e.target.value)} 
                  placeholder="Nouveau compte..."
                  className="flex-1 rounded-xl px-3 py-2 text-sm border"
                  style={modalInputStyle}
                  autoFocus
                />
                <button 
                  onClick={() => handleAddCompte('depuis')} 
                  className="px-3 py-2 rounded-xl"
                  style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setShowAddCompteDepuis(false); setNewCompteName(''); }} 
                  className="px-3 py-2 rounded-xl border"
                  style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Vers */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
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
                className="w-full rounded-xl px-3 py-2 text-sm border cursor-pointer"
                style={modalInputStyle}
              >
                <option value="">Aucun</option>
                {comptes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__ADD__">➕ Ajouter un compte...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCompteName} 
                  onChange={(e) => setNewCompteName(e.target.value)} 
                  placeholder="Nouveau compte..."
                  className="flex-1 rounded-xl px-3 py-2 text-sm border"
                  style={modalInputStyle}
                  autoFocus
                />
                <button 
                  onClick={() => handleAddCompte('vers')} 
                  className="px-3 py-2 rounded-xl"
                  style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setShowAddCompteVers(false); setNewCompteName(''); }} 
                  className="px-3 py-2 rounded-xl border"
                  style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Moyen de paiement */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
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
                className="w-full rounded-xl px-3 py-2 text-sm border cursor-pointer"
                style={modalInputStyle}
              >
                <option value="">Sélectionner...</option>
                {moyensPaiement.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
                <option value="__ADD__">➕ Ajouter un moyen...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newMoyenPaiementName} 
                  onChange={(e) => setNewMoyenPaiementName(e.target.value)} 
                  placeholder="Nouveau moyen de paiement..."
                  className="flex-1 rounded-xl px-3 py-2 text-sm border"
                  style={modalInputStyle}
                  autoFocus
                />
                <button 
                  onClick={handleAddMoyenPaiement} 
                  className="px-3 py-2 rounded-xl"
                  style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setShowAddMoyenPaiement(false); setNewMoyenPaiementName(''); }} 
                  className="px-3 py-2 rounded-xl border"
                  style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Checkbox Crédit */}
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="isCredit" 
              checked={formData.isCredit} 
              onChange={(e) => setFormData({ ...formData, isCredit: e.target.checked })} 
              className="w-5 h-5 rounded accent-purple-500"
            />
            <label htmlFor="isCredit" className="text-xs font-medium" style={{ color: theme.colors.textOnSecondary }}>
              C&apos;est un crédit
            </label>
          </div>

          {/* Infos crédit (conditionnel) */}
          {formData.isCredit && (
            <div 
              className="space-y-3 p-3 rounded-xl border"
              style={{ background: theme.colors.secondaryLight, borderColor: theme.colors.cardBorder }}
            >
              <p className="text-[10px] text-center font-medium" style={{ color: theme.colors.textOnSecondary }}>
                Informations du crédit
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
                    Capital
                  </label>
                  <input 
                    type="number" 
                    value={formData.capitalTotal} 
                    onChange={(e) => setFormData({ ...formData, capitalTotal: e.target.value })} 
                    className="w-full rounded-xl px-3 py-2 text-sm border"
                    style={modalInputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
                    Taux (%)
                  </label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={formData.tauxInteret} 
                    onChange={(e) => setFormData({ ...formData, tauxInteret: e.target.value })} 
                    className="w-full rounded-xl px-3 py-2 text-sm border"
                    style={modalInputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
                    Durée (mois)
                  </label>
                  <input 
                    type="number" 
                    value={formData.dureeMois} 
                    onChange={(e) => setFormData({ ...formData, dureeMois: e.target.value })} 
                    className="w-full rounded-xl px-3 py-2 text-sm border"
                    style={modalInputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
                    Date début
                  </label>
                  <input 
                    type="date" 
                    value={formData.dateDebut} 
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })} 
                    className="w-full rounded-xl px-3 py-2 text-sm border"
                    style={modalInputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Memo */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
              Description
            </label>
            <textarea 
              placeholder="Note optionnelle..." 
              value={formData.memo} 
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })} 
              className="w-full rounded-xl px-3 py-2 text-sm border resize-none"
              style={modalInputStyle}
              rows={2}
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose} 
              className="flex-1 py-3 rounded-xl font-medium border"
              style={{ borderColor: theme.colors.textOnSecondary, color: theme.colors.textOnSecondary }}
            >
              Annuler
            </button>
            <button 
              onClick={handleSubmit} 
              className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
            >
              <Check className="w-5 h-5" />
              {editingTransaction ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface Credit {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  depuis?: string;
  vers?: string;
  memo?: string;
  isCredit?: boolean;
  capitalTotal?: string;
  tauxInteret?: string;
  dureeMois?: string;
  dateDebut?: string;
}

interface CreditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (credit: Omit<Credit, 'id'> & { id?: number }) => void;
  editingCredit: Credit | null;
  comptes: string[];
  devise: string;
  onAddCompte?: (name: string) => void;
}

export default function CreditForm({
  isOpen,
  onClose,
  onSubmit,
  editingCredit,
  comptes,
  devise,
  onAddCompte
}: CreditFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const [formData, setFormData] = useState({
    categorie: '',
    capitalTotal: '',
    tauxInteret: '',
    dureeMois: '',
    montant: '',
    dateDebut: new Date().toISOString().split('T')[0],
    depuis: '',
    memo: ''
  });

  const [showAddCompte, setShowAddCompte] = useState(false);
  const [newCompteName, setNewCompteName] = useState('');

  // Reset form when editing credit changes
  useEffect(() => {
    if (editingCredit) {
      setFormData({
        categorie: editingCredit.categorie || '',
        capitalTotal: editingCredit.capitalTotal || '',
        tauxInteret: editingCredit.tauxInteret || '',
        dureeMois: editingCredit.dureeMois || '',
        montant: editingCredit.montant || '',
        dateDebut: editingCredit.dateDebut || new Date().toISOString().split('T')[0],
        depuis: editingCredit.depuis || '',
        memo: editingCredit.memo || ''
      });
    } else {
      setFormData({
        categorie: '',
        capitalTotal: '',
        tauxInteret: '',
        dureeMois: '',
        montant: '',
        dateDebut: new Date().toISOString().split('T')[0],
        depuis: '',
        memo: ''
      });
    }
    setShowAddCompte(false);
    setNewCompteName('');
  }, [editingCredit, isOpen]);

  // Calcul automatique de la mensualité
  useEffect(() => {
    const capital = parseFloat(formData.capitalTotal) || 0;
    const taux = parseFloat(formData.tauxInteret) || 0;
    const duree = parseInt(formData.dureeMois) || 0;

    if (capital > 0 && duree > 0) {
      const interets = capital * (taux / 100) * (duree / 12);
      const total = capital + interets;
      const mensualite = total / duree;
      setFormData(prev => ({ ...prev, montant: mensualite.toFixed(2) }));
    }
  }, [formData.capitalTotal, formData.tauxInteret, formData.dureeMois]);

  const modalInputStyle = { 
    background: theme.colors.secondaryLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textOnSecondary 
  };

  const handleAddCompte = () => {
    if (!newCompteName.trim() || !onAddCompte) return;
    onAddCompte(newCompteName.trim());
    setFormData({ ...formData, depuis: newCompteName.trim() });
    setNewCompteName('');
    setShowAddCompte(false);
  };

  const handleSubmit = () => {
    if (!formData.categorie || !formData.capitalTotal || !formData.dureeMois) return;

    const creditData = {
      ...(editingCredit ? { id: editingCredit.id } : {}),
      date: formData.dateDebut,
      montant: formData.montant,
      type: 'Factures',
      categorie: formData.categorie,
      depuis: formData.depuis,
      vers: '',
      memo: formData.memo,
      isCredit: true,
      capitalTotal: formData.capitalTotal,
      tauxInteret: formData.tauxInteret || '0',
      dureeMois: formData.dureeMois,
      dateDebut: formData.dateDebut
    };

    onSubmit(creditData);
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
            {editingCredit ? 'Modifier le' : 'Nouveau'} crédit
          </h2>
          <button 
            onClick={onClose} 
            className="p-1"
          >
            <X className="w-5 h-5" style={{ color: theme.colors.textOnSecondary }} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Nom du crédit */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
              Nom du crédit
            </label>
            <input 
              type="text"
              placeholder="Ex: Crédit auto, Prêt immobilier..."
              value={formData.categorie}
              onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-sm border"
              style={modalInputStyle}
            />
          </div>

          {/* Capital et Taux */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
                Capital emprunté ({devise})
              </label>
              <input 
                type="number"
                placeholder="10000"
                value={formData.capitalTotal}
                onChange={(e) => setFormData({ ...formData, capitalTotal: e.target.value })}
                className="w-full rounded-xl px-3 py-2 text-sm border"
                style={modalInputStyle}
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
                Taux d&apos;intérêt (%)
              </label>
              <input 
                type="number"
                step="0.1"
                placeholder="3.5"
                value={formData.tauxInteret}
                onChange={(e) => setFormData({ ...formData, tauxInteret: e.target.value })}
                className="w-full rounded-xl px-3 py-2 text-sm border"
                style={modalInputStyle}
              />
            </div>
          </div>

          {/* Durée et Date début */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
                Durée (mois)
              </label>
              <input 
                type="number"
                placeholder="48"
                value={formData.dureeMois}
                onChange={(e) => setFormData({ ...formData, dureeMois: e.target.value })}
                className="w-full rounded-xl px-3 py-2 text-sm border"
                style={modalInputStyle}
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
                Date de début
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

          {/* Mensualité calculée */}
          {formData.montant && parseFloat(formData.montant) > 0 && (
            <div 
              className="p-3 rounded-xl border"
              style={{ background: theme.colors.secondaryLight, borderColor: theme.colors.cardBorder }}
            >
              <p className="text-[10px] text-center mb-1" style={{ color: theme.colors.textOnSecondary }}>
                💳 Mensualité calculée
              </p>
              <p className="text-xl font-bold text-center" style={{ color: theme.colors.primary }}>
                {parseFloat(formData.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}/mois
              </p>
            </div>
          )}

          {/* Compte prélevé */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>
              Compte prélevé
            </label>
            {!showAddCompte ? (
              <select 
                value={formData.depuis}
                onChange={(e) => {
                  if (e.target.value === '__ADD__') {
                    setShowAddCompte(true);
                    setFormData({ ...formData, depuis: '' });
                  } else {
                    setFormData({ ...formData, depuis: e.target.value });
                  }
                }}
                className="w-full rounded-xl px-3 py-2 text-sm border cursor-pointer"
                style={modalInputStyle}
              >
                <option value="">Sélectionner...</option>
                {comptes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                {onAddCompte && <option value="__ADD__">➕ Ajouter un compte...</option>}
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
                  onClick={handleAddCompte}
                  className="px-3 py-2 rounded-xl"
                  style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setShowAddCompte(false); setNewCompteName(''); }}
                  className="px-3 py-2 rounded-xl border"
                  style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

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
              {editingCredit ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
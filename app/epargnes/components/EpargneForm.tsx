'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, PiggyBank, TrendingUp, TrendingDown, Check, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import confetti from 'canvas-confetti';

interface Transaction {
  id?: number;
  type: string;
  categorie: string;
  montant: string;
  date: string;
  compte?: string;
  compteVers?: string;
  moyenPaiement?: string;
  notes?: string;
}

interface CompteBancaire {
  id: number;
  nom: string;
  soldeDepart: number;
  isEpargne: boolean;
}

interface ParametresData {
  devise: string;
  comptesBancaires: CompteBancaire[];
  categoriesEpargnes: string[];
}

interface EpargneFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTransaction?: Transaction | null;
}

type EpargneType = 'epargne' | 'reprise';

export default function EpargneForm({ isOpen, onClose, onSuccess, editingTransaction }: EpargneFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const [type, setType] = useState<EpargneType>('epargne');
  const [montant, setMontant] = useState('');
  const [categorie, setCategorie] = useState('');
  const [compte, setCompte] = useState('');
  const [compteVers, setCompteVers] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [parametres, setParametres] = useState<ParametresData>({
    devise: '€',
    comptesBancaires: [],
    categoriesEpargnes: ['Livret A', 'Épargne', 'Tirelire', 'Vacances', 'Projets']
  });
  const [showNewCategorie, setShowNewCategorie] = useState(false);
  const [newCategorie, setNewCategorie] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les paramètres
  useEffect(() => {
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) {
      const parsed = JSON.parse(savedParametres);
      setParametres(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  // Pré-remplir si édition
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type === 'Épargnes' ? 'epargne' : 'reprise');
      setMontant(editingTransaction.montant);
      setCategorie(editingTransaction.categorie || '');
      setCompte(editingTransaction.compte || '');
      setCompteVers(editingTransaction.compteVers || '');
      setDate(editingTransaction.date);
      setNotes(editingTransaction.notes || '');
    } else {
      resetForm();
    }
  }, [editingTransaction, isOpen]);

  const resetForm = () => {
    setType('epargne');
    setMontant('');
    setCategorie('');
    setCompte('');
    setCompteVers('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setShowNewCategorie(false);
    setNewCategorie('');
  };

  const comptesCourants = useMemo(() => 
    parametres.comptesBancaires.filter(c => !c.isEpargne),
    [parametres.comptesBancaires]
  );

  const comptesEpargne = useMemo(() => 
    parametres.comptesBancaires.filter(c => c.isEpargne),
    [parametres.comptesBancaires]
  );

  const handleAddCategorie = () => {
    if (newCategorie.trim()) {
      const updatedCategories = [...(parametres.categoriesEpargnes || []), newCategorie.trim()];
      const newParametres = { ...parametres, categoriesEpargnes: updatedCategories };
      setParametres(newParametres);
      localStorage.setItem('budget-parametres', JSON.stringify(newParametres));
      setCategorie(newCategorie.trim());
      setNewCategorie('');
      setShowNewCategorie(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#4ade80', '#86efac', theme.colors.primary]
    });
  };

  const handleSubmit = async () => {
    if (!montant || parseFloat(montant) <= 0) return;
    
    setIsSubmitting(true);

    const newTransaction: Transaction = {
      id: editingTransaction?.id || Date.now(),
      type: type === 'epargne' ? 'Épargnes' : "Reprise d'épargne",
      categorie: categorie || 'Épargne',
      montant,
      date,
      compte: type === 'epargne' ? compte : compteVers,
      compteVers: type === 'epargne' ? compteVers : compte,
      notes
    };

    // Sauvegarder dans localStorage
    const savedTransactions = localStorage.getItem('budget-transactions');
    let transactions: Transaction[] = savedTransactions ? JSON.parse(savedTransactions) : [];
    
    if (editingTransaction) {
      transactions = transactions.map(t => t.id === editingTransaction.id ? newTransaction : t);
    } else {
      transactions.push(newTransaction);
    }
    
    localStorage.setItem('budget-transactions', JSON.stringify(transactions));

    // Confetti si nouvelle épargne
    if (!editingTransaction && type === 'epargne') {
      triggerConfetti();
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      onClose();
      resetForm();
    }, 300);
  };

  const cardStyle = useMemo(() => ({ 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  }), [theme.colors.cardBackground, theme.colors.cardBorder]);

  const inputStyle = useMemo(() => ({ 
    background: theme.colors.cardBackgroundLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  }), [theme.colors.cardBackgroundLight, theme.colors.cardBorder, theme.colors.textPrimary]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="w-full max-w-md rounded-2xl shadow-2xl border animate-fadeIn mt-20 mb-20"
        style={cardStyle}
      >
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between rounded-t-2xl"
          style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: type === 'epargne' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}
            >
              <PiggyBank 
                className="w-5 h-5" 
                style={{ color: type === 'epargne' ? '#22c55e' : '#ef4444' }} 
              />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: theme.colors.textPrimary }}>
                {editingTransaction ? 'Modifier' : 'Nouvelle'} {type === 'epargne' ? 'épargne' : 'reprise'}
              </h2>
              <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>
                {type === 'epargne' ? 'Ajoutez de l\'argent à votre épargne' : 'Retirez de votre épargne'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
            style={{ background: `${theme.colors.primary}15` }}
          >
            <X className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Type selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setType('epargne')}
              className={`p-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border ${type === 'epargne' ? 'scale-[1.02]' : 'opacity-60'}`}
              style={{ 
                background: type === 'epargne' ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                borderColor: type === 'epargne' ? '#22c55e' : theme.colors.cardBorder
              }}
            >
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">Épargner</span>
            </button>
            <button
              onClick={() => setType('reprise')}
              className={`p-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border ${type === 'reprise' ? 'scale-[1.02]' : 'opacity-60'}`}
              style={{ 
                background: type === 'reprise' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                borderColor: type === 'reprise' ? '#ef4444' : theme.colors.cardBorder
              }}
            >
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-500">Reprendre</span>
            </button>
          </div>

          {/* Montant */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.colors.textSecondary }}>
              Montant *
            </label>
            <div className="relative">
              <input
                type="number"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 pr-10 rounded-xl border text-lg font-semibold"
                style={inputStyle}
              />
              <span 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={{ color: theme.colors.textSecondary }}
              >
                {parametres.devise}
              </span>
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.colors.textSecondary }}>
              Catégorie
            </label>
            {showNewCategorie ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategorie}
                  onChange={(e) => setNewCategorie(e.target.value)}
                  placeholder="Nouvelle catégorie..."
                  className="flex-1 p-3 rounded-xl border text-sm"
                  style={inputStyle}
                  autoFocus
                />
                <button
                  onClick={handleAddCategorie}
                  className="px-4 rounded-xl"
                  style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowNewCategorie(false)}
                  className="px-3 rounded-xl border"
                  style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textSecondary }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(parametres.categoriesEpargnes || []).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategorie(cat)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
                    style={categorie === cat 
                      ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary }
                      : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }
                    }
                  >
                    {cat}
                  </button>
                ))}
                <button
                  onClick={() => setShowNewCategorie(true)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border-2 border-dashed flex items-center gap-1 transition-all duration-200 hover:scale-105"
                  style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
                >
                  <Plus className="w-3 h-3" /> Ajouter
                </button>
              </div>
            )}
          </div>

          {/* Compte source et destination */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.colors.textSecondary }}>
                {type === 'epargne' ? 'Depuis' : 'Depuis (épargne)'}
              </label>
              <select
                value={type === 'epargne' ? compte : compteVers}
                onChange={(e) => type === 'epargne' ? setCompte(e.target.value) : setCompteVers(e.target.value)}
                className="w-full p-3 rounded-xl border text-sm"
                style={inputStyle}
              >
                <option value="">Sélectionner...</option>
                {(type === 'epargne' ? comptesCourants : comptesEpargne).map((c) => (
                  <option key={c.id} value={c.nom}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.colors.textSecondary }}>
                {type === 'epargne' ? 'Vers (épargne)' : 'Vers'}
              </label>
              <select
                value={type === 'epargne' ? compteVers : compte}
                onChange={(e) => type === 'epargne' ? setCompteVers(e.target.value) : setCompte(e.target.value)}
                className="w-full p-3 rounded-xl border text-sm"
                style={inputStyle}
              >
                <option value="">Sélectionner...</option>
                {(type === 'epargne' ? comptesEpargne : comptesCourants).map((c) => (
                  <option key={c.id} value={c.nom}>{c.nom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.colors.textSecondary }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded-xl border text-sm"
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.colors.textSecondary }}>
              Notes (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajouter une note..."
              rows={2}
              className="w-full p-3 rounded-xl border text-sm resize-none"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Footer */}
        <div 
          className="p-4 flex gap-3"
          style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-medium border transition-all duration-200 hover:scale-[1.02]"
            style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textSecondary }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!montant || parseFloat(montant) <= 0 || isSubmitting}
            className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: type === 'epargne' ? '#22c55e' : '#ef4444', 
              color: '#ffffff' 
            }}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                {editingTransaction ? 'Modifier' : type === 'epargne' ? 'Épargner' : 'Reprendre'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
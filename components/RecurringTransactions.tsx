'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Calendar,
  ToggleLeft,
  ToggleRight,
  Clock,
  Check
} from 'lucide-react';
import {
  RecurringTransaction,
  getRecurringTransactions,
  addRecurringTransaction,
  deleteRecurringTransaction,
  updateRecurringTransaction,
  frequenceLabels,
  joursSemaine,
} from '../lib/recurring-transactions';
import { useTheme } from '@/contexts/theme-context';

interface RecurringTransactionsProps {
  isOpen: boolean;
  onClose: () => void;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  comptes: { id: number; nom: string }[];
  onTransactionCreated?: () => void;
}

export default function RecurringTransactions({
  isOpen,
  onClose,
  categoriesRevenus,
  categoriesFactures,
  categoriesDepenses,
  comptes,
  onTransactionCreated,
}: RecurringTransactionsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [recurringList, setRecurringList] = useState<RecurringTransaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [nom, setNom] = useState('');
  const [montant, setMontant] = useState('');
  const [type, setType] = useState<'revenu' | 'facture' | 'depense'>('facture');
  const [categorie, setCategorie] = useState('');
  const [compte, setCompte] = useState('');
  const [frequence, setFrequence] = useState<RecurringTransaction['frequence']>('mensuel');
  const [jourDuMois, setJourDuMois] = useState(1);
  const [jourDeSemaine, setJourDeSemaine] = useState(1);

  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  useEffect(() => {
    if (isOpen) {
      loadRecurring();
    }
  }, [isOpen]);

  const loadRecurring = () => {
    setRecurringList(getRecurringTransactions());
  };

  const getCategories = () => {
    switch (type) {
      case 'revenu':
        return categoriesRevenus;
      case 'facture':
        return categoriesFactures;
      case 'depense':
        return categoriesDepenses;
      default:
        return [];
    }
  };

  const resetForm = () => {
    setNom('');
    setMontant('');
    setType('facture');
    setCategorie('');
    setCompte('');
    setFrequence('mensuel');
    setJourDuMois(1);
    setJourDeSemaine(1);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nom || !montant || !categorie || !compte) return;

    if (editingId) {
      updateRecurringTransaction(editingId, {
        nom,
        montant: parseFloat(montant),
        type,
        categorie,
        compte,
        frequence,
        jourDuMois: frequence === 'mensuel' || frequence === 'trimestriel' || frequence === 'annuel' ? jourDuMois : undefined,
        jourDeSemaine: frequence === 'hebdomadaire' ? jourDeSemaine : undefined,
      });
    } else {
      addRecurringTransaction({
        nom,
        montant: parseFloat(montant),
        type,
        categorie,
        compte,
        frequence,
        jourDuMois: frequence === 'mensuel' || frequence === 'trimestriel' || frequence === 'annuel' ? jourDuMois : undefined,
        jourDeSemaine: frequence === 'hebdomadaire' ? jourDeSemaine : undefined,
        actif: true,
      });
    }

    loadRecurring();
    resetForm();
    onTransactionCreated?.();
  };

  const handleEdit = (recurring: RecurringTransaction) => {
    setNom(recurring.nom);
    setMontant(recurring.montant.toString());
    setType(recurring.type);
    setCategorie(recurring.categorie);
    setCompte(recurring.compte);
    setFrequence(recurring.frequence);
    setJourDuMois(recurring.jourDuMois || 1);
    setJourDeSemaine(recurring.jourDeSemaine || 1);
    setEditingId(recurring.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette transaction récurrente ?')) {
      deleteRecurringTransaction(id);
      loadRecurring();
    }
  };

  const handleToggleActive = (id: string, currentState: boolean) => {
    updateRecurringTransaction(id, { actif: !currentState });
    loadRecurring();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revenu':
        return 'bg-green-500/20 text-green-400';
      case 'facture':
        return 'bg-red-500/20 text-red-400';
      case 'depense':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'revenu':
        return 'Revenu';
      case 'facture':
        return 'Facture';
      case 'depense':
        return 'Dépense';
      default:
        return type;
    }
  };

  const getFrequenceDetail = (recurring: RecurringTransaction) => {
    switch (recurring.frequence) {
      case 'hebdomadaire':
        return `Chaque ${joursSemaine[recurring.jourDeSemaine || 0]}`;
      case 'bimensuel':
        return 'Le 1er et le 15';
      case 'mensuel':
        return `Le ${recurring.jourDuMois} du mois`;
      case 'trimestriel':
        return `Le ${recurring.jourDuMois} (trimestriel)`;
      case 'annuel':
        return `Le ${recurring.jourDuMois} (annuel)`;
      default:
        return frequenceLabels[recurring.frequence];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col border" style={{ background: theme.colors.secondary, borderColor: theme.colors.cardBorder }}>
        {/* Header */}
        <div className="px-4 py-3 border-b" style={{ borderColor: theme.colors.cardBorder, background: theme.colors.secondary }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${theme.colors.primary}20` }}>
                <RefreshCw className="w-4 h-4" style={textPrimary} />
              </div>
              <div>
                <h2 className="text-base font-semibold" style={textPrimary}>
                  Transactions récurrentes
                </h2>
                <p className="text-[10px]" style={textSecondary}>
                  {recurringList.length} configurée{recurringList.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: theme.colors.textPrimary }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {showForm ? (
            /* Formulaire */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Nom de la transaction</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Loyer, Salaire, Netflix..."
                  className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Montant (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['revenu', 'facture', 'depense'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setType(t);
                        setCategorie('');
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border ${
                        type === t
                          ? t === 'revenu'
                            ? 'bg-green-500/30 text-green-400 border-green-500/50'
                            : t === 'facture'
                            ? 'bg-red-500/30 text-red-400 border-red-500/50'
                            : 'bg-orange-500/30 text-orange-400 border-orange-500/50'
                          : ''
                      }`}
                      style={type !== t ? { background: theme.colors.cardBackgroundLight, color: theme.colors.textSecondary, borderColor: theme.colors.cardBorder } : {}}
                    >
                      {getTypeLabel(t)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Catégorie</label>
                <select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                  style={inputStyle}
                  required
                >
                  <option value="">Sélectionner...</option>
                  {getCategories().map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Compte</label>
                <select
                  value={compte}
                  onChange={(e) => setCompte(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                  style={inputStyle}
                  required
                >
                  <option value="">Sélectionner...</option>
                  {comptes.map((c) => (
                    <option key={c.id} value={c.nom}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Fréquence</label>
                <select
                  value={frequence}
                  onChange={(e) => setFrequence(e.target.value as RecurringTransaction['frequence'])}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                  style={inputStyle}
                >
                  <option value="hebdomadaire">Chaque semaine</option>
                  <option value="bimensuel">Deux fois par mois (1er et 15)</option>
                  <option value="mensuel">Chaque mois</option>
                  <option value="trimestriel">Chaque trimestre</option>
                  <option value="annuel">Chaque année</option>
                </select>
              </div>

              {frequence === 'hebdomadaire' && (
                <div>
                  <label className="text-xs font-medium mb-1 block" style={textPrimary}>Jour de la semaine</label>
                  <select
                    value={jourDeSemaine}
                    onChange={(e) => setJourDeSemaine(parseInt(e.target.value))}
                    className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                    style={inputStyle}
                  >
                    {joursSemaine.map((jour, index) => (
                      <option key={index} value={index}>
                        {jour}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(frequence === 'mensuel' || frequence === 'trimestriel' || frequence === 'annuel') && (
                <div>
                  <label className="text-xs font-medium mb-1 block" style={textPrimary}>Jour du mois</label>
                  <select
                    value={jourDuMois}
                    onChange={(e) => setJourDuMois(parseInt(e.target.value))}
                    className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                    style={inputStyle}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((jour) => (
                      <option key={jour} value={jour}>
                        {jour}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 border rounded-xl font-medium text-sm transition-colors"
                  style={{ borderColor: theme.colors.primary, color: theme.colors.textPrimary }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                >
                  <Check className="w-4 h-4" />
                  {editingId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          ) : (
            /* Liste */
            <div className="space-y-3">
              {recurringList.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-3" style={{ color: theme.colors.textSecondary }} />
                  <p className="text-sm" style={textSecondary}>Aucune transaction récurrente</p>
                  <p className="text-[10px] mt-1" style={textSecondary}>
                    Ajoutez vos factures et revenus réguliers
                  </p>
                </div>
              ) : (
                recurringList.map((recurring) => (
                  <div
                    key={recurring.id}
                    className={`p-3 rounded-xl border transition-all ${!recurring.actif ? 'opacity-60' : ''}`}
                    style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => handleEdit(recurring)}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm" style={textPrimary}>
                            {recurring.nom}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${getTypeColor(recurring.type)}`}>
                            {getTypeLabel(recurring.type)}
                          </span>
                        </div>
                        <div className={`text-base font-bold ${
                          recurring.type === 'revenu' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {recurring.type === 'revenu' ? '+' : '-'}{recurring.montant.toFixed(2)} €
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[10px]" style={textSecondary}>
                          <Calendar className="w-3 h-3" />
                          {getFrequenceDetail(recurring)}
                        </div>
                        <div className="text-[9px] mt-0.5" style={textSecondary}>
                          {recurring.categorie} • {recurring.compte}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(recurring.id, recurring.actif)}
                          className="p-1.5 rounded-lg transition-colors"
                          title={recurring.actif ? 'Désactiver' : 'Activer'}
                        >
                          {recurring.actif ? (
                            <ToggleRight className="w-5 h-5 text-green-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" style={textSecondary} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(recurring.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!showForm && (
          <div className="px-4 py-3 border-t" style={{ borderColor: theme.colors.cardBorder, background: theme.colors.cardBackground }}>
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
            >
              <Plus className="w-4 h-4" />
              Ajouter une récurrence
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
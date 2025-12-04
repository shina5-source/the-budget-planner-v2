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

interface RecurringTransactionsProps {
  isOpen: boolean;
  onClose: () => void;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  comptes: { id: number; nom: string }[];
  onTransactionCreated?: () => void;
}

// Styles uniformisés avec l'app
const inputStyle = "w-full bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-xl px-3 py-2.5 text-sm text-[#D4AF37] placeholder-[#D4AF37]/50 focus:outline-none focus:border-[#D4AF37]";
const selectStyle = "w-full bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-xl px-3 py-2.5 text-sm text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]";
const labelStyle = "text-xs font-medium text-[#D4AF37] mb-1 block";
const smallTextStyle = "text-[10px] text-[#D4AF37]/60";

export default function RecurringTransactions({
  isOpen,
  onClose,
  categoriesRevenus,
  categoriesFactures,
  categoriesDepenses,
  comptes,
  onTransactionCreated,
}: RecurringTransactionsProps) {
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
        return 'bg-[#D4AF37]/20 text-[#D4AF37]';
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
      <div className="relative bg-[#8B4557] rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col border border-[#D4AF37]/40">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#D4AF37]/30 bg-[#722F37]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#D4AF37]">
                  Transactions récurrentes
                </h2>
                <p className="text-[10px] text-[#D4AF37]/70">
                  {recurringList.length} configurée{recurringList.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#D4AF37]/20 transition-colors"
            >
              <X className="w-5 h-5 text-[#D4AF37]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {showForm ? (
            /* Formulaire */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelStyle}>Nom de la transaction</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Loyer, Salaire, Netflix..."
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Montant (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  placeholder="0.00"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Type</label>
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
                          : 'bg-[#722F37]/50 text-[#D4AF37]/70 border-[#D4AF37]/30 hover:bg-[#722F37]/70'
                      }`}
                    >
                      {getTypeLabel(t)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelStyle}>Catégorie</label>
                <select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  className={selectStyle}
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
                <label className={labelStyle}>Compte</label>
                <select
                  value={compte}
                  onChange={(e) => setCompte(e.target.value)}
                  className={selectStyle}
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
                <label className={labelStyle}>Fréquence</label>
                <select
                  value={frequence}
                  onChange={(e) => setFrequence(e.target.value as RecurringTransaction['frequence'])}
                  className={selectStyle}
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
                  <label className={labelStyle}>Jour de la semaine</label>
                  <select
                    value={jourDeSemaine}
                    onChange={(e) => setJourDeSemaine(parseInt(e.target.value))}
                    className={selectStyle}
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
                  <label className={labelStyle}>Jour du mois</label>
                  <select
                    value={jourDuMois}
                    onChange={(e) => setJourDuMois(parseInt(e.target.value))}
                    className={selectStyle}
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
                  className="flex-1 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium text-sm hover:bg-[#D4AF37]/10 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#D4AF37]/90 transition-colors"
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
                  <Clock className="w-12 h-12 text-[#D4AF37]/30 mx-auto mb-3" />
                  <p className="text-[#D4AF37]/70 text-sm">Aucune transaction récurrente</p>
                  <p className="text-[10px] text-[#D4AF37]/50 mt-1">
                    Ajoutez vos factures et revenus réguliers
                  </p>
                </div>
              ) : (
                recurringList.map((recurring) => (
                  <div
                    key={recurring.id}
                    className={`p-3 rounded-xl border transition-all ${
                      recurring.actif
                        ? 'bg-[#722F37]/40 border-[#D4AF37]/30'
                        : 'bg-[#722F37]/20 border-[#D4AF37]/10 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => handleEdit(recurring)}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[#D4AF37] text-sm">
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
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-[#D4AF37]/60">
                          <Calendar className="w-3 h-3" />
                          {getFrequenceDetail(recurring)}
                        </div>
                        <div className="text-[9px] text-[#D4AF37]/50 mt-0.5">
                          {recurring.categorie} • {recurring.compte}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(recurring.id, recurring.actif)}
                          className="p-1.5 rounded-lg hover:bg-[#D4AF37]/20 transition-colors"
                          title={recurring.actif ? 'Désactiver' : 'Activer'}
                        >
                          {recurring.actif ? (
                            <ToggleRight className="w-5 h-5 text-green-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-[#D4AF37]/40" />
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
          <div className="px-4 py-3 border-t border-[#D4AF37]/30 bg-[#722F37]/50">
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#722F37] font-semibold text-sm hover:bg-[#D4AF37]/90 transition-colors flex items-center justify-center gap-2"
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
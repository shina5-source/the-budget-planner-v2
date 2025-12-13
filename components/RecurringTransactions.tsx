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

interface ParametresData {
  devise: string;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  categoriesEpargnes: string[];
  comptesBancaires: { id: number; nom: string }[];
}

interface RecurringTransactionsProps {
  isOpen: boolean;
  onClose: () => void;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  categoriesEpargnes: string[];
  comptes: { id: number; nom: string }[];
  onTransactionCreated?: () => void;
}

export default function RecurringTransactions({
  isOpen,
  onClose,
  categoriesRevenus: initialCategoriesRevenus,
  categoriesFactures: initialCategoriesFactures,
  categoriesDepenses: initialCategoriesDepenses,
  categoriesEpargnes: initialCategoriesEpargnes,
  comptes,
  onTransactionCreated,
}: RecurringTransactionsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [recurringList, setRecurringList] = useState<RecurringTransaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Categories state (pour permettre l'ajout dynamique)
  const [categoriesRevenus, setCategoriesRevenus] = useState<string[]>(initialCategoriesRevenus);
  const [categoriesFactures, setCategoriesFactures] = useState<string[]>(initialCategoriesFactures);
  const [categoriesDepenses, setCategoriesDepenses] = useState<string[]>(initialCategoriesDepenses);
  const [categoriesEpargnes, setCategoriesEpargnes] = useState<string[]>(initialCategoriesEpargnes);
  
  // État pour l'ajout de nouvelle catégorie
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // État pour l'ajout de nouveau compte
  const [showAddCompte, setShowAddCompte] = useState(false);
  const [newCompteName, setNewCompteName] = useState('');
  const [comptesListe, setComptesListe] = useState(comptes);
  
  // Form state
  const [nom, setNom] = useState('');
  const [montant, setMontant] = useState('');
  const [type, setType] = useState<'revenu' | 'facture' | 'depense' | 'epargne'>('facture');
  const [categorie, setCategorie] = useState('');
  const [compte, setCompte] = useState('');
  const [frequence, setFrequence] = useState<RecurringTransaction['frequence']>('mensuel');
  const [jourDuMois, setJourDuMois] = useState(1);
  const [jourDeSemaine, setJourDeSemaine] = useState(1);

  // Style pour les inputs dans la modale (avec textOnSecondary pour le contraste)
  const modalInputStyle = { 
    background: theme.colors.secondaryLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textOnSecondary 
  };
  const textOnSecondary = { color: theme.colors.textOnSecondary };
  const textSecondary = { color: theme.colors.textSecondary };

  // Mettre à jour les catégories quand les props changent
  useEffect(() => {
    setCategoriesRevenus(initialCategoriesRevenus);
    setCategoriesFactures(initialCategoriesFactures);
    setCategoriesDepenses(initialCategoriesDepenses);
    setCategoriesEpargnes(initialCategoriesEpargnes);
  }, [initialCategoriesRevenus, initialCategoriesFactures, initialCategoriesDepenses, initialCategoriesEpargnes]);

  // Mettre à jour les comptes quand les props changent
  useEffect(() => {
    setComptesListe(comptes);
  }, [comptes]);

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
      case 'epargne':
        return categoriesEpargnes;
      default:
        return [];
    }
  };

  // Fonction pour ajouter une nouvelle catégorie et la sauvegarder dans les paramètres
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCat = newCategoryName.trim();
    
    // Récupérer les paramètres actuels
    const savedParametres = localStorage.getItem('budget-parametres');
    const parametres: ParametresData = savedParametres 
      ? JSON.parse(savedParametres) 
      : {
          devise: '€',
          categoriesRevenus: [],
          categoriesFactures: [],
          categoriesDepenses: [],
          categoriesEpargnes: [],
          comptesBancaires: []
        };
    
    // Ajouter la catégorie selon le type sélectionné
    switch (type) {
      case 'revenu':
        if (!categoriesRevenus.includes(newCat)) {
          const newList = [...categoriesRevenus, newCat];
          setCategoriesRevenus(newList);
          parametres.categoriesRevenus = newList;
        }
        break;
      case 'facture':
        if (!categoriesFactures.includes(newCat)) {
          const newList = [...categoriesFactures, newCat];
          setCategoriesFactures(newList);
          parametres.categoriesFactures = newList;
        }
        break;
      case 'depense':
        if (!categoriesDepenses.includes(newCat)) {
          const newList = [...categoriesDepenses, newCat];
          setCategoriesDepenses(newList);
          parametres.categoriesDepenses = newList;
        }
        break;
      case 'epargne':
        if (!categoriesEpargnes.includes(newCat)) {
          const newList = [...categoriesEpargnes, newCat];
          setCategoriesEpargnes(newList);
          parametres.categoriesEpargnes = newList;
        }
        break;
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('budget-parametres', JSON.stringify(parametres));
    
    // Sélectionner la nouvelle catégorie
    setCategorie(newCat);
    
    // Réinitialiser
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  // Fonction pour ajouter un nouveau compte et le sauvegarder dans les paramètres
  const handleAddCompte = () => {
    if (!newCompteName.trim()) return;
    
    const newCompte = newCompteName.trim();
    
    // Vérifier si le compte existe déjà
    if (comptesListe.some(c => c.nom === newCompte)) {
      setNewCompteName('');
      setShowAddCompte(false);
      return;
    }
    
    // Récupérer les paramètres actuels
    const savedParametres = localStorage.getItem('budget-parametres');
    const parametres: ParametresData = savedParametres 
      ? JSON.parse(savedParametres) 
      : {
          devise: '€',
          categoriesRevenus: [],
          categoriesFactures: [],
          categoriesDepenses: [],
          categoriesEpargnes: [],
          comptesBancaires: []
        };
    
    // Créer le nouveau compte avec un nouvel ID
    const maxId = comptesListe.reduce((max, c) => Math.max(max, c.id), 0);
    const nouveauCompte = { id: maxId + 1, nom: newCompte };
    
    // Ajouter le compte
    const newList = [...comptesListe, nouveauCompte];
    setComptesListe(newList);
    parametres.comptesBancaires = newList;
    
    // Sauvegarder dans localStorage
    localStorage.setItem('budget-parametres', JSON.stringify(parametres));
    
    // Sélectionner le nouveau compte
    setCompte(newCompte);
    
    // Réinitialiser
    setNewCompteName('');
    setShowAddCompte(false);
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
    setShowAddCategory(false);
    setNewCategoryName('');
    setShowAddCompte(false);
    setNewCompteName('');
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
      case 'epargne':
        return 'bg-violet-500/20 text-violet-400';
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
      case 'epargne':
        return 'Épargne';
      default:
        return type;
    }
  };

  // Couleurs des boutons de type
  const getTypeButtonColor = (t: string) => {
    switch (t) {
      case 'revenu':
        return { bg: '#22c55e', border: '#16a34a' }; // Vert
      case 'facture':
        return { bg: '#ef4444', border: '#dc2626' }; // Rouge
      case 'depense':
        return { bg: '#f97316', border: '#ea580c' }; // Orange
      case 'epargne':
        return { bg: '#8b5cf6', border: '#7c3aed' }; // Violet
      default:
        return { bg: '#6b7280', border: '#4b5563' }; // Gris
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

  // Couleur du montant selon le type
  const getMontantColor = (type: string) => {
    switch (type) {
      case 'revenu':
        return 'text-green-400';
      case 'epargne':
        return 'text-violet-400';
      default:
        return 'text-red-400';
    }
  };

  // Signe du montant selon le type
  const getMontantSign = (type: string) => {
    return type === 'revenu' ? '+' : '-';
  };

  // Obtenir le label du type pour l'ajout de catégorie
  const getTypeLabelForCategory = () => {
    switch (type) {
      case 'revenu': return 'revenus';
      case 'facture': return 'factures';
      case 'depense': return 'dépenses';
      case 'epargne': return 'épargnes';
      default: return '';
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
                <RefreshCw className="w-4 h-4" style={textOnSecondary} />
              </div>
              <div>
                <h2 className="text-base font-semibold" style={textOnSecondary}>
                  Transactions récurrentes
                </h2>
                <p className="text-[10px]" style={textOnSecondary}>
                  {recurringList.length} configurée{recurringList.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={textOnSecondary}
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
                <label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Nom de la transaction</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Loyer, Salaire, Netflix..."
                  className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                  style={modalInputStyle}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Montant (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                  style={modalInputStyle}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['revenu', 'facture', 'depense', 'epargne'] as const).map((t) => {
                    const colors = getTypeButtonColor(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setType(t);
                          setCategorie('');
                          setShowAddCategory(false);
                          setNewCategoryName('');
                        }}
                        className="py-2 px-2 rounded-xl text-xs font-medium transition-all border"
                        style={type === t 
                          ? { 
                              background: colors.bg,
                              color: '#ffffff',
                              borderColor: colors.border
                            }
                          : { 
                              background: theme.colors.secondaryLight, 
                              color: theme.colors.textOnSecondary, 
                              borderColor: theme.colors.cardBorder 
                            }
                        }
                      >
                        {getTypeLabel(t)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Catégorie</label>
                {!showAddCategory ? (
                  <div className="space-y-2">
                    <select
                      value={categorie}
                      onChange={(e) => {
                        if (e.target.value === '__ADD_NEW__') {
                          setShowAddCategory(true);
                          setCategorie('');
                        } else {
                          setCategorie(e.target.value);
                        }
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                      style={modalInputStyle}
                      required
                    >
                      <option value="">Sélectionner...</option>
                      {getCategories().map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__ADD_NEW__">➕ Ajouter une catégorie...</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder={`Nouvelle catégorie ${getTypeLabelForCategory()}...`}
                        className="flex-1 rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                        style={modalInputStyle}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-3 py-2 rounded-xl text-sm font-medium"
                        style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCategory(false);
                          setNewCategoryName('');
                        }}
                        className="px-3 py-2 rounded-xl text-sm font-medium border"
                        style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px]" style={textSecondary}>
                      La catégorie sera ajoutée aux {getTypeLabelForCategory()} dans les paramètres
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Compte</label>
                {!showAddCompte ? (
                  <select
                    value={compte}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW_COMPTE__') {
                        setShowAddCompte(true);
                        setCompte('');
                      } else {
                        setCompte(e.target.value);
                      }
                    }}
                    className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                    style={modalInputStyle}
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {comptesListe.map((c) => (
                      <option key={c.id} value={c.nom}>
                        {c.nom}
                      </option>
                    ))}
                    <option value="__ADD_NEW_COMPTE__">➕ Ajouter un compte...</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCompteName}
                        onChange={(e) => setNewCompteName(e.target.value)}
                        placeholder="Nouveau compte bancaire..."
                        className="flex-1 rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                        style={modalInputStyle}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddCompte}
                        className="px-3 py-2 rounded-xl text-sm font-medium"
                        style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCompte(false);
                          setNewCompteName('');
                        }}
                        className="px-3 py-2 rounded-xl text-sm font-medium border"
                        style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px]" style={textSecondary}>
                      Le compte sera ajouté dans les paramètres
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Fréquence</label>
                <select
                  value={frequence}
                  onChange={(e) => setFrequence(e.target.value as RecurringTransaction['frequence'])}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                  style={modalInputStyle}
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
                  <label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Jour de la semaine</label>
                  <select
                    value={jourDeSemaine}
                    onChange={(e) => setJourDeSemaine(parseInt(e.target.value))}
                    className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                    style={modalInputStyle}
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
                  <label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Jour du mois</label>
                  <select
                    value={jourDuMois}
                    onChange={(e) => setJourDuMois(parseInt(e.target.value))}
                    className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
                    style={modalInputStyle}
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
                  style={{ borderColor: theme.colors.textOnSecondary, color: theme.colors.textOnSecondary }}
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
                  <Clock className="w-12 h-12 mx-auto mb-3" style={textOnSecondary} />
                  <p className="text-sm" style={textOnSecondary}>Aucune transaction récurrente</p>
                  <p className="text-[10px] mt-1" style={textOnSecondary}>
                    Ajoutez vos factures et revenus réguliers
                  </p>
                </div>
              ) : (
                recurringList.map((recurring) => (
                  <div
                    key={recurring.id}
                    className={`p-3 rounded-xl border transition-all ${!recurring.actif ? 'opacity-60' : ''}`}
                    style={{ background: theme.colors.secondaryLight, borderColor: theme.colors.cardBorder }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => handleEdit(recurring)}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm" style={textOnSecondary}>
                            {recurring.nom}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${getTypeColor(recurring.type)}`}>
                            {getTypeLabel(recurring.type)}
                          </span>
                        </div>
                        <div className={`text-base font-bold ${getMontantColor(recurring.type)}`}>
                          {getMontantSign(recurring.type)}{recurring.montant.toFixed(2)} €
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[10px]" style={textOnSecondary}>
                          <Calendar className="w-3 h-3" />
                          {getFrequenceDetail(recurring)}
                        </div>
                        <div className="text-[9px] mt-0.5" style={textOnSecondary}>
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
          <div className="px-4 py-3 border-t" style={{ borderColor: theme.colors.cardBorder, background: theme.colors.secondary }}>
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

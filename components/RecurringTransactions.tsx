'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, RefreshCw, Trash2, Calendar, ToggleLeft, ToggleRight, Clock, Check } from 'lucide-react';
import { RecurringTransaction, getRecurringTransactions, addRecurringTransaction, deleteRecurringTransaction, updateRecurringTransaction, frequenceLabels, joursSemaine } from '../lib/recurring-transactions';
import { useTheme } from '@/contexts/theme-context';

interface ParametresData {
  devise: string;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  categoriesEpargnes: string[];
  comptesBancaires: { id: number; nom: string }[];
  moyensPaiement?: string[];
}

const defaultMoyensPaiement = ['Prélèvement', 'Paiement CB', 'Virement', 'Chèque', 'Espèces', 'Paiement en ligne', 'Paiement mobile'];

interface RecurringTransactionsProps {
  isOpen: boolean;
  onClose: () => void;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  categoriesEpargnes: string[];
  comptes: { id: number; nom: string }[];
  moyensPaiement?: string[];
  onTransactionCreated?: () => void;
}

export default function RecurringTransactions({
  isOpen, onClose,
  categoriesRevenus: initialCategoriesRevenus,
  categoriesFactures: initialCategoriesFactures,
  categoriesDepenses: initialCategoriesDepenses,
  categoriesEpargnes: initialCategoriesEpargnes,
  comptes,
  moyensPaiement: initialMoyensPaiement,
  onTransactionCreated,
}: RecurringTransactionsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [recurringList, setRecurringList] = useState<RecurringTransaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoriesRevenus, setCategoriesRevenus] = useState<string[]>(initialCategoriesRevenus);
  const [categoriesFactures, setCategoriesFactures] = useState<string[]>(initialCategoriesFactures);
  const [categoriesDepenses, setCategoriesDepenses] = useState<string[]>(initialCategoriesDepenses);
  const [categoriesEpargnes, setCategoriesEpargnes] = useState<string[]>(initialCategoriesEpargnes);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCompte, setShowAddCompte] = useState(false);
  const [newCompteName, setNewCompteName] = useState('');
  const [comptesListe, setComptesListe] = useState(comptes);
  const [moyensPaiementListe, setMoyensPaiementListe] = useState<string[]>(initialMoyensPaiement || defaultMoyensPaiement);
  const [showAddMoyenPaiement, setShowAddMoyenPaiement] = useState(false);
  const [newMoyenPaiement, setNewMoyenPaiement] = useState('');
  const [nom, setNom] = useState('');
  const [montant, setMontant] = useState('');
  const [type, setType] = useState<'revenu' | 'facture' | 'depense' | 'epargne'>('facture');
  const [categorie, setCategorie] = useState('');
  const [compte, setCompte] = useState('');
  const [moyenPaiement, setMoyenPaiement] = useState('');
  const [frequence, setFrequence] = useState<RecurringTransaction['frequence']>('mensuel');
  const [jourDuMois, setJourDuMois] = useState(1);
  const [jourDeSemaine, setJourDeSemaine] = useState(1);

  const modalInputStyle = { background: theme.colors.secondaryLight, borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary };
  const textOnSecondary = { color: theme.colors.textOnSecondary };
  const textSecondary = { color: theme.colors.textSecondary };

  useEffect(() => { setCategoriesRevenus(initialCategoriesRevenus); setCategoriesFactures(initialCategoriesFactures); setCategoriesDepenses(initialCategoriesDepenses); setCategoriesEpargnes(initialCategoriesEpargnes); }, [initialCategoriesRevenus, initialCategoriesFactures, initialCategoriesDepenses, initialCategoriesEpargnes]);
  useEffect(() => { setComptesListe(comptes); }, [comptes]);
  useEffect(() => { setMoyensPaiementListe(initialMoyensPaiement || defaultMoyensPaiement); }, [initialMoyensPaiement]);
  useEffect(() => { if (isOpen) setRecurringList(getRecurringTransactions()); }, [isOpen]);

  const getCategories = () => { switch (type) { case 'revenu': return categoriesRevenus; case 'facture': return categoriesFactures; case 'depense': return categoriesDepenses; case 'epargne': return categoriesEpargnes; default: return []; } };
  const getTypeLabelForCategory = () => { switch (type) { case 'revenu': return 'revenus'; case 'facture': return 'factures'; case 'depense': return 'dépenses'; case 'epargne': return 'épargnes'; default: return ''; } };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat = newCategoryName.trim();
    const savedParametres = localStorage.getItem('budget-parametres');
    const parametres: ParametresData = savedParametres ? JSON.parse(savedParametres) : { devise: '€', categoriesRevenus: [], categoriesFactures: [], categoriesDepenses: [], categoriesEpargnes: [], comptesBancaires: [] };
    switch (type) {
      case 'revenu': if (!categoriesRevenus.includes(newCat)) { setCategoriesRevenus([...categoriesRevenus, newCat]); parametres.categoriesRevenus = [...categoriesRevenus, newCat]; } break;
      case 'facture': if (!categoriesFactures.includes(newCat)) { setCategoriesFactures([...categoriesFactures, newCat]); parametres.categoriesFactures = [...categoriesFactures, newCat]; } break;
      case 'depense': if (!categoriesDepenses.includes(newCat)) { setCategoriesDepenses([...categoriesDepenses, newCat]); parametres.categoriesDepenses = [...categoriesDepenses, newCat]; } break;
      case 'epargne': if (!categoriesEpargnes.includes(newCat)) { setCategoriesEpargnes([...categoriesEpargnes, newCat]); parametres.categoriesEpargnes = [...categoriesEpargnes, newCat]; } break;
    }
    localStorage.setItem('budget-parametres', JSON.stringify(parametres));
    setCategorie(newCat); setNewCategoryName(''); setShowAddCategory(false);
  };

  const handleAddCompte = () => {
    if (!newCompteName.trim()) return;
    const newCompte = newCompteName.trim();
    if (comptesListe.some(c => c.nom === newCompte)) { setNewCompteName(''); setShowAddCompte(false); return; }
    const savedParametres = localStorage.getItem('budget-parametres');
    const parametres: ParametresData = savedParametres ? JSON.parse(savedParametres) : { devise: '€', categoriesRevenus: [], categoriesFactures: [], categoriesDepenses: [], categoriesEpargnes: [], comptesBancaires: [] };
    const maxId = comptesListe.reduce((max, c) => Math.max(max, c.id), 0);
    const nouveauCompte = { id: maxId + 1, nom: newCompte };
    const newList = [...comptesListe, nouveauCompte];
    setComptesListe(newList);
    parametres.comptesBancaires = newList;
    localStorage.setItem('budget-parametres', JSON.stringify(parametres));
    setCompte(newCompte); setNewCompteName(''); setShowAddCompte(false);
  };

  const handleAddMoyenPaiement = () => {
    if (!newMoyenPaiement.trim()) return;
    const newMoyen = newMoyenPaiement.trim();
    if (moyensPaiementListe.includes(newMoyen)) { setMoyenPaiement(newMoyen); setNewMoyenPaiement(''); setShowAddMoyenPaiement(false); return; }
    const savedParametres = localStorage.getItem('budget-parametres');
    const parametres: ParametresData = savedParametres ? JSON.parse(savedParametres) : { devise: '€', categoriesRevenus: [], categoriesFactures: [], categoriesDepenses: [], categoriesEpargnes: [], comptesBancaires: [], moyensPaiement: defaultMoyensPaiement };
    const newList = [...moyensPaiementListe, newMoyen];
    setMoyensPaiementListe(newList);
    parametres.moyensPaiement = newList;
    localStorage.setItem('budget-parametres', JSON.stringify(parametres));
    setMoyenPaiement(newMoyen); setNewMoyenPaiement(''); setShowAddMoyenPaiement(false);
  };

  const resetForm = () => { setNom(''); setMontant(''); setType('facture'); setCategorie(''); setCompte(''); setMoyenPaiement(''); setFrequence('mensuel'); setJourDuMois(1); setJourDeSemaine(1); setEditingId(null); setShowForm(false); setShowAddCategory(false); setNewCategoryName(''); setShowAddCompte(false); setNewCompteName(''); setShowAddMoyenPaiement(false); setNewMoyenPaiement(''); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !montant || !categorie || !compte) return;
    if (editingId) {
      updateRecurringTransaction(editingId, { nom, montant: parseFloat(montant), type, categorie, compte, moyenPaiement, frequence, jourDuMois: frequence === 'mensuel' || frequence === 'trimestriel' || frequence === 'annuel' ? jourDuMois : undefined, jourDeSemaine: frequence === 'hebdomadaire' ? jourDeSemaine : undefined });
    } else {
      addRecurringTransaction({ nom, montant: parseFloat(montant), type, categorie, compte, moyenPaiement, frequence, jourDuMois: frequence === 'mensuel' || frequence === 'trimestriel' || frequence === 'annuel' ? jourDuMois : undefined, jourDeSemaine: frequence === 'hebdomadaire' ? jourDeSemaine : undefined, actif: true });
    }
    setRecurringList(getRecurringTransactions()); resetForm(); onTransactionCreated?.();
  };

  const handleEdit = (r: RecurringTransaction) => { setNom(r.nom); setMontant(r.montant.toString()); setType(r.type); setCategorie(r.categorie); setCompte(r.compte); setMoyenPaiement(r.moyenPaiement || ''); setFrequence(r.frequence); setJourDuMois(r.jourDuMois || 1); setJourDeSemaine(r.jourDeSemaine || 1); setEditingId(r.id); setShowForm(true); };
  const handleDelete = (id: string) => { if (confirm('Supprimer ?')) { deleteRecurringTransaction(id); setRecurringList(getRecurringTransactions()); } };
  const handleToggleActive = (id: string, current: boolean) => { updateRecurringTransaction(id, { actif: !current }); setRecurringList(getRecurringTransactions()); };
  const getTypeColor = (t: string) => { switch (t) { case 'revenu': return 'bg-green-500/20 text-green-400'; case 'facture': return 'bg-red-500/20 text-red-400'; case 'depense': return 'bg-orange-500/20 text-orange-400'; case 'epargne': return 'bg-violet-500/20 text-violet-400'; default: return 'bg-gray-500/20 text-gray-400'; } };
  const getTypeLabel = (t: string) => { switch (t) { case 'revenu': return 'Revenu'; case 'facture': return 'Facture'; case 'depense': return 'Dépense'; case 'epargne': return 'Épargne'; default: return t; } };
  const getTypeButtonColor = (t: string) => { switch (t) { case 'revenu': return { bg: '#22c55e', border: '#16a34a' }; case 'facture': return { bg: '#ef4444', border: '#dc2626' }; case 'depense': return { bg: '#f97316', border: '#ea580c' }; case 'epargne': return { bg: '#8b5cf6', border: '#7c3aed' }; default: return { bg: '#6b7280', border: '#4b5563' }; } };
  const getFrequenceDetail = (r: RecurringTransaction) => { switch (r.frequence) { case 'hebdomadaire': return `Chaque ${joursSemaine[r.jourDeSemaine || 0]}`; case 'bimensuel': return 'Le 1er et le 15'; case 'mensuel': return `Le ${r.jourDuMois} du mois`; case 'trimestriel': return `Le ${r.jourDuMois} (trim.)`; case 'annuel': return `Le ${r.jourDuMois} (annuel)`; default: return frequenceLabels[r.frequence]; } };
  const getMontantColor = (t: string) => { switch (t) { case 'revenu': return 'text-green-400'; case 'epargne': return 'text-violet-400'; default: return 'text-red-400'; } };
  const getMontantSign = (t: string) => t === 'revenu' ? '+' : '-';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col border my-20" style={{ background: theme.colors.secondary, borderColor: theme.colors.cardBorder }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: theme.colors.cardBorder, background: theme.colors.secondary }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${theme.colors.primary}20` }}><RefreshCw className="w-4 h-4" style={textOnSecondary} /></div><div><h2 className="text-base font-semibold" style={textOnSecondary}>Transactions récurrentes</h2><p className="text-[10px]" style={textOnSecondary}>{recurringList.length} configurée{recurringList.length > 1 ? 's' : ''}</p></div></div>
            <button onClick={onClose} className="p-2 rounded-lg" style={textOnSecondary}><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Nom</label><input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Loyer, Salaire..." className="w-full rounded-xl px-3 py-2.5 text-sm border" style={modalInputStyle} required /></div>
              <div><label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Montant (€)</label><input type="number" step="0.01" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="0.00" className="w-full rounded-xl px-3 py-2.5 text-sm border" style={modalInputStyle} required /></div>
              <div><label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Type</label><div className="grid grid-cols-4 gap-2">{(['revenu', 'facture', 'depense', 'epargne'] as const).map((t) => { const c = getTypeButtonColor(t); return (<button key={t} type="button" onClick={() => { setType(t); setCategorie(''); setShowAddCategory(false); }} className="py-2 px-2 rounded-xl text-xs font-medium border" style={type === t ? { background: c.bg, color: '#fff', borderColor: c.border } : { background: theme.colors.secondaryLight, color: theme.colors.textOnSecondary, borderColor: theme.colors.cardBorder }}>{getTypeLabel(t)}</button>); })}</div></div>
              <div><label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Catégorie</label>{!showAddCategory ? (<select value={categorie} onChange={(e) => { if (e.target.value === '__ADD__') { setShowAddCategory(true); setCategorie(''); } else setCategorie(e.target.value); }} className="w-full rounded-xl px-3 py-2.5 text-sm border" style={modalInputStyle} required><option value="">Sélectionner...</option>{getCategories().map((c) => (<option key={c} value={c}>{c}</option>))}<option value="__ADD__">➕ Ajouter une catégorie...</option></select>) : (<div className="space-y-2"><div className="flex gap-2"><input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder={`Nouvelle catégorie ${getTypeLabelForCategory()}...`} className="flex-1 rounded-xl px-3 py-2.5 text-sm border" style={modalInputStyle} autoFocus /><button type="button" onClick={handleAddCategory} className="px-3 py-2 rounded-xl" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-4 h-4" /></button><button type="button" onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }} className="px-3 py-2 rounded-xl border" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}><X className="w-4 h-4" /></button></div><p className="text-[10px]" style={textSecondary}>Sera ajoutée aux {getTypeLabelForCategory()}</p></div>)}</div>
              <div><label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Compte</label>{!showAddCompte ? (<select value={compte} onChange={(e) => { if (e.target.value === '__ADD__') { setShowAddCompte(true); setCompte(''); } else setCompte(e.target.value); }} className="w-full rounded-xl px-3 py-2.5 text-sm border" style={modalInputStyle} required><option value="">Sélectionner...</option>{comptesListe.map((c) => (<option key={c.id} value={c.nom}>{c.nom}</option>))}<option value="__ADD__">➕ Ajouter un compte...</option></select>) : (<div className="space-y-2"><div className="flex gap-2"><input type="text" value={newCompteName} onChange={(e) => setNewCompteName(e.target.value)} placeholder="Nouveau compte..." className="flex-1 rounded-xl px-3 py-2.5 text-sm border" style={modalInputStyle} autoFocus /><button type="button" onClick={handleAddCompte} className="px-3 py-2 rounded-xl" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-4 h-4" /></button><button type="button" onClick={() => { setShowAddCompte(false); setNewCompteName(''); }} className="px-3 py-2 rounded-xl border" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}><X className="w-4 h-4" /></button></div></div>)}</div>
              <div><label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Moyen de paiement</label>{!showAddMoyenPaiement ? (<select value={moyenPaiement} onChange={(e) => { if (e.target.value === '__ADD__') { setShowAddMoyenPaiement(true); setMoyenPaiement(''); } else setMoyenPaiement(e.target.value); }} className="w-full rounded-xl px-3 py-2.5 text-sm border" style={modalInputStyle}><option value="">Sélectionner...</option>{moyensPaiementListe.map((m) => (<option key={m} value={m}>{m}</option>))}<option value="__ADD__">➕ Ajouter un moyen...</option></select>) : (<div className="space-y-2"><div className="flex gap-2"><input type="text" value={newMoyenPaiement} onChange={(e) => setNewMoyenPaiement(e.target.value)} placeholder="Nouveau moyen de paiement..." className="flex-1 rounded-xl px-3 py-2.5 text-sm border" style={modalInputStyle} autoFocus /><button type="button" onClick={handleAddMoyenPaiement} className="px-3 py-2 rounded-xl" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-4 h-4" /></button><button type="button" onClick={() => { setShowAddMoyenPaiement(false); setNewMoyenPaiement(''); }} className="px-3 py-2 rounded-xl border" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}><X className="w-4 h-4" /></button></div><p className="text-[10px]" style={textSecondary}>Sera ajouté aux paramètres</p></div>)}</div>
              <div><label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Fréquence</label><select value={frequence} onChange={(e) => setFrequence(e.target.value as RecurringTransaction['frequence'])} className="w-full rounded-xl px-3 py-2.5 text-sm border" style={modalInputStyle}><option value="hebdomadaire">Chaque semaine</option><option value="bimensuel">2x par mois (1er et 15)</option><option value="mensuel">Chaque mois</option><option value="trimestriel">Chaque trimestre</option><option value="annuel">Chaque année</option></select></div>
              {frequence === 'hebdomadaire' && (<div><label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Jour de la semaine</label><select value={jourDeSemaine} onChange={(e) => setJourDeSemaine(parseInt(e.target.value))} className="w-full rounded-xl px-3 py-2.5 text-sm border" style={modalInputStyle}>{joursSemaine.map((j, i) => (<option key={i} value={i}>{j}</option>))}</select></div>)}
              {(frequence === 'mensuel' || frequence === 'trimestriel' || frequence === 'annuel') && (<div><label className="text-xs font-medium mb-1 block" style={textOnSecondary}>Jour du mois</label><select value={jourDuMois} onChange={(e) => setJourDuMois(parseInt(e.target.value))} className="w-full rounded-xl px-3 py-2.5 text-sm border" style={modalInputStyle}>{Array.from({ length: 31 }, (_, i) => i + 1).map((j) => (<option key={j} value={j}>{j}</option>))}</select></div>)}
              <div className="flex gap-3 pt-2"><button type="button" onClick={resetForm} className="flex-1 py-3 border rounded-xl font-medium text-sm" style={{ borderColor: theme.colors.textOnSecondary, color: theme.colors.textOnSecondary }}>Annuler</button><button type="submit" className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-4 h-4" />{editingId ? 'Modifier' : 'Ajouter'}</button></div>
            </form>
          ) : (
            <div className="space-y-3">
              {recurringList.length === 0 ? (<div className="text-center py-8"><Clock className="w-12 h-12 mx-auto mb-3" style={textOnSecondary} /><p className="text-sm" style={textOnSecondary}>Aucune transaction récurrente</p><p className="text-[10px] mt-1" style={textOnSecondary}>Ajoutez vos factures et revenus réguliers</p></div>) : (recurringList.map((r) => (<div key={r.id} className={`p-3 rounded-xl border transition-all ${!r.actif ? 'opacity-60' : ''}`} style={{ background: theme.colors.secondaryLight, borderColor: theme.colors.cardBorder }}><div className="flex items-start justify-between"><div className="flex-1 cursor-pointer" onClick={() => handleEdit(r)}><div className="flex items-center gap-2 mb-1"><span className="font-medium text-sm" style={textOnSecondary}>{r.nom}</span><span className={`text-[9px] px-1.5 py-0.5 rounded-full ${getTypeColor(r.type)}`}>{getTypeLabel(r.type)}</span></div><div className={`text-base font-bold ${getMontantColor(r.type)}`}>{getMontantSign(r.type)}{r.montant.toFixed(2)} €</div><div className="flex items-center gap-1 mt-1 text-[10px]" style={textOnSecondary}><Calendar className="w-3 h-3" />{getFrequenceDetail(r)}</div><div className="text-[9px] mt-0.5" style={textOnSecondary}>{r.categorie} • {r.compte}{r.moyenPaiement ? ` • ${r.moyenPaiement}` : ''}</div></div><div className="flex items-center gap-1"><button onClick={() => handleToggleActive(r.id, r.actif)}>{r.actif ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5" style={textSecondary} />}</button><button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-500/20"><Trash2 className="w-4 h-4 text-red-400" /></button></div></div></div>)))}
            </div>
          )}
        </div>
        {!showForm && (<div className="px-4 py-3 border-t" style={{ borderColor: theme.colors.cardBorder, background: theme.colors.secondary }}><button onClick={() => setShowForm(true)} className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Plus className="w-4 h-4" />Ajouter une récurrence</button></div>)}
      </div>
    </div>
  );
}
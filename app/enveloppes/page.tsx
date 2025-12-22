"use client";

import React, { useState, useEffect } from 'react';
import { Check, X, ChevronLeft, ChevronRight, Plus, Trash2, Edit3, Mail, ShoppingCart, Utensils, Fuel, ShoppingBag, Film, Heart, Gift, Plane, Coffee, Smartphone, Car, Zap, Star, Lock, Unlock, Eye, TrendingUp, TrendingDown, Calendar, BarChart3, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp, Home, Briefcase, GraduationCap, Baby, PawPrint, Dumbbell, Music, Gamepad2, Book, Scissors, Wrench, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips, PageTitle } from '@/components';

interface Enveloppe {
  id: number;
  nom: string;
  budget: number;
  couleur: string;
  icone: string;
  categories: string[];
  favorite?: boolean;
  locked?: boolean;
  reportReste?: boolean;
  budgetVariable?: { [mois: string]: number };
}

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  memo?: string;
}

interface ParametresData {
  devise: string;
  categoriesDepenses: string[];
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesEpargnes: string[];
  comptesBancaires: { id: number; nom: string }[];
}

const defaultParametres: ParametresData = {
  devise: '€',
  categoriesDepenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Loisirs', 'Santé', 'Cadeaux', 'Autres'],
  categoriesRevenus: ['Salaire', 'Revenus Secondaires', 'Allocations', 'Aides', 'Remboursement', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Assurances', 'Internet', 'Mobile', 'Abonnements', 'Crédits', 'Impôts'],
  categoriesEpargnes: ['Livret A', 'Épargne', 'Tirelire', 'Vacances', 'Projets'],
  comptesBancaires: [{ id: 1, nom: 'Compte Principal' }, { id: 2, nom: 'Livret A' }]
};

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

const couleursDisponibles = [
  { id: 'pastel-green', nom: 'Vert', bg: 'bg-green-200 dark:bg-green-900', border: 'border-green-400 dark:border-green-700', text: 'text-green-700 dark:text-green-300', progress: 'bg-green-400 dark:bg-green-500', hex: '#4ade80' },
  { id: 'pastel-blue', nom: 'Bleu', bg: 'bg-blue-200 dark:bg-blue-900', border: 'border-blue-400 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-300', progress: 'bg-blue-400 dark:bg-blue-500', hex: '#60a5fa' },
  { id: 'pastel-pink', nom: 'Rose', bg: 'bg-pink-200 dark:bg-pink-900', border: 'border-pink-400 dark:border-pink-700', text: 'text-pink-700 dark:text-pink-300', progress: 'bg-pink-400 dark:bg-pink-500', hex: '#f472b6' },
  { id: 'pastel-purple', nom: 'Violet', bg: 'bg-purple-200 dark:bg-purple-900', border: 'border-purple-400 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-300', progress: 'bg-purple-400 dark:bg-purple-500', hex: '#a78bfa' },
  { id: 'pastel-orange', nom: 'Orange', bg: 'bg-orange-200 dark:bg-orange-900', border: 'border-orange-400 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-300', progress: 'bg-orange-400 dark:bg-orange-500', hex: '#fb923c' },
  { id: 'pastel-yellow', nom: 'Jaune', bg: 'bg-yellow-200 dark:bg-yellow-900', border: 'border-yellow-400 dark:border-yellow-700', text: 'text-yellow-700 dark:text-yellow-300', progress: 'bg-yellow-400 dark:bg-yellow-500', hex: '#facc15' },
  { id: 'pastel-teal', nom: 'Turquoise', bg: 'bg-teal-200 dark:bg-teal-900', border: 'border-teal-400 dark:border-teal-700', text: 'text-teal-700 dark:text-teal-300', progress: 'bg-teal-400 dark:bg-teal-500', hex: '#2dd4bf' },
  { id: 'pastel-red', nom: 'Rouge', bg: 'bg-red-200 dark:bg-red-900', border: 'border-red-400 dark:border-red-700', text: 'text-red-700 dark:text-red-300', progress: 'bg-red-400 dark:bg-red-500', hex: '#f87171' },
  { id: 'pastel-indigo', nom: 'Indigo', bg: 'bg-indigo-200 dark:bg-indigo-900', border: 'border-indigo-400 dark:border-indigo-700', text: 'text-indigo-700 dark:text-indigo-300', progress: 'bg-indigo-400 dark:bg-indigo-500', hex: '#818cf8' },
  { id: 'pastel-cyan', nom: 'Cyan', bg: 'bg-cyan-200 dark:bg-cyan-900', border: 'border-cyan-400 dark:border-cyan-700', text: 'text-cyan-700 dark:text-cyan-300', progress: 'bg-cyan-400 dark:bg-cyan-500', hex: '#22d3ee' },
  { id: 'pastel-lime', nom: 'Lime', bg: 'bg-lime-200 dark:bg-lime-900', border: 'border-lime-400 dark:border-lime-700', text: 'text-lime-700 dark:text-lime-300', progress: 'bg-lime-400 dark:bg-lime-500', hex: '#a3e635' },
  { id: 'pastel-amber', nom: 'Ambre', bg: 'bg-amber-200 dark:bg-amber-900', border: 'border-amber-400 dark:border-amber-700', text: 'text-amber-700 dark:text-amber-300', progress: 'bg-amber-400 dark:bg-amber-500', hex: '#fbbf24' },
];

const iconesDisponibles = [
  { id: 'shopping-cart', nom: 'Courses', icon: ShoppingCart },
  { id: 'utensils', nom: 'Restaurant', icon: Utensils },
  { id: 'fuel', nom: 'Essence', icon: Fuel },
  { id: 'shopping-bag', nom: 'Shopping', icon: ShoppingBag },
  { id: 'film', nom: 'Loisirs', icon: Film },
  { id: 'heart', nom: 'Santé', icon: Heart },
  { id: 'gift', nom: 'Cadeaux', icon: Gift },
  { id: 'plane', nom: 'Voyages', icon: Plane },
  { id: 'coffee', nom: 'Café', icon: Coffee },
  { id: 'smartphone', nom: 'Tech', icon: Smartphone },
  { id: 'car', nom: 'Auto', icon: Car },
  { id: 'zap', nom: 'Énergie', icon: Zap },
  { id: 'home', nom: 'Maison', icon: Home },
  { id: 'briefcase', nom: 'Travail', icon: Briefcase },
  { id: 'graduation', nom: 'Études', icon: GraduationCap },
  { id: 'baby', nom: 'Bébé', icon: Baby },
  { id: 'pet', nom: 'Animaux', icon: PawPrint },
  { id: 'fitness', nom: 'Sport', icon: Dumbbell },
  { id: 'music', nom: 'Musique', icon: Music },
  { id: 'gaming', nom: 'Jeux', icon: Gamepad2 },
  { id: 'book', nom: 'Livres', icon: Book },
  { id: 'beauty', nom: 'Beauté', icon: Scissors },
  { id: 'repair', nom: 'Réparations', icon: Wrench },
  { id: 'internet', nom: 'Internet', icon: Wifi },
];

function EnveloppesContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [viewMode, setViewMode] = useState<'normal' | 'compact'>('normal');
  const [expandedEnveloppe, setExpandedEnveloppe] = useState<number | null>(null);
  const [showTransactions, setShowTransactions] = useState<number | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [formData, setFormData] = useState<{
    nom: string;
    budget: string;
    couleur: string;
    icone: string;
    categories: string[];
    favorite: boolean;
    locked: boolean;
    reportReste: boolean;
    budgetVariable: boolean;
    budgetsMensuels: { [mois: string]: string };
  }>({
    nom: '',
    budget: '',
    couleur: 'pastel-green',
    icone: 'shopping-cart',
    categories: [],
    favorite: false,
    locked: false,
    reportReste: false,
    budgetVariable: false,
    budgetsMensuels: {}
  });

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };
  const modalInputStyle = { background: theme.colors.secondaryLight, borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary };

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    const savedEnveloppes = localStorage.getItem('budget-enveloppes');
    if (savedEnveloppes) setEnveloppes(JSON.parse(savedEnveloppes));
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
  };

  const saveEnveloppes = (newEnveloppes: Enveloppe[]) => { setEnveloppes(newEnveloppes); localStorage.setItem('budget-enveloppes', JSON.stringify(newEnveloppes)); };
  const saveParametres = (newParametres: ParametresData) => { setParametres(newParametres); localStorage.setItem('budget-parametres', JSON.stringify(newParametres)); };

  const getMonthKey = (year?: number, month?: number) => { const y = year ?? selectedYear; const m = month ?? selectedMonth; return `${y}-${(m + 1).toString().padStart(2, '0')}`; };
  const getPreviousMonthKey = () => { let y = selectedYear; let m = selectedMonth - 1; if (m < 0) { m = 11; y--; } return getMonthKey(y, m); };
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getCurrentDay = () => new Date().getDate();

  const getDepensesEnveloppe = (enveloppe: Enveloppe, monthKey?: string) => {
    const mk = monthKey || getMonthKey();
    return transactions.filter(t => t.type === 'Dépenses' && t.date?.startsWith(mk) && enveloppe.categories.includes(t.categorie)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  };

  const getTransactionsEnveloppe = (enveloppe: Enveloppe) => transactions.filter(t => t.type === 'Dépenses' && t.date?.startsWith(getMonthKey()) && enveloppe.categories.includes(t.categorie)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getResteEnveloppeMoisPrecedent = (enveloppe: Enveloppe) => { const prevKey = getPreviousMonthKey(); const budgetPrec = getBudgetEnveloppe(enveloppe, prevKey); const depensePrec = getDepensesEnveloppe(enveloppe, prevKey); return Math.max(0, budgetPrec - depensePrec); };

  const getBudgetEnveloppe = (enveloppe: Enveloppe, monthKey?: string) => { const mk = monthKey || getMonthKey(); if (enveloppe.budgetVariable && enveloppe.budgetVariable[mk]) return enveloppe.budgetVariable[mk]; return enveloppe.budget; };

  const getBudgetEffectif = (enveloppe: Enveloppe) => { let budget = getBudgetEnveloppe(enveloppe); if (enveloppe.reportReste) budget += getResteEnveloppeMoisPrecedent(enveloppe); return budget; };

  const getMoyenne3Mois = (enveloppe: Enveloppe) => { const mois: number[] = []; for (let i = 1; i <= 3; i++) { let y = selectedYear; let m = selectedMonth - i; while (m < 0) { m += 12; y--; } mois.push(getDepensesEnveloppe(enveloppe, getMonthKey(y, m))); } return mois.reduce((a, b) => a + b, 0) / 3; };

  const getProjectionFinMois = (enveloppe: Enveloppe) => { const depenseActuelle = getDepensesEnveloppe(enveloppe); const jourActuel = getCurrentDay(); const joursTotal = getDaysInMonth(selectedYear, selectedMonth); if (jourActuel === 0) return 0; return (depenseActuelle / jourActuel) * joursTotal; };

  const getHistorique6Mois = (enveloppe: Enveloppe) => { const historique: { mois: string; depense: number; budget: number }[] = []; for (let i = 5; i >= 0; i--) { let y = selectedYear; let m = selectedMonth - i; while (m < 0) { m += 12; y--; } const mk = getMonthKey(y, m); historique.push({ mois: monthsShort[m], depense: getDepensesEnveloppe(enveloppe, mk), budget: getBudgetEnveloppe(enveloppe, mk) }); } return historique; };

  const getCouleur = (couleurId: string) => couleursDisponibles.find(c => c.id === couleurId) || couleursDisponibles[0];
  const getIcone = (iconeId: string) => iconesDisponibles.find(i => i.id === iconeId) || iconesDisponibles[0];

  const resetForm = () => { setFormData({ nom: '', budget: '', couleur: 'pastel-green', icone: 'shopping-cart', categories: [], favorite: false, locked: false, reportReste: false, budgetVariable: false, budgetsMensuels: {} }); setShowAddCategory(false); setNewCategoryName(''); };

  const handleAddCategory = () => { if (!newCategoryName.trim()) return; const newCat = newCategoryName.trim(); if (!parametres.categoriesDepenses.includes(newCat)) { saveParametres({ ...parametres, categoriesDepenses: [...parametres.categoriesDepenses, newCat] }); } setFormData({ ...formData, categories: [...formData.categories, newCat] }); setNewCategoryName(''); setShowAddCategory(false); };

  const handleSubmit = () => {
    if (!formData.nom || !formData.budget) return;
    const enveloppeData: Enveloppe = { id: editingId || Date.now(), nom: formData.nom, budget: parseFloat(formData.budget), couleur: formData.couleur, icone: formData.icone, categories: formData.categories, favorite: formData.favorite, locked: formData.locked, reportReste: formData.reportReste, budgetVariable: formData.budgetVariable ? Object.fromEntries(Object.entries(formData.budgetsMensuels).filter(([, v]) => v !== '').map(([k, v]) => [k, parseFloat(v)])) : undefined };
    if (editingId !== null) { saveEnveloppes(enveloppes.map(e => e.id === editingId ? enveloppeData : e)); setEditingId(null); } else { saveEnveloppes([...enveloppes, enveloppeData]); }
    resetForm(); setShowForm(false);
  };

  const handleEdit = (enveloppe: Enveloppe) => { setFormData({ nom: enveloppe.nom, budget: enveloppe.budget.toString(), couleur: enveloppe.couleur, icone: enveloppe.icone, categories: enveloppe.categories, favorite: enveloppe.favorite || false, locked: enveloppe.locked || false, reportReste: enveloppe.reportReste || false, budgetVariable: !!enveloppe.budgetVariable, budgetsMensuels: enveloppe.budgetVariable ? Object.fromEntries(Object.entries(enveloppe.budgetVariable).map(([k, v]) => [k, v.toString()])) : {} }); setEditingId(enveloppe.id); setShowForm(true); };
  const handleDelete = (id: number) => { if (confirm('Supprimer cette enveloppe ?')) saveEnveloppes(enveloppes.filter(e => e.id !== id)); };
  const toggleFavorite = (id: number) => { saveEnveloppes(enveloppes.map(e => e.id === id ? { ...e, favorite: !e.favorite } : e)); };
  const toggleLocked = (id: number) => { saveEnveloppes(enveloppes.map(e => e.id === id ? { ...e, locked: !e.locked } : e)); };
  const toggleCategorie = (cat: string) => { setFormData({ ...formData, categories: formData.categories.includes(cat) ? formData.categories.filter(c => c !== cat) : [...formData.categories, cat] }); };

  const sortedEnveloppes = [...enveloppes].sort((a, b) => { if (a.favorite && !b.favorite) return -1; if (!a.favorite && b.favorite) return 1; return 0; });
  const totalBudget = enveloppes.reduce((sum, e) => sum + getBudgetEffectif(e), 0);
  const totalDepense = enveloppes.reduce((sum, e) => sum + getDepensesEnveloppe(e), 0);
  const totalReste = totalBudget - totalDepense;

  const prevMonth = () => { if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); } else setSelectedMonth(selectedMonth - 1); };
  const nextMonth = () => { if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); } else setSelectedMonth(selectedMonth + 1); };
  const getAlertLevel = (pourcentage: number) => { if (pourcentage >= 100) return { level: 'danger', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500' }; if (pourcentage >= 80) return { level: 'warning', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500' }; if (pourcentage >= 50) return { level: 'info', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500' }; return { level: 'success', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500' }; };

  return (
    <div className="pb-4">
      <PageTitle page="enveloppes" />

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <div className="flex items-center justify-between mb-4"><button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5" style={textPrimary} /></button><div className="flex items-center gap-2"><span className="text-lg font-semibold" style={textPrimary}>{monthsFull[selectedMonth]}</span><select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="rounded-lg px-3 py-1 text-lg font-semibold border" style={inputStyle}>{years.map(year => (<option key={year} value={year}>{year}</option>))}</select></div><button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5" style={textPrimary} /></button></div>
        <div className="flex flex-wrap gap-2 justify-center">{monthsShort.map((month, index) => (<button key={index} onClick={() => setSelectedMonth(index)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" style={selectedMonth === index ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>{month}</button>))}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="backdrop-blur-sm rounded-2xl text-center p-3 border" style={cardStyle}><p className="text-[10px]" style={textSecondary}>Budget</p><p className="text-xs font-semibold" style={textPrimary}>{totalBudget.toFixed(0)}{parametres.devise}</p></div>
        <div className="backdrop-blur-sm rounded-2xl text-center p-3 border" style={cardStyle}><p className="text-[10px]" style={textSecondary}>Dépensé</p><p className="text-xs font-semibold text-red-400">{totalDepense.toFixed(0)}{parametres.devise}</p></div>
        <div className="backdrop-blur-sm rounded-2xl text-center p-3 border" style={cardStyle}><p className="text-[10px]" style={textSecondary}>Reste</p><p className={`text-xs font-semibold ${totalReste >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalReste.toFixed(0)}{parametres.devise}</p></div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Plus className="w-4 h-4" />Nouvelle enveloppe</button>
        <button onClick={() => setViewMode(viewMode === 'normal' ? 'compact' : 'normal')} className="px-3 py-3 rounded-xl border flex items-center gap-1 text-xs font-medium" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}>{viewMode === 'normal' ? (<><BarChart3 className="w-4 h-4" /> Compacte</>) : (<><Eye className="w-4 h-4" /> Détaillée</>)}</button>
      </div>

      {sortedEnveloppes.length > 0 ? (
        <div className="space-y-3 mb-4">
          {sortedEnveloppes.map((enveloppe) => {
            const couleur = getCouleur(enveloppe.couleur);
            const icone = getIcone(enveloppe.icone);
            const IconComponent = icone.icon;
            const budgetEffectif = getBudgetEffectif(enveloppe);
            const depense = getDepensesEnveloppe(enveloppe);
            const reste = budgetEffectif - depense;
            const pourcentage = budgetEffectif > 0 ? (depense / budgetEffectif) * 100 : 0;
            const alert = getAlertLevel(pourcentage);
            const AlertIcon = alert.icon;
            const moyenne3Mois = getMoyenne3Mois(enveloppe);
            const projection = getProjectionFinMois(enveloppe);
            const isExpanded = expandedEnveloppe === enveloppe.id;
            const transactionsLiees = getTransactionsEnveloppe(enveloppe);
            const historique = getHistorique6Mois(enveloppe);
            const reportMoisPrec = enveloppe.reportReste ? getResteEnveloppeMoisPrecedent(enveloppe) : 0;

            if (viewMode === 'compact') {
              return (<div key={enveloppe.id} className={`${couleur.bg} rounded-xl p-3 border ${couleur.border} flex items-center justify-between`}><div className="flex items-center gap-2">{enveloppe.favorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}{enveloppe.locked && <Lock className="w-3 h-3 text-gray-500" />}<IconComponent className={`w-4 h-4 ${couleur.text}`} /><span className={`text-sm font-medium ${couleur.text}`}>{enveloppe.nom}</span></div><div className="flex items-center gap-2"><span className={`text-sm font-semibold ${reste >= 0 ? couleur.text : 'text-red-600'}`}>{reste.toFixed(0)}{parametres.devise}</span><span className={`text-xs px-2 py-0.5 rounded-full ${alert.bg} text-white`}>{Math.round(pourcentage)}%</span></div></div>);
            }

            return (
              <div key={enveloppe.id} className={`${couleur.bg} rounded-2xl shadow-sm border ${couleur.border} overflow-hidden`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/30 border ${couleur.border}`}><IconComponent className={`w-5 h-5 ${couleur.text}`} /></div><div><div className="flex items-center gap-2">{enveloppe.favorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}{enveloppe.locked && <Lock className="w-3 h-3 text-gray-500" />}<p className={`text-sm font-semibold ${couleur.text}`}>{enveloppe.nom}</p></div><p className={`text-[10px] ${couleur.text} opacity-70`}>{enveloppe.categories.length} catégorie(s)</p></div></div>
                    <div className="flex items-center gap-1"><button onClick={() => toggleFavorite(enveloppe.id)} className="p-1.5 hover:bg-white/30 rounded-lg"><Star className={`w-4 h-4 ${enveloppe.favorite ? 'text-yellow-500 fill-yellow-500' : couleur.text}`} /></button><button onClick={() => toggleLocked(enveloppe.id)} className="p-1.5 hover:bg-white/30 rounded-lg">{enveloppe.locked ? <Lock className={`w-4 h-4 ${couleur.text}`} /> : <Unlock className={`w-4 h-4 ${couleur.text}`} />}</button><button onClick={() => handleEdit(enveloppe)} className="p-1.5 hover:bg-white/30 rounded-lg"><Edit3 className={`w-4 h-4 ${couleur.text}`} /></button><button onClick={() => handleDelete(enveloppe.id)} className="p-1.5 hover:bg-white/30 rounded-lg"><Trash2 className={`w-4 h-4 ${couleur.text}`} /></button></div>
                  </div>
                  {pourcentage >= 50 && (<div className={`flex items-center gap-2 mb-3 px-2 py-1 rounded-lg bg-white/30`}><AlertIcon className={`w-4 h-4 ${alert.color}`} /><span className={`text-[10px] font-medium ${alert.color}`}>{pourcentage >= 100 ? 'Budget dépassé !' : pourcentage >= 80 ? 'Attention, bientôt à court !' : '50% du budget utilisé'}</span></div>)}
                  <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-2"><div className={`h-full transition-all duration-500 ${pourcentage >= 100 ? 'bg-red-500' : pourcentage >= 80 ? 'bg-orange-400' : couleur.progress}`} style={{ width: `${Math.min(pourcentage, 100)}%` }} /></div>
                  <div className="flex justify-between items-center mb-2"><div className="flex gap-4"><div><p className={`text-[10px] ${couleur.text} opacity-60`}>Budget</p><p className={`text-xs font-medium ${couleur.text}`}>{budgetEffectif.toFixed(0)}{parametres.devise}{reportMoisPrec > 0 && <span className="text-[9px] opacity-70"> (+{reportMoisPrec.toFixed(0)})</span>}</p></div><div><p className={`text-[10px] ${couleur.text} opacity-60`}>Dépensé</p><p className={`text-xs font-medium ${couleur.text}`}>{depense.toFixed(0)}{parametres.devise}</p></div><div><p className={`text-[10px] ${couleur.text} opacity-60`}>Reste</p><p className={`text-xs font-medium ${reste >= 0 ? couleur.text : 'text-red-600'}`}>{reste.toFixed(0)}{parametres.devise}</p></div></div><div className={`px-2 py-1 rounded-full text-[10px] font-medium ${pourcentage >= 100 ? 'bg-red-500 text-white' : pourcentage >= 80 ? 'bg-orange-400 text-white' : 'bg-white/50 ' + couleur.text}`}>{Math.round(pourcentage)}%</div></div>
                  <button onClick={() => setExpandedEnveloppe(isExpanded ? null : enveloppe.id)} className={`w-full flex items-center justify-center gap-1 py-1 rounded-lg bg-white/20 ${couleur.text}`}>{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}<span className="text-[10px]">{isExpanded ? 'Moins' : 'Plus de détails'}</span></button>
                </div>
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2"><div className="bg-white/20 rounded-xl p-2"><div className="flex items-center gap-1 mb-1"><TrendingDown className={`w-3 h-3 ${couleur.text}`} /><span className={`text-[9px] ${couleur.text} opacity-70`}>Moyenne 3 mois</span></div><p className={`text-xs font-semibold ${couleur.text}`}>{moyenne3Mois.toFixed(0)}{parametres.devise}</p></div><div className="bg-white/20 rounded-xl p-2"><div className="flex items-center gap-1 mb-1"><Calendar className={`w-3 h-3 ${couleur.text}`} /><span className={`text-[9px] ${couleur.text} opacity-70`}>Projection fin mois</span></div><p className={`text-xs font-semibold ${projection > budgetEffectif ? 'text-red-600' : couleur.text}`}>{projection.toFixed(0)}{parametres.devise}</p></div></div>
                    <div className="bg-white/20 rounded-xl p-3"><div className="flex items-center gap-1 mb-2"><BarChart3 className={`w-3 h-3 ${couleur.text}`} /><span className={`text-[10px] font-medium ${couleur.text}`}>Historique 6 mois</span></div><div className="flex justify-between items-end h-16">{historique.map((h, i) => { const maxVal = Math.max(...historique.map(x => Math.max(x.depense, x.budget))); const heightPct = maxVal > 0 ? (h.depense / maxVal) * 100 : 0; const isOver = h.depense > h.budget; return (<div key={i} className="flex flex-col items-center gap-1 flex-1"><div className="w-full px-0.5"><div className={`w-full rounded-t ${isOver ? 'bg-red-400' : couleur.progress}`} style={{ height: `${Math.max(heightPct, 4)}%`, minHeight: '4px' }} /></div><span className={`text-[8px] ${couleur.text}`}>{h.mois}</span></div>); })}</div></div>
                    <div className="bg-white/20 rounded-xl p-3"><button onClick={() => setShowTransactions(showTransactions === enveloppe.id ? null : enveloppe.id)} className="w-full flex items-center justify-between"><span className={`text-[10px] font-medium ${couleur.text}`}>Transactions ({transactionsLiees.length})</span>{showTransactions === enveloppe.id ? <ChevronUp className={`w-4 h-4 ${couleur.text}`} /> : <ChevronDown className={`w-4 h-4 ${couleur.text}`} />}</button>{showTransactions === enveloppe.id && (<div className="mt-2 space-y-1 max-h-32 overflow-y-auto">{transactionsLiees.length > 0 ? transactionsLiees.map(t => (<div key={t.id} className="flex justify-between items-center py-1 border-b border-white/20 last:border-0"><div><p className={`text-[10px] font-medium ${couleur.text}`}>{t.categorie}</p><p className={`text-[8px] ${couleur.text} opacity-60`}>{t.date}</p></div><span className={`text-[10px] font-semibold ${couleur.text}`}>-{parseFloat(t.montant).toFixed(2)}{parametres.devise}</span></div>)) : (<p className={`text-[10px] ${couleur.text} opacity-60 text-center py-2`}>Aucune transaction ce mois</p>)}</div>)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="backdrop-blur-sm rounded-2xl text-center py-8 mb-4 border" style={cardStyle}><Mail className="w-12 h-12 mx-auto mb-3" style={textSecondary} /><p className="text-xs mb-2" style={textSecondary}>Aucune enveloppe</p><p className="text-[10px]" style={textSecondary}>Créez votre première enveloppe</p></div>
      )}

      {/* SmartTips remplace l'ancienne carte conseils */}
      <SmartTips page="enveloppes" />

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="rounded-2xl p-4 w-full max-w-md border mb-20 mt-20" style={{ background: theme.colors.secondary, borderColor: theme.colors.cardBorder }}>
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-medium" style={{ color: theme.colors.textOnSecondary }}>{editingId ? 'Modifier' : 'Nouvelle'} enveloppe</h2><button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="p-1"><X className="w-5 h-5" style={{ color: theme.colors.textOnSecondary }} /></button></div>
            <div className="space-y-4">
              <div><label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Nom de l&apos;enveloppe</label><input type="text" placeholder="Ex: Courses, Restaurant..." value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle} /></div>
              <div><label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Budget mensuel ({parametres.devise})</label><input type="number" placeholder="0" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle} /></div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl" style={{ background: theme.colors.secondaryLight }}><div className="flex items-center gap-2"><Star className="w-4 h-4" style={{ color: theme.colors.textOnSecondary }} /><span className="text-xs" style={{ color: theme.colors.textOnSecondary }}>Favorite</span></div><button onClick={() => setFormData({ ...formData, favorite: !formData.favorite })} className={`w-10 h-5 rounded-full transition-colors ${formData.favorite ? 'bg-yellow-500' : 'bg-gray-400'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.favorite ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
                <div className="flex items-center justify-between p-2 rounded-xl" style={{ background: theme.colors.secondaryLight }}><div className="flex items-center gap-2"><Lock className="w-4 h-4" style={{ color: theme.colors.textOnSecondary }} /><span className="text-xs" style={{ color: theme.colors.textOnSecondary }}>Verrouillable à 100%</span></div><button onClick={() => setFormData({ ...formData, locked: !formData.locked })} className={`w-10 h-5 rounded-full transition-colors ${formData.locked ? 'bg-red-500' : 'bg-gray-400'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.locked ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
                <div className="flex items-center justify-between p-2 rounded-xl" style={{ background: theme.colors.secondaryLight }}><div className="flex items-center gap-2"><TrendingUp className="w-4 h-4" style={{ color: theme.colors.textOnSecondary }} /><span className="text-xs" style={{ color: theme.colors.textOnSecondary }}>Reporter le reste</span></div><button onClick={() => setFormData({ ...formData, reportReste: !formData.reportReste })} className={`w-10 h-5 rounded-full transition-colors ${formData.reportReste ? 'bg-green-500' : 'bg-gray-400'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.reportReste ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
                <div className="flex items-center justify-between p-2 rounded-xl" style={{ background: theme.colors.secondaryLight }}><div className="flex items-center gap-2"><Calendar className="w-4 h-4" style={{ color: theme.colors.textOnSecondary }} /><span className="text-xs" style={{ color: theme.colors.textOnSecondary }}>Budget variable par mois</span></div><button onClick={() => setFormData({ ...formData, budgetVariable: !formData.budgetVariable })} className={`w-10 h-5 rounded-full transition-colors ${formData.budgetVariable ? 'bg-blue-500' : 'bg-gray-400'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.budgetVariable ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
              </div>
              {formData.budgetVariable && (<div className="p-3 rounded-xl border" style={{ background: theme.colors.secondaryLight, borderColor: theme.colors.cardBorder }}><p className="text-[10px] mb-2" style={{ color: theme.colors.textOnSecondary }}>Budget par mois (laissez vide pour le budget par défaut)</p><div className="grid grid-cols-3 gap-2">{monthsShort.map((m, i) => { const key = `${selectedYear}-${(i + 1).toString().padStart(2, '0')}`; return (<div key={i}><label className="text-[9px]" style={{ color: theme.colors.textOnSecondary }}>{m}</label><input type="number" placeholder={formData.budget || '0'} value={formData.budgetsMensuels[key] || ''} onChange={(e) => setFormData({ ...formData, budgetsMensuels: { ...formData.budgetsMensuels, [key]: e.target.value } })} className="w-full rounded-lg px-2 py-1 text-xs border" style={modalInputStyle} /></div>); })}</div></div>)}
              <div><label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Couleur</label><div className="grid grid-cols-6 gap-2">{couleursDisponibles.map((couleur) => (<button key={couleur.id} onClick={() => setFormData({ ...formData, couleur: couleur.id })} className={`h-8 rounded-lg ${couleur.bg} border-2 ${formData.couleur === couleur.id ? 'ring-2 ring-offset-1' : couleur.border}`} style={formData.couleur === couleur.id ? { borderColor: theme.colors.primary } : {}} />))}</div></div>
              <div><label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Icône</label><div className="grid grid-cols-8 gap-1">{iconesDisponibles.map((icone) => { const IconComp = icone.icon; return (<button key={icone.id} onClick={() => setFormData({ ...formData, icone: icone.id })} className="h-8 rounded-lg flex items-center justify-center border" style={formData.icone === icone.id ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } : { background: theme.colors.secondaryLight, borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}><IconComp className="w-4 h-4" /></button>); })}</div></div>
              <div><div className="flex items-center justify-between mb-1"><label className="text-xs font-medium" style={{ color: theme.colors.textOnSecondary }}>Catégories liées ({formData.categories.length})</label></div>{!showAddCategory ? (<button onClick={() => setShowAddCategory(true)} className="w-full mb-2 flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed text-xs" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}><Plus className="w-3 h-3" /> Ajouter une catégorie</button>) : (<div className="flex gap-2 mb-2"><input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nouvelle catégorie..." className="flex-1 rounded-lg px-3 py-2 text-sm border" style={modalInputStyle} autoFocus /><button onClick={handleAddCategory} className="px-3 py-2 rounded-lg" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-4 h-4" /></button><button onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }} className="px-3 py-2 rounded-lg border" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}><X className="w-4 h-4" /></button></div>)}<div className="max-h-40 overflow-y-auto rounded-xl p-2 space-y-1" style={{ background: theme.colors.secondaryLight }}>{parametres.categoriesDepenses.map((cat) => (<button key={cat} onClick={() => toggleCategorie(cat)} className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors" style={formData.categories.includes(cat) ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, fontWeight: 500 } : { color: theme.colors.textOnSecondary }}>{cat}</button>))}</div></div>
              <div className="flex gap-3 pt-2"><button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="flex-1 py-3 rounded-xl font-medium border" style={{ borderColor: theme.colors.textOnSecondary, color: theme.colors.textOnSecondary }}>Annuler</button><button onClick={handleSubmit} className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-5 h-5" />{editingId ? 'Modifier' : 'Créer'}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EnveloppesPage() {
  const router = useRouter();
  const handleNavigate = (page: string) => { if (page === 'accueil') router.push('/'); else router.push(`/${page}`); };
  return (<AppShell currentPage="enveloppes" onNavigate={handleNavigate}><EnveloppesContent /></AppShell>);
}

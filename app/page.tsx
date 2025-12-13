"use client";

import { useState, useEffect } from 'react';
import { Header, BottomNav, Sidebar } from '@/components';
import { ChevronLeft, ChevronRight, TrendingUp, Home as HomeIcon, Mail, PiggyBank, Sun, Target, PieChart, CheckSquare, Sparkles, Pencil, X, Check, Plus, Trash2, Edit3, ShoppingCart, Utensils, Fuel, ShoppingBag, Film, Heart, Gift, Plane, Coffee, Smartphone, Car, Zap, ChevronDown, ChevronUp, Building, Upload, RefreshCw, FileText, Database, Lightbulb, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import TransactionsPage from './transactions/page';
import BudgetPage from './budget/page';
import MemoPage from './memo/page';
import PlusPage from './plus/page';
import PrevisionnelPage from './previsionnel/page';
import EpargnesPage from './epargnes/page';
import StatistiquesPage from './statistiques/page';
import CreditsDettesPageFull from './credits-dettes/page';
import ObjectifsPageFull from './objectifs/page';
import { useTheme } from '../contexts/theme-context';
import { ThemeModal } from '@/components/theme-modal';

interface Transaction {
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

interface Enveloppe {
  id: number;
  nom: string;
  budget: number;
  couleur: string;
  icone: string;
  categories: string[];
}

interface CompteBancaire {
  id: number;
  nom: string;
  soldeDepart: number;
  isEpargne: boolean;
}

interface ParametresData {
  dateDepart: string;
  budgetAvantPremier: boolean;
  devise: string;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  categoriesEpargnes: string[];
  comptesBancaires: CompteBancaire[];
}

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

const defaultParametres: ParametresData = {
  dateDepart: new Date().toISOString().split('T')[0],
  budgetAvantPremier: false,
  devise: '€',
  categoriesRevenus: ['Salaire', 'Revenus Secondaires', 'Allocations', 'Aides', 'Remboursement', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Assurance', 'Internet', 'Mobile', 'Abonnements', 'Crédits', 'Impôts'],
  categoriesDepenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Loisirs', 'Santé', 'Cadeaux', 'Autres'],
  categoriesEpargnes: ['Livret A', 'Épargne', 'Tirelire', 'Vacances', 'Projets'],
  comptesBancaires: [
    { id: 1, nom: 'Compte Principal', soldeDepart: 0, isEpargne: false },
    { id: 2, nom: 'Livret A', soldeDepart: 0, isEpargne: true },
  ]
};

function useParametres() {
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  useEffect(() => {
    const saved = localStorage.getItem('budget-parametres');
    if (saved) setParametres({ ...defaultParametres, ...JSON.parse(saved) });
  }, []);
  const saveParametres = (newParametres: ParametresData) => {
    setParametres(newParametres);
    localStorage.setItem('budget-parametres', JSON.stringify(newParametres));
  };
  return { parametres, saveParametres };
}

function AccueilPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { theme } = useTheme();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userName, setUserName] = useState('Utilisateur');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const { parametres } = useParametres();

  useEffect(() => {
    const saved = localStorage.getItem('budget-transactions');
    if (saved) setTransactions(JSON.parse(saved));
    const savedName = localStorage.getItem('budget-user-name');
    if (savedName) setUserName(savedName);
  }, []);

  const saveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('budget-user-name', tempName.trim());
    }
    setIsEditingName(false);
  };

  const startEditName = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const getMonthKey = () => `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
  const filteredTransactions = transactions.filter(t => t.date?.startsWith(getMonthKey()));
  const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalFactures = filteredTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalDepenses = filteredTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEpargnes = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const budgetPrevu = totalRevenus - totalFactures;
  const reposPrevu = totalRevenus - totalFactures - totalEpargnes;
  const soldeReel = totalRevenus - totalFactures - totalDepenses - totalEpargnes;

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); }
    else setSelectedMonth(selectedMonth - 1);
  };

  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); }
    else setSelectedMonth(selectedMonth + 1);
  };

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  return (
    <div className="pb-4">
      <div className="text-center mb-2">
        <div className="w-24 h-24 mx-auto mb-2 rounded-2xl overflow-hidden shadow-lg border-2" style={{ borderColor: theme.colors.cardBorder }}>
          <Image src="/logo-shina5.png" alt="Logo" width={96} height={96} className="w-full h-full object-cover" priority />
        </div>
      </div>

      <div className="text-center mb-4">
        {isEditingName ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-semibold" style={textPrimary}>Bonjour</span>
            <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="text-xl font-semibold rounded-xl px-3 py-1 w-32 text-center border" style={{ background: theme.colors.cardBackgroundLight, color: theme.colors.textPrimary, borderColor: theme.colors.primary }} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setIsEditingName(false); }} />
            <button onClick={saveName} className="p-1 rounded-full border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}><Check className="w-4 h-4" style={textPrimary} /></button>
            <button onClick={() => setIsEditingName(false)} className="p-1 rounded-full border" style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder }}><X className="w-4 h-4" style={textPrimary} /></button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-lg font-semibold" style={textPrimary}>Bonjour {userName} 👋</h1>
            <button onClick={startEditName} className="p-1 hover:opacity-80 rounded-full"><Pencil className="w-4 h-4" style={textSecondary} /></button>
          </div>
        )}
        <p className="text-xs mt-1 text-center" style={textSecondary}>Bienvenue sur The Budget Planner</p>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5" style={textPrimary} /></button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold" style={textPrimary}>{monthsFull[selectedMonth]}</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="rounded-lg px-3 py-1 text-lg font-semibold border" style={{ background: theme.colors.cardBackgroundLight, color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5" style={textPrimary} /></button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {monthsShort.map((month, index) => (
            <button key={index} onClick={() => setSelectedMonth(index)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" style={selectedMonth === index ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>{month}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {[ 
          { title: 'Revenus prévus', amount: totalRevenus, sub: `Reçus : ${totalRevenus.toFixed(2)} ${parametres.devise}`, icon: TrendingUp },
          { title: 'Dépenses fixes', amount: totalFactures, sub: `Payées : ${totalFactures.toFixed(2)} ${parametres.devise}`, icon: HomeIcon },
          { title: 'Enveloppes budgétaires', amount: budgetPrevu, sub: `Dépensé : ${totalDepenses.toFixed(2)} ${parametres.devise}`, icon: Mail },
          { title: 'Épargne CT prévu', amount: totalEpargnes, sub: `Versé : ${totalEpargnes.toFixed(2)} ${parametres.devise}`, icon: PiggyBank },
          { title: 'Repos prévu', amount: reposPrevu, sub: 'Après budget prévu', icon: Sun, hasCheck: true },
          { title: 'Solde réel', amount: soldeReel, sub: 'Dépenses réelles', icon: Sparkles, hasCheck: true },
        ].map((item, idx) => (
          <div key={idx} className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs" style={textSecondary}>{item.title}</p>
                <p className="text-2xl font-semibold mt-1" style={textPrimary}>{item.amount.toFixed(2)} {parametres.devise}</p>
                {item.hasCheck ? (
                  <div className="flex items-center gap-1 mt-1"><CheckSquare className="w-3 h-3" style={textSecondary} /><p className="text-[10px]" style={textSecondary}>{item.sub}</p></div>
                ) : (
                  <p className="text-[10px] mt-1" style={textSecondary}>{item.sub}</p>
                )}
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
                <item.icon className="w-5 h-5" style={textPrimary} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-4">
        {[ 
          { page: 'budget', title: 'Mon budget', sub: 'Vue d\'ensemble', icon: PieChart },
          { page: 'objectifs', title: 'Mes Objectifs', sub: 'Économiseur', icon: Target },
          { page: 'enveloppes', title: 'Mes enveloppes', sub: 'Gérer mes enveloppes', icon: Mail },
        ].map((item, idx) => (
          <button key={idx} onClick={() => onNavigate(item.page)} className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border w-full flex items-center gap-4" style={cardStyle}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
              <item.icon className="w-6 h-6" style={textPrimary} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold" style={textPrimary}>{item.title}</p>
              <p className="text-[10px]" style={textSecondary}>{item.sub}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50">
        <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-[#7DD3A8]" /><h4 className="text-xs font-semibold text-[#7DD3A8]">💡 Conseils du mois</h4></div>
        <div className="space-y-2">
          {totalRevenus === 0 && (<p className="text-[10px] text-[#7DD3A8]">📝 Ajoutez vos revenus pour commencer votre budget</p>)}
          {totalRevenus > 0 && totalEpargnes === 0 && (<p className="text-[10px] text-[#7DD3A8]">💰 Pensez à épargner au moins 10% ({(totalRevenus * 0.1).toFixed(0)} {parametres.devise})</p>)}
          {soldeReel < 0 && (<p className="text-[10px] text-[#7DD3A8]">⚠️ Attention ! Solde négatif de {Math.abs(soldeReel).toFixed(2)} {parametres.devise}</p>)}
          {soldeReel > 0 && totalEpargnes > 0 && (<p className="text-[10px] text-[#7DD3A8]">✅ Bravo ! Vous gérez bien votre budget ce mois</p>)}
          {filteredTransactions.length === 0 && (<p className="text-[10px] text-[#7DD3A8]">📊 Aucune transaction ce mois. Commencez à enregistrer !</p>)}
        </div>
      </div>
    </div>
  );
}

function EnveloppesPage() {
  const { theme } = useTheme();
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const { parametres } = useParametres();
  const [formData, setFormData] = useState({ nom: '', budget: '', couleur: 'pastel-green', icone: 'shopping-cart', categories: [] as string[] });

  const couleursDisponibles = [
    { id: 'pastel-green', nom: 'Vert', bg: 'bg-green-200 dark:bg-green-900', border: 'border-green-400 dark:border-green-700', text: 'text-green-700 dark:text-green-300', progress: 'bg-green-400 dark:bg-green-500' },
    { id: 'pastel-blue', nom: 'Bleu', bg: 'bg-blue-200 dark:bg-blue-900', border: 'border-blue-400 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-300', progress: 'bg-blue-400 dark:bg-blue-500' },
    { id: 'pastel-pink', nom: 'Rose', bg: 'bg-pink-200 dark:bg-pink-900', border: 'border-pink-400 dark:border-pink-700', text: 'text-pink-700 dark:text-pink-300', progress: 'bg-pink-400 dark:bg-pink-500' },
    { id: 'pastel-purple', nom: 'Violet', bg: 'bg-purple-200 dark:bg-purple-900', border: 'border-purple-400 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-300', progress: 'bg-purple-400 dark:bg-purple-500' },
    { id: 'pastel-orange', nom: 'Orange', bg: 'bg-orange-200 dark:bg-orange-900', border: 'border-orange-400 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-300', progress: 'bg-orange-400 dark:bg-orange-500' },
    { id: 'pastel-yellow', nom: 'Jaune', bg: 'bg-yellow-200 dark:bg-yellow-900', border: 'border-yellow-400 dark:border-yellow-700', text: 'text-yellow-700 dark:text-yellow-300', progress: 'bg-yellow-400 dark:bg-yellow-500' },
    { id: 'pastel-teal', nom: 'Turquoise', bg: 'bg-teal-200 dark:bg-teal-900', border: 'border-teal-400 dark:border-teal-700', text: 'text-teal-700 dark:text-teal-300', progress: 'bg-teal-400 dark:bg-teal-500' },
    { id: 'pastel-red', nom: 'Rouge', bg: 'bg-red-200 dark:bg-red-900', border: 'border-red-400 dark:border-red-700', text: 'text-red-700 dark:text-red-300', progress: 'bg-red-400 dark:bg-red-500' },
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
  ];

  useEffect(() => {
    const savedEnveloppes = localStorage.getItem('budget-enveloppes');
    if (savedEnveloppes) setEnveloppes(JSON.parse(savedEnveloppes));
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  const saveEnveloppes = (newEnveloppes: Enveloppe[]) => {
    setEnveloppes(newEnveloppes);
    localStorage.setItem('budget-enveloppes', JSON.stringify(newEnveloppes));
  };

  const getMonthKey = () => `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
  const getDepensesEnveloppe = (enveloppe: Enveloppe) => transactions.filter(t => t.type === 'Dépenses' && t.date?.startsWith(getMonthKey()) && enveloppe.categories.includes(t.categorie)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const getCouleur = (couleurId: string) => couleursDisponibles.find(c => c.id === couleurId) || couleursDisponibles[0];
  const getIcone = (iconeId: string) => iconesDisponibles.find(i => i.id === iconeId) || iconesDisponibles[0];
  const resetForm = () => setFormData({ nom: '', budget: '', couleur: 'pastel-green', icone: 'shopping-cart', categories: [] });

  const handleSubmit = () => {
    if (!formData.nom || !formData.budget) return;
    if (editingId !== null) {
      saveEnveloppes(enveloppes.map(e => e.id === editingId ? { ...formData, id: editingId, budget: parseFloat(formData.budget) } : e));
      setEditingId(null);
    } else {
      saveEnveloppes([...enveloppes, { ...formData, id: Date.now(), budget: parseFloat(formData.budget) }]);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (enveloppe: Enveloppe) => {
    setFormData({ nom: enveloppe.nom, budget: enveloppe.budget.toString(), couleur: enveloppe.couleur, icone: enveloppe.icone, categories: enveloppe.categories });
    setEditingId(enveloppe.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => saveEnveloppes(enveloppes.filter(e => e.id !== id));
  const toggleCategorie = (cat: string) => setFormData({ ...formData, categories: formData.categories.includes(cat) ? formData.categories.filter(c => c !== cat) : [...formData.categories, cat] });

  const totalBudget = enveloppes.reduce((sum, e) => sum + e.budget, 0);
  const totalDepense = enveloppes.reduce((sum, e) => sum + getDepensesEnveloppe(e), 0);
  const totalReste = totalBudget - totalDepense;

  const prevMonth = () => { if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); } else setSelectedMonth(selectedMonth - 1); };
  const nextMonth = () => { if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); } else setSelectedMonth(selectedMonth + 1); };

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  return (
    <div className="pb-4">
      <div className="text-center mb-4">
        <h1 className="text-lg font-medium" style={textPrimary}>Enveloppes</h1>
        <p className="text-xs" style={textSecondary}>Gestion des enveloppes budgétaires</p>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5" style={textPrimary} /></button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold" style={textPrimary}>{monthsFull[selectedMonth]}</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="rounded-lg px-3 py-1 text-lg font-semibold border" style={inputStyle}>
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5" style={textPrimary} /></button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {monthsShort.map((month, index) => (
            <button key={index} onClick={() => setSelectedMonth(index)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" style={selectedMonth === index ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>{month}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="backdrop-blur-sm rounded-2xl text-center p-3 border" style={cardStyle}>
          <p className="text-[10px]" style={textSecondary}>Budget</p>
          <p className="text-xs font-semibold" style={textPrimary}>{totalBudget.toFixed(0)}{parametres.devise}</p>
        </div>
        <div className="backdrop-blur-sm rounded-2xl text-center p-3 border" style={cardStyle}>
          <p className="text-[10px]" style={textSecondary}>Dépensé</p>
          <p className="text-xs font-semibold" style={textPrimary}>{totalDepense.toFixed(0)}{parametres.devise}</p>
        </div>
        <div className="backdrop-blur-sm rounded-2xl text-center p-3 border" style={cardStyle}>
          <p className="text-[10px]" style={textSecondary}>Reste</p>
          <p className={`text-xs font-semibold ${totalReste >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalReste.toFixed(0)}{parametres.devise}</p>
        </div>
      </div>

      <button onClick={() => { resetForm(); setShowForm(true); }} className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}>
        <Plus className="w-4 h-4" />Nouvelle enveloppe
      </button>

      {enveloppes.length > 0 ? (
        <div className="space-y-3 mb-4">
          {enveloppes.map((enveloppe) => {
            const couleur = getCouleur(enveloppe.couleur);
            const icone = getIcone(enveloppe.icone);
            const IconComponent = icone.icon;
            const depense = getDepensesEnveloppe(enveloppe);
            const reste = enveloppe.budget - depense;
            const pourcentage = enveloppe.budget > 0 ? (depense / enveloppe.budget) * 100 : 0;
            const isOverBudget = pourcentage > 100;
            const isWarning = pourcentage >= 80 && pourcentage <= 100;
            return (
              <div key={enveloppe.id} className={`${couleur.bg} rounded-2xl p-4 shadow-sm border ${couleur.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${couleur.bg} border ${couleur.border}`}>
                      <IconComponent className={`w-5 h-5 ${couleur.text}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${couleur.text}`}>{enveloppe.nom}</p>
                      <p className={`text-[10px] ${couleur.text} opacity-70`}>{enveloppe.categories.length} catégorie(s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(enveloppe)} className="p-1.5 hover:bg-white/30 rounded-lg"><Edit3 className={`w-4 h-4 ${couleur.text}`} /></button>
                    <button onClick={() => handleDelete(enveloppe.id)} className="p-1.5 hover:bg-white/30 rounded-lg"><Trash2 className={`w-4 h-4 ${couleur.text}`} /></button>
                  </div>
                </div>
                <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-2">
                  <div className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : isWarning ? 'bg-orange-400' : couleur.progress}`} style={{ width: `${Math.min(pourcentage, 100)}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div><p className={`text-[10px] ${couleur.text} opacity-60`}>Budget</p><p className={`text-xs font-medium ${couleur.text}`}>{enveloppe.budget.toFixed(0)}{parametres.devise}</p></div>
                    <div><p className={`text-[10px] ${couleur.text} opacity-60`}>Dépensé</p><p className={`text-xs font-medium ${couleur.text}`}>{depense.toFixed(0)}{parametres.devise}</p></div>
                    <div><p className={`text-[10px] ${couleur.text} opacity-60`}>Reste</p><p className={`text-xs font-medium ${reste >= 0 ? couleur.text : 'text-red-600'}`}>{reste.toFixed(0)}{parametres.devise}</p></div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-[10px] font-medium ${isOverBudget ? 'bg-red-500 text-white' : isWarning ? 'bg-orange-400 text-white' : 'bg-white/50 ' + couleur.text}`}>{Math.round(pourcentage)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="backdrop-blur-sm rounded-2xl text-center py-8 mb-4 border" style={cardStyle}>
          <Mail className="w-12 h-12 mx-auto mb-3" style={textSecondary} />
          <p className="text-xs mb-2" style={textSecondary}>Aucune enveloppe</p>
          <p className="text-[10px]" style={textSecondary}>Créez votre première enveloppe</p>
        </div>
      )}

      <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50">
        <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-[#7DD3A8]" /><h4 className="text-xs font-semibold text-[#7DD3A8]">💡 Conseils</h4></div>
        <div className="space-y-2">
          {enveloppes.length === 0 && (<p className="text-[10px] text-[#7DD3A8]">📝 Créez des enveloppes pour mieux gérer vos dépenses</p>)}
          {totalReste < 0 && (<p className="text-[10px] text-[#7DD3A8]">⚠️ Attention ! Vous avez dépassé votre budget</p>)}
          {totalReste > 0 && enveloppes.length > 0 && (<p className="text-[10px] text-[#7DD3A8]">✅ Il vous reste {totalReste.toFixed(0)}{parametres.devise} sur vos enveloppes</p>)}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="rounded-2xl p-4 w-full max-w-md border mb-20 mt-20" style={{ background: theme.colors.secondary, borderColor: theme.colors.cardBorder }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium" style={textPrimary}>{editingId ? 'Modifier' : 'Nouvelle'} enveloppe</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1"><X className="w-5 h-5" style={textPrimary} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Nom de l\'enveloppe</label>
                <input type="text" placeholder="Ex: Courses, Restaurant..." value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Budget mensuel ({parametres.devise})</label>
                <input type="number" placeholder="0" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Couleur</label>
                <div className="grid grid-cols-4 gap-2">
                  {couleursDisponibles.map((couleur) => (
                    <button key={couleur.id} onClick={() => setFormData({ ...formData, couleur: couleur.id })} className={`h-10 rounded-xl ${couleur.bg} border-2 ${formData.couleur === couleur.id ? 'ring-2 ring-offset-2' : couleur.border}`} style={formData.couleur === couleur.id ? { borderColor: theme.colors.primary } : {}} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Icône</label>
                <div className="grid grid-cols-6 gap-2">
                  {iconesDisponibles.map((icone) => {
                    const IconComp = icone.icon;
                    return (
                      <button key={icone.id} onClick={() => setFormData({ ...formData, icone: icone.id })} className="h-10 rounded-xl flex items-center justify-center border" style={formData.icone === icone.id ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } : { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}>
                        <IconComp className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Catégories liées ({formData.categories.length})</label>
                <div className="max-h-40 overflow-y-auto rounded-xl p-2 space-y-1" style={{ background: theme.colors.cardBackground }}>
                  {parametres.categoriesDepenses.map((cat) => (
                    <button key={cat} onClick={() => toggleCategorie(cat)} className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors" style={formData.categories.includes(cat) ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, fontWeight: 500 } : { color: theme.colors.textPrimary }}>{cat}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 py-3 rounded-xl font-medium border" style={{ borderColor: theme.colors.primary, color: theme.colors.textPrimary }}>Annuler</button>
                <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-5 h-5" />{editingId ? 'Modifier' : 'Créer'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ParametresPage() {
  const { theme } = useTheme();
  const { parametres, saveParametres } = useParametres();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [newCategorie, setNewCategorie] = useState('');
  const [editingCompte, setEditingCompte] = useState<CompteBancaire | null>(null);
  const [showCompteForm, setShowCompteForm] = useState(false);
  const [compteForm, setCompteForm] = useState({ nom: '', soldeDepart: '', isEpargne: false });

  const toggleSection = (section: string) => setActiveSection(activeSection === section ? null : section);

  const addCategorie = (type: 'categoriesRevenus' | 'categoriesFactures' | 'categoriesDepenses' | 'categoriesEpargnes') => {
    if (!newCategorie.trim()) return;
    saveParametres({ ...parametres, [type]: [...parametres[type], newCategorie.trim()] });
    setNewCategorie('');
  };

  const removeCategorie = (type: 'categoriesRevenus' | 'categoriesFactures' | 'categoriesDepenses' | 'categoriesEpargnes', index: number) => {
    saveParametres({ ...parametres, [type]: parametres[type].filter((_, i) => i !== index) });
  };

  const handleCompteSubmit = () => {
    if (!compteForm.nom) return;
    if (editingCompte) {
      const updated = parametres.comptesBancaires.map(c => c.id === editingCompte.id ? { ...editingCompte, nom: compteForm.nom, soldeDepart: parseFloat(compteForm.soldeDepart) || 0, isEpargne: compteForm.isEpargne } : c);
      saveParametres({ ...parametres, comptesBancaires: updated });
    } else {
      const newCompte: CompteBancaire = { id: Date.now(), nom: compteForm.nom, soldeDepart: parseFloat(compteForm.soldeDepart) || 0, isEpargne: compteForm.isEpargne };
      saveParametres({ ...parametres, comptesBancaires: [...parametres.comptesBancaires, newCompte] });
    }
    setCompteForm({ nom: '', soldeDepart: '', isEpargne: false });
    setEditingCompte(null);
    setShowCompteForm(false);
  };

  const editCompte = (compte: CompteBancaire) => {
    setEditingCompte(compte);
    setCompteForm({ nom: compte.nom, soldeDepart: compte.soldeDepart.toString(), isEpargne: compte.isEpargne });
    setShowCompteForm(true);
  };

  const deleteCompte = (id: number) => saveParametres({ ...parametres, comptesBancaires: parametres.comptesBancaires.filter(c => c.id !== id) });

  const exportData = () => {
    const data = {
      parametres,
      transactions: JSON.parse(localStorage.getItem('budget-transactions') || '[]'),
      enveloppes: JSON.parse(localStorage.getItem('budget-enveloppes') || '[]'),
      objectifs: JSON.parse(localStorage.getItem('budget-objectifs') || '[]'),
      memo: JSON.parse(localStorage.getItem('budget-memo') || '[]'),
      userName: localStorage.getItem('budget-user-name') || 'Utilisateur'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.parametres) saveParametres(data.parametres);
        if (data.transactions) localStorage.setItem('budget-transactions', JSON.stringify(data.transactions));
        if (data.enveloppes) localStorage.setItem('budget-enveloppes', JSON.stringify(data.enveloppes));
        if (data.objectifs) localStorage.setItem('budget-objectifs', JSON.stringify(data.objectifs));
        if (data.memo) localStorage.setItem('budget-memo', JSON.stringify(data.memo));
        if (data.userName) localStorage.setItem('budget-user-name', data.userName);
        alert('Données importées avec succès ! Rechargez la page.');
      } catch {
        alert("Erreur lors de l'importation.");
      }
    };
    reader.readAsText(file);
  };

  const resetAllData = () => {
    if (confirm('⚠️ Supprimer TOUTES les données ? Cette action est irréversible.')) {
      localStorage.removeItem('budget-transactions');
      localStorage.removeItem('budget-enveloppes');
      localStorage.removeItem('budget-objectifs');
      localStorage.removeItem('budget-memo');
      localStorage.removeItem('budget-parametres');
      localStorage.removeItem('budget-user-name');
      window.location.reload();
    }
  };

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  const renderCategorieSection = (title: string, type: 'categoriesRevenus' | 'categoriesFactures' | 'categoriesDepenses' | 'categoriesEpargnes', icon: React.ReactNode) => (
    <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-3" style={cardStyle}>
      <button onClick={() => toggleSection(type)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">{icon}<span className="text-sm font-semibold" style={textPrimary}>{title}</span><span className="text-[10px]" style={textSecondary}>({parametres[type].length})</span></div>
        {activeSection === type ? <ChevronUp className="w-5 h-5" style={textPrimary} /> : <ChevronDown className="w-5 h-5" style={textPrimary} />}
      </button>
      {activeSection === type && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <input type="text" placeholder="Nouvelle catégorie..." value={newCategorie} onChange={(e) => setNewCategorie(e.target.value)} className="flex-1 rounded-xl px-3 py-2 text-sm border" style={inputStyle} onKeyDown={(e) => { if (e.key === 'Enter') addCategorie(type); }} />
            <button onClick={() => addCategorie(type)} className="px-4 py-2 rounded-xl" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Plus className="w-5 h-5" /></button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {parametres[type].map((cat, index) => (
              <div key={index} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: theme.colors.cardBackgroundLight }}>
                <span className="text-xs font-medium" style={textPrimary}>{cat}</span>
                <button onClick={() => removeCategorie(type, index)} className="p-1 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="pb-4">
      <div className="text-center mb-4">
        <h1 className="text-lg font-medium" style={textPrimary}>Paramètres</h1>
        <p className="text-xs" style={textSecondary}>Configuration de l\'application</p>
      </div>

      {/* Général */} 
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}><Settings className="w-5 h-5" />Général</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium mb-1 block" style={textPrimary}>Devise</label>
            <select value={parametres.devise} onChange={(e) => saveParametres({ ...parametres, devise: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle}>
              <option value="€">€ Euro</option>
              <option value="$">$ Dollar</option>
              <option value="£">£ Livre</option>
              <option value="CHF">CHF Franc Suisse</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={textPrimary}>Date de départ</label>
            <input type="date" value={parametres.dateDepart} onChange={(e) => saveParametres({ ...parametres, dateDepart: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle} />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium" style={textPrimary}>Budget avant le 1er du mois</label>
            <button onClick={() => saveParametres({ ...parametres, budgetAvantPremier: !parametres.budgetAvantPremier })} className="w-12 h-6 rounded-full transition-colors" style={{ background: parametres.budgetAvantPremier ? theme.colors.primary : theme.colors.cardBackgroundLight }}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${parametres.budgetAvantPremier ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Comptes bancaires */} 
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <button onClick={() => toggleSection('comptes')} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3"><Building className="w-5 h-5" style={textPrimary} /><span className="text-sm font-semibold" style={textPrimary}>Comptes bancaires</span><span className="text-[10px]" style={textSecondary}>({parametres.comptesBancaires.length})</span></div>
          {activeSection === 'comptes' ? <ChevronUp className="w-5 h-5" style={textPrimary} /> : <ChevronDown className="w-5 h-5" style={textPrimary} />}
        </button>
        {activeSection === 'comptes' && (
          <div className="mt-4 space-y-3">
            <button onClick={() => { setCompteForm({ nom: '', soldeDepart: '', isEpargne: false }); setEditingCompte(null); setShowCompteForm(true); }} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Plus className="w-4 h-4" />Ajouter un compte</button>
            <div className="space-y-2">
              {parametres.comptesBancaires.map((compte) => (
                <div key={compte.id} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: theme.colors.cardBackgroundLight }}>
                  <div>
                    <p className="text-xs font-medium" style={textPrimary}>{compte.nom}</p>
                    <p className="text-[10px]" style={textSecondary}>{compte.isEpargne ? '💰 Épargne' : '🏦 Courant'} • Solde: {compte.soldeDepart}{parametres.devise}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => editCompte(compte)} className="p-1.5 rounded-lg"><Edit3 className="w-4 h-4" style={textPrimary} /></button>
                    <button onClick={() => deleteCompte(compte.id)} className="p-1.5 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {renderCategorieSection('Catégories Revenus', 'categoriesRevenus', <TrendingUp className="w-5 h-5 text-green-400" />)}
      {renderCategorieSection('Catégories Factures', 'categoriesFactures', <FileText className="w-5 h-5 text-red-400" />)}
      {renderCategorieSection('Catégories Dépenses', 'categoriesDepenses', <ShoppingCart className="w-5 h-5 text-orange-400" />)}
      {renderCategorieSection('Catégories Épargnes', 'categoriesEpargnes', <PiggyBank className="w-5 h-5 text-blue-400" />)}

      {/* Données */} 
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}><Database className="w-5 h-5" />Données</h3>
        <div className="space-y-3">
          <button onClick={exportData} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Upload className="w-5 h-5" />Exporter les données</button>
          <label className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium cursor-pointer border" style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}>
            <RefreshCw className="w-5 h-5" />Importer des données
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
          <button onClick={resetAllData} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-medium"><Trash2 className="w-5 h-5" />Réinitialiser toutes les données</button>
          <button onClick={async () => { document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; await supabase.auth.signOut(); window.location.href = '/auth'; }} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium border" style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}><LogOut className="w-5 h-5" />Se déconnecter</button>
        </div>
      </div>

      {/* Conseils */} 
      <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50">
        <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-[#7DD3A8]" /><h4 className="text-xs font-semibold text-[#7DD3A8]">💡 Conseils</h4></div>
        <div className="space-y-2">
          <p className="text-[10px] text-[#7DD3A8]">📦 Exportez régulièrement vos données pour les sauvegarder</p>
          <p className="text-[10px] text-[#7DD3A8]">🏦 Ajoutez tous vos comptes pour un suivi complet</p>
          <p className="text-[10px] text-[#7DD3A8]">📂 Personnalisez les catégories selon vos besoins</p>
        </div>
      </div>

      {/* Footer */} 
      <div className="backdrop-blur-sm rounded-2xl p-4 mt-4 text-center border" style={cardStyle}>
        <p className="text-[10px]" style={textSecondary}>The Budget Planner v1.0</p>
        <p className="text-[10px]" style={textSecondary}>Créé avec ❤️ par Shina5</p>
      </div>

      {/* Modal compte */} 
      {showCompteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl p-4 w-full max-w-sm border" style={{ background: theme.colors.secondary, borderColor: theme.colors.cardBorder }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium" style={textPrimary}>{editingCompte ? 'Modifier' : 'Nouveau'} compte</h2>
              <button onClick={() => setShowCompteForm(false)} className="p-1"><X className="w-5 h-5" style={textPrimary} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Nom du compte</label>
                <input type="text" placeholder="Ex: CCP La Banque Postale" value={compteForm.nom} onChange={(e) => setCompteForm({ ...compteForm, nom: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Solde de départ ({parametres.devise})</label>
                <input type="number" placeholder="0" value={compteForm.soldeDepart} onChange={(e) => setCompteForm({ ...compteForm, soldeDepart: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium" style={textPrimary}>Compte épargne</label>
                <button onClick={() => setCompteForm({ ...compteForm, isEpargne: !compteForm.isEpargne })} className="w-12 h-6 rounded-full transition-colors" style={{ background: compteForm.isEpargne ? theme.colors.primary : theme.colors.cardBackgroundLight }}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${compteForm.isEpargne ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCompteForm(false)} className="flex-1 py-3 rounded-xl font-medium border" style={{ borderColor: theme.colors.primary, color: theme.colors.textPrimary }}>Annuler</button>
                <button onClick={handleCompteSubmit} className="flex-1 py-3 rounded-xl font-semibold" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}>{editingCompte ? 'Modifier' : 'Créer'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HomePageContent() {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState('accueil');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/auth';
      } else {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        window.location.href = '/auth';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(180deg, ${theme.colors.backgroundGradientFrom} 0%, ${theme.colors.backgroundGradientTo} 50%, ${theme.colors.backgroundGradientFrom} 100%)` }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderLeftColor: theme.colors.primary, borderRightColor: theme.colors.primary, borderBottomColor: theme.colors.primary, borderTopColor: 'transparent' }}></div>
          <p className="font-medium" style={{ color: theme.colors.textPrimary }}>Chargement...</p>
        </div>
      </div>
    );
  }

  const handleNavigate = (page: string) => {
    setSidebarOpen(false);
    if (page === 'accueil') {
      setCurrentPage('accueil');
      } else {
        window.location.href = `/${page}`;
        }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'accueil': return <AccueilPage onNavigate={handleNavigate} />;
      case 'transactions': return <TransactionsPage />;
      case 'budget': return <BudgetPage />;
      case 'previsionnel': return <PrevisionnelPage />;
      case 'epargnes': return <EpargnesPage />;
      case 'credits-dettes': return <CreditsDettesPageFull />;
      case 'memo': return <MemoPage />;
      case 'enveloppes': return <EnveloppesPage />;
      case 'objectifs': return <ObjectifsPageFull />;
      case 'parametres': return <ParametresPage />;
      case 'statistiques': return <StatistiquesPage />;
      case 'plus': return <PlusPage />;
      default: return <AccueilPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${theme.colors.backgroundGradientFrom} 0%, ${theme.colors.backgroundGradientTo} 50%, ${theme.colors.backgroundGradientFrom} 100%)` }}>
      <Header onMenuClick={() => setSidebarOpen(true)} onThemeClick={() => setThemeModalOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="px-4 pt-20 pb-24 max-w-md mx-auto">
        {renderPage()}
      </main>
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      <ThemeModal isOpen={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </div>
  );
}

export default function Home() {
  return (
    <HomePageContent />
  );
}
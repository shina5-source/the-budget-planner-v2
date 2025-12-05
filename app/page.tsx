"use client";

import { useState, useEffect } from 'react';
import { Header, BottomNav, Sidebar } from '@/components';
import { ChevronLeft, ChevronRight, TrendingUp, Home as HomeIcon, Mail, PiggyBank, Sun, Target, PieChart, CheckSquare, Sparkles, Pencil, X, Check, Plus, Trash2, Edit3, ShoppingCart, Utensils, Fuel, ShoppingBag, Film, Heart, Gift, Plane, Coffee, Smartphone, Car, Zap, GraduationCap, Home, Palmtree, ShoppingBasket, Gem, Baby, PartyPopper, Wallet, Calendar, Database, Info, ChevronDown, ChevronUp, Building, Upload, RefreshCw, FileText, User, Lightbulb, Settings, LogOut } from 'lucide-react';
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
import { ThemeProvider } from '../contexts/theme-context';

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

interface Objectif {
  id: number;
  nom: string;
  montantCible: number;
  montantActuel: number;
  couleur: string;
  icone: string;
  dateEcheance?: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  type: 'court' | 'long';
  recurrence?: {
    actif: boolean;
    frequence: 'mensuel' | 'bimensuel' | 'hebdomadaire';
    montant: number;
    jourDuMois?: number;
    jourSemaine?: number;
    derniereExecution?: string;
  };
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
  categoriesRevenus: ['Salaire Foundevor', 'Revenus Secondaires', 'Allocations Familiales', 'Aides Sociales', 'Sécurité Sociale', 'Remboursement', 'Aide Financière', 'Aide Familiale', 'Prêt & Crédit Reçu', 'Dépôt Espèces', 'Ventes', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Assainissement', 'Assurance Habitation', 'Assurance Auto/Moto', 'Assurance Mobile', 'Assurance Chute Européen', 'Abonnement Internet', 'Abonnement Mobile Dhc', 'Abonnement Mobile Moi', 'Abonnement Mobile Kayu', 'Abonnement Mobile Timothy', 'Abonnement Mobile Kim', 'Abonnement Salle de Sport', 'Abonnement Streaming', 'Abonnement Transport Commun', 'Abonnement Autres', 'Cotisation Syndicale Sud', 'Emprunt Bourse Titi', 'Crédit Carrefour Banque', 'Crédit La Banque Postale', 'Crédit la Banque Postale Permis', 'Crédit Floa Bank', 'Crédit Cofidis', 'Crédit Cetelem', 'Crédit Floa Bank 4x', 'Crédit Paiement en 4x', 'Chèque Reporté Carrefour & Autres', 'Impôts/Trésor Public'],
  categoriesDepenses: ['Courses', 'Courses Asiatique', 'Restaurant', 'Fast Food & Plat à Emporter', 'Cafés/Bar & Boulangerie/Patisserie', 'Essence ou Carburant', 'Péage & Parking', 'Entretien Auto/Moto', 'Tabac/Cigarettes', 'Achat CB', 'Achat Google', 'Achat CB Carrefour Banque', 'Aide Familiale', 'Remboursement Famille & Tiers', 'Retrait', 'Cinéma', 'Sorties & Vacances & Voyages', 'Shopping', 'Shopping Enfant', 'Soins Personnel', 'Livres & Manga', 'Ameublement & Déco & Électroménager', 'Consultations Médicales', 'Pharmacie/Médicaments', 'Cadeaux (Anniversaire, Fêtes etc...)', 'Frais Bancaires', 'Frais Imprévus', 'Amendes', 'Autres Dépenses'],
  categoriesEpargnes: ['Livret A', 'Livret A Kim', 'Tirelire', 'Espèces', 'Anniversaire Coy', 'Anniversaire Kayu', 'Anniversaire Titi', 'Anniversaire Kim', 'Anniversaire Negro', 'Anniversaire Acat', 'Anniversaire La Naine', 'Anniversaire Noy', 'Voyages', 'Noël', "Fonds d'Urgence", 'CCP La Banque Postale', 'CCP BoursoBank'],
  comptesBancaires: [
    { id: 1, nom: 'CCP La Banque Postale', soldeDepart: 0, isEpargne: false },
    { id: 2, nom: 'CCP BoursoBank', soldeDepart: 48, isEpargne: false },
    { id: 3, nom: 'Livret A La Banque Postale', soldeDepart: 0, isEpargne: true },
    { id: 4, nom: 'Livret A Kim La Banque Postale', soldeDepart: 50, isEpargne: true },
    { id: 5, nom: 'Tirelire', soldeDepart: 50, isEpargne: true },
    { id: 6, nom: 'Espèce', soldeDepart: 20, isEpargne: false }
  ]
};

// STYLES UNIFORMISÉS
const cardStyle = "bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#D4AF37]/40";
const pageTitleStyle = "text-lg font-medium text-[#D4AF37]";
const pageSubtitleStyle = "text-xs text-[#D4AF37]/70";
const cardTitleStyle = "text-xs text-[#D4AF37]/80";
const amountLargeStyle = "text-2xl font-semibold text-[#D4AF37]";
const amountMediumStyle = "text-lg font-semibold text-[#D4AF37]";
const smallTextStyle = "text-[10px] text-[#D4AF37]/60";
const labelStyleGlobal = "text-xs font-medium text-[#D4AF37] mb-1 block";
const valueStyle = "text-xs font-medium text-[#D4AF37]";
const sectionTitleStyle = "text-sm font-semibold text-[#D4AF37]";
const inputStyleGlobal = "w-full bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-sm text-[#D4AF37] placeholder-[#D4AF37]/50 focus:outline-none focus:border-[#D4AF37]";
const selectStyle = "bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-sm text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]";

// STYLE CONSEILS - Vert menthe
const conseilCardStyle = "bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50";
const conseilTitleStyle = "text-xs font-semibold text-[#7DD3A8]";
const conseilTextStyle = "text-[10px] text-[#7DD3A8]";
const conseilIconStyle = "w-4 h-4 text-[#7DD3A8]";

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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userName, setUserName] = useState('Shina5');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const { parametres } = useParametres();

  useEffect(() => {
    const saved = localStorage.getItem('budget-transactions');
    if (saved) setTransactions(JSON.parse(saved));
    const savedName = localStorage.getItem('budget-user-name');
    if (savedName) setUserName(savedName);
  }, []);

  const saveName = () => { if (tempName.trim()) { setUserName(tempName.trim()); localStorage.setItem('budget-user-name', tempName.trim()); } setIsEditingName(false); };
  const startEditName = () => { setTempName(userName); setIsEditingName(true); };
  const getMonthKey = () => `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;

  const filteredTransactions = transactions.filter(t => t.date?.startsWith(getMonthKey()));
  const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalFactures = filteredTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalDepenses = filteredTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEpargnes = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const budgetPrevu = totalRevenus - totalFactures;
  const reposPrevu = totalRevenus - totalFactures - totalEpargnes;
  const soldeReel = totalRevenus - totalFactures - totalDepenses - totalEpargnes;

  const prevMonth = () => { if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); } else setSelectedMonth(selectedMonth - 1); };
  const nextMonth = () => { if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); } else setSelectedMonth(selectedMonth + 1); };

  return (
    <div className="pb-4">
      <div className="text-center mb-2">
        <div className="w-24 h-24 mx-auto mb-2 rounded-2xl overflow-hidden shadow-lg border-2 border-[#D4AF37]/50">
         <Image src="/logo-shina5.png" alt="Logo Shina5" width={96} height={96} className="w-full h-full object-cover" priority />
        </div>
      </div>

      <div className="text-center mb-4">
        {isEditingName ? (
          <div className="flex items-center justify-center gap-2">
            <span className={amountMediumStyle}>Bonjour</span>
            <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="text-xl font-semibold text-[#D4AF37] bg-[#722F37]/50 border border-[#D4AF37] rounded-xl px-3 py-1 w-32 text-center" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setIsEditingName(false); }} />
            <button onClick={saveName} className="p-1 bg-[#D4AF37]/20 rounded-full border border-[#D4AF37]/50"><Check className="w-4 h-4 text-[#D4AF37]" /></button>
            <button onClick={() => setIsEditingName(false)} className="p-1 bg-[#722F37]/50 rounded-full border border-[#D4AF37]/50"><X className="w-4 h-4 text-[#D4AF37]" /></button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h1 className={amountMediumStyle}>Bonjour {userName} 👋</h1>
            <button onClick={startEditName} className="p-1 hover:bg-[#D4AF37]/20 rounded-full"><Pencil className="w-4 h-4 text-[#D4AF37]/70" /></button>
          </div>
        )}
        <p className={pageSubtitleStyle + " mt-1 text-center"}>Bienvenue sur The Budget Planner</p>
      </div>

      <div className={cardStyle + " mb-4"}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5 text-[#D4AF37]" /></button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#D4AF37]">{monthsFull[selectedMonth]}</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-lg px-3 py-1 text-lg font-semibold text-[#D4AF37]">
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5 text-[#D4AF37]" /></button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {monthsShort.map((month, index) => (
            <button key={index} onClick={() => setSelectedMonth(index)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedMonth === index ? 'bg-[#D4AF37] text-[#722F37] border-[#D4AF37]' : 'bg-transparent text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'}`}>{month}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className={cardStyle}><div className="flex items-start justify-between"><div><p className={cardTitleStyle}>Revenus prévus</p><p className={amountLargeStyle + " mt-1"}>{totalRevenus.toFixed(2)} {parametres.devise}</p><p className={smallTextStyle + " mt-1"}>Reçus : {totalRevenus.toFixed(2)} {parametres.devise}</p></div><div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/50"><TrendingUp className="w-5 h-5 text-[#D4AF37]" /></div></div></div>
        <div className={cardStyle}><div className="flex items-start justify-between"><div><p className={cardTitleStyle}>Dépenses fixes</p><p className={amountLargeStyle + " mt-1"}>{totalFactures.toFixed(2)} {parametres.devise}</p><p className={smallTextStyle + " mt-1"}>Payées : {totalFactures.toFixed(2)} {parametres.devise}</p></div><div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/50"><HomeIcon className="w-5 h-5 text-[#D4AF37]" /></div></div></div>
        <div className={cardStyle}><div className="flex items-start justify-between"><div><p className={cardTitleStyle}>Enveloppes budgétaires</p><p className={amountLargeStyle + " mt-1"}>{budgetPrevu.toFixed(2)} {parametres.devise}</p><p className={smallTextStyle + " mt-1"}>Dépensé : {totalDepenses.toFixed(2)} {parametres.devise}</p></div><div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/50"><Mail className="w-5 h-5 text-[#D4AF37]" /></div></div></div>
        <div className={cardStyle}><div className="flex items-start justify-between"><div><p className={cardTitleStyle}>Épargne CT prévu</p><p className={amountLargeStyle + " mt-1"}>{totalEpargnes.toFixed(2)} {parametres.devise}</p><p className={smallTextStyle + " mt-1"}>Versé : {totalEpargnes.toFixed(2)} {parametres.devise}</p></div><div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/50"><PiggyBank className="w-5 h-5 text-[#D4AF37]" /></div></div></div>
        <div className={cardStyle}><div className="flex items-start justify-between"><div><p className={cardTitleStyle}>Repos prévu</p><p className={amountLargeStyle + " mt-1"}>{reposPrevu.toFixed(2)} {parametres.devise}</p><div className="flex items-center gap-1 mt-1"><CheckSquare className="w-3 h-3 text-[#D4AF37]/60" /><p className={smallTextStyle}>Après budget prévu</p></div></div><div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/50"><Sun className="w-5 h-5 text-[#D4AF37]" /></div></div></div>
        <div className={cardStyle}><div className="flex items-start justify-between"><div><p className={cardTitleStyle}>Solde réel</p><p className={amountLargeStyle + " mt-1"}>{soldeReel.toFixed(2)} {parametres.devise}</p><div className="flex items-center gap-1 mt-1"><CheckSquare className="w-3 h-3 text-[#D4AF37]/60" /><p className={smallTextStyle}>Dépenses réelles</p></div></div><div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/50"><Sparkles className="w-5 h-5 text-[#D4AF37]" /></div></div></div>
      </div>

      <div className="space-y-3 mb-4">
        <button onClick={() => onNavigate('budget')} className={cardStyle + " w-full flex items-center gap-4"}><div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center border border-[#D4AF37]/50"><PieChart className="w-6 h-6 text-[#D4AF37]" /></div><div className="text-left"><p className={sectionTitleStyle}>Mon budget</p><p className={smallTextStyle}>Vue d'ensemble</p></div></button>
        <button onClick={() => onNavigate('objectifs')} className={cardStyle + " w-full flex items-center gap-4"}><div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center border border-[#D4AF37]/50"><Target className="w-6 h-6 text-[#D4AF37]" /></div><div className="text-left"><p className={sectionTitleStyle}>Mes Objectifs</p><p className={smallTextStyle}>Économiseur</p></div></button>
        <button onClick={() => onNavigate('enveloppes')} className={cardStyle + " w-full flex items-center gap-4"}><div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center border border-[#D4AF37]/50"><Mail className="w-6 h-6 text-[#D4AF37]" /></div><div className="text-left"><p className={sectionTitleStyle}>Mes enveloppes</p><p className={smallTextStyle}>Gérer mes enveloppes</p></div></button>
      </div>

      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-3"><Lightbulb className={conseilIconStyle} /><h4 className={conseilTitleStyle}>💡 Conseils du mois</h4></div>
        <div className="space-y-2">
          {totalRevenus === 0 && (<p className={conseilTextStyle}>📝 Ajoutez vos revenus pour commencer votre budget</p>)}
          {totalRevenus > 0 && totalEpargnes === 0 && (<p className={conseilTextStyle}>💰 Pensez à épargner au moins 10% ({(totalRevenus * 0.1).toFixed(0)} {parametres.devise})</p>)}
          {soldeReel < 0 && (<p className={conseilTextStyle}>⚠️ Attention ! Solde négatif de {Math.abs(soldeReel).toFixed(2)} {parametres.devise}</p>)}
          {soldeReel > 0 && totalEpargnes > 0 && (<p className={conseilTextStyle}>✅ Bravo ! Vous gérez bien votre budget ce mois</p>)}
          {filteredTransactions.length === 0 && (<p className={conseilTextStyle}>📊 Aucune transaction ce mois. Commencez à enregistrer !</p>)}
        </div>
      </div>
    </div>
  );
}

function EnveloppesPage() {
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const { parametres } = useParametres();

  const [formData, setFormData] = useState({ nom: '', budget: '', couleur: 'pastel-green', icone: 'shopping-cart', categories: [] as string[] });

  const couleursDisponibles = [
    { id: 'pastel-green', nom: 'Vert', bg: 'bg-green-200', border: 'border-green-400', text: 'text-green-700', progress: 'bg-green-400' },
    { id: 'pastel-blue', nom: 'Bleu', bg: 'bg-blue-200', border: 'border-blue-400', text: 'text-blue-700', progress: 'bg-blue-400' },
    { id: 'pastel-pink', nom: 'Rose', bg: 'bg-pink-200', border: 'border-pink-400', text: 'text-pink-700', progress: 'bg-pink-400' },
    { id: 'pastel-purple', nom: 'Violet', bg: 'bg-purple-200', border: 'border-purple-400', text: 'text-purple-700', progress: 'bg-purple-400' },
    { id: 'pastel-orange', nom: 'Orange', bg: 'bg-orange-200', border: 'border-orange-400', text: 'text-orange-700', progress: 'bg-orange-400' },
    { id: 'pastel-yellow', nom: 'Jaune', bg: 'bg-yellow-200', border: 'border-yellow-400', text: 'text-yellow-700', progress: 'bg-yellow-400' },
    { id: 'pastel-teal', nom: 'Turquoise', bg: 'bg-teal-200', border: 'border-teal-400', text: 'text-teal-700', progress: 'bg-teal-400' },
    { id: 'pastel-red', nom: 'Rouge', bg: 'bg-red-200', border: 'border-red-400', text: 'text-red-700', progress: 'bg-red-400' },
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

  const saveEnveloppes = (newEnveloppes: Enveloppe[]) => { setEnveloppes(newEnveloppes); localStorage.setItem('budget-enveloppes', JSON.stringify(newEnveloppes)); };
  const getMonthKey = () => `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
  const getDepensesEnveloppe = (enveloppe: Enveloppe) => transactions.filter(t => t.type === 'Dépenses' && t.date?.startsWith(getMonthKey()) && enveloppe.categories.includes(t.categorie)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const getCouleur = (couleurId: string) => couleursDisponibles.find(c => c.id === couleurId) || couleursDisponibles[0];
  const getIcone = (iconeId: string) => iconesDisponibles.find(i => i.id === iconeId) || iconesDisponibles[0];
  const resetForm = () => { setFormData({ nom: '', budget: '', couleur: 'pastel-green', icone: 'shopping-cart', categories: [] }); };

  const handleSubmit = () => {
    if (!formData.nom || !formData.budget) return;
    if (editingId !== null) {
      const updated = enveloppes.map(e => e.id === editingId ? { ...formData, id: editingId, budget: parseFloat(formData.budget) } : e);
      saveEnveloppes(updated);
      setEditingId(null);
    } else {
      const newEnveloppe: Enveloppe = { ...formData, id: Date.now(), budget: parseFloat(formData.budget) };
      saveEnveloppes([...enveloppes, newEnveloppe]);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (enveloppe: Enveloppe) => { setFormData({ nom: enveloppe.nom, budget: enveloppe.budget.toString(), couleur: enveloppe.couleur, icone: enveloppe.icone, categories: enveloppe.categories }); setEditingId(enveloppe.id); setShowForm(true); };
  const handleDelete = (id: number) => saveEnveloppes(enveloppes.filter(e => e.id !== id));
  const toggleCategorie = (cat: string) => { if (formData.categories.includes(cat)) { setFormData({ ...formData, categories: formData.categories.filter(c => c !== cat) }); } else { setFormData({ ...formData, categories: [...formData.categories, cat] }); } };

  const totalBudget = enveloppes.reduce((sum, e) => sum + e.budget, 0);
  const totalDepense = enveloppes.reduce((sum, e) => sum + getDepensesEnveloppe(e), 0);
  const totalReste = totalBudget - totalDepense;

  const prevMonth = () => { if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); } else setSelectedMonth(selectedMonth - 1); };
  const nextMonth = () => { if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); } else setSelectedMonth(selectedMonth + 1); };

  const inputStyle = inputStyleGlobal;
  const labelStyle = labelStyleGlobal;

  return (
    <div className="pb-4">
      <div className="text-center mb-4"><h1 className={pageTitleStyle}>Enveloppes</h1><p className={pageSubtitleStyle}>Gestion des enveloppes budgétaires</p></div>

      <div className={cardStyle + " mb-4"}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5 text-[#D4AF37]" /></button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#D4AF37]">{monthsFull[selectedMonth]}</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-lg px-3 py-1 text-lg font-semibold text-[#D4AF37]">
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5 text-[#D4AF37]" /></button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {monthsShort.map((month, index) => (<button key={index} onClick={() => setSelectedMonth(index)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedMonth === index ? 'bg-[#D4AF37] text-[#722F37] border-[#D4AF37]' : 'bg-transparent text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'}`}>{month}</button>))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={cardStyle + " text-center p-3"}><p className={smallTextStyle}>Budget</p><p className={valueStyle + " font-semibold"}>{totalBudget.toFixed(0)}{parametres.devise}</p></div>
        <div className={cardStyle + " text-center p-3"}><p className={smallTextStyle}>Dépensé</p><p className={valueStyle + " font-semibold"}>{totalDepense.toFixed(0)}{parametres.devise}</p></div>
        <div className={cardStyle + " text-center p-3"}><p className={smallTextStyle}>Reste</p><p className={`${valueStyle} font-semibold ${totalReste >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalReste.toFixed(0)}{parametres.devise}</p></div>
      </div>

      <button onClick={() => { resetForm(); setShowForm(true); }} className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-medium text-sm"><Plus className="w-4 h-4" />Nouvelle enveloppe</button>

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
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${couleur.bg} border ${couleur.border}`}><IconComponent className={`w-5 h-5 ${couleur.text}`} /></div>
                    <div><p className={`text-sm font-semibold ${couleur.text}`}>{enveloppe.nom}</p><p className={`text-[10px] ${couleur.text} opacity-70`}>{enveloppe.categories.length} catégorie(s)</p></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(enveloppe)} className="p-1.5 hover:bg-white/30 rounded-lg"><Edit3 className={`w-4 h-4 ${couleur.text}`} /></button>
                    <button onClick={() => handleDelete(enveloppe.id)} className="p-1.5 hover:bg-white/30 rounded-lg"><Trash2 className={`w-4 h-4 ${couleur.text}`} /></button>
                  </div>
                </div>
                <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-2"><div className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : isWarning ? 'bg-orange-400' : couleur.progress}`} style={{ width: `${Math.min(pourcentage, 100)}%` }} /></div>
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
        <div className={cardStyle + " text-center py-8 mb-4"}><Mail className="w-12 h-12 text-[#D4AF37]/30 mx-auto mb-3" /><p className={pageSubtitleStyle + " mb-2"}>Aucune enveloppe</p><p className={smallTextStyle}>Créez votre première enveloppe</p></div>
      )}

      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-3"><Lightbulb className={conseilIconStyle} /><h4 className={conseilTitleStyle}>💡 Conseils</h4></div>
        <div className="space-y-2">
          {enveloppes.length === 0 && (<p className={conseilTextStyle}>📝 Créez des enveloppes pour mieux gérer vos dépenses</p>)}
          {totalReste < 0 && (<p className={conseilTextStyle}>⚠️ Attention ! Vous avez dépassé votre budget de {Math.abs(totalReste).toFixed(0)}{parametres.devise}</p>)}
          {totalReste > 0 && enveloppes.length > 0 && (<p className={conseilTextStyle}>✅ Il vous reste {totalReste.toFixed(0)}{parametres.devise} sur vos enveloppes</p>)}
          {enveloppes.some(e => (getDepensesEnveloppe(e) / e.budget) * 100 >= 80) && (<p className={conseilTextStyle}>🔔 Certaines enveloppes approchent de leur limite</p>)}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#8B4557] rounded-2xl p-4 w-full max-w-md border border-[#D4AF37]/40 mb-20 mt-20">
            <div className="flex items-center justify-between mb-4"><h2 className={pageTitleStyle}>{editingId ? 'Modifier' : 'Nouvelle'} enveloppe</h2><button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1"><X className="w-5 h-5 text-[#D4AF37]" /></button></div>
            <div className="space-y-4">
              <div><label className={labelStyle}>Nom de l'enveloppe</label><input type="text" placeholder="Ex: Courses, Restaurant..." value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className={inputStyle} /></div>
              <div><label className={labelStyle}>Budget mensuel ({parametres.devise})</label><input type="number" placeholder="0" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className={inputStyle} /></div>
              <div><label className={labelStyle}>Couleur</label><div className="grid grid-cols-4 gap-2">{couleursDisponibles.map((couleur) => (<button key={couleur.id} onClick={() => setFormData({ ...formData, couleur: couleur.id })} className={`h-10 rounded-xl ${couleur.bg} border-2 ${formData.couleur === couleur.id ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]' : couleur.border}`} />))}</div></div>
              <div><label className={labelStyle}>Icône</label><div className="grid grid-cols-6 gap-2">{iconesDisponibles.map((icone) => { const IconComp = icone.icon; return (<button key={icone.id} onClick={() => setFormData({ ...formData, icone: icone.id })} className={`h-10 rounded-xl flex items-center justify-center border ${formData.icone === icone.id ? 'bg-[#D4AF37] border-[#D4AF37] text-[#722F37]' : 'bg-[#722F37]/50 border-[#D4AF37]/50 text-[#D4AF37]'}`}><IconComp className="w-5 h-5" /></button>); })}</div></div>
              <div><label className={labelStyle}>Catégories liées ({formData.categories.length} sélectionnée{formData.categories.length > 1 ? 's' : ''})</label><div className="max-h-40 overflow-y-auto bg-[#722F37]/30 rounded-xl p-2 space-y-1">{parametres.categoriesDepenses.map((cat) => (<button key={cat} onClick={() => toggleCategorie(cat)} className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${formData.categories.includes(cat) ? 'bg-[#D4AF37] text-[#722F37] font-medium' : 'text-[#D4AF37] hover:bg-[#D4AF37]/20'}`}>{cat}</button>))}</div></div>
              <div className="flex gap-3 pt-2"><button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium">Annuler</button><button onClick={handleSubmit} className="flex-1 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-semibold flex items-center justify-center gap-2"><Check className="w-5 h-5" />{editingId ? 'Modifier' : 'Créer'}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ObjectifsPage() {
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showVersementModal, setShowVersementModal] = useState(false);
  const [selectedObjectifId, setSelectedObjectifId] = useState<number | null>(null);
  const [versementMontant, setVersementMontant] = useState('');
  const [activeFilter, setActiveFilter] = useState<'tous' | 'court' | 'long'>('tous');
  const { parametres } = useParametres();

  const [formData, setFormData] = useState({
    nom: '',
    montantCible: '',
    montantActuel: '',
    couleur: 'rose-pale',
    icone: 'palmtree',
    dateEcheance: '',
    priorite: 'moyenne' as 'haute' | 'moyenne' | 'basse',
    type: 'court' as 'court' | 'long',
    recurrenceActif: false,
    recurrenceFrequence: 'mensuel' as 'mensuel' | 'bimensuel' | 'hebdomadaire',
    recurrenceMontant: '',
    recurrenceJour: '1'
  });

  const couleursDisponibles = [
    { id: 'rose-pale', nom: 'Rose pâle', bg: 'bg-[#F8E8E8]', border: 'border-[#E8B4B8]', text: 'text-[#8B4557]', progress: 'bg-[#E8B4B8]' },
    { id: 'rose-poudre', nom: 'Rose poudré', bg: 'bg-[#F5D5D5]', border: 'border-[#D4A5A5]', text: 'text-[#7A3E4D]', progress: 'bg-[#D4A5A5]' },
    { id: 'bordeaux-clair', nom: 'Bordeaux clair', bg: 'bg-[#E8D0D5]', border: 'border-[#C4848F]', text: 'text-[#722F37]', progress: 'bg-[#C4848F]' },
    { id: 'mauve-rose', nom: 'Mauve rosé', bg: 'bg-[#E8D8E8]', border: 'border-[#C9A5C9]', text: 'text-[#6B4570]', progress: 'bg-[#C9A5C9]' },
    { id: 'corail-doux', nom: 'Corail doux', bg: 'bg-[#F8E0D8]', border: 'border-[#E8A090]', text: 'text-[#8B5040]', progress: 'bg-[#E8A090]' },
    { id: 'prune-pastel', nom: 'Prune pastel', bg: 'bg-[#E0D0E0]', border: 'border-[#A888A8]', text: 'text-[#5C4060]', progress: 'bg-[#A888A8]' },
    { id: 'vieux-rose', nom: 'Vieux rose', bg: 'bg-[#E8D0D0]', border: 'border-[#B89090]', text: 'text-[#6B4545]', progress: 'bg-[#B89090]' },
    { id: 'framboise-pastel', nom: 'Framboise', bg: 'bg-[#F0D8E0]', border: 'border-[#D898A8]', text: 'text-[#7A4055]', progress: 'bg-[#D898A8]' },
  ];

  const iconesDisponibles = [
    { id: 'palmtree', nom: 'Voyage', icon: Palmtree },
    { id: 'car', nom: 'Voiture', icon: Car },
    { id: 'home', nom: 'Maison', icon: Home },
    { id: 'wallet', nom: 'Épargne', icon: Wallet },
    { id: 'gift', nom: 'Cadeau', icon: Gift },
    { id: 'smartphone', nom: 'Tech', icon: Smartphone },
    { id: 'graduation', nom: 'Formation', icon: GraduationCap },
    { id: 'party', nom: 'Événement', icon: PartyPopper },
    { id: 'gem', nom: 'Luxe', icon: Gem },
    { id: 'baby', nom: 'Bébé', icon: Baby },
    { id: 'heart', nom: 'Santé', icon: Heart },
    { id: 'shopping', nom: 'Shopping', icon: ShoppingBasket },
  ];

  const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  useEffect(() => {
    const savedObjectifs = localStorage.getItem('budget-objectifs');
    if (savedObjectifs) {
      const parsed = JSON.parse(savedObjectifs);
      // Migration : ajouter le type si absent
      const migrated = parsed.map((o: any) => ({
        ...o,
        type: o.type || 'court',
        recurrence: o.recurrence || undefined
      }));
      setObjectifs(migrated);
    }
  }, []);

  // Traitement des récurrences
  useEffect(() => {
    processRecurrences();
  }, [objectifs]);

  const processRecurrences = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    let hasChanges = false;
    
    const updatedObjectifs = objectifs.map(obj => {
      if (!obj.recurrence?.actif || !obj.recurrence.montant) return obj;
      
      const rec = obj.recurrence;
      const lastExec = rec.derniereExecution ? new Date(rec.derniereExecution) : null;
      
      let shouldExecute = false;
      
      if (rec.frequence === 'mensuel' || rec.frequence === 'bimensuel') {
        const jourCible = rec.jourDuMois || 1;
        if (today.getDate() === jourCible) {
          if (!lastExec || lastExec.getMonth() !== today.getMonth() || lastExec.getFullYear() !== today.getFullYear()) {
            shouldExecute = true;
          }
        }
        // Pour bimensuel, vérifier aussi le 15
        if (rec.frequence === 'bimensuel' && today.getDate() === 15) {
          if (!lastExec || (lastExec.getDate() !== 15 && lastExec.getMonth() === today.getMonth())) {
            shouldExecute = true;
          }
        }
      } else if (rec.frequence === 'hebdomadaire') {
        const jourCible = rec.jourSemaine || 1;
        if (today.getDay() === jourCible) {
          if (!lastExec || (today.getTime() - lastExec.getTime()) >= 6 * 24 * 60 * 60 * 1000) {
            shouldExecute = true;
          }
        }
      }
      
      if (shouldExecute) {
        hasChanges = true;
        
        // Créer une transaction d'épargne
        const transactions = JSON.parse(localStorage.getItem('budget-transactions') || '[]');
        const newTransaction = {
          id: Date.now() + Math.random(),
          date: todayStr,
          montant: rec.montant.toString(),
          type: 'Épargnes',
          categorie: obj.nom,
          memo: `Versement automatique - ${obj.nom}`
        };
        transactions.push(newTransaction);
        localStorage.setItem('budget-transactions', JSON.stringify(transactions));
        
        // Mettre à jour l'objectif
        return {
          ...obj,
          montantActuel: obj.montantActuel + rec.montant,
          recurrence: {
            ...rec,
            derniereExecution: todayStr
          }
        };
      }
      
      return obj;
    });
    
    if (hasChanges) {
      saveObjectifs(updatedObjectifs);
    }
  };

  const saveObjectifs = (newObjectifs: Objectif[]) => {
    setObjectifs(newObjectifs);
    localStorage.setItem('budget-objectifs', JSON.stringify(newObjectifs));
  };

  const getCouleur = (couleurId: string) => couleursDisponibles.find(c => c.id === couleurId) || couleursDisponibles[0];
  const getIcone = (iconeId: string) => iconesDisponibles.find(i => i.id === iconeId) || iconesDisponibles[0];

  const resetForm = () => {
    setFormData({
      nom: '',
      montantCible: '',
      montantActuel: '',
      couleur: 'rose-pale',
      icone: 'palmtree',
      dateEcheance: '',
      priorite: 'moyenne',
      type: 'court',
      recurrenceActif: false,
      recurrenceFrequence: 'mensuel',
      recurrenceMontant: '',
      recurrenceJour: '1'
    });
  };

  const handleSubmit = () => {
    if (!formData.nom || !formData.montantCible) return;
    
    const recurrence = formData.recurrenceActif ? {
      actif: true,
      frequence: formData.recurrenceFrequence,
      montant: parseFloat(formData.recurrenceMontant) || 0,
      jourDuMois: formData.recurrenceFrequence !== 'hebdomadaire' ? parseInt(formData.recurrenceJour) : undefined,
      jourSemaine: formData.recurrenceFrequence === 'hebdomadaire' ? parseInt(formData.recurrenceJour) : undefined,
      derniereExecution: undefined
    } : undefined;

    if (editingId !== null) {
      const updated = objectifs.map(o => o.id === editingId ? {
        ...o,
        nom: formData.nom,
        montantCible: parseFloat(formData.montantCible),
        montantActuel: parseFloat(formData.montantActuel || '0'),
        couleur: formData.couleur,
        icone: formData.icone,
        dateEcheance: formData.dateEcheance || undefined,
        priorite: formData.priorite,
        type: formData.type,
        recurrence
      } : o);
      saveObjectifs(updated);
      setEditingId(null);
    } else {
      const newObjectif: Objectif = {
        id: Date.now(),
        nom: formData.nom,
        montantCible: parseFloat(formData.montantCible),
        montantActuel: parseFloat(formData.montantActuel || '0'),
        couleur: formData.couleur,
        icone: formData.icone,
        dateEcheance: formData.dateEcheance || undefined,
        priorite: formData.priorite,
        type: formData.type,
        recurrence
      };
      saveObjectifs([...objectifs, newObjectif]);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (objectif: Objectif) => {
    setFormData({
      nom: objectif.nom,
      montantCible: objectif.montantCible.toString(),
      montantActuel: objectif.montantActuel.toString(),
      couleur: objectif.couleur,
      icone: objectif.icone,
      dateEcheance: objectif.dateEcheance || '',
      priorite: objectif.priorite,
      type: objectif.type || 'court',
      recurrenceActif: objectif.recurrence?.actif || false,
      recurrenceFrequence: objectif.recurrence?.frequence || 'mensuel',
      recurrenceMontant: objectif.recurrence?.montant?.toString() || '',
      recurrenceJour: (objectif.recurrence?.jourDuMois || objectif.recurrence?.jourSemaine || 1).toString()
    });
    setEditingId(objectif.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => saveObjectifs(objectifs.filter(o => o.id !== id));

  const handleVersement = () => {
    if (!versementMontant || !selectedObjectifId) return;
    const montant = parseFloat(versementMontant);
    
    // Mettre à jour l'objectif
    const updated = objectifs.map(o => o.id === selectedObjectifId ? { ...o, montantActuel: o.montantActuel + montant } : o);
    saveObjectifs(updated);
    
    // Créer une transaction d'épargne
    const objectif = objectifs.find(o => o.id === selectedObjectifId);
    if (objectif) {
      const transactions = JSON.parse(localStorage.getItem('budget-transactions') || '[]');
      const newTransaction = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        montant: montant.toString(),
        type: 'Épargnes',
        categorie: objectif.nom,
        memo: `Versement manuel - ${objectif.nom}`
      };
      transactions.push(newTransaction);
      localStorage.setItem('budget-transactions', JSON.stringify(transactions));
    }
    
    setVersementMontant('');
    setShowVersementModal(false);
    setSelectedObjectifId(null);
  };

  const openVersementModal = (id: number) => {
    setSelectedObjectifId(id);
    setVersementMontant('');
    setShowVersementModal(true);
  };

  const toggleRecurrence = (id: number) => {
    const updated = objectifs.map(o => {
      if (o.id === id && o.recurrence) {
        return { ...o, recurrence: { ...o.recurrence, actif: !o.recurrence.actif } };
      }
      return o;
    });
    saveObjectifs(updated);
  };

  const getMoisRestants = (dateEcheance: string) => {
    if (!dateEcheance) return null;
    const now = new Date();
    const echeance = new Date(dateEcheance);
    return Math.max(0, (echeance.getFullYear() - now.getFullYear()) * 12 + (echeance.getMonth() - now.getMonth()));
  };

  const getSuggestionMensuelle = (objectif: Objectif) => {
    const moisRestants = getMoisRestants(objectif.dateEcheance || '');
    if (!moisRestants || moisRestants === 0) return null;
    const resteAEpargner = objectif.montantCible - objectif.montantActuel;
    if (resteAEpargner <= 0) return null;
    return Math.ceil(resteAEpargner / moisRestants);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const getRecurrenceLabel = (rec: Objectif['recurrence']) => {
    if (!rec) return '';
    let label = '';
    if (rec.frequence === 'mensuel') {
      label = `${rec.montant}${parametres.devise}/mois le ${rec.jourDuMois}`;
    } else if (rec.frequence === 'bimensuel') {
      label = `${rec.montant}${parametres.devise} 2x/mois`;
    } else if (rec.frequence === 'hebdomadaire') {
      label = `${rec.montant}${parametres.devise}/sem. (${joursSemaine[rec.jourSemaine || 0]})`;
    }
    return label;
  };

  // Filtrer les objectifs
  const filteredObjectifs = objectifs.filter(o => {
    if (activeFilter === 'tous') return true;
    return o.type === activeFilter;
  });

  // Stats
  const totalObjectifs = objectifs.reduce((sum, o) => sum + o.montantCible, 0);
  const totalEpargne = objectifs.reduce((sum, o) => sum + o.montantActuel, 0);
  const progressionGlobale = totalObjectifs > 0 ? (totalEpargne / totalObjectifs) * 100 : 0;
  const objectifsCourtTerme = objectifs.filter(o => o.type === 'court').length;
  const objectifsLongTerme = objectifs.filter(o => o.type === 'long').length;
  const objectifsAvecRecurrence = objectifs.filter(o => o.recurrence?.actif).length;

  const inputStyle = "w-full bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-sm text-[#D4AF37] placeholder-[#D4AF37]/50 focus:outline-none focus:border-[#D4AF37]";
  const labelStyle = "text-xs font-medium text-[#D4AF37] mb-1 block";

  return (
    <div className="pb-4">
      <div className="text-center mb-4">
        <h1 className={pageTitleStyle}>Objectifs</h1>
        <p className={pageSubtitleStyle}>Vos objectifs financiers</p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={cardStyle + " text-center p-3"}>
          <p className={smallTextStyle}>Total objectifs</p>
          <p className={valueStyle + " font-semibold"}>{totalObjectifs.toFixed(0)}{parametres.devise}</p>
        </div>
        <div className={cardStyle + " text-center p-3"}>
          <p className={smallTextStyle}>Épargné</p>
          <p className={valueStyle + " font-semibold"}>{totalEpargne.toFixed(0)}{parametres.devise}</p>
        </div>
        <div className={cardStyle + " text-center p-3"}>
          <p className={smallTextStyle}>Progression</p>
          <p className={valueStyle + " font-semibold"}>{Math.round(progressionGlobale)}%</p>
        </div>
      </div>

      {/* Progression globale */}
      {objectifs.length > 0 && (
        <div className={cardStyle + " mb-4"}>
          <p className={smallTextStyle + " mb-2 text-center"}>Progression globale</p>
          <div className="h-3 bg-[#722F37]/50 rounded-full overflow-hidden border border-[#D4AF37]/20">
            <div className="h-full bg-[#D4AF37] transition-all duration-500" style={{ width: `${Math.min(progressionGlobale, 100)}%` }} />
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <span className={smallTextStyle}>🎯 Court terme: {objectifsCourtTerme}</span>
            <span className={smallTextStyle}>🏔️ Long terme: {objectifsLongTerme}</span>
            <span className={smallTextStyle}>🔄 Récurrents: {objectifsAvecRecurrence}</span>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex gap-2 mb-4">
        {(['tous', 'court', 'long'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors border ${
              activeFilter === filter
                ? 'bg-[#D4AF37] text-[#722F37] border-[#D4AF37]'
                : 'bg-[#722F37]/30 text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#D4AF37]/20'
            }`}
          >
            {filter === 'tous' ? '📋 Tous' : filter === 'court' ? '🎯 Court terme' : '🏔️ Long terme'}
            <span className="ml-1">
              ({filter === 'tous' ? objectifs.length : filter === 'court' ? objectifsCourtTerme : objectifsLongTerme})
            </span>
          </button>
        ))}
      </div>

      {/* Bouton ajouter */}
      <button
        onClick={() => { resetForm(); setShowForm(true); }}
        className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-medium text-sm"
      >
        <Plus className="w-4 h-4" />Nouvel objectif
      </button>

      {/* Liste des objectifs */}
      {filteredObjectifs.length > 0 ? (
        <div className="space-y-3 mb-4">
          {filteredObjectifs.map((objectif) => {
            const couleur = getCouleur(objectif.couleur);
            const icone = getIcone(objectif.icone);
            const IconComponent = icone.icon;
            const reste = objectif.montantCible - objectif.montantActuel;
            const pourcentage = objectif.montantCible > 0 ? (objectif.montantActuel / objectif.montantCible) * 100 : 0;
            const isComplete = pourcentage >= 100;
            const isAlmostComplete = pourcentage >= 80 && pourcentage < 100;
            const suggestion = getSuggestionMensuelle(objectif);
            const moisRestants = getMoisRestants(objectif.dateEcheance || '');

            return (
              <div key={objectif.id} className={`${couleur.bg} rounded-2xl p-4 shadow-sm border ${couleur.border}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${couleur.bg} border ${couleur.border}`}>
                      <IconComponent className={`w-5 h-5 ${couleur.text}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${couleur.text}`}>{objectif.nom}</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                          objectif.priorite === 'haute' ? 'bg-red-200 text-red-700' :
                          objectif.priorite === 'moyenne' ? 'bg-orange-200 text-orange-700' :
                          'bg-green-200 text-green-700'
                        }`}>
                          {objectif.priorite === 'haute' ? '🔴 Haute' : objectif.priorite === 'moyenne' ? '🟠 Moyenne' : '🟢 Basse'}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                          objectif.type === 'court' ? 'bg-blue-200 text-blue-700' : 'bg-purple-200 text-purple-700'
                        }`}>
                          {objectif.type === 'court' ? '🎯 Court' : '🏔️ Long'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openVersementModal(objectif.id)} className="p-1.5 hover:bg-white/30 rounded-lg">
                      <Plus className={`w-4 h-4 ${couleur.text}`} />
                    </button>
                    <button onClick={() => handleEdit(objectif)} className="p-1.5 hover:bg-white/30 rounded-lg">
                      <Edit3 className={`w-4 h-4 ${couleur.text}`} />
                    </button>
                    <button onClick={() => handleDelete(objectif.id)} className="p-1.5 hover:bg-white/30 rounded-lg">
                      <Trash2 className={`w-4 h-4 ${couleur.text}`} />
                    </button>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : couleur.progress}`}
                    style={{ width: `${Math.min(pourcentage, 100)}%` }}
                  />
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-4">
                    <div>
                      <p className={`text-[10px] ${couleur.text} opacity-60`}>Objectif</p>
                      <p className={`text-xs font-medium ${couleur.text}`}>{objectif.montantCible.toFixed(0)}{parametres.devise}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] ${couleur.text} opacity-60`}>Épargné</p>
                      <p className={`text-xs font-medium ${couleur.text}`}>{objectif.montantActuel.toFixed(0)}{parametres.devise}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] ${couleur.text} opacity-60`}>Reste</p>
                      <p className={`text-xs font-medium ${reste > 0 ? couleur.text : 'text-green-600'}`}>
                        {reste > 0 ? reste.toFixed(0) + parametres.devise : '✓'}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                    isComplete ? 'bg-green-500 text-white' :
                    isAlmostComplete ? 'bg-[#D4AF37] text-[#722F37]' :
                    'bg-white/50 ' + couleur.text
                  }`}>
                    {isComplete ? '🎉 Atteint !' : `${Math.round(pourcentage)}%`}
                  </div>
                </div>

                {/* Infos supplémentaires */}
                <div className={`pt-2 border-t ${couleur.border} border-opacity-30 space-y-1`}>
                  {objectif.dateEcheance && (
                    <p className={`text-[10px] ${couleur.text} opacity-70`}>
                      📅 Échéance : {formatDate(objectif.dateEcheance)} ({moisRestants} mois)
                    </p>
                  )}
                  {suggestion && !isComplete && (
                    <p className={`text-[10px] ${couleur.text} opacity-70`}>
                      💡 Épargnez {suggestion}{parametres.devise}/mois pour atteindre votre objectif
                    </p>
                  )}
                  {objectif.recurrence && (
                    <div className="flex items-center justify-between">
                      <p className={`text-[10px] ${couleur.text} opacity-70`}>
                        🔄 Récurrence : {getRecurrenceLabel(objectif.recurrence)}
                      </p>
                      <button
                        onClick={() => toggleRecurrence(objectif.id)}
                        className={`w-8 h-4 rounded-full transition-colors ${
                          objectif.recurrence.actif ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${
                          objectif.recurrence.actif ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  )}
                  {isComplete && (
                    <p className="text-[10px] text-green-600 font-medium">✅ Félicitations ! Objectif atteint !</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={cardStyle + " text-center py-8 mb-4"}>
          <Target className="w-12 h-12 text-[#D4AF37]/30 mx-auto mb-3" />
          <p className={pageSubtitleStyle + " mb-2"}>
            {activeFilter === 'tous' ? 'Aucun objectif' : `Aucun objectif ${activeFilter === 'court' ? 'court terme' : 'long terme'}`}
          </p>
          <p className={smallTextStyle}>Créez votre premier objectif</p>
        </div>
      )}

      {/* Conseils */}
      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className={conseilIconStyle} />
          <h4 className={conseilTitleStyle}>💡 Conseils</h4>
        </div>
        <div className="space-y-2">
          {objectifs.length === 0 && (
            <p className={conseilTextStyle}>📝 Créez des objectifs pour mieux épargner</p>
          )}
          {objectifs.some(o => (o.montantActuel / o.montantCible) * 100 >= 100) && (
            <p className={conseilTextStyle}>🎉 Félicitations ! Vous avez atteint au moins un objectif</p>
          )}
          {objectifs.filter(o => o.priorite === 'haute' && (o.montantActuel / o.montantCible) * 100 < 50).length > 0 && (
            <p className={conseilTextStyle}>🔴 Vos objectifs prioritaires ont besoin d'attention</p>
          )}
          {progressionGlobale > 0 && progressionGlobale < 100 && (
            <p className={conseilTextStyle}>💪 Continuez ! Vous êtes à {Math.round(progressionGlobale)}% de vos objectifs</p>
          )}
          {objectifsAvecRecurrence > 0 && (
            <p className={conseilTextStyle}>🔄 {objectifsAvecRecurrence} objectif(s) avec versement automatique actif</p>
          )}
          {objectifs.length > 0 && objectifsAvecRecurrence === 0 && (
            <p className={conseilTextStyle}>💡 Activez les récurrences pour épargner automatiquement</p>
          )}
        </div>
      </div>

      {/* Modal formulaire */}
      {showForm && (
       <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#8B4557] rounded-2xl p-4 w-full max-w-md my-8 border border-[#D4AF37]">
            <div className="flex items-center justify-between mb-4">
              <h2 className={pageTitleStyle}>{editingId ? 'Modifier' : 'Nouvel'} objectif</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1">
                <X className="w-5 h-5 text-[#D4AF37]" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nom */}
              <div>
                <label className={labelStyle}>Nom de l'objectif</label>
                <input
                  type="text"
                  placeholder="Ex: Voyage Japon, iPhone..."
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className={inputStyle}
                />
              </div>

              {/* Montants */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>Montant à atteindre ({parametres.devise})</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.montantCible}
                    onChange={(e) => setFormData({ ...formData, montantCible: e.target.value })}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Déjà épargné ({parametres.devise})</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.montantActuel}
                    onChange={(e) => setFormData({ ...formData, montantActuel: e.target.value })}
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Date d'échéance */}
              <div>
                <label className={labelStyle}>Date d'échéance (optionnel)</label>
                <input
                  type="date"
                  value={formData.dateEcheance}
                  onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
                  className={inputStyle}
                />
              </div>

              {/* Type : Court terme / Long terme */}
              <div>
                <label className={labelStyle}>Type d'objectif</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['court', 'long'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={`py-2 rounded-xl text-xs font-medium border ${
                        formData.type === t
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-[#722F37]'
                          : 'bg-[#722F37]/50 border-[#D4AF37]/50 text-[#D4AF37]'
                      }`}
                    >
                      {t === 'court' ? '🎯 Court terme' : '🏔️ Long terme'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priorité */}
              <div>
                <label className={labelStyle}>Priorité</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['haute', 'moyenne', 'basse'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setFormData({ ...formData, priorite: p })}
                      className={`py-2 rounded-xl text-xs font-medium border ${
                        formData.priorite === p
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-[#722F37]'
                          : 'bg-[#722F37]/50 border-[#D4AF37]/50 text-[#D4AF37]'
                      }`}
                    >
                      {p === 'haute' ? '🔴 Haute' : p === 'moyenne' ? '🟠 Moyenne' : '🟢 Basse'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Couleur */}
              <div>
                <label className={labelStyle}>Couleur</label>
                <div className="grid grid-cols-4 gap-2">
                  {couleursDisponibles.map((couleur) => (
                    <button
                      key={couleur.id}
                      onClick={() => setFormData({ ...formData, couleur: couleur.id })}
                      className={`h-10 rounded-xl border-2 ${
                        formData.couleur === couleur.id ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]' : couleur.border
                      }`}
                    >
                      <div className={`w-full h-full rounded-lg ${couleur.bg}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Icône */}
              <div>
                <label className={labelStyle}>Icône</label>
                <div className="grid grid-cols-6 gap-2">
                  {iconesDisponibles.map((icone) => {
                    const IconComp = icone.icon;
                    return (
                      <button
                        key={icone.id}
                        onClick={() => setFormData({ ...formData, icone: icone.id })}
                        className={`h-10 rounded-xl flex items-center justify-center border ${
                          formData.icone === icone.id
                            ? 'bg-[#D4AF37] border-[#D4AF37] text-[#722F37]'
                            : 'bg-[#722F37]/50 border-[#D4AF37]/50 text-[#D4AF37]'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Récurrence */}
              <div className={`p-3 rounded-xl border ${formData.recurrenceActif ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#D4AF37]/30 bg-[#722F37]/30'}`}>
                <div className="flex items-center justify-between mb-3">
                  <label className={labelStyle + " mb-0 flex items-center gap-2"}>
                    <RefreshCw className="w-4 h-4" />
                    Versement récurrent
                  </label>
                  <button
                    onClick={() => setFormData({ ...formData, recurrenceActif: !formData.recurrenceActif })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.recurrenceActif ? 'bg-green-500' : 'bg-[#722F37]/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      formData.recurrenceActif ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {formData.recurrenceActif && (
                  <div className="space-y-3">
                    {/* Fréquence */}
                    <div>
                      <label className={smallTextStyle + " block mb-1"}>Fréquence</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['mensuel', 'bimensuel', 'hebdomadaire'] as const).map((f) => (
                          <button
                            key={f}
                            onClick={() => setFormData({ ...formData, recurrenceFrequence: f, recurrenceJour: f === 'hebdomadaire' ? '1' : '1' })}
                            className={`py-1.5 rounded-lg text-[10px] font-medium border ${
                              formData.recurrenceFrequence === f
                                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#722F37]'
                                : 'bg-[#722F37]/50 border-[#D4AF37]/50 text-[#D4AF37]'
                            }`}
                          >
                            {f === 'mensuel' ? 'Mensuel' : f === 'bimensuel' ? '2x/mois' : 'Hebdo'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Montant et jour */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={smallTextStyle + " block mb-1"}>Montant ({parametres.devise})</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={formData.recurrenceMontant}
                          onChange={(e) => setFormData({ ...formData, recurrenceMontant: e.target.value })}
                          className={inputStyle + " text-xs"}
                        />
                      </div>
                      <div>
                        <label className={smallTextStyle + " block mb-1"}>
                          {formData.recurrenceFrequence === 'hebdomadaire' ? 'Jour de la semaine' : 'Jour du mois'}
                        </label>
                        <select
                          value={formData.recurrenceJour}
                          onChange={(e) => setFormData({ ...formData, recurrenceJour: e.target.value })}
                          className={inputStyle + " text-xs"}
                        >
                          {formData.recurrenceFrequence === 'hebdomadaire' ? (
                            joursSemaine.map((jour, i) => (
                              <option key={i} value={i}>{jour}</option>
                            ))
                          ) : (
                            Array.from({ length: 31 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="flex-1 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {editingId ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal versement */}
      {showVersementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#8B4557] rounded-2xl p-4 w-full max-w-sm border border-[#D4AF37]/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className={pageTitleStyle}>Ajouter un versement</h2>
              <button onClick={() => setShowVersementModal(false)} className="p-1">
                <X className="w-5 h-5 text-[#D4AF37]" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelStyle}>Montant du versement ({parametres.devise})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={versementMontant}
                  onChange={(e) => setVersementMontant(e.target.value)}
                  className={inputStyle}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowVersementModal(false)}
                  className="flex-1 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleVersement}
                  className="flex-1 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ParametresPage() {
  const { parametres, saveParametres } = useParametres();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [newCategorie, setNewCategorie] = useState('');
  const [editingCompte, setEditingCompte] = useState<CompteBancaire | null>(null);
  const [showCompteForm, setShowCompteForm] = useState(false);
  const [compteForm, setCompteForm] = useState({ nom: '', soldeDepart: '', isEpargne: false });

  const toggleSection = (section: string) => setActiveSection(activeSection === section ? null : section);
  
  const addCategorie = (type: 'categoriesRevenus' | 'categoriesFactures' | 'categoriesDepenses' | 'categoriesEpargnes') => {
    if (!newCategorie.trim()) return;
    const updated = { ...parametres, [type]: [...parametres[type], newCategorie.trim()] };
    saveParametres(updated);
    setNewCategorie('');
  };

  const removeCategorie = (type: 'categoriesRevenus' | 'categoriesFactures' | 'categoriesDepenses' | 'categoriesEpargnes', index: number) => {
    const updated = { ...parametres, [type]: parametres[type].filter((_, i) => i !== index) };
    saveParametres(updated);
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

  const editCompte = (compte: CompteBancaire) => { setEditingCompte(compte); setCompteForm({ nom: compte.nom, soldeDepart: compte.soldeDepart.toString(), isEpargne: compte.isEpargne }); setShowCompteForm(true); };
  const deleteCompte = (id: number) => saveParametres({ ...parametres, comptesBancaires: parametres.comptesBancaires.filter(c => c.id !== id) });

  const exportData = () => {
    const data = { parametres, transactions: JSON.parse(localStorage.getItem('budget-transactions') || '[]'), enveloppes: JSON.parse(localStorage.getItem('budget-enveloppes') || '[]'), objectifs: JSON.parse(localStorage.getItem('budget-objectifs') || '[]'), memo: JSON.parse(localStorage.getItem('budget-memo') || '[]'), userName: localStorage.getItem('budget-user-name') || 'Utilisateur' };
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
        alert('Données importées avec succès ! Rechargez la page pour voir les changements.');
      } catch (error) { alert("Erreur lors de l'importation du fichier."); }
    };
    reader.readAsText(file);
  };

  const resetAllData = () => {
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer TOUTES les données ? Cette action est irréversible.')) {
      localStorage.removeItem('budget-transactions');
      localStorage.removeItem('budget-enveloppes');
      localStorage.removeItem('budget-objectifs');
      localStorage.removeItem('budget-memo');
      localStorage.removeItem('budget-parametres');
      localStorage.removeItem('budget-user-name');
      alert('Toutes les données ont été supprimées. La page va se recharger.');
      window.location.reload();
    }
  };

  const inputStyle = inputStyleGlobal;
  const labelStyle = labelStyleGlobal;

  const renderCategorieSection = (title: string, type: 'categoriesRevenus' | 'categoriesFactures' | 'categoriesDepenses' | 'categoriesEpargnes', icon: React.ReactNode) => (
    <div className={cardStyle + " mb-3"}>
      <button onClick={() => toggleSection(type)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">{icon}<span className={sectionTitleStyle}>{title}</span><span className={smallTextStyle}>({parametres[type].length})</span></div>
        {activeSection === type ? <ChevronUp className="w-5 h-5 text-[#D4AF37]" /> : <ChevronDown className="w-5 h-5 text-[#D4AF37]" />}
      </button>
      {activeSection === type && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2"><input type="text" placeholder="Nouvelle catégorie..." value={newCategorie} onChange={(e) => setNewCategorie(e.target.value)} className={inputStyle + " flex-1"} onKeyDown={(e) => { if (e.key === 'Enter') addCategorie(type); }} /><button onClick={() => addCategorie(type)} className="px-4 py-2 bg-[#D4AF37] text-[#722F37] rounded-xl"><Plus className="w-5 h-5" /></button></div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {parametres[type].map((cat, index) => (
              <div key={index} className="flex items-center justify-between px-3 py-2 bg-[#722F37]/40 rounded-xl">
                <span className={valueStyle}>{cat}</span>
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
      <div className="text-center mb-4"><h1 className={pageTitleStyle}>Paramètres</h1><p className={pageSubtitleStyle}>Configuration de l'application</p></div>

      <div className={cardStyle + " mb-4"}>
        <h3 className={sectionTitleStyle + " mb-3 flex items-center gap-2"}><Settings className="w-5 h-5 text-[#D4AF37]" />Général</h3>
        <div className="space-y-3">
          <div><label className={labelStyle}>Devise</label><select value={parametres.devise} onChange={(e) => saveParametres({ ...parametres, devise: e.target.value })} className={selectStyle + " w-full"}><option value="€">€ Euro</option><option value="$">$ Dollar</option><option value="£">£ Livre</option><option value="CHF">CHF Franc Suisse</option></select></div>
          <div><label className={labelStyle}>Date de départ du budget</label><input type="date" value={parametres.dateDepart} onChange={(e) => saveParametres({ ...parametres, dateDepart: e.target.value })} className={inputStyle} /></div>
          <div className="flex items-center justify-between"><label className={labelStyle + " mb-0"}>Budget avant le 1er du mois</label><button onClick={() => saveParametres({ ...parametres, budgetAvantPremier: !parametres.budgetAvantPremier })} className={`w-12 h-6 rounded-full transition-colors ${parametres.budgetAvantPremier ? 'bg-[#D4AF37]' : 'bg-[#722F37]/50'}`}><div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${parametres.budgetAvantPremier ? 'translate-x-6' : 'translate-x-0.5'}`} /></button></div>
        </div>
      </div>

      <div className={cardStyle + " mb-4"}>
        <button onClick={() => toggleSection('comptes')} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3"><Building className="w-5 h-5 text-[#D4AF37]" /><span className={sectionTitleStyle}>Comptes bancaires</span><span className={smallTextStyle}>({parametres.comptesBancaires.length})</span></div>
          {activeSection === 'comptes' ? <ChevronUp className="w-5 h-5 text-[#D4AF37]" /> : <ChevronDown className="w-5 h-5 text-[#D4AF37]" />}
        </button>
        {activeSection === 'comptes' && (
          <div className="mt-4 space-y-3">
            <button onClick={() => { setCompteForm({ nom: '', soldeDepart: '', isEpargne: false }); setEditingCompte(null); setShowCompteForm(true); }} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#722F37] rounded-xl font-medium text-sm"><Plus className="w-4 h-4" />Ajouter un compte</button>
            <div className="space-y-2">
              {parametres.comptesBancaires.map((compte) => (
                <div key={compte.id} className="flex items-center justify-between px-3 py-2 bg-[#722F37]/40 rounded-xl">
                  <div><p className={valueStyle}>{compte.nom}</p><p className={smallTextStyle}>{compte.isEpargne ? '💰 Épargne' : '🏦 Courant'} • Solde départ: {compte.soldeDepart}{parametres.devise}</p></div>
                  <div className="flex gap-1"><button onClick={() => editCompte(compte)} className="p-1.5 hover:bg-[#D4AF37]/20 rounded-lg"><Edit3 className="w-4 h-4 text-[#D4AF37]" /></button><button onClick={() => deleteCompte(compte.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button></div>
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

      <div className={cardStyle + " mb-4"}>
        <h3 className={sectionTitleStyle + " mb-3 flex items-center gap-2"}><Database className="w-5 h-5 text-[#D4AF37]" />Données</h3>
        <div className="space-y-3">
          <button onClick={exportData} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-medium"><Upload className="w-5 h-5" />Exporter les données</button>
          <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#722F37]/50 border border-[#D4AF37]/50 text-[#D4AF37] rounded-xl font-medium cursor-pointer"><RefreshCw className="w-5 h-5" />Importer des données<input type="file" accept=".json" onChange={importData} className="hidden" /></label>
          <button onClick={resetAllData} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-medium"><Trash2 className="w-5 h-5" />Réinitialiser toutes les données</button>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth'; }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#722F37] border border-[#D4AF37]/50 text-[#D4AF37] rounded-xl font-medium"><LogOut className="w-5 h-5" />Se déconnecter</button>
        </div>
      </div>

      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-3"><Lightbulb className={conseilIconStyle} /><h4 className={conseilTitleStyle}>💡 Conseils</h4></div>
        <div className="space-y-2">
          <p className={conseilTextStyle}>📦 Exportez régulièrement vos données pour les sauvegarder</p>
          <p className={conseilTextStyle}>🏦 Ajoutez tous vos comptes pour un suivi complet</p>
          <p className={conseilTextStyle}>📂 Personnalisez les catégories selon vos besoins</p>
        </div>
      </div>

      <div className={cardStyle + " mt-4 text-center"}>
        <p className={smallTextStyle}>The Budget Planner v1.0</p>
        <p className={smallTextStyle}>Créé avec ❤️ par Shina5</p>
      </div>

      {showCompteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#8B4557] rounded-2xl p-4 w-full max-w-sm border border-[#D4AF37]/40">
            <div className="flex items-center justify-between mb-4"><h2 className={pageTitleStyle}>{editingCompte ? 'Modifier' : 'Nouveau'} compte</h2><button onClick={() => setShowCompteForm(false)} className="p-1"><X className="w-5 h-5 text-[#D4AF37]" /></button></div>
            <div className="space-y-4">
              <div><label className={labelStyle}>Nom du compte</label><input type="text" placeholder="Ex: CCP La Banque Postale" value={compteForm.nom} onChange={(e) => setCompteForm({ ...compteForm, nom: e.target.value })} className={inputStyle} /></div>
              <div><label className={labelStyle}>Solde de départ ({parametres.devise})</label><input type="number" placeholder="0" value={compteForm.soldeDepart} onChange={(e) => setCompteForm({ ...compteForm, soldeDepart: e.target.value })} className={inputStyle} /></div>
              <div className="flex items-center justify-between"><label className={labelStyle + " mb-0"}>Compte épargne</label><button onClick={() => setCompteForm({ ...compteForm, isEpargne: !compteForm.isEpargne })} className={`w-12 h-6 rounded-full transition-colors ${compteForm.isEpargne ? 'bg-[#D4AF37]' : 'bg-[#722F37]/50'}`}><div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${compteForm.isEpargne ? 'translate-x-6' : 'translate-x-0.5'}`} /></button></div>
              <div className="flex gap-3"><button onClick={() => setShowCompteForm(false)} className="flex-1 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium">Annuler</button><button onClick={handleCompteSubmit} className="flex-1 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-semibold">{editingCompte ? 'Modifier' : 'Créer'}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState('accueil');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #E8C4C4 0%, #DBADB0 30%, #CFA0A5 50%, #DBADB0 70%, #E8C4C4 100%)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#722F37] font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false);
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
      case 'plus': return <PlusPage onNavigate={handleNavigate} />;
      default: return <AccueilPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #E8C4C4 0%, #DBADB0 30%, #CFA0A5 50%, #DBADB0 70%, #E8C4C4 100%)' }}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="px-4 pt-20 pb-24 max-w-md mx-auto">
          {renderPage()}
        </main>
        <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      </div>
    </ThemeProvider>
  );
}

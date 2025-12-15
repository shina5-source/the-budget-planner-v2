"use client";

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, TrendingUp, Home as HomeIcon, PiggyBank, 
  Sun, Target, PieChart, Sparkles, Pencil, X, Check, Flame,
  AlertTriangle, Clock, Wallet, ShoppingBag, CloudSun, CloudRain, Cloud,
  ArrowUpRight, ArrowDownRight, Trophy, Mail, Calendar, Gift, Zap, Quote, Award
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

interface RecurringTransaction {
  id: string;
  nom: string;
  montant: number;
  type: 'revenu' | 'facture' | 'depense' | 'epargne';
  jourDuMois?: number;
  actif: boolean;
}

interface Objectif {
  id: number;
  nom: string;
  montantCible: number;
  montantActuel: number;
}

interface ParametresData {
  devise: string;
}

const defaultParametres: ParametresData = {
  devise: '€'
};

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 76 }, (_, i) => 2025 + i);

function AccueilContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [userName, setUserName] = useState('Utilisateur');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    
    const savedRecurring = localStorage.getItem('budget-recurring');
    if (savedRecurring) setRecurring(JSON.parse(savedRecurring));
    
    const savedObjectifs = localStorage.getItem('budget-objectifs');
    if (savedObjectifs) setObjectifs(JSON.parse(savedObjectifs));
    
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
    
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

  // === CALCULS DE BASE ===
  const getMonthKey = (year: number, month: number) => `${year}-${(month + 1).toString().padStart(2, '0')}`;
  const currentMonthKey = getMonthKey(selectedYear, selectedMonth);
  const filteredTransactions = transactions.filter(t => t.date?.startsWith(currentMonthKey));
  
  // Mois précédent
  const getPrevMonthKey = () => {
    let m = selectedMonth - 1;
    let y = selectedYear;
    if (m < 0) { m = 11; y--; }
    return getMonthKey(y, m);
  };
  const prevMonthTransactions = transactions.filter(t => t.date?.startsWith(getPrevMonthKey()));
  
  // Totaux mois actuel
  const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalFactures = filteredTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalDepenses = filteredTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEpargnes = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  
  // Totaux mois précédent
  const prevRevenus = prevMonthTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const prevFactures = prevMonthTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const prevDepenses = prevMonthTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const prevEpargnes = prevMonthTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  
  // Calculs dérivés
  const budgetPrevu = totalRevenus - totalFactures;
  const reposPrevu = totalRevenus - totalFactures - totalEpargnes;
  const soldeReel = totalRevenus - totalFactures - totalDepenses - totalEpargnes;
  const prevSolde = prevRevenus - prevFactures - prevDepenses - prevEpargnes;

  // === AMÉLIORATION 3: Variations vs mois précédent ===
  const getVariation = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  // === AMÉLIORATION 5: Sparkline data (6 derniers mois) ===
  const getSparklineData = (type: string) => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      let m = selectedMonth - i;
      let y = selectedYear;
      while (m < 0) { m += 12; y--; }
      const key = getMonthKey(y, m);
      const total = transactions
        .filter(t => t.date?.startsWith(key) && t.type === type)
        .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      data.push(total);
    }
    return data;
  };

  // === AMÉLIORATION 7: Dernières 5 transactions ===
  const lastTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // === AMÉLIORATION 8: Factures à venir ===
  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  
  const facturesAVenir = recurring
    .filter(r => r.actif && r.type === 'facture')
    .filter(r => r.jourDuMois && r.jourDuMois > currentDay && r.jourDuMois <= currentDay + 7)
    .slice(0, 3);

  // === AMÉLIORATION 10: Score financier ===
  const calculateFinancialScore = () => {
    let score = 50; // Base
    
    // Solde positif (+20)
    if (soldeReel > 0) score += 20;
    else if (soldeReel < 0) score -= 20;
    
    // Taux d'épargne > 10% (+15)
    const tauxEpargne = totalRevenus > 0 ? (totalEpargnes / totalRevenus) * 100 : 0;
    if (tauxEpargne >= 20) score += 20;
    else if (tauxEpargne >= 10) score += 10;
    
    // Dépenses sous contrôle (+10)
    const prevTotal = prevFactures + prevDepenses;
    const currentTotal = totalFactures + totalDepenses;
    if (prevTotal > 0 && currentTotal <= prevTotal) score += 10;
    
    // Objectifs en cours (+5)
    if (objectifs.length > 0) score += 5;
    
    return Math.min(100, Math.max(0, score));
  };
  
  const financialScore = calculateFinancialScore();
  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent !', color: 'text-green-400', emoji: '🏆' };
    if (score >= 60) return { label: 'Bien !', color: 'text-blue-400', emoji: '👍' };
    if (score >= 40) return { label: 'Attention', color: 'text-orange-400', emoji: '⚠️' };
    return { label: 'À améliorer', color: 'text-red-400', emoji: '📉' };
  };
  const scoreInfo = getScoreLabel(financialScore);

  // === AMÉLIORATION 11: Streak épargne ===
  const calculateEpargneStreak = () => {
    let streak = 0;
    for (let i = 0; i < 12; i++) {
      let m = selectedMonth - i;
      let y = selectedYear;
      while (m < 0) { m += 12; y--; }
      const key = getMonthKey(y, m);
      const epargne = transactions
        .filter(t => t.date?.startsWith(key) && t.type === 'Épargnes')
        .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      if (epargne > 0) streak++;
      else break;
    }
    return streak;
  };
  const epargneStreak = calculateEpargneStreak();

  // === AMÉLIORATION 13: Météo financière ===
  const getFinancialWeather = () => {
    if (soldeReel > totalRevenus * 0.2) return { icon: Sun, label: 'Ensoleillé', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (soldeReel > 0) return { icon: CloudSun, label: 'Nuageux', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (soldeReel > -100) return { icon: Cloud, label: 'Couvert', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    return { icon: CloudRain, label: 'Orageux', color: 'text-red-400', bg: 'bg-red-500/20' };
  };
  const weather = getFinancialWeather();

  // === AMÉLIORATION 14: Compte à rebours paie ===
  const getNextPayday = () => {
    const prochainRevenu = recurring.find(r => r.actif && r.type === 'revenu' && r.jourDuMois);
    if (!prochainRevenu || !prochainRevenu.jourDuMois) return null;
    
    let jour = prochainRevenu.jourDuMois;
    let joursRestants = jour - currentDay;
    if (joursRestants <= 0) joursRestants += daysInMonth;
    
    return { nom: prochainRevenu.nom, jours: joursRestants, montant: prochainRevenu.montant };
  };
  const nextPayday = getNextPayday();

  // === AMÉLIORATION 18: Budget restant par jour ===
  const joursRestants = daysInMonth - currentDay;
  const budgetParJour = joursRestants > 0 ? Math.max(0, soldeReel) / joursRestants : 0;

  // === AMÉLIORATION 22: Top 3 dépenses ===
  const top3Depenses = [...filteredTransactions]
    .filter(t => t.type === 'Dépenses' || t.type === 'Factures')
    .sort((a, b) => parseFloat(b.montant || '0') - parseFloat(a.montant || '0'))
    .slice(0, 3);

  // === AMÉLIORATION 23: Catégorie la plus gourmande ===
  const depensesParCategorie: Record<string, number> = {};
  filteredTransactions
    .filter(t => t.type === 'Dépenses')
    .forEach(t => {
      depensesParCategorie[t.categorie] = (depensesParCategorie[t.categorie] || 0) + parseFloat(t.montant || '0');
    });
  const categorieGourmande = Object.entries(depensesParCategorie)
    .sort(([,a], [,b]) => b - a)[0];

  // === AMÉLIORATION 6: Objectif du mois ===
  const objectifPrincipal = objectifs
    .filter(o => o.montantActuel < o.montantCible && o.montantCible > 0)
    .sort((a, b) => (b.montantActuel / b.montantCible) - (a.montantActuel / a.montantCible))[0];

  // === NOUVEAU: Résumé semaine (Widget 2) ===
  const getWeekTransactions = (weeksAgo: number = 0) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1 - (weeksAgo * 7)); // Lundi
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche
    endOfWeek.setHours(23, 59, 59, 999);
    
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date >= startOfWeek && date <= endOfWeek && (t.type === 'Dépenses' || t.type === 'Factures');
    });
  };
  
  const thisWeekTransactions = getWeekTransactions(0);
  const lastWeekTransactions = getWeekTransactions(1);
  const thisWeekTotal = thisWeekTransactions.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const lastWeekTotal = lastWeekTransactions.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);

  // === NOUVEAU: Citations motivantes (Widget 4) ===
  const citations = [
    { text: "Un euro économisé est un euro gagné.", author: "Benjamin Franklin" },
    { text: "La richesse consiste bien plus dans l'usage qu'on en fait que dans la possession.", author: "Aristote" },
    { text: "Ne dépensez pas votre argent avant de l'avoir gagné.", author: "Thomas Jefferson" },
    { text: "L'argent est un bon serviteur mais un mauvais maître.", author: "Alexandre Dumas" },
    { text: "Celui qui achète ce dont il n'a pas besoin vole celui qu'il est.", author: "Proverbe suédois" },
    { text: "La vraie richesse, c'est de ne pas avoir besoin de grand-chose.", author: "Épicure" },
    { text: "Économiser, c'est prévoir.", author: "Proverbe français" },
    { text: "Le budget est un outil, pas une prison.", author: "Dave Ramsey" },
    { text: "Payez-vous en premier.", author: "George S. Clason" },
    { text: "La liberté financière commence par un premier pas.", author: "Anonyme" },
  ];
  const citationDuJour = citations[new Date().getDate() % citations.length];

  // === NOUVEAU: Défi du mois (Widget 7) ===
  const categoriesPourDefi = Object.entries(depensesParCategorie)
    .filter(([_, montant]) => montant > 50)
    .sort(([,a], [,b]) => b - a);
  const defiCategorie = categoriesPourDefi[0];
  const defiObjectif = defiCategorie ? defiCategorie[1] * 0.8 : 0; // Réduire de 20%

  // === NOUVEAU: Économies potentielles (Widget 8) ===
  const petitesDepenses = filteredTransactions
    .filter(t => t.type === 'Dépenses' && parseFloat(t.montant || '0') < 10)
    .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const economiesPotentiellesAnnuelles = petitesDepenses * 12 * 0.5; // Si on réduit de 50%

  // === NOUVEAU: Anniversaire budget (Widget 9) ===
  const getAppAge = () => {
    const firstUse = localStorage.getItem('budget-first-use');
    if (!firstUse) {
      localStorage.setItem('budget-first-use', new Date().toISOString());
      return 0;
    }
    const days = Math.floor((new Date().getTime() - new Date(firstUse).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };
  const appAgeDays = getAppAge();
  const appAgeMonths = Math.floor(appAgeDays / 30);

  // === NOUVEAU: Jour sans dépense (Widget 12) ===
  const todayKey = new Date().toISOString().split('T')[0];
  const depensesAujourdhui = transactions
    .filter(t => t.date?.startsWith(todayKey) && (t.type === 'Dépenses' || t.type === 'Factures'))
    .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const isJourSansDepense = depensesAujourdhui === 0;

  // === NOUVEAU: Jours consécutifs sans dépense ===
  const getConsecutiveNoDays = () => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateKey = checkDate.toISOString().split('T')[0];
      const hasDepense = transactions.some(t => 
        t.date?.startsWith(dateKey) && (t.type === 'Dépenses' || t.type === 'Factures')
      );
      if (!hasDepense && i > 0) count++;
      else if (hasDepense && i > 0) break;
    }
    return count;
  };
  const joursSansDepense = getConsecutiveNoDays();

  // === NOUVEAU: Fun facts (Widget 13) ===
  const getFunFact = () => {
    // Jour de la semaine avec le plus de dépenses
    const depensesParJour: Record<number, number> = {};
    transactions.filter(t => t.type === 'Dépenses').forEach(t => {
      if (t.date) {
        const jour = new Date(t.date).getDay();
        depensesParJour[jour] = (depensesParJour[jour] || 0) + parseFloat(t.montant || '0');
      }
    });
    const jourMax = Object.entries(depensesParJour).sort(([,a], [,b]) => b - a)[0];
    const joursNoms = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    if (jourMax && parseFloat(jourMax[1] as unknown as string) > 0) {
      return `Vous dépensez le plus le ${joursNoms[parseInt(jourMax[0])]} ! 📊`;
    }
    
    // Nombre de transactions ce mois
    const nbTransactions = filteredTransactions.length;
    if (nbTransactions > 0 && currentDay > 0) {
      return `${nbTransactions} transactions ce mois, soit ~${(nbTransactions / currentDay).toFixed(1)}/jour 📈`;
    }
    
    return "Commencez à suivre vos dépenses pour découvrir vos habitudes ! 🔍";
  };
  const funFact = getFunFact();

  // Navigation
  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); } 
    else setSelectedMonth(selectedMonth - 1);
  };
  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); } 
    else setSelectedMonth(selectedMonth + 1);
  };
  const navigateTo = (page: string) => router.push(`/${page}`);

  // Styles
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  // === COMPOSANT: Mini Sparkline ===
  const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data, 1);
    return (
      <div className="flex items-end gap-0.5 h-6">
        {data.map((value, i) => (
          <div
            key={i}
            className="w-1.5 rounded-t transition-all"
            style={{
              height: `${Math.max((value / max) * 100, 8)}%`,
              backgroundColor: i === data.length - 1 ? color : `${color}50`
            }}
          />
        ))}
      </div>
    );
  };

  // === COMPOSANT: Badge Variation ===
  const VariationBadge = ({ current, previous }: { current: number; previous: number }) => {
    const variation = getVariation(current, previous);
    const isPositive = variation >= 0;
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
    
    return (
      <span className={`flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full ${
        isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}>
        <Icon className="w-2.5 h-2.5" />
        {Math.abs(variation).toFixed(0)}%
      </span>
    );
  };

  // === COMPOSANT: Progress Bar ===
  const ProgressBar = ({ value, max, color }: { value: number; max: number; color: string }) => {
    const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.colors.cardBorder}50` }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    );
  };

  // Données cartes avec améliorations
  const summaryCards = [
    { 
      title: 'Revenus', 
      amount: totalRevenus, 
      prev: prevRevenus,
      sub: `Reçus ce mois`,
      icon: TrendingUp, 
      color: '#4CAF50',
      sparkline: getSparklineData('Revenus'),
      progress: { value: totalRevenus, max: totalRevenus || 1 }
    },
    { 
      title: 'Factures', 
      amount: totalFactures, 
      prev: prevFactures,
      sub: `Charges fixes`,
      icon: HomeIcon, 
      color: '#F44336',
      sparkline: getSparklineData('Factures'),
      progress: { value: totalFactures, max: totalRevenus }
    },
    { 
      title: 'Dépenses', 
      amount: totalDepenses, 
      prev: prevDepenses,
      sub: `Variables`,
      icon: ShoppingBag, 
      color: '#FF9800',
      sparkline: getSparklineData('Dépenses'),
      progress: { value: totalDepenses, max: budgetPrevu }
    },
    { 
      title: 'Épargne', 
      amount: totalEpargnes, 
      prev: prevEpargnes,
      sub: totalRevenus > 0 ? `${((totalEpargnes / totalRevenus) * 100).toFixed(0)}% des revenus` : 'Aucun revenu',
      icon: PiggyBank, 
      color: '#2196F3',
      sparkline: getSparklineData('Épargnes'),
      progress: { value: totalEpargnes, max: totalRevenus * 0.2 }
    },
  ];

  const shortcuts = [
    { page: 'budget', title: 'Budget', icon: PieChart },
    { page: 'objectifs', title: 'Objectifs', icon: Target },
    { page: 'enveloppes', title: 'Enveloppes', icon: Mail },
    { page: 'statistiques', title: 'Stats', icon: TrendingUp },
  ];

  return (
    <div className="pb-4">
      {/* Logo */}
      <div className="text-center mb-2">
        <div className="w-20 h-20 mx-auto mb-2 rounded-2xl overflow-hidden shadow-lg border-2" style={{ borderColor: theme.colors.cardBorder }}>
          <Image src="/logo-shina5.png" alt="Logo" width={80} height={80} className="w-full h-full object-cover" priority />
        </div>
      </div>

      {/* Salutation */}
      <div className="text-center mb-3">
        {isEditingName ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-semibold" style={textPrimary}>Bonjour</span>
            <input 
              type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} 
              className="text-lg font-semibold rounded-xl px-3 py-1 w-28 text-center border" 
              style={{ background: theme.colors.cardBackgroundLight, color: theme.colors.textPrimary, borderColor: theme.colors.primary }} 
              autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setIsEditingName(false); }} 
            />
            <button onClick={saveName} className="p-1 rounded-full" style={{ background: `${theme.colors.primary}20` }}><Check className="w-4 h-4" style={textPrimary} /></button>
            <button onClick={() => setIsEditingName(false)} className="p-1 rounded-full" style={{ background: theme.colors.cardBackgroundLight }}><X className="w-4 h-4" style={textPrimary} /></button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-lg font-semibold" style={textPrimary}>Bonjour {userName} 👋</h1>
            <button onClick={startEditName} className="p-1 hover:opacity-80 rounded-full"><Pencil className="w-3 h-3" style={textSecondary} /></button>
          </div>
        )}
      </div>

      {/* === AMÉLIORATION 10: Score Financier + Météo === */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-3" style={cardStyle}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4" style={{ color: theme.colors.primary }} />
              <span className="text-xs font-semibold" style={textPrimary}>Score Financier</span>
              <span className="text-lg">{scoreInfo.emoji}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-bold ${scoreInfo.color}`}>{financialScore}</span>
              <span className="text-xs" style={textSecondary}>/100</span>
              <span className={`text-xs font-medium ${scoreInfo.color}`}>{scoreInfo.label}</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={financialScore} max={100} color={theme.colors.primary} />
            </div>
          </div>
          
          {/* Météo financière */}
          <div className={`p-3 rounded-xl ${weather.bg} flex flex-col items-center`}>
            <weather.icon className={`w-8 h-8 ${weather.color}`} />
            <span className={`text-[9px] mt-1 ${weather.color}`}>{weather.label}</span>
          </div>
        </div>

        {/* Streak épargne */}
        {epargneStreak > 0 && (
          <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTopWidth: 1, borderColor: `${theme.colors.cardBorder}50` }}>
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs" style={textPrimary}>
              <span className="font-bold text-orange-400">{epargneStreak} mois</span> consécutifs d'épargne !
            </span>
          </div>
        )}
      </div>

      {/* Sélecteur de mois */}
      <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5" style={textPrimary} /></button>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold" style={textPrimary}>{monthsFull[selectedMonth]}</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="rounded-lg px-2 py-1 text-sm font-semibold border" style={inputStyle}>
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5" style={textPrimary} /></button>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {monthsShort.map((month, index) => (
            <button key={index} onClick={() => setSelectedMonth(index)} className="px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors border" 
              style={selectedMonth === index ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* === AMÉLIORATION 18: Budget restant par jour === */}
      {soldeReel !== 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" style={{ color: theme.colors.primary }} />
              <span className="text-xs" style={textSecondary}>Budget restant / jour</span>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${soldeReel >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {budgetParJour.toFixed(0)} {parametres.devise}
              </span>
              <p className="text-[9px]" style={textSecondary}>{joursRestants} jours restants</p>
            </div>
          </div>
        </div>
      )}

      {/* === AMÉLIORATION 14: Compte à rebours paie === */}
      {nextPayday && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-xs font-medium" style={textPrimary}>{nextPayday.nom}</p>
                <p className="text-[9px]" style={textSecondary}>Prochain revenu</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-green-400">J-{nextPayday.jours}</span>
              <p className="text-[9px]" style={textSecondary}>+{nextPayday.montant.toFixed(0)} {parametres.devise}</p>
            </div>
          </div>
        </div>
      )}

      {/* === AMÉLIORATION 8: Alertes factures === */}
      {facturesAVenir.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3 bg-orange-500/10" style={{ borderColor: '#FF980050' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-semibold text-orange-400">{facturesAVenir.length} facture(s) à venir</span>
          </div>
          <div className="space-y-1">
            {facturesAVenir.map(f => (
              <div key={f.id} className="flex justify-between text-[10px]">
                <span style={textPrimary}>{f.nom}</span>
                <span style={textSecondary}>{f.jourDuMois} {monthsShort[selectedMonth]} • {f.montant.toFixed(0)} {parametres.devise}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === CARTES RÉSUMÉ AMÉLIORÉES === */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {summaryCards.map((item, idx) => {
          const isPositive = item.title === 'Revenus' || item.title === 'Épargne';
          const amountColor = isPositive 
            ? (item.amount > 0 ? 'text-green-400' : textPrimary.color)
            : (item.amount > item.prev ? 'text-red-400' : 'text-green-400');
          
          return (
            <div key={idx} className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border" style={cardStyle}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  <span className="text-[10px] font-medium" style={textSecondary}>{item.title}</span>
                </div>
                {item.prev > 0 && <VariationBadge current={item.amount} previous={item.prev} />}
              </div>
              
              <p className="text-xl font-bold mb-1" style={{ color: item.amount !== 0 ? item.color : textPrimary.color }}>
                {item.amount.toFixed(0)} <span className="text-xs font-normal">{parametres.devise}</span>
              </p>
              
              <ProgressBar value={item.progress.value} max={item.progress.max} color={item.color} />
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-[9px]" style={textSecondary}>{item.sub}</span>
                <MiniSparkline data={item.sparkline} color={item.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* === SOLDE RÉEL (carte mise en avant) === */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-3" style={{ 
        ...cardStyle, 
        background: soldeReel >= 0 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
        borderColor: soldeReel >= 0 ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'
      }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4" style={{ color: soldeReel >= 0 ? '#4ade80' : '#f87171' }} />
              <span className="text-xs font-medium" style={textSecondary}>Solde réel</span>
              {prevSolde !== 0 && <VariationBadge current={soldeReel} previous={prevSolde} />}
            </div>
            <p className={`text-3xl font-bold ${soldeReel >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {soldeReel >= 0 ? '+' : ''}{soldeReel.toFixed(0)} <span className="text-lg">{parametres.devise}</span>
            </p>
            {/* Message motivationnel - affiché seulement si pertinent */}
            {(soldeReel > 500 || soldeReel < -50 || (soldeReel > 0 && totalRevenus > 0)) && (
              <p className="text-[10px] mt-1" style={textSecondary}>
                {soldeReel > 500 ? '🎉 Excellent ! Pensez à épargner' : 
                 soldeReel > 0 && totalRevenus > 0 ? '👍 Budget maîtrisé' : 
                 soldeReel < -500 ? '🚨 Budget dépassé' :
                 soldeReel < -50 ? '⚠️ Attention aux dépenses' : null}
              </p>
            )}
          </div>
          <div className="text-right">
            <MiniSparkline data={[...Array(6)].map((_, i) => {
              let m = selectedMonth - (5 - i);
              let y = selectedYear;
              while (m < 0) { m += 12; y--; }
              const key = getMonthKey(y, m);
              const r = transactions.filter(t => t.date?.startsWith(key) && t.type === 'Revenus').reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
              const f = transactions.filter(t => t.date?.startsWith(key) && t.type === 'Factures').reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
              const d = transactions.filter(t => t.date?.startsWith(key) && t.type === 'Dépenses').reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
              const e = transactions.filter(t => t.date?.startsWith(key) && t.type === 'Épargnes').reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
              return Math.max(0, r - f - d - e);
            })} color={soldeReel >= 0 ? '#4ade80' : '#f87171'} />
          </div>
        </div>
      </div>

      {/* === AMÉLIORATION 16: Comparaison mois === */}
      {prevRevenus > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
          <h3 className="text-xs font-semibold mb-2 flex items-center gap-2" style={textPrimary}>
            <TrendingUp className="w-4 h-4" /> vs {monthsFull[selectedMonth === 0 ? 11 : selectedMonth - 1]}
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Revenus', current: totalRevenus, prev: prevRevenus, color: '#4CAF50' },
              { label: 'Factures', current: totalFactures, prev: prevFactures, color: '#F44336' },
              { label: 'Dépenses', current: totalDepenses, prev: prevDepenses, color: '#FF9800' },
              { label: 'Solde', current: soldeReel, prev: prevSolde, color: theme.colors.primary },
            ].map((item, i) => {
              const diff = item.current - item.prev;
              const isGood = item.label === 'Revenus' || item.label === 'Solde' ? diff >= 0 : diff <= 0;
              return (
                <div key={i}>
                  <p className="text-[9px]" style={textSecondary}>{item.label}</p>
                  <p className={`text-xs font-bold ${isGood ? 'text-green-400' : 'text-red-400'}`}>
                    {diff >= 0 ? '+' : ''}{diff.toFixed(0)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === AMÉLIORATION 22 & 23: Top dépenses + Catégorie gourmande === */}
      {(top3Depenses.length > 0 || categorieGourmande) && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
          {categorieGourmande && (
            <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottomWidth: 1, borderColor: `${theme.colors.cardBorder}50` }}>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span className="text-[10px]" style={textSecondary}>Catégorie gourmande</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-orange-400">{categorieGourmande[0]}</span>
                <span className="text-[10px] ml-1" style={textSecondary}>{categorieGourmande[1].toFixed(0)} {parametres.devise}</span>
              </div>
            </div>
          )}
          
          {top3Depenses.length > 0 && (
            <>
              <p className="text-[10px] font-medium mb-2" style={textSecondary}>Top 3 sorties</p>
              <div className="space-y-2">
                {top3Depenses.map((t, i) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}>
                        {i + 1}
                      </span>
                      <span className="text-xs" style={textPrimary}>{t.categorie}</span>
                    </div>
                    <span className="text-xs font-medium" style={{ color: t.type === 'Factures' ? '#F44336' : '#FF9800' }}>
                      {parseFloat(t.montant || '0').toFixed(0)} {parametres.devise}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* === AMÉLIORATION 6: Objectif du mois === */}
      {objectifPrincipal && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: theme.colors.primary }} />
              <span className="text-xs font-semibold" style={textPrimary}>{objectifPrincipal.nom}</span>
            </div>
            <span className="text-xs font-bold" style={{ color: theme.colors.primary }}>
              {objectifPrincipal.montantCible > 0 ? ((objectifPrincipal.montantActuel / objectifPrincipal.montantCible) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <ProgressBar value={objectifPrincipal.montantActuel} max={objectifPrincipal.montantCible} color={theme.colors.primary} />
          <div className="flex justify-between mt-1">
            <span className="text-[9px]" style={textSecondary}>{objectifPrincipal.montantActuel.toFixed(0)} {parametres.devise}</span>
            <span className="text-[9px]" style={textSecondary}>{objectifPrincipal.montantCible.toFixed(0)} {parametres.devise}</span>
          </div>
        </div>
      )}

      {/* === AMÉLIORATION 7: Dernières transactions === */}
      {lastTransactions.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={textPrimary}>Dernières transactions</span>
            <button onClick={() => navigateTo('transactions')} className="text-[10px]" style={{ color: theme.colors.primary }}>Voir tout →</button>
          </div>
          <div className="space-y-2">
            {lastTransactions.map(t => {
              const isRevenu = t.type === 'Revenus';
              const color = isRevenu ? '#4CAF50' : t.type === 'Factures' ? '#F44336' : t.type === 'Épargnes' ? '#2196F3' : '#FF9800';
              return (
                <div key={t.id} className="flex items-center justify-between py-1" style={{ borderBottomWidth: 1, borderColor: `${theme.colors.cardBorder}30` }}>
                  <div>
                    <p className="text-xs" style={textPrimary}>{t.categorie}</p>
                    <p className="text-[9px]" style={textSecondary}>{new Date(t.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className="text-xs font-medium" style={{ color }}>
                    {isRevenu ? '+' : '-'}{parseFloat(t.montant || '0').toFixed(0)} {parametres.devise}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === RACCOURCIS COMPACTS === */}
      <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
        <div className="grid grid-cols-4 gap-2">
          {shortcuts.map((item, idx) => (
            <button key={idx} onClick={() => navigateTo(item.page)} className="flex flex-col items-center gap-1 p-2 rounded-xl transition-colors hover:bg-white/5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${theme.colors.primary}20` }}>
                <item.icon className="w-4 h-4" style={textPrimary} />
              </div>
              <span className="text-[9px] font-medium" style={textSecondary}>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* === WIDGET 2: Résumé semaine === */}
      <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: theme.colors.primary }} />
            <span className="text-xs font-semibold" style={textPrimary}>Cette semaine</span>
          </div>
          {lastWeekTotal > 0 && (
            <VariationBadge current={thisWeekTotal} previous={lastWeekTotal} />
          )}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-xl font-bold ${thisWeekTotal > lastWeekTotal ? 'text-red-400' : 'text-green-400'}`}>
              -{thisWeekTotal.toFixed(0)} {parametres.devise}
            </p>
            <p className="text-[9px]" style={textSecondary}>
              {thisWeekTransactions.length} transaction(s)
            </p>
          </div>
          {lastWeekTotal > 0 && (
            <div className="text-right">
              <p className="text-[9px]" style={textSecondary}>Sem. dernière</p>
              <p className="text-xs" style={textSecondary}>-{lastWeekTotal.toFixed(0)} {parametres.devise}</p>
            </div>
          )}
        </div>
        <div className="mt-2">
          <ProgressBar 
            value={thisWeekTotal} 
            max={Math.max(thisWeekTotal, lastWeekTotal) || 1} 
            color={thisWeekTotal <= lastWeekTotal ? '#4ade80' : '#f87171'} 
          />
        </div>
      </div>

      {/* === WIDGET 11: Prochain prélèvement === */}
      {facturesAVenir.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={{ ...cardStyle, borderColor: '#FF980050' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-semibold text-orange-400">Prochain(s) prélèvement(s)</span>
          </div>
          {facturesAVenir.map((f, i) => (
            <div key={f.id} className="flex items-center justify-between py-1" style={{ borderTopWidth: i > 0 ? 1 : 0, borderColor: `${theme.colors.cardBorder}30` }}>
              <span className="text-xs" style={textPrimary}>{f.nom}</span>
              <div className="text-right">
                <span className="text-xs font-medium text-orange-400">{f.montant.toFixed(0)} {parametres.devise}</span>
                <span className="text-[9px] ml-2" style={textSecondary}>J-{f.jourDuMois ? f.jourDuMois - currentDay : '?'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === WIDGET 12: Jour sans dépense === */}
      <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={{ 
        ...cardStyle, 
        background: isJourSansDepense ? 'rgba(74, 222, 128, 0.1)' : cardStyle.background,
        borderColor: isJourSansDepense ? 'rgba(74, 222, 128, 0.3)' : cardStyle.borderColor 
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${isJourSansDepense ? 'text-green-400' : 'text-orange-400'}`} />
            <span className="text-xs font-semibold" style={textPrimary}>
              {isJourSansDepense ? '🎯 Défi réussi !' : '🎯 Défi du jour'}
            </span>
          </div>
          {isJourSansDepense ? (
            <span className="text-xs font-bold text-green-400">0€ dépensé !</span>
          ) : (
            <span className="text-xs" style={textSecondary}>{depensesAujourdhui.toFixed(0)} {parametres.devise} aujourd'hui</span>
          )}
        </div>
        {joursSansDepense > 0 && (
          <p className="text-[9px] mt-1" style={textSecondary}>
            🔥 {joursSansDepense} jour(s) consécutif(s) sans dépense !
          </p>
        )}
      </div>

      {/* === WIDGET 7: Défi du mois === */}
      {defiCategorie && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold" style={textPrimary}>Défi du mois</span>
          </div>
          <p className="text-[10px] mb-2" style={textSecondary}>
            Réduire <span className="font-medium text-purple-400">{defiCategorie[0]}</span> de 20%
          </p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px]" style={textSecondary}>Objectif: {defiObjectif.toFixed(0)} {parametres.devise}</span>
            <span className={`text-xs font-bold ${defiCategorie[1] <= defiObjectif ? 'text-green-400' : 'text-orange-400'}`}>
              {defiCategorie[1].toFixed(0)} {parametres.devise}
            </span>
          </div>
          <ProgressBar 
            value={defiCategorie[1]} 
            max={defiCategorie[1] / 0.8} 
            color={defiCategorie[1] <= defiObjectif ? '#4ade80' : '#a855f7'} 
          />
          {defiCategorie[1] <= defiObjectif && (
            <p className="text-[9px] text-green-400 mt-1">✓ Défi en bonne voie !</p>
          )}
        </div>
      )}

      {/* === WIDGET 14: Mini classement catégories === */}
      {categoriesPourDefi.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-semibold" style={textPrimary}>Top catégories</span>
          </div>
          <div className="space-y-2">
            {categoriesPourDefi.slice(0, 3).map(([cat, montant], i) => {
              const maxMontant = categoriesPourDefi[0][1];
              const percent = (montant / maxMontant) * 100;
              const colors = ['#F44336', '#FF9800', '#FFC107'];
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px]" style={textPrimary}>{cat}</span>
                    <span className="text-[10px] font-medium" style={{ color: colors[i] }}>{montant.toFixed(0)} {parametres.devise}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.colors.cardBorder}50` }}>
                    <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: colors[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === WIDGET 8: Économies potentielles === */}
      {petitesDepenses > 20 && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
          <div className="flex items-center gap-2 mb-1">
            <PiggyBank className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold" style={textPrimary}>Économies potentielles</span>
          </div>
          <p className="text-[10px]" style={textSecondary}>
            Vos petites dépenses (&lt;10€) ce mois : <span className="font-medium">{petitesDepenses.toFixed(0)} {parametres.devise}</span>
          </p>
          <p className="text-xs mt-1">
            <span className="text-blue-400 font-bold">💡 Si vous réduisez de 50%</span>
          </p>
          <p className="text-lg font-bold text-green-400">
            +{economiesPotentiellesAnnuelles.toFixed(0)} {parametres.devise}/an
          </p>
        </div>
      )}

      {/* === WIDGET 4: Citation du jour === */}
      <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={{ ...cardStyle, background: `${theme.colors.primary}08` }}>
        <div className="flex items-start gap-2">
          <Quote className="w-4 h-4 mt-0.5" style={{ color: theme.colors.primary }} />
          <div>
            <p className="text-xs italic" style={textPrimary}>"{citationDuJour.text}"</p>
            <p className="text-[9px] mt-1" style={textSecondary}>— {citationDuJour.author}</p>
          </div>
        </div>
      </div>

      {/* === WIDGET 13: Fun Fact === */}
      <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={cardStyle}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs" style={textPrimary}>{funFact}</span>
        </div>
      </div>

      {/* === WIDGET 9: Anniversaire budget === */}
      {appAgeDays >= 7 && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-3" style={{ ...cardStyle, background: 'rgba(236, 72, 153, 0.1)', borderColor: 'rgba(236, 72, 153, 0.3)' }}>
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-pink-400" />
            <span className="text-xs" style={textPrimary}>
              🎂 <span className="font-semibold text-pink-400">
                {appAgeMonths > 0 ? `${appAgeMonths} mois` : `${appAgeDays} jours`}
              </span> que vous utilisez The Budget Planner !
            </span>
          </div>
        </div>
      )}

      {/* SmartTips */}
      <SmartTips page="accueil" />
    </div>
  );
}

function LoadingScreen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(180deg, ${theme.colors.backgroundGradientFrom} 0%, ${theme.colors.backgroundGradientTo} 50%, ${theme.colors.backgroundGradientFrom} 100%)` }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderLeftColor: theme.colors.primary, borderRightColor: theme.colors.primary, borderBottomColor: theme.colors.primary, borderTopColor: 'transparent' }} />
        <p className="font-medium" style={{ color: theme.colors.textPrimary }}>Chargement...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth');
        } else {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/auth');
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.push('/auth');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleNavigate = (page: string) => {
    if (page === 'accueil') router.push('/');
    else router.push(`/${page}`);
  };

  if (isLoading || !isAuthenticated) return <LoadingScreen />;

  return (
    <AppShell currentPage="accueil" onNavigate={handleNavigate}>
      <AccueilContent />
    </AppShell>
  );
}

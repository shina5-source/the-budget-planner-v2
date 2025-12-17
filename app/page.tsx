"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, TrendingUp, Home as HomeIcon, PiggyBank, 
  Sun, Target, PieChart, Sparkles, Pencil, X, Check, Flame,
  AlertTriangle, Clock, Wallet, ShoppingBag, CloudSun, CloudRain, Cloud,
  ArrowUpRight, ArrowDownRight, Trophy, Mail, Calendar, Zap,
  Eye, EyeOff, ChevronDown, ChevronUp, Plus
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';

// === ANIMATIONS CSS ===
const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
  .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
  .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
  .animate-slide-in-right { animation: slideInRight 0.4s ease-out forwards; }
  .animate-bounce-slow { animation: bounce 2s ease-in-out infinite; }
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.1s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.2s; }
  .stagger-5 { animation-delay: 0.25s; }
  .stagger-6 { animation-delay: 0.3s; }
  .stagger-7 { animation-delay: 0.35s; }
  .stagger-8 { animation-delay: 0.4s; }
`;

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

const defaultParametres: ParametresData = { devise: '€' };
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
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Styles
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

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

    const savedCompactMode = localStorage.getItem('budget-compact-mode');
    if (savedCompactMode) setIsCompactMode(JSON.parse(savedCompactMode));

    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const saveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('budget-user-name', tempName.trim());
    }
    setIsEditingName(false);
  };

  const startEditName = () => { setTempName(userName); setIsEditingName(true); };

  const toggleCompactMode = () => {
    const newMode = !isCompactMode;
    setIsCompactMode(newMode);
    localStorage.setItem('budget-compact-mode', JSON.stringify(newMode));
  };

  // === CALCULS OPTIMISÉS ===
  const getMonthKey = (year: number, month: number) => `${year}-${(month + 1).toString().padStart(2, '0')}`;
  const currentMonthKey = useMemo(() => getMonthKey(selectedYear, selectedMonth), [selectedYear, selectedMonth]);
  const filteredTransactions = useMemo(() => transactions.filter(t => t.date?.startsWith(currentMonthKey)), [transactions, currentMonthKey]);

  const prevMonthKey = useMemo(() => {
    let m = selectedMonth - 1, y = selectedYear;
    if (m < 0) { m = 11; y--; }
    return getMonthKey(y, m);
  }, [selectedYear, selectedMonth]);

  const prevMonthTransactions = useMemo(() => transactions.filter(t => t.date?.startsWith(prevMonthKey)), [transactions, prevMonthKey]);

  const totals = useMemo(() => {
    const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const totalFactures = filteredTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const totalDepenses = filteredTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const totalEpargnes = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const soldeReel = totalRevenus - totalFactures - totalDepenses - totalEpargnes;
    const budgetPrevu = totalRevenus - totalFactures;
    return { totalRevenus, totalFactures, totalDepenses, totalEpargnes, soldeReel, budgetPrevu };
  }, [filteredTransactions]);

  const prevTotals = useMemo(() => {
    const prevRevenus = prevMonthTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevFactures = prevMonthTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevDepenses = prevMonthTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevEpargnes = prevMonthTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevSolde = prevRevenus - prevFactures - prevDepenses - prevEpargnes;
    return { prevRevenus, prevFactures, prevDepenses, prevEpargnes, prevSolde };
  }, [prevMonthTransactions]);

  const financialData = useMemo(() => {
    let score = 50;
    const hasData = totals.totalRevenus > 0 || totals.totalFactures > 0 || totals.totalDepenses > 0 || totals.totalEpargnes > 0;
    
    if (!hasData) return { score: 0, label: 'En attente', color: 'text-gray-400', emoji: '📊', tauxEpargne: 0, hasData: false };
    
    if (totals.soldeReel > 0) score += 20; else if (totals.soldeReel < 0) score -= 20;
    
    const tauxEpargne = totals.totalRevenus > 0 ? (totals.totalEpargnes / totals.totalRevenus) * 100 : 0;
    if (tauxEpargne >= 20) score += 20; else if (tauxEpargne >= 10) score += 10;
    
    const prevTotal = prevTotals.prevFactures + prevTotals.prevDepenses;
    const currentTotal = totals.totalFactures + totals.totalDepenses;
    if (prevTotal > 0 && currentTotal <= prevTotal) score += 10;
    
    if (objectifs.length > 0) score += 5;
    score = Math.min(100, Math.max(0, score));
    
    let label, color, emoji;
    if (score >= 80) { label = 'Excellent !'; color = 'text-green-400'; emoji = '🏆'; }
    else if (score >= 60) { label = 'Bien !'; color = 'text-blue-400'; emoji = '👍'; }
    else if (score >= 40) { label = 'Correct'; color = 'text-orange-400'; emoji = '👌'; }
    else { label = 'À améliorer'; color = 'text-red-400'; emoji = '📉'; }
    
    return { score, label, color, emoji, tauxEpargne, hasData: true };
  }, [totals, prevTotals, objectifs]);

  useEffect(() => {
    if (financialData.score === 0) return;
    let current = 0;
    const step = financialData.score / 30;
    const interval = setInterval(() => {
      current += step;
      if (current >= financialData.score) { setAnimatedScore(financialData.score); clearInterval(interval); }
      else setAnimatedScore(Math.floor(current));
    }, 20);
    return () => clearInterval(interval);
  }, [financialData.score]);

  const epargneStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < 12; i++) {
      let m = selectedMonth - i, y = selectedYear;
      while (m < 0) { m += 12; y--; }
      const key = getMonthKey(y, m);
      const epargne = transactions.filter(t => t.date?.startsWith(key) && t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      if (epargne > 0) streak++; else break;
    }
    return streak;
  }, [transactions, selectedYear, selectedMonth]);

  const weather = useMemo(() => {
    if (totals.soldeReel > totals.totalRevenus * 0.2) return { icon: Sun, label: 'Ensoleillé', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (totals.soldeReel > 0) return { icon: CloudSun, label: 'Nuageux', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (totals.soldeReel > -100) return { icon: Cloud, label: 'Couvert', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    return { icon: CloudRain, label: 'Orageux', color: 'text-red-400', bg: 'bg-red-500/20' };
  }, [totals]);

  const weekData = useMemo(() => {
    const now = new Date();
    const getWeekTransactions = (weeksAgo: number) => {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1 - (weeksAgo * 7));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return transactions.filter(t => {
        const date = new Date(t.date);
        return date >= startOfWeek && date <= endOfWeek && (t.type === 'Dépenses' || t.type === 'Factures');
      });
    };
    const thisWeek = getWeekTransactions(0);
    const lastWeek = getWeekTransactions(1);
    const thisWeekTotal = thisWeek.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const lastWeekTotal = lastWeek.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    return { thisWeekTotal, lastWeekTotal, thisWeekCount: thisWeek.length };
  }, [transactions]);

  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const facturesAVenir = useMemo(() => recurring.filter(r => r.actif && r.type === 'facture').filter(r => r.jourDuMois && r.jourDuMois > currentDay && r.jourDuMois <= currentDay + 7).slice(0, 3), [recurring, currentDay]);

  const nextPayday = useMemo(() => {
    const prochainRevenu = recurring.find(r => r.actif && r.type === 'revenu' && r.jourDuMois);
    if (!prochainRevenu || !prochainRevenu.jourDuMois) return null;
    let jour = prochainRevenu.jourDuMois;
    let joursRestants = jour - currentDay;
    if (joursRestants <= 0) joursRestants += daysInMonth;
    return { nom: prochainRevenu.nom, jours: joursRestants, montant: prochainRevenu.montant };
  }, [recurring, currentDay, daysInMonth]);

  const joursRestants = daysInMonth - currentDay;
  const budgetParJour = joursRestants > 0 ? Math.max(0, totals.soldeReel) / joursRestants : 0;

  const todayKey = new Date().toISOString().split('T')[0];
  const depensesAujourdhui = useMemo(() => transactions.filter(t => t.date?.startsWith(todayKey) && (t.type === 'Dépenses' || t.type === 'Factures')).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0), [transactions, todayKey]);
  const isJourSansDepense = depensesAujourdhui === 0;

  const topCategories = useMemo(() => {
    const depensesParCategorie: Record<string, number> = {};
    filteredTransactions.filter(t => t.type === 'Dépenses').forEach(t => { depensesParCategorie[t.categorie] = (depensesParCategorie[t.categorie] || 0) + parseFloat(t.montant || '0'); });
    return Object.entries(depensesParCategorie).filter(([_, montant]) => montant > 50).sort(([,a], [,b]) => b - a).slice(0, 3);
  }, [filteredTransactions]);

  const objectifPrincipal = useMemo(() => objectifs.filter(o => o.montantActuel < o.montantCible && o.montantCible > 0).sort((a, b) => (b.montantActuel / b.montantCible) - (a.montantActuel / a.montantCible))[0], [objectifs]);

  const lastTransactions = useMemo(() => [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5), [filteredTransactions]);

  const appAge = useMemo(() => {
    const firstUse = localStorage.getItem('budget-first-use');
    if (!firstUse) { localStorage.setItem('budget-first-use', new Date().toISOString()); return { days: 0, months: 0 }; }
    const days = Math.floor((new Date().getTime() - new Date(firstUse).getTime()) / (1000 * 60 * 60 * 24));
    return { days, months: Math.floor(days / 30) };
  }, []);

  const dailyInsight = useMemo(() => {
    const citations = [
      { text: "Un euro économisé est un euro gagné.", author: "Benjamin Franklin" },
      { text: "La richesse consiste dans l'usage qu'on en fait.", author: "Aristote" },
      { text: "Ne dépensez pas avant d'avoir gagné.", author: "Thomas Jefferson" },
      { text: "L'argent est un bon serviteur mais un mauvais maître.", author: "Alexandre Dumas" },
      { text: "La vraie richesse, c'est de ne pas avoir besoin de grand-chose.", author: "Épicure" },
    ];
    const funFacts = [
      `${filteredTransactions.length} transactions ce mois`,
      totals.totalRevenus > 0 ? `${financialData.tauxEpargne.toFixed(0)}% d'épargne` : null,
      weekData.thisWeekTotal > 0 ? `${weekData.thisWeekTotal.toFixed(0)}${parametres.devise} cette semaine` : null,
    ].filter(Boolean);
    const dayOfMonth = new Date().getDate();
    const citation = citations[dayOfMonth % citations.length];
    const funFact = funFacts[dayOfMonth % funFacts.length] || "Commencez à tracker vos dépenses !";
    return { citation, funFact };
  }, [filteredTransactions, totals, financialData, weekData, parametres.devise]);

  const prevMonth = () => { if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); } else setSelectedMonth(selectedMonth - 1); };
  const nextMonth = () => { if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); } else setSelectedMonth(selectedMonth + 1); };
  const navigateTo = (page: string) => router.push(`/${page}`);

  const getScoreColor = (s: number) => s >= 80 ? '#4CAF50' : s >= 60 ? '#2196F3' : s >= 40 ? '#FF9800' : '#F44336';
  // === COMPOSANTS INTERNES ===
  const ProgressBar = ({ value, max, color, animated = false }: { value: number; max: number; color: string; animated?: boolean }) => {
    const [width, setWidth] = useState(0);
    const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    
    useEffect(() => {
      if (animated) setTimeout(() => setWidth(percent), 100);
      else setWidth(percent);
    }, [percent, animated]);
    
    return (
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.colors.cardBorder}50` }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
    );
  };

  const VariationBadge = ({ current, previous, inverse = false }: { current: number; previous: number; inverse?: boolean }) => {
    if (previous === 0 && current === 0) return null;
    const variation = previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / Math.abs(previous)) * 100;
    const isPositive = inverse ? variation <= 0 : variation >= 0;
    const Icon = variation >= 0 ? ArrowUpRight : ArrowDownRight;
    
    return (
      <span className={`flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        <Icon className="w-2.5 h-2.5" />
        {Math.abs(variation).toFixed(0)}%
      </span>
    );
  };

  const SkeletonCard = ({ height = 100, className = '' }: { height?: number; className?: string }) => (
    <div className={`backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-pulse ${className}`} style={cardStyle}>
      <div className="h-4 w-24 rounded mb-3" style={{ backgroundColor: `${theme.colors.cardBorder}50` }} />
      <div className="rounded-lg" style={{ height, backgroundColor: `${theme.colors.cardBorder}30` }} />
    </div>
  );

  const EmptyStateAccueil = () => (
    <div className="backdrop-blur-sm rounded-2xl p-6 shadow-sm border text-center animate-fade-in-up" style={cardStyle}>
      <div className="relative inline-block mb-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center animate-bounce-slow" style={{ background: `${theme.colors.primary}15` }}>
          <Wallet className="w-10 h-10" style={{ color: theme.colors.primary }} />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2" style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}>
          <Sparkles className="w-4 h-4" style={{ color: theme.colors.primary }} />
        </div>
      </div>
      <p className="text-base font-semibold mb-2" style={textPrimary}>Bienvenue {userName} !</p>
      <p className="text-sm mb-4" style={textSecondary}>Commencez par ajouter vos premières transactions</p>
      <button 
        onClick={() => navigateTo('transactions')} 
        className="flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
        style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
      >
        <Plus className="w-4 h-4" />
        Ajouter une transaction
      </button>
    </div>
  );

  const shortcuts = [
    { page: 'budget', title: 'Budget', icon: PieChart },
    { page: 'objectifs', title: 'Objectifs', icon: Target },
    { page: 'enveloppes', title: 'Enveloppes', icon: Mail },
    { page: 'statistiques', title: 'Stats', icon: TrendingUp },
  ];

  // === SKELETON LOADING ===
  if (!isLoaded) {
    return (
      <div className="pb-4 space-y-3">
        <style>{animationStyles}</style>
        <div className="flex items-center justify-center py-4">
          <div className="w-16 h-16 rounded-2xl animate-pulse" style={{ backgroundColor: `${theme.colors.cardBorder}50` }} />
        </div>
        <div className="text-center mb-3">
          <div className="h-5 w-40 mx-auto rounded animate-pulse" style={{ backgroundColor: `${theme.colors.cardBorder}50` }} />
        </div>
        <SkeletonCard height={120} />
        <SkeletonCard height={60} />
        <div className="grid grid-cols-2 gap-2">
          <SkeletonCard height={60} />
          <SkeletonCard height={60} />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1,2,3,4].map(i => <SkeletonCard key={i} height={50} />)}
        </div>
      </div>
    );
  }

  // === RENDU PRINCIPAL ===
  return (
    <div className="pb-4 space-y-3">
      <style>{animationStyles}</style>

      {/* === LOGO + TOGGLE === */}
      <div className="flex items-center justify-between animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <div className="w-10" />
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 transition-transform hover:scale-105" style={{ borderColor: theme.colors.cardBorder }}>
          <Image src="/logo-shina5.png" alt="Logo" width={64} height={64} className="w-full h-full object-cover" priority />
        </div>
        <button 
          onClick={toggleCompactMode} 
          className="p-2 rounded-xl border transition-all hover:scale-110"
          style={{ ...cardStyle, opacity: isCompactMode ? 1 : 0.6 }}
          title={isCompactMode ? "Vue détaillée" : "Vue compacte"}
        >
          {isCompactMode ? <Eye className="w-4 h-4" style={textPrimary} /> : <EyeOff className="w-4 h-4" style={textSecondary} />}
        </button>
      </div>

      {/* === SALUTATION === */}
      <div className="text-center mb-3 animate-fade-in-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
        {isEditingName ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-semibold" style={textPrimary}>Bonjour</span>
            <input 
              type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} 
              className="text-lg font-semibold rounded-xl px-3 py-1 w-28 text-center border" 
              style={{ background: theme.colors.cardBackgroundLight, color: theme.colors.textPrimary, borderColor: theme.colors.primary }} 
              autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setIsEditingName(false); }} 
            />
            <button onClick={saveName} className="p-1 rounded-full transition-transform hover:scale-110" style={{ background: `${theme.colors.primary}20` }}><Check className="w-4 h-4" style={textPrimary} /></button>
            <button onClick={() => setIsEditingName(false)} className="p-1 rounded-full transition-transform hover:scale-110" style={{ background: theme.colors.cardBackgroundLight }}><X className="w-4 h-4" style={textPrimary} /></button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-lg font-semibold" style={textPrimary}>Bonjour {userName} 👋</h1>
            <button onClick={startEditName} className="p-1 hover:opacity-80 rounded-full transition-transform hover:scale-110"><Pencil className="w-3 h-3" style={textSecondary} /></button>
          </div>
        )}
      </div>

      {/* === EMPTY STATE ou CARTE HERO === */}
      {!financialData.hasData ? (
        <EmptyStateAccueil />
      ) : (
        <>
          {/* === CARTE HERO: Score + Météo + Streak + Solde === */}
          <div 
            className="backdrop-blur-sm rounded-2xl p-4 shadow-lg border animate-fade-in-up stagger-2 opacity-0" 
            style={{ 
              ...cardStyle, 
              background: totals.soldeReel >= 0 
                ? `linear-gradient(135deg, ${theme.colors.cardBackground} 0%, rgba(74, 222, 128, 0.1) 100%)`
                : `linear-gradient(135deg, ${theme.colors.cardBackground} 0%, rgba(248, 113, 113, 0.1) 100%)`,
              animationFillMode: 'forwards'
            }}
          >
            {/* Ligne 1: Score + Météo + Streak */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <svg width={50} height={50} className="transform -rotate-90">
                      <circle cx={25} cy={25} r={20} stroke={`${theme.colors.cardBorder}50`} strokeWidth={4} fill="none" />
                      <circle cx={25} cy={25} r={20} stroke={getScoreColor(financialData.score)} strokeWidth={4} fill="none" strokeDasharray={126} strokeDashoffset={126 - (animatedScore / 100) * 126} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Trophy className="w-4 h-4" style={{ color: getScoreColor(financialData.score) }} />
                    </div>
                  </div>
                  <div>
                    <span className={`text-xl font-bold ${financialData.color}`}>{animatedScore}</span>
                    <span className="text-[10px]" style={textSecondary}>/100</span>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${financialData.color}`} style={{ background: `${theme.colors.primary}15` }}>
                  {financialData.emoji} {financialData.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {epargneStreak > 0 && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 animate-pulse-slow">
                    <Flame className="w-3 h-3" /> {epargneStreak}
                  </span>
                )}
                <div className={`p-2 rounded-lg ${weather.bg} transition-transform hover:scale-110`}>
                  <weather.icon className={`w-5 h-5 ${weather.color}`} />
                </div>
              </div>
            </div>

            {/* Ligne 2: Solde principal */}
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs mb-1" style={textSecondary}>Solde réel</p>
                <p className={`text-3xl font-bold ${totals.soldeReel >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totals.soldeReel >= 0 ? '+' : ''}{totals.soldeReel.toFixed(0)} <span className="text-lg">{parametres.devise}</span>
                </p>
              </div>
              <div className="text-right">
                {prevTotals.prevSolde !== 0 && <VariationBadge current={totals.soldeReel} previous={prevTotals.prevSolde} />}
                <p className="text-[10px] mt-1" style={textSecondary}>{budgetParJour.toFixed(0)}{parametres.devise}/jour • {joursRestants}j</p>
              </div>
            </div>

            {/* Ligne 3: Progress bar */}
            <ProgressBar 
              value={totals.totalRevenus - totals.totalFactures - totals.totalDepenses - totals.totalEpargnes} 
              max={totals.totalRevenus || 1} 
              color={totals.soldeReel >= 0 ? '#4ade80' : '#f87171'}
              animated
            />

            {/* Message motivationnel */}
            {(totals.soldeReel > 500 || totals.soldeReel < -50) && (
              <p className="text-[10px] mt-2 text-center animate-fade-in" style={textSecondary}>
                {totals.soldeReel > 500 ? '🎉 Excellent ! Pensez à épargner' : 
                 totals.soldeReel > 0 ? '👍 Budget maîtrisé' : 
                 totals.soldeReel < -500 ? '🚨 Budget dépassé' :
                 totals.soldeReel < -50 ? '⚠️ Attention aux dépenses' : null}
              </p>
            )}
          </div>

          {/* === SÉLECTEUR DE MOIS === */}
          <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border animate-fade-in-up stagger-3 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between">
              <button onClick={prevMonth} className="p-1 transition-transform hover:scale-110"><ChevronLeft className="w-5 h-5" style={textPrimary} /></button>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold" style={textPrimary}>{monthsFull[selectedMonth]}</span>
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="rounded-lg px-2 py-1 text-sm font-semibold border" style={inputStyle}>
                  {years.map(year => (<option key={year} value={year}>{year}</option>))}
                </select>
              </div>
              <button onClick={nextMonth} className="p-1 transition-transform hover:scale-110"><ChevronRight className="w-5 h-5" style={textPrimary} /></button>
            </div>
            {!isCompactMode && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {monthsShort.map((month, index) => (
                  <button key={index} onClick={() => setSelectedMonth(index)} className="px-2.5 py-1 rounded-full text-[10px] font-medium transition-all hover:scale-105 border" 
                    style={selectedMonth === index ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* === ALERTES (Factures + Paie) === */}
          {(facturesAVenir.length > 0 || nextPayday) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 animate-fade-in-up stagger-4 opacity-0" style={{ animationFillMode: 'forwards' }}>
              {facturesAVenir.length > 0 && (
                <div className="backdrop-blur-sm rounded-xl p-3 shadow-sm border bg-orange-500/10 transition-transform hover:scale-[1.02]" style={{ borderColor: '#FF980050' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-[10px] font-semibold text-orange-400">{facturesAVenir.length} facture(s) à venir</span>
                  </div>
                  {facturesAVenir.slice(0, 2).map(f => (
                    <p key={f.id} className="text-[9px]" style={textSecondary}>{f.nom} • J-{f.jourDuMois ? f.jourDuMois - currentDay : '?'}</p>
                  ))}
                </div>
              )}
              {nextPayday && (
                <div className="backdrop-blur-sm rounded-xl p-3 shadow-sm border bg-green-500/10 transition-transform hover:scale-[1.02]" style={{ borderColor: '#4ade8050' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-[10px] font-semibold text-green-400">Prochain revenu</span>
                  </div>
                  <p className="text-[9px]" style={textSecondary}>{nextPayday.nom}</p>
                  <p className="text-xs font-bold text-green-400">J-{nextPayday.jours} • +{nextPayday.montant.toFixed(0)}{parametres.devise}</p>
                </div>
              )}
            </div>
          )}

          {/* === RÉSUMÉ SEMAINE + DÉFI === */}
          <div className="grid grid-cols-2 gap-2 animate-fade-in-up stagger-5 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="backdrop-blur-sm rounded-xl p-3 shadow-sm border transition-transform hover:scale-[1.02]" style={cardStyle}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium" style={textSecondary}>Cette semaine</span>
                {weekData.lastWeekTotal > 0 && <VariationBadge current={weekData.thisWeekTotal} previous={weekData.lastWeekTotal} inverse />}
              </div>
              <p className={`text-lg font-bold ${weekData.thisWeekTotal > weekData.lastWeekTotal ? 'text-red-400' : 'text-green-400'}`}>
                -{weekData.thisWeekTotal.toFixed(0)}{parametres.devise}
              </p>
              <p className="text-[9px]" style={textSecondary}>{weekData.thisWeekCount} transaction(s)</p>
            </div>
            
            <div className="backdrop-blur-sm rounded-xl p-3 shadow-sm border transition-transform hover:scale-[1.02]" style={{ 
              ...cardStyle, 
              background: isJourSansDepense ? 'rgba(74, 222, 128, 0.1)' : cardStyle.background 
            }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className={`w-3.5 h-3.5 ${isJourSansDepense ? 'text-green-400' : 'text-orange-400'}`} />
                <span className="text-[10px] font-medium" style={textSecondary}>Défi du jour</span>
              </div>
              {isJourSansDepense ? (
                <p className="text-sm font-bold text-green-400">🎯 0€ dépensé !</p>
              ) : (
                <p className="text-sm font-bold" style={textPrimary}>{depensesAujourdhui.toFixed(0)}{parametres.devise}</p>
              )}
            </div>
          </div>
          {/* === CARTES RÉSUMÉ (4 cartes) === */}
          {!isCompactMode && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 animate-fade-in-up stagger-6 opacity-0" style={{ animationFillMode: 'forwards' }}>
              {[
                { label: 'Revenus', amount: totals.totalRevenus, prev: prevTotals.prevRevenus, color: '#4CAF50', icon: TrendingUp },
                { label: 'Factures', amount: totals.totalFactures, prev: prevTotals.prevFactures, color: '#F44336', icon: HomeIcon, inverse: true },
                { label: 'Dépenses', amount: totals.totalDepenses, prev: prevTotals.prevDepenses, color: '#FF9800', icon: ShoppingBag, inverse: true },
                { label: 'Épargne', amount: totals.totalEpargnes, prev: prevTotals.prevEpargnes, color: '#9C27B0', icon: PiggyBank },
              ].map((item, i) => (
                <div key={i} className="backdrop-blur-sm rounded-xl p-3 shadow-sm border text-center transition-all hover:scale-105" style={cardStyle}>
                  <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: `${item.color}20` }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <p className="text-base font-bold" style={{ color: item.color }}>{item.amount.toFixed(0)}{parametres.devise}</p>
                  <p className="text-[9px] mb-1" style={textSecondary}>{item.label}</p>
                  {item.prev > 0 && <VariationBadge current={item.amount} previous={item.prev} inverse={item.inverse} />}
                </div>
              ))}
            </div>
          )}

          {/* === OBJECTIF + TOP CATÉGORIES === */}
          {!isCompactMode && (objectifPrincipal || topCategories.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 animate-fade-in-up stagger-7 opacity-0" style={{ animationFillMode: 'forwards' }}>
              {objectifPrincipal && (
                <div className="backdrop-blur-sm rounded-xl p-3 shadow-sm border transition-transform hover:scale-[1.02]" style={cardStyle}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${theme.colors.primary}20` }}>
                        <Target className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
                      </div>
                      <span className="text-xs font-medium truncate" style={textPrimary}>{objectifPrincipal.nom}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: theme.colors.primary }}>
                      {objectifPrincipal.montantCible > 0 ? ((objectifPrincipal.montantActuel / objectifPrincipal.montantCible) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <ProgressBar value={objectifPrincipal.montantActuel} max={objectifPrincipal.montantCible} color={theme.colors.primary} animated />
                  <p className="text-[9px] mt-2 text-center" style={textSecondary}>
                    {objectifPrincipal.montantActuel.toFixed(0)} / {objectifPrincipal.montantCible.toFixed(0)} {parametres.devise}
                  </p>
                </div>
              )}
              
              {topCategories.length > 0 && (
                <div className="backdrop-blur-sm rounded-xl p-3 shadow-sm border transition-transform hover:scale-[1.02]" style={cardStyle}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-orange-500/20">
                      <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <span className="text-xs font-medium" style={textPrimary}>Top dépenses</span>
                  </div>
                  <div className="space-y-1.5">
                    {topCategories.slice(0, 3).map(([cat, montant], i) => {
                      const colors = ['#F44336', '#FF9800', '#FFC107'];
                      const maxVal = topCategories[0][1];
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-[10px] mb-0.5">
                            <span style={textPrimary}>{cat}</span>
                            <span style={{ color: colors[i] }}>{montant.toFixed(0)}{parametres.devise}</span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.colors.cardBorder}50` }}>
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(montant / maxVal) * 100}%`, backgroundColor: colors[i] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === INSIGHTS DU JOUR === */}
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center animate-fade-in-up stagger-8 opacity-0" style={{ ...cardStyle, background: `${theme.colors.primary}08`, animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 animate-pulse-slow" style={{ color: theme.colors.primary }} />
              <span className="text-xs font-semibold" style={textPrimary}>Du jour</span>
              {appAge.days >= 7 && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400">
                  🎂 {appAge.months > 0 ? `${appAge.months} mois` : `${appAge.days}j`}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-[11px] italic" style={textSecondary}>&ldquo;{dailyInsight.citation.text}&rdquo;</p>
              <p className="text-[10px]" style={textSecondary}>— {dailyInsight.citation.author}</p>
              <p className="text-[10px] pt-1 font-medium" style={textPrimary}>📊 {dailyInsight.funFact}</p>
            </div>
          </div>

          {/* === RACCOURCIS === */}
          <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border animate-fade-in-up opacity-0" style={{ ...cardStyle, animationDelay: '0.45s', animationFillMode: 'forwards' }}>
            <div className="grid grid-cols-4 gap-2">
              {shortcuts.map((item, idx) => (
                <button key={idx} onClick={() => navigateTo(item.page)} className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:scale-110 active:scale-95">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" style={{ background: `${theme.colors.primary}20` }}>
                    <item.icon className="w-5 h-5" style={textPrimary} />
                  </div>
                  <span className="text-[9px] font-medium" style={textSecondary}>{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* === DERNIÈRES TRANSACTIONS === */}
          {!isCompactMode && lastTransactions.length > 0 && (
            <div className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden animate-fade-in-up opacity-0" style={{ ...cardStyle, animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <button 
                onClick={() => setShowDetails(!showDetails)} 
                className="w-full flex items-center justify-between p-3 transition-colors hover:opacity-80"
              >
                <span className="text-xs font-semibold" style={textPrimary}>Dernières transactions</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.textSecondary }}>{lastTransactions.length}</span>
                  {showDetails ? <ChevronUp className="w-4 h-4" style={textSecondary} /> : <ChevronDown className="w-4 h-4" style={textSecondary} />}
                </div>
              </button>
              {showDetails && (
                <div className="px-3 pb-3 space-y-2 animate-fade-in">
                  {lastTransactions.map((t, idx) => {
                    const isRevenu = t.type === 'Revenus';
                    const color = isRevenu ? '#4CAF50' : t.type === 'Factures' ? '#F44336' : t.type === 'Épargnes' ? '#9C27B0' : '#FF9800';
                    return (
                      <div key={t.id} className="flex items-center justify-between py-2 transition-colors" style={{ borderTopWidth: idx === 0 ? 1 : 0, borderColor: `${theme.colors.cardBorder}30` }}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <div>
                            <p className="text-xs" style={textPrimary}>{t.categorie}</p>
                            <p className="text-[9px]" style={textSecondary}>{new Date(t.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium" style={{ color }}>
                          {isRevenu ? '+' : '-'}{parseFloat(t.montant || '0').toFixed(0)}{parametres.devise}
                        </span>
                      </div>
                    );
                  })}
                  <button onClick={() => navigateTo('transactions')} className="w-full text-center text-[10px] py-2 rounded-lg transition-all hover:scale-[1.02] font-medium" style={{ color: theme.colors.textOnPrimary, background: theme.colors.primary }}>
                    Voir tout →
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* SmartTips */}
      <SmartTips page="accueil" />

      {/* === FOOTER === */}
      <div className="text-center pt-4 pb-2 animate-fade-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
        <p className="text-[10px]" style={textSecondary}>
          Créé avec <span className="text-red-400">❤️</span> Shina5
        </p>
      </div>
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
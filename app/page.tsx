"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Eye, EyeOff, Pencil, X, Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';
import { SkeletonCard, Confetti } from '@/components/ui';
import {
  HeroCard,
  MonthSelector,
  AlertCards,
  WeekSummary,
  SummaryCards,
  ObjectifCard,
  TopCategories,
  DailyInsight,
  CustomShortcuts,
  LastTransactions,
  EmptyState
} from '@/components/accueil';

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
  @keyframes logoEntrance {
    0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
    50% { transform: scale(1.1) rotate(5deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes logoPulse {
    0%, 100% { transform: scale(1); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
    50% { transform: scale(1.03); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.3); }
    35% { transform: scale(1); }
    45% { transform: scale(1.2); }
    55% { transform: scale(1); }
  }
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
  .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
  .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
  .animate-logo-entrance { animation: logoEntrance 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
  .animate-logo-pulse { animation: logoPulse 3s ease-in-out infinite; }
  .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
  .animate-gradient { animation: gradient-shift 3s ease infinite; }
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.1s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.2s; }
  .stagger-5 { animation-delay: 0.25s; }
  .stagger-6 { animation-delay: 0.3s; }
  .stagger-7 { animation-delay: 0.35s; }
  .stagger-8 { animation-delay: 0.4s; }
`;

// === TYPES ===
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

// === COMPOSANT PRINCIPAL ===
function AccueilContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const router = useRouter();
  
  // États
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
  const [animatedScore, setAnimatedScore] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Styles
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  // Chargement des données
  useEffect(() => {
    const loadData = () => {
      try {
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
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setDataLoaded(true);
      }
    };
    loadData();
  }, []);

  // Handlers
  const saveName = useCallback(() => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('budget-user-name', tempName.trim());
    }
    setIsEditingName(false);
  }, [tempName]);

  const startEditName = useCallback(() => { 
    setTempName(userName); 
    setIsEditingName(true); 
  }, [userName]);

  const toggleCompactMode = useCallback(() => {
    const newMode = !isCompactMode;
    setIsCompactMode(newMode);
    localStorage.setItem('budget-compact-mode', JSON.stringify(newMode));
  }, [isCompactMode]);

  const navigateTo = useCallback((page: string) => router.push(`/${page}`), [router]);

  // === CALCULS ===
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

  const hasAnyData = useMemo(() => transactions.length > 0, [transactions]);

  const financialData = useMemo(() => {
    let score = 50;
    const hasMonthData = totals.totalRevenus > 0 || totals.totalFactures > 0 || totals.totalDepenses > 0 || totals.totalEpargnes > 0;
    
    if (!hasMonthData) return { score: 0, label: 'En attente', color: 'text-gray-400', emoji: '📊', tauxEpargne: 0, hasData: hasMonthData };
    
    if (totals.soldeReel > 0) score += 20; else if (totals.soldeReel < 0) score -= 20;
    
    const tauxEpargne = totals.totalRevenus > 0 ? (totals.totalEpargnes / totals.totalRevenus) * 100 : 0;
    if (tauxEpargne >= 20) score += 20; else if (tauxEpargne >= 10) score += 10;
    
    const prevTotal = prevTotals.prevFactures + prevTotals.prevDepenses;
    const currentTotal = totals.totalFactures + totals.totalDepenses;
    if (prevTotal > 0 && currentTotal <= prevTotal) score += 10;
    
    if (objectifs.length > 0) score += 5;
    score = Math.min(100, Math.max(0, score));
    
    let label = 'À améliorer';
    let color = 'text-red-400';
    let emoji = '📉';
    
    if (score >= 80) { label = 'Excellent !'; color = 'text-green-400'; emoji = '🏆'; }
    else if (score >= 60) { label = 'Bien !'; color = 'text-blue-400'; emoji = '👍'; }
    else if (score >= 40) { label = 'Correct'; color = 'text-orange-400'; emoji = '👌'; }
    
    return { score, label, color, emoji, tauxEpargne, hasData: hasMonthData };
  }, [totals, prevTotals, objectifs]);

  // Animation du score + confettis
  useEffect(() => {
    if (financialData.score === 0) return;
    let current = 0;
    const step = financialData.score / 30;
    const interval = setInterval(() => {
      current += step;
      if (current >= financialData.score) { 
        setAnimatedScore(financialData.score);
        clearInterval(interval);
        if (financialData.score >= 80) {
          setTimeout(() => setShowConfetti(true), 300);
          setTimeout(() => setShowConfetti(false), 4000);
        }
      } else {
        setAnimatedScore(Math.floor(current));
      }
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
    return { 
      thisWeekTotal: thisWeek.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0), 
      lastWeekTotal: lastWeek.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0), 
      thisWeekCount: thisWeek.length 
    };
  }, [transactions]);

  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const joursRestants = daysInMonth - currentDay;
  const budgetParJour = joursRestants > 0 ? Math.max(0, totals.soldeReel) / joursRestants : 0;

  const facturesAVenir = useMemo(() => 
    recurring.filter(r => r.actif && r.type === 'facture')
      .filter(r => r.jourDuMois && r.jourDuMois > currentDay && r.jourDuMois <= currentDay + 7)
      .slice(0, 3), 
  [recurring, currentDay]);

  const nextPayday = useMemo(() => {
    const prochainRevenu = recurring.find(r => r.actif && r.type === 'revenu' && r.jourDuMois);
    if (!prochainRevenu?.jourDuMois) return null;
    let jours = prochainRevenu.jourDuMois - currentDay;
    if (jours <= 0) jours += daysInMonth;
    return { nom: prochainRevenu.nom, jours, montant: prochainRevenu.montant };
  }, [recurring, currentDay, daysInMonth]);

  const todayKey = new Date().toISOString().split('T')[0];
  const depensesAujourdhui = useMemo(() => 
    transactions.filter(t => t.date?.startsWith(todayKey) && (t.type === 'Dépenses' || t.type === 'Factures'))
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0), 
  [transactions, todayKey]);

  const topCategories = useMemo(() => {
    const depensesParCategorie: Record<string, number> = {};
    filteredTransactions.filter(t => t.type === 'Dépenses').forEach(t => { 
      depensesParCategorie[t.categorie] = (depensesParCategorie[t.categorie] || 0) + parseFloat(t.montant || '0'); 
    });
    return Object.entries(depensesParCategorie).filter(([, m]) => m > 50).sort(([,a], [,b]) => b - a).slice(0, 3);
  }, [filteredTransactions]);

  const objectifPrincipal = useMemo(() => 
    objectifs.filter(o => o.montantActuel < o.montantCible && o.montantCible > 0)
      .sort((a, b) => (b.montantActuel / b.montantCible) - (a.montantActuel / a.montantCible))[0], 
  [objectifs]);

  const lastTransactions = useMemo(() => 
    [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5), 
  [filteredTransactions]);

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
    return { citation: citations[dayOfMonth % citations.length], funFact: funFacts[dayOfMonth % funFacts.length] || "Commencez à tracker vos dépenses !" };
  }, [filteredTransactions, totals, financialData, weekData, parametres.devise]);

  // === SKELETON ===
  if (!dataLoaded) {
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
        <div className="grid grid-cols-2 gap-2"><SkeletonCard height={60} /><SkeletonCard height={60} /></div>
        <div className="grid grid-cols-4 gap-2">{[1,2,3,4].map(i => <SkeletonCard key={i} height={50} />)}</div>
      </div>
    );
  }

  // === RENDU ===
  return (
    <div className="pb-4 space-y-3">
      <style>{animationStyles}</style>
      <Confetti trigger={showConfetti} />

      {/* Logo centré */}
      <div className="flex flex-col items-center animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <div className={`w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 ${logoLoaded ? 'animate-logo-pulse' : 'animate-logo-entrance'}`} style={{ borderColor: theme.colors.primary }}>
          <Image src="/logo-shina5.png" alt="Logo" width={64} height={64} className="w-full h-full object-cover" priority onLoad={() => setLogoLoaded(true)} />
        </div>
        {/* Toggle vue compacte sous le logo */}
        <button 
          type="button" 
          onClick={toggleCompactMode} 
          className="mt-2 px-3 py-1 rounded-full border transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 text-[10px]" 
          style={{ 
            ...cardStyle, 
            borderColor: isCompactMode ? theme.colors.primary : theme.colors.cardBorder,
            color: isCompactMode ? theme.colors.primary : theme.colors.textSecondary
          }} 
          title={isCompactMode ? "Vue détaillée" : "Vue compacte"}
        >
          {isCompactMode ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {isCompactMode ? "Détaillée" : "Compacte"}
        </button>
      </div>

      {/* Salutation */}
      <div className="text-center mb-3 animate-fade-in-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
        {isEditingName ? (
          <div className="flex items-center justify-center gap-2 animate-scale-in">
            <span className="text-lg font-semibold" style={{ color: theme.colors.primary }}>Bonjour</span>
            <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="text-lg font-semibold rounded-xl px-3 py-1 w-28 text-center border" style={{ background: theme.colors.cardBackgroundLight, color: theme.colors.textPrimary, borderColor: theme.colors.primary }} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setIsEditingName(false); }} />
            <button type="button" onClick={saveName} className="p-1.5 rounded-full transition-all hover:scale-110 active:scale-95" style={{ background: `${theme.colors.primary}20` }}><Check className="w-4 h-4" style={{ color: theme.colors.primary }} /></button>
            <button type="button" onClick={() => setIsEditingName(false)} className="p-1.5 rounded-full transition-all hover:scale-110 active:scale-95" style={{ background: theme.colors.cardBackgroundLight }}><X className="w-4 h-4" style={textPrimary} /></button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-lg font-semibold" style={{ color: theme.colors.primary }}>Bonjour {userName} 👋</h1>
            <button type="button" onClick={startEditName} className="p-1 hover:opacity-80 rounded-full transition-all hover:scale-110 active:scale-95"><Pencil className="w-3 h-3" style={textSecondary} /></button>
          </div>
        )}
      </div>

      {/* Contenu */}
      {!hasAnyData ? (
        <EmptyState userName={userName} onNavigate={navigateTo} />
      ) : (
        <>
          <HeroCard totals={totals} prevTotals={prevTotals} financialData={financialData} animatedScore={animatedScore} epargneStreak={epargneStreak} budgetParJour={budgetParJour} joursRestants={joursRestants} devise={parametres.devise} />
          <MonthSelector selectedYear={selectedYear} selectedMonth={selectedMonth} setSelectedYear={setSelectedYear} setSelectedMonth={setSelectedMonth} isCompactMode={isCompactMode} />
          <AlertCards facturesAVenir={facturesAVenir} nextPayday={nextPayday} currentDay={currentDay} devise={parametres.devise} />
          <WeekSummary weekData={weekData} depensesAujourdhui={depensesAujourdhui} devise={parametres.devise} />
          {!isCompactMode && <SummaryCards totals={totals} prevTotals={prevTotals} devise={parametres.devise} />}
          {!isCompactMode && (objectifPrincipal || topCategories.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 animate-fade-in-up stagger-7 opacity-0" style={{ animationFillMode: 'forwards' }}>
              {objectifPrincipal && <ObjectifCard objectif={objectifPrincipal} devise={parametres.devise} />}
              {topCategories.length > 0 && <TopCategories categories={topCategories} devise={parametres.devise} />}
            </div>
          )}
          <DailyInsight citation={dailyInsight.citation} funFact={dailyInsight.funFact as string} appAge={appAge} />
          <CustomShortcuts onNavigate={navigateTo} />
          {!isCompactMode && <LastTransactions transactions={lastTransactions} devise={parametres.devise} onNavigate={navigateTo} />}
        </>
      )}

      <SmartTips page="accueil" />
      
      {/* Footer avec cœur animé et gradient Shina5 */}
      <div 
        className="backdrop-blur-sm rounded-2xl p-4 mt-4 text-center border animate-fade-in-up opacity-0"
        style={{ 
          background: theme.colors.cardBackground, 
          borderColor: theme.colors.cardBorder,
          animationDelay: '0.5s',
          animationFillMode: 'forwards'
        }}
      >
        <p className="text-xs" style={textSecondary}>
          The Budget Planner
        </p>
        <p className="text-xs mt-1" style={textSecondary}>
          Créé avec{' '}
          <span 
            className="text-red-400 text-sm inline-block"
            style={{ animation: 'heartbeat 1.5s ease-in-out infinite' }}
          >
            ❤️
          </span>
          {' '}by{' '}
          <span 
            className="font-semibold"
            style={{ 
              background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #ec4899)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient-shift 3s ease infinite'
            }}
          >
            Shina5
          </span>
        </p>
      </div>
    </div>
  );
}

// === LOADING SCREEN ===
function LoadingScreen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(180deg, ${theme.colors.backgroundGradientFrom} 0%, ${theme.colors.backgroundGradientTo} 50%, ${theme.colors.backgroundGradientFrom} 100%)` }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderLeftColor: theme.colors.primary, borderRightColor: theme.colors.primary, borderBottomColor: theme.colors.primary }} />
        <p className="font-medium" style={{ color: theme.colors.textPrimary }}>Chargement...</p>
      </div>
    </div>
  );
}

// === PAGE EXPORT ===
export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push('/auth'); } 
        else { setIsAuthenticated(true); setIsLoading(false); }
      } catch { router.push('/auth'); }
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => { if (!session) router.push('/auth'); });
    return () => subscription.unsubscribe();
  }, [router]);

  const handleNavigate = (page: string) => { router.push(page === 'accueil' ? '/' : `/${page}`); };

  if (isLoading || !isAuthenticated) return <LoadingScreen />;
  return <AppShell currentPage="accueil" onNavigate={handleNavigate}><AccueilContent /></AppShell>;
}
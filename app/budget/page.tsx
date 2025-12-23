"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, PageTitle } from '@/components';
import { useBudgetPeriod } from '@/hooks/useBudgetPeriod';

// Import des composants
import {
  VueTab,
  BilanTab,
  CorrectifsTab,
  AnalyseTab,
  SkeletonCard,
  MonthSelector,
  TabSelector,
  monthsFull,
  animationStyles
} from './components';
import type { TabType } from './components';

// ============================================================================
// TYPES
// ============================================================================

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

interface ObjectifBudget {
  id: string;
  categorie: string;
  limite: number;
  type: 'Factures' | 'Dépenses';
}

interface ActionItem {
  id: string;
  text: string;
  done: boolean;
}

interface NoteItem {
  id: string;
  text: string;
  date: string;
}

type BilanAccordionType = 'revenus' | 'factures' | 'depenses' | 'epargnes' | null;
type VueAccordionType = 'revenus' | 'factures' | 'enveloppes' | 'epargne' | 'solde' | null;

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

function BudgetContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const router = useRouter();
  
  // Hook pour la gestion des périodes de budget
  const { 
    configurationPaie, 
    isLoaded: isPaieConfigLoaded,
    getPeriodeBudget,
    filtrerTransactionsPourPeriode
  } = useBudgetPeriod();
  
  // ========== ÉTATS ==========
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('vue');
  const [bilanAccordion, setBilanAccordion] = useState<BilanAccordionType>(null);
  const [vueAccordion, setVueAccordion] = useState<VueAccordionType>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [budgetAvantPremier, setBudgetAvantPremier] = useState(false);

  // États pour Correctifs
  const [objectifsBudget, setObjectifsBudget] = useState<ObjectifBudget[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);

  // ========== CHARGEMENT DES DONNÉES ==========
  useEffect(() => {
    const saved = localStorage.getItem('budget-transactions');
    if (saved) setTransactions(JSON.parse(saved));
    
    const savedObjectifs = localStorage.getItem('budget-objectifs-limites');
    if (savedObjectifs) setObjectifsBudget(JSON.parse(savedObjectifs));
    
    const savedActions = localStorage.getItem('budget-actions');
    if (savedActions) setActions(JSON.parse(savedActions));
    
    const savedNotes = localStorage.getItem('budget-notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) {
      const parametres = JSON.parse(savedParametres);
      setBudgetAvantPremier(parametres.budgetAvantPremier || false);
    }
    
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Reset accordéons quand le mois change
  useEffect(() => { 
    setBilanAccordion(null); 
    setVueAccordion(null); 
  }, [selectedMonth, selectedYear]);

  // ========== HANDLERS DE SAUVEGARDE ==========
  const saveObjectifs = useCallback((newObjectifs: ObjectifBudget[]) => { 
    setObjectifsBudget(newObjectifs); 
    localStorage.setItem('budget-objectifs-limites', JSON.stringify(newObjectifs)); 
  }, []);
  
  const saveActions = useCallback((newActions: ActionItem[]) => { 
    setActions(newActions); 
    localStorage.setItem('budget-actions', JSON.stringify(newActions)); 
  }, []);
  
  const saveNotes = useCallback((newNotes: NoteItem[]) => { 
    setNotes(newNotes); 
    localStorage.setItem('budget-notes', JSON.stringify(newNotes)); 
  }, []);

  // ========== PÉRIODE DE BUDGET ==========
  const periodeBudget = useMemo(() => {
    return getPeriodeBudget(selectedMonth, selectedYear);
  }, [getPeriodeBudget, selectedMonth, selectedYear]);

  const periodeLabel = useMemo(() => {
    if (!budgetAvantPremier || configurationPaie.jourPaieDefaut === 1) {
      return `${monthsFull[selectedMonth]} ${selectedYear}`;
    }
    return periodeBudget.label;
  }, [budgetAvantPremier, configurationPaie.jourPaieDefaut, selectedMonth, selectedYear, periodeBudget.label]);

  // ========== FILTRAGE DES TRANSACTIONS ==========
  const filteredTransactions = useMemo(() => {
    if (!budgetAvantPremier || configurationPaie.jourPaieDefaut === 1) {
      const monthKey = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
      return transactions.filter(t => t.date?.startsWith(monthKey));
    }
    return filtrerTransactionsPourPeriode(transactions, periodeBudget);
  }, [transactions, selectedMonth, selectedYear, budgetAvantPremier, configurationPaie.jourPaieDefaut, filtrerTransactionsPourPeriode, periodeBudget]);

  // ========== CALCULS DES TOTAUX ==========
  const totals = useMemo(() => {
    const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const totalFactures = filteredTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const totalDepenses = filteredTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const totalEpargnes = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const solde = totalRevenus - totalFactures - totalDepenses - totalEpargnes;
    const tauxEpargne = totalRevenus > 0 ? (totalEpargnes / totalRevenus) * 100 : 0;
    const budgetApresDepenses = totalRevenus - totalFactures;
    const resteAVivre = totalRevenus - totalFactures - totalDepenses;
    return { totalRevenus, totalFactures, totalDepenses, totalEpargnes, solde, tauxEpargne, budgetApresDepenses, resteAVivre };
  }, [filteredTransactions]);

  // ========== DONNÉES DU MOIS PRÉCÉDENT ==========
  const prevMonthData = useMemo(() => {
    let prevYear = selectedYear, prevMonth = selectedMonth - 1;
    if (prevMonth < 0) { prevMonth = 11; prevYear--; }
    
    let prevTransactions: Transaction[];
    
    if (!budgetAvantPremier || configurationPaie.jourPaieDefaut === 1) {
      const prevMonthKey = `${prevYear}-${(prevMonth + 1).toString().padStart(2, '0')}`;
      prevTransactions = transactions.filter(t => t.date?.startsWith(prevMonthKey));
    } else {
      const prevPeriode = getPeriodeBudget(prevMonth, prevYear);
      prevTransactions = filtrerTransactionsPourPeriode(transactions, prevPeriode);
    }
    
    const prevRevenus = prevTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevFactures = prevTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevDepenses = prevTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevEpargnes = prevTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevSolde = prevRevenus - prevFactures - prevDepenses - prevEpargnes;
    const prevBudgetApres = prevRevenus - prevFactures;
    return { prevRevenus, prevFactures, prevDepenses, prevEpargnes, prevSolde, prevBudgetApres, hasData: prevTransactions.length > 0 };
  }, [transactions, selectedYear, selectedMonth, budgetAvantPremier, configurationPaie.jourPaieDefaut, getPeriodeBudget, filtrerTransactionsPourPeriode]);

  // ========== ÉVOLUTION 6 MOIS ==========
  const evolution6Mois = useMemo(() => {
    const data = [];
    const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    for (let i = 5; i >= 0; i--) {
      let m = selectedMonth - i, y = selectedYear;
      while (m < 0) { m += 12; y--; }
      
      let monthTx: Transaction[];
      if (!budgetAvantPremier || configurationPaie.jourPaieDefaut === 1) {
        const monthKey = `${y}-${(m + 1).toString().padStart(2, '0')}`;
        monthTx = transactions.filter(t => t.date?.startsWith(monthKey));
      } else {
        const periode = getPeriodeBudget(m, y);
        monthTx = filtrerTransactionsPourPeriode(transactions, periode);
      }
      
      const revenus = monthTx.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const factures = monthTx.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const depenses = monthTx.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const epargnes = monthTx.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const soldeMois = revenus - factures - depenses - epargnes;
      const enveloppes = revenus - factures;
      
      data.push({ name: monthsShort[m], revenus, factures, depenses, epargnes, solde: soldeMois, enveloppes });
    }
    return data;
  }, [transactions, selectedYear, selectedMonth, budgetAvantPremier, configurationPaie.jourPaieDefaut, getPeriodeBudget, filtrerTransactionsPourPeriode]);

  // ========== ÉVOLUTION 12 MOIS ==========
  const evolution12Mois = useMemo(() => {
    const data = [];
    const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    for (let i = 11; i >= 0; i--) {
      let m = selectedMonth - i, y = selectedYear;
      while (m < 0) { m += 12; y--; }
      
      let monthTx: Transaction[];
      if (!budgetAvantPremier || configurationPaie.jourPaieDefaut === 1) {
        const monthKey = `${y}-${(m + 1).toString().padStart(2, '0')}`;
        monthTx = transactions.filter(t => t.date?.startsWith(monthKey));
      } else {
        const periode = getPeriodeBudget(m, y);
        monthTx = filtrerTransactionsPourPeriode(transactions, periode);
      }
      
      const revenus = monthTx.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const factures = monthTx.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const depenses = monthTx.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const epargnes = monthTx.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const soldeMois = revenus - factures - depenses - epargnes;
      
      data.push({ name: monthsShort[m], revenus, factures, depenses, epargnes, solde: soldeMois, total: factures + depenses });
    }
    return data;
  }, [transactions, selectedYear, selectedMonth, budgetAvantPremier, configurationPaie.jourPaieDefaut, getPeriodeBudget, filtrerTransactionsPourPeriode]);

  // ========== MOYENNES ANNUELLES ==========
  const yearAverages = useMemo(() => {
    const yearTx = transactions.filter(t => t.date?.startsWith(`${selectedYear}`));
    const monthsWithData = new Set(yearTx.map(t => t.date?.substring(0, 7))).size || 1;
    const avgRevenus = yearTx.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0) / monthsWithData;
    const avgFactures = yearTx.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0) / monthsWithData;
    const avgDepenses = yearTx.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0) / monthsWithData;
    const avgEpargnes = yearTx.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0) / monthsWithData;
    return { avgRevenus, avgFactures, avgDepenses, avgEpargnes, monthsWithData };
  }, [transactions, selectedYear]);

  // ========== TOP 5 DÉPENSES ==========
  const top5Depenses = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions.filter(t => t.date?.startsWith(`${selectedYear}`) && (t.type === 'Dépenses' || t.type === 'Factures')).forEach(t => {
      const cat = t.categorie || 'Autre';
      categories[cat] = (categories[cat] || 0) + parseFloat(t.montant || '0');
    });
    return Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));
  }, [transactions, selectedYear]);

  // ========== VARIATIONS ==========
  const calcVariation = (current: number, previous: number) => previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100;
  
  const variations = useMemo(() => ({
    revenus: calcVariation(totals.totalRevenus, prevMonthData.prevRevenus),
    factures: calcVariation(totals.totalFactures, prevMonthData.prevFactures),
    depenses: calcVariation(totals.totalDepenses, prevMonthData.prevDepenses),
    epargnes: calcVariation(totals.totalEpargnes, prevMonthData.prevEpargnes),
    solde: calcVariation(totals.solde, prevMonthData.prevSolde),
    enveloppes: calcVariation(totals.budgetApresDepenses, prevMonthData.prevBudgetApres)
  }), [totals, prevMonthData]);

  // ========== SCORE DE SANTÉ ==========
  const healthScore = useMemo(() => {
    let score = 50;
    const { tauxEpargne, solde, totalRevenus, totalEpargnes, totalDepenses } = totals;
    
    if (tauxEpargne >= 20) score += 25;
    else if (tauxEpargne >= 15) score += 20;
    else if (tauxEpargne >= 10) score += 15;
    else if (tauxEpargne >= 5) score += 10;
    else if (tauxEpargne > 0) score += 5;
    
    if (solde > 0) {
      const soldeRatio = solde / (totalRevenus || 1);
      if (soldeRatio >= 0.2) score += 20;
      else if (soldeRatio >= 0.1) score += 15;
      else if (soldeRatio >= 0.05) score += 10;
      else score += 5;
    } else if (solde < 0) score -= 15;
    
    if (filteredTransactions.length >= 5) score += 10;
    else if (filteredTransactions.length >= 2) score += 5;
    
    if (prevMonthData.hasData) {
      if (solde > prevMonthData.prevSolde) score += 5;
      if (totalEpargnes > prevMonthData.prevEpargnes) score += 5;
    }
    
    if (yearAverages.monthsWithData > 1) {
      if (totalDepenses <= yearAverages.avgDepenses) score += 10;
      else if (totalDepenses <= yearAverages.avgDepenses * 1.1) score += 5;
    }
    
    return Math.min(Math.max(score, 0), 100);
  }, [totals, filteredTransactions, prevMonthData, yearAverages]);

  // ========== TENDANCES ==========
  const tendances = useMemo(() => {
    const result: { type: 'up' | 'down' | 'stable'; message: string; color: string }[] = [];
    
    if (evolution12Mois.length >= 3) {
      const last3 = evolution12Mois.slice(-3);
      
      const depTrend = last3[2].depenses - last3[0].depenses;
      const depPct = last3[0].depenses > 0 ? (depTrend / last3[0].depenses) * 100 : 0;
      if (depPct > 10) result.push({ type: 'up', message: `Dépenses en hausse de ${depPct.toFixed(0)}% sur 3 mois`, color: '#F44336' });
      else if (depPct < -10) result.push({ type: 'down', message: `Dépenses en baisse de ${Math.abs(depPct).toFixed(0)}% sur 3 mois`, color: '#4CAF50' });
      
      const epaTrend = last3[2].epargnes - last3[0].epargnes;
      const epaPct = last3[0].epargnes > 0 ? (epaTrend / last3[0].epargnes) * 100 : 0;
      if (epaPct > 10) result.push({ type: 'up', message: `Épargne en hausse de ${epaPct.toFixed(0)}% sur 3 mois`, color: '#4CAF50' });
      else if (epaPct < -10) result.push({ type: 'down', message: `Épargne en baisse de ${Math.abs(epaPct).toFixed(0)}% sur 3 mois`, color: '#FF9800' });
      
      const soldeTrend = last3[2].solde - last3[0].solde;
      if (soldeTrend > 100) result.push({ type: 'up', message: `Solde en amélioration (+${soldeTrend.toFixed(0)} €)`, color: '#4CAF50' });
      else if (soldeTrend < -100) result.push({ type: 'down', message: `Solde en baisse (${soldeTrend.toFixed(0)} €)`, color: '#F44336' });
    }
    
    return result;
  }, [evolution12Mois]);

  // ========== PRÉVISION ANNUELLE ==========
  const previsionAnnuelle = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const monthsRemaining = 11 - currentMonth;
    
    if (yearAverages.monthsWithData < 1 || monthsRemaining <= 0) return null;
    
    const avgSolde = yearAverages.avgRevenus - yearAverages.avgFactures - yearAverages.avgDepenses - yearAverages.avgEpargnes;
    const totalActuel = evolution12Mois.slice(-yearAverages.monthsWithData).reduce((sum, m) => sum + m.solde, 0);
    const previsionTotal = totalActuel + (avgSolde * monthsRemaining);
    const previsionEpargne = evolution12Mois.slice(-yearAverages.monthsWithData).reduce((sum, m) => sum + m.epargnes, 0) + (yearAverages.avgEpargnes * monthsRemaining);
    
    return { previsionTotal, previsionEpargne, monthsRemaining };
  }, [yearAverages, evolution12Mois]);

  // ========== NAVIGATION ==========
  const navigateToTransactions = useCallback(() => {
    router.push('/transactions');
  }, [router]);

  const prevMonth = useCallback(() => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(prev => prev - 1); }
    else setSelectedMonth(prev => prev - 1);
  }, [selectedMonth]);

  const nextMonth = useCallback(() => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(prev => prev + 1); }
    else setSelectedMonth(prev => prev + 1);
  }, [selectedMonth]);

  // ========== RENDU - LOADING ==========
  if (!isLoaded || !isPaieConfigLoaded) {
    return (
      <div className="pb-4 space-y-4">
        <div className="text-center mb-4">
          <div className="h-5 w-24 mx-auto rounded animate-pulse" style={{ backgroundColor: `${theme.colors.cardBorder}50` }} />
          <div className="h-3 w-40 mx-auto mt-2 rounded animate-pulse" style={{ backgroundColor: `${theme.colors.cardBorder}30` }} />
        </div>
        <SkeletonCard height={80} />
        <SkeletonCard height={60} />
        <div className="grid grid-cols-2 gap-3">
          <SkeletonCard height={80} />
          <SkeletonCard height={80} />
        </div>
        <SkeletonCard height={150} />
      </div>
    );
  }

  // ========== RENDU PRINCIPAL ==========
  return (
    <div className="pb-4">
      <style>{animationStyles}</style>
      <PageTitle page="budget" customSubtitle={`Vue d'ensemble de ${periodeLabel}`} />
      
      {/* Indicateur de période personnalisée */}
      {budgetAvantPremier && configurationPaie.jourPaieDefaut !== 1 && (
        <div 
          className="flex items-center justify-center gap-2 mb-3 py-2 px-3 rounded-xl text-xs animate-fade-in-up"
          style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
        >
          <Calendar className="w-4 h-4 text-green-500" />
          <span className="text-green-600">Période personnalisée : {periodeBudget.label}</span>
        </div>
      )}
       
      <MonthSelector
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Onglets */}
      {activeTab === 'vue' && (
        <VueTab
          filteredTransactions={filteredTransactions}
          totals={totals}
          prevMonthData={prevMonthData}
          variations={variations}
          evolution6Mois={evolution6Mois}
          healthScore={healthScore}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          vueAccordion={vueAccordion}
          onVueAccordionChange={setVueAccordion}
          onNavigateToTransactions={navigateToTransactions}
        />
      )}
      
      {activeTab === 'bilan' && (
        <BilanTab
          filteredTransactions={filteredTransactions}
          totals={totals}
          periodeLabel={periodeLabel}
          bilanAccordion={bilanAccordion}
          onBilanAccordionChange={setBilanAccordion}
        />
      )}
      
      {activeTab === 'correctifs' && (
        <CorrectifsTab
          filteredTransactions={filteredTransactions}
          transactions={transactions}
          objectifsBudget={objectifsBudget}
          actions={actions}
          notes={notes}
          onSaveObjectifs={saveObjectifs}
          onSaveActions={saveActions}
          onSaveNotes={saveNotes}
          totals={totals}
          yearAverages={yearAverages}
          top5Depenses={top5Depenses}
        />
      )}
      
      {activeTab === 'analyse' && (
        <AnalyseTab
          filteredTransactions={filteredTransactions}
          totals={totals}
          prevMonthData={prevMonthData}
          variations={variations}
          evolution12Mois={evolution12Mois}
          yearAverages={yearAverages}
          top5Depenses={top5Depenses}
          tendances={tendances}
          previsionAnnuelle={previsionAnnuelle}
          healthScore={healthScore}
          periodeLabel={periodeLabel}
          selectedYear={selectedYear}
          onNavigateToTransactions={navigateToTransactions}
        />
      )}
    </div>
  );
}

// ============================================================================
// EXPORT
// ============================================================================

export default function BudgetPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="budget" onNavigate={handleNavigate}>
      <BudgetContent />
    </AppShell>
  );
}
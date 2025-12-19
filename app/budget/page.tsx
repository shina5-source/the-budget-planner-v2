"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { TrendingUp, TrendingDown, Home as HomeIcon, Mail, PiggyBank, FileText, PieChart, Target, AlertTriangle, CheckCircle, Award, BarChart3, Zap, Calendar, ArrowUpRight, ArrowDownRight, Info, Plus, Trash2, Edit3, Check, X, StickyNote, Lightbulb, ClipboardList } from 'lucide-react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';

// Import des composants extraits
import {
  EmptyState,
  VariationBadge,
  CircularProgress,
  SkeletonCard,
  HealthGauge,
  EnrichedCard,
  AccordionSection,
  PieChartCard,
  ResteAVivre,
  MonthSelector,
  TabSelector,
  monthsFull,
  animationStyles,
  COLORS_TYPE,
  COLORS
} from './components';
import type { TabType } from './components';

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

function BudgetContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('vue');
  const [bilanAccordion, setBilanAccordion] = useState<BilanAccordionType>(null);
  const [vueAccordion, setVueAccordion] = useState<VueAccordionType>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [objectifsBudget, setObjectifsBudget] = useState<ObjectifBudget[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [newAction, setNewAction] = useState('');
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [showAddObjectif, setShowAddObjectif] = useState(false);
  const [newObjectifCategorie, setNewObjectifCategorie] = useState('');
  const [newObjectifLimite, setNewObjectifLimite] = useState('');
  const [newObjectifType, setNewObjectifType] = useState<'Factures' | 'Dépenses'>('Dépenses');

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };
  const tooltipStyle = { fontSize: '10px', backgroundColor: theme.colors.cardBackground, border: `1px solid ${theme.colors.cardBorder}`, borderRadius: '8px', color: theme.colors.textPrimary };

  // Navigation vers la page transactions
  const navigateToTransactions = useCallback(() => {
    router.push('/transactions');
  }, [router]);

  useEffect(() => {
    const saved = localStorage.getItem('budget-transactions');
    if (saved) setTransactions(JSON.parse(saved));
    const savedObjectifs = localStorage.getItem('budget-objectifs-limites');
    if (savedObjectifs) setObjectifsBudget(JSON.parse(savedObjectifs));
    const savedActions = localStorage.getItem('budget-actions');
    if (savedActions) setActions(JSON.parse(savedActions));
    const savedNotes = localStorage.getItem('budget-notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => { setBilanAccordion(null); setVueAccordion(null); }, [selectedMonth, selectedYear]);

  const saveObjectifs = (newObjectifs: ObjectifBudget[]) => { setObjectifsBudget(newObjectifs); localStorage.setItem('budget-objectifs-limites', JSON.stringify(newObjectifs)); };
  const saveActions = (newActions: ActionItem[]) => { setActions(newActions); localStorage.setItem('budget-actions', JSON.stringify(newActions)); };
  const saveNotes = (newNotes: NoteItem[]) => { setNotes(newNotes); localStorage.setItem('budget-notes', JSON.stringify(newNotes)); };

  const getMonthKey = (year: number, month: number) => `${year}-${(month + 1).toString().padStart(2, '0')}`;
  const currentMonthKey = getMonthKey(selectedYear, selectedMonth);
  const filteredTransactions = useMemo(() => transactions.filter(t => t.date?.startsWith(currentMonthKey)), [transactions, currentMonthKey]);

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

  const { totalRevenus, totalFactures, totalDepenses, totalEpargnes, solde, tauxEpargne, budgetApresDepenses, resteAVivre } = totals;

  const prevMonthData = useMemo(() => {
    let prevYear = selectedYear, prevMonth = selectedMonth - 1;
    if (prevMonth < 0) { prevMonth = 11; prevYear--; }
    const prevMonthKey = getMonthKey(prevYear, prevMonth);
    const prevTransactions = transactions.filter(t => t.date?.startsWith(prevMonthKey));
    const prevRevenus = prevTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevFactures = prevTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevDepenses = prevTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevEpargnes = prevTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const prevSolde = prevRevenus - prevFactures - prevDepenses - prevEpargnes;
    const prevBudgetApres = prevRevenus - prevFactures;
    return { prevRevenus, prevFactures, prevDepenses, prevEpargnes, prevSolde, prevBudgetApres, hasData: prevTransactions.length > 0 };
  }, [transactions, selectedYear, selectedMonth]);

  const evolution6Mois = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      let m = selectedMonth - i, y = selectedYear;
      while (m < 0) { m += 12; y--; }
      const monthKey = getMonthKey(y, m);
      const monthTx = transactions.filter(t => t.date?.startsWith(monthKey));
      const revenus = monthTx.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const factures = monthTx.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const depenses = monthTx.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const epargnes = monthTx.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const soldeMois = revenus - factures - depenses - epargnes;
      const enveloppes = revenus - factures;
      const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      data.push({ name: monthsShort[m], revenus, factures, depenses, epargnes, solde: soldeMois, enveloppes });
    }
    return data;
  }, [transactions, selectedYear, selectedMonth]);

  const evolution12Mois = useMemo(() => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      let m = selectedMonth - i, y = selectedYear;
      while (m < 0) { m += 12; y--; }
      const monthKey = getMonthKey(y, m);
      const monthTx = transactions.filter(t => t.date?.startsWith(monthKey));
      const revenus = monthTx.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const factures = monthTx.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const depenses = monthTx.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const epargnes = monthTx.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const soldeMois = revenus - factures - depenses - epargnes;
      const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      data.push({ name: monthsShort[m], revenus, factures, depenses, epargnes, solde: soldeMois, total: factures + depenses });
    }
    return data;
  }, [transactions, selectedYear, selectedMonth]);

  const yearAverages = useMemo(() => {
    const yearTx = transactions.filter(t => t.date?.startsWith(`${selectedYear}`));
    const monthsWithData = new Set(yearTx.map(t => t.date?.substring(0, 7))).size || 1;
    const avgRevenus = yearTx.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0) / monthsWithData;
    const avgFactures = yearTx.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0) / monthsWithData;
    const avgDepenses = yearTx.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0) / monthsWithData;
    const avgEpargnes = yearTx.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0) / monthsWithData;
    return { avgRevenus, avgFactures, avgDepenses, avgEpargnes, monthsWithData };
  }, [transactions, selectedYear]);

  const top5Depenses = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions.filter(t => t.date?.startsWith(`${selectedYear}`) && (t.type === 'Dépenses' || t.type === 'Factures')).forEach(t => {
      const cat = t.categorie || 'Autre';
      categories[cat] = (categories[cat] || 0) + parseFloat(t.montant || '0');
    });
    return Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));
  }, [transactions, selectedYear]);

  const depensesParCategorie = useMemo(() => {
    const categories: Record<string, { total: number; type: string }> = {};
    filteredTransactions.filter(t => t.type === 'Dépenses' || t.type === 'Factures').forEach(t => {
      const cat = t.categorie || 'Autre';
      if (!categories[cat]) categories[cat] = { total: 0, type: t.type };
      categories[cat].total += parseFloat(t.montant || '0');
    });
    return categories;
  }, [filteredTransactions]);

  const categoriesUniques = useMemo(() => {
    const cats = new Set<string>();
    transactions.forEach(t => { if ((t.type === 'Dépenses' || t.type === 'Factures') && t.categorie) cats.add(t.categorie); });
    return Array.from(cats).sort();
  }, [transactions]);

  const calcVariation = (current: number, previous: number) => previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100;
  const variations = {
    revenus: calcVariation(totalRevenus, prevMonthData.prevRevenus),
    factures: calcVariation(totalFactures, prevMonthData.prevFactures),
    depenses: calcVariation(totalDepenses, prevMonthData.prevDepenses),
    epargnes: calcVariation(totalEpargnes, prevMonthData.prevEpargnes),
    solde: calcVariation(solde, prevMonthData.prevSolde),
    enveloppes: calcVariation(budgetApresDepenses, prevMonthData.prevBudgetApres)
  };

  const revenusTransactions = filteredTransactions.filter(t => t.type === 'Revenus');
  const facturesTransactions = filteredTransactions.filter(t => t.type === 'Factures');
  const depensesTransactions = filteredTransactions.filter(t => t.type === 'Dépenses');
  const epargnesTransactions = filteredTransactions.filter(t => t.type === 'Épargnes');

  const groupByCategorie = (txList: Transaction[]) => {
    const groups: Record<string, { total: number; count: number }> = {};
    txList.forEach(t => {
      const cat = t.categorie || 'Autre';
      if (!groups[cat]) groups[cat] = { total: 0, count: 0 };
      groups[cat].total += parseFloat(t.montant || '0');
      groups[cat].count++;
    });
    return Object.entries(groups).sort((a, b) => b[1].total - a[1].total);
  };

  const prevMonth = useCallback(() => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(prev => prev - 1); }
    else setSelectedMonth(prev => prev - 1);
  }, [selectedMonth]);

  const nextMonth = useCallback(() => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(prev => prev + 1); }
    else setSelectedMonth(prev => prev + 1);
  }, [selectedMonth]);

  const calculateHealthScore = () => {
    let score = 50;
    if (tauxEpargne >= 20) score += 25; else if (tauxEpargne >= 15) score += 20; else if (tauxEpargne >= 10) score += 15; else if (tauxEpargne >= 5) score += 10; else if (tauxEpargne > 0) score += 5;
    if (solde > 0) { const soldeRatio = solde / (totalRevenus || 1); if (soldeRatio >= 0.2) score += 20; else if (soldeRatio >= 0.1) score += 15; else if (soldeRatio >= 0.05) score += 10; else score += 5; } else if (solde < 0) score -= 15;
    if (filteredTransactions.length >= 5) score += 10; else if (filteredTransactions.length >= 2) score += 5;
    if (prevMonthData.hasData) { if (solde > prevMonthData.prevSolde) score += 5; if (totalEpargnes > prevMonthData.prevEpargnes) score += 5; }
    if (yearAverages.monthsWithData > 1) { if (totalDepenses <= yearAverages.avgDepenses) score += 10; else if (totalDepenses <= yearAverages.avgDepenses * 1.1) score += 5; }
    return Math.min(Math.max(score, 0), 100);
  };
  const healthScore = calculateHealthScore();

  const getScoreColor = (s: number) => s >= 80 ? '#4CAF50' : s >= 60 ? '#8BC34A' : s >= 40 ? '#FF9800' : s >= 20 ? '#FF5722' : '#F44336';

  const getTendances = () => {
    const tendances: { type: 'up' | 'down' | 'stable'; message: string; color: string }[] = [];
    if (evolution12Mois.length >= 3) {
      const last3 = evolution12Mois.slice(-3);
      const depTrend = last3[2].depenses - last3[0].depenses;
      const depPct = last3[0].depenses > 0 ? (depTrend / last3[0].depenses) * 100 : 0;
      if (depPct > 10) tendances.push({ type: 'up', message: `Dépenses en hausse de ${depPct.toFixed(0)}% sur 3 mois`, color: '#F44336' });
      else if (depPct < -10) tendances.push({ type: 'down', message: `Dépenses en baisse de ${Math.abs(depPct).toFixed(0)}% sur 3 mois`, color: '#4CAF50' });
      const epaTrend = last3[2].epargnes - last3[0].epargnes;
      const epaPct = last3[0].epargnes > 0 ? (epaTrend / last3[0].epargnes) * 100 : 0;
      if (epaPct > 10) tendances.push({ type: 'up', message: `Épargne en hausse de ${epaPct.toFixed(0)}% sur 3 mois`, color: '#4CAF50' });
      else if (epaPct < -10) tendances.push({ type: 'down', message: `Épargne en baisse de ${Math.abs(epaPct).toFixed(0)}% sur 3 mois`, color: '#FF9800' });
      const soldeTrend = last3[2].solde - last3[0].solde;
      if (soldeTrend > 100) tendances.push({ type: 'up', message: `Solde en amélioration (+${soldeTrend.toFixed(0)} €)`, color: '#4CAF50' });
      else if (soldeTrend < -100) tendances.push({ type: 'down', message: `Solde en baisse (${soldeTrend.toFixed(0)} €)`, color: '#F44336' });
    }
    return tendances;
  };
  const tendances = getTendances();

  const getPrevisionAnnuelle = () => {
    const currentMonth = new Date().getMonth();
    const monthsRemaining = 11 - currentMonth;
    if (yearAverages.monthsWithData < 1 || monthsRemaining <= 0) return null;
    const avgSolde = yearAverages.avgRevenus - yearAverages.avgFactures - yearAverages.avgDepenses - yearAverages.avgEpargnes;
    const totalActuel = evolution12Mois.slice(-yearAverages.monthsWithData).reduce((sum, m) => sum + m.solde, 0);
    const previsionTotal = totalActuel + (avgSolde * monthsRemaining);
    const previsionEpargne = evolution12Mois.slice(-yearAverages.monthsWithData).reduce((sum, m) => sum + m.epargnes, 0) + (yearAverages.avgEpargnes * monthsRemaining);
    return { previsionTotal, previsionEpargne, monthsRemaining };
  };
  const previsionAnnuelle = getPrevisionAnnuelle();

  const getAlertesDepassement = () => {
    const alertes: { categorie: string; limite: number; actuel: number; depassement: number }[] = [];
    objectifsBudget.forEach(obj => {
      const actuel = depensesParCategorie[obj.categorie]?.total || 0;
      if (actuel > obj.limite) alertes.push({ categorie: obj.categorie, limite: obj.limite, actuel, depassement: actuel - obj.limite });
    });
    return alertes;
  };
  const alertesDepassement = getAlertesDepassement();

  const getSuggestions = () => {
    const suggestions: string[] = [];
    if (tauxEpargne < 20 && totalRevenus > 0) { const montantManquant = (totalRevenus * 0.2) - totalEpargnes; if (montantManquant > 0) suggestions.push(`Pour atteindre 20% d'épargne, épargnez ${montantManquant.toFixed(0)} € de plus.`); }
    if (yearAverages.monthsWithData > 1 && totalDepenses > yearAverages.avgDepenses * 1.2) { const excedent = totalDepenses - yearAverages.avgDepenses; suggestions.push(`Vos dépenses dépassent votre moyenne de ${excedent.toFixed(0)} €.`); }
    if (top5Depenses.length > 0) suggestions.push(`"${top5Depenses[0].name}" est votre plus gros poste (${top5Depenses[0].value.toFixed(0)} € cette année).`);
    if (solde < 0) suggestions.push('Votre solde est négatif. Réduisez vos dépenses.');
    return suggestions;
  };
  const suggestions = getSuggestions();

  const pieData = [
    { name: 'Factures', value: totalFactures, color: COLORS_TYPE.factures },
    { name: 'Dépenses', value: totalDepenses, color: COLORS_TYPE.depenses },
    { name: 'Épargnes', value: totalEpargnes, color: COLORS_TYPE.epargnes },
  ].filter(d => d.value > 0);

  // === RENDU VUE ENRICHIE ===
  const renderVue = () => {
    const hasData = filteredTransactions.length > 0;
    const hasSparklineData = evolution6Mois.some(d => d.revenus > 0 || d.factures > 0);

    const revenusAccordionContent = (
      <div className="space-y-2">
        {groupByCategorie(revenusTransactions).length === 0 ? <p className="text-xs text-center py-2" style={textSecondary}>Aucun revenu ce mois</p> :
          groupByCategorie(revenusTransactions).map(([cat, data], i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400" /><span className="text-xs" style={textPrimary}>{cat}</span><span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.textSecondary }}>×{data.count}</span></div>
              <span className="text-xs font-medium text-green-400">+{data.total.toFixed(2)} €</span>
            </div>
          ))}
      </div>
    );

    const facturesAccordionContent = (
      <div className="space-y-2">
        {groupByCategorie(facturesTransactions).length === 0 ? <p className="text-xs text-center py-2" style={textSecondary}>Aucune facture ce mois</p> :
          groupByCategorie(facturesTransactions).map(([cat, data], i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_TYPE.factures }} /><span className="text-xs" style={textPrimary}>{cat}</span></div>
              <span className="text-xs font-medium" style={{ color: COLORS_TYPE.factures }}>-{data.total.toFixed(2)} €</span>
            </div>
          ))}
      </div>
    );

    const enveloppesAccordionContent = (
      <div className="space-y-2">
        {groupByCategorie(depensesTransactions).length === 0 ? <p className="text-xs text-center py-2" style={textSecondary}>Aucune dépense ce mois</p> :
          groupByCategorie(depensesTransactions).map(([cat, data], i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_TYPE.depenses }} /><span className="text-xs" style={textPrimary}>{cat}</span></div>
              <span className="text-xs font-medium" style={{ color: COLORS_TYPE.depenses }}>-{data.total.toFixed(2)} €</span>
            </div>
          ))}
        {budgetApresDepenses > 0 && totalDepenses > 0 && (
          <div className="pt-2 mt-2" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
            <div className="flex justify-between items-center"><span className="text-[10px]" style={textSecondary}>Reste disponible</span><span className="text-xs font-medium" style={{ color: resteAVivre >= 0 ? '#4CAF50' : '#F44336' }}>{resteAVivre.toFixed(2)} €</span></div>
          </div>
        )}
      </div>
    );

    const epargneAccordionContent = (
      <div className="space-y-2">
        {groupByCategorie(epargnesTransactions).length === 0 ? <p className="text-xs text-center py-2" style={textSecondary}>Aucune épargne ce mois</p> :
          groupByCategorie(epargnesTransactions).map(([cat, data], i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_TYPE.epargnes }} /><span className="text-xs" style={textPrimary}>{cat}</span></div>
              <span className="text-xs font-medium" style={{ color: COLORS_TYPE.epargnes }}>{data.total.toFixed(2)} €</span>
            </div>
          ))}
        {totalRevenus > 0 && (
          <div className="pt-2 mt-2" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
            <div className="flex justify-between items-center"><span className="text-[10px]" style={textSecondary}>Taux d&apos;épargne</span><span className={`text-xs font-medium ${tauxEpargne >= 20 ? 'text-green-400' : tauxEpargne >= 10 ? 'text-orange-400' : 'text-red-400'}`}>{tauxEpargne.toFixed(1)}% {tauxEpargne >= 20 ? '✓' : '(obj: 20%)'}</span></div>
          </div>
        )}
      </div>
    );

    const soldeAccordionContent = (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg text-center" style={{ background: `${theme.colors.primary}05` }}><p className="text-[9px]" style={textSecondary}>Entrées</p><p className="text-sm font-semibold text-green-400">+{totalRevenus.toFixed(0)} €</p></div>
          <div className="p-2 rounded-lg text-center" style={{ background: `${theme.colors.primary}05` }}><p className="text-[9px]" style={textSecondary}>Sorties</p><p className="text-sm font-semibold text-red-400">-{(totalFactures + totalDepenses + totalEpargnes).toFixed(0)} €</p></div>
        </div>
        {prevMonthData.hasData && (
          <div className="flex justify-between items-center p-2 rounded-lg" style={{ background: solde >= prevMonthData.prevSolde ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)' }}>
            <span className="text-[10px]" style={textSecondary}>vs mois dernier</span>
            <span className={`text-xs font-medium ${solde >= prevMonthData.prevSolde ? 'text-green-400' : 'text-red-400'}`}>{prevMonthData.prevSolde.toFixed(0)} € → {solde.toFixed(0)} €</span>
          </div>
        )}
      </div>
    );

    if (!hasData) {
      return (
        <div className="space-y-4">
          <style>{animationStyles}</style>
          <EmptyState 
            message="Commencez par ajouter vos revenus et dépenses du mois" 
            icon="💰" 
            title="Votre budget vous attend !" 
            onAddTransaction={navigateToTransactions}
          />
          <div className="grid grid-cols-2 gap-3 opacity-50">
            <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-pulse" style={cardStyle}>
              <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: `${theme.colors.cardBorder}50` }} />
              <div className="h-6 w-24 rounded" style={{ backgroundColor: `${theme.colors.cardBorder}30` }} />
            </div>
            <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-pulse" style={cardStyle}>
              <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: `${theme.colors.cardBorder}50` }} />
              <div className="h-6 w-24 rounded" style={{ backgroundColor: `${theme.colors.cardBorder}30` }} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <style>{animationStyles}</style>
        
        <HealthGauge score={healthScore} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="animate-fade-in-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <EnrichedCard title="Revenus prévus" amount={totalRevenus} subtitle={`Reçus: ${totalRevenus.toFixed(2)} €`} icon={TrendingUp} variation={variations.revenus} sparklineKey="revenus" sparklineColor={COLORS_TYPE.revenus} sparklineData={evolution6Mois} hasSparklineData={hasSparklineData} isOpen={vueAccordion === 'revenus'} onToggle={() => setVueAccordion(vueAccordion === 'revenus' ? null : 'revenus')} accordionContent={revenusAccordionContent} iconColor={COLORS_TYPE.revenus} hasData={hasData} hasPrevMonthData={prevMonthData.hasData} />
          </div>
          <div className="animate-fade-in-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <EnrichedCard title="Dépenses fixes" amount={totalFactures} subtitle={`Payées: ${totalFactures.toFixed(2)} €`} icon={HomeIcon} variation={variations.factures} inverseVariation={true} progressValue={totalFactures} progressMax={totalRevenus} progressColor={COLORS_TYPE.factures} sparklineKey="factures" sparklineColor={COLORS_TYPE.factures} sparklineData={evolution6Mois} hasSparklineData={hasSparklineData} isOpen={vueAccordion === 'factures'} onToggle={() => setVueAccordion(vueAccordion === 'factures' ? null : 'factures')} accordionContent={facturesAccordionContent} iconColor={COLORS_TYPE.factures} hasData={hasData} hasPrevMonthData={prevMonthData.hasData} />
          </div>
          <div className="animate-fade-in-up stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <EnrichedCard title="Enveloppes budgétaires" amount={budgetApresDepenses} subtitle={`Dépensé: ${totalDepenses.toFixed(2)} €`} icon={Mail} variation={variations.enveloppes} progressValue={totalDepenses} progressMax={budgetApresDepenses > 0 ? budgetApresDepenses : 1} progressColor={COLORS_TYPE.depenses} sparklineKey="enveloppes" sparklineColor={COLORS_TYPE.depenses} sparklineData={evolution6Mois} hasSparklineData={hasSparklineData} isOpen={vueAccordion === 'enveloppes'} onToggle={() => setVueAccordion(vueAccordion === 'enveloppes' ? null : 'enveloppes')} accordionContent={enveloppesAccordionContent} iconColor={COLORS_TYPE.depenses} hasData={hasData} hasPrevMonthData={prevMonthData.hasData} />
          </div>
          <div className="animate-fade-in-up stagger-4 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <EnrichedCard title="Épargne CT prévu" amount={totalEpargnes} subtitle={`Versé: ${totalEpargnes.toFixed(2)} €`} icon={PiggyBank} variation={variations.epargnes} progressValue={totalEpargnes} progressMax={totalRevenus * 0.2} progressColor={COLORS_TYPE.epargnes} sparklineKey="epargnes" sparklineColor={COLORS_TYPE.epargnes} sparklineData={evolution6Mois} hasSparklineData={hasSparklineData} isOpen={vueAccordion === 'epargne'} onToggle={() => setVueAccordion(vueAccordion === 'epargne' ? null : 'epargne')} accordionContent={epargneAccordionContent} iconColor={COLORS_TYPE.epargnes} hasData={hasData} hasPrevMonthData={prevMonthData.hasData} />
          </div>
        </div>
        
        <div className="animate-fade-in-up stagger-5 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <EnrichedCard title="Solde réel" amount={solde} subtitle="Dépenses réelles" icon={PieChart} variation={variations.solde} sparklineKey="solde" sparklineColor={solde >= 0 ? '#4CAF50' : '#F44336'} sparklineData={evolution6Mois} hasSparklineData={hasSparklineData} isOpen={vueAccordion === 'solde'} onToggle={() => setVueAccordion(vueAccordion === 'solde' ? null : 'solde')} accordionContent={soldeAccordionContent} iconColor={solde >= 0 ? '#4CAF50' : '#F44336'} hasData={hasData} hasPrevMonthData={prevMonthData.hasData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <PieChartCard data={pieData} total={totalFactures + totalDepenses + totalEpargnes} className="animate-fade-in-up stagger-6 opacity-0" style={{ animationFillMode: 'forwards' }} />
          {totalRevenus > 0 && (
            <ResteAVivre resteAVivre={resteAVivre} selectedYear={selectedYear} selectedMonth={selectedMonth} className="animate-fade-in-up stagger-7 opacity-0" style={{ animationFillMode: 'forwards' }} />
          )}
        </div>

        <SmartTips page="budget" />
      </div>
    );
  };

  // === RENDU BILAN ===
  const renderBilan = () => {
    return (
      <div className="space-y-3">
        <style>{animationStyles}</style>
        <div className="flex items-center gap-3 mb-2 animate-fade-in-up"><div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}><FileText className="w-5 h-5" style={textPrimary} /></div><div><h3 className="text-sm font-semibold" style={textPrimary}>Bilan mensuel</h3><p className="text-[10px]" style={textSecondary}>{monthsFull[selectedMonth]} {selectedYear}</p></div></div>
        
        <div className="animate-fade-in-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <AccordionSection title="Revenus mensuels" icon={TrendingUp} transactions={revenusTransactions} total={totalRevenus} isExpense={false} isOpen={bilanAccordion === 'revenus'} onToggle={() => setBilanAccordion(bilanAccordion === 'revenus' ? null : 'revenus')} color="#4CAF50" />
        </div>
        <div className="animate-fade-in-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <AccordionSection title="Dépenses fixes" icon={HomeIcon} transactions={facturesTransactions} total={totalFactures} isExpense={true} isOpen={bilanAccordion === 'factures'} onToggle={() => setBilanAccordion(bilanAccordion === 'factures' ? null : 'factures')} color={COLORS_TYPE.factures} />
        </div>
        <div className="animate-fade-in-up stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <AccordionSection title="Dépenses variables" icon={Mail} transactions={depensesTransactions} total={totalDepenses} isExpense={true} isOpen={bilanAccordion === 'depenses'} onToggle={() => setBilanAccordion(bilanAccordion === 'depenses' ? null : 'depenses')} color={COLORS_TYPE.depenses} />
        </div>
        <div className="animate-fade-in-up stagger-4 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <AccordionSection title="Épargnes" icon={PiggyBank} transactions={epargnesTransactions} total={totalEpargnes} isExpense={true} isOpen={bilanAccordion === 'epargnes'} onToggle={() => setBilanAccordion(bilanAccordion === 'epargnes' ? null : 'epargnes')} color={COLORS_TYPE.epargnes} />
        </div>
        
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center animate-fade-in-up stagger-5 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <p className="text-xs mb-1" style={textSecondary}>Solde du mois</p>
          <p className={`text-3xl font-bold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>{solde >= 0 ? '+' : ''}{solde.toFixed(2)} €</p>
          <div className="mt-4"><CircularProgress value={tauxEpargne} max={20} color={tauxEpargne >= 20 ? '#4CAF50' : tauxEpargne >= 10 ? '#FF9800' : '#F44336'} size={80} label="Épargne" /></div>
          {solde > 0 ? <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 inline-block">✨ Excellent ! Solde positif</p> : solde < 0 ? <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 inline-block">⚠️ Attention ! Solde négatif</p> : <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 inline-block">➖ Solde à l&apos;équilibre</p>}
        </div>
        <SmartTips page="budget" />
      </div>
    );
  };

  // === RENDU CORRECTIFS ===
  const renderCorrectifs = () => {
    const addObjectif = () => { if (!newObjectifCategorie || !newObjectifLimite) return; saveObjectifs([...objectifsBudget, { id: Date.now().toString(), categorie: newObjectifCategorie, limite: parseFloat(newObjectifLimite), type: newObjectifType }]); setNewObjectifCategorie(''); setNewObjectifLimite(''); setShowAddObjectif(false); };
    const deleteObjectif = (id: string) => saveObjectifs(objectifsBudget.filter(o => o.id !== id));
    const addAction = () => { if (!newAction.trim()) return; saveActions([...actions, { id: Date.now().toString(), text: newAction, done: false }]); setNewAction(''); };
    const toggleAction = (id: string) => saveActions(actions.map(a => a.id === id ? { ...a, done: !a.done } : a));
    const deleteAction = (id: string) => saveActions(actions.filter(a => a.id !== id));
    const addNote = () => { if (!newNote.trim()) return; saveNotes([...notes, { id: Date.now().toString(), text: newNote, date: new Date().toLocaleDateString('fr-FR') }]); setNewNote(''); };
    const deleteNote = (id: string) => saveNotes(notes.filter(n => n.id !== id));
    const updateNote = (id: string, text: string) => { saveNotes(notes.map(n => n.id === id ? { ...n, text } : n)); setEditingNote(null); };

    return (
      <div className="space-y-4">
        <style>{animationStyles}</style>
        <div className="flex items-center gap-3 mb-2 animate-fade-in-up"><div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}><Target className="w-5 h-5" style={textPrimary} /></div><div><h3 className="text-sm font-semibold" style={textPrimary}>Correctifs & Actions</h3><p className="text-[10px]" style={textSecondary}>Gérez vos objectifs</p></div></div>
        
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-1 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-3"><h4 className="text-xs font-semibold flex items-center gap-2" style={textPrimary}>🎯 Objectifs budgétaires</h4><button type="button" onClick={() => setShowAddObjectif(!showAddObjectif)} className="p-1.5 rounded-lg transition-transform hover:scale-110" style={{ background: `${theme.colors.primary}20` }}><Plus className="w-4 h-4" style={textPrimary} /></button></div>
          {showAddObjectif && (
            <div className="p-3 rounded-xl mb-3 animate-fade-in" style={{ background: `${theme.colors.primary}10` }}>
              <div className="space-y-2">
                <select value={newObjectifCategorie} onChange={(e) => setNewObjectifCategorie(e.target.value)} className="w-full px-3 py-2 rounded-lg text-xs border" style={inputStyle}><option value="">Sélectionner une catégorie</option>{categoriesUniques.map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select>
                <div className="flex gap-2"><input type="number" placeholder="Limite (€)" value={newObjectifLimite} onChange={(e) => setNewObjectifLimite(e.target.value)} className="flex-1 px-3 py-2 rounded-lg text-xs border" style={inputStyle} /><select value={newObjectifType} onChange={(e) => setNewObjectifType(e.target.value as 'Factures' | 'Dépenses')} className="px-3 py-2 rounded-lg text-xs border" style={inputStyle}><option value="Dépenses">Dépenses</option><option value="Factures">Factures</option></select></div>
                <button type="button" onClick={addObjectif} className="w-full py-2 rounded-lg text-xs font-medium transition-transform hover:scale-[1.02]" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}>Ajouter</button>
              </div>
            </div>
          )}
          {objectifsBudget.length === 0 ? <p className="text-xs text-center py-3" style={textSecondary}>Aucun objectif défini.</p> : (
            <div className="space-y-2">{objectifsBudget.map(obj => { const actuel = depensesParCategorie[obj.categorie]?.total || 0; const pct = (actuel / obj.limite) * 100; const isOver = actuel > obj.limite; return (
              <div key={obj.id} className="p-2 rounded-xl" style={{ background: `${theme.colors.primary}05` }}>
                <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><span className="text-xs font-medium" style={textPrimary}>{obj.categorie}</span><span className={`text-[8px] px-1.5 py-0.5 rounded-full ${obj.type === 'Dépenses' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>{obj.type}</span></div><button type="button" onClick={() => deleteObjectif(obj.id)} className="p-1 rounded hover:bg-red-500/20 transition-colors"><Trash2 className="w-3 h-3 text-red-400" /></button></div>
                <div className="flex items-center justify-between text-[10px] mb-1"><span style={textSecondary}>{actuel.toFixed(0)} € / {obj.limite.toFixed(0)} €</span><span className={isOver ? 'text-red-400' : 'text-green-400'}>{pct.toFixed(0)}%</span></div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.colors.cardBorder}50` }}><div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: isOver ? '#F44336' : pct > 80 ? '#FF9800' : '#4CAF50' }} /></div>
              </div>
            ); })}</div>
          )}
        </div>

        {alertesDepassement.length > 0 && (
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-2 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
            <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>⚠️ Alertes dépassement</h4>
            <div className="space-y-2">{alertesDepassement.map((alerte, i) => (<div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30"><AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" /><span className="text-xs text-red-400"><strong>{alerte.categorie}</strong> dépasse de {alerte.depassement.toFixed(0)} €</span></div>))}</div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-3 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
            <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}><Lightbulb className="w-4 h-4" /> Suggestions</h4>
            <div className="space-y-2">{suggestions.map((suggestion, i) => (<div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}><span className="text-sm">💡</span><span className="text-xs" style={textSecondary}>{suggestion}</span></div>))}</div>
          </div>
        )}

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-4 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}><ClipboardList className="w-4 h-4" /> Actions à faire</h4>
          <div className="flex gap-2 mb-3"><input type="text" placeholder="Ajouter une action..." value={newAction} onChange={(e) => setNewAction(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addAction()} className="flex-1 px-3 py-2 rounded-lg text-xs border" style={inputStyle} /><button type="button" onClick={addAction} className="p-2 rounded-lg transition-transform hover:scale-110" style={{ background: theme.colors.primary }}><Plus className="w-4 h-4" style={{ color: theme.colors.textOnPrimary }} /></button></div>
          {actions.length === 0 ? <p className="text-xs text-center py-2" style={textSecondary}>Aucune action.</p> : (
            <div className="space-y-2">{actions.map(action => (<div key={action.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}><button type="button" onClick={() => toggleAction(action.id)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${action.done ? 'bg-green-500 border-green-500' : ''}`} style={{ borderColor: action.done ? undefined : theme.colors.cardBorder }}>{action.done && <Check className="w-3 h-3 text-white" />}</button><span className={`flex-1 text-xs ${action.done ? 'line-through opacity-50' : ''}`} style={textPrimary}>{action.text}</span><button type="button" onClick={() => deleteAction(action.id)} className="p-1 rounded hover:bg-red-500/20 transition-colors"><X className="w-3 h-3 text-red-400" /></button></div>))}</div>
          )}
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-5 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}><StickyNote className="w-4 h-4" /> Notes personnelles</h4>
          <div className="flex gap-2 mb-3"><input type="text" placeholder="Ajouter une note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addNote()} className="flex-1 px-3 py-2 rounded-lg text-xs border" style={inputStyle} /><button type="button" onClick={addNote} className="p-2 rounded-lg transition-transform hover:scale-110" style={{ background: theme.colors.primary }}><Plus className="w-4 h-4" style={{ color: theme.colors.textOnPrimary }} /></button></div>
          {notes.length === 0 ? <p className="text-xs text-center py-2" style={textSecondary}>Aucune note.</p> : (
            <div className="space-y-2">{notes.map(note => (<div key={note.id} className="p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>{editingNote === note.id ? <input type="text" defaultValue={note.text} onBlur={(e) => updateNote(note.id, e.target.value)} onKeyPress={(e) => e.key === 'Enter' && updateNote(note.id, (e.target as HTMLInputElement).value)} className="w-full px-2 py-1 rounded text-xs border" style={inputStyle} autoFocus /> : <div className="flex items-start justify-between"><div><p className="text-xs" style={textPrimary}>{note.text}</p><p className="text-[9px] mt-1" style={textSecondary}>{note.date}</p></div><div className="flex gap-1"><button type="button" onClick={() => setEditingNote(note.id)} className="p-1 rounded hover:bg-gray-500/20 transition-colors"><Edit3 className="w-3 h-3" style={textSecondary} /></button><button type="button" onClick={() => deleteNote(note.id)} className="p-1 rounded hover:bg-red-500/20 transition-colors"><X className="w-3 h-3 text-red-400" /></button></div></div>}</div>))}</div>
          )}
        </div>
        <SmartTips page="budget" />
      </div>
    );
  };

  // === RENDU ANALYSE ===
  const renderAnalyse = () => {
    const hasYearData = evolution12Mois.some(m => m.revenus > 0 || m.depenses > 0);
    const hasData = filteredTransactions.length > 0;
    const totalSorties = totalFactures + totalDepenses + totalEpargnes;

    return (
      <div className="space-y-4">
        <style>{animationStyles}</style>
        <div className="flex items-center gap-3 mb-2 animate-fade-in-up"><div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}><BarChart3 className="w-5 h-5" style={textPrimary} /></div><div><h3 className="text-sm font-semibold" style={textPrimary}>Analyse approfondie</h3><p className="text-[10px]" style={textSecondary}>{monthsFull[selectedMonth]} {selectedYear}</p></div></div>

        {!hasData && !hasYearData ? (
          <EmptyState 
            message="Ajoutez des transactions pour voir l'analyse" 
            icon="📈" 
            title="Analyses en attente" 
            onAddTransaction={navigateToTransactions}
          />
        ) : (
          <>
            {hasData && (
              <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-1 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
                <h4 className="text-xs font-semibold mb-4 flex items-center gap-2" style={textPrimary}>📊 Flux du mois</h4>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1"><TrendingUp className="w-5 h-5 mx-auto text-green-400 mb-1" /><p className="text-[9px]" style={textSecondary}>Entrées</p><p className="text-lg font-bold text-green-400">+{totalRevenus.toFixed(0)} €</p></div>
                  <div className="w-px h-12" style={{ backgroundColor: theme.colors.cardBorder }} />
                  <div className="text-center flex-1"><TrendingDown className="w-5 h-5 mx-auto text-red-400 mb-1" /><p className="text-[9px]" style={textSecondary}>Sorties</p><p className="text-lg font-bold text-red-400">-{totalSorties.toFixed(0)} €</p></div>
                  <div className="w-px h-12" style={{ backgroundColor: theme.colors.cardBorder }} />
                  <div className="text-center flex-1">{solde >= 0 ? <CheckCircle className="w-5 h-5 mx-auto text-green-400 mb-1" /> : <AlertTriangle className="w-5 h-5 mx-auto text-red-400 mb-1" />}<p className="text-[9px]" style={textSecondary}>Balance</p><p className={`text-lg font-bold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>{solde >= 0 ? '+' : ''}{solde.toFixed(0)} €</p></div>
                </div>
              </div>
            )}

            {prevMonthData.hasData && (
              <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-2 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
                <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}><Calendar className="w-4 h-4" /> vs Mois précédent</h4>
                <div className="space-y-2">
                  {[{ label: 'Revenus', prev: prevMonthData.prevRevenus, curr: totalRevenus, variation: variations.revenus, inverse: false }, { label: 'Factures', prev: prevMonthData.prevFactures, curr: totalFactures, variation: variations.factures, inverse: true }, { label: 'Dépenses', prev: prevMonthData.prevDepenses, curr: totalDepenses, variation: variations.depenses, inverse: true }, { label: 'Épargnes', prev: prevMonthData.prevEpargnes, curr: totalEpargnes, variation: variations.epargnes, inverse: false }].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}><span className="text-xs" style={textSecondary}>{item.label}</span><div className="flex items-center gap-2"><span className="text-xs" style={textPrimary}>{item.prev.toFixed(0)} € → {item.curr.toFixed(0)} €</span><VariationBadge variation={item.variation} inverse={item.inverse} hasData={prevMonthData.hasData} /></div></div>
                  ))}
                  <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: solde >= prevMonthData.prevSolde ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)' }}><span className="text-xs font-medium" style={textPrimary}>Solde</span><div className="flex items-center gap-2"><span className="text-xs font-medium" style={textPrimary}>{prevMonthData.prevSolde.toFixed(0)} € → {solde.toFixed(0)} €</span><VariationBadge variation={variations.solde} hasData={prevMonthData.hasData} /></div></div>
                </div>
              </div>
            )}

            {yearAverages.monthsWithData > 1 && (
              <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-3 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
                <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}><Zap className="w-4 h-4" /> vs Moyennes {selectedYear}<span className="text-[9px] font-normal px-2 py-0.5 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.textSecondary }}>{yearAverages.monthsWithData} mois</span></h4>
                <div className="grid grid-cols-2 gap-3">
                  {[{ label: 'Revenus', curr: totalRevenus, avg: yearAverages.avgRevenus, good: totalRevenus >= yearAverages.avgRevenus }, { label: 'Factures', curr: totalFactures, avg: yearAverages.avgFactures, good: totalFactures <= yearAverages.avgFactures }, { label: 'Dépenses', curr: totalDepenses, avg: yearAverages.avgDepenses, good: totalDepenses <= yearAverages.avgDepenses }, { label: 'Épargnes', curr: totalEpargnes, avg: yearAverages.avgEpargnes, good: totalEpargnes >= yearAverages.avgEpargnes }].map((item, i) => (
                    <div key={i} className="p-2 rounded-xl text-center" style={{ background: `${theme.colors.primary}05` }}><p className="text-[9px]" style={textSecondary}>{item.label}</p><p className="text-sm font-semibold" style={textPrimary}>{item.curr.toFixed(0)} €</p><p className={`text-[8px] ${item.good ? 'text-green-400' : 'text-orange-400'}`}>{item.good ? '✓' : '!'} moy: {item.avg.toFixed(0)} €</p></div>
                  ))}
                </div>
              </div>
            )}

            {hasYearData && (
              <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center animate-fade-in-up stagger-4 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
                <h4 className="text-xs font-semibold mb-3 flex items-center justify-center gap-2" style={textPrimary}><Award className="w-4 h-4" /> Score santé financière</h4>
                <div className="relative inline-flex items-center justify-center mb-3">
                  <svg width={120} height={120} className="transform -rotate-90"><circle cx={60} cy={60} r={50} stroke={`${theme.colors.cardBorder}50`} strokeWidth={10} fill="none" /><circle cx={60} cy={60} r={50} stroke={getScoreColor(healthScore)} strokeWidth={10} fill="none" strokeDasharray={314} strokeDashoffset={314 - (healthScore / 100) * 314} strokeLinecap="round" className="transition-all duration-1000 ease-out" /></svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-bold" style={{ color: getScoreColor(healthScore) }}>{healthScore}</span><span className="text-[9px]" style={textSecondary}>/100</span></div>
                </div>
                <p className="text-sm font-medium" style={{ color: getScoreColor(healthScore) }}>{healthScore >= 80 ? 'Excellent !' : healthScore >= 60 ? 'Bien' : healthScore >= 40 ? 'Moyen' : healthScore >= 20 ? 'À améliorer' : 'Critique'}</p>
                <p className="text-[10px] mt-2" style={textSecondary}>Basé sur: taux d&apos;épargne, solde, régularité</p>
              </div>
            )}

            {hasYearData && (
              <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-5 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
                <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}><TrendingUp className="w-4 h-4" /> Évolution sur 12 mois</h4>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolution12Mois} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fill: theme.colors.textSecondary, fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: theme.colors.textSecondary, fontSize: 9 }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(0)} €`} contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: '9px' }} />
                      <Line type="monotone" dataKey="revenus" stroke={COLORS_TYPE.revenus} strokeWidth={2} dot={{ r: 2 }} name="Revenus" />
                      <Line type="monotone" dataKey="total" stroke={COLORS_TYPE.depenses} strokeWidth={2} dot={{ r: 2 }} name="Dépenses" />
                      <Line type="monotone" dataKey="solde" stroke={theme.colors.primary} strokeWidth={2} dot={{ r: 2 }} name="Solde" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {top5Depenses.length > 0 && (
              <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-6 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
                <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>🏆 Top 5 catégories (sorties {selectedYear})</h4>
                <div className="space-y-2">
                  {top5Depenses.map((cat, i) => {
                    const maxValue = top5Depenses[0].value;
                    const pct = (cat.value / maxValue) * 100;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `${COLORS[i]}30`, color: COLORS[i] }}>{i + 1}</span><span className="text-xs" style={textPrimary}>{cat.name}</span></div>
                          <span className="text-xs font-semibold" style={{ color: COLORS[i] }}>{cat.value.toFixed(0)} €</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.colors.cardBorder}50` }}><div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: COLORS[i] }} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tendances.length > 0 && (
              <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-7 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
                <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>📈 Tendances (3 derniers mois)</h4>
                <div className="space-y-2">
                  {tendances.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: `${t.color}10` }}>
                      {t.type === 'up' ? <ArrowUpRight className="w-4 h-4" style={{ color: t.color }} /> : t.type === 'down' ? <ArrowDownRight className="w-4 h-4" style={{ color: t.color }} /> : <Info className="w-4 h-4" style={{ color: t.color }} />}
                      <span className="text-xs" style={{ color: t.color }}>{t.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previsionAnnuelle && previsionAnnuelle.monthsRemaining > 0 && (
              <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-scale-in" style={{ ...cardStyle, animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
                <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>🔮 Prévision fin d&apos;année<span className="text-[9px] font-normal px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">{previsionAnnuelle.monthsRemaining} mois restants</span></h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl text-center" style={{ background: `${theme.colors.primary}05`, border: '1px dashed', borderColor: theme.colors.cardBorder }}><p className="text-[9px]" style={textSecondary}>Solde annuel prévu</p><p className={`text-xl font-bold ${previsionAnnuelle.previsionTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>{previsionAnnuelle.previsionTotal >= 0 ? '+' : ''}{previsionAnnuelle.previsionTotal.toFixed(0)} €</p></div>
                  <div className="p-3 rounded-xl text-center" style={{ background: `${theme.colors.primary}05`, border: '1px dashed', borderColor: theme.colors.cardBorder }}><p className="text-[9px]" style={textSecondary}>Épargne annuelle prévue</p><p className="text-xl font-bold text-blue-400">{previsionAnnuelle.previsionEpargne.toFixed(0)} €</p></div>
                </div>
                <p className="text-[9px] text-center mt-2" style={textSecondary}>Basé sur les moyennes de {yearAverages.monthsWithData} mois</p>
              </div>
            )}
          </>
        )}

        <SmartTips page="budget" />
      </div>
    );
  };

  // === RENDU PRINCIPAL ===
  if (!isLoaded) {
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

  return (
    <div className="pb-4">
      <style>{animationStyles}</style>
      <div className="text-center mb-4">
        <h1 className="text-lg font-medium" style={textPrimary}>Budget</h1>
        <p className="text-xs" style={textSecondary}>Vue d&apos;ensemble de {monthsFull[selectedMonth]} {selectedYear}</p>
      </div>

      <MonthSelector
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'vue' && renderVue()}
      {activeTab === 'bilan' && renderBilan()}
      {activeTab === 'correctifs' && renderCorrectifs()}
      {activeTab === 'analyse' && renderAnalyse()}
    </div>
  );
}

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

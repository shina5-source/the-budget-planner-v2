'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, PageTitle } from '@/components';
import { useBudgetPeriod } from '@/hooks/useBudgetPeriod';

import {
  ResumeTab,
  DetailTab,
  EvolutionTab,
  CalendrierTab,
  FluxTab,
  ObjectifsTab,
  StatsSkeletonLoader,
  MonthSelector,
  TabsNavigation,
  FiltersPanel,
  FullscreenChartModal,
  Transaction,
  ObjectifBudget,
  TabType,
  COLORS_TYPE,
  calculateTotals,
  calculateVariation,
  getN1Totals
} from './components';

function StatistiquesContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme, isDarkMode } = useTheme() as any;
  const statsRef = useRef<HTMLDivElement>(null);

  // Hook pour la gestion des périodes de budget
  const { 
    configurationPaie, 
    isLoaded: isPaieConfigLoaded,
    getPeriodeBudget,
    filtrerTransactionsPourPeriode
  } = useBudgetPeriod();

  // États
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  const [objectifsBudget, setObjectifsBudget] = useState<ObjectifBudget[]>([]);
  const [budgetAvantPremier, setBudgetAvantPremier] = useState(false);
  
  // Filtres
  const [showFilters, setShowFilters] = useState(false);
  const [compteFilter, setCompteFilter] = useState('all');
  const [moyenPaiementFilter, setMoyenPaiementFilter] = useState('all');
  
  // Fullscreen chart
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null);

  // Charger les données
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem('budget-transactions');
        if (stored) {
          setTransactions(JSON.parse(stored));
        }
        
        const storedObjectifs = localStorage.getItem('budget-objectifs-limites');
        if (storedObjectifs) {
          setObjectifsBudget(JSON.parse(storedObjectifs));
        }
        
        // Charger le paramètre budgetAvantPremier
        const savedParametres = localStorage.getItem('budget-parametres');
        if (savedParametres) {
          const parametres = JSON.parse(savedParametres);
          setBudgetAvantPremier(parametres.budgetAvantPremier || false);
        }
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };
    
    loadData();
  }, []);

  // Sauvegarder les objectifs
  useEffect(() => {
    if (objectifsBudget.length > 0) {
      localStorage.setItem('budget-objectifs-limites', JSON.stringify(objectifsBudget));
    }
  }, [objectifsBudget]);

  // ========== Période de budget personnalisée ==========
  const periodeBudget = useMemo(() => {
    if (selectedMonth === null) return null;
    return getPeriodeBudget(selectedMonth, selectedYear);
  }, [getPeriodeBudget, selectedMonth, selectedYear]);

  const periodeLabel = useMemo(() => {
    if (selectedMonth === null) return `Année ${selectedYear}`;
    if (!budgetAvantPremier || configurationPaie.jourPaieDefaut === 1) {
      const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      return `${moisNoms[selectedMonth]} ${selectedYear}`;
    }
    return periodeBudget?.label || '';
  }, [budgetAvantPremier, configurationPaie.jourPaieDefaut, selectedMonth, selectedYear, periodeBudget]);

  // Helper pour filtrer les transactions selon le mode
  const filterTransactionsForPeriod = useCallback((txList: Transaction[], month: number | null, year: number) => {
    if (month === null) {
      // Vue annuelle - pas de changement
      return txList.filter(t => t.date && new Date(t.date).getFullYear() === year);
    }
    
    // Si toggle OFF ou jour de paie = 1, filtrage standard
    if (!budgetAvantPremier || configurationPaie.jourPaieDefaut === 1) {
      const monthKey = `${year}-${(month + 1).toString().padStart(2, '0')}`;
      return txList.filter(t => t.date?.startsWith(monthKey));
    }
    
    // Sinon, filtrage par période personnalisée
    const periode = getPeriodeBudget(month, year);
    return filtrerTransactionsPourPeriode(txList, periode);
  }, [budgetAvantPremier, configurationPaie.jourPaieDefaut, getPeriodeBudget, filtrerTransactionsPourPeriode]);
  // =====================================================

  // Calculs mémorisés avec période personnalisée
  const filteredTransactions = useMemo(() => {
    let txList = filterTransactionsForPeriod(transactions, selectedMonth, selectedYear);
    
    // Appliquer les filtres de compte et moyen de paiement
    if (compteFilter !== 'all') {
      txList = txList.filter(t => t.depuis === compteFilter || t.vers === compteFilter);
    }
    if (moyenPaiementFilter !== 'all') {
      txList = txList.filter(t => t.moyenPaiement === moyenPaiementFilter);
    }
    
    return txList;
  }, [transactions, selectedMonth, selectedYear, compteFilter, moyenPaiementFilter, filterTransactionsForPeriod]);

  const totals = useMemo(() => calculateTotals(filteredTransactions), [filteredTransactions]);
  
  const prevTotals = useMemo(() => {
    if (selectedMonth === null) return { revenus: 0, factures: 0, depenses: 0, epargnes: 0, solde: 0, hasData: false };
    
    let prevMonth = selectedMonth - 1;
    let prevYear = selectedYear;
    if (prevMonth < 0) { prevMonth = 11; prevYear--; }
    
    const prevFiltered = filterTransactionsForPeriod(transactions, prevMonth, prevYear);
    const prev = calculateTotals(prevFiltered);
    
    return {
      revenus: prev.revenus,
      factures: prev.factures,
      depenses: prev.depenses,
      epargnes: prev.epargnes,
      solde: prev.solde,
      hasData: prevFiltered.length > 0
    };
  }, [transactions, selectedMonth, selectedYear, filterTransactionsForPeriod]);
  
  const moyennes = useMemo(() => {
    const yearTx = transactions.filter(t => t.date && new Date(t.date).getFullYear() === selectedYear);
    const monthsWithData = new Set(yearTx.map(t => t.date?.substring(0, 7))).size || 1;
    
    const totalsYear = calculateTotals(yearTx);
    
    return {
      revenus: totalsYear.revenus / monthsWithData,
      factures: totalsYear.factures / monthsWithData,
      depenses: totalsYear.depenses / monthsWithData,
      epargnes: totalsYear.epargnes / monthsWithData,
      monthsWithData
    };
  }, [transactions, selectedYear]);
  
  const evolutionData = useMemo(() => {
    // Calculer l'évolution avec les périodes personnalisées
    const data = [];
    const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    for (let m = 0; m < 12; m++) {
      const monthTx = filterTransactionsForPeriod(transactions, m, selectedYear);
      const monthTotals = calculateTotals(monthTx);
      
      data.push({
        name: monthsShort[m],
        revenus: monthTotals.revenus,
        factures: monthTotals.factures,
        depenses: monthTotals.depenses,
        epargnes: monthTotals.epargnes,
        solde: monthTotals.solde
      });
    }
    
    return data;
  }, [transactions, selectedYear, filterTransactionsForPeriod]);

  const hasMoyennes = useMemo(() => {
    const monthsWithData = new Set<string>();
    transactions.forEach(t => {
      if (t.date) {
        const d = new Date(t.date);
        if (d.getFullYear() === selectedYear) {
          monthsWithData.add(`${d.getMonth()}`);
        }
      }
    });
    return monthsWithData.size > 1;
  }, [transactions, selectedYear]);

  const n1Data = useMemo(() => getN1Totals(transactions, selectedYear), [transactions, selectedYear]);
  const hasN1Data = n1Data.hasData;

  const variationN1Revenus = useMemo(() => {
    const currentYearTotals = calculateTotals(transactions.filter(t => t.date && new Date(t.date).getFullYear() === selectedYear));
    return calculateVariation(currentYearTotals.revenus, n1Data.revenus);
  }, [transactions, selectedYear, n1Data]);

  const variationN1Factures = useMemo(() => {
    const currentYearTotals = calculateTotals(transactions.filter(t => t.date && new Date(t.date).getFullYear() === selectedYear));
    return calculateVariation(currentYearTotals.factures, n1Data.factures);
  }, [transactions, selectedYear, n1Data]);

  const variationN1Depenses = useMemo(() => {
    const currentYearTotals = calculateTotals(transactions.filter(t => t.date && new Date(t.date).getFullYear() === selectedYear));
    return calculateVariation(currentYearTotals.depenses, n1Data.depenses);
  }, [transactions, selectedYear, n1Data]);

  const variationN1Solde = useMemo(() => {
    const currentYearTotals = calculateTotals(transactions.filter(t => t.date && new Date(t.date).getFullYear() === selectedYear));
    return calculateVariation(currentYearTotals.solde, n1Data.solde);
  }, [transactions, selectedYear, n1Data]);

  const comptes = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => {
      if (t.depuis) set.add(t.depuis);
      if (t.vers) set.add(t.vers);
    });
    return Array.from(set);
  }, [transactions]);

  const moyensPaiement = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => {
      if (t.moyenPaiement) set.add(t.moyenPaiement);
    });
    return Array.from(set);
  }, [transactions]);

  // Handlers Navigation mois
  const handlePrevMonth = useCallback(() => {
    if (selectedMonth === null) {
      setSelectedYear(prev => prev - 1);
    } else if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev !== null ? prev - 1 : null);
    }
  }, [selectedMonth]);

  const handleNextMonth = useCallback(() => {
    if (selectedMonth === null) {
      setSelectedYear(prev => prev + 1);
    } else if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev !== null ? prev + 1 : null);
    }
  }, [selectedMonth]);

  const handleSelectMonth = useCallback((index: number | null) => {
    setSelectedMonth(index);
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  // Handler Export
  const handleExport = useCallback(async () => {
    if (!statsRef.current) return;
    
    try {
      const element = statsRef.current;
      
      const style = document.createElement('style');
      style.id = 'export-fix';
      style.textContent = `
        * {
          animation: none !important;
          transition: none !important;
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(style);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const domtoimage = await import('dom-to-image-more');
      
      const dataUrl = await domtoimage.toPng(element, {
        quality: 1,
        bgcolor: isDarkMode ? '#1a1a2e' : '#faf5f5',
        style: {
          transform: 'none',
          opacity: '1'
        },
        filter: () => true
      });
      
      document.getElementById('export-fix')?.remove();
      
      const link = document.createElement('a');
      link.download = `statistiques-${selectedYear}-${selectedMonth !== null ? selectedMonth + 1 : 'annee'}.png`;
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('Erreur export:', error);
      document.getElementById('export-fix')?.remove();
      
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(statsRef.current!, {
          backgroundColor: isDarkMode ? '#1a1a2e' : '#faf5f5',
          scale: 2,
          logging: false,
          ignoreElements: (el) => el.tagName === 'svg'
        });
        
        const link = document.createElement('a');
        link.download = `statistiques-${selectedYear}-${selectedMonth !== null ? selectedMonth + 1 : 'annee'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (fallbackError) {
        alert('L\'export a échoué. Utilisez la capture d\'écran (Ctrl+Shift+S).');
      }
    }
  }, [isDarkMode, selectedYear, selectedMonth]);

  // Handler Filters
  const handleToggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const handleCompteFilterChange = useCallback((value: string) => {
    setCompteFilter(value);
  }, []);

  const handleMoyenPaiementFilterChange = useCallback((value: string) => {
    setMoyenPaiementFilter(value);
  }, []);

  const hasActiveFilters = compteFilter !== 'all' || moyenPaiementFilter !== 'all';

  // Loading state
  if (isLoading || !isPaieConfigLoaded) {
    return <StatsSkeletonLoader />;
  }

  return (
    <>
      <div className="pb-4">
        {/* Header */}
        <PageTitle page="statistiques" />

        {/* Indicateur de période personnalisée */}
        {budgetAvantPremier && configurationPaie.jourPaieDefaut !== 1 && selectedMonth !== null && (
          <div 
            className="flex items-center justify-center gap-2 mb-3 py-2 px-3 rounded-xl text-xs animate-fade-in"
            style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
          >
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="text-green-600">Période : {periodeLabel}</span>
          </div>
        )}

        {/* MonthSelector */}
        <MonthSelector
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={handleYearChange}
          onMonthChange={handleSelectMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {/* Filtres Panel */}
        <FiltersPanel
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
          compteFilter={compteFilter}
          onCompteFilterChange={handleCompteFilterChange}
          moyenPaiementFilter={moyenPaiementFilter}
          onMoyenPaiementFilterChange={handleMoyenPaiementFilterChange}
          comptes={comptes}
          moyensPaiement={moyensPaiement}
          hasActiveFilters={hasActiveFilters}
          onExport={handleExport}
        />

        {/* Onglets */}
        <TabsNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Contenu des onglets */}
        <div ref={statsRef}>
          {activeTab === 'resume' && (
            <ResumeTab
              totals={totals}
              prevTotals={prevTotals}
              moyennes={moyennes}
              hasMoyennes={hasMoyennes}
              filteredTransactions={filteredTransactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'revenus' && (
            <DetailTab
              type="Revenus"
              color={COLORS_TYPE.revenus}
              filteredTransactions={filteredTransactions}
              allTransactions={transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'factures' && (
            <DetailTab
              type="Factures"
              color={COLORS_TYPE.factures}
              filteredTransactions={filteredTransactions}
              allTransactions={transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'depenses' && (
            <DetailTab
              type="Dépenses"
              color={COLORS_TYPE.depenses}
              filteredTransactions={filteredTransactions}
              allTransactions={transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'epargnes' && (
            <DetailTab
              type="Épargnes"
              color={COLORS_TYPE.epargnes}
              filteredTransactions={filteredTransactions}
              allTransactions={transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'evolution' && (
            <EvolutionTab
              evolutionData={evolutionData}
              selectedYear={selectedYear}
              hasN1Data={hasN1Data}
              n1Revenus={n1Data.revenus}
              n1Factures={n1Data.factures}
              n1Depenses={n1Data.depenses}
              n1Solde={n1Data.solde}
              variationN1Revenus={variationN1Revenus}
              variationN1Factures={variationN1Factures}
              variationN1Depenses={variationN1Depenses}
              variationN1Solde={variationN1Solde}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'calendrier' && (
            <CalendrierTab
              filteredTransactions={filteredTransactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}

          {activeTab === 'flux' && (
            <FluxTab
              totals={totals}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}

          {activeTab === 'objectifs' && (
            <ObjectifsTab
              filteredTransactions={filteredTransactions}
              objectifsBudget={objectifsBudget}
              setObjectifsBudget={setObjectifsBudget}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}
        </div>
      </div>

      {/* Modal Plein Écran */}
      <FullscreenChartModal
        fullscreenChart={fullscreenChart}
        onClose={() => setFullscreenChart(null)}
        totals={totals}
        evolutionData={evolutionData}
      />
    </>
  );
}

export default function StatistiquesPage() {
  const router = useRouter();

  const handleNavigate = useCallback((page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  }, [router]);

  return (
    <AppShell currentPage="statistiques" onNavigate={handleNavigate}>
      <StatistiquesContent />
    </AppShell>
  );
}
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, BarChart3, Eye, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { useBudgetPeriod } from '@/hooks/useBudgetPeriod';
import { AppShell, SmartTips, PageTitle } from '@/components';
import confetti from 'canvas-confetti';

import {
  SkeletonLoader,
  EmptyState,
  MonthSelector,
  StatsCards,
  EnveloppeCard,
  EnveloppeForm,
  DeleteConfirmModal,
  Enveloppe,
  Transaction,
  ParametresData,
  EnveloppeFormData,
  defaultParametres,
  animationStyles
} from './components';

const initialFormData: EnveloppeFormData = {
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
};

function EnveloppesContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  // Hook pour la gestion des périodes de budget
  const { 
    configurationPaie, 
    isLoaded: isPaieConfigLoaded,
    getPeriodeBudget,
    filtrerTransactionsPourPeriode
  } = useBudgetPeriod();
  
  // États
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [isLoading, setIsLoading] = useState(true);
  
  // Navigation temporelle
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  // UI States
  const [viewMode, setViewMode] = useState<'normal' | 'compact'>('normal');
  const [expandedEnveloppe, setExpandedEnveloppe] = useState<number | null>(null);
  const [showTransactions, setShowTransactions] = useState<number | null>(null);
  
  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EnveloppeFormData>(initialFormData);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; enveloppe: Enveloppe | null }>({
    isOpen: false,
    enveloppe: null
  });

  // Chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedEnveloppes = localStorage.getItem('budget-enveloppes');
        if (savedEnveloppes) setEnveloppes(JSON.parse(savedEnveloppes));
        
        const savedTransactions = localStorage.getItem('budget-transactions');
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        
        const savedParametres = localStorage.getItem('budget-parametres');
        if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    loadData();
  }, []);

  // ========== Période de budget personnalisée ==========
  const periodeBudget = useMemo(() => {
    return getPeriodeBudget(selectedMonth, selectedYear);
  }, [getPeriodeBudget, selectedMonth, selectedYear]);

  const periodeLabel = useMemo(() => {
    const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    if (!parametres.budgetAvantPremier || configurationPaie.jourPaieDefaut === 1) {
      return `${moisNoms[selectedMonth]} ${selectedYear}`;
    }
    return periodeBudget.label;
  }, [parametres.budgetAvantPremier, configurationPaie.jourPaieDefaut, selectedMonth, selectedYear, periodeBudget]);

  // Helper pour filtrer les transactions selon la période
  const filterTransactionsForPeriod = useCallback((txList: Transaction[], monthKey?: string) => {
    // Si on demande un mois spécifique (pour historique), utiliser le filtrage standard
    if (monthKey) {
      return txList.filter(t => t.date?.startsWith(monthKey));
    }
    
    // Si toggle OFF ou jour de paie = 1, filtrage standard
    if (!parametres.budgetAvantPremier || configurationPaie.jourPaieDefaut === 1) {
      const mk = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
      return txList.filter(t => t.date?.startsWith(mk));
    }
    
    // Sinon, filtrage par période personnalisée
    return filtrerTransactionsPourPeriode(txList, periodeBudget);
  }, [parametres.budgetAvantPremier, configurationPaie.jourPaieDefaut, selectedYear, selectedMonth, filtrerTransactionsPourPeriode, periodeBudget]);
  // =====================================================

  // Helpers mémoïsés
  const getMonthKey = useCallback((year?: number, month?: number) => {
    const y = year ?? selectedYear;
    const m = month ?? selectedMonth;
    return `${y}-${(m + 1).toString().padStart(2, '0')}`;
  }, [selectedYear, selectedMonth]);

  const getPreviousMonthKey = useCallback(() => {
    let y = selectedYear;
    let m = selectedMonth - 1;
    if (m < 0) { m = 11; y--; }
    return getMonthKey(y, m);
  }, [selectedYear, selectedMonth, getMonthKey]);

  const getDaysInMonth = useCallback((year: number, month: number) => 
    new Date(year, month + 1, 0).getDate(), []);

  const getCurrentDay = useCallback(() => new Date().getDate(), []);

  // Calculs pour une enveloppe - avec support période personnalisée
  const getDepensesEnveloppe = useCallback((enveloppe: Enveloppe, monthKey?: string) => {
    // Si monthKey fourni, filtrage standard (pour historique)
    if (monthKey) {
      return transactions
        .filter(t => t.type === 'Dépenses' && t.date?.startsWith(monthKey) && enveloppe.categories.includes(t.categorie))
        .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    }
    
    // Sinon, utiliser le filtrage selon la période (standard ou personnalisée)
    const filteredTx = filterTransactionsForPeriod(transactions);
    return filteredTx
      .filter(t => t.type === 'Dépenses' && enveloppe.categories.includes(t.categorie))
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  }, [transactions, filterTransactionsForPeriod]);

  const getTransactionsEnveloppe = useCallback((enveloppe: Enveloppe) => {
    const filteredTx = filterTransactionsForPeriod(transactions);
    return filteredTx
      .filter(t => t.type === 'Dépenses' && enveloppe.categories.includes(t.categorie))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterTransactionsForPeriod]);

  const getBudgetEnveloppe = useCallback((enveloppe: Enveloppe, monthKey?: string) => {
    const mk = monthKey || getMonthKey();
    if (enveloppe.budgetVariable && enveloppe.budgetVariable[mk]) return enveloppe.budgetVariable[mk];
    return enveloppe.budget;
  }, [getMonthKey]);

  const getResteEnveloppeMoisPrecedent = useCallback((enveloppe: Enveloppe) => {
    const prevKey = getPreviousMonthKey();
    const budgetPrec = getBudgetEnveloppe(enveloppe, prevKey);
    const depensePrec = getDepensesEnveloppe(enveloppe, prevKey);
    return Math.max(0, budgetPrec - depensePrec);
  }, [getPreviousMonthKey, getBudgetEnveloppe, getDepensesEnveloppe]);

  const getBudgetEffectif = useCallback((enveloppe: Enveloppe) => {
    let budget = getBudgetEnveloppe(enveloppe);
    if (enveloppe.reportReste) budget += getResteEnveloppeMoisPrecedent(enveloppe);
    return budget;
  }, [getBudgetEnveloppe, getResteEnveloppeMoisPrecedent]);

  const getMoyenne3Mois = useCallback((enveloppe: Enveloppe) => {
    const mois: number[] = [];
    for (let i = 1; i <= 3; i++) {
      let y = selectedYear;
      let m = selectedMonth - i;
      while (m < 0) { m += 12; y--; }
      mois.push(getDepensesEnveloppe(enveloppe, getMonthKey(y, m)));
    }
    return mois.reduce((a, b) => a + b, 0) / 3;
  }, [selectedYear, selectedMonth, getDepensesEnveloppe, getMonthKey]);

  const getProjectionFinMois = useCallback((enveloppe: Enveloppe) => {
    const depenseActuelle = getDepensesEnveloppe(enveloppe);
    const jourActuel = getCurrentDay();
    const joursTotal = getDaysInMonth(selectedYear, selectedMonth);
    if (jourActuel === 0) return 0;
    return (depenseActuelle / jourActuel) * joursTotal;
  }, [getDepensesEnveloppe, getCurrentDay, getDaysInMonth, selectedYear, selectedMonth]);

  const getHistorique6Mois = useCallback((enveloppe: Enveloppe) => {
    const historique: { mois: string; depense: number; budget: number }[] = [];
    const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    for (let i = 5; i >= 0; i--) {
      let y = selectedYear;
      let m = selectedMonth - i;
      while (m < 0) { m += 12; y--; }
      const mk = getMonthKey(y, m);
      historique.push({
        mois: monthsShort[m],
        depense: getDepensesEnveloppe(enveloppe, mk),
        budget: getBudgetEnveloppe(enveloppe, mk)
      });
    }
    return historique;
  }, [selectedYear, selectedMonth, getMonthKey, getDepensesEnveloppe, getBudgetEnveloppe]);

  // Totaux mémoïsés
  const totals = useMemo(() => {
    const totalBudget = enveloppes.reduce((sum, e) => sum + getBudgetEffectif(e), 0);
    const totalDepense = enveloppes.reduce((sum, e) => sum + getDepensesEnveloppe(e), 0);
    const totalReste = totalBudget - totalDepense;
    return { totalBudget, totalDepense, totalReste };
  }, [enveloppes, getBudgetEffectif, getDepensesEnveloppe]);

  // Enveloppes triées
  const sortedEnveloppes = useMemo(() => {
    return [...enveloppes].sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });
  }, [enveloppes]);

  // Confetti
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#4ade80', '#86efac', theme.colors.primary, '#fbbf24']
    });
  }, [theme.colors.primary]);

  // Sauvegarde
  const saveEnveloppes = useCallback((newEnveloppes: Enveloppe[]) => {
    setEnveloppes(newEnveloppes);
    localStorage.setItem('budget-enveloppes', JSON.stringify(newEnveloppes));
  }, []);

  const saveParametres = useCallback((newParametres: ParametresData) => {
    setParametres(newParametres);
    localStorage.setItem('budget-parametres', JSON.stringify(newParametres));
  }, []);

  // Handlers Navigation
  const handlePrevMonth = useCallback(() => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  }, [selectedMonth]);

  const handleNextMonth = useCallback(() => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  }, [selectedMonth]);

  // Handlers Form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setShowAddCategory(false);
    setNewCategoryName('');
  }, []);

  const handleAddCategory = useCallback(() => {
    if (!newCategoryName.trim()) return;
    const newCat = newCategoryName.trim();
    if (!parametres.categoriesDepenses.includes(newCat)) {
      saveParametres({ ...parametres, categoriesDepenses: [...parametres.categoriesDepenses, newCat] });
    }
    setFormData(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
    setNewCategoryName('');
    setShowAddCategory(false);
  }, [newCategoryName, parametres, saveParametres]);

  const handleSubmit = useCallback(() => {
    if (!formData.nom || !formData.budget) return;
    
    const enveloppeData: Enveloppe = {
      id: editingId || Date.now(),
      nom: formData.nom,
      budget: parseFloat(formData.budget),
      couleur: formData.couleur,
      icone: formData.icone,
      categories: formData.categories,
      favorite: formData.favorite,
      locked: formData.locked,
      reportReste: formData.reportReste,
      budgetVariable: formData.budgetVariable 
        ? Object.fromEntries(
            Object.entries(formData.budgetsMensuels)
              .filter(([, v]) => v !== '')
              .map(([k, v]) => [k, parseFloat(v)])
          ) 
        : undefined
    };

    if (editingId !== null) {
      saveEnveloppes(enveloppes.map(e => e.id === editingId ? enveloppeData : e));
      setEditingId(null);
    } else {
      saveEnveloppes([...enveloppes, enveloppeData]);
      triggerConfetti();
    }
    
    resetForm();
    setShowForm(false);
  }, [formData, editingId, enveloppes, saveEnveloppes, resetForm, triggerConfetti]);

  const handleEdit = useCallback((enveloppe: Enveloppe) => {
    setFormData({
      nom: enveloppe.nom,
      budget: enveloppe.budget.toString(),
      couleur: enveloppe.couleur,
      icone: enveloppe.icone,
      categories: enveloppe.categories,
      favorite: enveloppe.favorite || false,
      locked: enveloppe.locked || false,
      reportReste: enveloppe.reportReste || false,
      budgetVariable: !!enveloppe.budgetVariable,
      budgetsMensuels: enveloppe.budgetVariable 
        ? Object.fromEntries(Object.entries(enveloppe.budgetVariable).map(([k, v]) => [k, v.toString()])) 
        : {}
    });
    setEditingId(enveloppe.id);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((enveloppe: Enveloppe) => {
    setDeleteModal({ isOpen: true, enveloppe });
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteModal.enveloppe) {
      saveEnveloppes(enveloppes.filter(e => e.id !== deleteModal.enveloppe!.id));
    }
    setDeleteModal({ isOpen: false, enveloppe: null });
  }, [deleteModal.enveloppe, enveloppes, saveEnveloppes]);

  const toggleFavorite = useCallback((id: number) => {
    saveEnveloppes(enveloppes.map(e => e.id === id ? { ...e, favorite: !e.favorite } : e));
  }, [enveloppes, saveEnveloppes]);

  const toggleLocked = useCallback((id: number) => {
    saveEnveloppes(enveloppes.map(e => e.id === id ? { ...e, locked: !e.locked } : e));
  }, [enveloppes, saveEnveloppes]);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  }, [resetForm]);

  // Loading
  if (isLoading || !isPaieConfigLoaded) {
    return (
      <div className="pb-4">
        <style>{animationStyles}</style>
        <PageTitle page="enveloppes" />
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      
      <div className="pb-4">
        <PageTitle page="enveloppes" />

        {/* Indicateur de période personnalisée */}
        {parametres.budgetAvantPremier && configurationPaie.jourPaieDefaut !== 1 && (
          <div 
            className="flex items-center justify-center gap-2 mb-3 py-2 px-3 rounded-xl text-xs animate-fade-in"
            style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
          >
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="text-green-600">Période : {periodeLabel}</span>
          </div>
        )}

        {/* Month Selector */}
        <MonthSelector
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {/* Stats Cards */}
        <StatsCards
          totalBudget={totals.totalBudget}
          totalDepense={totals.totalDepense}
          totalReste={totals.totalReste}
          devise={parametres.devise}
        />

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4 animate-fade-in-up stagger-5">
          <button 
            onClick={() => { resetForm(); setShowForm(true); }} 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{ 
              background: theme.colors.primary, 
              color: theme.colors.textOnPrimary,
              boxShadow: `0 4px 15px ${theme.colors.primary}40`
            }}
          >
            <Plus className="w-4 h-4" />
            Nouvelle enveloppe
          </button>
          <button 
            onClick={() => setViewMode(viewMode === 'normal' ? 'compact' : 'normal')} 
            className="px-3 py-3 rounded-xl border flex items-center gap-1 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}
          >
            {viewMode === 'normal' 
              ? <><BarChart3 className="w-4 h-4" /> Compacte</> 
              : <><Eye className="w-4 h-4" /> Détaillée</>
            }
          </button>
        </div>

        {/* Enveloppes List */}
        {sortedEnveloppes.length > 0 ? (
          <div className="space-y-3 mb-4">
            {sortedEnveloppes.map((enveloppe, index) => {
              const budgetEffectif = getBudgetEffectif(enveloppe);
              const depense = getDepensesEnveloppe(enveloppe);
              const reste = budgetEffectif - depense;
              const pourcentage = budgetEffectif > 0 ? (depense / budgetEffectif) * 100 : 0;
              const reportMoisPrec = enveloppe.reportReste ? getResteEnveloppeMoisPrecedent(enveloppe) : 0;

              return (
                <EnveloppeCard
                  key={enveloppe.id}
                  enveloppe={enveloppe}
                  budgetEffectif={budgetEffectif}
                  depense={depense}
                  reste={reste}
                  pourcentage={pourcentage}
                  reportMoisPrec={reportMoisPrec}
                  moyenne3Mois={getMoyenne3Mois(enveloppe)}
                  projection={getProjectionFinMois(enveloppe)}
                  historique={getHistorique6Mois(enveloppe)}
                  transactionsLiees={getTransactionsEnveloppe(enveloppe)}
                  devise={parametres.devise}
                  isExpanded={expandedEnveloppe === enveloppe.id}
                  showTransactions={showTransactions === enveloppe.id}
                  onToggleExpand={() => setExpandedEnveloppe(expandedEnveloppe === enveloppe.id ? null : enveloppe.id)}
                  onToggleTransactions={() => setShowTransactions(showTransactions === enveloppe.id ? null : enveloppe.id)}
                  onToggleFavorite={() => toggleFavorite(enveloppe.id)}
                  onToggleLocked={() => toggleLocked(enveloppe.id)}
                  onEdit={() => handleEdit(enveloppe)}
                  onDelete={() => handleDelete(enveloppe)}
                  index={index}
                  viewMode={viewMode}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState />
        )}

        {/* SmartTips */}
        <SmartTips page="enveloppes" />
      </div>

      {/* Form Modal */}
      <EnveloppeForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSubmit={handleSubmit}
        formData={formData}
        onFormChange={setFormData}
        isEditing={!!editingId}
        parametres={parametres}
        selectedYear={selectedYear}
        showAddCategory={showAddCategory}
        setShowAddCategory={setShowAddCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        onAddCategory={handleAddCategory}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, enveloppe: null })}
        onConfirm={confirmDelete}
        enveloppeName={deleteModal.enveloppe?.nom || ''}
      />
    </>
  );
}

export default function EnveloppesPage() {
  const router = useRouter();

  const handleNavigate = useCallback((page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  }, [router]);

  return (
    <AppShell currentPage="enveloppes" onNavigate={handleNavigate}>
      <EnveloppesContent />
    </AppShell>
  );
}
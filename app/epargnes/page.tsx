'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useBudgetPeriod } from '@/hooks/useBudgetPeriod';
import { AppShell, SmartTips, PageTitle } from '@/components';
import MonthSelector from './components/MonthSelector';
import TabsNavigation from './components/TabsNavigation';
import ResumeTab from './components/ResumeTab';
import MensuelTab from './components/MensuelTab';
import AnalyseTab from './components/AnalyseTab';
import HistoriqueTab from './components/HistoriqueTab';
import SkeletonLoader from './components/SkeletonLoader';
import EpargneForm from './components/EpargneForm';

// Types définis localement
interface Transaction {
  id?: number;
  type: string;
  categorie: string;
  montant: string;
  date: string;
  compte?: string;
  compteVers?: string;
  moyenPaiement?: string;
  notes?: string;
}

interface ParametresData {
  devise: string;
  comptesBancaires: { id: number; nom: string; soldeDepart: number; isEpargne: boolean }[];
  budgetAvantPremier?: boolean;
}

type TabType = 'resume' | 'mensuel' | 'analyse' | 'historique';

const defaultParametres: ParametresData = {
  devise: '€',
  comptesBancaires: [],
  budgetAvantPremier: false
};

function EpargnesContent() {
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // Chargement des données
  const loadData = useCallback(() => {
    try {
      const savedTransactions = localStorage.getItem('budget-transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
      
      const savedParametres = localStorage.getItem('budget-parametres');
      if (savedParametres) {
        setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  // Helper pour obtenir la clé du mois
  const getMonthKey = useCallback(() => {
    return `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
  }, [selectedYear, selectedMonth]);

  // Transactions filtrées selon la période
  const filteredTransactions = useMemo(() => {
    // Filtrer uniquement les épargnes
    const epargneTransactions = transactions.filter(t => t.type === 'Épargnes');
    
    // Si toggle OFF ou jour de paie = 1, filtrage standard
    if (!parametres.budgetAvantPremier || configurationPaie.jourPaieDefaut === 1) {
      return epargneTransactions.filter(t => t.date?.startsWith(getMonthKey()));
    }
    
    // Sinon, filtrage par période personnalisée
    return filtrerTransactionsPourPeriode(epargneTransactions, periodeBudget);
  }, [transactions, getMonthKey, parametres.budgetAvantPremier, configurationPaie.jourPaieDefaut, filtrerTransactionsPourPeriode, periodeBudget]);
  // =====================================================

  // Handlers mémorisés
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const handleMonthChange = useCallback((month: number) => {
    setSelectedMonth(month);
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const handleAddClick = useCallback(() => {
    setEditingTransaction(null);
    setShowForm(true);
  }, []);

  const handleEditClick = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  }, []);

  const handleDeleteClick = useCallback((transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (transactionToDelete) {
      const savedTransactions = localStorage.getItem('budget-transactions');
      let allTransactions: Transaction[] = savedTransactions ? JSON.parse(savedTransactions) : [];
      allTransactions = allTransactions.filter(t => t.id !== transactionToDelete.id);
      localStorage.setItem('budget-transactions', JSON.stringify(allTransactions));
      setTransactions(allTransactions);
      setShowDeleteConfirm(false);
      setTransactionToDelete(null);
    }
  }, [transactionToDelete]);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setEditingTransaction(null);
  }, []);

  const handleFormSuccess = useCallback(() => {
    loadData();
  }, [loadData]);

  // Rendu conditionnel basé sur l'onglet actif
  const renderTabContent = useCallback(() => {
    if (isLoading || !isPaieConfigLoaded) {
      return <SkeletonLoader />;
    }

    switch (activeTab) {
      case 'resume':
        return (
          <ResumeTab 
            transactions={filteredTransactions}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            devise={parametres.devise}
            onAddClick={handleAddClick}
          />
        );
      case 'mensuel':
        return (
          <MensuelTab 
            transactions={filteredTransactions}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            devise={parametres.devise}
            onAddClick={handleAddClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        );
      case 'analyse':
        return (
          <AnalyseTab 
            transactions={transactions.filter(t => t.type === 'Épargnes')}
            selectedYear={selectedYear}
            devise={parametres.devise}
          />
        );
      case 'historique':
        return (
          <HistoriqueTab 
            transactions={transactions.filter(t => t.type === 'Épargnes')}
            selectedYear={selectedYear}
            devise={parametres.devise}
          />
        );
      default:
        return null;
    }
  }, [activeTab, isLoading, isPaieConfigLoaded, filteredTransactions, transactions, selectedYear, selectedMonth, parametres.devise, handleAddClick, handleEditClick, handleDeleteClick]);

  return (
    <div className="pb-4">
      {/* Header avec icône */}
      <PageTitle page="epargnes" />

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

      {/* Sélecteur de mois */}
      <MonthSelector 
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
      />

      {/* Navigation par onglets */}
      <TabsNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Contenu de l'onglet actif */}
      <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        {renderTabContent()}
      </div>

      {/* SmartTips en bas */}
      <div className="mt-6">
        <SmartTips page="epargnes" />
      </div>

      {/* Modal d'ajout/édition */}
      <EpargneForm 
        isOpen={showForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editingTransaction={editingTransaction}
      />

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && transactionToDelete && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-4 border my-20"
            style={{ 
              backgroundColor: theme.colors.secondaryLight,
              borderColor: `${theme.colors.primary}40`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(239, 68, 68, 0.15)' }}
              >
                <span className="text-3xl">🗑️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: theme.colors.primary }}>
                Supprimer cette épargne ?
              </h3>
              <p className="text-sm" style={{ color: `${theme.colors.primary}80` }}>
                {transactionToDelete.type === 'Épargnes' ? '+' : '-'}
                {parseFloat(transactionToDelete.montant).toFixed(2)} {parametres.devise} - {transactionToDelete.categorie}
              </p>
              <p className="text-xs mt-1" style={{ color: `${theme.colors.primary}60` }}>
                Cette action est irréversible.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl font-medium border transition-all duration-200 hover:scale-[1.02]"
                style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02]"
                style={{ background: '#ef4444', color: '#ffffff' }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EpargnesPage() {
  const router = useRouter();

  const handleNavigate = useCallback((page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  }, [router]);

  return (
    <AppShell currentPage="epargnes" onNavigate={handleNavigate}>
      <EpargnesContent />
    </AppShell>
  );
}
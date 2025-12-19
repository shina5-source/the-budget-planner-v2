"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RecurringTransactions from '@/components/RecurringTransactions';
import { processRecurringTransactions } from '@/lib/recurring-transactions';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';
import { Confetti } from '@/components/ui';
import {
  PageHeader,
  MonthSelector,
  SummaryCards,
  SearchFilters,
  ActionButtons,
  TransactionList,
  TransactionForm
} from './components';

// Types
interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  depuis?: string;
  vers?: string;
  moyenPaiement?: string;
  memo?: string;
  isCredit?: boolean;
  capitalTotal?: string;
  tauxInteret?: string;
  dureeMois?: string;
  dateDebut?: string;
}

interface ParametresData {
  devise: string;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  categoriesEpargnes: string[];
  comptesBancaires: { id: number; nom: string }[];
  moyensPaiement?: string[];
}

// Constantes
const defaultMoyensPaiement = ['Prélèvement', 'Paiement CB', 'Virement', 'Chèque', 'Espèces', 'Paiement en ligne', 'Paiement mobile'];

const defaultParametres: ParametresData = {
  devise: '€',
  categoriesRevenus: ['Salaire', 'Revenus Secondaires', 'Allocations', 'Aides', 'Remboursement', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Assurances', 'Internet', 'Mobile', 'Abonnements', 'Crédits', 'Impôts'],
  categoriesDepenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Loisirs', 'Santé', 'Cadeaux', 'Autres'],
  categoriesEpargnes: ['Livret A', 'Épargne', 'Tirelire', 'Vacances', 'Projets'],
  comptesBancaires: [{ id: 1, nom: 'Compte Principal' }, { id: 2, nom: 'Livret A' }],
  moyensPaiement: defaultMoyensPaiement
};

const types = ['Revenus', 'Factures', 'Dépenses', 'Épargnes', 'Reprise d\'épargne', 'Remboursement', 'Transfert de fond'];
const ITEMS_PER_PAGE = 50;

function TransactionsContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showRecurring, setShowRecurring] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  
  // 🎉 State pour les confettis
  const [showConfetti, setShowConfetti] = useState(false);

  // Date state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('');
  const [filterDepuis, setFilterDepuis] = useState('');
  const [filterVers, setFilterVers] = useState('');
  const [filterMoyenPaiement, setFilterMoyenPaiement] = useState('');

  // Helpers
  const getMoyensPaiement = useCallback(() => parametres.moyensPaiement || defaultMoyensPaiement, [parametres.moyensPaiement]);
  
  const getComptesOptions = useCallback(() => ['Externe', ...parametres.comptesBancaires.map(c => c.nom)], [parametres.comptesBancaires]);
  
  const getCategoriesForType = useCallback((type: string) => {
    switch (type) {
      case 'Revenus': return parametres.categoriesRevenus;
      case 'Factures': return parametres.categoriesFactures;
      case 'Dépenses': return parametres.categoriesDepenses;
      default: return parametres.categoriesEpargnes;
    }
  }, [parametres]);

  const getTypeLabelForCategory = useCallback((type: string) => {
    switch (type) {
      case 'Revenus': return 'revenus';
      case 'Factures': return 'factures';
      case 'Dépenses': return 'dépenses';
      default: return 'épargnes';
    }
  }, []);

  const getAllCategories = useCallback(() => [
    ...new Set([
      ...parametres.categoriesRevenus, 
      ...parametres.categoriesFactures, 
      ...parametres.categoriesDepenses, 
      ...parametres.categoriesEpargnes
    ])
  ], [parametres]);

  // Load data
  const loadTransactions = useCallback(() => {
    const saved = localStorage.getItem('budget-transactions');
    if (saved) setTransactions(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  const loadParametres = useCallback(() => {
    const saved = localStorage.getItem('budget-parametres');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.moyensPaiement) parsed.moyensPaiement = defaultMoyensPaiement;
      setParametres({ ...defaultParametres, ...parsed });
    }
  }, []);

  useEffect(() => {
    loadTransactions();
    loadParametres();
    const created = processRecurringTransactions();
    if (created.length > 0) loadTransactions();
  }, [loadTransactions, loadParametres]);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [selectedMonth, selectedYear, searchQuery, filterType, filterCategorie, filterDepuis, filterVers, filterMoyenPaiement]);

  // Save functions
  const saveTransactions = useCallback((t: Transaction[]) => {
    setTransactions(t);
    localStorage.setItem('budget-transactions', JSON.stringify(t));
  }, []);

  const saveParametres = useCallback((p: ParametresData) => {
    setParametres(p);
    localStorage.setItem('budget-parametres', JSON.stringify(p));
  }, []);

  // Filtered transactions with memoization
  const filteredTransactions = useMemo(() => {
    const getMonthKey = () => selectedMonth === null 
      ? null 
      : `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
    
    const mk = getMonthKey();
    
    return transactions.filter(t => {
      if (mk && !t.date?.startsWith(mk)) return false;
      if (selectedMonth === null && !t.date?.startsWith(`${selectedYear}`)) return false;
      if (searchQuery && !t.categorie?.toLowerCase().includes(searchQuery.toLowerCase()) && !t.memo?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterType && t.type !== filterType) return false;
      if (filterCategorie && t.categorie !== filterCategorie) return false;
      if (filterDepuis && t.depuis !== filterDepuis) return false;
      if (filterVers && t.vers !== filterVers) return false;
      if (filterMoyenPaiement && t.moyenPaiement !== filterMoyenPaiement) return false;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedMonth, selectedYear, searchQuery, filterType, filterCategorie, filterDepuis, filterVers, filterMoyenPaiement]);

  // Displayed transactions
  const displayedTransactions = useMemo(() => filteredTransactions.slice(0, displayCount), [filteredTransactions, displayCount]);
  const hasMore = displayCount < filteredTransactions.length;
  const remainingCount = filteredTransactions.length - displayCount;

  // Totals with memoization
  const totals = useMemo(() => {
    const revenus = filteredTransactions
      .filter(t => t.type === 'Revenus')
      .reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
    
    const depenses = filteredTransactions
      .filter(t => ['Factures', 'Dépenses'].includes(t.type))
      .reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
    
    const epargnes = filteredTransactions
      .filter(t => t.type === 'Épargnes')
      .reduce((s, t) => s + parseFloat(t.montant || '0'), 0);

    return {
      revenus,
      depenses,
      epargnes,
      solde: revenus - depenses - epargnes
    };
  }, [filteredTransactions]);

  // Handlers
  const handleAddCategory = useCallback((name: string, type: string) => {
    const p = { ...parametres };
    switch (type) {
      case 'Revenus':
        if (!p.categoriesRevenus.includes(name)) p.categoriesRevenus = [...p.categoriesRevenus, name];
        break;
      case 'Factures':
        if (!p.categoriesFactures.includes(name)) p.categoriesFactures = [...p.categoriesFactures, name];
        break;
      case 'Dépenses':
        if (!p.categoriesDepenses.includes(name)) p.categoriesDepenses = [...p.categoriesDepenses, name];
        break;
      default:
        if (!p.categoriesEpargnes.includes(name)) p.categoriesEpargnes = [...p.categoriesEpargnes, name];
    }
    saveParametres(p);
  }, [parametres, saveParametres]);

  const handleAddCompte = useCallback((name: string) => {
    if (parametres.comptesBancaires.some(c => c.nom === name)) return;
    const maxId = parametres.comptesBancaires.reduce((m, c) => Math.max(m, c.id), 0);
    saveParametres({
      ...parametres,
      comptesBancaires: [...parametres.comptesBancaires, { id: maxId + 1, nom: name }]
    });
  }, [parametres, saveParametres]);

  const handleAddMoyenPaiement = useCallback((name: string) => {
    const moyens = getMoyensPaiement();
    if (!moyens.includes(name)) {
      saveParametres({ ...parametres, moyensPaiement: [...moyens, name] });
    }
  }, [parametres, getMoyensPaiement, saveParametres]);

  const handleSubmitTransaction = useCallback((formData: {
    date: string;
    montant: string;
    type: string;
    categorie: string;
    depuis: string;
    vers: string;
    moyenPaiement: string;
    memo: string;
    isCredit: boolean;
    capitalTotal: string;
    tauxInteret: string;
    dureeMois: string;
    dateDebut: string;
  }) => {
    if (editingTransaction) {
      // Modification - pas de confettis
      saveTransactions(transactions.map(t => 
        t.id === editingTransaction.id ? { ...formData, id: editingTransaction.id } : t
      ));
    } else {
      // 🎉 Nouvelle transaction - afficher les confettis !
      saveTransactions([...transactions, { ...formData, id: Date.now() }]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setEditingTransaction(null);
    setShowForm(false);
  }, [editingTransaction, transactions, saveTransactions]);

  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id: number) => {
    if (confirm('Supprimer cette transaction ?')) {
      saveTransactions(transactions.filter(t => t.id !== id));
    }
  }, [transactions, saveTransactions]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilterType('');
    setFilterCategorie('');
    setFilterDepuis('');
    setFilterVers('');
    setFilterMoyenPaiement('');
  }, []);

  const handleOpenForm = useCallback(() => {
    setEditingTransaction(null);
    setShowForm(true);
  }, []);

  return (
    <>
      {/* 🎉 Confettis lors de l'ajout d'une transaction */}
      <Confetti trigger={showConfetti} />
      
      <div className="pb-4">
        {/* Header */}
        <PageHeader transactionCount={filteredTransactions.length} />

        {/* Month Selector */}
        <MonthSelector
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
        />

        {/* Summary Cards */}
        <SummaryCards
          totalRevenus={totals.revenus}
          totalDepenses={totals.depenses}
          solde={totals.solde}
          devise={parametres.devise}
        />

        {/* Search & Filters */}
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          filterCategorie={filterCategorie}
          onFilterCategorieChange={setFilterCategorie}
          filterDepuis={filterDepuis}
          onFilterDepuisChange={setFilterDepuis}
          filterVers={filterVers}
          onFilterVersChange={setFilterVers}
          filterMoyenPaiement={filterMoyenPaiement}
          onFilterMoyenPaiementChange={setFilterMoyenPaiement}
          types={types}
          categories={filterType ? getCategoriesForType(filterType) : getAllCategories()}
          comptes={getComptesOptions()}
          moyensPaiement={getMoyensPaiement()}
          onClearFilters={clearFilters}
        />

        {/* Action Buttons */}
        <ActionButtons
          onNewTransaction={handleOpenForm}
          onOpenRecurring={() => setShowRecurring(true)}
        />

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          displayedTransactions={displayedTransactions}
          devise={parametres.devise}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onLoadMore={() => setDisplayCount(p => p + ITEMS_PER_PAGE)}
          hasMore={hasMore}
          remainingCount={remainingCount}
          isLoading={isLoading}
          onAddNew={handleOpenForm}
        />

        {/* SmartTips */}
        <SmartTips page="transactions" />
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingTransaction(null); }}
        onSubmit={handleSubmitTransaction}
        editingTransaction={editingTransaction}
        types={types}
        getCategoriesForType={getCategoriesForType}
        getTypeLabelForCategory={getTypeLabelForCategory}
        comptes={getComptesOptions()}
        moyensPaiement={getMoyensPaiement()}
        devise={parametres.devise}
        onAddCategory={handleAddCategory}
        onAddCompte={handleAddCompte}
        onAddMoyenPaiement={handleAddMoyenPaiement}
      />

      {/* Recurring Transactions Modal */}
      <RecurringTransactions
        isOpen={showRecurring}
        onClose={() => setShowRecurring(false)}
        categoriesRevenus={parametres.categoriesRevenus}
        categoriesFactures={parametres.categoriesFactures}
        categoriesDepenses={parametres.categoriesDepenses}
        categoriesEpargnes={parametres.categoriesEpargnes}
        comptes={parametres.comptesBancaires}
        moyensPaiement={getMoyensPaiement()}
        onTransactionCreated={() => { loadTransactions(); loadParametres(); }}
      />
    </>
  );
}

export default function TransactionsPage() {
  const router = useRouter();
  
  const handleNavigate = (page: string) => {
    if (page === 'accueil') router.push('/');
    else router.push(`/${page}`);
  };

  return (
    <AppShell currentPage="transactions" onNavigate={handleNavigate}>
      <TransactionsContent />
    </AppShell>
  );
}

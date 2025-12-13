"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, X, Check, ChevronDown, ChevronUp, Trash2, Edit3, Lightbulb, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RecurringTransactions from '@/components/RecurringTransactions';
import { processRecurringTransactions } from '@/lib/recurring-transactions';
import { useTheme } from '@/contexts/theme-context';
import { AppShell } from '@/components';

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
}

const defaultParametres: ParametresData = {
  devise: '€',
  categoriesRevenus: ['Salaire', 'Revenus Secondaires', 'Allocations', 'Aides', 'Remboursement', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Assurances', 'Internet', 'Mobile', 'Abonnements', 'Crédits', 'Impôts'],
  categoriesDepenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Loisirs', 'Santé', 'Cadeaux', 'Autres'],
  categoriesEpargnes: ['Livret A', 'Épargne', 'Tirelire', 'Vacances', 'Projets'],
  comptesBancaires: [
    { id: 1, nom: 'Compte Principal' },
    { id: 2, nom: 'Livret A' },
  ]
};

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

const types = ['Revenus', 'Factures', 'Dépenses', 'Épargnes', 'Reprise d\'épargne', 'Remboursement', 'Transfert de fond'];

const moyensPaiement = ['Prélèvement', 'Paiement CB', 'Virement', 'Chèque', 'Espèces', 'Paiement en ligne', 'Paiement mobile'];

const ITEMS_PER_PAGE = 50;

function TransactionsContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [showRecurring, setShowRecurring] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('');
  const [filterDepuis, setFilterDepuis] = useState('');
  const [filterVers, setFilterVers] = useState('');
  const [filterMoyenPaiement, setFilterMoyenPaiement] = useState('');

  // États pour l'ajout de catégorie/compte
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCompteDepuis, setShowAddCompteDepuis] = useState(false);
  const [showAddCompteVers, setShowAddCompteVers] = useState(false);
  const [newCompteName, setNewCompteName] = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    montant: '',
    type: 'Dépenses',
    categorie: '',
    depuis: '',
    vers: '',
    moyenPaiement: '',
    memo: '',
    isCredit: false,
    capitalTotal: '',
    tauxInteret: '',
    dureeMois: '',
    dateDebut: ''
  });

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };
  
  const modalInputStyle = { 
    background: theme.colors.secondaryLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textOnSecondary 
  };

  const loadTransactions = () => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  };

  const loadParametres = () => {
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
  };

  useEffect(() => {
    loadTransactions();
    loadParametres();
    const created = processRecurringTransactions();
    if (created.length > 0) loadTransactions();
  }, []);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [selectedMonth, selectedYear, searchQuery, filterType, filterCategorie, filterDepuis, filterVers, filterMoyenPaiement]);

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem('budget-transactions', JSON.stringify(newTransactions));
  };

  const saveParametres = (newParametres: ParametresData) => {
    setParametres(newParametres);
    localStorage.setItem('budget-parametres', JSON.stringify(newParametres));
  };

  const getCategoriesForType = (type: string) => {
    switch (type) {
      case 'Revenus': return parametres.categoriesRevenus;
      case 'Factures': return parametres.categoriesFactures;
      case 'Dépenses': return parametres.categoriesDepenses;
      case 'Épargnes':
      case 'Reprise d\'épargne':
      case 'Remboursement':
      case 'Transfert de fond':
        return parametres.categoriesEpargnes;
      default: return [];
    }
  };

  const getTypeLabelForCategory = (type: string) => {
    switch (type) {
      case 'Revenus': return 'revenus';
      case 'Factures': return 'factures';
      case 'Dépenses': return 'dépenses';
      default: return 'épargnes';
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat = newCategoryName.trim();
    const newParametres = { ...parametres };
    
    switch (formData.type) {
      case 'Revenus':
        if (!parametres.categoriesRevenus.includes(newCat)) {
          newParametres.categoriesRevenus = [...parametres.categoriesRevenus, newCat];
        }
        break;
      case 'Factures':
        if (!parametres.categoriesFactures.includes(newCat)) {
          newParametres.categoriesFactures = [...parametres.categoriesFactures, newCat];
        }
        break;
      case 'Dépenses':
        if (!parametres.categoriesDepenses.includes(newCat)) {
          newParametres.categoriesDepenses = [...parametres.categoriesDepenses, newCat];
        }
        break;
      default:
        if (!parametres.categoriesEpargnes.includes(newCat)) {
          newParametres.categoriesEpargnes = [...parametres.categoriesEpargnes, newCat];
        }
        break;
    }
    
    saveParametres(newParametres);
    setFormData({ ...formData, categorie: newCat });
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleAddCompte = (field: 'depuis' | 'vers') => {
    if (!newCompteName.trim()) return;
    const newCompte = newCompteName.trim();
    
    if (parametres.comptesBancaires.some(c => c.nom === newCompte)) {
      setFormData({ ...formData, [field]: newCompte });
      setNewCompteName('');
      setShowAddCompteDepuis(false);
      setShowAddCompteVers(false);
      return;
    }
    
    const maxId = parametres.comptesBancaires.reduce((max, c) => Math.max(max, c.id), 0);
    const nouveauCompte = { id: maxId + 1, nom: newCompte };
    
    const newParametres = {
      ...parametres,
      comptesBancaires: [...parametres.comptesBancaires, nouveauCompte]
    };
    
    saveParametres(newParametres);
    setFormData({ ...formData, [field]: newCompte });
    setNewCompteName('');
    setShowAddCompteDepuis(false);
    setShowAddCompteVers(false);
  };

  const getAllCategories = () => {
    const all = [...parametres.categoriesRevenus, ...parametres.categoriesFactures, ...parametres.categoriesDepenses, ...parametres.categoriesEpargnes];
    return [...new Set(all)];
  };

  const getMonthKey = () => {
    if (selectedMonth === null) return null;
    return `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
  };

  const getComptesOptions = () => {
    const comptes = parametres.comptesBancaires.map(c => c.nom);
    return ['Externe', ...comptes];
  };

  const filteredTransactions = transactions.filter(t => {
    const monthKey = getMonthKey();
    if (monthKey && !t.date?.startsWith(monthKey)) return false;
    if (selectedMonth === null && !t.date?.startsWith(`${selectedYear}`)) return false;
    if (searchQuery && !t.categorie?.toLowerCase().includes(searchQuery.toLowerCase()) && !t.memo?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType && t.type !== filterType) return false;
    if (filterCategorie && t.categorie !== filterCategorie) return false;
    if (filterDepuis && t.depuis !== filterDepuis) return false;
    if (filterVers && t.vers !== filterVers) return false;
    if (filterMoyenPaiement && t.moyenPaiement !== filterMoyenPaiement) return false;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayedTransactions = filteredTransactions.slice(0, displayCount);
  const hasMore = displayCount < filteredTransactions.length;
  const remainingCount = filteredTransactions.length - displayCount;

  const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalDepenses = filteredTransactions.filter(t => ['Factures', 'Dépenses'].includes(t.type)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEpargnes = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const solde = totalRevenus - totalDepenses - totalEpargnes;
  const nbCredits = transactions.filter(t => t.isCredit).length;

  const resetForm = () => {
    setFormData({ date: new Date().toISOString().split('T')[0], montant: '', type: 'Dépenses', categorie: '', depuis: '', vers: '', moyenPaiement: '', memo: '', isCredit: false, capitalTotal: '', tauxInteret: '', dureeMois: '', dateDebut: '' });
    setShowAddCategory(false);
    setShowAddCompteDepuis(false);
    setShowAddCompteVers(false);
    setNewCategoryName('');
    setNewCompteName('');
  };

  const handleSubmit = () => {
    if (!formData.montant || !formData.categorie) return;
    if (editingId !== null) {
      const updated = transactions.map(t => t.id === editingId ? { ...formData, id: editingId } : t);
      saveTransactions(updated);
      setEditingId(null);
    } else {
      const newTransaction: Transaction = { ...formData, id: Date.now() };
      saveTransactions([...transactions, newTransaction]);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      date: transaction.date, montant: transaction.montant, type: transaction.type, categorie: transaction.categorie,
      depuis: transaction.depuis || '', vers: transaction.vers || '', moyenPaiement: transaction.moyenPaiement || '',
      memo: transaction.memo || '', isCredit: transaction.isCredit || false, capitalTotal: transaction.capitalTotal || '',
      tauxInteret: transaction.tauxInteret || '', dureeMois: transaction.dureeMois || '', dateDebut: transaction.dateDebut || ''
    });
    setEditingId(transaction.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette transaction ?')) saveTransactions(transactions.filter(t => t.id !== id));
  };

  const clearFilters = () => {
    setSearchQuery(''); 
    setFilterType(''); 
    setFilterCategorie(''); 
    setFilterDepuis(''); 
    setFilterVers(''); 
    setFilterMoyenPaiement('');
  };

  const prevMonth = () => {
    if (selectedMonth === null) setSelectedMonth(11);
    else if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); }
    else setSelectedMonth(selectedMonth - 1);
  };

  const nextMonth = () => {
    if (selectedMonth === null) setSelectedMonth(0);
    else if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); }
    else setSelectedMonth(selectedMonth + 1);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Revenus': return 'text-green-400';
      case 'Factures': return 'text-red-400';
      case 'Dépenses': return 'text-orange-400';
      case 'Épargnes': return 'text-violet-400';
      case 'Reprise d\'épargne': return 'text-purple-400';
      case 'Remboursement': return 'text-teal-400';
      case 'Transfert de fond': return 'text-yellow-400';
      default: return '';
    }
  };

  const loadMore = () => setDisplayCount(prev => prev + ITEMS_PER_PAGE);

  return (
    <>
      <div className="pb-4">
        <div className="text-center mb-4">
          <h1 className="text-lg font-medium" style={textPrimary}>Transactions</h1>
          <p className="text-xs" style={textSecondary}>{filteredTransactions.length} transaction(s)</p>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5" style={textPrimary} /></button>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold" style={textPrimary}>{selectedMonth !== null ? monthsFull[selectedMonth] : 'Tous'}</span>
              <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="rounded-lg px-3 py-1 text-lg font-semibold border" style={inputStyle}>
                {years.map(year => (<option key={year} value={year}>{year}</option>))}
              </select>
            </div>
            <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5" style={textPrimary} /></button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={() => setSelectedMonth(null)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" style={selectedMonth === null ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>Tous</button>
            {monthsShort.map((month, index) => (
              <button key={index} onClick={() => setSelectedMonth(index)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" style={selectedMonth === index ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>{month}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="backdrop-blur-sm rounded-2xl text-center p-3 border" style={cardStyle}>
            <p className="text-[10px]" style={textSecondary}>Revenus</p>
            <p className="text-sm font-semibold text-green-400">{totalRevenus.toFixed(0)}{parametres.devise}</p>
          </div>
          <div className="backdrop-blur-sm rounded-2xl text-center p-3 border" style={cardStyle}>
            <p className="text-[10px]" style={textSecondary}>Dépenses</p>
            <p className="text-sm font-semibold text-red-400">{totalDepenses.toFixed(0)}{parametres.devise}</p>
          </div>
          <div className="backdrop-blur-sm rounded-2xl text-center p-3 border" style={cardStyle}>
            <p className="text-[10px]" style={textSecondary}>Solde</p>
            <p className={`text-sm font-semibold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>{solde.toFixed(0)}{parametres.devise}</p>
          </div>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4" style={textSecondary} />
            <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-sm focus:outline-none" style={textPrimary} />
          </div>

          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-xs" style={textSecondary}>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Filtres avancés
            {(filterType || filterCategorie || filterDepuis || filterVers || filterMoyenPaiement) && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px]" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}>Actifs</span>
            )}
          </button>

          {showFilters && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle}>
                  <option value="">Tous les types</option>
                  {types.map(type => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Catégorie</label>
                <select value={filterCategorie} onChange={(e) => setFilterCategorie(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle}>
                  <option value="">Toutes les catégories</option>
                  {(filterType ? getCategoriesForType(filterType) : getAllCategories()).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Depuis</label>
                <select value={filterDepuis} onChange={(e) => setFilterDepuis(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle}>
                  <option value="">Tous les comptes</option>
                  {getComptesOptions().map(compte => (<option key={compte} value={compte}>{compte}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Vers</label>
                <select value={filterVers} onChange={(e) => setFilterVers(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle}>
                  <option value="">Tous les comptes</option>
                  {getComptesOptions().map(compte => (<option key={compte} value={compte}>{compte}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Moyen de paiement</label>
                <select value={filterMoyenPaiement} onChange={(e) => setFilterMoyenPaiement(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle}>
                  <option value="">Tous les moyens</option>
                  {moyensPaiement.map(moyen => (<option key={moyen} value={moyen}>{moyen}</option>))}
                </select>
              </div>
              {(filterType || filterCategorie || filterDepuis || filterVers || filterMoyenPaiement) && (
                <button onClick={clearFilters} className="w-full py-2 text-xs rounded-xl border" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textSecondary }}>Effacer les filtres</button>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}>
            <Plus className="w-4 h-4" />Nouvelle transaction
          </button>
          <button onClick={() => setShowRecurring(true)} className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/80 text-white rounded-xl font-medium text-sm">
            <RefreshCw className="w-4 h-4" />Récurrentes
          </button>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold" style={textPrimary}>Historique</h3>
            {filteredTransactions.length > 0 && (<span className="text-[10px]" style={textSecondary}>{displayedTransactions.length} sur {filteredTransactions.length}</span>)}
          </div>

          {displayedTransactions.length > 0 ? (
            <div className="space-y-2">
              {displayedTransactions.map((t) => (
                <div key={t.id} className="p-3 rounded-xl border" style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium truncate" style={textPrimary}>{t.categorie}</p>
                        {t.isCredit && (<span className="px-1.5 py-0.5 bg-purple-500/30 text-purple-300 rounded text-[9px]">Crédit</span>)}
                        {t.memo?.includes('🔄') && (<span className="px-1.5 py-0.5 bg-indigo-500/30 text-indigo-300 rounded text-[9px]">Auto</span>)}
                      </div>
                      <p className="text-[10px]" style={textSecondary}>{t.date} • {t.type}{t.moyenPaiement ? ` • ${t.moyenPaiement}` : ''}</p>
                      {t.depuis && <p className="text-[10px]" style={textSecondary}>De: {t.depuis} → {t.vers || '-'}</p>}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${getTypeColor(t.type)}`}>{t.type === 'Revenus' ? '+' : '-'}{parseFloat(t.montant).toFixed(2)} {parametres.devise}</p>
                    </div>
                  </div>
                  {t.memo && <p className="text-[10px] italic mt-1" style={textSecondary}>&quot;{t.memo}&quot;</p>}
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => handleEdit(t)} className="p-1.5 rounded-lg" style={{ color: theme.colors.textPrimary }}><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {hasMore && (
                <button onClick={loadMore} className="w-full py-3 mt-3 border-2 border-dashed rounded-xl text-sm font-medium transition-colors" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}>
                  Voir plus ({remainingCount} restante{remainingCount > 1 ? 's' : ''})
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-center py-8" style={textSecondary}>Aucune transaction trouvée</p>
          )}
        </div>

        <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-[#7DD3A8]" />
            <h4 className="text-xs font-semibold text-[#7DD3A8]">💡 Conseils</h4>
          </div>
          <div className="space-y-2">
            {filteredTransactions.length === 0 && (<p className="text-[10px] text-[#7DD3A8]">📝 Commencez à enregistrer vos transactions</p>)}
            {solde < 0 && (<p className="text-[10px] text-[#7DD3A8]">⚠️ Attention ! Solde négatif de {Math.abs(solde).toFixed(2)} {parametres.devise}</p>)}
            {solde >= 0 && solde < 100 && filteredTransactions.length > 0 && (<p className="text-[10px] text-[#7DD3A8]">💡 Solde serré, surveillez vos dépenses</p>)}
            {solde >= 100 && (<p className="text-[10px] text-[#7DD3A8]">✅ Bon solde ! Pensez à épargner</p>)}
            {nbCredits > 0 && (<p className="text-[10px] text-[#7DD3A8]">💳 {nbCredits} crédit(s) actif(s)</p>)}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="rounded-2xl p-4 w-full max-w-md border mb-20 mt-20" style={{ background: theme.colors.secondary, borderColor: theme.colors.cardBorder }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium" style={{ color: theme.colors.textOnSecondary }}>{editingId ? 'Modifier' : 'Nouvelle'} transaction</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="p-1"><X className="w-5 h-5" style={{ color: theme.colors.textOnSecondary }} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle} />
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Type</label>
                <select value={formData.type} onChange={(e) => { setFormData({ ...formData, type: e.target.value, categorie: '' }); setShowAddCategory(false); setNewCategoryName(''); }} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle}>
                  {types.map(type => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Montant ({parametres.devise})</label>
                <input type="number" placeholder="0.00" value={formData.montant} onChange={(e) => setFormData({ ...formData, montant: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle} />
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Catégorie</label>
                {!showAddCategory ? (
                  <select value={formData.categorie} onChange={(e) => { if (e.target.value === '__ADD_NEW__') { setShowAddCategory(true); setFormData({ ...formData, categorie: '' }); } else { setFormData({ ...formData, categorie: e.target.value }); } }} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle}>
                    <option value="">Sélectionner...</option>
                    {getCategoriesForType(formData.type).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                    <option value="__ADD_NEW__">➕ Ajouter une catégorie...</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder={`Nouvelle catégorie ${getTypeLabelForCategory(formData.type)}...`} className="flex-1 rounded-xl px-3 py-2 text-sm border focus:outline-none" style={modalInputStyle} autoFocus />
                      <button type="button" onClick={handleAddCategory} className="px-3 py-2 rounded-xl text-sm font-medium" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-4 h-4" /></button>
                      <button type="button" onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }} className="px-3 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}><X className="w-4 h-4" /></button>
                    </div>
                    <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>La catégorie sera ajoutée aux {getTypeLabelForCategory(formData.type)} dans les paramètres</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Depuis</label>
                {!showAddCompteDepuis ? (
                  <select value={formData.depuis} onChange={(e) => { if (e.target.value === '__ADD_NEW__') { setShowAddCompteDepuis(true); setFormData({ ...formData, depuis: '' }); } else { setFormData({ ...formData, depuis: e.target.value }); } }} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle}>
                    <option value="">Aucun</option>
                    {getComptesOptions().map(compte => (<option key={compte} value={compte}>{compte}</option>))}
                    <option value="__ADD_NEW__">➕ Ajouter un compte...</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input type="text" value={newCompteName} onChange={(e) => setNewCompteName(e.target.value)} placeholder="Nouveau compte bancaire..." className="flex-1 rounded-xl px-3 py-2 text-sm border focus:outline-none" style={modalInputStyle} autoFocus />
                      <button type="button" onClick={() => handleAddCompte('depuis')} className="px-3 py-2 rounded-xl text-sm font-medium" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-4 h-4" /></button>
                      <button type="button" onClick={() => { setShowAddCompteDepuis(false); setNewCompteName(''); }} className="px-3 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}><X className="w-4 h-4" /></button>
                    </div>
                    <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>Le compte sera ajouté dans les paramètres</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Vers</label>
                {!showAddCompteVers ? (
                  <select value={formData.vers} onChange={(e) => { if (e.target.value === '__ADD_NEW__') { setShowAddCompteVers(true); setFormData({ ...formData, vers: '' }); } else { setFormData({ ...formData, vers: e.target.value }); } }} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle}>
                    <option value="">Aucun</option>
                    {getComptesOptions().map(compte => (<option key={compte} value={compte}>{compte}</option>))}
                    <option value="__ADD_NEW__">➕ Ajouter un compte...</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input type="text" value={newCompteName} onChange={(e) => setNewCompteName(e.target.value)} placeholder="Nouveau compte bancaire..." className="flex-1 rounded-xl px-3 py-2 text-sm border focus:outline-none" style={modalInputStyle} autoFocus />
                      <button type="button" onClick={() => handleAddCompte('vers')} className="px-3 py-2 rounded-xl text-sm font-medium" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-4 h-4" /></button>
                      <button type="button" onClick={() => { setShowAddCompteVers(false); setNewCompteName(''); }} className="px-3 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textOnSecondary }}><X className="w-4 h-4" /></button>
                    </div>
                    <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>Le compte sera ajouté dans les paramètres</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Moyen de paiement</label>
                <select value={formData.moyenPaiement} onChange={(e) => setFormData({ ...formData, moyenPaiement: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle}>
                  <option value="">Sélectionner...</option>
                  {moyensPaiement.map(moyen => (<option key={moyen} value={moyen}>{moyen}</option>))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="isCredit" checked={formData.isCredit} onChange={(e) => setFormData({ ...formData, isCredit: e.target.checked })} className="w-5 h-5 rounded" />
                <label htmlFor="isCredit" className="text-xs font-medium" style={{ color: theme.colors.textOnSecondary }}>C&apos;est un crédit</label>
              </div>

              {formData.isCredit && (
                <div className="space-y-3 p-3 rounded-xl border" style={{ background: theme.colors.secondaryLight, borderColor: theme.colors.cardBorder }}>
                  <p className="text-[10px] text-center" style={{ color: theme.colors.textOnSecondary }}>Informations du crédit</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Capital total</label>
                      <input type="number" placeholder="0" value={formData.capitalTotal} onChange={(e) => setFormData({ ...formData, capitalTotal: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Taux (%)</label>
                      <input type="number" placeholder="0" step="0.1" value={formData.tauxInteret} onChange={(e) => setFormData({ ...formData, tauxInteret: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Durée (mois)</label>
                      <input type="number" placeholder="0" value={formData.dureeMois} onChange={(e) => setFormData({ ...formData, dureeMois: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Date début</label>
                      <input type="date" value={formData.dateDebut} onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={modalInputStyle} />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: theme.colors.textOnSecondary }}>Description (optionnel)</label>
                <textarea placeholder="Ajouter une note..." value={formData.memo} onChange={(e) => setFormData({ ...formData, memo: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border resize-none" style={modalInputStyle} rows={3} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="flex-1 py-3 rounded-xl font-medium border" style={{ borderColor: theme.colors.textOnSecondary, color: theme.colors.textOnSecondary }}>Annuler</button>
                <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}>
                  <Check className="w-5 h-5" />{editingId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <RecurringTransactions
        isOpen={showRecurring}
        onClose={() => setShowRecurring(false)}
        categoriesRevenus={parametres.categoriesRevenus}
        categoriesFactures={parametres.categoriesFactures}
        categoriesDepenses={parametres.categoriesDepenses}
        categoriesEpargnes={parametres.categoriesEpargnes}
        comptes={parametres.comptesBancaires}
        onTransactionCreated={() => { loadTransactions(); loadParametres(); }}
      />
    </>
  );
}

export default function TransactionsPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="transactions" onNavigate={handleNavigate}>
      <TransactionsContent />
    </AppShell>
  );
}

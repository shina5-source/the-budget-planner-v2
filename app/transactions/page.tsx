"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, X, Check, ChevronDown, ChevronUp, Trash2, Edit3, Lightbulb, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';

// NOTE: These components and functions will need to be imported from their actual locations
// For now, these are placeholders to avoid breaking the code.
const RecurringTransactions = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void, [key: string]: any }) => {
    if (!isOpen) return null;
    return <div className="fixed inset-0 bg-black/50 z-50"><div className="bg-white p-4 rounded">Recurring Transactions Modal (Placeholder) <button onClick={onClose}>Close</button></div></div>;
};
const processRecurringTransactions = () => { console.log("Processing recurring transactions..."); return []; };


interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  depuis?: string;
  vers?: string;
  memo?: string;
  isCredit?: boolean;
  capitalTotal?: string;
  tauxInteret?: string;
  dureeMois?: string;
  dateDebut?: string;
}

interface CompteBancaire {
  id: number;
  nom: string;
  soldeDepart: number;
  isEpargne: boolean;
}

interface ParametresData {
  dateDepart: string;
  budgetAvantPremier: boolean;
  devise: string;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  categoriesEpargnes: string[];
  comptesBancaires: CompteBancaire[];
}

const defaultParametres: ParametresData = {
    dateDepart: new Date().toISOString().split('T')[0],
    budgetAvantPremier: false,
    devise: '€',
    categoriesRevenus: ['Salaire', 'Revenus Secondaires', 'Allocations', 'Aides', 'Remboursement', 'Autres Revenus'],
    categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Assurance', 'Internet', 'Mobile', 'Abonnements', 'Crédits', 'Impôts'],
    categoriesDepenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Loisirs', 'Santé', 'Cadeaux', 'Autres'],
    categoriesEpargnes: ['Livret A', 'Épargne', 'Tirelire', 'Vacances', 'Projets'],
    comptesBancaires: [
        { id: 1, nom: 'Compte Principal', soldeDepart: 0, isEpargne: false },
        { id: 2, nom: 'Livret A', soldeDepart: 0, isEpargne: true },
    ]
};

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);
const types = ['Revenus', 'Factures', 'Dépenses', 'Épargnes', 'Reprise d\'épargne', 'Remboursement', 'Transfert de fond'];
const moyensPaiement = ['Prélèvement', 'Paiement CB', 'Virement', 'Chèque', 'Espèces', 'Paiement en ligne', 'Paiement mobile'];
const comptesOptions = ['Externe', 'CCP La Banque Postale', 'CCP BoursoBank', 'Livret A La Banque Postale', 'Livret A Kim La Banque Postale', 'Tirelire', 'Espèce'];
const ITEMS_PER_PAGE = 50;


export default function TransactionsPage() {
    // ... (logic is here, now adding the full JSX)
    const { theme } = useTheme();
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

    const loadTransactions = () => {
        const savedTransactions = localStorage.getItem('budget-transactions');
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    };

    useEffect(() => {
        loadTransactions();
        const savedParametres = localStorage.getItem('budget-parametres');
        if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
        
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

    const getAllCategories = () => {
        const all = [...parametres.categoriesRevenus, ...parametres.categoriesFactures, ...parametres.categoriesDepenses, ...parametres.categoriesEpargnes];
        return [...new Set(all)];
    };

    const getMonthKey = () => {
        if (selectedMonth === null) return null;
        return `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
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
        setSearchQuery(''); setFilterType(''); setFilterCategorie(''); setFilterDepuis(''); setFilterVers(''); setFilterMoyenPaiement('');
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
            case 'Épargnes': return 'text-blue-400';
            case 'Reprise d\'épargne': return 'text-purple-400';
            case 'Remboursement': return 'text-teal-400';
            case 'Transfert de fond': return 'text-yellow-400';
            default: return '';
        }
    };

    const loadMore = () => setDisplayCount(prev => prev + ITEMS_PER_PAGE);

    return (
        <div className="pb-4">
            <div className="text-center mb-4">
                <h1 className="text-lg font-medium" style={textPrimary}>Transactions</h1>
                <p className="text-xs" style={textSecondary}>{filteredTransactions.length} transaction(s)</p>
            </div>

            {/* Sélecteur de mois */}
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

            {/* The rest of the JSX for the component */}
        </div>
    );
}

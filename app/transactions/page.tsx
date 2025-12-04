"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, X, Check, ChevronDown, ChevronUp, Trash2, Edit3, Lightbulb, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import RecurringTransactions from '../../components/RecurringTransactions';
import { processRecurringTransactions } from '../../lib/recurring-transactions';

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
  categoriesRevenus: ['Salaire Foundevor', 'Revenus Secondaires', 'Allocations Familiales', 'Aides Sociales', 'Sécurité Sociale', 'Remboursement', 'Aide Financière', 'Aide Familiale', 'Prêt & Crédit Reçu', 'Dépôt Espèces', 'Ventes', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Assainissement', 'Assurance Habitation', 'Assurance Auto/Moto', 'Assurance Mobile', 'Assurance Chute Européen', 'Abonnement Internet', 'Abonnement Mobile Dhc', 'Abonnement Mobile Moi', 'Abonnement Mobile Kayu', 'Abonnement Mobile Timothy', 'Abonnement Mobile Kim', 'Abonnement Salle de Sport', 'Abonnement Streaming', 'Abonnement Transport Commun', 'Abonnement Autres', 'Cotisation Syndicale Sud', 'Emprunt Bourse Titi', 'Crédit Carrefour Banque', 'Crédit La Banque Postale', 'Crédit la Banque Postale Permis', 'Crédit Floa Bank', 'Crédit Cofidis', 'Crédit Cetelem', 'Crédit Floa Bank 4x', 'Crédit Paiement en 4x', 'Chèque Reporté Carrefour & Autres', 'Impôts/Trésor Public'],
  categoriesDepenses: ['Courses', 'Courses Asiatique', 'Restaurant', 'Fast Food & Plat à Emporter', 'Cafés/Bar & Boulangerie/Patisserie', 'Essence ou Carburant', 'Péage & Parking', 'Entretien Auto/Moto', 'Tabac/Cigarettes', 'Achat CB', 'Achat Google', 'Achat CB Carrefour Banque', 'Aide Familiale', 'Remboursement Famille & Tiers', 'Retrait', 'Cinéma', 'Sorties & Vacances & Voyages', 'Shopping', 'Shopping Enfant', 'Soins Personnel', 'Livres & Manga', 'Ameublement & Déco & Électroménager', 'Consultations Médicales', 'Pharmacie/Médicaments', 'Cadeaux (Anniversaire, Fêtes etc...)', 'Frais Bancaires', 'Frais Imprévus', 'Amendes', 'Autres Dépenses'],
  categoriesEpargnes: ['Livret A', 'Livret A Kim', 'Tirelire', 'Espèces', 'Anniversaire Coy', 'Anniversaire Kayu', 'Anniversaire Titi', 'Anniversaire Kim', 'Anniversaire Negro', 'Anniversaire Acat', 'Anniversaire La Naine', 'Anniversaire Noy', 'Voyages', 'Noël', 'Fonds d\'Urgence', 'CCP La Banque Postale', 'CCP BoursoBank'],
  comptesBancaires: [
    { id: 1, nom: 'CCP La Banque Postale' },
    { id: 2, nom: 'CCP BoursoBank' },
    { id: 3, nom: 'Livret A La Banque Postale' },
  ]
};

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

const types = ['Revenus', 'Factures', 'Dépenses', 'Épargnes', 'Reprise d\'épargne', 'Remboursement', 'Transfert de fond'];

const moyensPaiement = ['Prélèvement', 'Paiement CB', 'Virement', 'Chèque', 'Espèces', 'Paiement en ligne', 'Paiement mobile'];

const comptesOptions = [
  'Externe',
  'CCP La Banque Postale',
  'CCP BoursoBank',
  'Livret A La Banque Postale',
  'Livret A Kim La Banque Postale',
  'Tirelire',
  'Espèce',
  'Anniversaire Coy',
  'Anniversaire Kayu',
  'Anniversaire Titi',
  'Anniversaire Kim',
  'Anniversaire Negro',
  'Anniversaire Acat',
  'Anniversaire La Naine',
  'Anniversaire Noy',
  'Voyages',
  'Noël',
  'Fonds d\'Urgence'
];

// STYLES UNIFORMISÉS
const cardStyle = "bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#D4AF37]/40";
const pageTitleStyle = "text-lg font-medium text-[#D4AF37]";
const pageSubtitleStyle = "text-xs text-[#D4AF37]/70";
const smallTextStyle = "text-[10px] text-[#D4AF37]/60";
const labelStyle = "text-xs font-medium text-[#D4AF37] mb-1 block";
const valueStyle = "text-xs font-medium text-[#D4AF37]";
const sectionTitleStyle = "text-sm font-semibold text-[#D4AF37]";
const inputStyle = "w-full bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-sm text-[#D4AF37] placeholder-[#D4AF37]/50 focus:outline-none focus:border-[#D4AF37]";
const selectStyle = "w-full bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-sm text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]";

// STYLE CONSEILS
const conseilCardStyle = "bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50";
const conseilTitleStyle = "text-xs font-semibold text-[#7DD3A8]";
const conseilTextStyle = "text-[10px] text-[#7DD3A8]";
const conseilIconStyle = "w-4 h-4 text-[#7DD3A8]";

// PAGINATION
const ITEMS_PER_PAGE = 50;

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [showRecurring, setShowRecurring] = useState(false);
  
  // PAGINATION STATE
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  
  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('');
  const [filterDepuis, setFilterDepuis] = useState('');
  const [filterVers, setFilterVers] = useState('');
  const [filterMoyenPaiement, setFilterMoyenPaiement] = useState('');

  // Formulaire
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

  const loadTransactions = () => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  };

  useEffect(() => {
    loadTransactions();
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
    
    const created = processRecurringTransactions();
    if (created.length > 0) {
      loadTransactions();
    }
  }, []);

  // Réinitialiser la pagination quand on change de mois ou de filtres
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
    const all = [
      ...parametres.categoriesRevenus,
      ...parametres.categoriesFactures,
      ...parametres.categoriesDepenses,
      ...parametres.categoriesEpargnes
    ];
    return [...new Set(all)];
  };

  const getMonthKey = () => {
    if (selectedMonth === null) return null;
    return `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
  };

  // Filtrer les transactions
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

  // PAGINATION: Transactions à afficher
  const displayedTransactions = filteredTransactions.slice(0, displayCount);
  const hasMore = displayCount < filteredTransactions.length;
  const remainingCount = filteredTransactions.length - displayCount;

  // Calculs (sur TOUTES les transactions filtrées, pas seulement celles affichées)
  const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalDepenses = filteredTransactions.filter(t => ['Factures', 'Dépenses'].includes(t.type)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEpargnes = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const solde = totalRevenus - totalDepenses - totalEpargnes;
  const nbCredits = transactions.filter(t => t.isCredit).length;

  const resetForm = () => {
    setFormData({
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
      date: transaction.date,
      montant: transaction.montant,
      type: transaction.type,
      categorie: transaction.categorie,
      depuis: transaction.depuis || '',
      vers: transaction.vers || '',
      moyenPaiement: transaction.moyenPaiement || '',
      memo: transaction.memo || '',
      isCredit: transaction.isCredit || false,
      capitalTotal: transaction.capitalTotal || '',
      tauxInteret: transaction.tauxInteret || '',
      dureeMois: transaction.dureeMois || '',
      dateDebut: transaction.dateDebut || ''
    });
    setEditingId(transaction.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette transaction ?')) {
      saveTransactions(transactions.filter(t => t.id !== id));
    }
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
    if (selectedMonth === null) {
      setSelectedMonth(11);
    } else if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === null) {
      setSelectedMonth(0);
    } else if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
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
      default: return 'text-[#D4AF37]';
    }
  };

  // Fonction pour charger plus de transactions
  const loadMore = () => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="pb-4">
      <div className="text-center mb-4">
        <h1 className={pageTitleStyle}>Transactions</h1>
        <p className={pageSubtitleStyle}>{filteredTransactions.length} transaction(s)</p>
      </div>

      {/* Sélecteur de mois */}
      <div className={cardStyle + " mb-4"}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5 text-[#D4AF37]" /></button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#D4AF37]">
              {selectedMonth !== null ? monthsFull[selectedMonth] : 'Tous'}
            </span>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
              className="bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-lg px-3 py-1 text-lg font-semibold text-[#D4AF37]"
            >
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5 text-[#D4AF37]" /></button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedMonth(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              selectedMonth === null
                ? 'bg-[#D4AF37] text-[#722F37] border-[#D4AF37]'
                : 'bg-transparent text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'
            }`}
          >
            Tous
          </button>
          {monthsShort.map((month, index) => (
            <button
              key={index}
              onClick={() => setSelectedMonth(index)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                selectedMonth === index
                  ? 'bg-[#D4AF37] text-[#722F37] border-[#D4AF37]'
                  : 'bg-transparent text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={cardStyle + " text-center p-3"}>
          <p className={smallTextStyle}>Revenus</p>
          <p className="text-sm font-semibold text-green-400">{totalRevenus.toFixed(0)}{parametres.devise}</p>
        </div>
        <div className={cardStyle + " text-center p-3"}>
          <p className={smallTextStyle}>Dépenses</p>
          <p className="text-sm font-semibold text-red-400">{totalDepenses.toFixed(0)}{parametres.devise}</p>
        </div>
        <div className={cardStyle + " text-center p-3"}>
          <p className={smallTextStyle}>Solde</p>
          <p className={`text-sm font-semibold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>{solde.toFixed(0)}{parametres.devise}</p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className={cardStyle + " mb-4"}>
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-[#D4AF37]/60" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#D4AF37] placeholder-[#D4AF37]/50 focus:outline-none"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-xs text-[#D4AF37]/70 hover:text-[#D4AF37]"
        >
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Filtres avancés
          {(filterType || filterCategorie || filterDepuis || filterVers || filterMoyenPaiement) && (
            <span className="px-1.5 py-0.5 bg-[#D4AF37] text-[#722F37] rounded-full text-[10px]">Actifs</span>
          )}
        </button>

        {showFilters && (
          <div className="mt-4 space-y-3">
            <div>
              <label className={labelStyle}>Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={selectStyle}>
                <option value="">Tous les types</option>
                {types.map(type => (<option key={type} value={type}>{type}</option>))}
              </select>
            </div>

            <div>
              <label className={labelStyle}>Catégorie</label>
              <select value={filterCategorie} onChange={(e) => setFilterCategorie(e.target.value)} className={selectStyle}>
                <option value="">Toutes les catégories</option>
                {(filterType ? getCategoriesForType(filterType) : getAllCategories()).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelStyle}>Depuis</label>
              <select value={filterDepuis} onChange={(e) => setFilterDepuis(e.target.value)} className={selectStyle}>
                <option value="">Tous les comptes</option>
                {comptesOptions.map(compte => (<option key={compte} value={compte}>{compte}</option>))}
              </select>
            </div>

            <div>
              <label className={labelStyle}>Vers</label>
              <select value={filterVers} onChange={(e) => setFilterVers(e.target.value)} className={selectStyle}>
                <option value="">Tous les comptes</option>
                {comptesOptions.map(compte => (<option key={compte} value={compte}>{compte}</option>))}
              </select>
            </div>

            <div>
              <label className={labelStyle}>Moyen de paiement</label>
              <select value={filterMoyenPaiement} onChange={(e) => setFilterMoyenPaiement(e.target.value)} className={selectStyle}>
                <option value="">Tous les moyens</option>
                {moyensPaiement.map(moyen => (<option key={moyen} value={moyen}>{moyen}</option>))}
              </select>
            </div>

            {(filterType || filterCategorie || filterDepuis || filterVers || filterMoyenPaiement) && (
              <button
                onClick={clearFilters}
                className="w-full py-2 text-xs text-[#D4AF37]/70 hover:text-[#D4AF37] border border-[#D4AF37]/30 rounded-xl"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle transaction
        </button>
        <button
          onClick={() => setShowRecurring(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/80 text-white rounded-xl font-medium text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Récurrentes
        </button>
      </div>

      {/* Historique */}
      <div className={cardStyle + " mb-4"}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={sectionTitleStyle}>Historique</h3>
          {/* Compteur de pagination */}
          {filteredTransactions.length > 0 && (
            <span className={smallTextStyle}>
              {displayedTransactions.length} sur {filteredTransactions.length}
            </span>
          )}
        </div>
        
        {displayedTransactions.length > 0 ? (
          <div className="space-y-2">
            {displayedTransactions.map((t) => (
              <div key={t.id} className="p-3 bg-[#722F37]/40 rounded-xl border border-[#D4AF37]/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={valueStyle + " truncate"}>{t.categorie}</p>
                      {t.isCredit && (
                        <span className="px-1.5 py-0.5 bg-purple-500/30 text-purple-300 rounded text-[9px]">Crédit</span>
                      )}
                      {t.memo?.includes('🔄') && (
                        <span className="px-1.5 py-0.5 bg-indigo-500/30 text-indigo-300 rounded text-[9px]">Auto</span>
                      )}
                    </div>
                    <p className={smallTextStyle}>{t.date} • {t.type}{t.moyenPaiement ? ` • ${t.moyenPaiement}` : ''}</p>
                    {t.depuis && <p className={smallTextStyle}>De: {t.depuis} → {t.vers || '-'}</p>}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${getTypeColor(t.type)}`}>
                      {t.type === 'Revenus' ? '+' : '-'}{parseFloat(t.montant).toFixed(2)} {parametres.devise}
                    </p>
                  </div>
                </div>
                {t.memo && <p className={smallTextStyle + " italic mt-1"}>"{t.memo}"</p>}
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => handleEdit(t)} className="p-1.5 hover:bg-[#D4AF37]/20 rounded-lg">
                    <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}

            {/* Bouton Voir plus */}
            {hasMore && (
              <button
                onClick={loadMore}
                className="w-full py-3 mt-3 border-2 border-dashed border-[#D4AF37]/50 rounded-xl text-sm font-medium text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
              >
                Voir plus ({remainingCount} restante{remainingCount > 1 ? 's' : ''})
              </button>
            )}
          </div>
        ) : (
          <p className={pageSubtitleStyle + " text-center py-8"}>Aucune transaction trouvée</p>
        )}
      </div>

      {/* Conseils */}
      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className={conseilIconStyle} />
          <h4 className={conseilTitleStyle}>💡 Conseils</h4>
        </div>
        <div className="space-y-2">
          {filteredTransactions.length === 0 && (
            <p className={conseilTextStyle}>📝 Commencez à enregistrer vos transactions</p>
          )}
          {solde < 0 && (
            <p className={conseilTextStyle}>⚠️ Attention ! Solde négatif de {Math.abs(solde).toFixed(2)} {parametres.devise}</p>
          )}
          {solde >= 0 && solde < 100 && filteredTransactions.length > 0 && (
            <p className={conseilTextStyle}>💡 Solde serré, surveillez vos dépenses</p>
          )}
          {solde >= 100 && (
            <p className={conseilTextStyle}>✅ Bon solde ! Pensez à épargner</p>
          )}
          {filteredTransactions.filter(t => t.type === 'Dépenses').length > 20 && (
            <p className={conseilTextStyle}>📊 +20 dépenses ce mois, analysez vos habitudes</p>
          )}
          {nbCredits > 0 && (
            <p className={conseilTextStyle}>💳 {nbCredits} crédit(s) actif(s) enregistré(s)</p>
          )}
        </div>
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-16 overflow-y-auto">
          <div className="bg-[#8B4557] rounded-2xl p-4 w-full max-w-md border border-[#D4AF37]/40 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className={pageTitleStyle}>{editingId ? 'Modifier' : 'Nouvelle'} transaction</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1">
                <X className="w-5 h-5 text-[#D4AF37]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelStyle}>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, categorie: '' })}
                  className={selectStyle}
                >
                  {types.map(type => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>

              <div>
                <label className={labelStyle}>Montant ({parametres.devise})</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.montant}
                  onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Catégorie</label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  className={selectStyle}
                >
                  <option value="">Sélectionner...</option>
                  {getCategoriesForType(formData.type).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelStyle}>Depuis</label>
                <select
                  value={formData.depuis}
                  onChange={(e) => setFormData({ ...formData, depuis: e.target.value })}
                  className={selectStyle}
                >
                  <option value="">Aucun</option>
                  {comptesOptions.map(compte => (<option key={compte} value={compte}>{compte}</option>))}
                </select>
              </div>

              <div>
                <label className={labelStyle}>Vers</label>
                <select
                  value={formData.vers}
                  onChange={(e) => setFormData({ ...formData, vers: e.target.value })}
                  className={selectStyle}
                >
                  <option value="">Aucun</option>
                  {comptesOptions.map(compte => (<option key={compte} value={compte}>{compte}</option>))}
                </select>
              </div>

              <div>
                <label className={labelStyle}>Moyen de paiement</label>
                <select
                  value={formData.moyenPaiement}
                  onChange={(e) => setFormData({ ...formData, moyenPaiement: e.target.value })}
                  className={selectStyle}
                >
                  <option value="">Sélectionner...</option>
                  {moyensPaiement.map(moyen => (<option key={moyen} value={moyen}>{moyen}</option>))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isCredit"
                  checked={formData.isCredit}
                  onChange={(e) => setFormData({ ...formData, isCredit: e.target.checked })}
                  className="w-5 h-5 rounded border-[#D4AF37]/50 bg-[#722F37]/50 text-[#D4AF37]"
                />
                <label htmlFor="isCredit" className={labelStyle + " mb-0"}>C'est un crédit</label>
              </div>

              {formData.isCredit && (
                <div className="space-y-3 p-3 bg-[#722F37]/30 rounded-xl border border-[#D4AF37]/30">
                  <p className={smallTextStyle + " text-center"}>Informations du crédit</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelStyle}>Capital total</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.capitalTotal}
                        onChange={(e) => setFormData({ ...formData, capitalTotal: e.target.value })}
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Taux (%)</label>
                      <input
                        type="number"
                        placeholder="0"
                        step="0.1"
                        value={formData.tauxInteret}
                        onChange={(e) => setFormData({ ...formData, tauxInteret: e.target.value })}
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Durée (mois)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.dureeMois}
                        onChange={(e) => setFormData({ ...formData, dureeMois: e.target.value })}
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Date début</label>
                      <input
                        type="date"
                        value={formData.dateDebut}
                        onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                        className={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className={labelStyle}>Description (optionnel)</label>
                <textarea
                  placeholder="Ajouter une note..."
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  className={inputStyle + " resize-none"}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="flex-1 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {editingId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Transactions Récurrentes */}
      <RecurringTransactions
        isOpen={showRecurring}
        onClose={() => setShowRecurring(false)}
        categoriesRevenus={parametres.categoriesRevenus}
        categoriesFactures={parametres.categoriesFactures}
        categoriesDepenses={parametres.categoriesDepenses}
        comptes={parametres.comptesBancaires}
        onTransactionCreated={loadTransactions}
      />
    </div>
  );
}
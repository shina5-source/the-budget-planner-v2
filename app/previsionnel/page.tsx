"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, PiggyBank, Calculator, Target, Lightbulb, Plus, Trash2, Edit3, Check, X, Home as HomeIcon, ShoppingBag } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

interface PrevisionItem {
  id: number;
  categorie: string;
  montantPrevu: number;
}

interface PrevisionsMois {
  revenus: PrevisionItem[];
  factures: PrevisionItem[];
  depenses: PrevisionItem[];
  epargnes: PrevisionItem[];
}

interface ParametresData {
  devise: string;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  categoriesEpargnes: string[];
}

const defaultParametres: ParametresData = {
  devise: '€',
  categoriesRevenus: ['Salaire Foundever', 'Revenus Secondaires', 'Allocations Familiales', 'Aides Sociales', 'Sécurité Sociale', 'Remboursement', 'Aide Financière', 'Aide Familiale', 'Prêt & Crédit Reçu', 'Dépôt Espèces', 'Ventes', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Assainissement', 'Assurance Habitation', 'Assurance Auto/Moto', 'Assurance Mobile', 'Assurance Chubb European', 'Abonnement Internet', 'Abonnement Mobile Dhc', 'Abonnement Mobile Moi', 'Abonnement Mobile Kayu', 'Abonnement Mobile Timothy', 'Abonnement Mobile Kim', 'Abonnement Salle de Sport', 'Abonnement Streaming', 'Abonnement Transport Commun', 'Abonnement Autres', 'Cotisation Syndicale Sud', 'Emprunt Bourse Titi', 'Crédit Carrefour Banque', 'Crédit La Banque Postale', 'Crédit la Banque Postale Permis', 'Crédit Floa Bank', 'Crédit Cofidis', 'Crédit Cetelem', 'Crédit Floa Bank 4x', 'Crédit Paiement en 4x', 'Chèque Reporté Carrefour & Autres', 'Impôts/Trésor Public'],
  categoriesDepenses: ['Courses', 'Courses Asiatique', 'Restaurant', 'Fast Food & Plat à Emporter', 'Cafés/Bar & Boulangerie/Patisserie', 'Essence ou Carburant', 'Péage & Parking', 'Entretien Auto/Moto', 'Tabac/Cigarettes', 'Achat CB', 'Achat Google', 'Achat CB Carrefour Banque', 'Aide Familiale', 'Remboursement Famille & Tiers', 'Retrait', 'Cinéma', 'Sorties & Vacances & Voyages', 'Shopping', 'Shopping Enfant', 'Soins Personnel', 'Livres & Manga', 'Ameublement & Déco & Électroménager', 'Consultations Médicales', 'Pharmacie/Médicaments', 'Cadeaux (Anniversaire, Fêtes etc...)', 'Frais Bancaires', 'Frais Imprévus', 'Amendes', 'Autres Dépenses'],
  categoriesEpargnes: ['Livret A', 'Livret A Kim', 'Tirelire', 'Espèces', 'Anniversaire Coy', 'Anniversaire Kayu', 'Anniversaire Titi', 'Anniversaire Kim', 'Anniversaire Negro', 'Anniversaire Acat', 'Anniversaire La Naine', 'Anniversaire Noy', 'Voyages', 'Noël', 'Fonds d\'Urgence', 'CCP La Banque Postale', 'CCP BoursoBank']
};

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

type TabType = 'vue' | 'revenus' | 'factures' | 'depenses' | 'epargne' | 'analyse';

// STYLES UNIFORMISÉS
const cardStyle = "bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#D4AF37]/40";
const pageTitleStyle = "text-lg font-medium text-[#D4AF37]";
const pageSubtitleStyle = "text-xs text-[#D4AF37]/70";
const cardTitleStyle = "text-xs text-[#D4AF37]/80";
const amountLargeStyle = "text-2xl font-semibold text-[#D4AF37]";
const amountMediumStyle = "text-lg font-semibold text-[#D4AF37]";
const smallTextStyle = "text-[10px] text-[#D4AF37]/60";
const labelStyle = "text-xs text-[#D4AF37]/80";
const valueStyle = "text-xs font-medium text-[#D4AF37]";
const sectionTitleStyle = "text-sm font-semibold text-[#D4AF37]";
const inputStyle = "w-full bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-sm text-[#D4AF37] placeholder-[#D4AF37]/50 focus:outline-none focus:border-[#D4AF37]";
const selectStyle = "w-full bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-sm text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]";

// STYLE CONSEILS - Vert menthe
const conseilCardStyle = "bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50";
const conseilTitleStyle = "text-xs font-semibold text-[#7DD3A8]";
const conseilTextStyle = "text-[10px] text-[#7DD3A8]";

export default function PrevisionnelPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [activeTab, setActiveTab] = useState<TabType>('vue');
  
  // Prévisions par mois (clé: "2025-01")
  const [allPrevisions, setAllPrevisions] = useState<Record<string, PrevisionsMois>>({});
  
  // Formulaire d'ajout
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormType, setAddFormType] = useState<'revenus' | 'factures' | 'depenses' | 'epargnes'>('revenus');
  const [newCategorie, setNewCategorie] = useState('');
  const [newMontant, setNewMontant] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const getMonthKey = () => `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;

  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

    const savedPrevisions = localStorage.getItem('budget-previsions-v2');
    if (savedPrevisions) setAllPrevisions(JSON.parse(savedPrevisions));

    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
  }, []);

  const savePrevisions = (newPrevisions: Record<string, PrevisionsMois>) => {
    setAllPrevisions(newPrevisions);
    localStorage.setItem('budget-previsions-v2', JSON.stringify(newPrevisions));
  };

  // Obtenir les prévisions du mois courant
  const getCurrentPrevisions = (): PrevisionsMois => {
    const key = getMonthKey();
    return allPrevisions[key] || { revenus: [], factures: [], depenses: [], epargnes: [] };
  };

  // Transactions réelles du mois
  const filteredTransactions = transactions.filter(t => t.date?.startsWith(getMonthKey()));
  const totalRevenusReel = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalFacturesReel = filteredTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalDepensesReel = filteredTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEpargnesReel = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);

  // Totaux prévus
  const previsions = getCurrentPrevisions();
  const totalRevenusPrev = previsions.revenus.reduce((sum, p) => sum + p.montantPrevu, 0);
  const totalFacturesPrev = previsions.factures.reduce((sum, p) => sum + p.montantPrevu, 0);
  const totalDepensesPrev = previsions.depenses.reduce((sum, p) => sum + p.montantPrevu, 0);
  const totalEpargnesPrev = previsions.epargnes.reduce((sum, p) => sum + p.montantPrevu, 0);

  // Soldes
  const soldePrevu = totalRevenusPrev - totalFacturesPrev - totalDepensesPrev - totalEpargnesPrev;
  const soldeReel = totalRevenusReel - totalFacturesReel - totalDepensesReel - totalEpargnesReel;

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); }
    else setSelectedMonth(selectedMonth - 1);
  };

  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); }
    else setSelectedMonth(selectedMonth + 1);
  };

  // Ajouter une prévision
  const handleAddPrevision = (type: 'revenus' | 'factures' | 'depenses' | 'epargnes') => {
    if (!newCategorie || !newMontant) return;
    
    const key = getMonthKey();
    const current = allPrevisions[key] || { revenus: [], factures: [], depenses: [], epargnes: [] };
    
    if (editingId !== null) {
      // Modifier
      current[type] = current[type].map(p => 
        p.id === editingId ? { ...p, categorie: newCategorie, montantPrevu: parseFloat(newMontant) } : p
      );
    } else {
      // Ajouter
      const newItem: PrevisionItem = {
        id: Date.now(),
        categorie: newCategorie,
        montantPrevu: parseFloat(newMontant)
      };
      current[type] = [...current[type], newItem];
    }
    
    savePrevisions({ ...allPrevisions, [key]: current });
    setNewCategorie('');
    setNewMontant('');
    setEditingId(null);
    setShowAddForm(false);
  };

  // Supprimer une prévision
  const handleDeletePrevision = (type: 'revenus' | 'factures' | 'depenses' | 'epargnes', id: number) => {
    const key = getMonthKey();
    const current = allPrevisions[key];
    if (!current) return;
    
    current[type] = current[type].filter(p => p.id !== id);
    savePrevisions({ ...allPrevisions, [key]: current });
  };

  // Éditer une prévision
  const handleEditPrevision = (type: 'revenus' | 'factures' | 'depenses' | 'epargnes', item: PrevisionItem) => {
    setAddFormType(type);
    setNewCategorie(item.categorie);
    setNewMontant(item.montantPrevu.toString());
    setEditingId(item.id);
    setShowAddForm(true);
  };

  // Copier le mois précédent
  const copyFromPreviousMonth = () => {
    const prevMonthIndex = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const prevKey = `${prevYear}-${(prevMonthIndex + 1).toString().padStart(2, '0')}`;
    const currentKey = getMonthKey();
    
    if (allPrevisions[prevKey]) {
      const copied: PrevisionsMois = {
        revenus: allPrevisions[prevKey].revenus.map(p => ({ ...p, id: Date.now() + Math.random() })),
        factures: allPrevisions[prevKey].factures.map(p => ({ ...p, id: Date.now() + Math.random() })),
        depenses: allPrevisions[prevKey].depenses.map(p => ({ ...p, id: Date.now() + Math.random() })),
        epargnes: allPrevisions[prevKey].epargnes.map(p => ({ ...p, id: Date.now() + Math.random() }))
      };
      savePrevisions({ ...allPrevisions, [currentKey]: copied });
    }
  };

  // Obtenir les catégories selon le type
  const getCategoriesForType = (type: 'revenus' | 'factures' | 'depenses' | 'epargnes') => {
    switch (type) {
      case 'revenus': return parametres.categoriesRevenus;
      case 'factures': return parametres.categoriesFactures;
      case 'depenses': return parametres.categoriesDepenses;
      case 'epargnes': return parametres.categoriesEpargnes;
    }
  };

  // Obtenir le réel par catégorie
  const getReelByCategorie = (type: string, categorie: string) => {
    return filteredTransactions
      .filter(t => t.type === type && t.categorie === categorie)
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  };

  // Composant carte prévision
  const PrevisionCard = ({ title, prevu, reel, icon: Icon, colorClass = "text-[#D4AF37]" }: { title: string; prevu: number; reel: number; icon: any; colorClass?: string }) => {
    const ecart = reel - prevu;
    const pourcentage = prevu > 0 ? Math.min((reel / prevu) * 100, 100) : 0;
    
    return (
      <div className={cardStyle}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className={cardTitleStyle}>{title}</p>
            <p className={amountLargeStyle + " mt-1"}>{reel.toFixed(2)} €</p>
          </div>
          <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/50">
            <Icon className="w-5 h-5 text-[#D4AF37]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={smallTextStyle}>Prévu</span>
            <span className={valueStyle}>{prevu.toFixed(2)} €</span>
          </div>
          <div className="w-full bg-[#722F37]/50 rounded-full h-2">
            <div className="bg-[#D4AF37] h-2 rounded-full transition-all" style={{ width: `${pourcentage}%` }} />
          </div>
          <div className="flex justify-between">
            <span className={smallTextStyle}>Écart</span>
            <span className={`${valueStyle} ${ecart >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {ecart >= 0 ? '+' : ''}{ecart.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Section pour saisir les prévisions
  const PrevisionSection = ({ 
    title, 
    type, 
    items, 
    icon: Icon,
    typeTransaction 
  }: { 
    title: string; 
    type: 'revenus' | 'factures' | 'depenses' | 'epargnes'; 
    items: PrevisionItem[]; 
    icon: any;
    typeTransaction: string;
  }) => {
    const total = items.reduce((sum, p) => sum + p.montantPrevu, 0);
    const totalReel = filteredTransactions.filter(t => t.type === typeTransaction).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center border border-[#D4AF37]/50">
              <Icon className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className={sectionTitleStyle}>{title}</h3>
              <p className={smallTextStyle}>Prévu: {total.toFixed(2)} € | Réel: {totalReel.toFixed(2)} €</p>
            </div>
          </div>
          <button
            onClick={() => { setAddFormType(type); setShowAddForm(true); setEditingId(null); setNewCategorie(''); setNewMontant(''); }}
            className="p-2 bg-[#D4AF37] text-[#722F37] rounded-xl"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={cardStyle + " text-center py-6"}>
            <p className={pageSubtitleStyle}>Aucune prévision</p>
            <p className={smallTextStyle}>Cliquez sur + pour ajouter</p>
          </div>
        ) : (
          <div className={cardStyle + " p-0 overflow-hidden"}>
            <div className="divide-y divide-[#D4AF37]/20">
              {items.map((item) => {
                const reel = getReelByCategorie(typeTransaction, item.categorie);
                const ecart = reel - item.montantPrevu;
                return (
                  <div key={item.id} className="p-3 flex items-center justify-between">
                    <div className="flex-1">
                      <p className={valueStyle}>{item.categorie}</p>
                      <div className="flex gap-3 mt-1">
                        <span className={smallTextStyle}>Prévu: {item.montantPrevu.toFixed(2)} €</span>
                        <span className={smallTextStyle}>Réel: {reel.toFixed(2)} €</span>
                        <span className={`${smallTextStyle} ${ecart >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ({ecart >= 0 ? '+' : ''}{ecart.toFixed(2)} €)
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEditPrevision(type, item)} className="p-1.5 hover:bg-[#D4AF37]/20 rounded-lg">
                        <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                      </button>
                      <button onClick={() => handleDeletePrevision(type, item.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-[#722F37]/50 p-3 flex justify-between border-t border-[#D4AF37]/30">
              <span className={valueStyle}>Total</span>
              <span className={valueStyle + " font-bold"}>{total.toFixed(2)} €</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Vue d'ensemble
  const renderVue = () => (
    <div className="space-y-4">
      {/* Bouton copier mois précédent */}
      {previsions.revenus.length === 0 && previsions.factures.length === 0 && (
        <button
          onClick={copyFromPreviousMonth}
          className="w-full py-3 border border-[#D4AF37]/50 text-[#D4AF37] rounded-xl text-sm flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Copier les prévisions du mois précédent
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        <PrevisionCard title="Revenus" prevu={totalRevenusPrev} reel={totalRevenusReel} icon={TrendingUp} />
        <PrevisionCard title="Factures" prevu={totalFacturesPrev} reel={totalFacturesReel} icon={HomeIcon} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <PrevisionCard title="Dépenses" prevu={totalDepensesPrev} reel={totalDepensesReel} icon={ShoppingBag} />
        <PrevisionCard title="Épargne" prevu={totalEpargnesPrev} reel={totalEpargnesReel} icon={PiggyBank} />
      </div>
      
      {/* Solde */}
      <div className={cardStyle + " text-center"}>
        <p className={pageSubtitleStyle + " mb-2"}>Solde du mois</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={smallTextStyle}>Prévu</p>
            <p className={`${amountMediumStyle} ${soldePrevu >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {soldePrevu >= 0 ? '+' : ''}{soldePrevu.toFixed(2)} €
            </p>
          </div>
          <div>
            <p className={smallTextStyle}>Réel</p>
            <p className={`${amountMediumStyle} ${soldeReel >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {soldeReel >= 0 ? '+' : ''}{soldeReel.toFixed(2)} €
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#D4AF37]/20">
          <p className={smallTextStyle}>Écart</p>
          <p className={`${amountLargeStyle} ${(soldeReel - soldePrevu) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {(soldeReel - soldePrevu) >= 0 ? '+' : ''}{(soldeReel - soldePrevu).toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Conseils */}
      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-[#7DD3A8]" />
          <h4 className={conseilTitleStyle}>💡 Conseils du mois</h4>
        </div>
        <div className="space-y-2">
          {totalRevenusPrev === 0 && (
            <p className={conseilTextStyle}>📝 Ajoutez vos revenus prévus dans l'onglet "Revenus"</p>
          )}
          {totalFacturesPrev === 0 && totalRevenusPrev > 0 && (
            <p className={conseilTextStyle}>📝 N'oubliez pas d'ajouter vos factures prévues</p>
          )}
          {totalDepensesPrev === 0 && totalRevenusPrev > 0 && (
            <p className={conseilTextStyle}>📝 Pensez à prévoir un budget pour vos dépenses variables</p>
          )}
          {totalRevenusReel < totalRevenusPrev && totalRevenusPrev > 0 && (
            <p className={conseilTextStyle}>⚠️ Revenus inférieurs de {(totalRevenusPrev - totalRevenusReel).toFixed(2)} € au prévu</p>
          )}
          {totalDepensesReel > totalDepensesPrev && totalDepensesPrev > 0 && (
            <p className={conseilTextStyle}>⚠️ Dépenses supérieures de {(totalDepensesReel - totalDepensesPrev).toFixed(2)} € au prévu</p>
          )}
          {soldeReel > soldePrevu && soldePrevu !== 0 && (
            <p className={conseilTextStyle}>✅ Excellent ! Vous êtes au-dessus de vos prévisions !</p>
          )}
          {totalEpargnesPrev > 0 && totalEpargnesReel < totalEpargnesPrev && (
            <p className={conseilTextStyle}>💰 Vous pouvez encore épargner {(totalEpargnesPrev - totalEpargnesReel).toFixed(2)} € ce mois</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderRevenus = () => (
    <PrevisionSection 
      title="Revenus prévus" 
      type="revenus" 
      items={previsions.revenus} 
      icon={TrendingUp}
      typeTransaction="Revenus"
    />
  );

  const renderFactures = () => (
    <PrevisionSection 
      title="Factures prévues" 
      type="factures" 
      items={previsions.factures} 
      icon={HomeIcon}
      typeTransaction="Factures"
    />
  );

  const renderDepenses = () => (
    <PrevisionSection 
      title="Dépenses prévues" 
      type="depenses" 
      items={previsions.depenses} 
      icon={ShoppingBag}
      typeTransaction="Dépenses"
    />
  );

  const renderEpargne = () => (
    <PrevisionSection 
      title="Épargne prévue" 
      type="epargnes" 
      items={previsions.epargnes} 
      icon={PiggyBank}
      typeTransaction="Épargnes"
    />
  );

  const renderAnalyse = () => {
    const categories = [
      { label: 'Revenus', prevu: totalRevenusPrev, reel: totalRevenusReel, type: 'revenus' },
      { label: 'Factures', prevu: totalFacturesPrev, reel: totalFacturesReel, type: 'factures' },
      { label: 'Dépenses', prevu: totalDepensesPrev, reel: totalDepensesReel, type: 'depenses' },
      { label: 'Épargne', prevu: totalEpargnesPrev, reel: totalEpargnesReel, type: 'epargnes' },
    ];

    return (
      <div className="space-y-4">
        <div className={cardStyle}>
          <h3 className={sectionTitleStyle + " mb-4"}>📊 Analyse comparative</h3>
          <div className="space-y-4">
            {categories.map((cat) => {
              const ecart = cat.reel - cat.prevu;
              const pourcentage = cat.prevu > 0 ? ((cat.reel / cat.prevu) * 100).toFixed(0) : 0;
              return (
                <div key={cat.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={valueStyle}>{cat.label}</span>
                    <span className={`${smallTextStyle} ${ecart >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pourcentage}% ({ecart >= 0 ? '+' : ''}{ecart.toFixed(2)} €)
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 bg-[#722F37]/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-[#D4AF37] h-3 rounded-full transition-all" 
                        style={{ width: `${Math.min(Number(pourcentage), 100)}%` }} 
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className={smallTextStyle}>Prévu: {cat.prevu.toFixed(2)} €</span>
                    <span className={smallTextStyle}>Réel: {cat.reel.toFixed(2)} €</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={cardStyle + " text-center"}>
          <p className={pageSubtitleStyle + " mb-2"}>Bilan du mois</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className={smallTextStyle}>Budget total prévu</p>
              <p className={amountMediumStyle}>{(totalFacturesPrev + totalDepensesPrev + totalEpargnesPrev).toFixed(2)} €</p>
            </div>
            <div>
              <p className={smallTextStyle}>Dépensé réel</p>
              <p className={amountMediumStyle}>{(totalFacturesReel + totalDepensesReel + totalEpargnesReel).toFixed(2)} €</p>
            </div>
          </div>
          <div className="pt-3 border-t border-[#D4AF37]/20">
            <p className={smallTextStyle}>Reste disponible</p>
            <p className={`text-2xl font-bold ${soldeReel >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {soldeReel >= 0 ? '+' : ''}{soldeReel.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>
    );
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'vue', label: 'Vue' },
    { id: 'revenus', label: 'Revenus' },
    { id: 'factures', label: 'Factures' },
    { id: 'depenses', label: 'Dépenses' },
    { id: 'epargne', label: 'Épargne' },
    { id: 'analyse', label: 'Analyse' },
  ];

  return (
    <div className="pb-4">
      {/* Titre */}
      <div className="text-center mb-4">
        <h1 className={pageTitleStyle}>Prévisionnel</h1>
        <p className={pageSubtitleStyle}>Comparaison prévu vs réel</p>
      </div>

      {/* Sélecteur de mois */}
      <div className={cardStyle + " mb-4"}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5 text-[#D4AF37]" /></button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#D4AF37]">{monthsFull[selectedMonth]}</span>
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

      {/* Onglets */}
      <div className="bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-1 shadow-sm mb-4 flex border border-[#D4AF37]/40 overflow-x-auto">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-[#D4AF37] text-[#722F37]' 
                : 'text-[#D4AF37]/70 hover:bg-[#D4AF37]/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {activeTab === 'vue' && renderVue()}
      {activeTab === 'revenus' && renderRevenus()}
      {activeTab === 'factures' && renderFactures()}
      {activeTab === 'depenses' && renderDepenses()}
      {activeTab === 'epargne' && renderEpargne()}
      {activeTab === 'analyse' && renderAnalyse()}

      {/* Modal d'ajout */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#8B4557] rounded-2xl p-4 w-full max-w-md border border-[#D4AF37]/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className={pageTitleStyle}>
                {editingId ? 'Modifier' : 'Ajouter'} {addFormType === 'revenus' ? 'un revenu' : addFormType === 'factures' ? 'une facture' : addFormType === 'depenses' ? 'une dépense' : 'une épargne'}
              </h2>
              <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="p-1">
                <X className="w-5 h-5 text-[#D4AF37]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelStyle}>Catégorie</label>
                <select
                  value={newCategorie}
                  onChange={(e) => setNewCategorie(e.target.value)}
                  className={selectStyle}
                >
                  <option value="">Sélectionner...</option>
                  {getCategoriesForType(addFormType).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelStyle}>Montant prévu (€)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newMontant}
                  onChange={(e) => setNewMontant(e.target.value)}
                  className={inputStyle}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowAddForm(false); setEditingId(null); }}
                  className="flex-1 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleAddPrevision(addFormType)}
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
    </div>
  );
}

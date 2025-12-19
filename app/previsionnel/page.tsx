"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, PiggyBank, Home as HomeIcon, ShoppingBag } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';
import { Confetti } from '@/components/ui';
import {
  PageHeader,
  MonthSelector,
  TabsNavigation,
  PrevisionCard,
  PrevisionSection,
  SoldeCard,
  AnalyseTab,
  PrevisionFormModal,
  SkeletonPrevisionnel,
  TabType
} from './components';

// Types
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

// Constantes
const defaultParametres: ParametresData = {
  devise: '€',
  categoriesRevenus: ['Salaire', 'Revenus Secondaires', 'Allocations', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Internet', 'Mobile', 'Assurance'],
  categoriesDepenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Autres Dépenses'],
  categoriesEpargnes: ['Livret A', 'Épargne', 'Objectifs']
};

function PrevisionnelContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [activeTab, setActiveTab] = useState<TabType>('vue');
  const [allPrevisions, setAllPrevisions] = useState<Record<string, PrevisionsMois>>({});
  
  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormType, setAddFormType] = useState<'revenus' | 'factures' | 'depenses' | 'epargnes'>('revenus');
  const [newCategorie, setNewCategorie] = useState('');
  const [newMontant, setNewMontant] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Confettis state
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Helpers
  const getMonthKey = useCallback(() => 
    `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`,
    [selectedYear, selectedMonth]
  );

  // Load data
  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    
    const savedPrevisions = localStorage.getItem('budget-previsions-v2');
    if (savedPrevisions) setAllPrevisions(JSON.parse(savedPrevisions));
    
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
    
    // Simuler un court délai de chargement
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // Save previsions
  const savePrevisions = useCallback((newPrevisions: Record<string, PrevisionsMois>) => {
    setAllPrevisions(newPrevisions);
    localStorage.setItem('budget-previsions-v2', JSON.stringify(newPrevisions));
  }, []);

  // Current previsions (memoized)
  const previsions = useMemo((): PrevisionsMois => {
    const key = getMonthKey();
    return allPrevisions[key] || { revenus: [], factures: [], depenses: [], epargnes: [] };
  }, [allPrevisions, getMonthKey]);

  // Filtered transactions (memoized)
  const filteredTransactions = useMemo(() => 
    transactions.filter(t => t.date?.startsWith(getMonthKey())),
    [transactions, getMonthKey]
  );

  // Totaux réels (memoized)
  const totalsReel = useMemo(() => ({
    revenus: filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0),
    factures: filteredTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0),
    depenses: filteredTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0),
    epargnes: filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0),
  }), [filteredTransactions]);

  // Totaux prévus (memoized)
  const totalsPrevu = useMemo(() => ({
    revenus: previsions.revenus.reduce((sum, p) => sum + p.montantPrevu, 0),
    factures: previsions.factures.reduce((sum, p) => sum + p.montantPrevu, 0),
    depenses: previsions.depenses.reduce((sum, p) => sum + p.montantPrevu, 0),
    epargnes: previsions.epargnes.reduce((sum, p) => sum + p.montantPrevu, 0),
  }), [previsions]);

  // Soldes (memoized)
  const soldes = useMemo(() => ({
    prevu: totalsPrevu.revenus - totalsPrevu.factures - totalsPrevu.depenses - totalsPrevu.epargnes,
    reel: totalsReel.revenus - totalsReel.factures - totalsReel.depenses - totalsReel.epargnes,
  }), [totalsPrevu, totalsReel]);

  // Categories for form
  const getCategoriesForType = useCallback((type: 'revenus' | 'factures' | 'depenses' | 'epargnes') => {
    switch (type) {
      case 'revenus': return parametres.categoriesRevenus || [];
      case 'factures': return parametres.categoriesFactures || [];
      case 'depenses': return parametres.categoriesDepenses || [];
      case 'epargnes': return parametres.categoriesEpargnes || [];
    }
  }, [parametres]);

  // Ajouter une nouvelle catégorie
  const handleAddCategory = useCallback((name: string) => {
    const newParams = { ...parametres };
    switch (addFormType) {
      case 'revenus':
        if (!newParams.categoriesRevenus.includes(name)) {
          newParams.categoriesRevenus = [...newParams.categoriesRevenus, name];
        }
        break;
      case 'factures':
        if (!newParams.categoriesFactures.includes(name)) {
          newParams.categoriesFactures = [...newParams.categoriesFactures, name];
        }
        break;
      case 'depenses':
        if (!newParams.categoriesDepenses.includes(name)) {
          newParams.categoriesDepenses = [...newParams.categoriesDepenses, name];
        }
        break;
      case 'epargnes':
        if (!newParams.categoriesEpargnes.includes(name)) {
          newParams.categoriesEpargnes = [...newParams.categoriesEpargnes, name];
        }
        break;
    }
    setParametres(newParams);
    localStorage.setItem('budget-parametres', JSON.stringify(newParams));
  }, [parametres, addFormType]);

  // Get reel by categorie
  const getReelByCategorie = useCallback((typeTransaction: string, categorie: string) => {
    return filteredTransactions
      .filter(t => t.type === typeTransaction && t.categorie === categorie)
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  }, [filteredTransactions]);

  // Handlers
  const handleAddPrevision = useCallback(() => {
    if (!newCategorie || !newMontant) return;
    
    const key = getMonthKey();
    const current = allPrevisions[key] || { revenus: [], factures: [], depenses: [], epargnes: [] };
    
    if (editingId !== null) {
      current[addFormType] = current[addFormType].map(p => 
        p.id === editingId ? { ...p, categorie: newCategorie, montantPrevu: parseFloat(newMontant) } : p
      );
    } else {
      current[addFormType] = [...current[addFormType], { 
        id: Date.now(), 
        categorie: newCategorie, 
        montantPrevu: parseFloat(newMontant) 
      }];
      // Confettis pour nouvelle prévision
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    savePrevisions({ ...allPrevisions, [key]: current });
    setNewCategorie('');
    setNewMontant('');
    setEditingId(null);
    setShowAddForm(false);
  }, [newCategorie, newMontant, editingId, addFormType, getMonthKey, allPrevisions, savePrevisions]);

  const handleDeletePrevision = useCallback((type: 'revenus' | 'factures' | 'depenses' | 'epargnes', id: number) => {
    const key = getMonthKey();
    const current = allPrevisions[key];
    if (!current) return;
    
    current[type] = current[type].filter(p => p.id !== id);
    savePrevisions({ ...allPrevisions, [key]: current });
  }, [getMonthKey, allPrevisions, savePrevisions]);

  const handleEditPrevision = useCallback((type: 'revenus' | 'factures' | 'depenses' | 'epargnes', item: PrevisionItem) => {
    setAddFormType(type);
    setNewCategorie(item.categorie);
    setNewMontant(item.montantPrevu.toString());
    setEditingId(item.id);
    setShowAddForm(true);
  }, []);

  const openAddForm = useCallback((type: 'revenus' | 'factures' | 'depenses' | 'epargnes') => {
    setAddFormType(type);
    setNewCategorie('');
    setNewMontant('');
    setEditingId(null);
    setShowAddForm(true);
  }, []);

  const copyFromPreviousMonth = useCallback(() => {
    const prevMonthIndex = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const prevKey = `${prevYear}-${(prevMonthIndex + 1).toString().padStart(2, '0')}`;
    const currentKey = getMonthKey();
    
    if (allPrevisions[prevKey] && (
      allPrevisions[prevKey].revenus.length > 0 ||
      allPrevisions[prevKey].factures.length > 0 ||
      allPrevisions[prevKey].depenses.length > 0 ||
      allPrevisions[prevKey].epargnes.length > 0
    )) {
      const copied: PrevisionsMois = {
        revenus: allPrevisions[prevKey].revenus.map(p => ({ ...p, id: Date.now() + Math.random() * 1000 })),
        factures: allPrevisions[prevKey].factures.map(p => ({ ...p, id: Date.now() + Math.random() * 1000 })),
        depenses: allPrevisions[prevKey].depenses.map(p => ({ ...p, id: Date.now() + Math.random() * 1000 })),
        epargnes: allPrevisions[prevKey].epargnes.map(p => ({ ...p, id: Date.now() + Math.random() * 1000 }))
      };
      savePrevisions({ ...allPrevisions, [currentKey]: copied });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setToastMessage('✅ Prévisions copiées avec succès !');
      setShowToast(true);
    } else {
      setToastMessage('⚠️ Aucune prévision à copier du mois précédent');
      setShowToast(true);
    }
  }, [selectedMonth, selectedYear, getMonthKey, allPrevisions, savePrevisions]);

  // Analyse categories (memoized)
  const analyseCategories = useMemo(() => [
    { label: 'Revenus', prevu: totalsPrevu.revenus, reel: totalsReel.revenus },
    { label: 'Factures', prevu: totalsPrevu.factures, reel: totalsReel.factures },
    { label: 'Dépenses', prevu: totalsPrevu.depenses, reel: totalsReel.depenses },
    { label: 'Épargne', prevu: totalsPrevu.epargnes, reel: totalsReel.epargnes },
  ], [totalsPrevu, totalsReel]);

  // Loading state
  if (isLoading) {
    return <SkeletonPrevisionnel />;
  }

  // Counts pour les badges
  const tabCounts = {
    revenus: previsions.revenus.length,
    factures: previsions.factures.length,
    depenses: previsions.depenses.length,
    epargnes: previsions.epargnes.length,
  };

  return (
    <>
      {/* Confettis */}
      <Confetti trigger={showConfetti} />
      
      {/* Toast notification */}
      {showToast && (
        <div 
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl animate-fadeIn backdrop-blur-md"
          style={{ 
            background: toastMessage.includes('✅') 
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95))' 
              : 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95))',
            color: '#FFFFFF',
            boxShadow: toastMessage.includes('✅')
              ? '0 8px 32px rgba(34, 197, 94, 0.4)'
              : '0 8px 32px rgba(245, 158, 11, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}
      
      <div className="pb-4">
        {/* Header */}
        <PageHeader />

        {/* Month Selector */}
        <MonthSelector
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
        />

        {/* Tabs Navigation avec badges */}
        <TabsNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          counts={tabCounts}
        />

        {/* Tab Content */}
        {activeTab === 'vue' && (
          <div className="space-y-4">
            {/* Bouton copier */}
            {previsions.revenus.length === 0 && previsions.factures.length === 0 && (
              <button 
                onClick={copyFromPreviousMonth} 
                className="w-full py-3 border rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] hover:bg-white/5 animate-fadeIn"
                style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}
              >
                <TrendingUp className="w-4 h-4" />
                Copier les prévisions du mois précédent
              </button>
            )}
            
            {/* Cards */}
            <div className="grid grid-cols-2 gap-3">
              <PrevisionCard title="Revenus" prevu={totalsPrevu.revenus} reel={totalsReel.revenus} icon={TrendingUp} devise={parametres.devise} index={0} />
              <PrevisionCard title="Factures" prevu={totalsPrevu.factures} reel={totalsReel.factures} icon={HomeIcon} devise={parametres.devise} index={1} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PrevisionCard title="Dépenses" prevu={totalsPrevu.depenses} reel={totalsReel.depenses} icon={ShoppingBag} devise={parametres.devise} index={2} />
              <PrevisionCard title="Épargne" prevu={totalsPrevu.epargnes} reel={totalsReel.epargnes} icon={PiggyBank} devise={parametres.devise} index={3} />
            </div>
            
            {/* Solde Card */}
            <SoldeCard soldePrevu={soldes.prevu} soldeReel={soldes.reel} devise={parametres.devise} />
            
            {/* SmartTips */}
            <SmartTips page="previsionnel" />
          </div>
        )}

        {activeTab === 'revenus' && (
          <PrevisionSection
            title="Revenus prévus"
            type="revenus"
            items={previsions.revenus}
            icon={TrendingUp}
            totalReel={totalsReel.revenus}
            devise={parametres.devise}
            onAdd={() => openAddForm('revenus')}
            onEdit={(item: PrevisionItem) => handleEditPrevision('revenus', item)}
            onDelete={(id: number) => handleDeletePrevision('revenus', id)}
            getReelByCategorie={(cat: string) => getReelByCategorie('Revenus', cat)}
          />
        )}

        {activeTab === 'factures' && (
          <PrevisionSection
            title="Factures prévues"
            type="factures"
            items={previsions.factures}
            icon={HomeIcon}
            totalReel={totalsReel.factures}
            devise={parametres.devise}
            onAdd={() => openAddForm('factures')}
            onEdit={(item: PrevisionItem) => handleEditPrevision('factures', item)}
            onDelete={(id: number) => handleDeletePrevision('factures', id)}
            getReelByCategorie={(cat: string) => getReelByCategorie('Factures', cat)}
          />
        )}

        {activeTab === 'depenses' && (
          <PrevisionSection
            title="Dépenses prévues"
            type="depenses"
            items={previsions.depenses}
            icon={ShoppingBag}
            totalReel={totalsReel.depenses}
            devise={parametres.devise}
            onAdd={() => openAddForm('depenses')}
            onEdit={(item: PrevisionItem) => handleEditPrevision('depenses', item)}
            onDelete={(id: number) => handleDeletePrevision('depenses', id)}
            getReelByCategorie={(cat: string) => getReelByCategorie('Dépenses', cat)}
          />
        )}

        {activeTab === 'epargne' && (
          <PrevisionSection
            title="Épargne prévue"
            type="epargnes"
            items={previsions.epargnes}
            icon={PiggyBank}
            totalReel={totalsReel.epargnes}
            devise={parametres.devise}
            onAdd={() => openAddForm('epargnes')}
            onEdit={(item: PrevisionItem) => handleEditPrevision('epargnes', item)}
            onDelete={(id: number) => handleDeletePrevision('epargnes', id)}
            getReelByCategorie={(cat: string) => getReelByCategorie('Épargnes', cat)}
          />
        )}

        {activeTab === 'analyse' && (
          <AnalyseTab
            categories={analyseCategories}
            totalBudgetPrevu={totalsPrevu.factures + totalsPrevu.depenses + totalsPrevu.epargnes}
            totalDepenseReel={totalsReel.factures + totalsReel.depenses + totalsReel.epargnes}
            soldeReel={soldes.reel}
            devise={parametres.devise}
          />
        )}
      </div>

      {/* Modal Form */}
      <PrevisionFormModal
        isOpen={showAddForm}
        onClose={() => { setShowAddForm(false); setEditingId(null); }}
        onSubmit={handleAddPrevision}
        type={addFormType}
        categorie={newCategorie}
        montant={newMontant}
        onCategorieChange={setNewCategorie}
        onMontantChange={setNewMontant}
        categories={getCategoriesForType(addFormType)}
        isEditing={editingId !== null}
        onAddCategory={handleAddCategory}
      />
    </>
  );
}

export default function PrevisionnelPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') router.push('/');
    else router.push(`/${page}`);
  };

  return (
    <AppShell currentPage="previsionnel" onNavigate={handleNavigate}>
      <PrevisionnelContent />
    </AppShell>
  );
}

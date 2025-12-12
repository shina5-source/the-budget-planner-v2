"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, PiggyBank, Lightbulb, Plus, Trash2, Edit3, Check, X, Home as HomeIcon, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell } from '@/components';

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
  categoriesRevenus: ['Salaire', 'Revenus Secondaires', 'Allocations', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Internet', 'Mobile', 'Assurance'],
  categoriesDepenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Autres Dépenses'],
  categoriesEpargnes: ['Livret A', 'Épargne', 'Objectifs']
};

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

type TabType = 'vue' | 'revenus' | 'factures' | 'depenses' | 'epargne' | 'analyse';

function PrevisionnelContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [activeTab, setActiveTab] = useState<TabType>('vue');
  const [allPrevisions, setAllPrevisions] = useState<Record<string, PrevisionsMois>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormType, setAddFormType] = useState<'revenus' | 'factures' | 'depenses' | 'epargnes'>('revenus');
  const [newCategorie, setNewCategorie] = useState('');
  const [newMontant, setNewMontant] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

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

  const getCurrentPrevisions = (): PrevisionsMois => {
    const key = getMonthKey();
    return allPrevisions[key] || { revenus: [], factures: [], depenses: [], epargnes: [] };
  };

  const filteredTransactions = transactions.filter(t => t.date?.startsWith(getMonthKey()));
  const totalRevenusReel = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalFacturesReel = filteredTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalDepensesReel = filteredTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEpargnesReel = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);

  const previsions = getCurrentPrevisions();
  const totalRevenusPrev = previsions.revenus.reduce((sum, p) => sum + p.montantPrevu, 0);
  const totalFacturesPrev = previsions.factures.reduce((sum, p) => sum + p.montantPrevu, 0);
  const totalDepensesPrev = previsions.depenses.reduce((sum, p) => sum + p.montantPrevu, 0);
  const totalEpargnesPrev = previsions.epargnes.reduce((sum, p) => sum + p.montantPrevu, 0);

  const soldePrevu = totalRevenusPrev - totalFacturesPrev - totalDepensesPrev - totalEpargnesPrev;
  const soldeReel = totalRevenusReel - totalFacturesReel - totalDepensesReel - totalEpargnesReel;

  const prevMonth = () => { if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); } else setSelectedMonth(selectedMonth - 1); };
  const nextMonth = () => { if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); } else setSelectedMonth(selectedMonth + 1); };

  const handleAddPrevision = (type: 'revenus' | 'factures' | 'depenses' | 'epargnes') => {
    if (!newCategorie || !newMontant) return;
    const key = getMonthKey();
    const current = allPrevisions[key] || { revenus: [], factures: [], depenses: [], epargnes: [] };
    if (editingId !== null) {
      current[type] = current[type].map(p => p.id === editingId ? { ...p, categorie: newCategorie, montantPrevu: parseFloat(newMontant) } : p);
    } else {
      current[type] = [...current[type], { id: Date.now(), categorie: newCategorie, montantPrevu: parseFloat(newMontant) }];
    }
    savePrevisions({ ...allPrevisions, [key]: current });
    setNewCategorie(''); setNewMontant(''); setEditingId(null); setShowAddForm(false);
  };

  const handleDeletePrevision = (type: 'revenus' | 'factures' | 'depenses' | 'epargnes', id: number) => {
    const key = getMonthKey();
    const current = allPrevisions[key];
    if (!current) return;
    current[type] = current[type].filter(p => p.id !== id);
    savePrevisions({ ...allPrevisions, [key]: current });
  };

  const handleEditPrevision = (type: 'revenus' | 'factures' | 'depenses' | 'epargnes', item: PrevisionItem) => {
    setAddFormType(type); setNewCategorie(item.categorie); setNewMontant(item.montantPrevu.toString()); setEditingId(item.id); setShowAddForm(true);
  };

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

  const getCategoriesForType = (type: 'revenus' | 'factures' | 'depenses' | 'epargnes') => {
    switch (type) {
      case 'revenus': return parametres.categoriesRevenus || [];
      case 'factures': return parametres.categoriesFactures || [];
      case 'depenses': return parametres.categoriesDepenses || [];
      case 'epargnes': return parametres.categoriesEpargnes || [];
    }
  };

  const getReelByCategorie = (type: string, categorie: string) => {
    return filteredTransactions.filter(t => t.type === type && t.categorie === categorie).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PrevisionCard = ({ title, prevu, reel, icon: Icon }: { title: string; prevu: number; reel: number; icon: any }) => {
    const ecart = reel - prevu;
    const pourcentage = prevu > 0 ? Math.min((reel / prevu) * 100, 100) : 0;
    return (
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <div className="flex items-start justify-between mb-3">
          <div><p className="text-xs" style={textSecondary}>{title}</p><p className="text-2xl font-semibold mt-1" style={textPrimary}>{reel.toFixed(2)} €</p></div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}><Icon className="w-5 h-5" style={textPrimary} /></div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between"><span className="text-[10px]" style={textSecondary}>Prévu</span><span className="text-xs font-medium" style={textPrimary}>{prevu.toFixed(2)} €</span></div>
          <div className="w-full rounded-full h-2" style={{ background: theme.colors.cardBackgroundLight }}><div className="h-2 rounded-full transition-all" style={{ width: `${pourcentage}%`, background: theme.colors.primary }} /></div>
          <div className="flex justify-between"><span className="text-[10px]" style={textSecondary}>Écart</span><span className={`text-xs font-medium ${ecart >= 0 ? 'text-green-400' : 'text-red-400'}`}>{ecart >= 0 ? '+' : ''}{ecart.toFixed(2)} €</span></div>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PrevisionSection = ({ title, type, items, icon: Icon, typeTransaction }: { title: string; type: 'revenus' | 'factures' | 'depenses' | 'epargnes'; items: PrevisionItem[]; icon: any; typeTransaction: string }) => {
    const total = items.reduce((sum, p) => sum + p.montantPrevu, 0);
    const totalReel = filteredTransactions.filter(t => t.type === typeTransaction).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}><Icon className="w-5 h-5" style={textPrimary} /></div>
            <div><h3 className="text-sm font-semibold" style={textPrimary}>{title}</h3><p className="text-[10px]" style={textSecondary}>Prévu: {total.toFixed(2)} € | Réel: {totalReel.toFixed(2)} €</p></div>
          </div>
          <button onClick={() => { setAddFormType(type); setShowAddForm(true); setEditingId(null); setNewCategorie(''); setNewMontant(''); }} className="p-2 rounded-xl" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Plus className="w-4 h-4" /></button>
        </div>
        {items.length === 0 ? (
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center py-6" style={cardStyle}><p className="text-xs" style={textSecondary}>Aucune prévision</p><p className="text-[10px]" style={textSecondary}>Cliquez sur + pour ajouter</p></div>
        ) : (
          <div className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden p-0" style={cardStyle}>
            <div>{items.map((item, index) => { const reel = getReelByCategorie(typeTransaction, item.categorie); const ecart = reel - item.montantPrevu; return (<div key={item.id} className="p-3 flex items-center justify-between" style={{ borderBottomWidth: index < items.length - 1 ? 1 : 0, borderColor: theme.colors.cardBorder }}><div className="flex-1"><p className="text-xs font-medium" style={textPrimary}>{item.categorie}</p><div className="flex gap-3 mt-1"><span className="text-[10px]" style={textSecondary}>Prévu: {item.montantPrevu.toFixed(2)} €</span><span className="text-[10px]" style={textSecondary}>Réel: {reel.toFixed(2)} €</span><span className={`text-[10px] ${ecart >= 0 ? 'text-green-400' : 'text-red-400'}`}>({ecart >= 0 ? '+' : ''}{ecart.toFixed(2)} €)</span></div></div><div className="flex gap-1"><button onClick={() => handleEditPrevision(type, item)} className="p-1.5 rounded-lg" style={{ background: `${theme.colors.primary}20` }}><Edit3 className="w-4 h-4" style={textPrimary} /></button><button onClick={() => handleDeletePrevision(type, item.id)} className="p-1.5 rounded-lg bg-red-500/20"><Trash2 className="w-4 h-4 text-red-400" /></button></div></div>); })}</div>
            <div className="p-3 flex justify-between" style={{ background: theme.colors.cardBackgroundLight, borderTopWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs font-medium" style={textPrimary}>Total</span><span className="text-xs font-bold" style={textPrimary}>{total.toFixed(2)} €</span></div>
          </div>
        )}
      </div>
    );
  };

  const renderVue = () => (
    <div className="space-y-4">
      {previsions.revenus.length === 0 && previsions.factures.length === 0 && (
        <button onClick={copyFromPreviousMonth} className="w-full py-3 border rounded-xl text-sm flex items-center justify-center gap-2" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}><TrendingUp className="w-4 h-4" />Copier les prévisions du mois précédent</button>
      )}
      <div className="grid grid-cols-2 gap-3"><PrevisionCard title="Revenus" prevu={totalRevenusPrev} reel={totalRevenusReel} icon={TrendingUp} /><PrevisionCard title="Factures" prevu={totalFacturesPrev} reel={totalFacturesReel} icon={HomeIcon} /></div>
      <div className="grid grid-cols-2 gap-3"><PrevisionCard title="Dépenses" prevu={totalDepensesPrev} reel={totalDepensesReel} icon={ShoppingBag} /><PrevisionCard title="Épargne" prevu={totalEpargnesPrev} reel={totalEpargnesReel} icon={PiggyBank} /></div>
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
        <p className="text-xs mb-2" style={textSecondary}>Solde du mois</p>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-[10px]" style={textSecondary}>Prévu</p><p className={`text-lg font-semibold ${soldePrevu >= 0 ? 'text-green-400' : 'text-red-400'}`}>{soldePrevu >= 0 ? '+' : ''}{soldePrevu.toFixed(2)} €</p></div>
          <div><p className="text-[10px]" style={textSecondary}>Réel</p><p className={`text-lg font-semibold ${soldeReel >= 0 ? 'text-green-400' : 'text-red-400'}`}>{soldeReel >= 0 ? '+' : ''}{soldeReel.toFixed(2)} €</p></div>
        </div>
        <div className="mt-3 pt-3" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}><p className="text-[10px]" style={textSecondary}>Écart</p><p className={`text-2xl font-semibold ${(soldeReel - soldePrevu) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{(soldeReel - soldePrevu) >= 0 ? '+' : ''}{(soldeReel - soldePrevu).toFixed(2)} €</p></div>
      </div>
      <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50">
        <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-[#7DD3A8]" /><h4 className="text-xs font-semibold text-[#7DD3A8]">💡 Conseils du mois</h4></div>
        <div className="space-y-2">
          {totalRevenusPrev === 0 && (<p className="text-[10px] text-[#7DD3A8]">📝 Ajoutez vos revenus prévus dans l&apos;onglet &quot;Revenus&quot;</p>)}
          {totalFacturesPrev === 0 && totalRevenusPrev > 0 && (<p className="text-[10px] text-[#7DD3A8]">📝 N&apos;oubliez pas d&apos;ajouter vos factures prévues</p>)}
          {totalRevenusReel < totalRevenusPrev && totalRevenusPrev > 0 && (<p className="text-[10px] text-[#7DD3A8]">⚠️ Revenus inférieurs de {(totalRevenusPrev - totalRevenusReel).toFixed(2)} € au prévu</p>)}
          {totalDepensesReel > totalDepensesPrev && totalDepensesPrev > 0 && (<p className="text-[10px] text-[#7DD3A8]">⚠️ Dépenses supérieures de {(totalDepensesReel - totalDepensesPrev).toFixed(2)} € au prévu</p>)}
          {soldeReel > soldePrevu && soldePrevu !== 0 && (<p className="text-[10px] text-[#7DD3A8]">✅ Excellent ! Vous êtes au-dessus de vos prévisions !</p>)}
        </div>
      </div>
    </div>
  );

  const renderAnalyse = () => {
    const categories = [{ label: 'Revenus', prevu: totalRevenusPrev, reel: totalRevenusReel }, { label: 'Factures', prevu: totalFacturesPrev, reel: totalFacturesReel }, { label: 'Dépenses', prevu: totalDepensesPrev, reel: totalDepensesReel }, { label: 'Épargne', prevu: totalEpargnesPrev, reel: totalEpargnesReel }];
    return (
      <div className="space-y-4">
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-4" style={textPrimary}>📊 Analyse comparative</h3>
          <div className="space-y-4">{categories.map((cat) => { const ecart = cat.reel - cat.prevu; const pourcentage = cat.prevu > 0 ? ((cat.reel / cat.prevu) * 100).toFixed(0) : 0; return (<div key={cat.label} className="space-y-2"><div className="flex justify-between items-center"><span className="text-xs font-medium" style={textPrimary}>{cat.label}</span><span className={`text-[10px] ${ecart >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pourcentage}% ({ecart >= 0 ? '+' : ''}{ecart.toFixed(2)} €)</span></div><div className="flex gap-2 items-center"><div className="flex-1 rounded-full h-3 overflow-hidden" style={{ background: theme.colors.cardBackgroundLight }}><div className="h-3 rounded-full transition-all" style={{ width: `${Math.min(Number(pourcentage), 100)}%`, background: theme.colors.primary }} /></div></div><div className="flex justify-between"><span className="text-[10px]" style={textSecondary}>Prévu: {cat.prevu.toFixed(2)} €</span><span className="text-[10px]" style={textSecondary}>Réel: {cat.reel.toFixed(2)} €</span></div></div>); })}</div>
        </div>
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
          <p className="text-xs mb-2" style={textSecondary}>Bilan du mois</p>
          <div className="grid grid-cols-2 gap-4 mb-4"><div><p className="text-[10px]" style={textSecondary}>Budget total prévu</p><p className="text-lg font-semibold" style={textPrimary}>{(totalFacturesPrev + totalDepensesPrev + totalEpargnesPrev).toFixed(2)} €</p></div><div><p className="text-[10px]" style={textSecondary}>Dépensé réel</p><p className="text-lg font-semibold" style={textPrimary}>{(totalFacturesReel + totalDepensesReel + totalEpargnesReel).toFixed(2)} €</p></div></div>
          <div className="pt-3" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}><p className="text-[10px]" style={textSecondary}>Reste disponible</p><p className={`text-2xl font-bold ${soldeReel >= 0 ? 'text-green-400' : 'text-red-400'}`}>{soldeReel >= 0 ? '+' : ''}{soldeReel.toFixed(2)} €</p></div>
        </div>
      </div>
    );
  };

  const tabs: { id: TabType; label: string }[] = [{ id: 'vue', label: 'Vue' }, { id: 'revenus', label: 'Revenus' }, { id: 'factures', label: 'Factures' }, { id: 'depenses', label: 'Dépenses' }, { id: 'epargne', label: 'Épargne' }, { id: 'analyse', label: 'Analyse' }];

  return (
    <>
      <div className="pb-4">
        <div className="text-center mb-4"><h1 className="text-lg font-medium" style={textPrimary}>Prévisionnel</h1><p className="text-xs" style={textSecondary}>Comparaison prévu vs réel</p></div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5" style={textPrimary} /></button>
            <div className="flex items-center gap-2"><span className="text-lg font-semibold" style={textPrimary}>{monthsFull[selectedMonth]}</span><select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="rounded-lg px-3 py-1 text-lg font-semibold border" style={inputStyle}>{years.map(year => (<option key={year} value={year}>{year}</option>))}</select></div>
            <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5" style={textPrimary} /></button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">{monthsShort.map((month, index) => (<button key={index} onClick={() => setSelectedMonth(index)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" style={selectedMonth === index ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>{month}</button>))}</div>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-1 shadow-sm mb-4 flex border overflow-x-auto" style={cardStyle}>{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap" style={activeTab === tab.id ? { background: theme.colors.primary, color: theme.colors.textOnPrimary } : { color: theme.colors.textSecondary }}>{tab.label}</button>))}</div>

        {activeTab === 'vue' && renderVue()}
        {activeTab === 'revenus' && <PrevisionSection title="Revenus prévus" type="revenus" items={previsions.revenus} icon={TrendingUp} typeTransaction="Revenus" />}
        {activeTab === 'factures' && <PrevisionSection title="Factures prévues" type="factures" items={previsions.factures} icon={HomeIcon} typeTransaction="Factures" />}
        {activeTab === 'depenses' && <PrevisionSection title="Dépenses prévues" type="depenses" items={previsions.depenses} icon={ShoppingBag} typeTransaction="Dépenses" />}
        {activeTab === 'epargne' && <PrevisionSection title="Épargne prévue" type="epargnes" items={previsions.epargnes} icon={PiggyBank} typeTransaction="Épargnes" />}
        {activeTab === 'analyse' && renderAnalyse()}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl p-4 w-full max-w-md border" style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium" style={textPrimary}>{editingId ? 'Modifier' : 'Ajouter'} {addFormType === 'revenus' ? 'un revenu' : addFormType === 'factures' ? 'une facture' : addFormType === 'depenses' ? 'une dépense' : 'une épargne'}</h2>
              <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="p-1"><X className="w-5 h-5" style={textPrimary} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs mb-1 block" style={textSecondary}>Catégorie</label><select value={newCategorie} onChange={(e) => setNewCategorie(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={inputStyle}><option value="">Sélectionner...</option>{getCategoriesForType(addFormType).map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select></div>
              <div><label className="text-xs mb-1 block" style={textSecondary}>Montant prévu (€)</label><input type="number" placeholder="0.00" value={newMontant} onChange={(e) => setNewMontant(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={inputStyle} /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="flex-1 py-3 border rounded-xl font-medium" style={{ borderColor: theme.colors.primary, color: theme.colors.textPrimary }}>Annuler</button>
                <button onClick={() => handleAddPrevision(addFormType)} className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-5 h-5" />{editingId ? 'Modifier' : 'Ajouter'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function PrevisionnelPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="previsionnel" onNavigate={handleNavigate}>
      <PrevisionnelContent />
    </AppShell>
  );
}
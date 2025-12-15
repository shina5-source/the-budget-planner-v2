"use client";

import { useState, useEffect } from 'react';
import { PiggyBank, TrendingUp, Target, Wallet, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, BarChart3, Building, Clock, PieChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  compte?: string;
}

interface CompteBancaire {
  id: number;
  nom: string;
  soldeDepart: number;
  isEpargne: boolean;
}

interface ParametresData {
  devise: string;
  comptesBancaires: CompteBancaire[];
}

const defaultParametres: ParametresData = {
  devise: '€',
  comptesBancaires: []
};

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 76 }, (_, i) => 2025 + i);

type TabType = 'resume' | 'mensuel' | 'analyse' | 'historique';
const ITEMS_PER_PAGE = 50;

function EpargnesContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [accordionState, setAccordionState] = useState<{ comptes: boolean; categories: boolean }>({ comptes: true, categories: false });

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
  }, []);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [selectedMonth, selectedYear]);

  const getMonthKey = () => `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
  const filteredTransactions = transactions.filter(t => t.date?.startsWith(getMonthKey()));

  const totalEpargnesMois = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalReprisesMois = filteredTransactions.filter(t => t.type === 'Reprise d\'épargne').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const netEpargneMois = totalEpargnesMois - totalReprisesMois;
  const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const tauxEpargne = totalRevenus > 0 ? ((totalEpargnesMois / totalRevenus) * 100).toFixed(1) : '0';

  const totalEpargneGlobale = transactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalReprisesGlobale = transactions.filter(t => t.type === 'Reprise d\'épargne').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const soldeEpargneGlobal = totalEpargneGlobale - totalReprisesGlobale;

  const epargnesParCategorie = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((acc, t) => {
    const cat = t.categorie;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += parseFloat(t.montant || '0');
    return acc;
  }, {} as { [key: string]: number });

  const comptesBancairesOnly = parametres.comptesBancaires;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoriesEpargnesOnly = ((parametres as any).categoriesEpargnes || [])
    .filter((cat: string) => !parametres.comptesBancaires.some(c => c.nom === cat))
    .map((cat: string, index: number) => ({ id: 1000 + index, nom: cat, soldeDepart: 0, isEpargne: true }));

  const comptesEpargne = [...comptesBancairesOnly.map(c => ({ id: c.id, nom: c.nom, soldeDepart: c.soldeDepart, isEpargne: c.isEpargne })), ...categoriesEpargnesOnly];

  const toggleAccordion = (section: 'comptes' | 'categories') => {
    setAccordionState(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getSoldeCompte = (compteNom: string) => {
    const compte = parametres.comptesBancaires.find(c => c.nom === compteNom);
    const soldeDepart = compte?.soldeDepart || 0;
    const epargnes = transactions.filter(t => t.type === 'Épargnes' && t.categorie === compteNom).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const reprises = transactions.filter(t => t.type === 'Reprise d\'épargne' && t.categorie === compteNom).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    return soldeDepart + epargnes - reprises;
  };

  const getEpargnesMoisPrecedents = (nombreMois: number) => {
    const result: number[] = [];
    const now = new Date();
    for (let i = 1; i <= nombreMois; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const epargnes = transactions.filter(t => t.type === 'Épargnes' && t.date?.startsWith(monthKey)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const reprises = transactions.filter(t => t.type === 'Reprise d\'épargne' && t.date?.startsWith(monthKey)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      result.push(epargnes - reprises);
    }
    return result;
  };

  const epargnes6DerniersMois = getEpargnesMoisPrecedents(6);
  const moyenneMensuelle = epargnes6DerniersMois.length > 0 ? epargnes6DerniersMois.reduce((a, b) => a + b, 0) / epargnes6DerniersMois.length : 0;
  const projection6Mois = soldeEpargneGlobal + (moyenneMensuelle * 6);
  const projection12Mois = soldeEpargneGlobal + (moyenneMensuelle * 12);

  const getStatsAnnee = () => {
    const anneeActuelle = selectedYear;
    let meilleurMois = { mois: '', montant: 0 };
    let totalAnnee = 0;
    let moisAvecEpargne = 0;

    for (let m = 0; m < 12; m++) {
      const monthKey = `${anneeActuelle}-${(m + 1).toString().padStart(2, '0')}`;
      const epargnes = transactions.filter(t => t.type === 'Épargnes' && t.date?.startsWith(monthKey)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const reprises = transactions.filter(t => t.type === 'Reprise d\'épargne' && t.date?.startsWith(monthKey)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const net = epargnes - reprises;
      totalAnnee += net;
      if (net > 0) moisAvecEpargne++;
      if (net > meilleurMois.montant) meilleurMois = { mois: monthsFull[m], montant: net };
    }

    const moyenneAnnee = moisAvecEpargne > 0 ? totalAnnee / moisAvecEpargne : 0;
    const moisPrecedent = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const anneePrecedent = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const monthKeyPrecedent = `${anneePrecedent}-${(moisPrecedent + 1).toString().padStart(2, '0')}`;
    const epargnePrecedent = transactions.filter(t => t.type === 'Épargnes' && t.date?.startsWith(monthKeyPrecedent)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const reprisesPrecedent = transactions.filter(t => t.type === 'Reprise d\'épargne' && t.date?.startsWith(monthKeyPrecedent)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const netPrecedent = epargnePrecedent - reprisesPrecedent;
    const evolutionVsMoisPrecedent = netPrecedent !== 0 ? (((netEpargneMois - netPrecedent) / Math.abs(netPrecedent)) * 100).toFixed(0) : netEpargneMois > 0 ? '+100' : '0';

    return { meilleurMois, totalAnnee, moyenneAnnee, evolutionVsMoisPrecedent, moisAvecEpargne };
  };

  const statsAnnee = getStatsAnnee();

  const repartitionParCompte = comptesEpargne.map(compte => ({ nom: compte.nom, solde: getSoldeCompte(compte.nom) })).filter(c => c.solde > 0);
  const totalRepartition = repartitionParCompte.reduce((sum, c) => sum + c.solde, 0);

  const getDataGraphiqueAnnuel = () => {
    const data: { mois: string; montant: number }[] = [];
    for (let m = 0; m < 12; m++) {
      const monthKey = `${selectedYear}-${(m + 1).toString().padStart(2, '0')}`;
      const epargnes = transactions.filter(t => t.type === 'Épargnes' && t.date?.startsWith(monthKey)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      const reprises = transactions.filter(t => t.type === 'Reprise d\'épargne' && t.date?.startsWith(monthKey)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      data.push({ mois: monthsShort[m], montant: epargnes - reprises });
    }
    return data;
  };

  const dataGraphiqueAnnuel = getDataGraphiqueAnnuel();
  const maxGraphique = Math.max(...dataGraphiqueAnnuel.map(d => Math.abs(d.montant)), 1);

  const transactionsAnnuelles = transactions.filter(t => (t.type === 'Épargnes' || t.type === 'Reprise d\'épargne') && t.date?.startsWith(selectedYear.toString())).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const displayedTransactionsAnnuelles = transactionsAnnuelles.slice(0, displayCount);
  const hasMoreAnnuel = displayCount < transactionsAnnuelles.length;

  const totalEpargneAnnee = transactions.filter(t => t.type === 'Épargnes' && t.date?.startsWith(selectedYear.toString())).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalReprisesAnnee = transactions.filter(t => t.type === 'Reprise d\'épargne' && t.date?.startsWith(selectedYear.toString())).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const netAnnee = totalEpargneAnnee - totalReprisesAnnee;

  const prevMonth = () => { if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); } else setSelectedMonth(selectedMonth - 1); };
  const nextMonth = () => { if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); } else setSelectedMonth(selectedMonth + 1); };
  const loadMore = () => setDisplayCount(prev => prev + ITEMS_PER_PAGE);

  const donutColors = ['#D4AF37', '#E8C872', '#C49A2F', '#B8860B', '#DAA520', '#F0C850', '#A08030', '#987618'];

  const renderResume = () => (
    <div className="space-y-4">
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
          <PiggyBank className="w-8 h-8" style={textPrimary} />
        </div>
        <p className="text-xs" style={textSecondary}>Épargne totale</p>
        <p className="text-3xl font-semibold mt-1" style={textPrimary}>{soldeEpargneGlobal.toFixed(2)} {parametres.devise}</p>
        <p className="text-[10px] mt-2" style={textSecondary}>Cumul de tous vos versements</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
          <TrendingUp className="w-6 h-6 mx-auto mb-2" style={textPrimary} />
          <p className="text-[10px]" style={textSecondary}>Épargné ce mois</p>
          <p className="text-lg font-semibold text-green-400">+{totalEpargnesMois.toFixed(2)} {parametres.devise}</p>
        </div>
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
          <Wallet className="w-6 h-6 mx-auto mb-2" style={textPrimary} />
          <p className="text-[10px]" style={textSecondary}>Reprises ce mois</p>
          <p className="text-lg font-semibold text-red-400">-{totalReprisesMois.toFixed(2)} {parametres.devise}</p>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={textPrimary}>Taux d&apos;épargne</p>
          <p className="text-lg font-semibold" style={textPrimary}>{tauxEpargne}%</p>
        </div>
        <div className="w-full rounded-full h-3" style={{ background: theme.colors.cardBackgroundLight }}>
          <div className="h-3 rounded-full transition-all" style={{ width: `${Math.min(Number(tauxEpargne), 100)}%`, background: theme.colors.primary }} />
        </div>
        <p className="text-[10px] mt-2" style={textSecondary}>Objectif recommandé : 10-20%</p>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
        <p className="text-xs" style={textSecondary}>Net épargne du mois</p>
        <p className={`text-2xl font-semibold mt-1 ${netEpargneMois >= 0 ? 'text-green-400' : 'text-red-400'}`}>{netEpargneMois >= 0 ? '+' : ''}{netEpargneMois.toFixed(2)} {parametres.devise}</p>
      </div>

      {/* SmartTips remplace l'ancienne carte conseils */}
      <SmartTips page="epargnes" />
    </div>
  );

  const renderMensuel = () => {
    const epargnesTransactions = filteredTransactions.filter(t => t.type === 'Épargnes' || t.type === 'Reprise d\'épargne').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="space-y-4">
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}><PiggyBank className="w-5 h-5" style={textPrimary} /></div>
            <div><h3 className="text-sm font-semibold" style={textPrimary}>Détail du mois</h3><p className="text-[10px]" style={textSecondary}>{monthsFull[selectedMonth]} {selectedYear}</p></div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs font-medium" style={textPrimary}>Total épargné</span><span className="text-xs font-medium text-green-400">+{totalEpargnesMois.toFixed(2)} {parametres.devise}</span></div>
            <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs font-medium" style={textPrimary}>Reprises</span><span className="text-xs font-medium text-red-400">-{totalReprisesMois.toFixed(2)} {parametres.devise}</span></div>
            <div className="flex justify-between items-center py-2"><span className="text-xs font-semibold" style={textPrimary}>Net</span><span className={`text-xs font-bold ${netEpargneMois >= 0 ? 'text-green-400' : 'text-red-400'}`}>{netEpargneMois >= 0 ? '+' : ''}{netEpargneMois.toFixed(2)} {parametres.devise}</span></div>
          </div>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <h4 className="text-xs font-semibold mb-3" style={textSecondary}>Par catégorie</h4>
          {Object.keys(epargnesParCategorie).length === 0 ? (<p className="text-xs text-center py-4" style={textSecondary}>Aucune épargne ce mois</p>) : (
            <div className="space-y-2">{Object.entries(epargnesParCategorie).map(([cat, montant]) => (<div key={cat} className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs" style={textSecondary}>{cat}</span><span className="text-xs font-medium" style={textPrimary}>{montant.toFixed(2)} {parametres.devise}</span></div>))}</div>
          )}
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <h4 className="text-xs font-semibold mb-3" style={textSecondary}>Mouvements du mois</h4>
          {epargnesTransactions.length === 0 ? (<p className="text-xs text-center py-4" style={textSecondary}>Aucun mouvement ce mois</p>) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">{epargnesTransactions.map((t, i) => (<div key={i} className="flex items-center justify-between py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><div><p className="text-sm font-medium" style={textPrimary}>{t.categorie}</p><p className="text-[10px]" style={textSecondary}>{t.date}</p></div><p className={`text-sm font-semibold ${t.type === 'Épargnes' ? 'text-green-400' : 'text-red-400'}`}>{t.type === 'Épargnes' ? '+' : '-'}{parseFloat(t.montant).toFixed(2)} {parametres.devise}</p></div>))}</div>
          )}
        </div>

        {/* SmartTips */}
        <SmartTips page="epargnes" />
      </div>
    );
  };

  const renderAnalyse = () => {
    const totalComptes = comptesBancairesOnly.reduce((sum, c) => sum + getSoldeCompte(c.nom), 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalCategories = categoriesEpargnesOnly.reduce((sum: number, c: any) => sum + getSoldeCompte(c.nom), 0);
    const totalGlobal = totalComptes + totalCategories;

    return (
      <div className="space-y-4">
        <div className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden p-0" style={cardStyle}>
          <button onClick={() => toggleAccordion('comptes')} className="w-full flex items-center justify-between p-4 transition-colors">
            <div className="flex items-center gap-2"><Building className="w-5 h-5" style={textPrimary} /><h3 className="text-sm font-semibold" style={textPrimary}>Comptes Bancaires</h3><span className="text-[10px]" style={textSecondary}>({comptesBancairesOnly.length})</span></div>
            <div className="flex items-center gap-2"><span className="text-xs font-semibold" style={textPrimary}>{totalComptes.toFixed(2)} {parametres.devise}</span>{accordionState.comptes ? <ChevronUp className="w-5 h-5" style={textPrimary} /> : <ChevronDown className="w-5 h-5" style={textPrimary} />}</div>
          </button>
          {accordionState.comptes && (
            <div className="px-4 pb-4" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
              {comptesBancairesOnly.length === 0 ? (<div className="text-center py-4"><p className="text-xs" style={textSecondary}>Aucun compte bancaire configuré</p><p className="text-[10px]" style={textSecondary}>Ajoutez des comptes dans Paramètres</p></div>) : (
                <div className="space-y-3 pt-4">{comptesBancairesOnly.map((compte) => { const solde = getSoldeCompte(compte.nom); const pourcentage = totalComptes > 0 ? (solde / totalComptes) * 100 : 0; return (<div key={compte.id} className="space-y-1"><div className="flex justify-between items-center"><div className="flex items-center gap-2">{compte.isEpargne ? (<span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">Épargne</span>) : (<span className="text-[9px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">Courant</span>)}<span className="text-xs font-medium" style={textPrimary}>{compte.nom}</span></div><span className="text-xs font-semibold" style={textPrimary}>{solde.toFixed(2)} {parametres.devise}</span></div><div className="w-full rounded-full h-2" style={{ background: theme.colors.cardBackgroundLight }}><div className="h-2 rounded-full transition-all" style={{ width: `${Math.max(pourcentage, 0)}%`, background: theme.colors.primary }} /></div></div>); })}</div>
              )}
            </div>
          )}
        </div>

        <div className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden p-0" style={cardStyle}>
          <button onClick={() => toggleAccordion('categories')} className="w-full flex items-center justify-between p-4 transition-colors">
            <div className="flex items-center gap-2"><PiggyBank className="w-5 h-5" style={textPrimary} /><h3 className="text-sm font-semibold" style={textPrimary}>Catégories d&apos;Épargnes</h3><span className="text-[10px]" style={textSecondary}>({categoriesEpargnesOnly.length})</span></div>
            <div className="flex items-center gap-2"><span className="text-xs font-semibold" style={textPrimary}>{totalCategories.toFixed(2)} {parametres.devise}</span>{accordionState.categories ? <ChevronUp className="w-5 h-5" style={textPrimary} /> : <ChevronDown className="w-5 h-5" style={textPrimary} />}</div>
          </button>
          {accordionState.categories && (
            <div className="px-4 pb-4" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
              {categoriesEpargnesOnly.length === 0 ? (<div className="text-center py-4"><p className="text-xs" style={textSecondary}>Aucune catégorie d&apos;épargne</p></div>) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <div className="space-y-3 pt-4">{categoriesEpargnesOnly.map((categorie: any) => { const solde = getSoldeCompte(categorie.nom); const pourcentage = totalCategories > 0 ? (solde / totalCategories) * 100 : 0; return (<div key={categorie.id} className="space-y-1"><div className="flex justify-between items-center"><span className="text-xs font-medium" style={textPrimary}>{categorie.nom}</span><span className="text-xs font-semibold" style={textPrimary}>{solde.toFixed(2)} {parametres.devise}</span></div><div className="w-full rounded-full h-2" style={{ background: theme.colors.cardBackgroundLight }}><div className="bg-blue-400 h-2 rounded-full transition-all" style={{ width: `${Math.max(pourcentage, 0)}%` }} /></div></div>); })}</div>
              )}
            </div>
          )}
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
          <p className="text-[10px]" style={textSecondary}>Total Global Épargnes</p>
          <p className="text-lg font-semibold" style={textPrimary}>{totalGlobal.toFixed(2)} {parametres.devise}</p>
          <div className="flex justify-center gap-4 mt-2"><span className="text-[10px]" style={textSecondary}>🏦 Comptes: {totalComptes.toFixed(0)}{parametres.devise}</span><span className="text-[10px]" style={textSecondary}>🏷 Catégories: {totalCategories.toFixed(0)}{parametres.devise}</span></div>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4"><Target className="w-5 h-5" style={textPrimary} /><h3 className="text-sm font-semibold" style={textPrimary}>Projection</h3></div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs" style={textSecondary}>Moyenne mensuelle (6 mois)</span><span className={`text-xs font-semibold ${moyenneMensuelle >= 0 ? 'text-green-400' : 'text-red-400'}`}>{moyenneMensuelle >= 0 ? '+' : ''}{moyenneMensuelle.toFixed(2)} {parametres.devise}</span></div>
            <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs" style={textSecondary}>Dans 6 mois</span><span className="text-xs font-semibold" style={textPrimary}>{projection6Mois.toFixed(2)} {parametres.devise}</span></div>
            <div className="flex justify-between items-center py-2"><span className="text-xs" style={textSecondary}>Dans 12 mois</span><span className="text-xs font-semibold" style={textPrimary}>{projection12Mois.toFixed(2)} {parametres.devise}</span></div>
          </div>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5" style={textPrimary} /><h3 className="text-sm font-semibold" style={textPrimary}>Statistiques {selectedYear}</h3></div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs" style={textSecondary}>Meilleur mois</span><span className="text-xs" style={textPrimary}>{statsAnnee.meilleurMois.mois || '-'} {statsAnnee.meilleurMois.montant > 0 && (<span className="text-green-400 ml-1">+{statsAnnee.meilleurMois.montant.toFixed(0)}{parametres.devise}</span>)}</span></div>
            <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs" style={textSecondary}>Moyenne mensuelle</span><span className="text-xs font-medium" style={textPrimary}>{statsAnnee.moyenneAnnee.toFixed(2)} {parametres.devise}</span></div>
            <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs" style={textSecondary}>vs mois précédent</span><span className={`text-xs font-medium ${Number(statsAnnee.evolutionVsMoisPrecedent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{Number(statsAnnee.evolutionVsMoisPrecedent) >= 0 ? '+' : ''}{statsAnnee.evolutionVsMoisPrecedent}%</span></div>
            <div className="flex justify-between items-center py-2"><span className="text-xs" style={textSecondary}>Mois avec épargne</span><span className="text-xs font-medium" style={textPrimary}>{statsAnnee.moisAvecEpargne} / 12</span></div>
          </div>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4"><PieChart className="w-5 h-5" style={textPrimary} /><h3 className="text-sm font-semibold" style={textPrimary}>Répartition</h3></div>
          {repartitionParCompte.length === 0 ? (<p className="text-xs text-center py-4" style={textSecondary}>Aucune donnée à afficher</p>) : (
            <div className="space-y-3">
              <div className="h-6 rounded-full overflow-hidden flex">{repartitionParCompte.map((compte, index) => { const pourcentage = (compte.solde / totalRepartition) * 100; return (<div key={compte.nom} className="h-full transition-all" style={{ width: `${pourcentage}%`, backgroundColor: donutColors[index % donutColors.length] }} title={`${compte.nom}: ${pourcentage.toFixed(1)}%`} />); })}</div>
              <div className="space-y-2">{repartitionParCompte.map((compte, index) => { const pourcentage = (compte.solde / totalRepartition) * 100; return (<div key={compte.nom} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: donutColors[index % donutColors.length] }} /><span className="text-[10px]" style={textSecondary}>{compte.nom}</span></div><span className="text-xs font-medium" style={textPrimary}>{pourcentage.toFixed(1)}%</span></div>); })}</div>
            </div>
          )}
        </div>

        {/* SmartTips */}
        <SmartTips page="epargnes" />
      </div>
    );
  };

  const renderHistorique = () => (
    <div className="space-y-4">
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <div className="flex items-center gap-2 mb-4"><Clock className="w-5 h-5" style={textPrimary} /><h3 className="text-sm font-semibold" style={textPrimary}>Résumé {selectedYear}</h3></div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl" style={{ background: theme.colors.cardBackgroundLight }}><p className="text-[10px]" style={textSecondary}>Épargné</p><p className="text-xs font-semibold text-green-400">+{totalEpargneAnnee.toFixed(0)}{parametres.devise}</p></div>
          <div className="p-2 rounded-xl" style={{ background: theme.colors.cardBackgroundLight }}><p className="text-[10px]" style={textSecondary}>Reprises</p><p className="text-xs font-semibold text-red-400">-{totalReprisesAnnee.toFixed(0)}{parametres.devise}</p></div>
          <div className="p-2 rounded-xl" style={{ background: theme.colors.cardBackgroundLight }}><p className="text-[10px]" style={textSecondary}>Net</p><p className={`text-xs font-semibold ${netAnnee >= 0 ? 'text-green-400' : 'text-red-400'}`}>{netAnnee >= 0 ? '+' : ''}{netAnnee.toFixed(0)}{parametres.devise}</p></div>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h4 className="text-xs font-semibold mb-4" style={textSecondary}>Évolution {selectedYear}</h4>
        <div className="flex items-end justify-between h-32 gap-1">
          {dataGraphiqueAnnuel.map((data, index) => { const hauteur = maxGraphique > 0 ? (Math.abs(data.montant) / maxGraphique) * 100 : 0; const isPositif = data.montant >= 0; const isMoisActuel = index === selectedMonth; return (<div key={data.mois} className="flex-1 flex flex-col items-center justify-end h-full"><div className="flex-1 flex items-end w-full justify-center"><div className={`w-full max-w-[20px] rounded-t transition-all ${isPositif ? 'bg-green-400' : 'bg-red-400'} ${isMoisActuel ? 'ring-2' : ''}`} style={{ height: `${Math.max(hauteur, 2)}%`, ...(isMoisActuel ? { boxShadow: `0 0 0 2px ${theme.colors.primary}` } : {}) }} title={`${data.mois}: ${data.montant.toFixed(0)}${parametres.devise}`} /></div><span className={`text-[10px] mt-1 ${isMoisActuel ? 'font-bold' : ''}`} style={isMoisActuel ? textPrimary : textSecondary}>{data.mois}</span></div>); })}
        </div>
        <div className="flex justify-center gap-4 mt-3"><div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded" /><span className="text-[10px]" style={textSecondary}>Positif</span></div><div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded" /><span className="text-[10px]" style={textSecondary}>Négatif</span></div></div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <div className="flex items-center justify-between mb-3"><h4 className="text-xs font-semibold" style={textSecondary}>Tous les mouvements {selectedYear}</h4>{transactionsAnnuelles.length > 0 && (<span className="text-[10px]" style={textSecondary}>{displayedTransactionsAnnuelles.length} sur {transactionsAnnuelles.length}</span>)}</div>
        {transactionsAnnuelles.length === 0 ? (<p className="text-xs text-center py-8" style={textSecondary}>Aucun mouvement cette année</p>) : (
          <div className="space-y-2">
            {displayedTransactionsAnnuelles.map((t, i) => (<div key={i} className="flex items-center justify-between py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><div><p className="text-sm font-medium" style={textPrimary}>{t.categorie}</p><p className="text-[10px]" style={textSecondary}>{t.date} • {t.type}</p></div><p className={`text-sm font-semibold ${t.type === 'Épargnes' ? 'text-green-400' : 'text-red-400'}`}>{t.type === 'Épargnes' ? '+' : '-'}{parseFloat(t.montant).toFixed(2)} {parametres.devise}</p></div>))}
            {hasMoreAnnuel && (<button onClick={loadMore} className="w-full py-3 mt-3 border-2 border-dashed rounded-xl text-sm font-medium transition-colors" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}>Voir plus ({transactionsAnnuelles.length - displayCount} restant{transactionsAnnuelles.length - displayCount > 1 ? 's' : ''})</button>)}
          </div>
        )}
      </div>

      {/* SmartTips */}
      <SmartTips page="epargnes" />
    </div>
  );

  const tabs: { id: TabType; label: string }[] = [{ id: 'resume', label: 'Résumé' }, { id: 'mensuel', label: 'Mensuel' }, { id: 'analyse', label: 'Analyse' }, { id: 'historique', label: 'Historique' }];

  return (
    <div className="pb-4">
      <div className="text-center mb-4"><h1 className="text-lg font-medium" style={textPrimary}>Épargnes</h1><p className="text-xs" style={textSecondary}>Suivi de votre épargne</p></div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5" style={textPrimary} /></button>
          <div className="flex items-center gap-2"><span className="text-lg font-semibold" style={textPrimary}>{monthsFull[selectedMonth]}</span><select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="rounded-lg px-3 py-1 text-lg font-semibold border" style={inputStyle}>{years.map(year => (<option key={year} value={year}>{year}</option>))}</select></div>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5" style={textPrimary} /></button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">{monthsShort.map((month, index) => (<button key={index} onClick={() => setSelectedMonth(index)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" style={selectedMonth === index ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>{month}</button>))}</div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-1 shadow-sm mb-4 flex border" style={cardStyle}>{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-colors" style={activeTab === tab.id ? { background: theme.colors.primary, color: theme.colors.textOnPrimary } : { color: theme.colors.textSecondary }}>{tab.label}</button>))}</div>

      {activeTab === 'resume' && renderResume()}
      {activeTab === 'mensuel' && renderMensuel()}
      {activeTab === 'analyse' && renderAnalyse()}
      {activeTab === 'historique' && renderHistorique()}
    </div>
  );
}

export default function EpargnesPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="epargnes" onNavigate={handleNavigate}>
      <EpargnesContent />
    </AppShell>
  );
}

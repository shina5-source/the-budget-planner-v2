"use client";

import { useState, useEffect } from 'react';
import { PiggyBank, Plus, TrendingUp, TrendingDown, Target, Wallet, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Lightbulb, BarChart3, Building, Clock, PieChart } from 'lucide-react';

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
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

type TabType = 'resume' | 'mensuel' | 'analyse' | 'historique';

// PAGINATION
const ITEMS_PER_PAGE = 50;

export default function EpargnesPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [activeTab, setActiveTab] = useState<TabType>('resume');

  // PAGINATION STATE
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // État pour les accordéons de l'analyse
  const [accordionState, setAccordionState] = useState<{ comptes: boolean; categories: boolean }>({ comptes: true, categories: false });

  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
  }, []);

  // Réinitialiser la pagination quand on change de mois/année
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [selectedMonth, selectedYear]);

  const getMonthKey = () => {
    const month = (selectedMonth + 1).toString().padStart(2, '0');
    return `${selectedYear}-${month}`;
  };

  const filteredTransactions = transactions.filter(t => t.date?.startsWith(getMonthKey()));

  // Calculs du mois
  const totalEpargnesMois = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalReprisesMois = filteredTransactions.filter(t => t.type === 'Reprise d\'épargne').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const netEpargneMois = totalEpargnesMois - totalReprisesMois;
  const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const tauxEpargne = totalRevenus > 0 ? ((totalEpargnesMois / totalRevenus) * 100).toFixed(1) : '0';

  // Total épargne globale
  const totalEpargneGlobale = transactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalReprisesGlobale = transactions.filter(t => t.type === 'Reprise d\'épargne').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const soldeEpargneGlobal = totalEpargneGlobale - totalReprisesGlobale;

  // Épargnes par catégorie du mois
  const epargnesParCategorie = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((acc, t) => {
    const cat = t.categorie;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += parseFloat(t.montant || '0');
    return acc;
  }, {} as { [key: string]: number });

  // Calculs pour l'analyse - Séparation Comptes Bancaires et Catégories d'Épargnes
  const comptesBancairesOnly = parametres.comptesBancaires;
  const categoriesEpargnesOnly = ((parametres as any).categoriesEpargnes || [])
    .filter((cat: string) => !parametres.comptesBancaires.some(c => c.nom === cat))
    .map((cat: string, index: number) => ({ id: 1000 + index, nom: cat, soldeDepart: 0, isEpargne: true }));
  
  // Ancien comptesEpargne pour compatibilité avec répartition
  const comptesEpargne = [
    ...comptesBancairesOnly.map(c => ({ id: c.id, nom: c.nom, soldeDepart: c.soldeDepart, isEpargne: c.isEpargne })),
    ...categoriesEpargnesOnly
  ];

  const toggleAccordion = (section: 'comptes' | 'categories') => {
    setAccordionState(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const getSoldeCompte = (compteNom: string) => {
    const compte = parametres.comptesBancaires.find(c => c.nom === compteNom);
    const soldeDepart = compte?.soldeDepart || 0;
    
    const epargnes = transactions
      .filter(t => t.type === 'Épargnes' && t.categorie === compteNom)
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    const reprises = transactions
      .filter(t => t.type === 'Reprise d\'épargne' && t.categorie === compteNom)
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    return soldeDepart + epargnes - reprises;
  };

  // Calculs pour les projections (moyenne des 6 derniers mois)
  const getEpargnesMoisPrecedents = (nombreMois: number) => {
    const result: number[] = [];
    const now = new Date();
    
    for (let i = 1; i <= nombreMois; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      const epargnes = transactions
        .filter(t => t.type === 'Épargnes' && t.date?.startsWith(monthKey))
        .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      
      const reprises = transactions
        .filter(t => t.type === 'Reprise d\'épargne' && t.date?.startsWith(monthKey))
        .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      
      result.push(epargnes - reprises);
    }
    
    return result;
  };

  const epargnes6DerniersMois = getEpargnesMoisPrecedents(6);
  const moyenneMensuelle = epargnes6DerniersMois.length > 0 
    ? epargnes6DerniersMois.reduce((a, b) => a + b, 0) / epargnes6DerniersMois.length 
    : 0;
  const projection6Mois = soldeEpargneGlobal + (moyenneMensuelle * 6);
  const projection12Mois = soldeEpargneGlobal + (moyenneMensuelle * 12);

  // Statistiques
  const getStatsAnnee = () => {
    const anneeActuelle = selectedYear;
    let meilleurMois = { mois: '', montant: 0 };
    let totalAnnee = 0;
    let moisAvecEpargne = 0;
    
    for (let m = 0; m < 12; m++) {
      const monthKey = `${anneeActuelle}-${(m + 1).toString().padStart(2, '0')}`;
      
      const epargnes = transactions
        .filter(t => t.type === 'Épargnes' && t.date?.startsWith(monthKey))
        .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      
      const reprises = transactions
        .filter(t => t.type === 'Reprise d\'épargne' && t.date?.startsWith(monthKey))
        .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      
      const net = epargnes - reprises;
      totalAnnee += net;
      
      if (net > 0) moisAvecEpargne++;
      
      if (net > meilleurMois.montant) {
        meilleurMois = { mois: monthsFull[m], montant: net };
      }
    }
    
    const moyenneAnnee = moisAvecEpargne > 0 ? totalAnnee / moisAvecEpargne : 0;
    
    // Comparaison avec mois précédent
    const moisPrecedent = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const anneePrecedent = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const monthKeyPrecedent = `${anneePrecedent}-${(moisPrecedent + 1).toString().padStart(2, '0')}`;
    
    const epargnePrecedent = transactions
      .filter(t => t.type === 'Épargnes' && t.date?.startsWith(monthKeyPrecedent))
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    const reprisesPrecedent = transactions
      .filter(t => t.type === 'Reprise d\'épargne' && t.date?.startsWith(monthKeyPrecedent))
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    const netPrecedent = epargnePrecedent - reprisesPrecedent;
    const evolutionVsMoisPrecedent = netPrecedent !== 0 
      ? (((netEpargneMois - netPrecedent) / Math.abs(netPrecedent)) * 100).toFixed(0)
      : netEpargneMois > 0 ? '+100' : '0';
    
    return { meilleurMois, totalAnnee, moyenneAnnee, evolutionVsMoisPrecedent, moisAvecEpargne };
  };

  const statsAnnee = getStatsAnnee();

  // Répartition par compte (pour le donut)
  const repartitionParCompte = comptesEpargne.map(compte => ({
    nom: compte.nom,
    solde: getSoldeCompte(compte.nom)
  })).filter(c => c.solde > 0);

  const totalRepartition = repartitionParCompte.reduce((sum, c) => sum + c.solde, 0);

  // Données pour le graphique annuel (historique)
  const getDataGraphiqueAnnuel = () => {
    const data: { mois: string; montant: number }[] = [];
    
    for (let m = 0; m < 12; m++) {
      const monthKey = `${selectedYear}-${(m + 1).toString().padStart(2, '0')}`;
      
      const epargnes = transactions
        .filter(t => t.type === 'Épargnes' && t.date?.startsWith(monthKey))
        .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      
      const reprises = transactions
        .filter(t => t.type === 'Reprise d\'épargne' && t.date?.startsWith(monthKey))
        .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      
      data.push({ mois: monthsShort[m], montant: epargnes - reprises });
    }
    
    return data;
  };

  const dataGraphiqueAnnuel = getDataGraphiqueAnnuel();
  const maxGraphique = Math.max(...dataGraphiqueAnnuel.map(d => Math.abs(d.montant)), 1);

  // Transactions annuelles pour l'historique
  const transactionsAnnuelles = transactions
    .filter(t => (t.type === 'Épargnes' || t.type === 'Reprise d\'épargne') && t.date?.startsWith(selectedYear.toString()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayedTransactionsAnnuelles = transactionsAnnuelles.slice(0, displayCount);
  const hasMoreAnnuel = displayCount < transactionsAnnuelles.length;

  // Stats annuelles pour l'historique
  const totalEpargneAnnee = transactions
    .filter(t => t.type === 'Épargnes' && t.date?.startsWith(selectedYear.toString()))
    .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  
  const totalReprisesAnnee = transactions
    .filter(t => t.type === 'Reprise d\'épargne' && t.date?.startsWith(selectedYear.toString()))
    .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  
  const netAnnee = totalEpargneAnnee - totalReprisesAnnee;

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); }
    else setSelectedMonth(selectedMonth - 1);
  };

  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); }
    else setSelectedMonth(selectedMonth + 1);
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };

  // STYLES UNIFORMISÉS
  const cardStyle = "bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#D4AF37]/40";
  const pageTitleStyle = "text-lg font-medium text-[#D4AF37]";
  const pageSubtitleStyle = "text-xs text-[#D4AF37]/70";
  const cardTitleStyle = "text-xs text-[#D4AF37]/80";
  const amountLargeStyle = "text-2xl font-semibold text-[#D4AF37]";
  const amountMediumStyle = "text-lg font-semibold text-[#D4AF37]";
  const smallTextStyle = "text-[10px] text-[#D4AF37]/60";
  const labelStyle = "text-xs font-medium text-[#D4AF37] mb-1 block";
  const valueStyle = "text-xs font-medium text-[#D4AF37]";
  const sectionTitleStyle = "text-sm font-semibold text-[#D4AF37]";

  // STYLE CONSEILS - Vert menthe
  const conseilCardStyle = "bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50";
  const conseilTitleStyle = "text-xs font-semibold text-[#7DD3A8]";
  const conseilTextStyle = "text-[10px] text-[#7DD3A8]";
  const conseilIconStyle = "w-4 h-4 text-[#7DD3A8]";

  // Couleurs pour le donut
  const donutColors = ['#D4AF37', '#E8C872', '#C49A2F', '#B8860B', '#DAA520', '#F0C850', '#A08030', '#987618'];

  const renderResume = () => (
    <div className="space-y-4">
      {/* Solde global */}
      <div className={cardStyle + " text-center"}>
        <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-[#D4AF37]/50">
          <PiggyBank className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <p className={pageSubtitleStyle}>Épargne totale</p>
        <p className="text-3xl font-semibold text-[#D4AF37] mt-1">{soldeEpargneGlobal.toFixed(2)} {parametres.devise}</p>
        <p className={smallTextStyle + " mt-2"}>Cumul de tous vos versements</p>
      </div>

      {/* Stats du mois */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cardStyle + " text-center"}>
          <TrendingUp className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
          <p className={smallTextStyle}>Épargné ce mois</p>
          <p className={amountMediumStyle}>+{totalEpargnesMois.toFixed(2)} {parametres.devise}</p>
        </div>
        <div className={cardStyle + " text-center"}>
          <Wallet className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
          <p className={smallTextStyle}>Reprises ce mois</p>
          <p className={amountMediumStyle}>-{totalReprisesMois.toFixed(2)} {parametres.devise}</p>
        </div>
      </div>

      {/* Taux d'épargne */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between mb-3">
          <p className={sectionTitleStyle}>Taux d'épargne</p>
          <p className={amountMediumStyle}>{tauxEpargne}%</p>
        </div>
        <div className="w-full bg-[#722F37]/50 rounded-full h-3">
          <div className="bg-[#D4AF37] h-3 rounded-full transition-all" style={{ width: `${Math.min(Number(tauxEpargne), 100)}%` }} />
        </div>
        <p className={smallTextStyle + " mt-2"}>Objectif recommandé : 10-20%</p>
      </div>

      {/* Net du mois */}
      <div className={cardStyle + " text-center"}>
        <p className={pageSubtitleStyle}>Net épargne du mois</p>
        <p className={`${amountLargeStyle} mt-1 ${netEpargneMois >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {netEpargneMois >= 0 ? '+' : ''}{netEpargneMois.toFixed(2)} {parametres.devise}
        </p>
      </div>

      {/* Conseils */}
      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className={conseilIconStyle} />
          <h4 className={conseilTitleStyle}>💡 Conseils épargne</h4>
        </div>
        <div className="space-y-2">
          {Number(tauxEpargne) < 10 && totalRevenus > 0 && (
            <p className={conseilTextStyle}>📌 Essayez d'atteindre un taux d'épargne de 10% minimum ({(totalRevenus * 0.1).toFixed(2)} {parametres.devise})</p>
          )}
          {Number(tauxEpargne) >= 10 && Number(tauxEpargne) < 20 && (
            <p className={conseilTextStyle}>✅ Bon taux d'épargne ! Visez 20% pour plus de sécurité</p>
          )}
          {Number(tauxEpargne) >= 20 && (
            <p className={conseilTextStyle}>🎉 Excellent ! Vous épargnez plus de 20% de vos revenus</p>
          )}
          {totalReprisesMois > totalEpargnesMois && (
            <p className={conseilTextStyle}>⚠️ Attention, vos reprises dépassent vos versements ce mois</p>
          )}
          {filteredTransactions.filter(t => t.type === 'Épargnes').length === 0 && (
            <p className={conseilTextStyle}>📝 Aucune épargne ce mois. Pensez à mettre de côté !</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderMensuel = () => {
    const epargnesTransactions = filteredTransactions
      .filter(t => t.type === 'Épargnes' || t.type === 'Reprise d\'épargne')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="space-y-4">
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center border border-[#D4AF37]/50">
              <PiggyBank className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className={sectionTitleStyle}>Détail du mois</h3>
              <p className={smallTextStyle}>{monthsFull[selectedMonth]} {selectedYear}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
              <span className={labelStyle}>Total épargné</span>
              <span className={valueStyle + " text-green-400"}>+{totalEpargnesMois.toFixed(2)} {parametres.devise}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
              <span className={labelStyle}>Reprises</span>
              <span className={valueStyle + " text-red-400"}>-{totalReprisesMois.toFixed(2)} {parametres.devise}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className={labelStyle + " font-semibold"}>Net</span>
              <span className={`${valueStyle} font-bold ${netEpargneMois >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {netEpargneMois >= 0 ? '+' : ''}{netEpargneMois.toFixed(2)} {parametres.devise}
              </span>
            </div>
          </div>
        </div>

        <div className={cardStyle}>
          <h4 className={cardTitleStyle + " font-semibold mb-3"}>Par catégorie</h4>
          {Object.keys(epargnesParCategorie).length === 0 ? (
            <p className={pageSubtitleStyle + " text-center py-4"}>Aucune épargne ce mois</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(epargnesParCategorie).map(([cat, montant]) => (
                <div key={cat} className="flex justify-between items-center py-2 border-b border-[#D4AF37]/10">
                  <span className={labelStyle}>{cat}</span>
                  <span className={valueStyle}>{montant.toFixed(2)} {parametres.devise}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mouvements du mois */}
        <div className={cardStyle}>
          <h4 className={cardTitleStyle + " font-semibold mb-3"}>Mouvements du mois</h4>
          {epargnesTransactions.length === 0 ? (
            <p className={pageSubtitleStyle + " text-center py-4"}>Aucun mouvement ce mois</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {epargnesTransactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#D4AF37]/10">
                  <div>
                    <p className="text-sm font-medium text-[#D4AF37]">{t.categorie}</p>
                    <p className={smallTextStyle}>{t.date}</p>
                  </div>
                  <p className={`text-sm font-semibold ${t.type === 'Épargnes' ? 'text-green-400' : 'text-red-400'}`}>
                    {t.type === 'Épargnes' ? '+' : '-'}{parseFloat(t.montant).toFixed(2)} {parametres.devise}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conseil */}
        <div className={conseilCardStyle}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className={conseilIconStyle} />
            <span className={conseilTitleStyle}>Conseil</span>
          </div>
          {netEpargneMois >= 0 ? (
            <p className={conseilTextStyle}>✅ Bonne gestion ! Vous avez épargné {netEpargneMois.toFixed(2)} {parametres.devise} net ce mois</p>
          ) : (
            <p className={conseilTextStyle}>⚠️ Solde négatif : vous avez repris plus que versé ce mois</p>
          )}
        </div>
      </div>
    );
  };

  const renderAnalyse = () => {
    // Totaux séparés
    const totalComptes = comptesBancairesOnly.reduce((sum, c) => sum + getSoldeCompte(c.nom), 0);
    const totalCategories = categoriesEpargnesOnly.reduce((sum: number, c: any) => sum + getSoldeCompte(c.nom), 0);
    const totalGlobal = totalComptes + totalCategories;

    return (
    <div className="space-y-4">
      {/* Section Comptes Bancaires - Accordéon */}
      <div className={cardStyle + " overflow-hidden p-0"}>
        <button 
          onClick={() => toggleAccordion('comptes')}
          className="w-full flex items-center justify-between p-4 hover:bg-[#D4AF37]/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#D4AF37]" />
            <h3 className={sectionTitleStyle}>Comptes Bancaires</h3>
            <span className={smallTextStyle}>({comptesBancairesOnly.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={valueStyle + " font-semibold"}>{totalComptes.toFixed(2)} {parametres.devise}</span>
            {accordionState.comptes ? (
              <ChevronUp className="w-5 h-5 text-[#D4AF37]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
            )}
          </div>
        </button>
        
        {accordionState.comptes && (
          <div className="px-4 pb-4 border-t border-[#D4AF37]/20">
            {comptesBancairesOnly.length === 0 ? (
              <div className="text-center py-4">
                <p className={pageSubtitleStyle}>Aucun compte bancaire configuré</p>
                <p className={smallTextStyle}>Ajoutez des comptes dans Paramètres</p>
              </div>
            ) : (
              <div className="space-y-3 pt-4">
                {comptesBancairesOnly.map((compte) => {
                  const solde = getSoldeCompte(compte.nom);
                  const pourcentage = totalComptes > 0 ? (solde / totalComptes) * 100 : 0;
                  return (
                    <div key={compte.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {compte.isEpargne ? (
                            <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">Épargne</span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">Courant</span>
                          )}
                          <span className={valueStyle}>{compte.nom}</span>
                        </div>
                        <span className={valueStyle + " font-semibold"}>{solde.toFixed(2)} {parametres.devise}</span>
                      </div>
                      <div className="w-full bg-[#722F37]/50 rounded-full h-2">
                        <div className="bg-[#D4AF37] h-2 rounded-full transition-all" style={{ width: `${Math.max(pourcentage, 0)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section Catégories d'Épargnes - Accordéon */}
      <div className={cardStyle + " overflow-hidden p-0"}>
        <button 
          onClick={() => toggleAccordion('categories')}
          className="w-full flex items-center justify-between p-4 hover:bg-[#D4AF37]/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-[#D4AF37]" />
            <h3 className={sectionTitleStyle}>Catégories d'Épargnes</h3>
            <span className={smallTextStyle}>({categoriesEpargnesOnly.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={valueStyle + " font-semibold"}>{totalCategories.toFixed(2)} {parametres.devise}</span>
            {accordionState.categories ? (
              <ChevronUp className="w-5 h-5 text-[#D4AF37]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
            )}
          </div>
        </button>
        
        {accordionState.categories && (
          <div className="px-4 pb-4 border-t border-[#D4AF37]/20">
            {categoriesEpargnesOnly.length === 0 ? (
              <div className="text-center py-4">
                <p className={pageSubtitleStyle}>Aucune catégorie d'épargne</p>
                <p className={smallTextStyle}>Ajoutez des catégories dans Paramètres</p>
              </div>
            ) : (
              <div className="space-y-3 pt-4">
                {categoriesEpargnesOnly.map((categorie: any) => {
                  const solde = getSoldeCompte(categorie.nom);
                  const pourcentage = totalCategories > 0 ? (solde / totalCategories) * 100 : 0;
                  return (
                    <div key={categorie.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={valueStyle}>{categorie.nom}</span>
                        <span className={valueStyle + " font-semibold"}>{solde.toFixed(2)} {parametres.devise}</span>
                      </div>
                      <div className="w-full bg-[#722F37]/50 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full transition-all" style={{ width: `${Math.max(pourcentage, 0)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Total Global */}
      <div className={cardStyle + " text-center"}>
        <p className={smallTextStyle}>Total Global Épargnes</p>
        <p className={amountMediumStyle}>{totalGlobal.toFixed(2)} {parametres.devise}</p>
        <div className="flex justify-center gap-4 mt-2">
          <span className={smallTextStyle}>🏦 Comptes: {totalComptes.toFixed(0)}{parametres.devise}</span>
          <span className={smallTextStyle}>🐷 Catégories: {totalCategories.toFixed(0)}{parametres.devise}</span>
        </div>
      </div>

      {/* Projection */}
      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[#D4AF37]" />
          <h3 className={sectionTitleStyle}>Projection</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={labelStyle}>Moyenne mensuelle (6 mois)</span>
            <span className={`${valueStyle} font-semibold ${moyenneMensuelle >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {moyenneMensuelle >= 0 ? '+' : ''}{moyenneMensuelle.toFixed(2)} {parametres.devise}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={labelStyle}>Dans 6 mois</span>
            <span className={valueStyle + " font-semibold"}>{projection6Mois.toFixed(2)} {parametres.devise}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className={labelStyle}>Dans 12 mois</span>
            <span className={valueStyle + " font-semibold"}>{projection12Mois.toFixed(2)} {parametres.devise}</span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
          <h3 className={sectionTitleStyle}>Statistiques {selectedYear}</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={labelStyle}>Meilleur mois</span>
            <span className={valueStyle}>
              {statsAnnee.meilleurMois.mois || '-'} 
              {statsAnnee.meilleurMois.montant > 0 && (
                <span className="text-green-400 ml-1">+{statsAnnee.meilleurMois.montant.toFixed(0)}{parametres.devise}</span>
              )}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={labelStyle}>Moyenne mensuelle</span>
            <span className={valueStyle}>{statsAnnee.moyenneAnnee.toFixed(2)} {parametres.devise}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={labelStyle}>vs mois précédent</span>
            <span className={`${valueStyle} ${Number(statsAnnee.evolutionVsMoisPrecedent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Number(statsAnnee.evolutionVsMoisPrecedent) >= 0 ? '+' : ''}{statsAnnee.evolutionVsMoisPrecedent}%
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className={labelStyle}>Mois avec épargne</span>
            <span className={valueStyle}>{statsAnnee.moisAvecEpargne} / 12</span>
          </div>
        </div>
      </div>

      {/* Répartition (Donut simplifié) */}
      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-[#D4AF37]" />
          <h3 className={sectionTitleStyle}>Répartition</h3>
        </div>
        
        {repartitionParCompte.length === 0 ? (
          <p className={pageSubtitleStyle + " text-center py-4"}>Aucune donnée à afficher</p>
        ) : (
          <div className="space-y-3">
            {/* Barre de répartition horizontale */}
            <div className="h-6 rounded-full overflow-hidden flex">
              {repartitionParCompte.map((compte, index) => {
                const pourcentage = (compte.solde / totalRepartition) * 100;
                return (
                  <div
                    key={compte.nom}
                    className="h-full transition-all"
                    style={{ 
                      width: `${pourcentage}%`, 
                      backgroundColor: donutColors[index % donutColors.length] 
                    }}
                    title={`${compte.nom}: ${pourcentage.toFixed(1)}%`}
                  />
                );
              })}
            </div>
            
            {/* Légende */}
            <div className="space-y-2">
              {repartitionParCompte.map((compte, index) => {
                const pourcentage = (compte.solde / totalRepartition) * 100;
                return (
                  <div key={compte.nom} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: donutColors[index % donutColors.length] }}
                      />
                      <span className={smallTextStyle}>{compte.nom}</span>
                    </div>
                    <span className={valueStyle}>{pourcentage.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Conseils */}
      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className={conseilIconStyle} />
          <span className={conseilTitleStyle}>💡 Conseils</span>
        </div>
        <div className="space-y-2">
          {moyenneMensuelle > 0 && (
            <p className={conseilTextStyle}>📈 À ce rythme, vous aurez {projection12Mois.toFixed(0)}{parametres.devise} dans 1 an</p>
          )}
          {moyenneMensuelle <= 0 && (
            <p className={conseilTextStyle}>⚠️ Votre épargne moyenne est négative. Essayez d'épargner régulièrement</p>
          )}
          {comptesEpargne.length === 0 && (
            <p className={conseilTextStyle}>🏦 Ajoutez vos comptes épargne dans Paramètres pour un suivi détaillé</p>
          )}
          {repartitionParCompte.length > 0 && repartitionParCompte.some(c => (c.solde / totalRepartition) > 0.7) && (
            <p className={conseilTextStyle}>💡 Diversifiez votre épargne sur plusieurs supports</p>
          )}
        </div>
      </div>
    </div>
  );
  };

  const renderHistorique = () => (
    <div className="space-y-4">
      {/* Résumé annuel */}
      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#D4AF37]" />
          <h3 className={sectionTitleStyle}>Résumé {selectedYear}</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-[#722F37]/40 rounded-xl">
            <p className={smallTextStyle}>Épargné</p>
            <p className={valueStyle + " text-green-400 font-semibold"}>+{totalEpargneAnnee.toFixed(0)}{parametres.devise}</p>
          </div>
          <div className="p-2 bg-[#722F37]/40 rounded-xl">
            <p className={smallTextStyle}>Reprises</p>
            <p className={valueStyle + " text-red-400 font-semibold"}>-{totalReprisesAnnee.toFixed(0)}{parametres.devise}</p>
          </div>
          <div className="p-2 bg-[#722F37]/40 rounded-xl">
            <p className={smallTextStyle}>Net</p>
            <p className={`${valueStyle} font-semibold ${netAnnee >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {netAnnee >= 0 ? '+' : ''}{netAnnee.toFixed(0)}{parametres.devise}
            </p>
          </div>
        </div>
      </div>

      {/* Graphique annuel */}
      <div className={cardStyle}>
        <h4 className={cardTitleStyle + " font-semibold mb-4"}>Évolution {selectedYear}</h4>
        
        <div className="flex items-end justify-between h-32 gap-1">
          {dataGraphiqueAnnuel.map((data, index) => {
            const hauteur = maxGraphique > 0 ? (Math.abs(data.montant) / maxGraphique) * 100 : 0;
            const isPositif = data.montant >= 0;
            const isMoisActuel = index === selectedMonth;
            
            return (
              <div key={data.mois} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="flex-1 flex items-end w-full justify-center">
                  <div
                    className={`w-full max-w-[20px] rounded-t transition-all ${
                      isPositif ? 'bg-green-400' : 'bg-red-400'
                    } ${isMoisActuel ? 'ring-2 ring-[#D4AF37]' : ''}`}
                    style={{ height: `${Math.max(hauteur, 2)}%` }}
                    title={`${data.mois}: ${data.montant.toFixed(0)}${parametres.devise}`}
                  />
                </div>
                <span className={`${smallTextStyle} mt-1 ${isMoisActuel ? 'text-[#D4AF37] font-bold' : ''}`}>
                  {data.mois}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 rounded" />
            <span className={smallTextStyle}>Positif</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded" />
            <span className={smallTextStyle}>Négatif</span>
          </div>
        </div>
      </div>

      {/* Liste des mouvements annuels */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={cardTitleStyle + " font-semibold"}>Tous les mouvements {selectedYear}</h4>
          {transactionsAnnuelles.length > 0 && (
            <span className={smallTextStyle}>
              {displayedTransactionsAnnuelles.length} sur {transactionsAnnuelles.length}
            </span>
          )}
        </div>

        {transactionsAnnuelles.length === 0 ? (
          <p className={pageSubtitleStyle + " text-center py-8"}>Aucun mouvement cette année</p>
        ) : (
          <div className="space-y-2">
            {displayedTransactionsAnnuelles.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#D4AF37]/10">
                <div>
                  <p className="text-sm font-medium text-[#D4AF37]">{t.categorie}</p>
                  <p className={smallTextStyle}>{t.date} • {t.type}</p>
                </div>
                <p className={`text-sm font-semibold ${t.type === 'Épargnes' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type === 'Épargnes' ? '+' : '-'}{parseFloat(t.montant).toFixed(2)} {parametres.devise}
                </p>
              </div>
            ))}

            {hasMoreAnnuel && (
              <button
                onClick={loadMore}
                className="w-full py-3 mt-3 border-2 border-dashed border-[#D4AF37]/50 rounded-xl text-sm font-medium text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
              >
                Voir plus ({transactionsAnnuelles.length - displayCount} restant{transactionsAnnuelles.length - displayCount > 1 ? 's' : ''})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Conseils */}
      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className={conseilIconStyle} />
          <span className={conseilTitleStyle}>💡 Bilan annuel</span>
        </div>
        <div className="space-y-2">
          {netAnnee > 0 && (
            <p className={conseilTextStyle}>🎉 Bravo ! Vous avez épargné {netAnnee.toFixed(0)}{parametres.devise} net cette année</p>
          )}
          {netAnnee < 0 && (
            <p className={conseilTextStyle}>⚠️ Solde annuel négatif. Essayez de limiter les reprises</p>
          )}
          {netAnnee === 0 && transactionsAnnuelles.length === 0 && (
            <p className={conseilTextStyle}>📝 Aucun mouvement d'épargne enregistré cette année</p>
          )}
          {statsAnnee.moisAvecEpargne >= 6 && (
            <p className={conseilTextStyle}>✅ Régularité : vous avez épargné {statsAnnee.moisAvecEpargne} mois sur 12</p>
          )}
          {statsAnnee.moisAvecEpargne > 0 && statsAnnee.moisAvecEpargne < 6 && (
            <p className={conseilTextStyle}>💡 Essayez d'épargner chaque mois pour plus de régularité</p>
          )}
        </div>
      </div>
    </div>
  );

  const tabs: { id: TabType; label: string }[] = [
    { id: 'resume', label: 'Résumé' },
    { id: 'mensuel', label: 'Mensuel' },
    { id: 'analyse', label: 'Analyse' },
    { id: 'historique', label: 'Historique' },
  ];

  return (
    <div className="pb-4">
      {/* Titre centré */}
      <div className="text-center mb-4">
        <h1 className={pageTitleStyle}>Épargnes</h1>
        <p className={pageSubtitleStyle}>Suivi de votre épargne</p>
      </div>

      {/* Sélecteur de mois */}
      <div className={cardStyle + " mb-4"}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5 text-[#D4AF37]" /></button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#D4AF37]">{monthsFull[selectedMonth]}</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-lg px-3 py-1 text-lg font-semibold text-[#D4AF37]">
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5 text-[#D4AF37]" /></button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {monthsShort.map((month, index) => (
            <button key={index} onClick={() => setSelectedMonth(index)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedMonth === index ? 'bg-[#D4AF37] text-[#722F37] border-[#D4AF37]' : 'bg-transparent text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'}`}>{month}</button>
          ))}
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-1 shadow-sm mb-4 flex border border-[#D4AF37]/40">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-colors ${activeTab === tab.id ? 'bg-[#D4AF37] text-[#722F37]' : 'text-[#D4AF37]/70 hover:bg-[#D4AF37]/20'}`}>{tab.label}</button>
        ))}
      </div>

      {/* Contenu */}
      {activeTab === 'resume' && renderResume()}
      {activeTab === 'mensuel' && renderMensuel()}
      {activeTab === 'analyse' && renderAnalyse()}
      {activeTab === 'historique' && renderHistorique()}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, PieChart, BarChart3, Wallet, Receipt, PiggyBank, AlertTriangle, Filter, X, Download, Maximize2, X as XIcon } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  depuis?: string;
  vers?: string;
  moyenPaiement?: string;
}

interface ParametresData {
  comptes: string[];
  moyensPaiement: string[];
}

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

const COLORS = ['#D4AF37', '#8B4557', '#7DD3A8', '#5C9EAD', '#E8A87C', '#C38D9E', '#41B3A3', '#E27D60', '#85DCB8', '#E8A87C'];
const COLORS_TYPE = {
  revenus: '#4CAF50',
  factures: '#F44336',
  depenses: '#FF9800',
  epargnes: '#2196F3'
};

type TabType = 'resume' | 'revenus' | 'factures' | 'depenses' | 'epargnes' | 'evolution';

function StatistiquesContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>({ comptes: [], moyensPaiement: [] });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  
  // Filtres avancés
  const [filterCompte, setFilterCompte] = useState<string>('');
  const [filterMoyenPaiement, setFilterMoyenPaiement] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Export et plein écran
  const [isExporting, setIsExporting] = useState(false);
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  const tooltipContentStyle = {
    fontSize: '10px',
    backgroundColor: theme.colors.cardBackground,
    border: `1px solid ${theme.colors.cardBorder}`,
    borderRadius: '8px',
    color: theme.colors.textPrimary
  };
  const tooltipLabelStyle = { fontSize: '10px', fontWeight: 'bold', color: theme.colors.textPrimary };

  // Marges uniformes pour tous les graphiques
  const chartMargin = { top: 10, right: 10, left: 10, bottom: 10 };
  const chartMarginWithLegend = { top: 10, right: 10, left: 10, bottom: 30 };

  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) {
      const params = JSON.parse(savedParametres);
      setParametres({
        comptes: params.comptes || [],
        moyensPaiement: params.moyensPaiement || []
      });
    }
  }, []);

  // Extraire les comptes et moyens de paiement uniques des transactions
  const comptesUniques = [...new Set(transactions.flatMap(t => [t.depuis, t.vers].filter(Boolean)))];
  const moyensPaiementUniques = [...new Set(transactions.map(t => t.moyenPaiement).filter(Boolean))];
  
  // Nombre de filtres actifs
  const nbFiltresActifs = (filterCompte ? 1 : 0) + (filterMoyenPaiement ? 1 : 0);

  const getFilteredTransactions = () => {
    return transactions.filter(t => {
      // Filtre par date
      let matchDate = false;
      if (selectedMonth === null) {
        matchDate = t.date?.startsWith(`${selectedYear}`);
      } else {
        const monthKey = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
        matchDate = t.date?.startsWith(monthKey);
      }
      if (!matchDate) return false;

      // Filtre par compte
      if (filterCompte && t.depuis !== filterCompte && t.vers !== filterCompte) {
        return false;
      }

      // Filtre par moyen de paiement
      if (filterMoyenPaiement && t.moyenPaiement !== filterMoyenPaiement) {
        return false;
      }

      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalFactures = filteredTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalDepenses = filteredTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEpargnes = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalSorties = totalFactures + totalDepenses + totalEpargnes;
  const solde = totalRevenus - totalSorties;
  const resteAVivre = totalRevenus - totalFactures - totalDepenses;

  // === COMPARAISON MOIS PRÉCÉDENT ===
  const getPreviousMonthTransactions = () => {
    if (selectedMonth === null) {
      // Si vue annuelle, comparer avec année précédente
      return transactions.filter(t => t.date?.startsWith(`${selectedYear - 1}`));
    }
    let prevYear = selectedYear;
    let prevMonth = selectedMonth - 1;
    if (prevMonth < 0) { prevMonth = 11; prevYear--; }
    const prevMonthKey = `${prevYear}-${(prevMonth + 1).toString().padStart(2, '0')}`;
    return transactions.filter(t => t.date?.startsWith(prevMonthKey));
  };

  const prevMonthTransactions = getPreviousMonthTransactions();
  const prevRevenus = prevMonthTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const prevFactures = prevMonthTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const prevDepenses = prevMonthTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const prevEpargnes = prevMonthTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const prevSolde = prevRevenus - prevFactures - prevDepenses - prevEpargnes;
  const prevResteAVivre = prevRevenus - prevFactures - prevDepenses;

  // Calcul des variations en pourcentage
  const calcVariation = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const variationRevenus = calcVariation(totalRevenus, prevRevenus);
  const variationFactures = calcVariation(totalFactures, prevFactures);
  const variationDepenses = calcVariation(totalDepenses, prevDepenses);
  const variationEpargnes = calcVariation(totalEpargnes, prevEpargnes);
  const variationSolde = calcVariation(solde, prevSolde);
  const variationResteAVivre = calcVariation(resteAVivre, prevResteAVivre);

  // === COMPARAISON N-1 (même période, année précédente) ===
  const getN1Transactions = () => {
    if (selectedMonth === null) {
      // Vue annuelle : comparer avec année N-1
      return transactions.filter(t => t.date?.startsWith(`${selectedYear - 1}`));
    }
    // Vue mensuelle : même mois, année précédente
    const n1MonthKey = `${selectedYear - 1}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
    return transactions.filter(t => t.date?.startsWith(n1MonthKey));
  };

  const n1Transactions = getN1Transactions();
  const n1Revenus = n1Transactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const n1Factures = n1Transactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const n1Depenses = n1Transactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const n1Epargnes = n1Transactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const n1Solde = n1Revenus - n1Factures - n1Depenses - n1Epargnes;
  const hasN1Data = n1Transactions.length > 0;

  const variationN1Revenus = calcVariation(totalRevenus, n1Revenus);
  const variationN1Factures = calcVariation(totalFactures, n1Factures);
  const variationN1Depenses = calcVariation(totalDepenses, n1Depenses);
  const variationN1Epargnes = calcVariation(totalEpargnes, n1Epargnes);
  const variationN1Solde = calcVariation(solde, n1Solde);

  // Composant Badge de variation
  const VariationBadge = ({ variation, inverse = false }: { variation: number; inverse?: boolean }) => {
    if (Math.abs(variation) < 1) {
      return <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-500/20 text-gray-400">=</span>;
    }
    // Pour les dépenses/factures, une baisse est positive (inverse=true)
    const isPositive = inverse ? variation < 0 : variation > 0;
    const color = isPositive ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20';
    const arrow = variation > 0 ? '▲' : '▼';
    return (
      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${color}`}>
        {arrow} {Math.abs(variation).toFixed(1)}%
      </span>
    );
  };

  const getDataByCategorie = (type: string) => {
    const data: { [key: string]: number } = {};
    filteredTransactions.filter(t => t.type === type).forEach(t => {
      const cat = t.categorie || 'Autre';
      data[cat] = (data[cat] || 0) + parseFloat(t.montant || '0');
    });
    return Object.entries(data).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  };

  const repartitionData = [
    { name: 'Factures', value: totalFactures, color: COLORS_TYPE.factures },
    { name: 'Dépenses', value: totalDepenses, color: COLORS_TYPE.depenses },
    { name: 'Épargnes', value: totalEpargnes, color: COLORS_TYPE.epargnes },
  ].filter(d => d.value > 0);

  const bilanData = [
    { name: 'Revenus', montant: totalRevenus, fill: COLORS_TYPE.revenus },
    { name: 'Factures', montant: totalFactures, fill: COLORS_TYPE.factures },
    { name: 'Dépenses', montant: totalDepenses, fill: COLORS_TYPE.depenses },
    { name: 'Épargnes', montant: totalEpargnes, fill: COLORS_TYPE.epargnes },
  ];

  const evolutionData = monthsShort.map((month, index) => {
    const monthKey = `${selectedYear}-${(index + 1).toString().padStart(2, '0')}`;
    const monthTransactions = transactions.filter(t => t.date?.startsWith(monthKey));
    const revenus = monthTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const factures = monthTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const depenses = monthTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const epargnes = monthTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    return { name: month, revenus, factures, depenses, epargnes, solde: revenus - factures - depenses - epargnes };
  });

  const top5Depenses = getDataByCategorie('Dépenses').slice(0, 5);

  const prevMonth = () => { if (selectedMonth === null) { setSelectedMonth(11); } else if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); } else { setSelectedMonth(selectedMonth - 1); } };
  const nextMonth = () => { if (selectedMonth === null) { setSelectedMonth(0); } else if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); } else { setSelectedMonth(selectedMonth + 1); } };

  // Taux d'épargne
  const tauxEpargne = totalRevenus > 0 ? (totalEpargnes / totalRevenus) * 100 : 0;
  const prevTauxEpargne = prevRevenus > 0 ? (prevEpargnes / prevRevenus) * 100 : 0;
  const variationTauxEpargne = tauxEpargne - prevTauxEpargne; // Différence en points

  // Couleur du taux d'épargne selon le niveau
  const getTauxEpargneColor = (taux: number) => {
    if (taux >= 20) return 'text-green-400';
    if (taux >= 10) return 'text-yellow-400';
    if (taux > 0) return 'text-orange-400';
    return 'text-gray-400';
  };

  // === MOYENNES MENSUELLES SUR L'ANNÉE ===
  const getYearAverages = () => {
    const yearTransactions = transactions.filter(t => t.date?.startsWith(`${selectedYear}`));
    const monthsWithData = new Set(yearTransactions.map(t => t.date?.substring(0, 7))).size;
    const nbMois = monthsWithData || 1;

    const totalRevYear = yearTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const totalFacYear = yearTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const totalDepYear = yearTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const totalEpaYear = yearTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);

    return {
      revenus: totalRevYear / nbMois,
      factures: totalFacYear / nbMois,
      depenses: totalDepYear / nbMois,
      epargnes: totalEpaYear / nbMois,
      nbMois
    };
  };

  const moyennes = getYearAverages();

  // Comparaison vs moyenne
  const getVsMoyenne = (current: number, moyenne: number) => {
    if (moyenne === 0) return 0;
    return ((current - moyenne) / moyenne) * 100;
  };

  // === PRÉVISION FIN DE MOIS ===
  const now = new Date();
  const currentDay = now.getDate();
  const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();
  
  // Projection des dépenses jusqu'à fin du mois
  const projectionDepenses = currentDay > 0 ? (totalDepenses / currentDay) * daysInCurrentMonth : 0;
  const projectionFactures = currentDay > 0 ? (totalFactures / currentDay) * daysInCurrentMonth : 0;
  const projectionSorties = projectionDepenses + projectionFactures + totalEpargnes;
  const projectionSolde = totalRevenus - projectionSorties;
  const joursRestants = daysInCurrentMonth - currentDay;

  // === EXPORT IMAGE ===
  const handleExportImage = async () => {
    if (!statsRef.current) return;
    setIsExporting(true);
    
    try {
      // Dynamically import dom-to-image-more
      const domtoimage = await import('dom-to-image-more');
      
      const dataUrl = await domtoimage.toPng(statsRef.current, {
        quality: 1,
        bgcolor: theme.colors.background,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      const link = document.createElement('a');
      link.download = `statistiques-${selectedMonth !== null ? monthsFull[selectedMonth].toLowerCase() : 'annee'}-${selectedYear}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Erreur export:', error);
      alert('Erreur lors de l\'export. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  // === COMPOSANT GRAPHIQUE PLEIN ÉCRAN ===
  const FullscreenChartModal = () => {
    if (!fullscreenChart) return null;

    const getChartContent = () => {
      switch (fullscreenChart) {
        case 'repartition':
          return (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4" style={textPrimary}>Répartition des sorties</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsPie>
                  <Pie data={repartitionData} cx="50%" cy="50%" innerRadius={80} outerRadius={150} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={true}>
                    {repartitionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          );
        case 'bilan':
          return (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4" style={textPrimary}>Bilan du budget</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={bilanData} layout="vertical" margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
                  <XAxis type="number" tick={{ fill: theme.colors.textPrimary, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: theme.colors.textPrimary, fontSize: 12 }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                  <Bar dataKey="montant" radius={[0, 8, 8, 0]} barSize={30}>{bilanData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        case 'evolution':
          return (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4" style={textPrimary}>Évolution mensuelle {selectedYear}</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                  <Line type="monotone" dataKey="revenus" stroke={COLORS_TYPE.revenus} strokeWidth={3} dot={{ r: 4 }} name="Revenus" />
                  <Line type="monotone" dataKey="factures" stroke={COLORS_TYPE.factures} strokeWidth={3} dot={{ r: 4 }} name="Factures" />
                  <Line type="monotone" dataKey="depenses" stroke={COLORS_TYPE.depenses} strokeWidth={3} dot={{ r: 4 }} name="Dépenses" />
                  <Line type="monotone" dataKey="epargnes" stroke={COLORS_TYPE.epargnes} strokeWidth={3} dot={{ r: 4 }} name="Épargnes" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        case 'solde':
          return (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4" style={textPrimary}>Évolution du solde {selectedYear}</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                  <Line type="monotone" dataKey="solde" stroke={theme.colors.primary} strokeWidth={4} dot={{ r: 5, fill: theme.colors.primary }} name="Solde" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        case 'revenus-depenses':
          return (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4" style={textPrimary}>Revenus vs Dépenses par mois</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={evolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                  <Bar dataKey="revenus" fill={COLORS_TYPE.revenus} name="Revenus" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="factures" fill={COLORS_TYPE.factures} name="Factures" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="depenses" fill={COLORS_TYPE.depenses} name="Dépenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
        <div className="relative w-full max-w-4xl h-[80vh] rounded-2xl p-6" style={{ background: theme.colors.cardBackground }}>
          <button 
            onClick={() => setFullscreenChart(null)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500/20 transition-colors"
          >
            <XIcon className="w-6 h-6" style={textPrimary} />
          </button>
          {getChartContent()}
        </div>
      </div>
    );
  };

  // Bouton pour agrandir un graphique
  const ExpandButton = ({ chartId }: { chartId: string }) => (
    <button 
      onClick={() => setFullscreenChart(chartId)}
      className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-gray-500/20 transition-colors opacity-60 hover:opacity-100"
      title="Agrandir"
    >
      <Maximize2 className="w-4 h-4" style={textPrimary} />
    </button>
  );

  const renderResume = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center" style={cardStyle}>
          <Wallet className="w-5 h-5 mx-auto mb-1" style={textPrimary} />
          <p className="text-[9px]" style={textSecondary}>Solde</p>
          <p className={`text-lg font-bold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>{solde >= 0 ? '+' : ''}{solde.toFixed(0)} €</p>
          <div className="mt-1"><VariationBadge variation={variationSolde} /></div>
          {/* Prévision fin de mois - uniquement si mois en cours */}
          {isCurrentMonth && joursRestants > 0 && totalDepenses > 0 && (
            <div className="mt-2 pt-2" style={{ borderTopWidth: 1, borderColor: `${theme.colors.cardBorder}50` }}>
              <p className="text-[8px]" style={textSecondary}>Prévu fin mois</p>
              <p className={`text-xs font-semibold ${projectionSolde >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {projectionSolde >= 0 ? '+' : ''}{projectionSolde.toFixed(0)} €
              </p>
            </div>
          )}
        </div>
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center" style={cardStyle}>
          <TrendingUp className="w-5 h-5 mx-auto mb-1" style={textPrimary} />
          <p className="text-[9px]" style={textSecondary}>Reste à vivre</p>
          <p className={`text-lg font-bold ${resteAVivre >= 0 ? 'text-green-400' : 'text-red-400'}`}>{resteAVivre.toFixed(0)} €</p>
          <div className="mt-1"><VariationBadge variation={variationResteAVivre} /></div>
          {/* Jours restants - uniquement si mois en cours */}
          {isCurrentMonth && joursRestants > 0 && (
            <div className="mt-2 pt-2" style={{ borderTopWidth: 1, borderColor: `${theme.colors.cardBorder}50` }}>
              <p className="text-[8px]" style={textSecondary}>{joursRestants}j restants</p>
              <p className="text-xs font-semibold" style={textPrimary}>
                {resteAVivre > 0 ? (resteAVivre / joursRestants).toFixed(0) : 0} €/j
              </p>
            </div>
          )}
        </div>
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center" style={cardStyle}>
          <PiggyBank className="w-5 h-5 mx-auto mb-1" style={textPrimary} />
          <p className="text-[9px]" style={textSecondary}>Taux épargne</p>
          <p className={`text-lg font-bold ${getTauxEpargneColor(tauxEpargne)}`}>{tauxEpargne.toFixed(1)}%</p>
          <div className="mt-1">
            {Math.abs(variationTauxEpargne) < 0.5 ? (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-500/20 text-gray-400">=</span>
            ) : (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${variationTauxEpargne > 0 ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'}`}>
                {variationTauxEpargne > 0 ? '▲' : '▼'} {Math.abs(variationTauxEpargne).toFixed(1)}pts
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3 flex items-center justify-between" style={textPrimary}>
          <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Mon Budget</span>
          <span className="text-[9px] font-normal" style={textSecondary}>vs {selectedMonth === null ? selectedYear - 1 : 'mois préc.'}</span>
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}>
            <span className="text-xs font-medium" style={textPrimary}>Revenus</span>
            <div className="flex items-center gap-2">
              {moyennes.nbMois > 1 && totalRevenus < moyennes.revenus * 0.8 && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 flex items-center gap-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" /> Bas
                </span>
              )}
              <VariationBadge variation={variationRevenus} />
              <span className="text-sm font-semibold text-green-400">+{totalRevenus.toFixed(2)} €</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}>
            <span className="text-xs font-medium" style={textPrimary}>Factures</span>
            <div className="flex items-center gap-2">
              {moyennes.nbMois > 1 && totalFactures > moyennes.factures * 1.2 && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 flex items-center gap-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" /> +20%
                </span>
              )}
              <VariationBadge variation={variationFactures} inverse />
              <span className="text-sm font-semibold text-red-400">-{totalFactures.toFixed(2)} €</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}>
            <span className="text-xs font-medium" style={textPrimary}>Dépenses</span>
            <div className="flex items-center gap-2">
              {moyennes.nbMois > 1 && totalDepenses > moyennes.depenses * 1.2 && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 flex items-center gap-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" /> +20%
                </span>
              )}
              <VariationBadge variation={variationDepenses} inverse />
              <span className="text-sm font-semibold text-orange-400">-{totalDepenses.toFixed(2)} €</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}>
            <span className="text-xs font-medium" style={textPrimary}>Épargnes</span>
            <div className="flex items-center gap-2">
              {moyennes.nbMois > 1 && totalEpargnes < moyennes.epargnes * 0.5 && totalEpargnes < moyennes.epargnes && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" /> Faible
                </span>
              )}
              <VariationBadge variation={variationEpargnes} />
              <span className="text-sm font-semibold text-blue-400">-{totalEpargnes.toFixed(2)} €</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 rounded-lg mt-2 -mx-2 px-2" style={{ background: `${theme.colors.primary}10` }}>
            <span className="text-xs font-bold" style={textPrimary}>Balance</span>
            <div className="flex items-center gap-2">
              <VariationBadge variation={variationSolde} />
              <span className={`text-sm font-bold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>{solde >= 0 ? '+' : ''}{solde.toFixed(2)} €</span>
            </div>
          </div> 
        </div>
      </div>

      {/* Moyennes mensuelles */}
      {selectedMonth !== null && moyennes.nbMois > 1 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3 flex items-center justify-between" style={textPrimary}>
            <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Moyennes {selectedYear}</span>
            <span className="text-[9px] font-normal px-2 py-0.5 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.textSecondary }}>{moyennes.nbMois} mois</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-xl text-center" style={{ background: `${theme.colors.primary}05` }}>
              <p className="text-[9px]" style={textSecondary}>Moy. Revenus</p>
              <p className="text-sm font-semibold text-green-400">{moyennes.revenus.toFixed(0)} €</p>
              <p className={`text-[8px] ${totalRevenus >= moyennes.revenus ? 'text-green-400' : 'text-red-400'}`}>
                {totalRevenus >= moyennes.revenus ? '▲' : '▼'} {Math.abs(getVsMoyenne(totalRevenus, moyennes.revenus)).toFixed(0)}% vs moy.
              </p>
            </div>
            <div className="p-2 rounded-xl text-center" style={{ background: `${theme.colors.primary}05` }}>
              <p className="text-[9px]" style={textSecondary}>Moy. Factures</p>
              <p className="text-sm font-semibold text-red-400">{moyennes.factures.toFixed(0)} €</p>
              <p className={`text-[8px] ${totalFactures <= moyennes.factures ? 'text-green-400' : 'text-red-400'}`}>
                {totalFactures <= moyennes.factures ? '▼' : '▲'} {Math.abs(getVsMoyenne(totalFactures, moyennes.factures)).toFixed(0)}% vs moy.
              </p>
            </div>
            <div className="p-2 rounded-xl text-center" style={{ background: `${theme.colors.primary}05` }}>
              <p className="text-[9px]" style={textSecondary}>Moy. Dépenses</p>
              <p className="text-sm font-semibold text-orange-400">{moyennes.depenses.toFixed(0)} €</p>
              <p className={`text-[8px] ${totalDepenses <= moyennes.depenses ? 'text-green-400' : 'text-red-400'}`}>
                {totalDepenses <= moyennes.depenses ? '▼' : '▲'} {Math.abs(getVsMoyenne(totalDepenses, moyennes.depenses)).toFixed(0)}% vs moy.
              </p>
            </div>
            <div className="p-2 rounded-xl text-center" style={{ background: `${theme.colors.primary}05` }}>
              <p className="text-[9px]" style={textSecondary}>Moy. Épargnes</p>
              <p className="text-sm font-semibold text-blue-400">{moyennes.epargnes.toFixed(0)} €</p>
              <p className={`text-[8px] ${totalEpargnes >= moyennes.epargnes ? 'text-green-400' : 'text-red-400'}`}>
                {totalEpargnes >= moyennes.epargnes ? '▲' : '▼'} {Math.abs(getVsMoyenne(totalEpargnes, moyennes.epargnes)).toFixed(0)}% vs moy.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative" style={cardStyle}>
        <ExpandButton chartId="repartition" />
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}><PieChart className="w-4 h-4" /> Répartition des sorties</h3>
        {repartitionData.length > 0 ? (
          <div className="flex justify-center">
            <div style={{ width: '100%', maxWidth: 280, height: 200 }}>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie data={repartitionData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {repartitionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (<p className="text-xs text-center py-8" style={textSecondary}>Aucune donnée</p>)}
        <div className="flex justify-center gap-4 mt-2">{repartitionData.map((item, i) => (<div key={i} className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-[10px]" style={textSecondary}>{item.name}</span></div>))}</div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative" style={cardStyle}>
        <ExpandButton chartId="bilan" />
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}><BarChart3 className="w-4 h-4" /> Bilan du budget</h3>
        <div className="flex justify-center">
          <div style={{ width: '100%', maxWidth: 350, height: 180 }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={bilanData} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <XAxis type="number" tick={{ fill: theme.colors.textPrimary, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: theme.colors.textPrimary, fontSize: 10 }} width={65} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                <Bar dataKey="montant" radius={[0, 6, 6, 0]} barSize={20}>{bilanData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}><Receipt className="w-4 h-4" /> Top 5 Dépenses</h3>
        {top5Depenses.length > 0 ? (
          <div className="space-y-2">{top5Depenses.map((item, i) => (<div key={i} className="flex items-center justify-between"><div className="flex items-center gap-2 flex-1"><span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `${theme.colors.primary}20`, color: theme.colors.textPrimary }}>{i + 1}</span><span className="text-xs font-medium truncate" style={textPrimary}>{item.name}</span></div><span className="text-sm font-semibold text-orange-400">{item.value.toFixed(2)} €</span></div>))}</div>
        ) : (<p className="text-xs text-center py-4" style={textSecondary}>Aucune dépense</p>)}
      </div>

      <SmartTips page="statistiques" />
    </div>
  );

  const renderDetail = (type: string, color: string) => {
    const data = getDataByCategorie(type);
    const total = data.reduce((sum, d) => sum + d.value, 0);
    return (
      <div className="space-y-4">
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
          <p className="text-xs" style={textSecondary}>Total {type}</p>
          <p className="text-2xl font-semibold" style={{ color }}>{total.toFixed(2)} €</p>
          <p className="text-[10px]" style={textSecondary}>{data.length} catégorie(s)</p>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3" style={textPrimary}>Répartition</h3>
          {data.length > 0 ? (
            <div className="flex justify-center">
              <div style={{ width: '100%', maxWidth: 280, height: 200 }}>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPie>
                    <Pie data={data} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                      {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (<p className="text-xs text-center py-8" style={textSecondary}>Aucune donnée</p>)}
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3" style={textPrimary}>Détail par catégorie</h3>
          {data.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="flex-1 text-[10px] font-semibold" style={textSecondary}>Catégorie</span><span className="w-20 text-right text-[10px] font-semibold" style={textSecondary}>Montant</span><span className="w-16 text-right text-[10px] font-semibold" style={textSecondary}>%</span></div>
              {data.map((item, i) => (<div key={i} className="flex items-center py-2" style={{ borderBottomWidth: 1, borderColor: `${theme.colors.cardBorder}50` }}><div className="flex items-center gap-2 flex-1"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} /><span className="text-xs font-medium truncate" style={textPrimary}>{item.name}</span></div><span className="w-20 text-right text-xs font-medium" style={textPrimary}>{item.value.toFixed(2)} €</span><span className="w-16 text-right text-[10px]" style={textSecondary}>{total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%</span></div>))}
              <div className="flex items-center py-2 rounded-lg px-2 mt-2" style={{ background: `${theme.colors.primary}10` }}><span className="flex-1 text-xs font-bold" style={textPrimary}>Total</span><span className="w-20 text-right text-xs font-bold" style={textPrimary}>{total.toFixed(2)} €</span><span className="w-16 text-right text-[10px] font-bold" style={textSecondary}>100%</span></div>
            </div>
          ) : (<p className="text-xs text-center py-8" style={textSecondary}>Aucune donnée</p>)}
        </div>
      </div>
    );
  };

  const renderEvolution = () => (
    <div className="space-y-4">
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative" style={cardStyle}>
        <ExpandButton chartId="evolution" />
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>Évolution mensuelle {selectedYear}</h3>
        <div className="flex justify-center">
          <div style={{ width: '100%', maxWidth: 380, height: 250 }}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={evolutionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
                <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                <Legend wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="revenus" stroke={COLORS_TYPE.revenus} strokeWidth={2} dot={{ r: 2 }} name="Revenus" />
                <Line type="monotone" dataKey="factures" stroke={COLORS_TYPE.factures} strokeWidth={2} dot={{ r: 2 }} name="Factures" />
                <Line type="monotone" dataKey="depenses" stroke={COLORS_TYPE.depenses} strokeWidth={2} dot={{ r: 2 }} name="Dépenses" />
                <Line type="monotone" dataKey="epargnes" stroke={COLORS_TYPE.epargnes} strokeWidth={2} dot={{ r: 2 }} name="Épargnes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative" style={cardStyle}>
        <ExpandButton chartId="solde" />
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>Évolution du solde {selectedYear}</h3>
        <div className="flex justify-center">
          <div style={{ width: '100%', maxWidth: 380, height: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={evolutionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
                <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                <Line type="monotone" dataKey="solde" stroke={theme.colors.primary} strokeWidth={3} dot={{ r: 3, fill: theme.colors.primary }} name="Solde" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative" style={cardStyle}>
        <ExpandButton chartId="revenus-depenses" />
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>Revenus vs Dépenses par mois</h3>
        <div className="flex justify-center">
          <div style={{ width: '100%', maxWidth: 380, height: 250 }}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={evolutionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
                <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                <Legend wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
                <Bar dataKey="revenus" fill={COLORS_TYPE.revenus} name="Revenus" radius={[4, 4, 0, 0]} />
                <Bar dataKey="factures" fill={COLORS_TYPE.factures} name="Factures" radius={[4, 4, 0, 0]} />
                <Bar dataKey="depenses" fill={COLORS_TYPE.depenses} name="Dépenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>Récapitulatif annuel</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}>
                <th className="py-2 text-left w-12" style={textPrimary}>Mois</th>
                <th className="py-2 text-center text-green-400">Revenus</th>
                <th className="py-2 text-center text-red-400">Factures</th>
                <th className="py-2 text-center text-orange-400">Dépenses</th>
                <th className="py-2 text-center" style={textPrimary}>Solde</th>
              </tr>
            </thead>
            <tbody>
              {evolutionData.map((row, i) => (
                <tr key={i} style={{ borderBottomWidth: 1, borderColor: `${theme.colors.cardBorder}50` }}>
                  <td className="py-2" style={textPrimary}>{row.name}</td>
                  <td className="py-2 text-center text-green-400">{row.revenus > 0 ? row.revenus.toFixed(0) : '-'}</td>
                  <td className="py-2 text-center text-red-400">{row.factures > 0 ? row.factures.toFixed(0) : '-'}</td>
                  <td className="py-2 text-center text-orange-400">{row.depenses > 0 ? row.depenses.toFixed(0) : '-'}</td>
                  <td className={`py-2 text-center font-semibold ${row.solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>{row.solde !== 0 ? row.solde.toFixed(0) : '-'}</td>      
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: `${theme.colors.primary}10` }}>
                <td className="py-2 font-bold" style={textPrimary}>Total</td>
                <td className="py-2 text-center font-bold text-green-400">{evolutionData.reduce((s, r) => s + r.revenus, 0).toFixed(0)}</td>
                <td className="py-2 text-center font-bold text-red-400">{evolutionData.reduce((s, r) => s + r.factures, 0).toFixed(0)}</td>
                <td className="py-2 text-center font-bold text-orange-400">{evolutionData.reduce((s, r) => s + r.depenses, 0).toFixed(0)}</td>
                <td className="py-2 text-center font-bold" style={textPrimary}>{evolutionData.reduce((s, r) => s + r.solde, 0).toFixed(0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Comparaison N-1 (même période, année précédente) */}
      {hasN1Data && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3 flex items-center justify-between" style={textPrimary}>
            <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Comparaison {selectedYear} vs {selectedYear - 1}</span>
            <span className="text-[9px] font-normal px-2 py-0.5 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.textSecondary }}>N-1</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-xl text-center" style={{ background: `${theme.colors.primary}05` }}>
              <p className="text-[9px]" style={textSecondary}>Revenus {selectedYear - 1}</p>
              <p className="text-sm font-semibold text-green-400">{n1Revenus.toFixed(0)} €</p>
              <p className={`text-[8px] ${variationN1Revenus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {variationN1Revenus >= 0 ? '▲' : '▼'} {Math.abs(variationN1Revenus).toFixed(0)}% cette année
              </p>
            </div>
            <div className="p-2 rounded-xl text-center" style={{ background: `${theme.colors.primary}05` }}>
              <p className="text-[9px]" style={textSecondary}>Factures {selectedYear - 1}</p>
              <p className="text-sm font-semibold text-red-400">{n1Factures.toFixed(0)} €</p>
              <p className={`text-[8px] ${variationN1Factures <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {variationN1Factures >= 0 ? '▲' : '▼'} {Math.abs(variationN1Factures).toFixed(0)}% cette année
              </p>
            </div>
            <div className="p-2 rounded-xl text-center" style={{ background: `${theme.colors.primary}05` }}>
              <p className="text-[9px]" style={textSecondary}>Dépenses {selectedYear - 1}</p>
              <p className="text-sm font-semibold text-orange-400">{n1Depenses.toFixed(0)} €</p>
              <p className={`text-[8px] ${variationN1Depenses <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {variationN1Depenses >= 0 ? '▲' : '▼'} {Math.abs(variationN1Depenses).toFixed(0)}% cette année
              </p>
            </div>
            <div className="p-2 rounded-xl text-center" style={{ background: `${theme.colors.primary}05` }}>
              <p className="text-[9px]" style={textSecondary}>Solde {selectedYear - 1}</p>
              <p className={`text-sm font-semibold ${n1Solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>{n1Solde.toFixed(0)} €</p>
              <p className={`text-[8px] ${variationN1Solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {variationN1Solde >= 0 ? '▲' : '▼'} {Math.abs(variationN1Solde).toFixed(0)}% cette année
              </p>
            </div>
          </div>
        </div>
      )}

      <SmartTips page="statistiques" />
    </div>
  );

  const tabs: { id: TabType; label: string }[] = [
    { id: 'resume', label: 'Résumé' }, { id: 'revenus', label: 'Revenus' }, { id: 'factures', label: 'Factures' },
    { id: 'depenses', label: 'Dépenses' }, { id: 'epargnes', label: 'Épargnes' }, { id: 'evolution', label: 'Évolution' }
  ];

  return (
    <div className="pb-4">
      <div className="text-center mb-4"><h1 className="text-lg font-medium" style={textPrimary}>Statistiques</h1><p className="text-xs" style={textSecondary}>Analyse détaillée de votre budget</p></div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5" style={textPrimary} /></button>
          <div className="flex items-center gap-2"><span className="text-lg font-semibold" style={textPrimary}>{selectedMonth !== null ? monthsFull[selectedMonth] : 'Année'}</span><select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="rounded-lg px-3 py-1 text-lg font-semibold border" style={inputStyle}>{years.map(year => (<option key={year} value={year}>{year}</option>))}</select></div>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5" style={textPrimary} /></button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => setSelectedMonth(null)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" style={selectedMonth === null ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>Année</button>
          {monthsShort.map((month, index) => (<button key={index} onClick={() => setSelectedMonth(index)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" style={selectedMonth === index ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>{month}</button>))}
        </div>
      </div>

      {/* Bouton Filtres avancés + Export */}
      <div className="mb-4 flex gap-2">
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors"
          style={showFilters || nbFiltresActifs > 0 ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: theme.colors.cardBackground, color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}
        >
          <Filter className="w-4 h-4" />
          Filtres {nbFiltresActifs > 0 && `(${nbFiltresActifs})`}
        </button>
        
        <button 
          onClick={handleExportImage}
          disabled={isExporting}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors disabled:opacity-50"
          style={{ background: theme.colors.cardBackground, color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Export...' : 'Exporter'}
        </button>

        {/* Panel des filtres */}
        {showFilters && (
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mt-2" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold" style={textPrimary}>Filtres avancés</h4>
              {nbFiltresActifs > 0 && (
                <button 
                  onClick={() => { setFilterCompte(''); setFilterMoyenPaiement(''); }}
                  className="text-[10px] px-2 py-1 rounded-lg flex items-center gap-1"
                  style={{ background: `${theme.colors.primary}20`, color: theme.colors.textPrimary }}
                >
                  <X className="w-3 h-3" /> Réinitialiser
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium mb-1 block" style={textSecondary}>Compte</label>
                <select 
                  value={filterCompte} 
                  onChange={(e) => setFilterCompte(e.target.value)}
                  className="w-full rounded-lg px-2 py-1.5 text-xs border"
                  style={inputStyle}
                >
                  <option value="">Tous les comptes</option>
                  {comptesUniques.map((compte, i) => (
                    <option key={i} value={compte}>{compte}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-medium mb-1 block" style={textSecondary}>Moyen de paiement</label>
                <select 
                  value={filterMoyenPaiement} 
                  onChange={(e) => setFilterMoyenPaiement(e.target.value)}
                  className="w-full rounded-lg px-2 py-1.5 text-xs border"
                  style={inputStyle}
                >
                  <option value="">Tous</option>
                  {moyensPaiementUniques.map((moyen, i) => (
                    <option key={i} value={moyen}>{moyen}</option>
                  ))}
                </select>
              </div>
            </div>
            {nbFiltresActifs > 0 && (
              <p className="text-[10px] mt-2" style={textSecondary}>
                {filteredTransactions.length} transaction(s) trouvée(s)
              </p>
            )}
          </div>
        )}
      </div>

      <div className="overflow-x-auto mb-4"><div className="backdrop-blur-sm rounded-2xl p-1 shadow-sm flex border min-w-max" style={cardStyle}>{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className="py-2 px-3 rounded-xl text-xs font-medium transition-colors whitespace-nowrap" style={activeTab === tab.id ? { background: theme.colors.primary, color: theme.colors.textOnPrimary } : { color: theme.colors.textSecondary }}>{tab.label}</button>))}</div></div>

      <div ref={statsRef}>
        {activeTab === 'resume' && renderResume()}
        {activeTab === 'revenus' && renderDetail('Revenus', COLORS_TYPE.revenus)}
        {activeTab === 'factures' && renderDetail('Factures', COLORS_TYPE.factures)}
        {activeTab === 'depenses' && renderDetail('Dépenses', COLORS_TYPE.depenses)}
        {activeTab === 'epargnes' && renderDetail('Épargnes', COLORS_TYPE.epargnes)}
        {activeTab === 'evolution' && renderEvolution()}
      </div>

      {/* Modal plein écran pour les graphiques */}
      <FullscreenChartModal />
    </div>
  );
}

export default function StatistiquesPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="statistiques" onNavigate={handleNavigate}>
      <StatistiquesContent />
    </AppShell>
  );
}

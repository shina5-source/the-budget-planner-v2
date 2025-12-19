'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell } from '@/components';

import {
  ResumeTab,
  DetailTab,
  EvolutionTab,
  CalendrierTab,
  FluxTab,
  ObjectifsTab,
  StatsSkeletonLoader,
  Transaction,
  ObjectifBudget,
  TabType,
  COLORS_TYPE,
  COLORS,
  monthsFull,
  monthsShort,
  years,
  calculateTotals,
  calculatePrevTotals,
  calculateYearAverages,
  calculateEvolutionData,
  filterTransactionsByPeriod,
  calculateVariation,
  getN1Totals
} from './components';

function StatistiquesContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme, isDarkMode } = useTheme() as any;
  const statsRef = useRef<HTMLDivElement>(null);

  // États
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  const [objectifsBudget, setObjectifsBudget] = useState<ObjectifBudget[]>([]);
  
  // Filtres
  const [showFilters, setShowFilters] = useState(false);
  const [compteFilter, setCompteFilter] = useState('all');
  const [moyenPaiementFilter, setMoyenPaiementFilter] = useState('all');
  
  // Fullscreen chart
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null);

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  // Charger les données
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem('budget-transactions');
        if (stored) {
          setTransactions(JSON.parse(stored));
        }
        
        const storedObjectifs = localStorage.getItem('budget-objectifs-limites');
        if (storedObjectifs) {
          setObjectifsBudget(JSON.parse(storedObjectifs));
        }
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Sauvegarder les objectifs
  useEffect(() => {
    if (objectifsBudget.length > 0) {
      localStorage.setItem('budget-objectifs-limites', JSON.stringify(objectifsBudget));
    }
  }, [objectifsBudget]);

  // Calculs mémorisés
  const filteredTransactions = useMemo(() => {
    return filterTransactionsByPeriod(transactions, selectedMonth, selectedYear, {
      compte: compteFilter,
      moyenPaiement: moyenPaiementFilter
    });
  }, [transactions, selectedMonth, selectedYear, compteFilter, moyenPaiementFilter]);

  const totals = useMemo(() => calculateTotals(filteredTransactions), [filteredTransactions]);
  const prevTotals = useMemo(() => calculatePrevTotals(transactions, selectedMonth, selectedYear), [transactions, selectedMonth, selectedYear]);
  const moyennes = useMemo(() => calculateYearAverages(transactions, selectedYear), [transactions, selectedYear]);
  const evolutionData = useMemo(() => calculateEvolutionData(transactions, selectedYear), [transactions, selectedYear]);

  const hasMoyennes = useMemo(() => {
    const monthsWithData = new Set<string>();
    transactions.forEach(t => {
      if (t.date) {
        const d = new Date(t.date);
        if (d.getFullYear() === selectedYear) {
          monthsWithData.add(`${d.getMonth()}`);
        }
      }
    });
    return monthsWithData.size > 1;
  }, [transactions, selectedYear]);

  const n1Data = useMemo(() => getN1Totals(transactions, selectedYear), [transactions, selectedYear]);
  const hasN1Data = n1Data.hasData;

  const variationN1Revenus = useMemo(() => {
    const currentYearTotals = calculateTotals(transactions.filter(t => t.date && new Date(t.date).getFullYear() === selectedYear));
    return calculateVariation(currentYearTotals.revenus, n1Data.revenus);
  }, [transactions, selectedYear, n1Data]);

  const variationN1Factures = useMemo(() => {
    const currentYearTotals = calculateTotals(transactions.filter(t => t.date && new Date(t.date).getFullYear() === selectedYear));
    return calculateVariation(currentYearTotals.factures, n1Data.factures);
  }, [transactions, selectedYear, n1Data]);

  const variationN1Depenses = useMemo(() => {
    const currentYearTotals = calculateTotals(transactions.filter(t => t.date && new Date(t.date).getFullYear() === selectedYear));
    return calculateVariation(currentYearTotals.depenses, n1Data.depenses);
  }, [transactions, selectedYear, n1Data]);

  const variationN1Solde = useMemo(() => {
    const currentYearTotals = calculateTotals(transactions.filter(t => t.date && new Date(t.date).getFullYear() === selectedYear));
    return calculateVariation(currentYearTotals.solde, n1Data.solde);
  }, [transactions, selectedYear, n1Data]);

  const comptes = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => {
      if (t.depuis) set.add(t.depuis);
      if (t.vers) set.add(t.vers);
    });
    return Array.from(set);
  }, [transactions]);

  const moyensPaiement = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => {
      if (t.moyenPaiement) set.add(t.moyenPaiement);
    });
    return Array.from(set);
  }, [transactions]);

  // Navigation mois
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedMonth === null) {
      setSelectedYear(selectedYear - 1);
    } else if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedMonth === null) {
      setSelectedYear(selectedYear + 1);
    } else if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleSelectMonth = (e: React.MouseEvent, index: number | null) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedMonth(index);
  };

  // Export image - Utilise dom-to-image-more (meilleur support SVG)
  const handleExport = async () => {
    if (!statsRef.current) return;
    
    try {
      const element = statsRef.current;
      
      // 1. Désactiver les animations temporairement
      const style = document.createElement('style');
      style.id = 'export-fix';
      style.textContent = `
        * {
          animation: none !important;
          transition: none !important;
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(style);
      
      // 2. Attendre un frame
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 3. Utiliser dom-to-image-more
      const domtoimage = await import('dom-to-image-more');
      
      const dataUrl = await domtoimage.toPng(element, {
        quality: 1,
        bgcolor: isDarkMode ? '#1a1a2e' : '#faf5f5',
        style: {
          transform: 'none',
          opacity: '1'
        },
        filter: (node: Node) => {
          // Exclure les éléments problématiques si nécessaire
          return true;
        }
      });
      
      // 4. Restaurer les animations
      document.getElementById('export-fix')?.remove();
      
      // 5. Télécharger
      const link = document.createElement('a');
      link.download = `statistiques-${selectedYear}-${selectedMonth !== null ? selectedMonth + 1 : 'annee'}.png`;
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('Erreur export:', error);
      
      // Restaurer les animations en cas d'erreur
      document.getElementById('export-fix')?.remove();
      
      // Fallback : essayer avec html2canvas basique
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(statsRef.current!, {
          backgroundColor: isDarkMode ? '#1a1a2e' : '#faf5f5',
          scale: 2,
          logging: false,
          ignoreElements: (el) => {
            // Ignorer les SVG problématiques
            return el.tagName === 'svg';
          }
        });
        
        const link = document.createElement('a');
        link.download = `statistiques-${selectedYear}-${selectedMonth !== null ? selectedMonth + 1 : 'annee'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (fallbackError) {
        alert('L\'export a échoué. Utilisez la capture d\'écran (Ctrl+Shift+S).');
      }
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'resume', label: 'Résumé' },
    { id: 'revenus', label: 'Revenus' },
    { id: 'factures', label: 'Factures' },
    { id: 'depenses', label: 'Dépenses' },
    { id: 'epargnes', label: 'Épargnes' },
    { id: 'evolution', label: 'Évolution' },
    { id: 'calendrier', label: '📅' },
    { id: 'flux', label: '💸' },
    { id: 'objectifs', label: '🎯' }
  ];

  // Modal plein écran
  const renderFullscreenModal = () => {
    if (!fullscreenChart) return null;

    // Couleurs fixes pour éviter les problèmes de transparence
    const modalBg = isDarkMode ? '#1a1a2e' : '#ffffff';
    const modalBorder = isDarkMode ? '#2d2d44' : '#e5e5e5';

    const tooltipStyle = {
      fontSize: '10px',
      backgroundColor: modalBg,
      border: `1px solid ${modalBorder}`,
      borderRadius: '8px',
      color: theme.colors.textPrimary
    };

    const pieData = [
      { name: 'Factures', value: totals.factures, color: COLORS_TYPE.factures },
      { name: 'Dépenses', value: totals.depenses, color: COLORS_TYPE.depenses },
      { name: 'Épargnes', value: totals.epargnes, color: COLORS_TYPE.epargnes }
    ].filter(d => d.value > 0);

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setFullscreenChart(null)}>
        <div className="rounded-2xl p-6 w-full max-w-4xl h-[80vh] border shadow-2xl" style={{ background: modalBg, borderColor: modalBorder }} onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium" style={textPrimary}>Graphique</h2>
            <button type="button" onClick={() => setFullscreenChart(null)} className="p-2 rounded-xl" style={{ background: `${theme.colors.primary}20` }}>
              <X className="w-5 h-5" style={textPrimary} />
            </button>
          </div>

          <div className="w-full h-[calc(100%-60px)]">
            {fullscreenChart === 'pie-resume' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={100} outerRadius={200} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}

            {fullscreenChart === 'bar-resume' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Revenus', value: totals.revenus, fill: COLORS_TYPE.revenus },
                  { name: 'Factures', value: totals.factures, fill: COLORS_TYPE.factures },
                  { name: 'Dépenses', value: totals.depenses, fill: COLORS_TYPE.depenses },
                  { name: 'Épargnes', value: totals.epargnes, fill: COLORS_TYPE.epargnes }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} />
                  <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary }} />
                  <YAxis tick={{ fill: theme.colors.textPrimary }} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipStyle} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {[COLORS_TYPE.revenus, COLORS_TYPE.factures, COLORS_TYPE.depenses, COLORS_TYPE.epargnes].map((color, index) => (<Cell key={`cell-${index}`} fill={color} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {fullscreenChart === 'evolution-line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} />
                  <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary }} />
                  <YAxis tick={{ fill: theme.colors.textPrimary }} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="revenus" stroke={COLORS_TYPE.revenus} strokeWidth={3} />
                  <Line type="monotone" dataKey="factures" stroke={COLORS_TYPE.factures} strokeWidth={3} />
                  <Line type="monotone" dataKey="depenses" stroke={COLORS_TYPE.depenses} strokeWidth={3} />
                  <Line type="monotone" dataKey="epargnes" stroke={COLORS_TYPE.epargnes} strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            )}

            {fullscreenChart === 'taux-epargne' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolutionData.map(d => ({ ...d, tauxEpargne: d.revenus > 0 ? (d.epargnes / d.revenus) * 100 : 0 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} />
                  <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary }} />
                  <YAxis tick={{ fill: theme.colors.textPrimary }} unit="%" />
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="tauxEpargne" stroke={COLORS_TYPE.epargnes} fill={COLORS_TYPE.epargnes} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {fullscreenChart === 'solde-cumule' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolutionData.reduce((acc: { name: string; soldeCumule: number }[], d, i) => {
                  const prev = i > 0 ? acc[i - 1].soldeCumule : 0;
                  acc.push({ name: d.name, soldeCumule: prev + d.solde });
                  return acc;
                }, [])}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} />
                  <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary }} />
                  <YAxis tick={{ fill: theme.colors.textPrimary }} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="soldeCumule" stroke={theme.colors.primary} fill={theme.colors.primary} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {fullscreenChart === 'revenus-vs-sorties' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolutionData.map(d => ({ name: d.name, Revenus: d.revenus, Sorties: d.factures + d.depenses + d.epargnes }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} />
                  <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary }} />
                  <YAxis tick={{ fill: theme.colors.textPrimary }} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="Revenus" fill={COLORS_TYPE.revenus} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Sorties" fill={COLORS_TYPE.factures} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <StatsSkeletonLoader />;
  }

  return (
    <>
      <div className="pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-medium flex items-center gap-2" style={textPrimary}>
            📊 Statistiques
          </h1>
          <button 
            type="button"
            onClick={handleExport} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all hover:scale-105 active:scale-95" 
            style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}
          >
            <Download size={14} />
            Export
          </button>
        </div>

        {/* MonthSelector harmonisé */}
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border mb-4" style={cardStyle}>
          {/* Navigation mois */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 transition-all hover:scale-110 active:scale-95 rounded-lg"
              style={{ color: textSecondary.color }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <span 
                className="text-lg font-bold"
                style={{ color: theme.colors.primary }}
              >
                {selectedMonth !== null ? monthsFull[selectedMonth] : 'Année'}
              </span>
              
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold border cursor-pointer transition-all hover:opacity-80"
                style={inputStyle}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 transition-all hover:scale-110 active:scale-95 rounded-lg"
              style={{ color: textSecondary.color }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Boutons mois */}
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            <button
              type="button"
              onClick={(e) => handleSelectMonth(e, null)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95 border"
              style={selectedMonth === null
                ? {
                    background: theme.colors.primary,
                    color: theme.colors.textOnPrimary || '#ffffff',
                    borderColor: theme.colors.primary,
                    boxShadow: `0 2px 8px ${theme.colors.primary}40`
                  }
                : {
                    background: 'transparent',
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.cardBorder
                  }
              }
            >
              Année
            </button>
            
            {monthsShort.map((month, index) => (
              <button
                type="button"
                key={index}
                onClick={(e) => handleSelectMonth(e, index)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95 border"
                style={selectedMonth === index
                  ? {
                      background: theme.colors.primary,
                      color: theme.colors.textOnPrimary || '#ffffff',
                      borderColor: theme.colors.primary,
                      boxShadow: `0 2px 8px ${theme.colors.primary}40`
                    }
                  : {
                      background: 'transparent',
                      color: theme.colors.textPrimary,
                      borderColor: theme.colors.cardBorder
                    }
                }
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton Filtres */}
        <button 
          type="button"
          onClick={() => setShowFilters(!showFilters)} 
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border mb-4 transition-all hover:scale-105"
          style={{ 
            borderColor: (compteFilter !== 'all' || moyenPaiementFilter !== 'all') ? theme.colors.primary : theme.colors.cardBorder,
            color: theme.colors.textPrimary,
            background: (compteFilter !== 'all' || moyenPaiementFilter !== 'all') ? `${theme.colors.primary}20` : 'transparent'
          }}
        >
          <Filter size={14} />
          Filtres
          {(compteFilter !== 'all' || moyenPaiementFilter !== 'all') && (
            <span className="w-2 h-2 rounded-full" style={{ background: theme.colors.primary }} />
          )}
        </button>

        {/* Panel Filtres */}
        {showFilters && (
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] mb-1 block" style={textSecondary}>Compte</label>
                <select value={compteFilter} onChange={(e) => setCompteFilter(e.target.value)} className="w-full px-2 py-1.5 rounded-lg border text-xs" style={inputStyle}>
                  <option value="all">Tous les comptes</option>
                  {comptes.map(compte => (<option key={compte} value={compte}>{compte}</option>))}
                </select>
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={textSecondary}>Moyen de paiement</label>
                <select value={moyenPaiementFilter} onChange={(e) => setMoyenPaiementFilter(e.target.value)} className="w-full px-2 py-1.5 rounded-lg border text-xs" style={inputStyle}>
                  <option value="all">Tous</option>
                  {moyensPaiement.map(mp => (<option key={mp} value={mp}>{mp}</option>))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Onglets */}
        <div className="backdrop-blur-sm rounded-2xl p-1 shadow-sm mb-4 flex border overflow-x-auto" style={cardStyle}>
          {tabs.map((tab) => (
            <button 
              type="button"
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className="flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap"
              style={activeTab === tab.id 
                ? { background: theme.colors.primary, color: theme.colors.textOnPrimary } 
                : { color: theme.colors.textSecondary }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <div ref={statsRef}>
          {activeTab === 'resume' && (
            <ResumeTab
              totals={totals}
              prevTotals={prevTotals}
              moyennes={moyennes}
              hasMoyennes={hasMoyennes}
              filteredTransactions={filteredTransactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'revenus' && (
            <DetailTab
              type="Revenus"
              color={COLORS_TYPE.revenus}
              filteredTransactions={filteredTransactions}
              allTransactions={transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'factures' && (
            <DetailTab
              type="Factures"
              color={COLORS_TYPE.factures}
              filteredTransactions={filteredTransactions}
              allTransactions={transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'depenses' && (
            <DetailTab
              type="Dépenses"
              color={COLORS_TYPE.depenses}
              filteredTransactions={filteredTransactions}
              allTransactions={transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'epargnes' && (
            <DetailTab
              type="Épargnes"
              color={COLORS_TYPE.epargnes}
              filteredTransactions={filteredTransactions}
              allTransactions={transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'evolution' && (
            <EvolutionTab
              evolutionData={evolutionData}
              selectedYear={selectedYear}
              hasN1Data={hasN1Data}
              n1Revenus={n1Data.revenus}
              n1Factures={n1Data.factures}
              n1Depenses={n1Data.depenses}
              n1Solde={n1Data.solde}
              variationN1Revenus={variationN1Revenus}
              variationN1Factures={variationN1Factures}
              variationN1Depenses={variationN1Depenses}
              variationN1Solde={variationN1Solde}
              onExpandChart={setFullscreenChart}
            />
          )}

          {activeTab === 'calendrier' && (
            <CalendrierTab
              filteredTransactions={filteredTransactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}

          {activeTab === 'flux' && (
            <FluxTab
              totals={totals}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}

          {activeTab === 'objectifs' && (
            <ObjectifsTab
              filteredTransactions={filteredTransactions}
              objectifsBudget={objectifsBudget}
              setObjectifsBudget={setObjectifsBudget}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}
        </div>
      </div>

      {renderFullscreenModal()}
    </>
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

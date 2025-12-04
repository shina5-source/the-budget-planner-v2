"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, PieChart, BarChart3, Wallet, CreditCard, PiggyBank, Receipt, Lightbulb } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  depuis?: string;
  vers?: string;
}

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

// Couleurs pour les graphiques
const COLORS = ['#D4AF37', '#8B4557', '#7DD3A8', '#5C9EAD', '#E8A87C', '#C38D9E', '#41B3A3', '#E27D60', '#85DCB8', '#E8A87C'];
const COLORS_TYPE = {
  revenus: '#4CAF50',
  factures: '#F44336',
  depenses: '#FF9800',
  epargnes: '#2196F3'
};

type TabType = 'resume' | 'revenus' | 'factures' | 'depenses' | 'epargnes' | 'evolution';

export default function StatistiquesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [activeTab, setActiveTab] = useState<TabType>('resume');

  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  // Filtrer par période
  const getFilteredTransactions = () => {
    return transactions.filter(t => {
      if (selectedMonth === null) {
        return t.date?.startsWith(`${selectedYear}`);
      }
      const monthKey = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
      return t.date?.startsWith(monthKey);
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculs principaux
  const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalFactures = filteredTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalDepenses = filteredTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEpargnes = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalSorties = totalFactures + totalDepenses + totalEpargnes;
  const solde = totalRevenus - totalSorties;
  const resteAVivre = totalRevenus - totalFactures - totalDepenses;

  // Données par catégorie
  const getDataByCategorie = (type: string) => {
    const data: { [key: string]: number } = {};
    filteredTransactions.filter(t => t.type === type).forEach(t => {
      const cat = t.categorie || 'Autre';
      data[cat] = (data[cat] || 0) + parseFloat(t.montant || '0');
    });
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Données pour le camembert répartition
  const repartitionData = [
    { name: 'Factures', value: totalFactures, color: COLORS_TYPE.factures },
    { name: 'Dépenses', value: totalDepenses, color: COLORS_TYPE.depenses },
    { name: 'Épargnes', value: totalEpargnes, color: COLORS_TYPE.epargnes },
  ].filter(d => d.value > 0);

  // Données pour le graphique barres bilan
  const bilanData = [
    { name: 'Revenus', montant: totalRevenus, fill: COLORS_TYPE.revenus },
    { name: 'Factures', montant: totalFactures, fill: COLORS_TYPE.factures },
    { name: 'Dépenses', montant: totalDepenses, fill: COLORS_TYPE.depenses },
    { name: 'Épargnes', montant: totalEpargnes, fill: COLORS_TYPE.epargnes },
  ];

  // Données évolution mensuelle (année complète)
  const evolutionData = monthsShort.map((month, index) => {
    const monthKey = `${selectedYear}-${(index + 1).toString().padStart(2, '0')}`;
    const monthTransactions = transactions.filter(t => t.date?.startsWith(monthKey));
    
    const revenus = monthTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const factures = monthTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const depenses = monthTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const epargnes = monthTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    return {
      name: month,
      revenus,
      factures,
      depenses,
      epargnes,
      solde: revenus - factures - depenses - epargnes
    };
  });

  // Top 5 catégories
  const top5Depenses = getDataByCategorie('Dépenses').slice(0, 5);
  const top5Factures = getDataByCategorie('Factures').slice(0, 5);

  // Navigation
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

  // STYLES
  const cardStyle = "bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#D4AF37]/40";
  const pageTitleStyle = "text-lg font-medium text-[#D4AF37]";
  const pageSubtitleStyle = "text-xs text-[#D4AF37]/70";
  const smallTextStyle = "text-[10px] text-[#D4AF37]/60";
  const valueStyle = "text-xs font-medium text-[#D4AF37]";
  const sectionTitleStyle = "text-sm font-semibold text-[#D4AF37]";
  const amountLargeStyle = "text-2xl font-semibold text-[#D4AF37]";

  const conseilCardStyle = "bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50";
  const conseilTitleStyle = "text-xs font-semibold text-[#7DD3A8]";
  const conseilTextStyle = "text-[10px] text-[#7DD3A8]";
  const conseilIconStyle = "w-4 h-4 text-[#7DD3A8]";

  // Rendu du résumé
  const renderResume = () => (
    <div className="space-y-4">
      {/* Solde et bilan rapide */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cardStyle + " text-center"}>
          <Wallet className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
          <p className={smallTextStyle}>Solde période</p>
          <p className={`text-xl font-bold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {solde >= 0 ? '+' : ''}{solde.toFixed(2)} €
          </p>
        </div>
        <div className={cardStyle + " text-center"}>
          <TrendingUp className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
          <p className={smallTextStyle}>Reste à vivre</p>
          <p className={`text-xl font-bold ${resteAVivre >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {resteAVivre.toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Tableau Mon Budget */}
      <div className={cardStyle}>
        <h3 className={sectionTitleStyle + " mb-3 flex items-center gap-2"}>
          <BarChart3 className="w-4 h-4" /> Mon Budget
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={valueStyle}>Revenus</span>
            <span className="text-sm font-semibold text-green-400">+{totalRevenus.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={valueStyle}>Factures</span>
            <span className="text-sm font-semibold text-red-400">-{totalFactures.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={valueStyle}>Dépenses</span>
            <span className="text-sm font-semibold text-orange-400">-{totalDepenses.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={valueStyle}>Épargnes</span>
            <span className="text-sm font-semibold text-blue-400">-{totalEpargnes.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2 bg-[#D4AF37]/10 rounded-lg px-2 mt-2">
            <span className={valueStyle + " font-bold"}>Balance</span>
            <span className={`text-sm font-bold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {solde >= 0 ? '+' : ''}{solde.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>

      {/* Graphique Répartition */}
      <div className={cardStyle}>
        <h3 className={sectionTitleStyle + " mb-3 flex items-center gap-2"}>
          <PieChart className="w-4 h-4" /> Répartition des sorties
        </h3>
        {repartitionData.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={repartitionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {repartitionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className={pageSubtitleStyle + " text-center py-8"}>Aucune donnée</p>
        )}
        <div className="flex justify-center gap-4 mt-2">
          {repartitionData.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className={smallTextStyle}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique Barres Bilan */}
      <div className={cardStyle}>
        <h3 className={sectionTitleStyle + " mb-3 flex items-center gap-2"}>
          <BarChart3 className="w-4 h-4" /> Bilan du budget
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bilanData} layout="vertical">
              <XAxis type="number" tick={{ fill: '#D4AF37', fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#D4AF37', fontSize: 10 }} width={70} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
              <Bar dataKey="montant" radius={[0, 4, 4, 0]}>
                {bilanData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Dépenses */}
      <div className={cardStyle}>
        <h3 className={sectionTitleStyle + " mb-3 flex items-center gap-2"}>
          <Receipt className="w-4 h-4" /> Top 5 Dépenses
        </h3>
        {top5Depenses.length > 0 ? (
          <div className="space-y-2">
            {top5Depenses.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-5 h-5 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[10px] text-[#D4AF37] font-bold">
                    {i + 1}
                  </span>
                  <span className={valueStyle + " truncate"}>{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-orange-400">{item.value.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        ) : (
          <p className={pageSubtitleStyle + " text-center py-4"}>Aucune dépense</p>
        )}
      </div>

      {/* Conseils */}
      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className={conseilIconStyle} />
          <h4 className={conseilTitleStyle}>💡 Analyse</h4>
        </div>
        <div className="space-y-2">
          {solde >= 0 ? (
            <p className={conseilTextStyle}>✅ Budget équilibré ! Solde positif de {solde.toFixed(2)} €</p>
          ) : (
            <p className={conseilTextStyle}>⚠️ Attention ! Déficit de {Math.abs(solde).toFixed(2)} €</p>
          )}
          {totalEpargnes > 0 && totalRevenus > 0 && (
            <p className={conseilTextStyle}>💰 Taux d'épargne : {((totalEpargnes / totalRevenus) * 100).toFixed(1)}%</p>
          )}
          {totalDepenses > totalFactures && (
            <p className={conseilTextStyle}>📊 Dépenses variables supérieures aux charges fixes</p>
          )}
        </div>
      </div>
    </div>
  );

  // Rendu détail par type
  const renderDetail = (type: string, color: string) => {
    const data = getDataByCategorie(type);
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
      <div className="space-y-4">
        {/* Total */}
        <div className={cardStyle + " text-center"}>
          <p className={pageSubtitleStyle}>Total {type}</p>
          <p className={amountLargeStyle} style={{ color }}>{total.toFixed(2)} €</p>
          <p className={smallTextStyle}>{data.length} catégorie(s)</p>
        </div>

        {/* Camembert */}
        <div className={cardStyle}>
          <h3 className={sectionTitleStyle + " mb-3"}>Répartition</h3>
          {data.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className={pageSubtitleStyle + " text-center py-8"}>Aucune donnée</p>
          )}
        </div>

        {/* Tableau détaillé */}
        <div className={cardStyle}>
          <h3 className={sectionTitleStyle + " mb-3"}>Détail par catégorie</h3>
          {data.length > 0 ? (
            <div className="space-y-2">
              {/* En-tête */}
              <div className="flex items-center py-2 border-b border-[#D4AF37]/30">
                <span className={smallTextStyle + " flex-1 font-semibold"}>Catégorie</span>
                <span className={smallTextStyle + " w-20 text-right font-semibold"}>Montant</span>
                <span className={smallTextStyle + " w-16 text-right font-semibold"}>%</span>
              </div>
              {/* Lignes */}
              {data.map((item, i) => (
                <div key={i} className="flex items-center py-2 border-b border-[#D4AF37]/10">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className={valueStyle + " truncate"}>{item.name}</span>
                  </div>
                  <span className={valueStyle + " w-20 text-right"}>{item.value.toFixed(2)} €</span>
                  <span className={smallTextStyle + " w-16 text-right"}>
                    {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              ))}
              {/* Total */}
              <div className="flex items-center py-2 bg-[#D4AF37]/10 rounded-lg px-2 mt-2">
                <span className={valueStyle + " flex-1 font-bold"}>Total</span>
                <span className={valueStyle + " w-20 text-right font-bold"}>{total.toFixed(2)} €</span>
                <span className={smallTextStyle + " w-16 text-right font-bold"}>100%</span>
              </div>
            </div>
          ) : (
            <p className={pageSubtitleStyle + " text-center py-8"}>Aucune donnée</p>
          )}
        </div>
      </div>
    );
  };

  // Rendu évolution
  const renderEvolution = () => (
    <div className="space-y-4">
      {/* Courbe évolution */}
      <div className={cardStyle}>
        <h3 className={sectionTitleStyle + " mb-3"}>Évolution mensuelle {selectedYear}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4AF37" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: '#D4AF37', fontSize: 10 }} />
              <YAxis tick={{ fill: '#D4AF37', fontSize: 10 }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
              <Legend />
              <Line type="monotone" dataKey="revenus" stroke={COLORS_TYPE.revenus} strokeWidth={2} dot={{ r: 3 }} name="Revenus" />
              <Line type="monotone" dataKey="factures" stroke={COLORS_TYPE.factures} strokeWidth={2} dot={{ r: 3 }} name="Factures" />
              <Line type="monotone" dataKey="depenses" stroke={COLORS_TYPE.depenses} strokeWidth={2} dot={{ r: 3 }} name="Dépenses" />
              <Line type="monotone" dataKey="epargnes" stroke={COLORS_TYPE.epargnes} strokeWidth={2} dot={{ r: 3 }} name="Épargnes" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Courbe solde */}
      <div className={cardStyle}>
        <h3 className={sectionTitleStyle + " mb-3"}>Évolution du solde {selectedYear}</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4AF37" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: '#D4AF37', fontSize: 10 }} />
              <YAxis tick={{ fill: '#D4AF37', fontSize: 10 }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
              <Line type="monotone" dataKey="solde" stroke="#D4AF37" strokeWidth={3} dot={{ r: 4 }} name="Solde" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barres comparatives */}
      <div className={cardStyle}>
        <h3 className={sectionTitleStyle + " mb-3"}>Revenus vs Dépenses par mois</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4AF37" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: '#D4AF37', fontSize: 10 }} />
              <YAxis tick={{ fill: '#D4AF37', fontSize: 10 }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
              <Legend />
              <Bar dataKey="revenus" fill={COLORS_TYPE.revenus} name="Revenus" radius={[4, 4, 0, 0]} />
              <Bar dataKey="factures" fill={COLORS_TYPE.factures} name="Factures" radius={[4, 4, 0, 0]} />
              <Bar dataKey="depenses" fill={COLORS_TYPE.depenses} name="Dépenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau récapitulatif */}
      <div className={cardStyle}>
        <h3 className={sectionTitleStyle + " mb-3"}>Récapitulatif annuel</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#D4AF37]/30">
                <th className="py-2 text-left text-[#D4AF37]">Mois</th>
                <th className="py-2 text-right text-green-400">Revenus</th>
                <th className="py-2 text-right text-red-400">Factures</th>
                <th className="py-2 text-right text-orange-400">Dépenses</th>
                <th className="py-2 text-right text-[#D4AF37]">Solde</th>
              </tr>
            </thead>
            <tbody>
              {evolutionData.map((row, i) => (
                <tr key={i} className="border-b border-[#D4AF37]/10">
                  <td className="py-2 text-[#D4AF37]">{row.name}</td>
                  <td className="py-2 text-right text-green-400">{row.revenus > 0 ? row.revenus.toFixed(0) : '-'}</td>
                  <td className="py-2 text-right text-red-400">{row.factures > 0 ? row.factures.toFixed(0) : '-'}</td>
                  <td className="py-2 text-right text-orange-400">{row.depenses > 0 ? row.depenses.toFixed(0) : '-'}</td>
                  <td className={`py-2 text-right font-semibold ${row.solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {row.solde !== 0 ? row.solde.toFixed(0) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#D4AF37]/10">
                <td className="py-2 font-bold text-[#D4AF37]">Total</td>
                <td className="py-2 text-right font-bold text-green-400">
                  {evolutionData.reduce((s, r) => s + r.revenus, 0).toFixed(0)}
                </td>
                <td className="py-2 text-right font-bold text-red-400">
                  {evolutionData.reduce((s, r) => s + r.factures, 0).toFixed(0)}
                </td>
                <td className="py-2 text-right font-bold text-orange-400">
                  {evolutionData.reduce((s, r) => s + r.depenses, 0).toFixed(0)}
                </td>
                <td className="py-2 text-right font-bold text-[#D4AF37]">
                  {evolutionData.reduce((s, r) => s + r.solde, 0).toFixed(0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs: { id: TabType; label: string }[] = [
    { id: 'resume', label: 'Résumé' },
    { id: 'revenus', label: 'Revenus' },
    { id: 'factures', label: 'Factures' },
    { id: 'depenses', label: 'Dépenses' },
    { id: 'epargnes', label: 'Épargnes' },
    { id: 'evolution', label: 'Évolution' },
  ];

  return (
    <div className="pb-4">
      {/* Titre */}
      <div className="text-center mb-4">
        <h1 className={pageTitleStyle}>Statistiques</h1>
        <p className={pageSubtitleStyle}>Analyse détaillée de votre budget</p>
      </div>

      {/* Sélecteur de période */}
      <div className={cardStyle + " mb-4"}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1">
            <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#D4AF37]">
              {selectedMonth !== null ? monthsFull[selectedMonth] : 'Année'}
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-lg px-3 py-1 text-lg font-semibold text-[#D4AF37]"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button onClick={nextMonth} className="p-1">
            <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
          </button>
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
            Année
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

      {/* Onglets */}
      <div className="overflow-x-auto mb-4">
        <div className="bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-1 shadow-sm flex border border-[#D4AF37]/40 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-3 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-[#722F37]'
                  : 'text-[#D4AF37]/70 hover:bg-[#D4AF37]/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      {activeTab === 'resume' && renderResume()}
      {activeTab === 'revenus' && renderDetail('Revenus', COLORS_TYPE.revenus)}
      {activeTab === 'factures' && renderDetail('Factures', COLORS_TYPE.factures)}
      {activeTab === 'depenses' && renderDetail('Dépenses', COLORS_TYPE.depenses)}
      {activeTab === 'epargnes' && renderDetail('Épargnes', COLORS_TYPE.epargnes)}
      {activeTab === 'evolution' && renderEvolution()}
    </div>
  );
}
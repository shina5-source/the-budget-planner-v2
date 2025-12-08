"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, PieChart, BarChart3, Wallet, Receipt, Lightbulb } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { useTheme } from '../../contexts/theme-context';

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

// Couleurs pour les graphiques - PRÉSERVÉES (semantiques)
const COLORS = ['#D4AF37', '#8B4557', '#7DD3A8', '#5C9EAD', '#E8A87C', '#C38D9E', '#41B3A3', '#E27D60', '#85DCB8', '#E8A87C'];
const COLORS_TYPE = {
  revenus: '#4CAF50',
  factures: '#F44336',
  depenses: '#FF9800',
  epargnes: '#2196F3'
};

type TabType = 'resume' | 'revenus' | 'factures' | 'depenses' | 'epargnes' | 'evolution';

export default function StatistiquesPage() {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [activeTab, setActiveTab] = useState<TabType>('resume');

  // Dynamic styles
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  // Tooltip style dynamique
  const tooltipContentStyle = { 
    fontSize: '10px', 
    backgroundColor: theme.colors.cardBackground, 
    border: `1px solid ${theme.colors.cardBorder}`, 
    borderRadius: '8px',
    color: theme.colors.textPrimary
  };
  const tooltipLabelStyle = { fontSize: '10px', fontWeight: 'bold', color: theme.colors.textPrimary };

  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  const getFilteredTransactions = () => {
    return transactions.filter(t => {
      if (selectedMonth === null) return t.date?.startsWith(`${selectedYear}`);
      const monthKey = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
      return t.date?.startsWith(monthKey);
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

  const renderResume = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
          <Wallet className="w-6 h-6 mx-auto mb-2" style={textPrimary} />
          <p className="text-[10px]" style={textSecondary}>Solde période</p>
          <p className={`text-xl font-bold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>{solde >= 0 ? '+' : ''}{solde.toFixed(2)} €</p>
        </div>
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
          <TrendingUp className="w-6 h-6 mx-auto mb-2" style={textPrimary} />
          <p className="text-[10px]" style={textSecondary}>Reste à vivre</p>
          <p className={`text-xl font-bold ${resteAVivre >= 0 ? 'text-green-400' : 'text-red-400'}`}>{resteAVivre.toFixed(2)} €</p>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}><BarChart3 className="w-4 h-4" /> Mon Budget</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs font-medium" style={textPrimary}>Revenus</span><span className="text-sm font-semibold text-green-400">+{totalRevenus.toFixed(2)} €</span></div>
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs font-medium" style={textPrimary}>Factures</span><span className="text-sm font-semibold text-red-400">-{totalFactures.toFixed(2)} €</span></div>
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs font-medium" style={textPrimary}>Dépenses</span><span className="text-sm font-semibold text-orange-400">-{totalDepenses.toFixed(2)} €</span></div>
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}><span className="text-xs font-medium" style={textPrimary}>Épargnes</span><span className="text-sm font-semibold text-blue-400">-{totalEpargnes.toFixed(2)} €</span></div>
          <div className="flex justify-between items-center py-2 rounded-lg px-2 mt-2" style={{ background: `${theme.colors.primary}10` }}><span className="text-xs font-bold" style={textPrimary}>Balance</span><span className={`text-sm font-bold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>{solde >= 0 ? '+' : ''}{solde.toFixed(2)} €</span></div>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}><PieChart className="w-4 h-4" /> Répartition des sorties</h3>
        {repartitionData.length > 0 ? (
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPie>
                <Pie data={repartitionData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {repartitionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        ) : (<p className="text-xs text-center py-8" style={textSecondary}>Aucune donnée</p>)}
        <div className="flex justify-center gap-4 mt-2">{repartitionData.map((item, i) => (<div key={i} className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-[10px]" style={textSecondary}>{item.name}</span></div>))}</div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}><BarChart3 className="w-4 h-4" /> Bilan du budget</h3>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bilanData} layout="vertical">
              <XAxis type="number" tick={{ fill: theme.colors.textPrimary, fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: theme.colors.textPrimary, fontSize: 10 }} width={70} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
              <Bar dataKey="montant" radius={[0, 4, 4, 0]}>{bilanData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}><Receipt className="w-4 h-4" /> Top 5 Dépenses</h3>
        {top5Depenses.length > 0 ? (
          <div className="space-y-2">{top5Depenses.map((item, i) => (<div key={i} className="flex items-center justify-between"><div className="flex items-center gap-2 flex-1"><span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `${theme.colors.primary}20`, color: theme.colors.textPrimary }}>{i + 1}</span><span className="text-xs font-medium truncate" style={textPrimary}>{item.name}</span></div><span className="text-sm font-semibold text-orange-400">{item.value.toFixed(2)} €</span></div>))}</div>
        ) : (<p className="text-xs text-center py-4" style={textSecondary}>Aucune dépense</p>)}
      </div>

      <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50">
        <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-[#7DD3A8]" /><h4 className="text-xs font-semibold text-[#7DD3A8]">💡 Analyse</h4></div>
        <div className="space-y-2">
          {solde >= 0 ? (<p className="text-[10px] text-[#7DD3A8]">✅ Budget équilibré ! Solde positif de {solde.toFixed(2)} €</p>) : (<p className="text-[10px] text-[#7DD3A8]">⚠️ Attention ! Déficit de {Math.abs(solde).toFixed(2)} €</p>)}
          {totalEpargnes > 0 && totalRevenus > 0 && (<p className="text-[10px] text-[#7DD3A8]">💰 Taux d'épargne : {((totalEpargnes / totalRevenus) * 100).toFixed(1)}%</p>)}
          {totalDepenses > totalFactures && (<p className="text-[10px] text-[#7DD3A8]">📊 Dépenses variables supérieures aux charges fixes</p>)}
        </div>
      </div>
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
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie data={data} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
                </RechartsPie>
              </ResponsiveContainer>
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
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>Évolution mensuelle {selectedYear}</h3>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.primary} opacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 10 }} />
              <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 10 }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="revenus" stroke={COLORS_TYPE.revenus} strokeWidth={2} dot={{ r: 3 }} name="Revenus" />
              <Line type="monotone" dataKey="factures" stroke={COLORS_TYPE.factures} strokeWidth={2} dot={{ r: 3 }} name="Factures" />
              <Line type="monotone" dataKey="depenses" stroke={COLORS_TYPE.depenses} strokeWidth={2} dot={{ r: 3 }} name="Dépenses" />
              <Line type="monotone" dataKey="epargnes" stroke={COLORS_TYPE.epargnes} strokeWidth={2} dot={{ r: 3 }} name="Épargnes" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>Évolution du solde {selectedYear}</h3>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.primary} opacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 10 }} />
              <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 10 }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
              <Line type="monotone" dataKey="solde" stroke={theme.colors.primary} strokeWidth={3} dot={{ r: 4 }} name="Solde" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>Revenus vs Dépenses par mois</h3>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.primary} opacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 10 }} />
              <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 10 }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="revenus" fill={COLORS_TYPE.revenus} name="Revenus" radius={[4, 4, 0, 0]} />
              <Bar dataKey="factures" fill={COLORS_TYPE.factures} name="Factures" radius={[4, 4, 0, 0]} />
              <Bar dataKey="depenses" fill={COLORS_TYPE.depenses} name="Dépenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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

      <div className="overflow-x-auto mb-4"><div className="backdrop-blur-sm rounded-2xl p-1 shadow-sm flex border min-w-max" style={cardStyle}>{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className="py-2 px-3 rounded-xl text-xs font-medium transition-colors whitespace-nowrap" style={activeTab === tab.id ? { background: theme.colors.primary, color: theme.colors.textOnPrimary } : { color: theme.colors.textSecondary }}>{tab.label}</button>))}</div></div>

      {activeTab === 'resume' && renderResume()}
      {activeTab === 'revenus' && renderDetail('Revenus', COLORS_TYPE.revenus)}
      {activeTab === 'factures' && renderDetail('Factures', COLORS_TYPE.factures)}
      {activeTab === 'depenses' && renderDetail('Dépenses', COLORS_TYPE.depenses)}
      {activeTab === 'epargnes' && renderDetail('Épargnes', COLORS_TYPE.epargnes)}
      {activeTab === 'evolution' && renderEvolution()}
    </div>
  );
}

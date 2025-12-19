'use client';

import { TrendingUp, PiggyBank, Wallet, Maximize2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import { useTheme } from '@/contexts/theme-context';
import { SmartTips } from '@/components';
import VariationBadge from './VariationBadge';
import { EvolutionDataItem, COLORS_TYPE, monthsShort, monthsFull } from './types';

interface EvolutionTabProps {
  evolutionData: EvolutionDataItem[];
  selectedYear: number;
  hasN1Data: boolean;
  n1Revenus: number;
  n1Factures: number;
  n1Depenses: number;
  n1Solde: number;
  variationN1Revenus: number;
  variationN1Factures: number;
  variationN1Depenses: number;
  variationN1Solde: number;
  onExpandChart: (chartId: string) => void;
}

export default function EvolutionTab({
  evolutionData,
  selectedYear,
  hasN1Data,
  n1Revenus,
  n1Factures,
  n1Depenses,
  n1Solde,
  variationN1Revenus,
  variationN1Factures,
  variationN1Depenses,
  variationN1Solde,
  onExpandChart
}: EvolutionTabProps) {
  const { theme } = useTheme();

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const tooltipStyle = {
    fontSize: '10px',
    backgroundColor: theme.colors.cardBackground,
    border: `1px solid ${theme.colors.cardBorder}`,
    borderRadius: '8px',
    color: theme.colors.textPrimary
  };

  // Calcul du taux d'épargne par mois
  const tauxEpargneData = evolutionData.map(d => ({
    ...d,
    tauxEpargne: d.revenus > 0 ? (d.epargnes / d.revenus) * 100 : 0
  }));

  // Calcul du solde cumulé (patrimoine)
  const soldeCumuleData = evolutionData.reduce((acc: { name: string; soldeCumule: number; solde: number }[], d, i) => {
    const prev = i > 0 ? acc[i - 1].soldeCumule : 0;
    acc.push({ name: d.name, soldeCumule: prev + d.solde, solde: d.solde });
    return acc;
  }, []);

  // Prévision 3 prochains mois (moyenne des 3 derniers mois avec données)
  const moisAvecDonnees = evolutionData.filter(d => d.revenus > 0 || d.depenses > 0);
  const derniersMois = moisAvecDonnees.slice(-3);
  const avgRevenus = derniersMois.length > 0 ? derniersMois.reduce((s, d) => s + d.revenus, 0) / derniersMois.length : 0;
  const avgFactures = derniersMois.length > 0 ? derniersMois.reduce((s, d) => s + d.factures, 0) / derniersMois.length : 0;
  const avgDepenses = derniersMois.length > 0 ? derniersMois.reduce((s, d) => s + d.depenses, 0) / derniersMois.length : 0;
  const avgEpargnes = derniersMois.length > 0 ? derniersMois.reduce((s, d) => s + d.epargnes, 0) / derniersMois.length : 0;
  const avgSolde = avgRevenus - avgFactures - avgDepenses - avgEpargnes;

  // Données revenus vs dépenses pour bar chart
  const revenusVsDepenses = evolutionData.map(d => ({
    name: d.name,
    Revenus: d.revenus,
    Sorties: d.factures + d.depenses + d.epargnes
  }));

  // Tableau récapitulatif
  const tableData = evolutionData.map((d, i) => ({
    ...d,
    total: d.factures + d.depenses + d.epargnes,
    tauxEpargne: d.revenus > 0 ? (d.epargnes / d.revenus) * 100 : 0
  }));

  return (
    <div className="space-y-4">
      {/* Graphique évolution mensuelle */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative animate-fade-in-up stagger-1" style={cardStyle}>
        <button
          onClick={() => onExpandChart('evolution-line')}
          className="absolute top-3 right-3 p-1.5 rounded-lg transition-all hover:scale-110"
          style={{ background: `${theme.colors.primary}20` }}
        >
          <Maximize2 size={14} style={{ color: theme.colors.primary }} />
        </button>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
          Évolution mensuelle {selectedYear}
        </h3>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="revenus" stroke={COLORS_TYPE.revenus} strokeWidth={2} dot={{ r: 2 }} name="Revenus" />
              <Line type="monotone" dataKey="factures" stroke={COLORS_TYPE.factures} strokeWidth={2} dot={{ r: 2 }} name="Factures" />
              <Line type="monotone" dataKey="depenses" stroke={COLORS_TYPE.depenses} strokeWidth={2} dot={{ r: 2 }} name="Dépenses" />
              <Line type="monotone" dataKey="epargnes" stroke={COLORS_TYPE.epargnes} strokeWidth={2} dot={{ r: 2 }} name="Épargnes" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Taux d'épargne mensuel */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative animate-fade-in-up stagger-2" style={cardStyle}>
        <button
          onClick={() => onExpandChart('taux-epargne')}
          className="absolute top-3 right-3 p-1.5 rounded-lg transition-all hover:scale-110"
          style={{ background: `${theme.colors.primary}20` }}
        >
          <Maximize2 size={14} style={{ color: theme.colors.primary }} />
        </button>
        <div className="flex items-center gap-2 mb-3">
          <PiggyBank size={16} style={{ color: COLORS_TYPE.epargnes }} />
          <h3 className="text-sm font-semibold" style={textPrimary}>
            Taux d'épargne mensuel
          </h3>
        </div>
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tauxEpargneData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} width={35} unit="%" />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} contentStyle={tooltipStyle} />
              <defs>
                <linearGradient id="colorTaux" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS_TYPE.epargnes} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS_TYPE.epargnes} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="tauxEpargne" stroke={COLORS_TYPE.epargnes} fill="url(#colorTaux)" name="Taux" />
              {/* Ligne objectif 20% */}
              <Line type="monotone" dataKey={() => 20} stroke="#22C55E" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Objectif 20%" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[9px] text-center mt-2" style={textSecondary}>
          Objectif recommandé : 20% (ligne verte)
        </p>
      </div>

      {/* Solde cumulé (patrimoine) */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative animate-fade-in-up stagger-3" style={cardStyle}>
        <button
          onClick={() => onExpandChart('solde-cumule')}
          className="absolute top-3 right-3 p-1.5 rounded-lg transition-all hover:scale-110"
          style={{ background: `${theme.colors.primary}20` }}
        >
          <Maximize2 size={14} style={{ color: theme.colors.primary }} />
        </button>
        <div className="flex items-center gap-2 mb-3">
          <Wallet size={16} style={{ color: theme.colors.primary }} />
          <h3 className="text-sm font-semibold" style={textPrimary}>
            Solde cumulé {selectedYear}
          </h3>
        </div>
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={soldeCumuleData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} width={45} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipStyle} />
              <defs>
                <linearGradient id="colorCumule" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="soldeCumule" stroke={theme.colors.primary} fill="url(#colorCumule)" name="Cumulé" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenus vs Sorties */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative animate-fade-in-up stagger-4" style={cardStyle}>
        <button
          onClick={() => onExpandChart('revenus-vs-sorties')}
          className="absolute top-3 right-3 p-1.5 rounded-lg transition-all hover:scale-110"
          style={{ background: `${theme.colors.primary}20` }}
        >
          <Maximize2 size={14} style={{ color: theme.colors.primary }} />
        </button>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
          Revenus vs Sorties
        </h3>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenusVsDepenses} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.cardBorder} opacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.colors.textPrimary, fontSize: 9 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '9px' }} />
              <Bar dataKey="Revenus" fill={COLORS_TYPE.revenus} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Sorties" fill={COLORS_TYPE.factures} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prévision 3 prochains mois */}
      {derniersMois.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} style={{ color: theme.colors.primary }} />
            <h3 className="text-sm font-semibold" style={textPrimary}>
              Prévision (basée sur les 3 derniers mois)
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl" style={{ background: `${COLORS_TYPE.revenus}15` }}>
              <p className="text-[9px]" style={textSecondary}>Revenus moyens</p>
              <p className="text-lg font-bold" style={{ color: COLORS_TYPE.revenus }}>{avgRevenus.toFixed(0)} €</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: `${COLORS_TYPE.factures}15` }}>
              <p className="text-[9px]" style={textSecondary}>Sorties moyennes</p>
              <p className="text-lg font-bold" style={{ color: COLORS_TYPE.factures }}>{(avgFactures + avgDepenses).toFixed(0)} €</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: `${COLORS_TYPE.epargnes}15` }}>
              <p className="text-[9px]" style={textSecondary}>Épargne moyenne</p>
              <p className="text-lg font-bold" style={{ color: COLORS_TYPE.epargnes }}>{avgEpargnes.toFixed(0)} €</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: `${theme.colors.primary}15` }}>
              <p className="text-[9px]" style={textSecondary}>Solde prévu/mois</p>
              <p className={`text-lg font-bold ${avgSolde >= 0 ? 'text-green-500' : 'text-red-500'}`}>{avgSolde.toFixed(0)} €</p>
            </div>
          </div>
        </div>
      )}

      {/* Comparaison N-1 */}
      {hasN1Data && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-6" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
            Comparaison avec {selectedYear - 1}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Revenus', value: n1Revenus, variation: variationN1Revenus, color: COLORS_TYPE.revenus, better: variationN1Revenus >= 0 },
              { label: 'Factures', value: n1Factures, variation: variationN1Factures, color: COLORS_TYPE.factures, better: variationN1Factures <= 0 },
              { label: 'Dépenses', value: n1Depenses, variation: variationN1Depenses, color: COLORS_TYPE.depenses, better: variationN1Depenses <= 0 },
              { label: 'Solde', value: n1Solde, variation: variationN1Solde, color: n1Solde >= 0 ? 'text-green-400' : 'text-red-400', better: variationN1Solde >= 0 },
            ].map((item, i) => (
              <div key={i} className="p-2 rounded-xl text-center" style={{ background: `${theme.colors.primary}05` }}>
                <p className="text-[9px]" style={textSecondary}>{item.label} {selectedYear - 1}</p>
                <p className="text-sm font-semibold" style={{ color: typeof item.color === 'string' && item.color.startsWith('text-') ? undefined : item.color }}>
                  <span className={typeof item.color === 'string' && item.color.startsWith('text-') ? item.color : ''}>
                    {item.value.toFixed(0)} €
                  </span>
                </p>
                <p className={`text-[8px] ${item.better ? 'text-green-400' : 'text-red-400'}`}>
                  {item.variation >= 0 ? '▲' : '▼'} {Math.abs(item.variation).toFixed(0)}% cette année
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tableau récapitulatif */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-7" style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
          Récapitulatif {selectedYear}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[9px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.colors.cardBorder}` }}>
                <th className="text-left py-2 px-1" style={textSecondary}>Mois</th>
                <th className="text-right py-2 px-1" style={{ color: COLORS_TYPE.revenus }}>Rev.</th>
                <th className="text-right py-2 px-1" style={{ color: COLORS_TYPE.factures }}>Fact.</th>
                <th className="text-right py-2 px-1" style={{ color: COLORS_TYPE.depenses }}>Dép.</th>
                <th className="text-right py-2 px-1" style={{ color: COLORS_TYPE.epargnes }}>Ép.</th>
                <th className="text-right py-2 px-1" style={textPrimary}>Solde</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${theme.colors.cardBorder}30` }}>
                  <td className="py-1.5 px-1 font-medium" style={textPrimary}>{row.name}</td>
                  <td className="text-right py-1.5 px-1" style={textSecondary}>{row.revenus > 0 ? row.revenus.toFixed(0) : '-'}</td>
                  <td className="text-right py-1.5 px-1" style={textSecondary}>{row.factures > 0 ? row.factures.toFixed(0) : '-'}</td>
                  <td className="text-right py-1.5 px-1" style={textSecondary}>{row.depenses > 0 ? row.depenses.toFixed(0) : '-'}</td>
                  <td className="text-right py-1.5 px-1" style={textSecondary}>{row.epargnes > 0 ? row.epargnes.toFixed(0) : '-'}</td>
                  <td className={`text-right py-1.5 px-1 font-medium ${row.solde >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(row.revenus > 0 || row.total > 0) ? row.solde.toFixed(0) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SmartTips page="statistiques" />
    </div>
  );
}
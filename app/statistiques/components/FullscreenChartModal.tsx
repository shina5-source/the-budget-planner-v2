'use client';

import { X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import { useTheme } from '@/contexts/theme-context';
import { COLORS_TYPE } from './types';

interface FullscreenChartModalProps {
  fullscreenChart: string | null;
  onClose: () => void;
  totals: {
    revenus: number;
    factures: number;
    depenses: number;
    epargnes: number;
    solde: number;
  };
  evolutionData: {
    name: string;
    revenus: number;
    factures: number;
    depenses: number;
    epargnes: number;
    solde: number;
  }[];
}

export default function FullscreenChartModal({
  fullscreenChart,
  onClose,
  totals,
  evolutionData
}: FullscreenChartModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme, isDarkMode } = useTheme() as any;

  if (!fullscreenChart) return null;

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
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm animate-fadeIn" 
      onClick={onClose}
    >
      <div 
        className="rounded-2xl p-6 w-full max-w-4xl h-[80vh] border shadow-2xl animate-fadeIn my-20"
        style={{ background: modalBg, borderColor: modalBorder, animationDelay: '100ms' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: theme.colors.textPrimary }}>
            Graphique
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ background: `${theme.colors.primary}20` }}
          >
            <X className="w-5 h-5" style={{ color: theme.colors.textPrimary }} />
          </button>
        </div>

        <div className="w-full h-[calc(100%-60px)]">
          {fullscreenChart === 'pie-resume' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={100} 
                  outerRadius={200} 
                  paddingAngle={3} 
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
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
                  {[COLORS_TYPE.revenus, COLORS_TYPE.factures, COLORS_TYPE.depenses, COLORS_TYPE.epargnes].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
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
              <AreaChart data={evolutionData.map(d => ({ 
                ...d, 
                tauxEpargne: d.revenus > 0 ? (d.epargnes / d.revenus) * 100 : 0 
              }))}>
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
              <BarChart data={evolutionData.map(d => ({ 
                name: d.name, 
                Revenus: d.revenus, 
                Sorties: d.factures + d.depenses + d.epargnes 
              }))}>
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
}
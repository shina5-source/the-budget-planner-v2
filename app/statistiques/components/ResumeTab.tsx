'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, AlertTriangle, Maximize2, PartyPopper } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTheme } from '@/contexts/theme-context';
import { SmartTips } from '@/components';
import VariationBadge from './VariationBadge';
import { Transaction, TotalsData, MoyennesData, COLORS, COLORS_TYPE, monthsFull } from './types';
import { calculateVariation } from './utils';

interface ResumeTabProps {
  totals: TotalsData;
  prevTotals: TotalsData;
  moyennes: MoyennesData;
  hasMoyennes: boolean;
  filteredTransactions: Transaction[];
  selectedMonth: number | null;
  selectedYear: number;
  onExpandChart: (chartId: string) => void;
}

// Composant Confetti simple
function ConfettiEffect() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0'
          }}
        />
      ))}
    </div>
  );
}

// Composant pour animation de compteur
function AnimatedNumber({ value, suffix = '€', duration = 1000 }: { value: number; suffix?: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOut;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{displayValue.toFixed(0)}{suffix}</>;
}

export default function ResumeTab({
  totals,
  prevTotals,
  moyennes,
  hasMoyennes,
  filteredTransactions,
  selectedMonth,
  selectedYear,
  onExpandChart
}: ResumeTabProps) {
  const { theme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

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

  // Calculs
  const tauxEpargne = totals.revenus > 0 ? (totals.epargnes / totals.revenus) * 100 : 0;
  const prevTauxEpargne = prevTotals.revenus > 0 ? (prevTotals.epargnes / prevTotals.revenus) * 100 : 0;
  const resteAVivre = totals.revenus - totals.factures - totals.depenses - totals.epargnes;

  // Confettis si taux épargne >= 20%
  useEffect(() => {
    if (tauxEpargne >= 20 && !hasShownConfetti && totals.revenus > 0) {
      setShowConfetti(true);
      setHasShownConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [tauxEpargne, hasShownConfetti, totals.revenus]);

  // Variations
  const variationRevenus = calculateVariation(totals.revenus, prevTotals.revenus);
  const variationFactures = calculateVariation(totals.factures, prevTotals.factures);
  const variationDepenses = calculateVariation(totals.depenses, prevTotals.depenses);
  const variationEpargnes = calculateVariation(totals.epargnes, prevTotals.epargnes);
  const variationSolde = calculateVariation(totals.solde, prevTotals.solde);
  const variationTauxEpargne = tauxEpargne - prevTauxEpargne;

  // Données pour les graphiques
  const pieData = [
    { name: 'Factures', value: totals.factures, color: COLORS_TYPE.factures },
    { name: 'Dépenses', value: totals.depenses, color: COLORS_TYPE.depenses },
    { name: 'Épargnes', value: totals.epargnes, color: COLORS_TYPE.epargnes }
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Revenus', value: totals.revenus, fill: COLORS_TYPE.revenus },
    { name: 'Factures', value: totals.factures, fill: COLORS_TYPE.factures },
    { name: 'Dépenses', value: totals.depenses, fill: COLORS_TYPE.depenses },
    { name: 'Épargnes', value: totals.epargnes, fill: COLORS_TYPE.epargnes }
  ];

  // Top 5 transactions
  const top5 = [...filteredTransactions]
    .filter(t => t.type !== 'Revenu')
    .sort((a, b) => parseFloat(b.montant || '0') - parseFloat(a.montant || '0'))
    .slice(0, 5);

  // Alertes
  const alertes: { type: 'warning' | 'success' | 'info'; message: string }[] = [];
  
  if (hasMoyennes) {
    if (totals.depenses > moyennes.depenses * 1.2) {
      alertes.push({ type: 'warning', message: `Dépenses supérieures de ${((totals.depenses / moyennes.depenses - 1) * 100).toFixed(0)}% à la moyenne` });
    }
    if (totals.factures > moyennes.factures * 1.2) {
      alertes.push({ type: 'warning', message: `Factures supérieures de ${((totals.factures / moyennes.factures - 1) * 100).toFixed(0)}% à la moyenne` });
    }
  }
  
  if (tauxEpargne >= 20) {
    alertes.push({ type: 'success', message: `🎉 Excellent ! Taux d'épargne de ${tauxEpargne.toFixed(1)}%` });
  } else if (tauxEpargne < 10 && totals.revenus > 0) {
    alertes.push({ type: 'warning', message: `Taux d'épargne faible (${tauxEpargne.toFixed(1)}%)` });
  }

  // Prévision fin de mois
  const now = new Date();
  const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();
  const jourActuel = now.getDate();
  const joursRestants = isCurrentMonth ? new Date(selectedYear, (selectedMonth ?? 0) + 1, 0).getDate() - jourActuel : 0;
  const depenseParJour = jourActuel > 0 ? (totals.depenses + totals.factures) / jourActuel : 0;
  const previsionFinMois = isCurrentMonth ? (totals.depenses + totals.factures) + (depenseParJour * joursRestants) : 0;

  const periodLabel = selectedMonth !== null ? monthsFull[selectedMonth] : 'Année';

  return (
    <div className="space-y-4">
      {/* Confettis */}
      {showConfetti && <ConfettiEffect />}

      {/* Grille principale : Solde, Reste à vivre, Taux épargne */}
      <div className="grid grid-cols-3 gap-3">
        {/* Solde */}
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border animate-fade-in-up stagger-1" style={cardStyle}>
          <div className="flex items-center justify-between mb-1">
            <Wallet size={16} style={{ color: theme.colors.primary }} />
            <VariationBadge variation={variationSolde} />
          </div>
          <p className="text-[10px]" style={textSecondary}>Solde</p>
          <p className={`text-lg font-bold ${totals.solde >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <AnimatedNumber value={totals.solde} />
          </p>
        </div>

        {/* Reste à vivre */}
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border animate-fade-in-up stagger-2" style={cardStyle}>
          <div className="flex items-center justify-between mb-1">
            {resteAVivre >= 0 ? (
              <TrendingUp size={16} className="text-green-500" />
            ) : (
              <TrendingDown size={16} className="text-red-500" />
            )}
          </div>
          <p className="text-[10px]" style={textSecondary}>Reste à vivre</p>
          <p className={`text-lg font-bold ${resteAVivre >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <AnimatedNumber value={resteAVivre} />
          </p>
        </div>

        {/* Taux d'épargne */}
        <div 
          className={`backdrop-blur-sm rounded-2xl p-3 shadow-sm border animate-fade-in-up stagger-3 transition-all duration-500 ${tauxEpargne >= 20 ? 'ring-2 ring-green-500/50' : ''}`} 
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <PiggyBank size={16} style={{ color: COLORS_TYPE.epargnes }} />
              {tauxEpargne >= 20 && <PartyPopper size={12} className="text-yellow-500 animate-bounce" />}
            </div>
            <VariationBadge variation={variationTauxEpargne} showPoints />
          </div>
          <p className="text-[10px]" style={textSecondary}>Taux épargne</p>
          <p className="text-lg font-bold" style={{ color: COLORS_TYPE.epargnes }}>
            <AnimatedNumber value={tauxEpargne} suffix="%" />
          </p>
          {/* Barre de progression vers 20% */}
          <div className="mt-1 h-1 rounded-full" style={{ background: `${COLORS_TYPE.epargnes}30` }}>
            <div 
              className="h-full rounded-full transition-all duration-1000"
              style={{ 
                width: `${Math.min(tauxEpargne / 20 * 100, 100)}%`,
                background: tauxEpargne >= 20 ? '#22C55E' : COLORS_TYPE.epargnes
              }}
            />
          </div>
        </div>
      </div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <div className="space-y-2 animate-fade-in-up stagger-4">
          {alertes.map((alerte, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 p-2 rounded-xl text-xs transition-all duration-300 ${alerte.type === 'success' ? 'animate-pulse' : ''}`}
              style={{
                background: alerte.type === 'warning' 
                  ? 'rgba(245, 158, 11, 0.1)' 
                  : alerte.type === 'success' 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : `${theme.colors.primary}10`,
                color: alerte.type === 'warning' 
                  ? '#F59E0B' 
                  : alerte.type === 'success' 
                    ? '#22C55E' 
                    : theme.colors.primary
              }}
            >
              <AlertTriangle size={14} />
              {alerte.message}
            </div>
          ))}
        </div>
      )}

      {/* Prévision fin de mois */}
      {isCurrentMonth && joursRestants > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border animate-fade-in-up stagger-5" style={cardStyle}>
          <p className="text-[10px] mb-1" style={textSecondary}>Prévision fin de mois</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={textPrimary}>
                ~<AnimatedNumber value={previsionFinMois} /> de sorties
              </p>
              <p className="text-[10px]" style={textSecondary}>
                {joursRestants} jours restants • {depenseParJour.toFixed(0)}€/jour
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px]" style={textSecondary}>Solde prévu</p>
              <p className={`text-sm font-bold ${(totals.revenus - previsionFinMois - totals.epargnes) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <AnimatedNumber value={totals.revenus - previsionFinMois - totals.epargnes} />
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Moyennes (si données sur plusieurs mois) */}
      {hasMoyennes && selectedMonth !== null && (
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border animate-fade-in-up stagger-5" style={cardStyle}>
          <p className="text-[10px] mb-2" style={textSecondary}>Moyennes mensuelles {selectedYear}</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-[9px]" style={textSecondary}>Revenus</p>
              <p className="text-xs font-semibold" style={{ color: COLORS_TYPE.revenus }}>{moyennes.revenus.toFixed(0)}€</p>
            </div>
            <div>
              <p className="text-[9px]" style={textSecondary}>Factures</p>
              <p className="text-xs font-semibold" style={{ color: COLORS_TYPE.factures }}>{moyennes.factures.toFixed(0)}€</p>
            </div>
            <div>
              <p className="text-[9px]" style={textSecondary}>Dépenses</p>
              <p className="text-xs font-semibold" style={{ color: COLORS_TYPE.depenses }}>{moyennes.depenses.toFixed(0)}€</p>
            </div>
            <div>
              <p className="text-[9px]" style={textSecondary}>Épargnes</p>
              <p className="text-xs font-semibold" style={{ color: COLORS_TYPE.epargnes }}>{moyennes.epargnes.toFixed(0)}€</p>
            </div>
          </div>
        </div>
      )}

      {/* Pie Chart - Répartition */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative animate-fade-in-up stagger-6" style={cardStyle}>
        <button
          onClick={() => onExpandChart('pie-resume')}
          className="absolute top-3 right-3 p-1.5 rounded-lg transition-all hover:scale-110"
          style={{ background: `${theme.colors.primary}20` }}
        >
          <Maximize2 size={14} style={{ color: theme.colors.primary }} />
        </button>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
          Répartition des sorties
        </h3>
        {pieData.length > 0 ? (
          <div className="flex justify-center animate-chart">
            <div style={{ width: 200, height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(2)} €`}
                    contentStyle={tooltipStyle}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '10px' }}
                    formatter={(value) => <span style={textPrimary}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p className="text-center text-xs py-8" style={textSecondary}>
            Aucune donnée pour cette période
          </p>
        )}
      </div>

      {/* Bar Chart - Bilan */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border relative animate-fade-in-up stagger-7" style={cardStyle}>
        <button
          onClick={() => onExpandChart('bar-resume')}
          className="absolute top-3 right-3 p-1.5 rounded-lg transition-all hover:scale-110"
          style={{ background: `${theme.colors.primary}20` }}
        >
          <Maximize2 size={14} style={{ color: theme.colors.primary }} />
        </button>
        <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
          Bilan {periodLabel} {selectedYear}
        </h3>
        <div className="animate-chart" style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: theme.colors.textPrimary, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: theme.colors.textPrimary, fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(2)} €`}
                contentStyle={tooltipStyle}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                animationBegin={200}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 transactions */}
      {top5.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-8" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
            Top 5 sorties
          </h3>
          <div className="space-y-2">
            {top5.map((t, i) => {
              const color = t.type === 'Facture' 
                ? COLORS_TYPE.factures 
                : t.type === 'Épargne' 
                  ? COLORS_TYPE.epargnes 
                  : COLORS_TYPE.depenses;
              
              return (
                <div 
                  key={t.id} 
                  className="flex items-center justify-between p-2 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    background: i === 0 ? `${color}15` : 'transparent', 
                    borderBottom: i < 4 ? `1px solid ${theme.colors.cardBorder}30` : 'none',
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span 
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'animate-pulse' : ''}`}
                      style={{ background: `${color}20`, color }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={textPrimary}>{t.categorie}</p>
                      <p className="text-[9px]" style={textSecondary}>
                        {t.date ? new Date(t.date).toLocaleDateString('fr-FR') : '-'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color }}>
                    {parseFloat(t.montant || '0').toFixed(2)} €
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <SmartTips page="statistiques" />
    </div>
  );
}
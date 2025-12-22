'use client';

import { TrendingUp, Calendar, Target } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useMemo } from 'react';
import EmptyState from './EmptyState';

interface Transaction {
  id?: number;
  type: string;
  categorie: string;
  montant: string;
  date: string;
}

interface AnalyseTabProps {
  transactions: Transaction[];
  selectedYear: number;
  devise: string;
}

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export default function AnalyseTab({ transactions, selectedYear, devise }: AnalyseTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = useMemo(() => ({ 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  }), [theme.colors.cardBackground, theme.colors.cardBorder]);

  const evolutionAnnuelle = useMemo(() => {
    return monthsShort.map((mois, index) => {
      const monthKey = `${selectedYear}-${(index + 1).toString().padStart(2, '0')}`;
      const monthTransactions = transactions.filter(t => t.date?.startsWith(monthKey));
      
      const epargne = monthTransactions
        .filter(t => t.type === 'Épargnes')
        .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      
      const reprise = monthTransactions
        .filter(t => t.type === "Reprise d'épargne")
        .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
      
      return { mois, epargne, reprise, net: epargne - reprise };
    });
  }, [transactions, selectedYear]);

  const annualStats = useMemo(() => {
    const totalEpargne = evolutionAnnuelle.reduce((sum, m) => sum + m.epargne, 0);
    const totalReprise = evolutionAnnuelle.reduce((sum, m) => sum + m.reprise, 0);
    const net = totalEpargne - totalReprise;
    const moyenneMensuelle = net / 12;
    const meilleurMois = evolutionAnnuelle.reduce((best, m) => m.net > best.net ? m : best, evolutionAnnuelle[0]);
    const moisActifs = evolutionAnnuelle.filter(m => m.epargne > 0 || m.reprise > 0).length;
    
    return { totalEpargne, totalReprise, net, moyenneMensuelle, meilleurMois, moisActifs };
  }, [evolutionAnnuelle]);

  const maxValue = useMemo(() => 
    Math.max(...evolutionAnnuelle.map(m => Math.max(m.epargne, m.reprise)), 1),
    [evolutionAnnuelle]
  );

  if (annualStats.totalEpargne === 0 && annualStats.totalReprise === 0) {
    return <EmptyState message="Aucune donnée pour cette année" subMessage="Les analyses apparaîtront une fois que vous aurez des épargnes" />;
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Stats annuelles */}
      <div className="grid grid-cols-3 gap-3">
        <div 
          className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center"
          style={cardStyle}
        >
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{ background: 'rgba(34, 197, 94, 0.15)' }}
          >
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>Total {selectedYear}</p>
          <p className={`text-sm font-bold ${annualStats.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {annualStats.net >= 0 ? '+' : ''}{annualStats.net.toFixed(0)} {devise}
          </p>
        </div>
        
        <div 
          className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center"
          style={cardStyle}
        >
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{ background: `${theme.colors.primary}15` }}
          >
            <Calendar className="w-4 h-4" style={{ color: theme.colors.primary }} />
          </div>
          <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>Moyenne/mois</p>
          <p className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>
            {annualStats.moyenneMensuelle.toFixed(0)} {devise}
          </p>
        </div>
        
        <div 
          className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center"
          style={cardStyle}
        >
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{ background: 'rgba(245, 158, 11, 0.15)' }}
          >
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[10px]" style={{ color: theme.colors.textSecondary }}>Meilleur mois</p>
          <p className="text-sm font-bold text-amber-500">
            {annualStats.meilleurMois.mois}
          </p>
        </div>
      </div>

      {/* Graphique d'évolution */}
      <div 
        className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border"
        style={cardStyle}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: theme.colors.textPrimary }}>
          Évolution {selectedYear}
        </h3>
        
        <div className="space-y-3">
          {evolutionAnnuelle.map((month, index) => {
            const epargneWidth = (month.epargne / maxValue) * 100;
            const repriseWidth = (month.reprise / maxValue) * 100;
            
            return (
              <div 
                key={month.mois}
                className="animate-fadeIn"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium w-8" style={{ color: theme.colors.textSecondary }}>
                    {month.mois}
                  </span>
                  <span className={`text-xs font-bold ${month.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {month.net >= 0 ? '+' : ''}{month.net.toFixed(0)}
                  </span>
                </div>
                
                <div className="flex gap-1 h-4">
                  <div 
                    className="h-full rounded-l transition-all duration-500 ease-out"
                    style={{ 
                      width: `${epargneWidth}%`,
                      background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                      minWidth: month.epargne > 0 ? '4px' : '0'
                    }}
                  />
                  <div 
                    className="h-full rounded-r transition-all duration-500 ease-out"
                    style={{ 
                      width: `${repriseWidth}%`,
                      background: 'linear-gradient(90deg, #ef4444, #f87171)',
                      minWidth: month.reprise > 0 ? '4px' : '0'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Légende */}
        <div className="flex justify-center gap-6 mt-4 pt-3" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-[10px]" style={{ color: theme.colors.textSecondary }}>Épargné</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-[10px]" style={{ color: theme.colors.textSecondary }}>Repris</span>
          </div>
        </div>
      </div>

      {/* Résumé annuel */}
      <div 
        className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border"
        style={cardStyle}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: theme.colors.textPrimary }}>
          Bilan annuel
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 px-3 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
            <span className="text-xs" style={{ color: theme.colors.textSecondary }}>Total épargné</span>
            <span className="text-sm font-bold text-green-500">+{annualStats.totalEpargne.toFixed(2)} {devise}</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <span className="text-xs" style={{ color: theme.colors.textSecondary }}>Total repris</span>
            <span className="text-sm font-bold text-red-500">-{annualStats.totalReprise.toFixed(2)} {devise}</span>
          </div>
          <div 
            className="flex justify-between items-center py-2 px-3 rounded-xl"
            style={{ background: `${theme.colors.primary}10` }}
          >
            <span className="text-xs" style={{ color: theme.colors.textSecondary }}>Mois actifs</span>
            <span className="text-sm font-bold" style={{ color: theme.colors.primary }}>{annualStats.moisActifs}/12</span>
          </div>
        </div>
      </div>
    </div>
  );
}
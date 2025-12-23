'use client';

import { TrendingUp, Home as HomeIcon, Mail, PiggyBank, PieChart } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { SmartTips } from '@/components';
import {
  EmptyState,
  HealthGauge,
  EnrichedCard,
  PieChartCard,
  ResteAVivre,
  animationStyles,
  COLORS_TYPE
} from './index';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

interface EvolutionDataItem {
  name: string;
  revenus: number;
  factures: number;
  depenses: number;
  epargnes: number;
  solde: number;
  enveloppes: number;
}

interface PrevMonthData {
  prevRevenus: number;
  prevFactures: number;
  prevDepenses: number;
  prevEpargnes: number;
  prevSolde: number;
  prevBudgetApres: number;
  hasData: boolean;
}

interface TotalsData {
  totalRevenus: number;
  totalFactures: number;
  totalDepenses: number;
  totalEpargnes: number;
  solde: number;
  tauxEpargne: number;
  budgetApresDepenses: number;
  resteAVivre: number;
}

interface VariationsData {
  revenus: number;
  factures: number;
  depenses: number;
  epargnes: number;
  solde: number;
  enveloppes: number;
}

type VueAccordionType = 'revenus' | 'factures' | 'enveloppes' | 'epargne' | 'solde' | null;

interface VueTabProps {
  filteredTransactions: Transaction[];
  totals: TotalsData;
  prevMonthData: PrevMonthData;
  variations: VariationsData;
  evolution6Mois: EvolutionDataItem[];
  healthScore: number;
  selectedMonth: number;
  selectedYear: number;
  vueAccordion: VueAccordionType;
  onVueAccordionChange: (value: VueAccordionType) => void;
  onNavigateToTransactions: () => void;
}

// Helper pour grouper par catégorie
const groupByCategorie = (txList: Transaction[]) => {
  const groups: Record<string, { total: number; count: number }> = {};
  txList.forEach(t => {
    const cat = t.categorie || 'Autre';
    if (!groups[cat]) groups[cat] = { total: 0, count: 0 };
    groups[cat].total += parseFloat(t.montant || '0');
    groups[cat].count++;
  });
  return Object.entries(groups).sort((a, b) => b[1].total - a[1].total);
};

export default function VueTab({
  filteredTransactions,
  totals,
  prevMonthData,
  variations,
  evolution6Mois,
  healthScore,
  selectedMonth,
  selectedYear,
  vueAccordion,
  onVueAccordionChange,
  onNavigateToTransactions
}: VueTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  const { totalRevenus, totalFactures, totalDepenses, totalEpargnes, solde, tauxEpargne, budgetApresDepenses, resteAVivre } = totals;

  const hasData = filteredTransactions.length > 0;
  const hasSparklineData = evolution6Mois.some(d => d.revenus > 0 || d.factures > 0);

  // Filtrer les transactions par type
  const revenusTransactions = filteredTransactions.filter(t => t.type === 'Revenus');
  const facturesTransactions = filteredTransactions.filter(t => t.type === 'Factures');
  const depensesTransactions = filteredTransactions.filter(t => t.type === 'Dépenses');
  const epargnesTransactions = filteredTransactions.filter(t => t.type === 'Épargnes');

  // Contenu des accordéons
  const revenusAccordionContent = (
    <div className="space-y-2">
      {groupByCategorie(revenusTransactions).length === 0 ? (
        <p className="text-xs text-center py-2" style={textSecondary}>Aucun revenu ce mois</p>
      ) : (
        groupByCategorie(revenusTransactions).map(([cat, data], i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs" style={textPrimary}>{cat}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.textSecondary }}>×{data.count}</span>
            </div>
            <span className="text-xs font-medium text-green-400">+{data.total.toFixed(2)} €</span>
          </div>
        ))
      )}
    </div>
  );

  const facturesAccordionContent = (
    <div className="space-y-2">
      {groupByCategorie(facturesTransactions).length === 0 ? (
        <p className="text-xs text-center py-2" style={textSecondary}>Aucune facture ce mois</p>
      ) : (
        groupByCategorie(facturesTransactions).map(([cat, data], i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_TYPE.factures }} />
              <span className="text-xs" style={textPrimary}>{cat}</span>
            </div>
            <span className="text-xs font-medium" style={{ color: COLORS_TYPE.factures }}>-{data.total.toFixed(2)} €</span>
          </div>
        ))
      )}
    </div>
  );

  const enveloppesAccordionContent = (
    <div className="space-y-2">
      {groupByCategorie(depensesTransactions).length === 0 ? (
        <p className="text-xs text-center py-2" style={textSecondary}>Aucune dépense ce mois</p>
      ) : (
        groupByCategorie(depensesTransactions).map(([cat, data], i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_TYPE.depenses }} />
              <span className="text-xs" style={textPrimary}>{cat}</span>
            </div>
            <span className="text-xs font-medium" style={{ color: COLORS_TYPE.depenses }}>-{data.total.toFixed(2)} €</span>
          </div>
        ))
      )}
      {budgetApresDepenses > 0 && totalDepenses > 0 && (
        <div className="pt-2 mt-2" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
          <div className="flex justify-between items-center">
            <span className="text-[10px]" style={textSecondary}>Reste disponible</span>
            <span className="text-xs font-medium" style={{ color: resteAVivre >= 0 ? '#4CAF50' : '#F44336' }}>{resteAVivre.toFixed(2)} €</span>
          </div>
        </div>
      )}
    </div>
  );

  const epargneAccordionContent = (
    <div className="space-y-2">
      {groupByCategorie(epargnesTransactions).length === 0 ? (
        <p className="text-xs text-center py-2" style={textSecondary}>Aucune épargne ce mois</p>
      ) : (
        groupByCategorie(epargnesTransactions).map(([cat, data], i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS_TYPE.epargnes }} />
              <span className="text-xs" style={textPrimary}>{cat}</span>
            </div>
            <span className="text-xs font-medium" style={{ color: COLORS_TYPE.epargnes }}>{data.total.toFixed(2)} €</span>
          </div>
        ))
      )}
      {totalRevenus > 0 && (
        <div className="pt-2 mt-2" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
          <div className="flex justify-between items-center">
            <span className="text-[10px]" style={textSecondary}>Taux d&apos;épargne</span>
            <span className={`text-xs font-medium ${tauxEpargne >= 20 ? 'text-green-400' : tauxEpargne >= 10 ? 'text-orange-400' : 'text-red-400'}`}>
              {tauxEpargne.toFixed(1)}% {tauxEpargne >= 20 ? '✓' : '(obj: 20%)'}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const soldeAccordionContent = (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg text-center" style={{ background: `${theme.colors.primary}05` }}>
          <p className="text-[9px]" style={textSecondary}>Entrées</p>
          <p className="text-sm font-semibold text-green-400">+{totalRevenus.toFixed(0)} €</p>
        </div>
        <div className="p-2 rounded-lg text-center" style={{ background: `${theme.colors.primary}05` }}>
          <p className="text-[9px]" style={textSecondary}>Sorties</p>
          <p className="text-sm font-semibold text-red-400">-{(totalFactures + totalDepenses + totalEpargnes).toFixed(0)} €</p>
        </div>
      </div>
      {prevMonthData.hasData && (
        <div className="flex justify-between items-center p-2 rounded-lg" style={{ background: solde >= prevMonthData.prevSolde ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)' }}>
          <span className="text-[10px]" style={textSecondary}>vs mois dernier</span>
          <span className={`text-xs font-medium ${solde >= prevMonthData.prevSolde ? 'text-green-400' : 'text-red-400'}`}>
            {prevMonthData.prevSolde.toFixed(0)} € → {solde.toFixed(0)} €
          </span>
        </div>
      )}
    </div>
  );

  // Données pour le graphique camembert
  const pieData = [
    { name: 'Factures', value: totalFactures, color: COLORS_TYPE.factures },
    { name: 'Dépenses', value: totalDepenses, color: COLORS_TYPE.depenses },
    { name: 'Épargnes', value: totalEpargnes, color: COLORS_TYPE.epargnes },
  ].filter(d => d.value > 0);

  // État vide
  if (!hasData) {
    return (
      <div className="space-y-4">
        <style>{animationStyles}</style>
        <EmptyState 
          message="Commencez par ajouter vos revenus et dépenses du mois" 
          icon="💰" 
          title="Votre budget vous attend !" 
          onAddTransaction={onNavigateToTransactions}
        />
        <div className="grid grid-cols-2 gap-3 opacity-50">
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-pulse" style={cardStyle}>
            <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: `${theme.colors.cardBorder}50` }} />
            <div className="h-6 w-24 rounded" style={{ backgroundColor: `${theme.colors.cardBorder}30` }} />
          </div>
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-pulse" style={cardStyle}>
            <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: `${theme.colors.cardBorder}50` }} />
            <div className="h-6 w-24 rounded" style={{ backgroundColor: `${theme.colors.cardBorder}30` }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <style>{animationStyles}</style>
      
      <HealthGauge score={healthScore} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="animate-fade-in-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <EnrichedCard 
            title="Revenus prévus" 
            amount={totalRevenus} 
            subtitle={`Reçus: ${totalRevenus.toFixed(2)} €`} 
            icon={TrendingUp} 
            variation={variations.revenus} 
            sparklineKey="revenus" 
            sparklineColor={COLORS_TYPE.revenus} 
            sparklineData={evolution6Mois} 
            hasSparklineData={hasSparklineData} 
            isOpen={vueAccordion === 'revenus'} 
            onToggle={() => onVueAccordionChange(vueAccordion === 'revenus' ? null : 'revenus')} 
            accordionContent={revenusAccordionContent} 
            iconColor={COLORS_TYPE.revenus} 
            hasData={hasData} 
            hasPrevMonthData={prevMonthData.hasData} 
          />
        </div>
        <div className="animate-fade-in-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <EnrichedCard 
            title="Dépenses fixes" 
            amount={totalFactures} 
            subtitle={`Payées: ${totalFactures.toFixed(2)} €`} 
            icon={HomeIcon} 
            variation={variations.factures} 
            inverseVariation={true} 
            progressValue={totalFactures} 
            progressMax={totalRevenus} 
            progressColor={COLORS_TYPE.factures} 
            sparklineKey="factures" 
            sparklineColor={COLORS_TYPE.factures} 
            sparklineData={evolution6Mois} 
            hasSparklineData={hasSparklineData} 
            isOpen={vueAccordion === 'factures'} 
            onToggle={() => onVueAccordionChange(vueAccordion === 'factures' ? null : 'factures')} 
            accordionContent={facturesAccordionContent} 
            iconColor={COLORS_TYPE.factures} 
            hasData={hasData} 
            hasPrevMonthData={prevMonthData.hasData} 
          />
        </div>
        <div className="animate-fade-in-up stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <EnrichedCard 
            title="Enveloppes budgétaires" 
            amount={budgetApresDepenses} 
            subtitle={`Dépensé: ${totalDepenses.toFixed(2)} €`} 
            icon={Mail} 
            variation={variations.enveloppes} 
            progressValue={totalDepenses} 
            progressMax={budgetApresDepenses > 0 ? budgetApresDepenses : 1} 
            progressColor={COLORS_TYPE.depenses} 
            sparklineKey="enveloppes" 
            sparklineColor={COLORS_TYPE.depenses} 
            sparklineData={evolution6Mois} 
            hasSparklineData={hasSparklineData} 
            isOpen={vueAccordion === 'enveloppes'} 
            onToggle={() => onVueAccordionChange(vueAccordion === 'enveloppes' ? null : 'enveloppes')} 
            accordionContent={enveloppesAccordionContent} 
            iconColor={COLORS_TYPE.depenses} 
            hasData={hasData} 
            hasPrevMonthData={prevMonthData.hasData} 
          />
        </div>
        <div className="animate-fade-in-up stagger-4 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <EnrichedCard 
            title="Épargne CT prévu" 
            amount={totalEpargnes} 
            subtitle={`Versé: ${totalEpargnes.toFixed(2)} €`} 
            icon={PiggyBank} 
            variation={variations.epargnes} 
            progressValue={totalEpargnes} 
            progressMax={totalRevenus * 0.2} 
            progressColor={COLORS_TYPE.epargnes} 
            sparklineKey="epargnes" 
            sparklineColor={COLORS_TYPE.epargnes} 
            sparklineData={evolution6Mois} 
            hasSparklineData={hasSparklineData} 
            isOpen={vueAccordion === 'epargne'} 
            onToggle={() => onVueAccordionChange(vueAccordion === 'epargne' ? null : 'epargne')} 
            accordionContent={epargneAccordionContent} 
            iconColor={COLORS_TYPE.epargnes} 
            hasData={hasData} 
            hasPrevMonthData={prevMonthData.hasData} 
          />
        </div>
      </div>
      
      <div className="animate-fade-in-up stagger-5 opacity-0" style={{ animationFillMode: 'forwards' }}>
        <EnrichedCard 
          title="Solde réel" 
          amount={solde} 
          subtitle="Dépenses réelles" 
          icon={PieChart} 
          variation={variations.solde} 
          sparklineKey="solde" 
          sparklineColor={solde >= 0 ? '#4CAF50' : '#F44336'} 
          sparklineData={evolution6Mois} 
          hasSparklineData={hasSparklineData} 
          isOpen={vueAccordion === 'solde'} 
          onToggle={() => onVueAccordionChange(vueAccordion === 'solde' ? null : 'solde')} 
          accordionContent={soldeAccordionContent} 
          iconColor={solde >= 0 ? '#4CAF50' : '#F44336'} 
          hasData={hasData} 
          hasPrevMonthData={prevMonthData.hasData} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <PieChartCard 
          data={pieData} 
          total={totalFactures + totalDepenses + totalEpargnes} 
          className="animate-fade-in-up stagger-6 opacity-0" 
          style={{ animationFillMode: 'forwards' }} 
        />
        {totalRevenus > 0 && (
          <ResteAVivre 
            resteAVivre={resteAVivre} 
            selectedYear={selectedYear} 
            selectedMonth={selectedMonth} 
            className="animate-fade-in-up stagger-7 opacity-0" 
            style={{ animationFillMode: 'forwards' }} 
          />
        )}
      </div>

      <SmartTips page="budget" />
    </div>
  );
}
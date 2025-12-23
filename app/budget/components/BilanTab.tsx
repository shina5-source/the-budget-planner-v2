'use client';

import { TrendingUp, Home as HomeIcon, Mail, PiggyBank, FileText } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { SmartTips } from '@/components';
import {
  CircularProgress,
  AccordionSection,
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

interface TotalsData {
  totalRevenus: number;
  totalFactures: number;
  totalDepenses: number;
  totalEpargnes: number;
  solde: number;
  tauxEpargne: number;
}

type BilanAccordionType = 'revenus' | 'factures' | 'depenses' | 'epargnes' | null;

interface BilanTabProps {
  filteredTransactions: Transaction[];
  totals: TotalsData;
  periodeLabel: string;
  bilanAccordion: BilanAccordionType;
  onBilanAccordionChange: (value: BilanAccordionType) => void;
}

export default function BilanTab({
  filteredTransactions,
  totals,
  periodeLabel,
  bilanAccordion,
  onBilanAccordionChange
}: BilanTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  const { totalRevenus, totalFactures, totalDepenses, totalEpargnes, solde, tauxEpargne } = totals;

  // Filtrer les transactions par type
  const revenusTransactions = filteredTransactions.filter(t => t.type === 'Revenus');
  const facturesTransactions = filteredTransactions.filter(t => t.type === 'Factures');
  const depensesTransactions = filteredTransactions.filter(t => t.type === 'Dépenses');
  const epargnesTransactions = filteredTransactions.filter(t => t.type === 'Épargnes');

  return (
    <div className="space-y-3">
      <style>{animationStyles}</style>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center border" 
          style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}
        >
          <FileText className="w-5 h-5" style={textPrimary} />
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={textPrimary}>Bilan mensuel</h3>
          <p className="text-[10px]" style={textSecondary}>{periodeLabel}</p>
        </div>
      </div>
      
      {/* Accordéons par type */}
      <div className="animate-fade-in-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
        <AccordionSection 
          title="Revenus mensuels" 
          icon={TrendingUp} 
          transactions={revenusTransactions} 
          total={totalRevenus} 
          isExpense={false} 
          isOpen={bilanAccordion === 'revenus'} 
          onToggle={() => onBilanAccordionChange(bilanAccordion === 'revenus' ? null : 'revenus')} 
          color="#4CAF50" 
        />
      </div>
      
      <div className="animate-fade-in-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
        <AccordionSection 
          title="Dépenses fixes" 
          icon={HomeIcon} 
          transactions={facturesTransactions} 
          total={totalFactures} 
          isExpense={true} 
          isOpen={bilanAccordion === 'factures'} 
          onToggle={() => onBilanAccordionChange(bilanAccordion === 'factures' ? null : 'factures')} 
          color={COLORS_TYPE.factures} 
        />
      </div>
      
      <div className="animate-fade-in-up stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
        <AccordionSection 
          title="Dépenses variables" 
          icon={Mail} 
          transactions={depensesTransactions} 
          total={totalDepenses} 
          isExpense={true} 
          isOpen={bilanAccordion === 'depenses'} 
          onToggle={() => onBilanAccordionChange(bilanAccordion === 'depenses' ? null : 'depenses')} 
          color={COLORS_TYPE.depenses} 
        />
      </div>
      
      <div className="animate-fade-in-up stagger-4 opacity-0" style={{ animationFillMode: 'forwards' }}>
        <AccordionSection 
          title="Épargnes" 
          icon={PiggyBank} 
          transactions={epargnesTransactions} 
          total={totalEpargnes} 
          isExpense={true} 
          isOpen={bilanAccordion === 'epargnes'} 
          onToggle={() => onBilanAccordionChange(bilanAccordion === 'epargnes' ? null : 'epargnes')} 
          color={COLORS_TYPE.epargnes} 
        />
      </div>
      
      {/* Résumé du solde */}
      <div 
        className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center animate-fade-in-up stagger-5 opacity-0" 
        style={{ ...cardStyle, animationFillMode: 'forwards' }}
      >
        <p className="text-xs mb-1" style={textSecondary}>Solde du mois</p>
        <p className={`text-3xl font-bold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {solde >= 0 ? '+' : ''}{solde.toFixed(2)} €
        </p>
        
        <div className="mt-4">
          <CircularProgress 
            value={tauxEpargne} 
            max={20} 
            color={tauxEpargne >= 20 ? '#4CAF50' : tauxEpargne >= 10 ? '#FF9800' : '#F44336'} 
            size={80} 
            label="Épargne" 
          />
        </div>
        
        {solde > 0 ? (
          <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 inline-block">
            ✨ Excellent ! Solde positif
          </p>
        ) : solde < 0 ? (
          <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 inline-block">
            ⚠️ Attention ! Solde négatif
          </p>
        ) : (
          <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 inline-block">
            ➖ Solde à l&apos;équilibre
          </p>
        )}
      </div>
      
      <SmartTips page="budget" />
    </div>
  );
}
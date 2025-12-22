'use client';

import { ChevronDown, ChevronUp, Building, Tag } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useMemo, useState } from 'react';
import StatsCards from './StatsCards';
import EmptyState from './EmptyState';

interface Transaction {
  id?: number;
  type: string;
  categorie: string;
  montant: string;
  date: string;
  compte?: string;
  compteVers?: string;
}

interface ResumeTabProps {
  transactions: Transaction[];
  selectedYear: number;
  selectedMonth: number;
  devise: string;
  onAddClick?: () => void;
}

export default function ResumeTab({ transactions, selectedYear, selectedMonth, devise, onAddClick }: ResumeTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [accordionState, setAccordionState] = useState({ comptes: true, categories: false });

  const cardStyle = useMemo(() => ({ 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  }), [theme.colors.cardBackground, theme.colors.cardBorder]);

  const getMonthKey = () => `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
  
  const filteredTransactions = useMemo(() => 
    transactions.filter(t => t.date?.startsWith(getMonthKey())),
    [transactions, selectedYear, selectedMonth]
  );

  const stats = useMemo(() => {
    const totalEpargnesMois = filteredTransactions
      .filter(t => t.type === 'Épargnes')
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    const totalReprisesMois = filteredTransactions
      .filter(t => t.type === "Reprise d'épargne")
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    const netEpargneMois = totalEpargnesMois - totalReprisesMois;
    
    const totalRevenus = filteredTransactions
      .filter(t => t.type === 'Revenus')
      .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    
    const tauxEpargne = totalRevenus > 0 ? (netEpargneMois / totalRevenus) * 100 : 0;

    return { totalEpargnesMois, totalReprisesMois, netEpargneMois, tauxEpargne };
  }, [filteredTransactions]);

  const epargnesParCompte = useMemo(() => {
    const result: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === 'Épargnes')
      .forEach(t => {
        const compte = t.compteVers || t.compte || 'Non défini';
        result[compte] = (result[compte] || 0) + parseFloat(t.montant || '0');
      });
    return result;
  }, [filteredTransactions]);

  const epargnesParCategorie = useMemo(() => {
    const result: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === 'Épargnes')
      .forEach(t => {
        const cat = t.categorie || 'Non catégorisé';
        result[cat] = (result[cat] || 0) + parseFloat(t.montant || '0');
      });
    return result;
  }, [filteredTransactions]);

  const toggleAccordion = (key: 'comptes' | 'categories') => {
    setAccordionState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (filteredTransactions.filter(t => t.type === 'Épargnes' || t.type === "Reprise d'épargne").length === 0) {
    return <EmptyState onAddClick={onAddClick} />;
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <StatsCards 
        totalEpargnesMois={stats.totalEpargnesMois}
        totalReprisesMois={stats.totalReprisesMois}
        netEpargneMois={stats.netEpargneMois}
        tauxEpargne={stats.tauxEpargne}
        devise={devise}
      />

      {/* Accordéon Par Compte */}
      <div 
        className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden animate-fadeIn"
        style={{ ...cardStyle, animationDelay: '0.3s' }}
      >
        <button
          onClick={() => toggleAccordion('comptes')}
          className="w-full p-4 flex items-center justify-between transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `${theme.colors.primary}15` }}
            >
              <Building className="w-4 h-4" style={{ color: theme.colors.primary }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
              Par compte
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}
            >
              {Object.keys(epargnesParCompte).length}
            </span>
          </div>
          {accordionState.comptes 
            ? <ChevronUp className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
            : <ChevronDown className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
          }
        </button>
        
        {accordionState.comptes && (
          <div className="px-4 pb-4 space-y-2">
            {Object.entries(epargnesParCompte).map(([compte, montant], index) => (
              <div 
                key={compte}
                className="flex justify-between items-center py-2 px-3 rounded-xl transition-all duration-200 hover:scale-[1.01]"
                style={{ background: `${theme.colors.primary}08` }}
              >
                <span className="text-xs font-medium" style={{ color: theme.colors.textPrimary }}>
                  {compte}
                </span>
                <span className="text-xs font-bold text-green-500">
                  +{montant.toFixed(2)} {devise}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accordéon Par Catégorie */}
      <div 
        className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden animate-fadeIn"
        style={{ ...cardStyle, animationDelay: '0.4s' }}
      >
        <button
          onClick={() => toggleAccordion('categories')}
          className="w-full p-4 flex items-center justify-between transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `${theme.colors.primary}15` }}
            >
              <Tag className="w-4 h-4" style={{ color: theme.colors.primary }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
              Par catégorie
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}
            >
              {Object.keys(epargnesParCategorie).length}
            </span>
          </div>
          {accordionState.categories 
            ? <ChevronUp className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
            : <ChevronDown className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
          }
        </button>
        
        {accordionState.categories && (
          <div className="px-4 pb-4 space-y-2">
            {Object.entries(epargnesParCategorie).map(([cat, montant], index) => (
              <div 
                key={cat}
                className="flex justify-between items-center py-2 px-3 rounded-xl transition-all duration-200 hover:scale-[1.01]"
                style={{ background: `${theme.colors.primary}08` }}
              >
                <span className="text-xs font-medium" style={{ color: theme.colors.textPrimary }}>
                  {cat}
                </span>
                <span className="text-xs font-bold text-green-500">
                  +{montant.toFixed(2)} {devise}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
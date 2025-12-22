'use client';

import { Star, Lock, Unlock, Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { Enveloppe, HistoriqueItem, Transaction } from './types';
import { getCouleur, getIcone, getAlertLevel } from './constants';
import EnveloppeDetails from './EnveloppeDetails';

interface EnveloppeCardProps {
  enveloppe: Enveloppe;
  budgetEffectif: number;
  depense: number;
  reste: number;
  pourcentage: number;
  reportMoisPrec: number;
  moyenne3Mois: number;
  projection: number;
  historique: HistoriqueItem[];
  transactionsLiees: Transaction[];
  devise: string;
  isExpanded: boolean;
  showTransactions: boolean;
  onToggleExpand: () => void;
  onToggleTransactions: () => void;
  onToggleFavorite: () => void;
  onToggleLocked: () => void;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
  viewMode: 'normal' | 'compact';
}

export default function EnveloppeCard({
  enveloppe,
  budgetEffectif,
  depense,
  reste,
  pourcentage,
  reportMoisPrec,
  moyenne3Mois,
  projection,
  historique,
  transactionsLiees,
  devise,
  isExpanded,
  showTransactions,
  onToggleExpand,
  onToggleTransactions,
  onToggleFavorite,
  onToggleLocked,
  onEdit,
  onDelete,
  index,
  viewMode
}: EnveloppeCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const couleur = getCouleur(enveloppe.couleur);
  const icone = getIcone(enveloppe.icone);
  const IconComponent = icone.icon;
  const alert = getAlertLevel(pourcentage);
  const AlertIcon = alert.icon;

  // Mode compact
  if (viewMode === 'compact') {
    return (
      <div 
        className={`${couleur.bg} rounded-xl p-3 border ${couleur.border} flex items-center justify-between animate-fade-in-up stagger-${Math.min(index + 1, 8)} transition-all duration-200 hover:scale-[1.01]`}
      >
        <div className="flex items-center gap-2">
          {enveloppe.favorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
          {enveloppe.locked && <Lock className="w-3 h-3 text-gray-500" />}
          <IconComponent className={`w-4 h-4 ${couleur.text}`} />
          <span className={`text-sm font-medium ${couleur.text}`}>{enveloppe.nom}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${reste >= 0 ? couleur.text : 'text-red-600'}`}>
            {reste.toFixed(0)}{devise}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${alert.bg} text-white`}>
            {Math.round(pourcentage)}%
          </span>
        </div>
      </div>
    );
  }

  // Mode normal
  return (
    <div 
      className={`${couleur.bg} rounded-2xl shadow-sm border ${couleur.border} overflow-hidden animate-fade-in-up stagger-${Math.min(index + 1, 8)} transition-all duration-200`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/30 border ${couleur.border}`}>
              <IconComponent className={`w-5 h-5 ${couleur.text}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {enveloppe.favorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                {enveloppe.locked && <Lock className="w-3 h-3 text-gray-500" />}
                <p className={`text-sm font-semibold ${couleur.text}`}>{enveloppe.nom}</p>
              </div>
              <p className={`text-[10px] ${couleur.text} opacity-70`}>
                {enveloppe.categories.length} catégorie(s)
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            <button 
              onClick={onToggleFavorite} 
              className="p-1.5 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-110"
            >
              <Star className={`w-4 h-4 ${enveloppe.favorite ? 'text-yellow-500 fill-yellow-500' : couleur.text}`} />
            </button>
            <button 
              onClick={onToggleLocked} 
              className="p-1.5 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-110"
            >
              {enveloppe.locked 
                ? <Lock className={`w-4 h-4 ${couleur.text}`} /> 
                : <Unlock className={`w-4 h-4 ${couleur.text}`} />
              }
            </button>
            <button 
              onClick={onEdit} 
              className="p-1.5 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-110"
            >
              <Edit3 className={`w-4 h-4 ${couleur.text}`} />
            </button>
            <button 
              onClick={onDelete} 
              className="p-1.5 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-110"
            >
              <Trash2 className={`w-4 h-4 ${couleur.text}`} />
            </button>
          </div>
        </div>

        {/* Alert */}
        {pourcentage >= 50 && (
          <div className="flex items-center gap-2 mb-3 px-2 py-1 rounded-lg bg-white/30">
            <AlertIcon className={`w-4 h-4 ${alert.color}`} />
            <span className={`text-[10px] font-medium ${alert.color}`}>
              {pourcentage >= 100 
                ? 'Budget dépassé !' 
                : pourcentage >= 80 
                  ? 'Attention, bientôt à court !' 
                  : '50% du budget utilisé'
              }
            </span>
          </div>
        )}

        {/* Progress bar */}
        <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-2">
          <div 
            className={`h-full transition-all duration-500 ${
              pourcentage >= 100 
                ? 'bg-red-500' 
                : pourcentage >= 80 
                  ? 'bg-orange-400' 
                  : couleur.progress
            }`} 
            style={{ width: `${Math.min(pourcentage, 100)}%` }} 
          />
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-4">
            <div>
              <p className={`text-[10px] ${couleur.text} opacity-60`}>Budget</p>
              <p className={`text-xs font-medium ${couleur.text}`}>
                {budgetEffectif.toFixed(0)}{devise}
                {reportMoisPrec > 0 && (
                  <span className="text-[9px] opacity-70"> (+{reportMoisPrec.toFixed(0)})</span>
                )}
              </p>
            </div>
            <div>
              <p className={`text-[10px] ${couleur.text} opacity-60`}>Dépensé</p>
              <p className={`text-xs font-medium ${couleur.text}`}>{depense.toFixed(0)}{devise}</p>
            </div>
            <div>
              <p className={`text-[10px] ${couleur.text} opacity-60`}>Reste</p>
              <p className={`text-xs font-medium ${reste >= 0 ? couleur.text : 'text-red-600'}`}>
                {reste.toFixed(0)}{devise}
              </p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-[10px] font-medium ${
            pourcentage >= 100 
              ? 'bg-red-500 text-white' 
              : pourcentage >= 80 
                ? 'bg-orange-400 text-white' 
                : 'bg-white/50 ' + couleur.text
          }`}>
            {Math.round(pourcentage)}%
          </div>
        </div>

        {/* Toggle expand */}
        <button 
          onClick={onToggleExpand} 
          className={`w-full flex items-center justify-center gap-1 py-1 rounded-lg bg-white/20 ${couleur.text} transition-all duration-200 hover:bg-white/30`}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span className="text-[10px]">{isExpanded ? 'Moins' : 'Plus de détails'}</span>
        </button>
      </div>

      {/* Details panel */}
      {isExpanded && (
        <EnveloppeDetails
          enveloppe={enveloppe}
          budgetEffectif={budgetEffectif}
          moyenne3Mois={moyenne3Mois}
          projection={projection}
          historique={historique}
          transactionsLiees={transactionsLiees}
          devise={devise}
          showTransactions={showTransactions}
          onToggleTransactions={onToggleTransactions}
          couleur={couleur}
        />
      )}
    </div>
  );
}
"use client";

import { useState } from 'react';
import { Clock, CheckCircle, ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface Credit {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  depuis?: string;
  vers?: string;
  memo?: string;
  isCredit?: boolean;
  capitalTotal?: string;
  tauxInteret?: string;
  dureeMois?: string;
  dateDebut?: string;
}

interface CreditStats {
  totalRembourse: number;
  resteADu: number;
  progression: number;
  moisEcoules: number;
  moisRestants: number;
  totalADu: number;
  interetsTotal: number;
  dateFin: Date | null;
  estTermine: boolean;
}

interface CreditItemProps {
  credit: Credit;
  stats: CreditStats;
  devise: string;
  index: number;
  onEdit: (credit: Credit) => void;
  onDelete: (id: number) => void;
}

export default function CreditItem({ 
  credit, 
  stats, 
  devise, 
  index,
  onEdit,
  onDelete
}: CreditItemProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [isExpanded, setIsExpanded] = useState(false);

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: stats.estTermine ? 'rgba(34, 197, 94, 0.5)' : theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const getProgressColor = (percent: number) => {
    if (percent >= 75) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    if (percent >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressBadgeColor = (percent: number) => {
    if (percent >= 75) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    if (percent >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  const mensualite = parseFloat(credit.montant || '0');

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden animate-fadeIn group"
      style={{ ...cardStyle, animationDelay: `${450 + index * 100}ms` }}
    >
      {/* Header - Cliquable */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 transition-colors cursor-pointer hover:bg-white/5"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {stats.estTermine ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <Clock className="w-5 h-5 flex-shrink-0" style={textPrimary} />
            )}
            <span className="text-sm font-semibold truncate" style={textPrimary}>
              {credit.categorie}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${getProgressBadgeColor(stats.progression)}`}>
              {Math.round(stats.progression)}%
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" style={textPrimary} />
            ) : (
              <ChevronDown className="w-5 h-5" style={textPrimary} />
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div 
          className="h-2 rounded-full overflow-hidden border mb-2"
          style={{ 
            background: theme.colors.cardBackgroundLight, 
            borderColor: theme.colors.cardBorder 
          }}
        >
          <div 
            className={`h-full ${getProgressColor(stats.progression)} transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min(stats.progression, 100)}%` }}
          />
        </div>

        {/* Info rapide */}
        <div className="flex justify-between items-center">
          <span className="text-[10px]" style={textSecondary}>
            💳 {mensualite.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}/mois
          </span>
          <span className="text-[10px]" style={textSecondary}>
            Reste: <span className={stats.estTermine ? 'text-green-400' : 'text-orange-400'}>
              {stats.resteADu.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
            </span>
          </span>
        </div>
      </div>

      {/* Détails - Expandable */}
      {isExpanded && (
        <div 
          className="p-4 animate-slideDown"
          style={{ 
            borderTopWidth: 1, 
            borderColor: theme.colors.cardBorder, 
            background: theme.colors.cardBackgroundLight 
          }}
        >
          {/* Boutons Action */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(credit); }}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                background: `${theme.colors.primary}20`,
                color: theme.colors.primary
              }}
            >
              <Edit3 className="w-4 h-4" />
              Modifier
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(credit.id); }}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 bg-red-500/20 text-red-400 transition-all duration-200 hover:bg-red-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>

          {/* Infos détaillées */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Capital', value: `${parseFloat(credit.capitalTotal || '0').toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${devise}` },
              { label: 'Intérêts', value: `${stats.interetsTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${devise}` },
              { label: 'Durée', value: `${credit.dureeMois || '-'} mois` },
              { label: 'Taux', value: `${credit.tauxInteret || '0'}%` },
              { label: 'Coût total', value: `${stats.totalADu.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${devise}` },
              { label: 'Fin prévue', value: formatDate(stats.dateFin) },
            ].map((item, i) => (
              <div 
                key={i} 
                className="p-2 rounded-lg"
                style={{ background: theme.colors.cardBackground }}
              >
                <p className="text-[10px]" style={textSecondary}>{item.label}</p>
                <p className="text-xs font-medium" style={textPrimary}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Résumé remboursement */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-center border border-green-500/20">
              <p className="text-[10px]" style={textSecondary}>Remboursé</p>
              <p className="text-xs font-semibold text-green-400">
                {stats.totalRembourse.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {devise}
              </p>
            </div>
            <div className={`p-2 rounded-lg text-center border ${stats.estTermine ? 'bg-green-500/10 border-green-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
              <p className="text-[10px]" style={textSecondary}>Reste dû</p>
              <p className={`text-xs font-semibold ${stats.estTermine ? 'text-green-400' : 'text-orange-400'}`}>
                {stats.resteADu.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {devise}
              </p>
            </div>
            <div 
              className="p-2 rounded-lg text-center border"
              style={{ background: `${theme.colors.primary}10`, borderColor: theme.colors.cardBorder }}
            >
              <p className="text-[10px]" style={textSecondary}>Mois restants</p>
              <p 
                className={`text-xs font-semibold ${stats.moisRestants <= 3 ? 'text-green-400' : ''}`}
                style={stats.moisRestants > 3 ? textPrimary : {}}
              >
                {stats.moisRestants}
              </p>
            </div>
          </div>

          {/* Messages spéciaux */}
          {stats.estTermine && (
            <div className="mt-3 p-2 bg-green-500/20 rounded-lg text-center border border-green-500/30">
              <p className="text-xs text-green-400 font-medium">🎉 Crédit remboursé !</p>
            </div>
          )}
          
          {!stats.estTermine && stats.moisRestants <= 3 && stats.moisRestants > 0 && (
            <div 
              className="mt-3 p-2 rounded-lg text-center border"
              style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}
            >
              <p className="text-xs font-medium" style={textPrimary}>
                🏁 Plus que {stats.moisRestants} mois !
              </p>
            </div>
          )}

          {/* Memo */}
          {credit.memo && (
            <div 
              className="mt-3 p-2 rounded-lg"
              style={{ background: theme.colors.cardBackground }}
            >
              <p className="text-[10px] italic" style={textSecondary}>
                📝 {credit.memo}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
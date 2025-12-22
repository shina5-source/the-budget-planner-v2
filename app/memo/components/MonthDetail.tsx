'use client';

import { Plus, FileText, ChevronDown, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import MemoCard from './MemoCard';

interface MemoItem {
  id: number;
  description: string;
  montant: string;
  checked: boolean;
}

interface MonthDetailProps {
  monthLabel: string;
  monthNum: string;
  items: MemoItem[];
  total: number;
  onAddClick: () => void;
  onToggleCheck: (itemId: number) => void;
  onEdit: (item: MemoItem) => void;
  onDelete: (itemId: number) => void;
  devise: string;
  displayCount: number;
  onLoadMore: () => void;
}

export default function MonthDetail({
  monthLabel,
  items,
  total,
  onAddClick,
  onToggleCheck,
  onEdit,
  onDelete,
  devise,
  displayCount,
  onLoadMore
}: MonthDetailProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const checkedCount = items.filter(i => i.checked).length;
  const displayedItems = items.slice(0, displayCount);
  const hasMore = displayCount < items.length;
  const remainingCount = items.length - displayCount;
  const allChecked = items.length > 0 && checkedCount === items.length;

  return (
    <div 
      className="rounded-2xl border shadow-sm overflow-hidden"
      style={{ 
        background: theme.colors.cardBackground, 
        borderColor: allChecked ? 'rgba(34, 197, 94, 0.3)' : theme.colors.cardBorder 
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center justify-between"
        style={{ 
          background: allChecked 
            ? 'rgba(34, 197, 94, 0.1)' 
            : theme.colors.cardBackgroundLight,
          borderBottomWidth: 1,
          borderColor: theme.colors.cardBorder
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ 
              background: allChecked 
                ? 'rgba(34, 197, 94, 0.2)' 
                : `${theme.colors.primary}15` 
            }}
          >
            {allChecked ? (
              <Sparkles className="w-5 h-5" style={{ color: '#22c55e' }} />
            ) : (
              <FileText className="w-5 h-5" style={{ color: theme.colors.primary }} />
            )}
          </div>
          <div>
            <h3 
              className="text-base font-bold"
              style={{ color: allChecked ? '#22c55e' : theme.colors.textPrimary }}
            >
              {allChecked && '✨ '}{monthLabel}
            </h3>
            <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
              {items.length} mémo{items.length > 1 ? 's' : ''} • {checkedCount} complété{checkedCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Total</p>
            <p 
              className="text-sm font-bold"
              style={{ color: theme.colors.primary }}
            >
              {total.toFixed(2)} {devise}
            </p>
          </div>
          
          <button
            onClick={onAddClick}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ background: theme.colors.primary }}
          >
            <Plus className="w-5 h-5" style={{ color: theme.colors.textOnPrimary }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {items.length === 0 ? (
          /* Empty State */
          <div className="py-12 flex flex-col items-center justify-center">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 relative"
              style={{ background: `${theme.colors.primary}10` }}
            >
              <FileText className="w-10 h-10" style={{ color: theme.colors.primary }} />
              {/* Décoration */}
              <div 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: theme.colors.primary }}
              >
                <Plus className="w-4 h-4" style={{ color: theme.colors.textOnPrimary }} />
              </div>
            </div>
            
            <p 
              className="text-base font-semibold mb-1"
              style={{ color: theme.colors.textPrimary }}
            >
              Aucun mémo pour {monthLabel}
            </p>
            
            <p 
              className="text-sm mb-5 text-center max-w-[250px]"
              style={{ color: theme.colors.textSecondary }}
            >
              Ajoutez vos rappels, dépenses prévues et événements importants
            </p>

            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              style={{ 
                background: theme.colors.primary, 
                color: theme.colors.textOnPrimary,
                boxShadow: `0 4px 15px ${theme.colors.primary}40`
              }}
            >
              <Plus className="w-4 h-4" />
              Ajouter un mémo
            </button>
          </div>
        ) : (
          /* Items List */
          <div className="space-y-3">
            {displayedItems.map((item, index) => (
              <MemoCard
                key={item.id}
                item={item}
                onToggleCheck={() => onToggleCheck(item.id)}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item.id)}
                devise={devise}
                index={index}
              />
            ))}

            {/* Load more */}
            {hasMore && (
              <button 
                onClick={onLoadMore}
                className="w-full py-3 mt-2 border-2 border-dashed rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
              >
                <ChevronDown className="w-4 h-4" />
                Voir plus ({remainingCount} restant{remainingCount > 1 ? 's' : ''})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer avec résumé */}
      {items.length > 0 && (
        <div 
          className="px-4 py-3 flex items-center justify-between"
          style={{ 
            background: theme.colors.cardBackgroundLight,
            borderTopWidth: 1,
            borderColor: theme.colors.cardBorder
          }}
        >
          <div className="flex items-center gap-4">
            {/* Mini progress bar */}
            <div className="flex items-center gap-2">
              <div 
                className="w-24 h-2 rounded-full overflow-hidden"
                style={{ background: `${theme.colors.primary}20` }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${items.length > 0 ? (checkedCount / items.length) * 100 : 0}%`,
                    background: allChecked ? '#22c55e' : theme.colors.primary
                  }}
                />
              </div>
              <span 
                className="text-xs font-medium"
                style={{ color: allChecked ? '#22c55e' : theme.colors.textSecondary }}
              >
                {Math.round((checkedCount / items.length) * 100)}%
              </span>
            </div>
          </div>

          <div 
            className="px-3 py-1.5 rounded-lg"
            style={{ 
              background: allChecked ? 'rgba(34, 197, 94, 0.15)' : `${theme.colors.primary}15`
            }}
          >
            <span 
              className="text-sm font-bold"
              style={{ color: allChecked ? '#22c55e' : theme.colors.primary }}
            >
              {total.toFixed(2)} {devise}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
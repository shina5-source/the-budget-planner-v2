'use client';

import { Plus, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import MemoItem from './MemoItem';

interface MemoItemData {
  id: number;
  description: string;
  montant: string;
  checked: boolean;
}

interface MonthAccordionProps {
  monthLabel: string;
  items: MemoItemData[];
  total: number;
  isExpanded: boolean;
  onToggle: () => void;
  onAddClick: () => void;
  onToggleCheck: (itemId: number) => void;
  onEdit: (item: MemoItemData) => void;
  onDelete: (itemId: number) => void;
  devise: string;
  displayCount: number;
  onLoadMore: () => void;
}

export default function MonthAccordion({
  monthLabel,
  items,
  total,
  isExpanded,
  onToggle,
  onAddClick,
  onToggleCheck,
  onEdit,
  onDelete,
  devise,
  displayCount,
  onLoadMore
}: MonthAccordionProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };

  const checkedCount = items.filter(i => i.checked).length;
  const displayedItems = items.slice(0, displayCount);
  const hasMore = displayCount < items.length;
  const remainingCount = items.length - displayCount;
  const allChecked = items.length > 0 && checkedCount === items.length;

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden transition-all duration-300"
      style={{ 
        ...cardStyle,
        borderColor: allChecked ? '#22c55e50' : theme.colors.cardBorder
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer transition-all duration-200 hover:opacity-80"
        style={{ 
          background: theme.colors.cardBackgroundLight, 
          borderBottomWidth: isExpanded ? 1 : 0, 
          borderColor: theme.colors.cardBorder 
        }} 
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span 
            className="text-sm font-semibold" 
            style={{ color: allChecked ? '#22c55e' : theme.colors.textPrimary }}
          >
            {allChecked && '✓ '}{monthLabel}
          </span>
          <span 
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ 
              background: items.length > 0 ? `${theme.colors.primary}20` : 'transparent',
              color: theme.colors.textSecondary 
            }}
          >
            {items.length} élément{items.length > 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span 
            className="text-xs font-semibold" 
            style={{ color: theme.colors.textPrimary }}
          >
            {total.toFixed(2)} {devise}
          </span>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onAddClick(); }} 
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border"
            style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}
          >
            <Plus className="w-4 h-4" style={{ color: theme.colors.primary }} />
          </button>
          
          {isExpanded 
            ? <ChevronUp className="w-4 h-4" style={{ color: theme.colors.textPrimary }} /> 
            : <ChevronDown className="w-4 h-4" style={{ color: theme.colors.textPrimary }} />
          }
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-3">
          {items.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: `${theme.colors.primary}15` }}
              >
                <FileText className="w-8 h-8" style={{ color: theme.colors.primary }} />
              </div>
              
              <p 
                className="text-sm font-medium mb-1"
                style={{ color: theme.colors.textPrimary }}
              >
                Aucun mémo pour {monthLabel}
              </p>
              
              <p 
                className="text-xs mb-4 text-center max-w-[200px]"
                style={{ color: theme.colors.textSecondary }}
              >
                Ajoutez vos rappels et dépenses prévues
              </p>

              <button
                onClick={onAddClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ 
                  background: theme.colors.primary, 
                  color: theme.colors.textOnPrimary 
                }}
              >
                <Plus className="w-4 h-4" />
                Ajouter un mémo
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Header tableau */}
              <div 
                className="flex items-center px-3 pb-2 text-[10px] font-medium"
                style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder, color: theme.colors.textSecondary }}
              >
                <div className="w-5"></div>
                <div className="flex-1 px-3">Description</div>
                <div className="w-20 text-right">Montant</div>
                <div className="w-16"></div>
              </div>

              {/* Items */}
              {displayedItems.map((item) => (
                <MemoItem
                  key={item.id}
                  item={item}
                  onToggleCheck={() => onToggleCheck(item.id)}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item.id)}
                  devise={devise}
                />
              ))}

              {/* Load more */}
              {hasMore && (
                <button 
                  onClick={onLoadMore} 
                  className="w-full py-3 mt-2 border-2 border-dashed rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
                >
                  Voir plus ({remainingCount} restant{remainingCount > 1 ? 's' : ''})
                </button>
              )}

              {/* Footer */}
              <div 
                className="pt-3 mt-2 flex justify-between items-center"
                style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}
              >
                <span className="text-[10px]" style={{ color: theme.colors.textSecondary }}>
                  {checkedCount}/{items.length} complété{checkedCount > 1 ? 's' : ''}
                </span>
                <span 
                  className="text-xs font-bold px-2 py-1 rounded-lg"
                  style={{ 
                    background: allChecked ? 'rgba(34, 197, 94, 0.1)' : `${theme.colors.primary}10`,
                    color: allChecked ? '#22c55e' : theme.colors.textPrimary 
                  }}
                >
                  Total: {total.toFixed(2)} {devise}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
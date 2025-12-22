'use client';

import { Check, Pencil, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface MemoItemData {
  id: number;
  description: string;
  montant: string;
  checked: boolean;
}

interface MemoItemProps {
  item: MemoItemData;
  onToggleCheck: () => void;
  onEdit: () => void;
  onDelete: () => void;
  devise: string;
}

export default function MemoItem({ 
  item, 
  onToggleCheck, 
  onEdit, 
  onDelete,
  devise
}: MemoItemProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <div 
      className="flex items-center rounded-xl px-3 py-2.5 border transition-all duration-200 hover:scale-[1.01]"
      style={{ 
        background: theme.colors.cardBackgroundLight, 
        borderColor: item.checked ? '#22c55e50' : theme.colors.cardBorder
      }}
    >
      {/* Checkbox */}
      <button 
        onClick={onToggleCheck} 
        className="w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110"
        style={item.checked 
          ? { background: '#22c55e', borderColor: '#22c55e' } 
          : { borderColor: theme.colors.cardBorder, background: 'transparent' }
        }
      >
        {item.checked && <Check className="w-3 h-3 text-white" />}
      </button>

      {/* Description */}
      <div 
        className={`flex-1 px-3 text-sm ${item.checked ? 'line-through opacity-50' : ''}`} 
        style={{ color: theme.colors.textPrimary }}
      >
        {item.description}
      </div>

      {/* Montant */}
      <div 
        className={`w-20 text-right text-sm font-semibold ${item.checked ? 'opacity-50' : ''}`} 
        style={{ color: item.checked ? '#22c55e' : theme.colors.textPrimary }}
      >
        {item.montant} {devise}
      </div>

      {/* Actions */}
      <div className="w-16 flex items-center justify-end gap-1 ml-2">
        <button 
          onClick={onEdit} 
          className="p-1.5 rounded-lg border transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}
        >
          <Pencil className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
        </button>
        <button 
          onClick={onDelete} 
          className="p-1.5 rounded-lg border transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: theme.colors.cardBorder }}
        >
          <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
        </button>
      </div>
    </div>
  );
}
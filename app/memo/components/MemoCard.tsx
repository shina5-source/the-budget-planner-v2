'use client';

import { Check, Pencil, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface MemoItem {
  id: number;
  description: string;
  montant: string;
  checked: boolean;
}

interface MemoCardProps {
  item: MemoItem;
  onToggleCheck: () => void;
  onEdit: () => void;
  onDelete: () => void;
  devise: string;
  index: number;
}

export default function MemoCard({ 
  item, 
  onToggleCheck, 
  onEdit, 
  onDelete,
  devise,
  index
}: MemoCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <div 
      className="relative rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
      style={{
        background: item.checked 
          ? 'rgba(34, 197, 94, 0.1)' 
          : theme.colors.cardBackgroundLight,
        borderWidth: 1,
        borderColor: item.checked ? 'rgba(34, 197, 94, 0.3)' : theme.colors.cardBorder,
        animationDelay: `${index * 0.05}s`
      }}
    >
      {/* Coin plié effet post-it */}
      <div 
        className="absolute top-0 right-0 w-6 h-6 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${item.checked ? 'rgba(34, 197, 94, 0.2)' : theme.colors.cardBorder} 50%)`,
          borderRadius: '0 12px 0 0'
        }}
      />

      <div className="flex items-start gap-3">
        {/* Checkbox animée */}
        <button 
          onClick={onToggleCheck}
          className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 mt-0.5"
          style={{
            background: item.checked ? '#22c55e' : 'transparent',
            borderColor: item.checked ? '#22c55e' : theme.colors.cardBorder
          }}
        >
          <Check 
            className={`w-4 h-4 text-white transition-all duration-300 ${item.checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
          />
        </button>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <p 
            className={`text-sm font-medium leading-tight transition-all duration-300 ${item.checked ? 'line-through opacity-50' : ''}`}
            style={{ color: theme.colors.textPrimary }}
          >
            {item.description}
          </p>
          
          <p 
            className={`text-lg font-bold mt-1 transition-all duration-300 ${item.checked ? 'opacity-50' : ''}`}
            style={{ color: item.checked ? '#22c55e' : theme.colors.primary }}
          >
            {item.montant} {devise}
          </p>
        </div>

        {/* Actions (visible au hover) */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={onEdit}
            className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
            style={{ background: `${theme.colors.primary}20` }}
          >
            <Pencil className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
          </button>
          <button 
            onClick={onDelete}
            className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(239, 68, 68, 0.15)' }}
          >
            <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
          </button>
        </div>
      </div>

      {/* Badge checked */}
      {item.checked && (
        <div 
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
          style={{ background: '#22c55e' }}
        >
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      )}
    </div>
  );
}
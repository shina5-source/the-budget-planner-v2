'use client';

import { ShoppingBag } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface TopCategoriesProps {
  categories: [string, number][];
  devise: string;
}

export default function TopCategories({ categories, devise }: TopCategoriesProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const textPrimary = { color: theme.colors.textPrimary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  if (categories.length === 0) return null;

  const colors = ['#F44336', '#FF9800', '#FFC107'];
  const maxVal = categories[0][1];

  return (
    <div 
      className="backdrop-blur-sm rounded-xl p-3 shadow-sm border transition-transform hover:scale-[1.02]" 
      style={cardStyle}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-orange-500/20">
          <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
        </div>
        <span className="text-xs font-medium" style={textPrimary}>Top dépenses</span>
      </div>
      
      <div className="space-y-1.5">
        {categories.slice(0, 3).map(([cat, montant], i) => (
          <div key={cat}>
            <div className="flex justify-between text-[10px] mb-0.5">
              <span style={textPrimary}>{cat}</span>
              <span style={{ color: colors[i] }}>{montant.toFixed(0)}{devise}</span>
            </div>
            <div 
              className="h-1 rounded-full overflow-hidden" 
              style={{ backgroundColor: `${theme.colors.cardBorder}50` }}
            >
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ width: `${(montant / maxVal) * 100}%`, backgroundColor: colors[i] }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
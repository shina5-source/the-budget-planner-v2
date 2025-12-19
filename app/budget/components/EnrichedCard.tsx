'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { VariationBadge } from './VariationBadge';
import { MiniSparkline } from './MiniSparkline';

interface EnrichedCardProps {
  title: string;
  amount: number;
  subtitle: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  variation?: number;
  inverseVariation?: boolean;
  progressValue?: number;
  progressMax?: number;
  progressColor?: string;
  sparklineKey?: string;
  sparklineColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sparklineData?: any[];
  hasSparklineData?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  accordionContent?: React.ReactNode;
  iconColor?: string;
  hasData?: boolean;
  hasPrevMonthData?: boolean;
}

export function EnrichedCard({ 
  title, 
  amount, 
  subtitle, 
  icon: Icon, 
  variation, 
  inverseVariation = false, 
  progressValue, 
  progressMax, 
  progressColor, 
  sparklineKey, 
  sparklineColor, 
  sparklineData,
  hasSparklineData = false,
  isOpen = false,
  onToggle,
  accordionContent, 
  iconColor,
  hasData = true,
  hasPrevMonthData = false
}: EnrichedCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  
  const hasAccordionContent = accordionContent && hasData;
  
  // Formater le montant de façon compacte (sans décimales si >= 100)
  const formatAmount = (value: number) => {
    if (value >= 100) {
      return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    return value.toFixed(2);
  };
  
  return (
    <div className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden h-full" style={cardStyle}>
      <div 
        className={`p-3 ${hasAccordionContent ? 'cursor-pointer' : ''}`} 
        onClick={() => hasAccordionContent && onToggle?.()}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-[10px] truncate" style={textSecondary}>{title}</p>
              {variation !== undefined && hasPrevMonthData && (
                <VariationBadge variation={variation} inverse={inverseVariation} small hasData={hasPrevMonthData} />
              )}
            </div>
            <p className="text-lg font-semibold" style={textPrimary}>
              {formatAmount(amount)} €
            </p>
            <p className="text-[9px] mt-0.5" style={textSecondary}>{subtitle}</p>
            {progressValue !== undefined && progressMax !== undefined && progressMax > 0 && (
              <div className="mt-1.5">
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.colors.cardBorder}50` }}>
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${Math.min((progressValue / progressMax) * 100, 100)}%`, 
                      backgroundColor: progressColor || theme.colors.primary 
                    }} 
                  />
                </div>
                <p className="text-[8px] mt-0.5" style={textSecondary}>
                  {((progressValue / progressMax) * 100).toFixed(0)}% du budget
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5 ml-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0" 
              style={{ 
                background: iconColor ? `${iconColor}20` : `${theme.colors.primary}20`, 
                borderColor: theme.colors.cardBorder 
              }}
            >
              <Icon className="w-4 h-4" style={{ color: iconColor || theme.colors.textPrimary }} />
            </div>
            {sparklineKey && hasSparklineData && sparklineData && (
              <MiniSparkline data={sparklineData} dataKey={sparklineKey} color={sparklineColor || theme.colors.primary} />
            )}
            {hasAccordionContent && (
              <div className="mt-0.5">
                {isOpen ? <ChevronUp className="w-3 h-3" style={textSecondary} /> : <ChevronDown className="w-3 h-3" style={textSecondary} />}
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && hasAccordionContent && (
        <div className="px-3 pb-3 animate-fade-in" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
          <div className="pt-2">{accordionContent}</div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { PieChart } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '@/contexts/theme-context';

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

interface PieChartCardProps {
  data: PieDataItem[];
  total: number;
  className?: string;
  style?: React.CSSProperties;
}

export function PieChartCard({ data, total, className = '', style = {} }: PieChartCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [isHovering, setIsHovering] = useState(false);
  
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  
  // Tooltip avec fond forcé sombre et texte clair pour garantir la lisibilité
  const tooltipStyle = { 
    fontSize: '11px', 
    backgroundColor: '#1a1a2e',
    border: '1px solid #2d2d44',
    borderRadius: '8px', 
    color: '#ffffff',
    padding: '8px 12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  };

  if (data.length === 0) return null;

  // Convertir les données pour Recharts
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value
  }));

  // Custom tooltip content pour afficher nom + valeur
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div style={tooltipStyle}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px', color: '#ffffff' }}>
            {item.name}
          </p>
          <p style={{ color: '#ffffff' }}>
            {item.value.toFixed(0)} €
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className={`backdrop-blur-sm rounded-2xl p-4 shadow-sm border ${className}`} 
      style={{ ...cardStyle, ...style, overflow: 'hidden', position: 'relative' }}
    >
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
        <PieChart className="w-4 h-4" /> Répartition des sorties
      </h3>
      <div className="flex items-center justify-center gap-4 px-2">
        <div 
          className="flex-shrink-0" 
          style={{ width: 110, height: 110, position: 'relative' }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie>
              <Pie 
                data={chartData} 
                cx="50%" 
                cy="50%" 
                innerRadius={20} 
                outerRadius={40} 
                dataKey="value" 
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {isHovering && (
                <Tooltip 
                  content={<CustomTooltip />}
                  wrapperStyle={{ 
                    zIndex: 50,
                    pointerEvents: 'none'
                  }}
                  cursor={false}
                  allowEscapeViewBox={{ x: false, y: false }}
                />
              )}
            </RechartsPie>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1.5 min-w-0 flex-shrink">
          {data.map((item, i) => {
            const pct = (item.value / total) * 100;
            return (
              <div key={i} className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-[9px] truncate" style={textSecondary}>{item.name}</span>
                <span className="text-[9px] font-medium flex-shrink-0" style={textPrimary}>
                  {pct.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

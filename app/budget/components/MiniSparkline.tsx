'use client';

import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MiniSparklineProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
  color: string;
  height?: number;
}

export function MiniSparkline({ data, dataKey, color, height = 30 }: MiniSparklineProps) {
  if (!data || data.length === 0 || data.every(d => d[dataKey] === 0)) return null;
  
  return (
    <div style={{ width: 80, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            fill={`url(#gradient-${dataKey})`} 
            strokeWidth={1.5} 
            dot={false} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import { Settings } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { ParametresData } from './types';
import { devises } from './constants';

interface GeneralSectionProps {
  parametres: ParametresData;
  onSave: (data: ParametresData) => void;
}

export default function GeneralSection({ parametres, onSave }: GeneralSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const inputStyle = { 
    background: theme.colors.cardBackgroundLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fade-in-up stagger-1"
      style={cardStyle}
    >
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
        <Settings className="w-5 h-5" style={{ color: theme.colors.primary }} />
        Général
      </h3>
      
      <div className="space-y-3">
        {/* Devise */}
        <div>
          <label className="text-xs font-medium mb-1 block" style={textPrimary}>
            Devise
          </label>
          <select 
            value={parametres.devise} 
            onChange={(e) => onSave({ ...parametres, devise: e.target.value })} 
            className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none cursor-pointer"
            style={inputStyle}
          >
            {devises.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Date de départ */}
        <div>
          <label className="text-xs font-medium mb-1 block" style={textPrimary}>
            Date de départ
          </label>
          <input 
            type="date" 
            value={parametres.dateDepart} 
            onChange={(e) => onSave({ ...parametres, dateDepart: e.target.value })} 
            className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none"
            style={inputStyle} 
          />
        </div>

        {/* Budget avant le 1er */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium" style={textPrimary}>
            Budget avant le 1er du mois
          </label>
          <button 
            onClick={() => onSave({ ...parametres, budgetAvantPremier: !parametres.budgetAvantPremier })} 
            className="w-12 h-6 rounded-full transition-all duration-200"
            style={{ background: parametres.budgetAvantPremier ? theme.colors.primary : theme.colors.cardBackgroundLight }}
          >
            <div 
              className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                parametres.budgetAvantPremier ? 'translate-x-6' : 'translate-x-0.5'
              }`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
}
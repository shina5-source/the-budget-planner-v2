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
  const { theme, isDarkMode } = useTheme() as any;

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

  // Couleur du toggle désactivé - visible en mode clair ET sombre
  const toggleOffBackground = isDarkMode 
    ? theme.colors.cardBackgroundLight 
    : '#d1d5db'; // gray-300 pour le mode clair

  return (
    <>
      <style jsx global>{`
        @keyframes toggle-on {
          0% { transform: translateX(2px); }
          50% { transform: translateX(28px) scale(1.1); }
          100% { transform: translateX(26px); }
        }
        @keyframes toggle-off {
          0% { transform: translateX(26px); }
          50% { transform: translateX(-2px) scale(1.1); }
          100% { transform: translateX(2px); }
        }
        .toggle-circle-on {
          animation: toggle-on 0.3s ease-out forwards;
        }
        .toggle-circle-off {
          animation: toggle-off 0.3s ease-out forwards;
        }
      `}</style>

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
              className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none cursor-pointer transition-all duration-200 hover:border-opacity-80"
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
              className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none transition-all duration-200"
              style={inputStyle} 
            />
          </div>

          {/* Budget avant le 1er - Toggle corrigé */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium" style={textPrimary}>
              Budget avant le 1er du mois
            </label>
            <button 
              onClick={() => onSave({ ...parametres, budgetAvantPremier: !parametres.budgetAvantPremier })} 
              className="w-12 h-6 rounded-full transition-all duration-300 relative border-2 hover:scale-105 active:scale-95"
              style={{ 
                background: parametres.budgetAvantPremier ? theme.colors.primary : toggleOffBackground,
                borderColor: parametres.budgetAvantPremier ? theme.colors.primary : (isDarkMode ? theme.colors.cardBorder : '#9ca3af'),
                boxShadow: parametres.budgetAvantPremier ? `0 2px 8px ${theme.colors.primary}40` : 'none'
              }}
            >
              <div 
                className={`w-4 h-4 rounded-full shadow-md absolute top-0.5 transition-all duration-300`}
                style={{ 
                  background: '#ffffff',
                  left: parametres.budgetAvantPremier ? '26px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
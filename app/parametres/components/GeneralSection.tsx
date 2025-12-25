'use client';

import { useState } from 'react';
import { Settings, Calendar, Info, AlertCircle } from 'lucide-react';
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
  
  // État pour afficher l'info-bulle
  const [showTooltip, setShowTooltip] = useState(false);

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { 
    background: theme.colors.cardBackgroundLight, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  };

  // Couleur du toggle désactivé - visible en mode clair ET sombre
  const toggleOffBackground = isDarkMode 
    ? theme.colors.cardBackgroundLight 
    : '#d1d5db'; // gray-300 pour le mode clair

  // Vérifier si le jour de paie est configuré (différent de 1)
  const jourPaieDefaut = parametres.configurationPaie?.jourPaieDefaut || 1;
  const isPaieConfiguree = jourPaieDefaut !== 1;

  // Handler pour le toggle avec vérification
  const handleToggleBudgetAvantPremier = () => {
    const newValue = !parametres.budgetAvantPremier;
    
    // Si on active le toggle mais que le jour de paie n'est pas configuré
    if (newValue && !isPaieConfiguree) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 4000);
      // On active quand même le toggle, mais on informe l'utilisateur
    }
    
    onSave({ ...parametres, budgetAvantPremier: newValue });
  };

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
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
        }
        .toggle-circle-on {
          animation: toggle-on 0.3s ease-out forwards;
        }
        .toggle-circle-off {
          animation: toggle-off 0.3s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out forwards;
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
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

          {/* Budget avant le 1er - Toggle avec liaison */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium" style={textPrimary}>
                  Budget avant le 1er du mois
                </label>
                <button
                  type="button"
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="p-0.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" style={textSecondary} />
                </button>
              </div>
              <button 
                onClick={handleToggleBudgetAvantPremier} 
                className="w-12 h-6 rounded-full transition-all duration-300 relative border-2 hover:scale-105 active:scale-95"
                style={{ 
                  background: parametres.budgetAvantPremier ? theme.colors.primary : toggleOffBackground,
                  borderColor: parametres.budgetAvantPremier ? theme.colors.primary : (isDarkMode ? theme.colors.cardBorder : '#9ca3af'),
                  boxShadow: parametres.budgetAvantPremier ? `0 2px 8px ${theme.colors.primary}40` : 'none'
                }}
              >
                <div 
                  className="w-4 h-4 rounded-full shadow-md absolute top-0.5 transition-all duration-300"
                  style={{ 
                    background: '#ffffff',
                    left: parametres.budgetAvantPremier ? '26px' : '2px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                />
              </button>
            </div>

            {/* Info-bulle explicative */}
            {showTooltip && (
              <div 
                className="p-3 rounded-xl text-xs animate-fade-in-down"
                style={{ 
                  background: `${theme.colors.primary}15`,
                  border: `1px solid ${theme.colors.primary}30`
                }}
              >
                <p style={textSecondary}>
                  <strong style={textPrimary}>Comment ça marche ?</strong><br />
                  Quand activé, votre budget mensuel sera calculé à partir de votre jour de paie 
                  (configuré dans "Gestion des paies") jusqu&apos;au jour précédent le mois suivant.
                </p>
                <p className="mt-2" style={textSecondary}>
                  <strong>Exemple :</strong> Si vous êtes payé le 28, votre budget de décembre 
                  ira du 28 novembre au 27 décembre.
                </p>
              </div>
            )}

            {/* Indicateur de configuration */}
            {parametres.budgetAvantPremier && (
              <div 
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs animate-fade-in-down ${isPaieConfiguree ? '' : 'pulse-glow'}`}
                style={{ 
                  background: isPaieConfiguree ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: `1px solid ${isPaieConfiguree ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                }}
              >
                {isPaieConfiguree ? (
                  <>
                    <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-green-600">
                      Jour de paie configuré : <strong>J{jourPaieDefaut}</strong>
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="text-amber-600">
                      Configurez votre jour de paie dans <strong>&quot;Gestion des paies&quot;</strong> ci-dessous
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
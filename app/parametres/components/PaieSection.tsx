'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Zap, Info, Check, RotateCcw } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { ParametresData, ConfigurationPaie, PaieMensuelle } from './types';
import { nomsMois, joursOptions, defaultConfigurationPaie } from './constants';

interface PaieSectionProps {
  parametres: ParametresData;
  onSave: (data: ParametresData) => void;
  isActive: boolean;
  onToggle: () => void;
}

export default function PaieSection({
  parametres,
  onSave,
  isActive,
  onToggle
}: PaieSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme, isDarkMode } = useTheme() as any;
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCalendrier, setShowCalendrier] = useState(false);
  
  // S'assurer que configurationPaie existe
  const config: ConfigurationPaie = parametres.configurationPaie || defaultConfigurationPaie;

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

  // Toggle couleur visible en mode clair
  const toggleOffBackground = isDarkMode 
    ? theme.colors.cardBackgroundLight 
    : '#d1d5db';

  // Sauvegarder la configuration
  const saveConfig = (newConfig: ConfigurationPaie) => {
    onSave({
      ...parametres,
      configurationPaie: newConfig
    });
  };

  // Mettre à jour le jour de paie par défaut
  const handleJourDefautChange = (jour: number) => {
    saveConfig({
      ...config,
      jourPaieDefaut: jour
    });
  };

  // Toggle détection automatique
  const handleToggleDetection = () => {
    saveConfig({
      ...config,
      detectionAutoActive: !config.detectionAutoActive
    });
  };

  // Mettre à jour le montant minimum de détection
  const handleMontantMinChange = (montant: number) => {
    saveConfig({
      ...config,
      montantMinimumDetection: montant
    });
  };

  // Obtenir le jour de paie pour un mois donné
  const getJourPaiePourMois = (mois: number): number => {
    const paiePerso = config.paiesPersonnalisees?.find(
      p => p.mois === mois && p.annee === selectedYear
    );
    return paiePerso?.jourPaie || config.jourPaieDefaut;
  };

  // Vérifier si un mois a une paie personnalisée
  const estPersonnalise = (mois: number): boolean => {
    return config.paiesPersonnalisees?.some(
      p => p.mois === mois && p.annee === selectedYear && p.estPersonnalise
    ) || false;
  };

  // Mettre à jour la paie pour un mois spécifique
  const handleJourMoisChange = (mois: number, jour: number) => {
    const paiesExistantes = (config.paiesPersonnalisees || []).filter(
      p => !(p.mois === mois && p.annee === selectedYear)
    );
    
    // Si le jour est le même que le défaut, ne pas ajouter de personnalisation
    if (jour === config.jourPaieDefaut) {
      saveConfig({
        ...config,
        paiesPersonnalisees: paiesExistantes
      });
    } else {
      const nouvellePaie: PaieMensuelle = {
        mois,
        annee: selectedYear,
        jourPaie: jour,
        estPersonnalise: true
      };
      
      saveConfig({
        ...config,
        paiesPersonnalisees: [...paiesExistantes, nouvellePaie]
      });
    }
  };

  // Réinitialiser un mois au défaut
  const handleResetMois = (mois: number) => {
    const paiesExistantes = (config.paiesPersonnalisees || []).filter(
      p => !(p.mois === mois && p.annee === selectedYear)
    );
    
    saveConfig({
      ...config,
      paiesPersonnalisees: paiesExistantes
    });
  };

  return (
    <>
      <style jsx global>{`
        @keyframes accordion-glow-paie {
          0%, 100% { box-shadow: 0 2px 8px rgba(34, 197, 94, 0.1); }
          50% { box-shadow: 0 4px 16px rgba(34, 197, 94, 0.2); }
        }
        @keyframes badge-pulse-paie {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes content-slide-paie {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .accordion-active-paie {
          animation: accordion-glow-paie 2s ease-in-out infinite;
        }
        .badge-pulse-paie {
          animation: badge-pulse-paie 2s ease-in-out infinite;
        }
        .content-slide-paie {
          animation: content-slide-paie 0.3s ease-out forwards;
        }
      `}</style>

      <div 
        className={`backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fade-in-up stagger-2 transition-all duration-300 hover:shadow-md ${isActive ? 'accordion-active-paie' : ''}`}
        style={{
          ...cardStyle,
          borderColor: isActive ? '#22C55E' : theme.colors.cardBorder
        }}
      >
        {/* Header */}
        <button 
          onClick={onToggle} 
          className="w-full flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: 'rgba(34, 197, 94, 0.15)' }}
            >
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm font-semibold" style={textPrimary}>
              Gestion des paies
            </span>
            <span 
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isActive ? 'badge-pulse-paie' : ''}`}
              style={{ 
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22C55E'
              }}
            >
              {config.jourPaieDefaut === 1 ? 'Standard' : `J${config.jourPaieDefaut}`}
            </span>
          </div>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'rotate-180' : 'rotate-0'}`} 
            style={textPrimary} 
          />
        </button>
        
        {/* Contenu */}
        {isActive && (
          <div className="mt-4 space-y-4 content-slide-paie">
            {/* Info box */}
            <div 
              className="flex items-start gap-2 p-3 rounded-xl text-xs"
              style={{ background: 'rgba(34, 197, 94, 0.1)' }}
            >
              <Info size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <p style={textSecondary}>
                Définissez quand vous recevez votre salaire pour que les calculs de budget correspondent à votre réalité financière.
              </p>
            </div>

            {/* Option 1 : Jour de paie par défaut */}
            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-2" style={textPrimary}>
                <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] font-bold text-green-500">1</span>
                Jour de paie par défaut
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={config.jourPaieDefaut}
                  onChange={(e) => handleJourDefautChange(parseInt(e.target.value))}
                  className="flex-1 rounded-xl px-3 py-2 text-sm border focus:outline-none cursor-pointer transition-all duration-200"
                  style={inputStyle}
                >
                  {joursOptions.map((jour) => (
                    <option key={jour.value} value={jour.value}>
                      {jour.value === 1 ? '1er (standard)' : `${jour.label} du mois`}
                    </option>
                  ))}
                </select>
                <span className="text-xs" style={textSecondary}>de chaque mois</span>
              </div>
              <p className="text-[10px]" style={textSecondary}>
                💡 Si votre salaire arrive le {config.jourPaieDefaut}, votre budget mensuel ira du {config.jourPaieDefaut} au {config.jourPaieDefaut - 1 || 'dernier jour'} du mois suivant.
              </p>
            </div>

            {/* Option 2 : Calendrier personnalisé par mois */}
            <div className="space-y-2">
              <button
                onClick={() => setShowCalendrier(!showCalendrier)}
                className="w-full text-xs font-medium flex items-center justify-between p-2 rounded-xl transition-all duration-200 hover:bg-opacity-80"
                style={{ background: `${theme.colors.primary}10` }}
              >
                <span className="flex items-center gap-2" style={textPrimary}>
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] font-bold text-green-500">2</span>
                  Ajuster par mois
                </span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${showCalendrier ? 'rotate-180' : ''}`}
                  style={{ color: theme.colors.primary }}
                />
              </button>
              
              {showCalendrier && (
                <div className="space-y-3 p-3 rounded-xl" style={{ background: theme.colors.cardBackgroundLight }}>
                  {/* Sélecteur d'année */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedYear(y => y - 1)}
                      className="p-1 rounded-lg hover:bg-opacity-80 transition-all"
                      style={{ background: `${theme.colors.primary}20` }}
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" style={{ color: theme.colors.primary }} />
                    </button>
                    <span className="text-sm font-semibold px-4" style={textPrimary}>{selectedYear}</span>
                    <button
                      onClick={() => setSelectedYear(y => y + 1)}
                      className="p-1 rounded-lg hover:bg-opacity-80 transition-all"
                      style={{ background: `${theme.colors.primary}20` }}
                    >
                      <ChevronDown className="w-4 h-4 -rotate-90" style={{ color: theme.colors.primary }} />
                    </button>
                  </div>
                  
                  {/* Grille des mois */}
                  <div className="grid grid-cols-3 gap-2">
                    {nomsMois.map((mois, index) => {
                      const jourActuel = getJourPaiePourMois(index);
                      const isPerso = estPersonnalise(index);
                      
                      return (
                        <div 
                          key={mois}
                          className="p-2 rounded-lg border transition-all duration-200"
                          style={{ 
                            background: isPerso ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                            borderColor: isPerso ? '#22C55E' : theme.colors.cardBorder
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium" style={textPrimary}>
                              {mois.slice(0, 3)}
                            </span>
                            {isPerso && (
                              <button
                                onClick={() => handleResetMois(index)}
                                className="p-0.5 rounded hover:bg-red-500/20 transition-all"
                                title="Réinitialiser"
                              >
                                <RotateCcw size={10} className="text-red-400" />
                              </button>
                            )}
                          </div>
                          <select
                            value={jourActuel}
                            onChange={(e) => handleJourMoisChange(index, parseInt(e.target.value))}
                            className="w-full text-[10px] px-1 py-0.5 rounded border bg-transparent focus:outline-none cursor-pointer"
                            style={{ 
                              borderColor: theme.colors.cardBorder,
                              color: theme.colors.textPrimary
                            }}
                          >
                            {joursOptions.map((jour) => (
                              <option key={jour.value} value={jour.value}>
                                {jour.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                  
                  <p className="text-[9px] text-center" style={textSecondary}>
                    Les mois en vert ont une date personnalisée
                  </p>
                </div>
              )}
            </div>

            {/* Option 3 : Détection automatique */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium flex items-center gap-2" style={textPrimary}>
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] font-bold text-green-500">3</span>
                  Détection automatique
                  <Zap size={12} className="text-yellow-500" />
                </label>
                <button 
                  onClick={handleToggleDetection}
                  className="w-12 h-6 rounded-full transition-all duration-300 relative border-2 hover:scale-105 active:scale-95"
                  style={{ 
                    background: config.detectionAutoActive ? '#22C55E' : toggleOffBackground,
                    borderColor: config.detectionAutoActive ? '#22C55E' : (isDarkMode ? theme.colors.cardBorder : '#9ca3af'),
                    boxShadow: config.detectionAutoActive ? '0 2px 8px rgba(34, 197, 94, 0.4)' : 'none'
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full shadow-md absolute top-0.5 transition-all duration-300"
                    style={{ 
                      background: '#ffffff',
                      left: config.detectionAutoActive ? '26px' : '2px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  />
                </button>
              </div>
              
              {config.detectionAutoActive && (
                <div 
                  className="p-3 rounded-xl space-y-2"
                  style={{ background: 'rgba(234, 179, 8, 0.1)' }}
                >
                  <div>
                    <label className="text-[10px] block mb-1" style={textSecondary}>
                      Montant minimum pour détecter un salaire
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={config.montantMinimumDetection}
                        onChange={(e) => handleMontantMinChange(parseInt(e.target.value) || 0)}
                        className="w-24 rounded-lg px-2 py-1 text-xs border focus:outline-none"
                        style={inputStyle}
                      />
                      <span className="text-xs" style={textSecondary}>{parametres.devise}</span>
                    </div>
                  </div>
                  <p className="text-[9px]" style={textSecondary}>
                    🤖 L'app analysera vos transactions de revenus pour suggérer automatiquement la date de paie.
                  </p>
                </div>
              )}
            </div>

            {/* Résumé */}
            <div 
              className="p-3 rounded-xl border"
              style={{ borderColor: '#22C55E', background: 'rgba(34, 197, 94, 0.05)' }}
            >
              <p className="text-xs font-medium mb-1 flex items-center gap-1" style={textPrimary}>
                <Check size={14} className="text-green-500" />
                Configuration actuelle
              </p>
              <p className="text-[10px]" style={textSecondary}>
                {config.jourPaieDefaut === 1 
                  ? "Budget standard : du 1er au dernier jour de chaque mois"
                  : `Budget personnalisé : du ${config.jourPaieDefaut} au ${config.jourPaieDefaut - 1 || 'dernier jour'} du mois suivant`
                }
                {(config.paiesPersonnalisees?.length || 0) > 0 && (
                  <span className="block mt-1">
                    + {config.paiesPersonnalisees?.length} mois avec date personnalisée
                  </span>
                )}
                {config.detectionAutoActive && (
                  <span className="block mt-1">
                    + Détection automatique activée (≥{config.montantMinimumDetection}{parametres.devise})
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
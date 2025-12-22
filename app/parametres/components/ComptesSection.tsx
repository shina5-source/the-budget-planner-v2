'use client';

import { Building, ChevronDown, Plus, Edit3, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { ParametresData, CompteBancaire } from './types';

interface ComptesSectionProps {
  parametres: ParametresData;
  onSave: (data: ParametresData) => void;
  isActive: boolean;
  onToggle: () => void;
  onAddCompte: () => void;
  onEditCompte: (compte: CompteBancaire) => void;
}

export default function ComptesSection({
  parametres,
  onSave,
  isActive,
  onToggle,
  onAddCompte,
  onEditCompte
}: ComptesSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const deleteCompte = (id: number) => {
    onSave({ 
      ...parametres, 
      comptesBancaires: parametres.comptesBancaires.filter(c => c.id !== id) 
    });
  };

  return (
    <>
      <style jsx global>{`
        @keyframes accordion-glow {
          0%, 100% { box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1); }
          50% { box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2); }
        }
        @keyframes badge-pulse-param {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes content-slide-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .accordion-active {
          animation: accordion-glow 2s ease-in-out infinite;
        }
        .badge-pulse-param {
          animation: badge-pulse-param 2s ease-in-out infinite;
        }
        .content-slide-down {
          animation: content-slide-down 0.3s ease-out forwards;
        }
      `}</style>

      <div 
        className={`backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fade-in-up stagger-2 transition-all duration-300 hover:shadow-md ${isActive ? 'accordion-active' : ''}`}
        style={{
          ...cardStyle,
          borderColor: isActive ? theme.colors.primary : theme.colors.cardBorder
        }}
      >
        <button 
          onClick={onToggle} 
          className="w-full flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: `${theme.colors.primary}15` }}
            >
              <Building className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </div>
            <span className="text-sm font-semibold" style={textPrimary}>Comptes bancaires</span>
            <span 
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isActive ? 'badge-pulse-param' : ''}`}
              style={{ 
                background: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              {parametres.comptesBancaires.length}
            </span>
          </div>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'rotate-180' : 'rotate-0'}`} 
            style={textPrimary} 
          />
        </button>
        
        {isActive && (
          <div className="mt-4 space-y-3 content-slide-down">
            <button 
              onClick={onAddCompte} 
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              style={{ 
                background: theme.colors.primary, 
                color: theme.colors.textOnPrimary,
                boxShadow: `0 4px 15px ${theme.colors.primary}40`
              }}
            >
              <Plus className="w-4 h-4" />
              Ajouter un compte
            </button>
            
            <div className="space-y-2">
              {parametres.comptesBancaires.map((compte, index) => (
                <div 
                  key={compte.id} 
                  className="flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-sm"
                  style={{ 
                    background: theme.colors.cardBackgroundLight,
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div>
                    <p className="text-xs font-medium" style={textPrimary}>{compte.nom}</p>
                    <p className="text-[10px]" style={textSecondary}>
                      {compte.isEpargne ? '💰 Épargne' : '🏦 Courant'} • Solde: {compte.soldeDepart}{parametres.devise}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => onEditCompte(compte)} 
                      className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                      style={{ background: `${theme.colors.primary}15` }}
                    >
                      <Edit3 className="w-4 h-4" style={{ color: theme.colors.primary }} />
                    </button>
                    <button 
                      onClick={() => deleteCompte(compte.id)} 
                      className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
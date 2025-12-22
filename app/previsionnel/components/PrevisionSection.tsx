"use client";

import { Plus, Edit3, Trash2, LucideIcon, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface PrevisionItem {
  id: number;
  categorie: string;
  montantPrevu: number;
}

interface PrevisionSectionProps {
  title: string;
  type: 'revenus' | 'factures' | 'depenses' | 'epargnes';
  items: PrevisionItem[];
  icon: LucideIcon;
  totalReel: number;
  devise?: string;
  onAdd: () => void;
  onEdit: (item: PrevisionItem) => void;
  onDelete: (id: number) => void;
  getReelByCategorie: (categorie: string) => number;
}

export default function PrevisionSection({
  title,
  items,
  icon: Icon,
  totalReel,
  devise = '€',
  onAdd,
  onEdit,
  onDelete,
  getReelByCategorie
}: PrevisionSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  const total = items.reduce((sum, p) => sum + p.montantPrevu, 0);

  return (
    <div className="space-y-3 animate-fadeIn" style={{ animationDelay: '150ms' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-300 hover:scale-110"
            style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}
          >
            <Icon className="w-5 h-5" style={{ color: theme.colors.primary }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={textPrimary}>{title}</h3>
            <p className="text-[10px]" style={textSecondary}>
              Prévu: {total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise} | Réel: {totalReel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onAdd} 
          className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
          style={{ 
            background: theme.colors.primary, 
            color: theme.colors.textOnPrimary,
            boxShadow: `0 4px 15px ${theme.colors.primary}40`
          }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Liste ou Empty State */}
      {items.length === 0 ? (
        <EmptyState onAdd={onAdd} Icon={Icon} />
      ) : (
        <div 
          className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden"
          style={cardStyle}
        >
          <div>
            {items.map((item, index) => {
              const reel = getReelByCategorie(item.categorie);
              const ecart = reel - item.montantPrevu;
              
              return (
                <div 
                  key={item.id} 
                  className="p-3 flex items-center justify-between transition-all duration-200 hover:bg-white/5 animate-fadeIn group"
                  style={{ 
                    borderBottomWidth: index < items.length - 1 ? 1 : 0, 
                    borderColor: theme.colors.cardBorder,
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className="flex-1">
                    <p className="text-xs font-medium" style={textPrimary}>{item.categorie}</p>
                    <div className="flex gap-3 mt-1 flex-wrap">
                      <span className="text-[10px]" style={textSecondary}>
                        Prévu: {item.montantPrevu.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
                      </span>
                      <span className="text-[10px]" style={textSecondary}>
                        Réel: {reel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
                      </span>
                      <span className={`text-[10px] font-medium ${ecart >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ({ecart >= 0 ? '+' : ''}{ecart.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise})
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={() => onEdit(item)} 
                      className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                      style={{ background: `${theme.colors.primary}20` }}
                    >
                      <Edit3 className="w-4 h-4" style={{ color: theme.colors.primary }} />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)} 
                      className="p-2 rounded-lg bg-red-500/20 transition-all duration-200 hover:scale-110 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Footer total */}
          <div 
            className="p-3 flex justify-between"
            style={{ background: theme.colors.cardBackgroundLight, borderTopWidth: 1, borderColor: theme.colors.cardBorder }}
          >
            <span className="text-xs font-medium" style={textPrimary}>Total</span>
            <span className="text-xs font-bold tabular-nums" style={textPrimary}>
              {total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {devise}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Empty State avec animations
function EmptyState({ onAdd, Icon }: { onAdd: () => void; Icon: LucideIcon }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  return (
    <>
      <style jsx global>{`
        @keyframes pulse-glow-prev {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 20px 10px rgba(139, 92, 246, 0.2);
          }
        }
        @keyframes icon-float-prev {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes sparkle-rotate-prev {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-10deg) scale(1.1); }
        }
        @keyframes button-pulse-prev {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% { 
            transform: scale(1.03);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
          }
        }
        @keyframes button-shine-prev {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-pulse-glow-prev {
          animation: pulse-glow-prev 2s ease-in-out infinite;
        }
        .animate-icon-float-prev {
          animation: icon-float-prev 3s ease-in-out infinite;
        }
        .animate-sparkle-prev {
          animation: sparkle-rotate-prev 2s ease-in-out infinite;
        }
        .animate-button-pulse-prev {
          animation: button-pulse-prev 2s ease-in-out infinite;
        }
        .button-shine-prev {
          position: relative;
          overflow: hidden;
        }
        .button-shine-prev::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 200% 100%;
          animation: button-shine-prev 3s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="backdrop-blur-sm rounded-2xl p-6 shadow-sm border text-center animate-fadeIn"
        style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
      >
        {/* Icône avec animation pulse-glow */}
        <div className="relative inline-block mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse-glow-prev"
            style={{ background: `${theme.colors.primary}15` }}
          >
            <Icon className="w-8 h-8 animate-icon-float-prev" style={{ color: theme.colors.primary }} />
          </div>
          {/* Badge Sparkles avec animation */}
          <div 
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 animate-sparkle-prev"
            style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
          </div>
        </div>

        <p className="text-sm font-medium mb-1" style={{ color: theme.colors.textPrimary }}>
          Aucune prévision
        </p>
        <p className="text-xs mb-4" style={{ color: theme.colors.textSecondary }}>
          Ajoutez votre première prévision pour ce mois
        </p>

        {/* Bouton avec animation pulse + shine */}
        <button
          onClick={onAdd}
          className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 animate-button-pulse-prev button-shine-prev flex items-center justify-center gap-2 mx-auto"
          style={{ 
            background: theme.colors.primary, 
            color: theme.colors.textOnPrimary,
            boxShadow: `0 4px 20px ${theme.colors.primary}50`
          }}
        >
          <Plus className="w-4 h-4" />
          Ajouter une prévision
        </button>
      </div>
    </>
  );
}
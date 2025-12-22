'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { ParametresData, CategorieType } from './types';

interface CategorieSectionProps {
  title: string;
  type: CategorieType;
  icon: React.ReactNode;
  parametres: ParametresData;
  onSave: (data: ParametresData) => void;
  isActive: boolean;
  onToggle: () => void;
  staggerIndex: number;
}

export default function CategorieSection({
  title,
  type,
  icon,
  parametres,
  onSave,
  isActive,
  onToggle,
  staggerIndex
}: CategorieSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [newCategorie, setNewCategorie] = useState('');

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

  const addCategorie = () => {
    if (!newCategorie.trim()) return;
    onSave({ 
      ...parametres, 
      [type]: [...parametres[type], newCategorie.trim()] 
    });
    setNewCategorie('');
  };

  const removeCategorie = (index: number) => {
    onSave({ 
      ...parametres, 
      [type]: parametres[type].filter((_, i) => i !== index) 
    });
  };

  return (
    <>
      <style jsx global>{`
        @keyframes accordion-glow-cat {
          0%, 100% { box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1); }
          50% { box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2); }
        }
        @keyframes badge-pulse-cat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes content-slide-cat {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes icon-bounce-cat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .accordion-active-cat {
          animation: accordion-glow-cat 2s ease-in-out infinite;
        }
        .badge-pulse-cat {
          animation: badge-pulse-cat 2s ease-in-out infinite;
        }
        .content-slide-cat {
          animation: content-slide-cat 0.3s ease-out forwards;
        }
        .icon-bounce-cat {
          animation: icon-bounce-cat 0.3s ease-out;
        }
      `}</style>

      <div 
        className={`backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-3 animate-fade-in-up stagger-${staggerIndex} transition-all duration-300 hover:shadow-md ${isActive ? 'accordion-active-cat' : ''}`}
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
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isActive ? 'icon-bounce-cat' : ''}`}
              style={{ background: `${theme.colors.primary}10` }}
            >
              {icon}
            </div>
            <span className="text-sm font-semibold" style={textPrimary}>{title}</span>
            <span 
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isActive ? 'badge-pulse-cat' : ''}`}
              style={{ 
                background: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              {parametres[type].length}
            </span>
          </div>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'rotate-180' : 'rotate-0'}`} 
            style={textPrimary} 
          />
        </button>
        
        {isActive && (
          <div className="mt-4 space-y-3 content-slide-cat">
            {/* Ajout */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nouvelle catégorie..." 
                value={newCategorie} 
                onChange={(e) => setNewCategorie(e.target.value)} 
                className="flex-1 rounded-xl px-3 py-2 text-sm border focus:outline-none transition-all duration-200"
                style={inputStyle} 
                onKeyDown={(e) => { if (e.key === 'Enter') addCategorie(); }} 
              />
              <button 
                onClick={addCategorie} 
                className="px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                style={{ 
                  background: theme.colors.primary, 
                  color: theme.colors.textOnPrimary,
                  boxShadow: `0 2px 10px ${theme.colors.primary}30`
                }}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {/* Liste */}
            <div className="max-h-48 overflow-y-auto space-y-1">
              {parametres[type].map((cat, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-sm"
                  style={{ 
                    background: theme.colors.cardBackgroundLight,
                    animationDelay: `${index * 30}ms`
                  }}
                >
                  <span className="text-xs font-medium" style={textPrimary}>{cat}</span>
                  <button 
                    onClick={() => removeCategorie(index)} 
                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
              {parametres[type].length === 0 && (
                <p className="text-center py-4 text-xs" style={textSecondary}>
                  Aucune catégorie
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
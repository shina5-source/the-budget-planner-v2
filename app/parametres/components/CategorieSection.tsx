'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
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
    <div 
      className={`backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-3 animate-fade-in-up stagger-${staggerIndex}`}
      style={cardStyle}
    >
      <button 
        onClick={onToggle} 
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm font-semibold" style={textPrimary}>{title}</span>
          <span 
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ 
              background: `${theme.colors.primary}20`,
              color: theme.colors.primary 
            }}
          >
            {parametres[type].length}
          </span>
        </div>
        {isActive 
          ? <ChevronUp className="w-5 h-5" style={textPrimary} /> 
          : <ChevronDown className="w-5 h-5" style={textPrimary} />
        }
      </button>
      
      {isActive && (
        <div className="mt-4 space-y-3">
          {/* Ajout */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nouvelle catégorie..." 
              value={newCategorie} 
              onChange={(e) => setNewCategorie(e.target.value)} 
              className="flex-1 rounded-xl px-3 py-2 text-sm border focus:outline-none"
              style={inputStyle} 
              onKeyDown={(e) => { if (e.key === 'Enter') addCategorie(); }} 
            />
            <button 
              onClick={addCategorie} 
              className="px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Liste */}
          <div className="max-h-48 overflow-y-auto space-y-1">
            {parametres[type].map((cat, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 hover:scale-[1.01]"
                style={{ background: theme.colors.cardBackgroundLight }}
              >
                <span className="text-xs font-medium" style={textPrimary}>{cat}</span>
                <button 
                  onClick={() => removeCategorie(index)} 
                  className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-200"
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
  );
}
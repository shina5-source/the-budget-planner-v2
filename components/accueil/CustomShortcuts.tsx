'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  PieChart, Target, Mail, TrendingUp, Settings, CreditCard, 
  PiggyBank, Building2, FileText, Calendar, X, Check, Grip,
  ChevronRight, Sparkles
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

// Types
interface ShortcutItem {
  id: string;
  page: string;
  title: string;
  icon: React.ElementType;
  glowColor: string;
}

interface CustomShortcutsProps {
  onNavigate: (page: string) => void;
}

// Toutes les pages disponibles
const allShortcuts: ShortcutItem[] = [
  { id: 'budget', page: 'budget', title: 'Budget', icon: PieChart, glowColor: '#3B82F6' },
  { id: 'transactions', page: 'transactions', title: 'Transactions', icon: CreditCard, glowColor: '#06B6D4' },
  { id: 'objectifs', page: 'objectifs', title: 'Objectifs', icon: Target, glowColor: '#F59E0B' },
  { id: 'epargnes', page: 'epargnes', title: 'Épargnes', icon: PiggyBank, glowColor: '#22C55E' },
  { id: 'enveloppes', page: 'enveloppes', title: 'Enveloppes', icon: Mail, glowColor: '#EC4899' },
  { id: 'statistiques', page: 'statistiques', title: 'Stats', icon: TrendingUp, glowColor: '#8B5CF6' },
  { id: 'previsionnel', page: 'previsionnel', title: 'Prévision', icon: Calendar, glowColor: '#14B8A6' },
  { id: 'credits-dettes', page: 'credits-dettes', title: 'Crédits', icon: Building2, glowColor: '#EF4444' },
  { id: 'memo', page: 'memo', title: 'Mémo', icon: FileText, glowColor: '#A855F7' },
  { id: 'parametres', page: 'parametres', title: 'Paramètres', icon: Settings, glowColor: '#6B7280' },
];

// Raccourcis par défaut
const defaultShortcutIds = ['budget', 'objectifs', 'epargnes', 'statistiques'];

// Animations CSS
const shortcutAnimations = `
  @keyframes glow-pulse-shortcut {
    0%, 100% { box-shadow: 0 0 5px var(--glow-color); }
    50% { box-shadow: 0 0 15px var(--glow-color), 0 0 25px var(--glow-color); }
  }
  @keyframes icon-wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }
  .shortcut-btn {
    position: relative;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .shortcut-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 0.75rem;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  .shortcut-btn:active {
    transform: scale(0.95);
  }
  .shortcut-btn:active::before {
    opacity: 1;
  }
  .shortcut-btn:active .shortcut-icon {
    animation: icon-wiggle 0.3s ease;
  }
  @media (hover: hover) {
    .shortcut-btn:hover {
      transform: translateY(-2px) scale(1.05);
    }
    .shortcut-btn:hover::before {
      opacity: 1;
    }
    .shortcut-btn:hover .shortcut-icon-container {
      animation: glow-pulse-shortcut 0.8s ease infinite;
    }
  }
  .modal-backdrop {
    animation: fadeIn 0.2s ease;
  }
  .modal-content {
    animation: slideUp 0.3s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function CustomShortcuts({ onNavigate }: CustomShortcutsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultShortcutIds);
  const [showModal, setShowModal] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };

  // Charger les raccourcis sauvegardés
  useEffect(() => {
    const saved = localStorage.getItem('budget-custom-shortcuts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedIds(parsed);
        }
      } catch (e) {
        console.error('Erreur chargement raccourcis:', e);
      }
    }
  }, []);

  // Sauvegarder les raccourcis
  const saveShortcuts = useCallback((ids: string[]) => {
    setSelectedIds(ids);
    localStorage.setItem('budget-custom-shortcuts', JSON.stringify(ids));
  }, []);

  // Ouvrir le modal
  const openModal = useCallback(() => {
    setTempSelectedIds([...selectedIds]);
    setShowModal(true);
  }, [selectedIds]);

  // Fermer le modal
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Sauvegarder et fermer
  const handleSave = useCallback(() => {
    if (tempSelectedIds.length > 0) {
      saveShortcuts(tempSelectedIds);
    }
    setShowModal(false);
  }, [tempSelectedIds, saveShortcuts]);

  // Toggle un raccourci
  const toggleShortcut = useCallback((id: string) => {
    setTempSelectedIds(prev => {
      if (prev.includes(id)) {
        // Retirer (minimum 1 raccourci)
        if (prev.length > 1) {
          return prev.filter(i => i !== id);
        }
        return prev;
      } else {
        // Ajouter (maximum 6 raccourcis)
        if (prev.length < 6) {
          return [...prev, id];
        }
        return prev;
      }
    });
  }, []);

  // Obtenir les raccourcis sélectionnés
  const activeShortcuts = selectedIds
    .map(id => allShortcuts.find(s => s.id === id))
    .filter((s): s is ShortcutItem => s !== undefined);

  // Nombre de colonnes basé sur le nombre de raccourcis
  const gridCols = activeShortcuts.length <= 4 ? 4 : activeShortcuts.length <= 6 ? 3 : 4;

  return (
    <>
      <style>{shortcutAnimations}</style>
      
      <div 
        className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border animate-fade-in-up opacity-0" 
        style={{ ...cardStyle, animationDelay: '0.45s', animationFillMode: 'forwards' }}
      >
        {/* Header avec bouton gérer */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
            <span className="text-[10px] font-medium" style={textSecondary}>
              Raccourcis
            </span>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-medium transition-all hover:scale-105 active:scale-95"
            style={{ 
              background: `${theme.colors.primary}15`,
              color: theme.colors.primary
            }}
          >
            <Grip className="w-3 h-3" />
            Gérer
          </button>
        </div>

        {/* Grille de raccourcis */}
        <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
          {activeShortcuts.map((item) => (
            <button 
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.page)} 
              className="shortcut-btn flex flex-col items-center gap-1.5 p-2 rounded-xl"
              style={{ ['--glow-color' as string]: `${item.glowColor}50` }}
            >
              <div 
                className="shortcut-icon-container w-11 h-11 rounded-xl flex items-center justify-center border transition-all"
                style={{ 
                  background: `${item.glowColor}20`,
                  borderColor: `${item.glowColor}40`,
                  ['--glow-color' as string]: item.glowColor
                }}
              >
                <item.icon className="shortcut-icon w-5 h-5" style={{ color: item.glowColor }} />
              </div>
              <span className="text-[9px] font-medium" style={textSecondary}>
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal de gestion */}
      {showModal && (
        <div 
          className="modal-backdrop fixed inset-0 z-[1001] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="modal-content w-full max-w-md rounded-2xl border shadow-xl max-h-[80vh] overflow-hidden"
            style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: theme.colors.cardBorder }}
            >
              <div>
                <h2 className="text-base font-semibold" style={textPrimary}>
                  Gérer mes raccourcis
                </h2>
                <p className="text-xs mt-0.5" style={textSecondary}>
                  Sélectionnez jusqu'à 6 raccourcis
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-xl transition-all hover:scale-110 active:scale-95"
                style={{ background: `${theme.colors.primary}15` }}
              >
                <X className="w-5 h-5" style={textPrimary} />
              </button>
            </div>

            {/* Liste des raccourcis */}
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              <div className="grid grid-cols-2 gap-2">
                {allShortcuts.map((item) => {
                  const isSelected = tempSelectedIds.includes(item.id);
                  const Icon = item.icon;
                  
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleShortcut(item.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        isSelected ? 'ring-2' : ''
                      }`}
                      style={{ 
                        background: isSelected ? `${item.glowColor}15` : theme.colors.cardBackgroundLight,
                        borderColor: isSelected ? item.glowColor : theme.colors.cardBorder,
                        ringColor: isSelected ? `${item.glowColor}50` : 'transparent'
                      }}
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ 
                          background: `${item.glowColor}20`,
                          boxShadow: isSelected ? `0 0 15px ${item.glowColor}40` : 'none'
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: item.glowColor }} />
                      </div>
                      <div className="flex-1 text-left">
                        <span 
                          className="text-sm font-medium block"
                          style={{ color: isSelected ? item.glowColor : theme.colors.textPrimary }}
                        >
                          {item.title}
                        </span>
                      </div>
                      {isSelected && (
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: item.glowColor }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer du modal */}
            <div 
              className="flex items-center justify-between p-4 border-t"
              style={{ borderColor: theme.colors.cardBorder }}
            >
              <span className="text-xs" style={textSecondary}>
                {tempSelectedIds.length}/6 sélectionnés
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
                  style={{ 
                    background: theme.colors.cardBackgroundLight,
                    color: theme.colors.textPrimary
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  style={{ 
                    background: theme.colors.primary,
                    color: '#FFFFFF'
                  }}
                >
                  <Check className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
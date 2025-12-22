'use client';

import { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { SmartTips } from '@/components';
import { Transaction, ObjectifBudget, COLORS_TYPE, monthsFull } from './types';
import EmptyStateObjectif from './EmptyStateObjectif';

interface ObjectifsTabProps {
  filteredTransactions: Transaction[];
  objectifsBudget: ObjectifBudget[];
  setObjectifsBudget: (objectifs: ObjectifBudget[]) => void;
  selectedMonth: number | null;
  selectedYear: number;
}

// Catégories par défaut
const defaultCategories = {
  Dépenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Transport', 'Loisirs', 'Santé', 'Autres Dépenses'],
  Factures: ['Loyer', 'Électricité', 'Eau', 'Internet', 'Mobile', 'Assurance', 'Impôts', 'Abonnements'],
  Épargnes: ['Livret A', 'PEL', 'Assurance Vie', 'Investissement', 'Épargne', 'Objectifs']
};

export default function ObjectifsTab({
  filteredTransactions,
  objectifsBudget,
  setObjectifsBudget,
  selectedMonth,
  selectedYear
}: ObjectifsTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newObjectif, setNewObjectif] = useState({ categorie: '', type: 'Dépenses' as 'Dépenses' | 'Factures' | 'Épargnes', montant: '' });
  const [editMontant, setEditMontant] = useState('');
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [showNewCategorieInput, setShowNewCategorieInput] = useState(false);
  const [newCategorieName, setNewCategorieName] = useState('');
  const [customCategories, setCustomCategories] = useState<Record<string, string[]>>({
    Dépenses: [],
    Factures: [],
    Épargnes: []
  });

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { 
    background: theme.colors.cardBackgroundLight || theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder, 
    color: theme.colors.textPrimary 
  };

  const periodLabel = selectedMonth !== null ? monthsFull[selectedMonth] : 'Année';

  // Charger toutes les transactions et catégories personnalisées au montage
  useEffect(() => {
    try {
      // Charger les transactions
      const savedTransactions = localStorage.getItem('budget-transactions');
      if (savedTransactions) {
        setAllTransactions(JSON.parse(savedTransactions));
      }
      
      // Charger les catégories personnalisées
      const savedCustomCategories = localStorage.getItem('budget-custom-categories');
      if (savedCustomCategories) {
        setCustomCategories(JSON.parse(savedCustomCategories));
      }
    } catch (e) {
      console.error('Erreur lecture données:', e);
    }
  }, []);

  // Calculer le réel par catégorie
  const getReelParCategorie = (categorie: string, type: string) => {
    return filteredTransactions
      .filter(t => t.type === type && t.categorie === categorie)
      .reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
  };

  // Obtenir les catégories (défaut + transactions + personnalisées)
  const getCategoriesDisponibles = (type: string): string[] => {
    // Catégories par défaut
    const defaultCats = defaultCategories[type as keyof typeof defaultCategories] || [];
    
    // Catégories depuis les transactions existantes
    const transactionCats = new Set<string>();
    allTransactions
      .filter(t => t.type === type)
      .forEach(t => {
        if (t.categorie) transactionCats.add(t.categorie);
      });
    
    // Catégories personnalisées ajoutées
    const customCats = customCategories[type] || [];
    
    // Fusionner et dédupliquer
    const allCats = new Set([...defaultCats, ...Array.from(transactionCats), ...customCats]);
    
    return Array.from(allCats).sort();
  };

  // Ajouter une nouvelle catégorie personnalisée
  const handleAddCategorie = () => {
    if (!newCategorieName.trim()) return;

    const updatedCustomCategories = { ...customCategories };
    if (!updatedCustomCategories[newObjectif.type]) {
      updatedCustomCategories[newObjectif.type] = [];
    }
    
    if (!updatedCustomCategories[newObjectif.type].includes(newCategorieName)) {
      updatedCustomCategories[newObjectif.type] = [...updatedCustomCategories[newObjectif.type], newCategorieName];
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('budget-custom-categories', JSON.stringify(updatedCustomCategories));
    setCustomCategories(updatedCustomCategories);
    
    // Sélectionner la nouvelle catégorie
    setNewObjectif({ ...newObjectif, categorie: newCategorieName });
    setNewCategorieName('');
    setShowNewCategorieInput(false);
  };

  // Stats des objectifs
  const objectifsAvecReel = objectifsBudget.map(obj => {
    const reel = getReelParCategorie(obj.categorie, obj.type);
    const pourcentage = obj.montant > 0 ? (reel / obj.montant) * 100 : 0;
    const estDepasse = obj.type === 'Épargnes' ? reel < obj.montant : reel > obj.montant;
    
    return { ...obj, reel, pourcentage, estDepasse };
  });

  const nbRespectes = objectifsAvecReel.filter(o => !o.estDepasse).length;
  const nbDepasses = objectifsAvecReel.filter(o => o.estDepasse).length;

  // Handlers
  const handleAddObjectif = () => {
    if (!newObjectif.categorie || !newObjectif.montant) return;
    
    const objectif: ObjectifBudget = {
      id: Date.now().toString(),
      categorie: newObjectif.categorie,
      type: newObjectif.type,
      montant: parseFloat(newObjectif.montant)
    };
    
    setObjectifsBudget([...objectifsBudget, objectif]);
    setNewObjectif({ categorie: '', type: 'Dépenses', montant: '' });
    setIsAdding(false);
  };

  const handleDeleteObjectif = (id: string) => {
    setObjectifsBudget(objectifsBudget.filter(o => o.id !== id));
  };

  const handleStartEdit = (obj: ObjectifBudget) => {
    setEditingId(obj.id);
    setEditMontant(obj.montant.toString());
  };

  const handleSaveEdit = (id: string) => {
    setObjectifsBudget(objectifsBudget.map(o => 
      o.id === id ? { ...o, montant: parseFloat(editMontant) || o.montant } : o
    ));
    setEditingId(null);
    setEditMontant('');
  };

  const handleCategorieChange = (value: string) => {
    if (value === '__add_new__') {
      setShowNewCategorieInput(true);
      setNewObjectif({ ...newObjectif, categorie: '' });
    } else {
      setNewObjectif({ ...newObjectif, categorie: value });
      setShowNewCategorieInput(false);
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'Dépenses': return COLORS_TYPE.depenses;
      case 'Factures': return COLORS_TYPE.factures;
      case 'Épargnes': return COLORS_TYPE.epargnes;
      default: return theme.colors.primary;
    }
  };

  return (
    <>
      {/* Animations CSS */}
      <style jsx global>{`
        @keyframes button-pulse-obj-tab {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% { 
            transform: scale(1.02);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
          }
        }
        @keyframes button-shine-obj-tab {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        .animate-button-pulse-obj-tab {
          animation: button-pulse-obj-tab 2s ease-in-out infinite;
        }
        .button-shine-obj-tab {
          position: relative;
          overflow: hidden;
        }
        .button-shine-obj-tab::after {
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
          animation: button-shine-obj-tab 3s ease-in-out infinite;
        }
      `}</style>

      <div className="space-y-4">
        {/* Résumé */}
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} style={{ color: theme.colors.primary }} />
            <h3 className="text-sm font-semibold" style={textPrimary}>
              Objectifs - {periodLabel} {selectedYear}
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl" style={{ background: `${theme.colors.primary}15` }}>
              <p className="text-lg font-bold" style={{ color: theme.colors.primary }}>{objectifsBudget.length}</p>
              <p className="text-[9px]" style={textSecondary}>Définis</p>
            </div>
            <div className="p-2 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
              <p className="text-lg font-bold text-green-500">{nbRespectes}</p>
              <p className="text-[9px]" style={textSecondary}>Respectés</p>
            </div>
            <div className="p-2 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
              <p className="text-lg font-bold text-red-500">{nbDepasses}</p>
              <p className="text-[9px]" style={textSecondary}>Dépassés</p>
            </div>
          </div>
        </div>

        {/* Liste des objectifs */}
        {objectifsAvecReel.length > 0 && (
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
            <h3 className="text-sm font-semibold mb-3" style={textPrimary}>
              Suivi des objectifs
            </h3>
            
            <div className="space-y-3">
              {objectifsAvecReel.map((obj) => {
                const color = getColorForType(obj.type);
                const isEditing = editingId === obj.id;
                
                return (
                  <div 
                    key={obj.id} 
                    className="p-3 rounded-xl"
                    style={{ background: `${color}10` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-[9px] px-2 py-0.5 rounded-full"
                          style={{ background: `${color}30`, color }}
                        >
                          {obj.type}
                        </span>
                        <span className="text-xs font-medium" style={textPrimary}>{obj.categorie}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(obj.id)}
                              className="p-1 rounded-full hover:scale-110 transition-all"
                              style={{ background: 'rgba(34, 197, 94, 0.2)' }}
                            >
                              <Check size={12} className="text-green-500" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded-full hover:scale-110 transition-all"
                              style={{ background: 'rgba(239, 68, 68, 0.2)' }}
                            >
                              <X size={12} className="text-red-500" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(obj)}
                              className="p-1 rounded-full hover:scale-110 transition-all"
                              style={{ background: `${theme.colors.primary}20` }}
                            >
                              <Edit3 size={12} style={{ color: theme.colors.primary }} />
                            </button>
                            <button
                              onClick={() => handleDeleteObjectif(obj.id)}
                              className="p-1 rounded-full hover:scale-110 transition-all"
                              style={{ background: 'rgba(239, 68, 68, 0.2)' }}
                            >
                              <Trash2 size={12} className="text-red-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mb-2">
                      <div className="h-2 rounded-full" style={{ background: `${theme.colors.cardBorder}50` }}>
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(obj.pourcentage, 100)}%`,
                            background: obj.estDepasse ? '#EF4444' : '#22C55E'
                          }}
                        />
                      </div>
                    </div>

                    {/* Montants */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold" style={{ color: obj.estDepasse ? '#EF4444' : '#22C55E' }}>
                          {obj.reel.toFixed(0)} €
                        </span>
                        <span className="text-[10px]" style={textSecondary}> / </span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editMontant}
                            onChange={(e) => setEditMontant(e.target.value)}
                            className="w-16 px-1 py-0.5 rounded text-xs text-center border"
                            style={inputStyle}
                            autoFocus
                          />
                        ) : (
                          <span className="text-xs" style={textSecondary}>{obj.montant.toFixed(0)} €</span>
                        )}
                      </div>
                      <span 
                        className={`text-[10px] px-2 py-0.5 rounded-full ${obj.estDepasse ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
                      >
                        {obj.pourcentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ajouter un objectif */}
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
          {!isAdding ? (
            /* Bouton avec animations pulse + shine */
            <button
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-button-pulse-obj-tab button-shine-obj-tab"
              style={{ 
                background: theme.colors.primary, 
                color: theme.colors.textOnPrimary || '#ffffff',
                boxShadow: `0 4px 20px ${theme.colors.primary}50`
              }}
            >
              <Plus size={18} />
              <span>Nouvel objectif</span>
            </button>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold" style={textPrimary}>Nouvel objectif</h3>
              
              {/* Type */}
              <div>
                <label className="text-[10px] mb-1 block" style={textSecondary}>Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Dépenses', 'Factures', 'Épargnes'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setNewObjectif({ ...newObjectif, type, categorie: '' });
                        setShowNewCategorieInput(false);
                      }}
                      className="py-2 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: newObjectif.type === type ? getColorForType(type) : `${getColorForType(type)}20`,
                        color: newObjectif.type === type ? '#ffffff' : getColorForType(type)
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catégorie */}
              <div>
                <label className="text-[10px] mb-1 block" style={textSecondary}>Catégorie</label>
                {showNewCategorieInput ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategorieName}
                      onChange={(e) => setNewCategorieName(e.target.value)}
                      placeholder="Nom de la catégorie"
                      className="flex-1 px-3 py-2 rounded-lg border text-xs"
                      style={inputStyle}
                      autoFocus
                    />
                    <button
                      onClick={handleAddCategorie}
                      disabled={!newCategorieName.trim()}
                      className="px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
                      style={{ background: theme.colors.primary, color: '#ffffff' }}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setShowNewCategorieInput(false);
                        setNewCategorieName('');
                      }}
                      className="px-3 py-2 rounded-lg text-xs font-medium"
                      style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <select
                    value={newObjectif.categorie}
                    onChange={(e) => handleCategorieChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                    style={inputStyle}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {getCategoriesDisponibles(newObjectif.type).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__add_new__">➕ Ajouter une catégorie...</option>
                  </select>
                )}
              </div>

              {/* Montant */}
              <div>
                <label className="text-[10px] mb-1 block" style={textSecondary}>
                  Montant {newObjectif.type === 'Épargnes' ? 'minimum' : 'maximum'} (€)
                </label>
                <input
                  type="number"
                  value={newObjectif.montant}
                  onChange={(e) => setNewObjectif({ ...newObjectif, montant: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                  style={inputStyle}
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setShowNewCategorieInput(false);
                    setNewCategorieName('');
                  }}
                  className="flex-1 py-2 rounded-lg text-xs font-medium border"
                  style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textSecondary }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddObjectif}
                  disabled={!newObjectif.categorie || !newObjectif.montant}
                  className="flex-1 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                  style={{ background: theme.colors.primary, color: '#ffffff' }}
                >
                  Ajouter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message si aucun objectif */}
        {objectifsBudget.length === 0 && !isAdding && (
          <EmptyStateObjectif />
        )}

        <SmartTips page="statistiques" />
      </div>
    </>
  );
}
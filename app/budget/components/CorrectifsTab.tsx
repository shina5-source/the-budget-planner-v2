'use client';

import { useState, useMemo } from 'react';
import { Target, AlertTriangle, Plus, Trash2, Edit3, Check, X, StickyNote, Lightbulb, ClipboardList } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { SmartTips } from '@/components';
import { animationStyles } from './index';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

interface ObjectifBudget {
  id: string;
  categorie: string;
  limite: number;
  type: 'Factures' | 'Dépenses';
}

interface ActionItem {
  id: string;
  text: string;
  done: boolean;
}

interface NoteItem {
  id: string;
  text: string;
  date: string;
}

interface CorrectifsTabProps {
  filteredTransactions: Transaction[];
  transactions: Transaction[];
  objectifsBudget: ObjectifBudget[];
  actions: ActionItem[];
  notes: NoteItem[];
  onSaveObjectifs: (objectifs: ObjectifBudget[]) => void;
  onSaveActions: (actions: ActionItem[]) => void;
  onSaveNotes: (notes: NoteItem[]) => void;
  totals: {
    totalRevenus: number;
    totalDepenses: number;
    tauxEpargne: number;
    solde: number;
  };
  yearAverages: {
    avgDepenses: number;
    monthsWithData: number;
  };
  top5Depenses: Array<{ name: string; value: number }>;
}

export default function CorrectifsTab({
  filteredTransactions,
  transactions,
  objectifsBudget,
  actions,
  notes,
  onSaveObjectifs,
  onSaveActions,
  onSaveNotes,
  totals,
  yearAverages,
  top5Depenses
}: CorrectifsTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  // États locaux pour les formulaires
  const [showAddObjectif, setShowAddObjectif] = useState(false);
  const [newObjectifCategorie, setNewObjectifCategorie] = useState('');
  const [newObjectifLimite, setNewObjectifLimite] = useState('');
  const [newObjectifType, setNewObjectifType] = useState<'Factures' | 'Dépenses'>('Dépenses');
  const [showAddNewCategory, setShowAddNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [newAction, setNewAction] = useState('');
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  const { totalRevenus, totalDepenses, tauxEpargne, solde } = totals;

  // Calcul des dépenses par catégorie
  const depensesParCategorie = useMemo(() => {
    const categories: Record<string, { total: number; type: string }> = {};
    filteredTransactions.filter(t => t.type === 'Dépenses' || t.type === 'Factures').forEach(t => {
      const cat = t.categorie || 'Autre';
      if (!categories[cat]) categories[cat] = { total: 0, type: t.type };
      categories[cat].total += parseFloat(t.montant || '0');
    });
    return categories;
  }, [filteredTransactions]);

  // Catégories uniques (transactions + paramètres)
  const categoriesUniques = useMemo(() => {
    const cats = new Set<string>();
    
    transactions.forEach(t => { 
      if ((t.type === 'Dépenses' || t.type === 'Factures') && t.categorie) {
        cats.add(t.categorie); 
      }
    });
    
    try {
      const savedParametres = localStorage.getItem('budget-parametres');
      if (savedParametres) {
        const parametres = JSON.parse(savedParametres);
        if (parametres.categoriesDepenses) {
          parametres.categoriesDepenses.forEach((cat: string) => cats.add(cat));
        }
        if (parametres.categoriesFactures) {
          parametres.categoriesFactures.forEach((cat: string) => cats.add(cat));
        }
      }
    } catch (e) {
      console.error('Erreur chargement catégories:', e);
    }
    
    return Array.from(cats).sort();
  }, [transactions]);

  // Alertes de dépassement
  const alertesDepassement = useMemo(() => {
    const alertes: { categorie: string; limite: number; actuel: number; depassement: number }[] = [];
    objectifsBudget.forEach(obj => {
      const actuel = depensesParCategorie[obj.categorie]?.total || 0;
      if (actuel > obj.limite) {
        alertes.push({ 
          categorie: obj.categorie, 
          limite: obj.limite, 
          actuel, 
          depassement: actuel - obj.limite 
        });
      }
    });
    return alertes;
  }, [objectifsBudget, depensesParCategorie]);

  // Suggestions
  const suggestions = useMemo(() => {
    const sugg: string[] = [];
    if (tauxEpargne < 20 && totalRevenus > 0) {
      const montantManquant = (totalRevenus * 0.2) - (totalRevenus * tauxEpargne / 100);
      if (montantManquant > 0) {
        sugg.push(`Pour atteindre 20% d'épargne, épargnez ${montantManquant.toFixed(0)} € de plus.`);
      }
    }
    if (yearAverages.monthsWithData > 1 && totalDepenses > yearAverages.avgDepenses * 1.2) {
      const excedent = totalDepenses - yearAverages.avgDepenses;
      sugg.push(`Vos dépenses dépassent votre moyenne de ${excedent.toFixed(0)} €.`);
    }
    if (top5Depenses.length > 0) {
      sugg.push(`"${top5Depenses[0].name}" est votre plus gros poste (${top5Depenses[0].value.toFixed(0)} € cette année).`);
    }
    if (solde < 0) {
      sugg.push('Votre solde est négatif. Réduisez vos dépenses.');
    }
    return sugg;
  }, [tauxEpargne, totalRevenus, totalDepenses, yearAverages, top5Depenses, solde]);

  // Handlers pour les objectifs
  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;
    
    try {
      const savedParametres = localStorage.getItem('budget-parametres');
      const parametres = savedParametres ? JSON.parse(savedParametres) : {};
      
      if (newObjectifType === 'Dépenses') {
        if (!parametres.categoriesDepenses) parametres.categoriesDepenses = [];
        if (!parametres.categoriesDepenses.includes(newCategoryName.trim())) {
          parametres.categoriesDepenses.push(newCategoryName.trim());
        }
      } else {
        if (!parametres.categoriesFactures) parametres.categoriesFactures = [];
        if (!parametres.categoriesFactures.includes(newCategoryName.trim())) {
          parametres.categoriesFactures.push(newCategoryName.trim());
        }
      }
      
      localStorage.setItem('budget-parametres', JSON.stringify(parametres));
      setNewObjectifCategorie(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddNewCategory(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Erreur ajout catégorie:', e);
    }
  };

  const addObjectif = () => { 
    if (!newObjectifCategorie || !newObjectifLimite) return; 
    onSaveObjectifs([...objectifsBudget, { 
      id: Date.now().toString(), 
      categorie: newObjectifCategorie, 
      limite: parseFloat(newObjectifLimite), 
      type: newObjectifType 
    }]); 
    setNewObjectifCategorie(''); 
    setNewObjectifLimite(''); 
    setShowAddObjectif(false); 
  };

  const deleteObjectif = (id: string) => onSaveObjectifs(objectifsBudget.filter(o => o.id !== id));

  // Handlers pour les actions
  const addAction = () => { 
    if (!newAction.trim()) return; 
    onSaveActions([...actions, { id: Date.now().toString(), text: newAction, done: false }]); 
    setNewAction(''); 
  };
  
  const toggleAction = (id: string) => onSaveActions(actions.map(a => a.id === id ? { ...a, done: !a.done } : a));
  const deleteAction = (id: string) => onSaveActions(actions.filter(a => a.id !== id));

  // Handlers pour les notes
  const addNote = () => { 
    if (!newNote.trim()) return; 
    onSaveNotes([...notes, { id: Date.now().toString(), text: newNote, date: new Date().toLocaleDateString('fr-FR') }]); 
    setNewNote(''); 
  };
  
  const deleteNote = (id: string) => onSaveNotes(notes.filter(n => n.id !== id));
  const updateNote = (id: string, text: string) => { 
    onSaveNotes(notes.map(n => n.id === id ? { ...n, text } : n)); 
    setEditingNote(null); 
  };

  return (
    <div className="space-y-4">
      <style>{animationStyles}</style>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center border" 
          style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}
        >
          <Target className="w-5 h-5" style={textPrimary} />
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={textPrimary}>Correctifs & Actions</h3>
          <p className="text-[10px]" style={textSecondary}>Gérez vos objectifs</p>
        </div>
      </div>
      
      {/* Objectifs budgétaires */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-1 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold flex items-center gap-2" style={textPrimary}>🎯 Objectifs budgétaires</h4>
          <button 
            type="button" 
            onClick={() => setShowAddObjectif(!showAddObjectif)} 
            className="p-1.5 rounded-lg transition-transform hover:scale-110" 
            style={{ background: `${theme.colors.primary}20` }}
          >
            <Plus className="w-4 h-4" style={textPrimary} />
          </button>
        </div>
        
        {showAddObjectif && (
          <div className="p-3 rounded-xl mb-3 animate-fade-in" style={{ background: `${theme.colors.primary}10` }}>
            <div className="space-y-2">
              {!showAddNewCategory ? (
                <div className="flex gap-2">
                  <select 
                    value={newObjectifCategorie} 
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        setShowAddNewCategory(true);
                        setNewObjectifCategorie('');
                      } else {
                        setNewObjectifCategorie(e.target.value);
                      }
                    }} 
                    className="flex-1 px-3 py-2 rounded-lg text-xs border" 
                    style={inputStyle}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categoriesUniques.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__ADD_NEW__">➕ Ajouter une nouvelle catégorie...</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nouvelle catégorie..." 
                    value={newCategoryName} 
                    onChange={(e) => setNewCategoryName(e.target.value)} 
                    className="flex-1 px-3 py-2 rounded-lg text-xs border" 
                    style={inputStyle}
                    autoFocus
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNewCategory()}
                  />
                  <button 
                    type="button" 
                    onClick={handleAddNewCategory} 
                    className="p-2 rounded-lg transition-transform hover:scale-105"
                    style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setShowAddNewCategory(false); setNewCategoryName(''); }} 
                    className="p-2 rounded-lg border transition-transform hover:scale-105"
                    style={{ borderColor: theme.colors.cardBorder }}
                  >
                    <X className="w-4 h-4" style={textSecondary} />
                  </button>
                </div>
              )}
              
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Limite (€)" 
                  value={newObjectifLimite} 
                  onChange={(e) => setNewObjectifLimite(e.target.value)} 
                  className="flex-1 px-3 py-2 rounded-lg text-xs border" 
                  style={inputStyle} 
                />
                <select 
                  value={newObjectifType} 
                  onChange={(e) => setNewObjectifType(e.target.value as 'Factures' | 'Dépenses')} 
                  className="px-3 py-2 rounded-lg text-xs border" 
                  style={inputStyle}
                >
                  <option value="Dépenses">Dépenses</option>
                  <option value="Factures">Factures</option>
                </select>
              </div>
              
              <button 
                type="button" 
                onClick={addObjectif} 
                disabled={!newObjectifCategorie || !newObjectifLimite}
                className="w-full py-2 rounded-lg text-xs font-medium transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed" 
                style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
              >
                Ajouter
              </button>
            </div>
          </div>
        )}
        
        {objectifsBudget.length === 0 ? (
          <p className="text-xs text-center py-3" style={textSecondary}>Aucun objectif défini.</p>
        ) : (
          <div className="space-y-2">
            {objectifsBudget.map(obj => { 
              const actuel = depensesParCategorie[obj.categorie]?.total || 0; 
              const pct = (actuel / obj.limite) * 100; 
              const isOver = actuel > obj.limite; 
              
              return (
                <div key={obj.id} className="p-2 rounded-xl" style={{ background: `${theme.colors.primary}05` }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={textPrimary}>{obj.categorie}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${obj.type === 'Dépenses' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                        {obj.type}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => deleteObjectif(obj.id)} 
                      className="p-1 rounded hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span style={textSecondary}>{actuel.toFixed(0)} € / {obj.limite.toFixed(0)} €</span>
                    <span className={isOver ? 'text-red-400' : 'text-green-400'}>{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.colors.cardBorder}50` }}>
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${Math.min(pct, 100)}%`, 
                        backgroundColor: isOver ? '#F44336' : pct > 80 ? '#FF9800' : '#4CAF50' 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alertes dépassement */}
      {alertesDepassement.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-2 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>⚠️ Alertes dépassement</h4>
          <div className="space-y-2">
            {alertesDepassement.map((alerte, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-xs text-red-400">
                  <strong>{alerte.categorie}</strong> dépasse de {alerte.depassement.toFixed(0)} €
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-3 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
            <Lightbulb className="w-4 h-4" /> Suggestions
          </h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
                <span className="text-sm">💡</span>
                <span className="text-xs" style={textSecondary}>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions à faire */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-4 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
        <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
          <ClipboardList className="w-4 h-4" /> Actions à faire
        </h4>
        <div className="flex gap-2 mb-3">
          <input 
            type="text" 
            placeholder="Ajouter une action..." 
            value={newAction} 
            onChange={(e) => setNewAction(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && addAction()} 
            className="flex-1 px-3 py-2 rounded-lg text-xs border" 
            style={inputStyle} 
          />
          <button 
            type="button" 
            onClick={addAction} 
            className="p-2 rounded-lg transition-transform hover:scale-110" 
            style={{ background: theme.colors.primary }}
          >
            <Plus className="w-4 h-4" style={{ color: theme.colors.textOnPrimary }} />
          </button>
        </div>
        
        {actions.length === 0 ? (
          <p className="text-xs text-center py-2" style={textSecondary}>Aucune action.</p>
        ) : (
          <div className="space-y-2">
            {actions.map(action => (
              <div key={action.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
                <button 
                  type="button" 
                  onClick={() => toggleAction(action.id)} 
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${action.done ? 'bg-green-500 border-green-500' : ''}`} 
                  style={{ borderColor: action.done ? undefined : theme.colors.cardBorder }}
                >
                  {action.done && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className={`flex-1 text-xs ${action.done ? 'line-through opacity-50' : ''}`} style={textPrimary}>
                  {action.text}
                </span>
                <button 
                  type="button" 
                  onClick={() => deleteAction(action.id)} 
                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                >
                  <X className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes personnelles */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border animate-fade-in-up stagger-5 opacity-0" style={{ ...cardStyle, animationFillMode: 'forwards' }}>
        <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
          <StickyNote className="w-4 h-4" /> Notes personnelles
        </h4>
        <div className="flex gap-2 mb-3">
          <input 
            type="text" 
            placeholder="Ajouter une note..." 
            value={newNote} 
            onChange={(e) => setNewNote(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && addNote()} 
            className="flex-1 px-3 py-2 rounded-lg text-xs border" 
            style={inputStyle} 
          />
          <button 
            type="button" 
            onClick={addNote} 
            className="p-2 rounded-lg transition-transform hover:scale-110" 
            style={{ background: theme.colors.primary }}
          >
            <Plus className="w-4 h-4" style={{ color: theme.colors.textOnPrimary }} />
          </button>
        </div>
        
        {notes.length === 0 ? (
          <p className="text-xs text-center py-2" style={textSecondary}>Aucune note.</p>
        ) : (
          <div className="space-y-2">
            {notes.map(note => (
              <div key={note.id} className="p-2 rounded-lg" style={{ background: `${theme.colors.primary}05` }}>
                {editingNote === note.id ? (
                  <input 
                    type="text" 
                    defaultValue={note.text} 
                    onBlur={(e) => updateNote(note.id, e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && updateNote(note.id, (e.target as HTMLInputElement).value)} 
                    className="w-full px-2 py-1 rounded text-xs border" 
                    style={inputStyle} 
                    autoFocus 
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs" style={textPrimary}>{note.text}</p>
                      <p className="text-[9px] mt-1" style={textSecondary}>{note.date}</p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        type="button" 
                        onClick={() => setEditingNote(note.id)} 
                        className="p-1 rounded hover:bg-gray-500/20 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" style={textSecondary} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => deleteNote(note.id)} 
                        className="p-1 rounded hover:bg-red-500/20 transition-colors"
                      >
                        <X className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <SmartTips page="budget" />
    </div>
  );
}
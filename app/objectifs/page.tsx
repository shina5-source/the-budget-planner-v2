"use client";

import { useState, useEffect } from 'react';
import { Target, Plus, Edit3, Trash2, X, Check, RefreshCw, Palmtree, Car, Home, Wallet, Gift, Smartphone, GraduationCap, PartyPopper, Gem, Baby, Heart, ShoppingBasket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';

interface Objectif {
  id: number;
  nom: string;
  montantCible: number;
  montantActuel: number;
  couleur: string;
  icone: string;
  dateEcheance?: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  type: 'court' | 'long';
  recurrence?: {
    actif: boolean;
    frequence: 'mensuel' | 'bimensuel' | 'hebdomadaire';
    montant: number;
    jourDuMois?: number;
    jourSemaine?: number;
    derniereExecution?: string;
  };
}

interface ParametresData {
  devise: string;
}

interface CouleurOption {
  id: string;
  nom: string;
  light: {
    bg: string;
    border: string;
    text: string;
    progress: string;
  };
  dark: {
    bg: string;
    border: string;
    text: string;
    progress: string;
  };
}

const defaultParametres: ParametresData = { devise: '€' };

function ObjectifsContent() {
  const { theme, isDarkMode } = useTheme();
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showVersementModal, setShowVersementModal] = useState(false);
  const [selectedObjectifId, setSelectedObjectifId] = useState<number | null>(null);
  const [versementMontant, setVersementMontant] = useState('');
  const [activeFilter, setActiveFilter] = useState<'tous' | 'court' | 'long'>('tous');
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);

  const [formData, setFormData] = useState({
    nom: '', montantCible: '', montantActuel: '', couleur: 'rose-pale', icone: 'palmtree', dateEcheance: '',
    priorite: 'moyenne' as 'haute' | 'moyenne' | 'basse', type: 'court' as 'court' | 'long',
    recurrenceActif: false, recurrenceFrequence: 'mensuel' as 'mensuel' | 'bimensuel' | 'hebdomadaire', recurrenceMontant: '', recurrenceJour: '1'
  });

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  
  // Style pour les modals - adapté au mode sombre
  const modalBackgroundStyle = { 
    background: isDarkMode ? theme.colors.cardBackground : theme.colors.secondary, 
    borderColor: theme.colors.cardBorder 
  };
  const modalInputStyle = { 
    background: isDarkMode ? theme.colors.backgroundGradientFrom : theme.colors.secondaryLight, 
    borderColor: theme.colors.cardBorder, 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  };
  const modalTextStyle = { 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  };
  const modalButtonOutlineStyle = { 
    borderColor: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary, 
    color: isDarkMode ? theme.colors.textPrimary : theme.colors.textOnSecondary 
  };

  // Couleurs disponibles avec support light/dark mode
  const couleursDisponibles: CouleurOption[] = [
    { 
      id: 'rose-pale', 
      nom: 'Rose pâle', 
      light: { bg: '#F8E8E8', border: '#E8B4B8', text: '#8B4557', progress: '#E8B4B8' },
      dark: { bg: '#3D2A2E', border: '#8B4557', text: '#E8B4B8', progress: '#8B4557' }
    },
    { 
      id: 'rose-poudre', 
      nom: 'Rose poudré', 
      light: { bg: '#F5D5D5', border: '#D4A5A5', text: '#7A3E4D', progress: '#D4A5A5' },
      dark: { bg: '#3A2830', border: '#7A3E4D', text: '#D4A5A5', progress: '#7A3E4D' }
    },
    { 
      id: 'bordeaux-clair', 
      nom: 'Bordeaux clair', 
      light: { bg: '#E8D0D5', border: '#C4848F', text: '#722F37', progress: '#C4848F' },
      dark: { bg: '#35252A', border: '#722F37', text: '#C4848F', progress: '#722F37' }
    },
    { 
      id: 'mauve-rose', 
      nom: 'Mauve rosé', 
      light: { bg: '#E8D8E8', border: '#C9A5C9', text: '#6B4570', progress: '#C9A5C9' },
      dark: { bg: '#2E2535', border: '#6B4570', text: '#C9A5C9', progress: '#6B4570' }
    },
    { 
      id: 'corail-doux', 
      nom: 'Corail doux', 
      light: { bg: '#F8E0D8', border: '#E8A090', text: '#8B5040', progress: '#E8A090' },
      dark: { bg: '#3A2A25', border: '#8B5040', text: '#E8A090', progress: '#8B5040' }
    },
    { 
      id: 'prune-pastel', 
      nom: 'Prune pastel', 
      light: { bg: '#E0D0E0', border: '#A888A8', text: '#5C4060', progress: '#A888A8' },
      dark: { bg: '#2A2530', border: '#5C4060', text: '#A888A8', progress: '#5C4060' }
    },
    { 
      id: 'vieux-rose', 
      nom: 'Vieux rose', 
      light: { bg: '#E8D0D0', border: '#B89090', text: '#6B4545', progress: '#B89090' },
      dark: { bg: '#322828', border: '#6B4545', text: '#B89090', progress: '#6B4545' }
    },
    { 
      id: 'framboise-pastel', 
      nom: 'Framboise', 
      light: { bg: '#F0D8E0', border: '#D898A8', text: '#7A4055', progress: '#D898A8' },
      dark: { bg: '#352530', border: '#7A4055', text: '#D898A8', progress: '#7A4055' }
    },
  ];

  const iconesDisponibles = [
    { id: 'palmtree', nom: 'Voyage', icon: Palmtree }, { id: 'car', nom: 'Voiture', icon: Car }, { id: 'home', nom: 'Maison', icon: Home },
    { id: 'wallet', nom: 'Épargne', icon: Wallet }, { id: 'gift', nom: 'Cadeau', icon: Gift }, { id: 'smartphone', nom: 'Tech', icon: Smartphone },
    { id: 'graduation', nom: 'Formation', icon: GraduationCap }, { id: 'party', nom: 'Événement', icon: PartyPopper },
    { id: 'gem', nom: 'Luxe', icon: Gem }, { id: 'baby', nom: 'Bébé', icon: Baby }, { id: 'heart', nom: 'Santé', icon: Heart }, { id: 'shopping', nom: 'Shopping', icon: ShoppingBasket },
  ];

  const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  useEffect(() => {
    const savedObjectifs = localStorage.getItem('budget-objectifs');
    if (savedObjectifs) {
      const parsed = JSON.parse(savedObjectifs);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const migrated = parsed.map((o: any) => ({ ...o, type: o.type || 'court', recurrence: o.recurrence || undefined }));
      setObjectifs(migrated);
    }
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
  }, []);

  useEffect(() => { if (objectifs.length > 0) processRecurrences(); }, []);

  const processRecurrences = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    let hasChanges = false;
    const updatedObjectifs = objectifs.map(obj => {
      if (!obj.recurrence?.actif || !obj.recurrence.montant) return obj;
      const rec = obj.recurrence;
      const lastExec = rec.derniereExecution ? new Date(rec.derniereExecution) : null;
      let shouldExecute = false;
      if (rec.frequence === 'mensuel' || rec.frequence === 'bimensuel') {
        const jourCible = rec.jourDuMois || 1;
        if (today.getDate() === jourCible) { if (!lastExec || lastExec.getMonth() !== today.getMonth() || lastExec.getFullYear() !== today.getFullYear()) shouldExecute = true; }
        if (rec.frequence === 'bimensuel' && today.getDate() === 15) { if (!lastExec || (lastExec.getDate() !== 15 && lastExec.getMonth() === today.getMonth())) shouldExecute = true; }
      } else if (rec.frequence === 'hebdomadaire') {
        const jourCible = rec.jourSemaine || 1;
        if (today.getDay() === jourCible) { if (!lastExec || (today.getTime() - lastExec.getTime()) >= 6 * 24 * 60 * 60 * 1000) shouldExecute = true; }
      }
      if (shouldExecute) {
        hasChanges = true;
        const transactions = JSON.parse(localStorage.getItem('budget-transactions') || '[]');
        transactions.push({ id: Date.now() + Math.random(), date: todayStr, montant: rec.montant.toString(), type: 'Épargnes', categorie: obj.nom, memo: `Versement automatique - ${obj.nom}` });
        localStorage.setItem('budget-transactions', JSON.stringify(transactions));
        return { ...obj, montantActuel: obj.montantActuel + rec.montant, recurrence: { ...rec, derniereExecution: todayStr } };
      }
      return obj;
    });
    if (hasChanges) saveObjectifs(updatedObjectifs);
  };

  const saveObjectifs = (newObjectifs: Objectif[]) => { setObjectifs(newObjectifs); localStorage.setItem('budget-objectifs', JSON.stringify(newObjectifs)); };
  
  // Fonction pour obtenir les couleurs selon le mode (light/dark)
  const getCouleur = (couleurId: string) => {
    const couleur = couleursDisponibles.find(c => c.id === couleurId) || couleursDisponibles[0];
    return isDarkMode ? couleur.dark : couleur.light;
  };
  
  // Fonction pour obtenir l'objet couleur complet (pour le formulaire)
  const getCouleurOption = (couleurId: string) => {
    return couleursDisponibles.find(c => c.id === couleurId) || couleursDisponibles[0];
  };
  
  const getIcone = (iconeId: string) => iconesDisponibles.find(i => i.id === iconeId) || iconesDisponibles[0];

  const resetForm = () => setFormData({ nom: '', montantCible: '', montantActuel: '', couleur: 'rose-pale', icone: 'palmtree', dateEcheance: '', priorite: 'moyenne', type: 'court', recurrenceActif: false, recurrenceFrequence: 'mensuel', recurrenceMontant: '', recurrenceJour: '1' });

  const handleSubmit = () => {
    if (!formData.nom || !formData.montantCible) return;
    const recurrence = formData.recurrenceActif ? { actif: true, frequence: formData.recurrenceFrequence, montant: parseFloat(formData.recurrenceMontant) || 0, jourDuMois: formData.recurrenceFrequence !== 'hebdomadaire' ? parseInt(formData.recurrenceJour) : undefined, jourSemaine: formData.recurrenceFrequence === 'hebdomadaire' ? parseInt(formData.recurrenceJour) : undefined, derniereExecution: undefined } : undefined;
    if (editingId !== null) {
      const updated = objectifs.map(o => o.id === editingId ? { ...o, nom: formData.nom, montantCible: parseFloat(formData.montantCible), montantActuel: parseFloat(formData.montantActuel || '0'), couleur: formData.couleur, icone: formData.icone, dateEcheance: formData.dateEcheance || undefined, priorite: formData.priorite, type: formData.type, recurrence } : o);
      saveObjectifs(updated); setEditingId(null);
    } else {
      const newObjectif: Objectif = { id: Date.now(), nom: formData.nom, montantCible: parseFloat(formData.montantCible), montantActuel: parseFloat(formData.montantActuel || '0'), couleur: formData.couleur, icone: formData.icone, dateEcheance: formData.dateEcheance || undefined, priorite: formData.priorite, type: formData.type, recurrence };
      saveObjectifs([...objectifs, newObjectif]);
    }
    resetForm(); setShowForm(false);
  };

  const handleEdit = (objectif: Objectif) => {
    setFormData({ nom: objectif.nom, montantCible: objectif.montantCible.toString(), montantActuel: objectif.montantActuel.toString(), couleur: objectif.couleur, icone: objectif.icone, dateEcheance: objectif.dateEcheance || '', priorite: objectif.priorite, type: objectif.type || 'court', recurrenceActif: objectif.recurrence?.actif || false, recurrenceFrequence: objectif.recurrence?.frequence || 'mensuel', recurrenceMontant: objectif.recurrence?.montant?.toString() || '', recurrenceJour: (objectif.recurrence?.jourDuMois || objectif.recurrence?.jourSemaine || 1).toString() });
    setEditingId(objectif.id); setShowForm(true);
  };

  const handleDelete = (id: number) => saveObjectifs(objectifs.filter(o => o.id !== id));

  const handleVersement = () => {
    if (!versementMontant || !selectedObjectifId) return;
    const montant = parseFloat(versementMontant);
    const updated = objectifs.map(o => o.id === selectedObjectifId ? { ...o, montantActuel: o.montantActuel + montant } : o);
    saveObjectifs(updated);
    const objectif = objectifs.find(o => o.id === selectedObjectifId);
    if (objectif) {
      const transactions = JSON.parse(localStorage.getItem('budget-transactions') || '[]');
      transactions.push({ id: Date.now(), date: new Date().toISOString().split('T')[0], montant: montant.toString(), type: 'Épargnes', categorie: objectif.nom, memo: `Versement manuel - ${objectif.nom}` });
      localStorage.setItem('budget-transactions', JSON.stringify(transactions));
    }
    setVersementMontant(''); setShowVersementModal(false); setSelectedObjectifId(null);
  };

  const openVersementModal = (id: number) => { setSelectedObjectifId(id); setVersementMontant(''); setShowVersementModal(true); };
  const toggleRecurrence = (id: number) => { const updated = objectifs.map(o => { if (o.id === id && o.recurrence) return { ...o, recurrence: { ...o.recurrence, actif: !o.recurrence.actif } }; return o; }); saveObjectifs(updated); };

  const getMoisRestants = (dateEcheance: string) => { if (!dateEcheance) return null; const now = new Date(); const echeance = new Date(dateEcheance); return Math.max(0, (echeance.getFullYear() - now.getFullYear()) * 12 + (echeance.getMonth() - now.getMonth())); };
  const getSuggestionMensuelle = (objectif: Objectif) => { const moisRestants = getMoisRestants(objectif.dateEcheance || ''); if (!moisRestants || moisRestants === 0) return null; const resteAEpargner = objectif.montantCible - objectif.montantActuel; if (resteAEpargner <= 0) return null; return Math.ceil(resteAEpargner / moisRestants); };
  const formatDate = (dateStr: string) => { if (!dateStr) return ''; return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); };
  const getRecurrenceLabel = (rec: Objectif['recurrence']) => { if (!rec) return ''; if (rec.frequence === 'mensuel') return `${rec.montant}${parametres.devise}/mois le ${rec.jourDuMois}`; if (rec.frequence === 'bimensuel') return `${rec.montant}${parametres.devise} 2x/mois`; if (rec.frequence === 'hebdomadaire') return `${rec.montant}${parametres.devise}/sem. (${joursSemaine[rec.jourSemaine || 0]})`; return ''; };

  const filteredObjectifs = objectifs.filter(o => activeFilter === 'tous' ? true : o.type === activeFilter);
  const totalObjectifs = objectifs.reduce((sum, o) => sum + o.montantCible, 0);
  const totalEpargne = objectifs.reduce((sum, o) => sum + o.montantActuel, 0);
  const progressionGlobale = totalObjectifs > 0 ? (totalEpargne / totalObjectifs) * 100 : 0;
  const objectifsCourtTerme = objectifs.filter(o => o.type === 'court').length;
  const objectifsLongTerme = objectifs.filter(o => o.type === 'long').length;
  const objectifsAvecRecurrence = objectifs.filter(o => o.recurrence?.actif).length;

  return (
    <>
      <div className="pb-4">
        <div className="text-center mb-4"><h1 className="text-lg font-medium" style={textPrimary}>Objectifs</h1><p className="text-xs" style={textSecondary}>Vos objectifs financiers</p></div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center" style={cardStyle}><p className="text-[10px]" style={textSecondary}>Total objectifs</p><p className="text-xs font-semibold" style={textPrimary}>{totalObjectifs.toFixed(0)}{parametres.devise}</p></div>
          <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center" style={cardStyle}><p className="text-[10px]" style={textSecondary}>Épargné</p><p className="text-xs font-semibold" style={textPrimary}>{totalEpargne.toFixed(0)}{parametres.devise}</p></div>
          <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center" style={cardStyle}><p className="text-[10px]" style={textSecondary}>Progression</p><p className="text-xs font-semibold" style={textPrimary}>{Math.round(progressionGlobale)}%</p></div>
        </div>

        {objectifs.length > 0 && (
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
            <p className="text-[10px] mb-2 text-center" style={textSecondary}>Progression globale</p>
            <div className="h-3 rounded-full overflow-hidden border" style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder }}>
              <div className="h-full transition-all duration-500" style={{ width: `${Math.min(progressionGlobale, 100)}%`, background: theme.colors.primary }} />
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <span className="text-[10px]" style={textSecondary}>🎯 Court terme: {objectifsCourtTerme}</span>
              <span className="text-[10px]" style={textSecondary}>🏔️ Long terme: {objectifsLongTerme}</span>
              <span className="text-[10px]" style={textSecondary}>🔄 Récurrents: {objectifsAvecRecurrence}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {(['tous', 'court', 'long'] as const).map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className="flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors border" style={activeFilter === filter ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: theme.colors.cardBackground, color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>
              {filter === 'tous' ? '📋 Tous' : filter === 'court' ? '🎯 Court terme' : '🏔️ Long terme'}
              <span className="ml-1">({filter === 'tous' ? objectifs.length : filter === 'court' ? objectifsCourtTerme : objectifsLongTerme})</span>
            </button>
          ))}
        </div>

        <button onClick={() => { resetForm(); setShowForm(true); }} className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}>
          <Plus className="w-4 h-4" />Nouvel objectif
        </button>

        {filteredObjectifs.length > 0 ? (
          <div className="space-y-3 mb-4">
            {filteredObjectifs.map((objectif) => {
              const couleur = getCouleur(objectif.couleur);
              const icone = getIcone(objectif.icone);
              const IconComponent = icone.icon;
              const reste = objectif.montantCible - objectif.montantActuel;
              const pourcentage = objectif.montantCible > 0 ? (objectif.montantActuel / objectif.montantCible) * 100 : 0;
              const isComplete = pourcentage >= 100;
              const isAlmostComplete = pourcentage >= 80 && pourcentage < 100;
              const suggestion = getSuggestionMensuelle(objectif);
              const moisRestants = getMoisRestants(objectif.dateEcheance || '');

              return (
                <div 
                  key={objectif.id} 
                  className="rounded-2xl p-4 shadow-sm border"
                  style={{ 
                    backgroundColor: couleur.bg, 
                    borderColor: couleur.border 
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{ 
                          backgroundColor: couleur.bg, 
                          borderColor: couleur.border 
                        }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: couleur.text }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: couleur.text }}>{objectif.nom}</p>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${objectif.priorite === 'haute' ? 'bg-red-200 text-red-700' : objectif.priorite === 'moyenne' ? 'bg-orange-200 text-orange-700' : 'bg-green-200 text-green-700'}`}>
                            {objectif.priorite === 'haute' ? '🔴 Haute' : objectif.priorite === 'moyenne' ? '🟠 Moyenne' : '🟢 Basse'}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${objectif.type === 'court' ? 'bg-blue-200 text-blue-700' : 'bg-purple-200 text-purple-700'}`}>
                            {objectif.type === 'court' ? '🎯 Court' : '🏔️ Long'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openVersementModal(objectif.id)} className="p-1.5 hover:opacity-70 rounded-lg">
                        <Plus className="w-4 h-4" style={{ color: couleur.text }} />
                      </button>
                      <button onClick={() => handleEdit(objectif)} className="p-1.5 hover:opacity-70 rounded-lg">
                        <Edit3 className="w-4 h-4" style={{ color: couleur.text }} />
                      </button>
                      <button onClick={() => handleDelete(objectif.id)} className="p-1.5 hover:opacity-70 rounded-lg">
                        <Trash2 className="w-4 h-4" style={{ color: couleur.text }} />
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className="h-3 rounded-full overflow-hidden mb-2"
                    style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)' }}
                  >
                    <div 
                      className="h-full transition-all duration-500" 
                      style={{ 
                        width: `${Math.min(pourcentage, 100)}%`,
                        backgroundColor: isComplete ? '#22c55e' : couleur.progress 
                      }} 
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-[10px] opacity-60" style={{ color: couleur.text }}>Objectif</p>
                        <p className="text-xs font-medium" style={{ color: couleur.text }}>{objectif.montantCible.toFixed(0)}{parametres.devise}</p>
                      </div>
                      <div>
                        <p className="text-[10px] opacity-60" style={{ color: couleur.text }}>Épargné</p>
                        <p className="text-xs font-medium" style={{ color: couleur.text }}>{objectif.montantActuel.toFixed(0)}{parametres.devise}</p>
                      </div>
                      <div>
                        <p className="text-[10px] opacity-60" style={{ color: couleur.text }}>Reste</p>
                        <p className="text-xs font-medium" style={{ color: reste > 0 ? couleur.text : '#22c55e' }}>
                          {reste > 0 ? reste.toFixed(0) + parametres.devise : '✔'}
                        </p>
                      </div>
                    </div>
                    <div 
                      className="px-2 py-1 rounded-full text-[10px] font-medium"
                      style={
                        isComplete 
                          ? { backgroundColor: '#22c55e', color: 'white' } 
                          : isAlmostComplete 
                            ? { backgroundColor: '#facc15', color: '#854d0e' }
                            : { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)', color: couleur.text }
                      }
                    >
                      {isComplete ? '🎉 Atteint !' : `${Math.round(pourcentage)}%`}
                    </div>
                  </div>
                  
                  <div 
                    className="pt-2 border-t border-opacity-30 space-y-1"
                    style={{ borderColor: couleur.border }}
                  >
                    {objectif.dateEcheance && (
                      <p className="text-[10px] opacity-70" style={{ color: couleur.text }}>
                        📅 Échéance : {formatDate(objectif.dateEcheance)} ({moisRestants} mois)
                      </p>
                    )}
                    {suggestion && !isComplete && (
                      <p className="text-[10px] opacity-70" style={{ color: couleur.text }}>
                        💡 Épargnez {suggestion}{parametres.devise}/mois pour atteindre votre objectif
                      </p>
                    )}
                    {objectif.recurrence && (
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] opacity-70" style={{ color: couleur.text }}>
                          🔄 Récurrence : {getRecurrenceLabel(objectif.recurrence)}
                        </p>
                        <button 
                          onClick={() => toggleRecurrence(objectif.id)} 
                          className="w-8 h-4 rounded-full transition-colors"
                          style={{ backgroundColor: objectif.recurrence.actif ? '#22c55e' : '#9ca3af' }}
                        >
                          <div 
                            className="w-3 h-3 rounded-full bg-white shadow transition-transform"
                            style={{ transform: objectif.recurrence.actif ? 'translateX(16px)' : 'translateX(2px)' }}
                          />
                        </button>
                      </div>
                    )}
                    {isComplete && (
                      <p className="text-[10px] font-medium" style={{ color: '#22c55e' }}>
                        ✅ Félicitations ! Objectif atteint !
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center py-8 mb-4" style={cardStyle}>
            <Target className="w-12 h-12 mx-auto mb-3" style={{ color: theme.colors.textSecondary }} />
            <p className="text-xs mb-2" style={textSecondary}>{activeFilter === 'tous' ? 'Aucun objectif' : `Aucun objectif ${activeFilter === 'court' ? 'court terme' : 'long terme'}`}</p>
            <p className="text-[10px]" style={textSecondary}>Créez votre premier objectif</p>
          </div>
        )}

        {/* SmartTips remplace l'ancienne carte conseils */}
        <SmartTips page="objectifs" />
      </div>

      {/* Modal Formulaire - Adapté au mode sombre */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="rounded-2xl p-4 w-full max-w-md border mb-20 mt-20" style={modalBackgroundStyle}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium" style={modalTextStyle}>{editingId ? 'Modifier' : 'Nouvel'} objectif</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1">
                <X className="w-5 h-5" style={modalTextStyle} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={modalTextStyle}>Nom de l&apos;objectif</label>
                <input type="text" placeholder="Ex: Voyage Japon, iPhone..." value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={modalInputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={modalTextStyle}>Montant cible ({parametres.devise})</label>
                  <input type="number" placeholder="0" value={formData.montantCible} onChange={(e) => setFormData({ ...formData, montantCible: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={modalInputStyle} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={modalTextStyle}>Déjà épargné ({parametres.devise})</label>
                  <input type="number" placeholder="0" value={formData.montantActuel} onChange={(e) => setFormData({ ...formData, montantActuel: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={modalInputStyle} />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={modalTextStyle}>Date d&apos;échéance (optionnel)</label>
                <input type="date" value={formData.dateEcheance} onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={modalInputStyle} />
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={modalTextStyle}>Type d&apos;objectif</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['court', 'long'] as const).map((t) => (
                    <button key={t} onClick={() => setFormData({ ...formData, type: t })} className="py-2 rounded-xl text-xs font-medium border" style={formData.type === t ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } : { ...modalInputStyle }}>
                      {t === 'court' ? '🎯 Court terme' : '🏔️ Long terme'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={modalTextStyle}>Priorité</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['haute', 'moyenne', 'basse'] as const).map((p) => (
                    <button key={p} onClick={() => setFormData({ ...formData, priorite: p })} className="py-2 rounded-xl text-xs font-medium border" style={formData.priorite === p ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } : { ...modalInputStyle }}>
                      {p === 'haute' ? '🔴 Haute' : p === 'moyenne' ? '🟠 Moyenne' : '🟢 Basse'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={modalTextStyle}>Couleur</label>
                <div className="grid grid-cols-4 gap-2">
                  {couleursDisponibles.map((couleurOption) => {
                    const displayColor = isDarkMode ? couleurOption.dark : couleurOption.light;
                    return (
                      <button 
                        key={couleurOption.id} 
                        onClick={() => setFormData({ ...formData, couleur: couleurOption.id })} 
                        className="h-10 rounded-xl border-2"
                        style={{ 
                          backgroundColor: displayColor.bg,
                          borderColor: formData.couleur === couleurOption.id ? theme.colors.primary : displayColor.border,
                          boxShadow: formData.couleur === couleurOption.id ? `0 0 0 2px ${theme.colors.primary}` : 'none'
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={modalTextStyle}>Icône</label>
                <div className="grid grid-cols-6 gap-2">
                  {iconesDisponibles.map((icone) => { 
                    const IconComp = icone.icon; 
                    return (
                      <button key={icone.id} onClick={() => setFormData({ ...formData, icone: icone.id })} className="h-10 rounded-xl flex items-center justify-center border" style={formData.icone === icone.id ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } : { ...modalInputStyle }}>
                        <IconComp className="w-5 h-5" />
                      </button>
                    ); 
                  })}
                </div>
              </div>

              <div 
                className="p-3 rounded-xl border" 
                style={formData.recurrenceActif ? { borderColor: theme.colors.primary, background: `${theme.colors.primary}20` } : { ...modalInputStyle }}
              >
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium flex items-center gap-2" style={modalTextStyle}>
                    <RefreshCw className="w-4 h-4" />Versement récurrent
                  </label>
                  <button 
                    onClick={() => setFormData({ ...formData, recurrenceActif: !formData.recurrenceActif })} 
                    className="w-12 h-6 rounded-full transition-colors"
                    style={{ backgroundColor: formData.recurrenceActif ? '#22c55e' : (isDarkMode ? '#4b5563' : '#d1d5db') }}
                  >
                    <div 
                      className="w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: formData.recurrenceActif ? 'translateX(24px)' : 'translateX(2px)' }}
                    />
                  </button>
                </div>
                {formData.recurrenceActif && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] block mb-1" style={modalTextStyle}>Fréquence</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['mensuel', 'bimensuel', 'hebdomadaire'] as const).map((f) => (
                          <button key={f} onClick={() => setFormData({ ...formData, recurrenceFrequence: f, recurrenceJour: '1' })} className="py-1.5 rounded-lg text-[10px] font-medium border" style={formData.recurrenceFrequence === f ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } : { ...modalInputStyle }}>
                            {f === 'mensuel' ? 'Mensuel' : f === 'bimensuel' ? '2x/mois' : 'Hebdo'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] block mb-1" style={modalTextStyle}>Montant ({parametres.devise})</label>
                        <input type="number" placeholder="0" value={formData.recurrenceMontant} onChange={(e) => setFormData({ ...formData, recurrenceMontant: e.target.value })} className="w-full rounded-xl px-3 py-2 text-xs border focus:outline-none" style={modalInputStyle} />
                      </div>
                      <div>
                        <label className="text-[10px] block mb-1" style={modalTextStyle}>{formData.recurrenceFrequence === 'hebdomadaire' ? 'Jour semaine' : 'Jour du mois'}</label>
                        <select value={formData.recurrenceJour} onChange={(e) => setFormData({ ...formData, recurrenceJour: e.target.value })} className="w-full rounded-xl px-3 py-2 text-xs border focus:outline-none" style={modalInputStyle}>
                          {formData.recurrenceFrequence === 'hebdomadaire' ? joursSemaine.map((jour, i) => (<option key={i} value={i}>{jour}</option>)) : Array.from({ length: 31 }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 py-3 border rounded-xl font-medium" style={modalButtonOutlineStyle}>Annuler</button>
                <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}>
                  <Check className="w-5 h-5" />{editingId ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Versement - Adapté au mode sombre */}
      {showVersementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="rounded-2xl p-4 w-full max-w-sm border mt-20" style={modalBackgroundStyle}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium" style={modalTextStyle}>Ajouter un versement</h2>
              <button onClick={() => setShowVersementModal(false)} className="p-1">
                <X className="w-5 h-5" style={modalTextStyle} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={modalTextStyle}>Montant ({parametres.devise})</label>
                <input type="number" placeholder="0" value={versementMontant} onChange={(e) => setVersementMontant(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={modalInputStyle} autoFocus />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowVersementModal(false)} className="flex-1 py-3 border rounded-xl font-medium" style={modalButtonOutlineStyle}>Annuler</button>
                <button onClick={handleVersement} className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}>
                  <Plus className="w-5 h-5" />Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ObjectifsPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="objectifs" onNavigate={handleNavigate}>
      <ObjectifsContent />
    </AppShell>
  );
}

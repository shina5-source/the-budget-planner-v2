"use client";

import { useState, useEffect } from 'react';
import { Target, Plus, Edit3, Trash2, X, Check, Lightbulb, RefreshCw, Palmtree, Car, Home, Wallet, Gift, Smartphone, GraduationCap, PartyPopper, Gem, Baby, Heart, ShoppingBasket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell } from '@/components';

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

const defaultParametres: ParametresData = { devise: '€' };

function ObjectifsContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
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
  const inputStyleDynamic = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  const couleursDisponibles = [
    { id: 'rose-pale', nom: 'Rose pâle', bg: 'bg-[#F8E8E8]', border: 'border-[#E8B4B8]', text: 'text-[#8B4557]', progress: 'bg-[#E8B4B8]' },
    { id: 'rose-poudre', nom: 'Rose poudré', bg: 'bg-[#F5D5D5]', border: 'border-[#D4A5A5]', text: 'text-[#7A3E4D]', progress: 'bg-[#D4A5A5]' },
    { id: 'bordeaux-clair', nom: 'Bordeaux clair', bg: 'bg-[#E8D0D5]', border: 'border-[#C4848F]', text: 'text-[#722F37]', progress: 'bg-[#C4848F]' },
    { id: 'mauve-rose', nom: 'Mauve rosé', bg: 'bg-[#E8D8E8]', border: 'border-[#C9A5C9]', text: 'text-[#6B4570]', progress: 'bg-[#C9A5C9]' },
    { id: 'corail-doux', nom: 'Corail doux', bg: 'bg-[#F8E0D8]', border: 'border-[#E8A090]', text: 'text-[#8B5040]', progress: 'bg-[#E8A090]' },
    { id: 'prune-pastel', nom: 'Prune pastel', bg: 'bg-[#E0D0E0]', border: 'border-[#A888A8]', text: 'text-[#5C4060]', progress: 'bg-[#A888A8]' },
    { id: 'vieux-rose', nom: 'Vieux rose', bg: 'bg-[#E8D0D0]', border: 'border-[#B89090]', text: 'text-[#6B4545]', progress: 'bg-[#B89090]' },
    { id: 'framboise-pastel', nom: 'Framboise', bg: 'bg-[#F0D8E0]', border: 'border-[#D898A8]', text: 'text-[#7A4055]', progress: 'bg-[#D898A8]' },
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const getCouleur = (couleurId: string) => couleursDisponibles.find(c => c.id === couleurId) || couleursDisponibles[0];
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
                <div key={objectif.id} className={`${couleur.bg} rounded-2xl p-4 shadow-sm border ${couleur.border}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${couleur.bg} border ${couleur.border}`}><IconComponent className={`w-5 h-5 ${couleur.text}`} /></div>
                      <div>
                        <p className={`text-sm font-semibold ${couleur.text}`}>{objectif.nom}</p>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${objectif.priorite === 'haute' ? 'bg-red-200 text-red-700' : objectif.priorite === 'moyenne' ? 'bg-orange-200 text-orange-700' : 'bg-green-200 text-green-700'}`}>{objectif.priorite === 'haute' ? '🔴 Haute' : objectif.priorite === 'moyenne' ? '🟠 Moyenne' : '🟢 Basse'}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${objectif.type === 'court' ? 'bg-blue-200 text-blue-700' : 'bg-purple-200 text-purple-700'}`}>{objectif.type === 'court' ? '🎯 Court' : '🏔️ Long'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openVersementModal(objectif.id)} className="p-1.5 hover:bg-white/30 rounded-lg"><Plus className={`w-4 h-4 ${couleur.text}`} /></button>
                      <button onClick={() => handleEdit(objectif)} className="p-1.5 hover:bg-white/30 rounded-lg"><Edit3 className={`w-4 h-4 ${couleur.text}`} /></button>
                      <button onClick={() => handleDelete(objectif.id)} className="p-1.5 hover:bg-white/30 rounded-lg"><Trash2 className={`w-4 h-4 ${couleur.text}`} /></button>
                    </div>
                  </div>
                  <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-2"><div className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : couleur.progress}`} style={{ width: `${Math.min(pourcentage, 100)}%` }} /></div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-4">
                      <div><p className={`text-[10px] ${couleur.text} opacity-60`}>Objectif</p><p className={`text-xs font-medium ${couleur.text}`}>{objectif.montantCible.toFixed(0)}{parametres.devise}</p></div>
                      <div><p className={`text-[10px] ${couleur.text} opacity-60`}>Épargné</p><p className={`text-xs font-medium ${couleur.text}`}>{objectif.montantActuel.toFixed(0)}{parametres.devise}</p></div>
                      <div><p className={`text-[10px] ${couleur.text} opacity-60`}>Reste</p><p className={`text-xs font-medium ${reste > 0 ? couleur.text : 'text-green-600'}`}>{reste > 0 ? reste.toFixed(0) + parametres.devise : '✔'}</p></div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-[10px] font-medium ${isComplete ? 'bg-green-500 text-white' : isAlmostComplete ? 'bg-yellow-400 text-yellow-900' : 'bg-white/50 ' + couleur.text}`}>{isComplete ? '🎉 Atteint !' : `${Math.round(pourcentage)}%`}</div>
                  </div>
                  <div className={`pt-2 border-t ${couleur.border} border-opacity-30 space-y-1`}>
                    {objectif.dateEcheance && (<p className={`text-[10px] ${couleur.text} opacity-70`}>📅 Échéance : {formatDate(objectif.dateEcheance)} ({moisRestants} mois)</p>)}
                    {suggestion && !isComplete && (<p className={`text-[10px] ${couleur.text} opacity-70`}>💡 Épargnez {suggestion}{parametres.devise}/mois pour atteindre votre objectif</p>)}
                    {objectif.recurrence && (
                      <div className="flex items-center justify-between">
                        <p className={`text-[10px] ${couleur.text} opacity-70`}>🔄 Récurrence : {getRecurrenceLabel(objectif.recurrence)}</p>
                        <button onClick={() => toggleRecurrence(objectif.id)} className={`w-8 h-4 rounded-full transition-colors ${objectif.recurrence.actif ? 'bg-green-500' : 'bg-gray-400'}`}><div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${objectif.recurrence.actif ? 'translate-x-4' : 'translate-x-0.5'}`} /></button>
                      </div>
                    )}
                    {isComplete && (<p className="text-[10px] text-green-600 font-medium">✅ Félicitations ! Objectif atteint !</p>)}
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

        <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50">
          <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-[#7DD3A8]" /><h4 className="text-xs font-semibold text-[#7DD3A8]">💡 Conseils</h4></div>
          <div className="space-y-2">
            {objectifs.length === 0 && (<p className="text-[10px] text-[#7DD3A8]">📝 Créez des objectifs pour mieux épargner</p>)}
            {objectifs.some(o => (o.montantActuel / o.montantCible) * 100 >= 100) && (<p className="text-[10px] text-[#7DD3A8]">🎉 Félicitations ! Vous avez atteint au moins un objectif</p>)}
            {objectifs.filter(o => o.priorite === 'haute' && (o.montantActuel / o.montantCible) * 100 < 50).length > 0 && (<p className="text-[10px] text-[#7DD3A8]">🔴 Vos objectifs prioritaires ont besoin d&apos;attention</p>)}
            {progressionGlobale > 0 && progressionGlobale < 100 && (<p className="text-[10px] text-[#7DD3A8]">💪 Continuez ! Vous êtes à {Math.round(progressionGlobale)}% de vos objectifs</p>)}
            {objectifsAvecRecurrence > 0 && (<p className="text-[10px] text-[#7DD3A8]">🔄 {objectifsAvecRecurrence} objectif(s) avec versement automatique actif</p>)}
            {objectifs.length > 0 && objectifsAvecRecurrence === 0 && (<p className="text-[10px] text-[#7DD3A8]">💡 Activez les récurrences pour épargner automatiquement</p>)}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="rounded-2xl p-4 w-full max-w-md border mb-20 mt-20" style={{ background: theme.colors.secondary, borderColor: theme.colors.cardBorder }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium" style={textPrimary}>{editingId ? 'Modifier' : 'Nouvel'} objectif</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1"><X className="w-5 h-5" style={textPrimary} /></button>
            </div>

            <div className="space-y-4">
              <div><label className="text-xs font-medium mb-1 block" style={textPrimary}>Nom de l&apos;objectif</label><input type="text" placeholder="Ex: Voyage Japon, iPhone..." value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={inputStyleDynamic} /></div>

              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium mb-1 block" style={textPrimary}>Montant cible ({parametres.devise})</label><input type="number" placeholder="0" value={formData.montantCible} onChange={(e) => setFormData({ ...formData, montantCible: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={inputStyleDynamic} /></div>
                <div><label className="text-xs font-medium mb-1 block" style={textPrimary}>Déjà épargné ({parametres.devise})</label><input type="number" placeholder="0" value={formData.montantActuel} onChange={(e) => setFormData({ ...formData, montantActuel: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={inputStyleDynamic} /></div>
              </div>

              <div><label className="text-xs font-medium mb-1 block" style={textPrimary}>Date d&apos;échéance (optionnel)</label><input type="date" value={formData.dateEcheance} onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={inputStyleDynamic} /></div>

              <div><label className="text-xs font-medium mb-1 block" style={textPrimary}>Type d&apos;objectif</label>
                <div className="grid grid-cols-2 gap-2">{(['court', 'long'] as const).map((t) => (<button key={t} onClick={() => setFormData({ ...formData, type: t })} className="py-2 rounded-xl text-xs font-medium border" style={formData.type === t ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } : { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}>{t === 'court' ? '🎯 Court terme' : '🏔️ Long terme'}</button>))}</div>
              </div>

              <div><label className="text-xs font-medium mb-1 block" style={textPrimary}>Priorité</label>
                <div className="grid grid-cols-3 gap-2">{(['haute', 'moyenne', 'basse'] as const).map((p) => (<button key={p} onClick={() => setFormData({ ...formData, priorite: p })} className="py-2 rounded-xl text-xs font-medium border" style={formData.priorite === p ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } : { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}>{p === 'haute' ? '🔴 Haute' : p === 'moyenne' ? '🟠 Moyenne' : '🟢 Basse'}</button>))}</div>
              </div>

              <div><label className="text-xs font-medium mb-1 block" style={textPrimary}>Couleur</label>
                <div className="grid grid-cols-4 gap-2">{couleursDisponibles.map((couleur) => (<button key={couleur.id} onClick={() => setFormData({ ...formData, couleur: couleur.id })} className={`h-10 rounded-xl border-2 ${formData.couleur === couleur.id ? 'ring-2' : ''} ${couleur.border}`} style={formData.couleur === couleur.id ? { borderColor: theme.colors.primary, boxShadow: `0 0 0 2px ${theme.colors.primary}` } : {}}><div className={`w-full h-full rounded-lg ${couleur.bg}`} /></button>))}</div>
              </div>

              <div><label className="text-xs font-medium mb-1 block" style={textPrimary}>Icône</label>
                <div className="grid grid-cols-6 gap-2">{iconesDisponibles.map((icone) => { const IconComp = icone.icon; return (<button key={icone.id} onClick={() => setFormData({ ...formData, icone: icone.id })} className="h-10 rounded-xl flex items-center justify-center border" style={formData.icone === icone.id ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } : { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}><IconComp className="w-5 h-5" /></button>); })}</div>
              </div>

              <div className="p-3 rounded-xl border" style={formData.recurrenceActif ? { borderColor: theme.colors.primary, background: `${theme.colors.primary}10` } : { borderColor: theme.colors.cardBorder, background: theme.colors.cardBackgroundLight }}>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium flex items-center gap-2" style={textPrimary}><RefreshCw className="w-4 h-4" />Versement récurrent</label>
                  <button onClick={() => setFormData({ ...formData, recurrenceActif: !formData.recurrenceActif })} className={`w-12 h-6 rounded-full transition-colors ${formData.recurrenceActif ? 'bg-green-500' : ''}`} style={!formData.recurrenceActif ? { background: theme.colors.cardBackgroundLight } : {}}><div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.recurrenceActif ? 'translate-x-6' : 'translate-x-0.5'}`} /></button>
                </div>
                {formData.recurrenceActif && (
                  <div className="space-y-3">
                    <div><label className="text-[10px] block mb-1" style={textSecondary}>Fréquence</label>
                      <div className="grid grid-cols-3 gap-2">{(['mensuel', 'bimensuel', 'hebdomadaire'] as const).map((f) => (<button key={f} onClick={() => setFormData({ ...formData, recurrenceFrequence: f, recurrenceJour: '1' })} className="py-1.5 rounded-lg text-[10px] font-medium border" style={formData.recurrenceFrequence === f ? { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.textOnPrimary } : { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}>{f === 'mensuel' ? 'Mensuel' : f === 'bimensuel' ? '2x/mois' : 'Hebdo'}</button>))}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] block mb-1" style={textSecondary}>Montant ({parametres.devise})</label><input type="number" placeholder="0" value={formData.recurrenceMontant} onChange={(e) => setFormData({ ...formData, recurrenceMontant: e.target.value })} className="w-full rounded-xl px-3 py-2 text-xs border focus:outline-none" style={inputStyleDynamic} /></div>
                      <div><label className="text-[10px] block mb-1" style={textSecondary}>{formData.recurrenceFrequence === 'hebdomadaire' ? 'Jour semaine' : 'Jour du mois'}</label><select value={formData.recurrenceJour} onChange={(e) => setFormData({ ...formData, recurrenceJour: e.target.value })} className="w-full rounded-xl px-3 py-2 text-xs border focus:outline-none" style={inputStyleDynamic}>{formData.recurrenceFrequence === 'hebdomadaire' ? joursSemaine.map((jour, i) => (<option key={i} value={i}>{jour}</option>)) : Array.from({ length: 31 }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}</select></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 py-3 border rounded-xl font-medium" style={{ borderColor: theme.colors.primary, color: theme.colors.textPrimary }}>Annuler</button>
                <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Check className="w-5 h-5" />{editingId ? 'Modifier' : 'Créer'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVersementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="rounded-2xl p-4 w-full max-w-sm border mt-20" style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium" style={textPrimary}>Ajouter un versement</h2>
              <button onClick={() => setShowVersementModal(false)} className="p-1"><X className="w-5 h-5" style={textPrimary} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-medium mb-1 block" style={textPrimary}>Montant ({parametres.devise})</label><input type="number" placeholder="0" value={versementMontant} onChange={(e) => setVersementMontant(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={inputStyleDynamic} autoFocus /></div>
              <div className="flex gap-3">
                <button onClick={() => setShowVersementModal(false)} className="flex-1 py-3 border rounded-xl font-medium" style={{ borderColor: theme.colors.primary, color: theme.colors.textPrimary }}>Annuler</button>
                <button onClick={handleVersement} className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Plus className="w-5 h-5" />Ajouter</button>
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
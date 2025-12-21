"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';
import { Confetti } from '@/components/ui';
import {
  PageHeader,
  StatsCards,
  GlobalProgress,
  FilterTabs,
  ObjectifCard,
  EmptyState,
  AddButton,
  ObjectifFormModal,
  VersementModal,
  SkeletonObjectifs
} from './components';

// Types
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

interface FormData {
  nom: string;
  montantCible: string;
  montantActuel: string;
  couleur: string;
  icone: string;
  dateEcheance: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  type: 'court' | 'long';
  recurrenceActif: boolean;
  recurrenceFrequence: 'mensuel' | 'bimensuel' | 'hebdomadaire';
  recurrenceMontant: string;
  recurrenceJour: string;
}

// Constantes
const defaultParametres: ParametresData = { devise: '€' };

const defaultFormData: FormData = {
  nom: '', montantCible: '', montantActuel: '', couleur: 'rose-pale', icone: 'palmtree', 
  dateEcheance: '', priorite: 'moyenne', type: 'court',
  recurrenceActif: false, recurrenceFrequence: 'mensuel', recurrenceMontant: '', recurrenceJour: '1'
};

const couleursDisponibles = [
  { id: 'rose-pale', nom: 'Rose pâle', light: { bg: '#F8E8E8', border: '#E8B4B8', text: '#8B4557', progress: '#E8B4B8' }, dark: { bg: '#3D2A2E', border: '#8B4557', text: '#E8B4B8', progress: '#8B4557' } },
  { id: 'rose-poudre', nom: 'Rose poudré', light: { bg: '#F5D5D5', border: '#D4A5A5', text: '#7A3E4D', progress: '#D4A5A5' }, dark: { bg: '#3A2830', border: '#7A3E4D', text: '#D4A5A5', progress: '#7A3E4D' } },
  { id: 'bordeaux-clair', nom: 'Bordeaux clair', light: { bg: '#E8D0D5', border: '#C4848F', text: '#722F37', progress: '#C4848F' }, dark: { bg: '#35252A', border: '#722F37', text: '#C4848F', progress: '#722F37' } },
  { id: 'mauve-rose', nom: 'Mauve rosé', light: { bg: '#E8D8E8', border: '#C9A5C9', text: '#6B4570', progress: '#C9A5C9' }, dark: { bg: '#2E2535', border: '#6B4570', text: '#C9A5C9', progress: '#6B4570' } },
  { id: 'corail-doux', nom: 'Corail doux', light: { bg: '#F8E0D8', border: '#E8A090', text: '#8B5040', progress: '#E8A090' }, dark: { bg: '#3A2A25', border: '#8B5040', text: '#E8A090', progress: '#8B5040' } },
  { id: 'prune-pastel', nom: 'Prune pastel', light: { bg: '#E0D0E0', border: '#A888A8', text: '#5C4060', progress: '#A888A8' }, dark: { bg: '#2A2530', border: '#5C4060', text: '#A888A8', progress: '#5C4060' } },
  { id: 'vieux-rose', nom: 'Vieux rose', light: { bg: '#E8D0D0', border: '#B89090', text: '#6B4545', progress: '#B89090' }, dark: { bg: '#322828', border: '#6B4545', text: '#B89090', progress: '#6B4545' } },
  { id: 'framboise-pastel', nom: 'Framboise', light: { bg: '#F0D8E0', border: '#D898A8', text: '#7A4055', progress: '#D898A8' }, dark: { bg: '#352530', border: '#7A4055', text: '#D898A8', progress: '#7A4055' } },
];

function ObjectifsContent() {
  const { theme } = useTheme();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [activeFilter, setActiveFilter] = useState<'tous' | 'court' | 'long'>('tous');
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  
  // Versement state
  const [showVersementModal, setShowVersementModal] = useState(false);
  const [selectedObjectifId, setSelectedObjectifId] = useState<number | null>(null);
  const [versementMontant, setVersementMontant] = useState('');
  
  // Toast & Confetti state
  const [showConfetti, setShowConfetti] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Load data
  useEffect(() => {
    const savedObjectifs = localStorage.getItem('budget-objectifs');
    if (savedObjectifs) {
      const parsed = JSON.parse(savedObjectifs);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const migrated = parsed.map((o: any) => ({ 
        ...o, 
        type: o.type || 'court', 
        recurrence: o.recurrence || undefined 
      }));
      setObjectifs(migrated);
    }
    
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) {
      setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
    }
    
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // Process recurrences on load
  useEffect(() => {
    if (objectifs.length > 0 && !isLoading) {
      processRecurrences();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Save objectifs helper
  const saveObjectifs = useCallback((newObjectifs: Objectif[]) => {
    setObjectifs(newObjectifs);
    localStorage.setItem('budget-objectifs', JSON.stringify(newObjectifs));
  }, []);

  // Process recurrences
  const processRecurrences = useCallback(() => {
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
        if (today.getDate() === jourCible) {
          if (!lastExec || lastExec.getMonth() !== today.getMonth() || lastExec.getFullYear() !== today.getFullYear()) {
            shouldExecute = true;
          }
        }
        if (rec.frequence === 'bimensuel' && today.getDate() === 15) {
          if (!lastExec || (lastExec.getDate() !== 15 && lastExec.getMonth() === today.getMonth())) {
            shouldExecute = true;
          }
        }
      } else if (rec.frequence === 'hebdomadaire') {
        const jourCible = rec.jourSemaine || 1;
        if (today.getDay() === jourCible) {
          if (!lastExec || (today.getTime() - lastExec.getTime()) >= 6 * 24 * 60 * 60 * 1000) {
            shouldExecute = true;
          }
        }
      }
      
      if (shouldExecute) {
        hasChanges = true;
        const transactions = JSON.parse(localStorage.getItem('budget-transactions') || '[]');
        transactions.push({
          id: Date.now() + Math.random(),
          date: todayStr,
          montant: rec.montant.toString(),
          type: 'Épargnes',
          categorie: obj.nom,
          memo: `Versement automatique - ${obj.nom}`
        });
        localStorage.setItem('budget-transactions', JSON.stringify(transactions));
        
        return {
          ...obj,
          montantActuel: obj.montantActuel + rec.montant,
          recurrence: { ...rec, derniereExecution: todayStr }
        };
      }
      return obj;
    });
    
    if (hasChanges) {
      saveObjectifs(updatedObjectifs);
      setToastMessage('🔄 Versements récurrents effectués !');
      setShowToast(true);
    }
  }, [objectifs, saveObjectifs]);

  // Memoized calculations
  const filteredObjectifs = useMemo(() => 
    objectifs.filter(o => activeFilter === 'tous' ? true : o.type === activeFilter),
    [objectifs, activeFilter]
  );

  const stats = useMemo(() => ({
    totalObjectifs: objectifs.reduce((sum, o) => sum + o.montantCible, 0),
    totalEpargne: objectifs.reduce((sum, o) => sum + o.montantActuel, 0),
    objectifsCourtTerme: objectifs.filter(o => o.type === 'court').length,
    objectifsLongTerme: objectifs.filter(o => o.type === 'long').length,
    objectifsAvecRecurrence: objectifs.filter(o => o.recurrence?.actif).length,
  }), [objectifs]);

  const progressionGlobale = useMemo(() => 
    stats.totalObjectifs > 0 ? (stats.totalEpargne / stats.totalObjectifs) * 100 : 0,
    [stats.totalObjectifs, stats.totalEpargne]
  );

  const filterCounts = useMemo(() => ({
    tous: objectifs.length,
    court: stats.objectifsCourtTerme,
    long: stats.objectifsLongTerme,
  }), [objectifs.length, stats.objectifsCourtTerme, stats.objectifsLongTerme]);

  // Handlers
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
  }, []);

  const handleOpenAddForm = useCallback(() => {
    resetForm();
    setEditingId(null);
    setShowForm(true);
  }, [resetForm]);

  const handleFormChange = useCallback((data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!formData.nom || !formData.montantCible) return;
    
    const recurrence = formData.recurrenceActif ? {
      actif: true,
      frequence: formData.recurrenceFrequence,
      montant: parseFloat(formData.recurrenceMontant) || 0,
      jourDuMois: formData.recurrenceFrequence !== 'hebdomadaire' ? parseInt(formData.recurrenceJour) : undefined,
      jourSemaine: formData.recurrenceFrequence === 'hebdomadaire' ? parseInt(formData.recurrenceJour) : undefined,
      derniereExecution: undefined
    } : undefined;
    
    if (editingId !== null) {
      const updated = objectifs.map(o => o.id === editingId ? {
        ...o,
        nom: formData.nom,
        montantCible: parseFloat(formData.montantCible),
        montantActuel: parseFloat(formData.montantActuel || '0'),
        couleur: formData.couleur,
        icone: formData.icone,
        dateEcheance: formData.dateEcheance || undefined,
        priorite: formData.priorite,
        type: formData.type,
        recurrence
      } : o);
      saveObjectifs(updated);
      setToastMessage('✅ Objectif modifié avec succès !');
    } else {
      const newObjectif: Objectif = {
        id: Date.now(),
        nom: formData.nom,
        montantCible: parseFloat(formData.montantCible),
        montantActuel: parseFloat(formData.montantActuel || '0'),
        couleur: formData.couleur,
        icone: formData.icone,
        dateEcheance: formData.dateEcheance || undefined,
        priorite: formData.priorite,
        type: formData.type,
        recurrence
      };
      saveObjectifs([...objectifs, newObjectif]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setToastMessage('🎉 Nouvel objectif créé !');
    }
    
    setShowToast(true);
    resetForm();
    setEditingId(null);
    setShowForm(false);
  }, [formData, editingId, objectifs, saveObjectifs, resetForm]);

  const handleEdit = useCallback((objectif: Objectif) => {
    setFormData({
      nom: objectif.nom,
      montantCible: objectif.montantCible.toString(),
      montantActuel: objectif.montantActuel.toString(),
      couleur: objectif.couleur,
      icone: objectif.icone,
      dateEcheance: objectif.dateEcheance || '',
      priorite: objectif.priorite,
      type: objectif.type || 'court',
      recurrenceActif: objectif.recurrence?.actif || false,
      recurrenceFrequence: objectif.recurrence?.frequence || 'mensuel',
      recurrenceMontant: objectif.recurrence?.montant?.toString() || '',
      recurrenceJour: (objectif.recurrence?.jourDuMois || objectif.recurrence?.jourSemaine || 1).toString()
    });
    setEditingId(objectif.id);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id: number) => {
    saveObjectifs(objectifs.filter(o => o.id !== id));
    setToastMessage('🗑️ Objectif supprimé');
    setShowToast(true);
  }, [objectifs, saveObjectifs]);

  const handleOpenVersement = useCallback((id: number) => {
    setSelectedObjectifId(id);
    setVersementMontant('');
    setShowVersementModal(true);
  }, []);

  const handleVersement = useCallback(() => {
    if (!versementMontant || !selectedObjectifId) return;
    
    const montant = parseFloat(versementMontant);
    const objectif = objectifs.find(o => o.id === selectedObjectifId);
    
    if (objectif) {
      const newMontantActuel = objectif.montantActuel + montant;
      const wasNotComplete = objectif.montantActuel < objectif.montantCible;
      const isNowComplete = newMontantActuel >= objectif.montantCible;
      
      const updated = objectifs.map(o => 
        o.id === selectedObjectifId ? { ...o, montantActuel: newMontantActuel } : o
      );
      saveObjectifs(updated);
      
      // Transaction
      const transactions = JSON.parse(localStorage.getItem('budget-transactions') || '[]');
      transactions.push({
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        montant: montant.toString(),
        type: 'Épargnes',
        categorie: objectif.nom,
        memo: `Versement manuel - ${objectif.nom}`
      });
      localStorage.setItem('budget-transactions', JSON.stringify(transactions));
      
      // Confetti si objectif atteint
      if (wasNotComplete && isNowComplete) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setToastMessage('🎉 Objectif atteint ! Félicitations !');
      } else {
        setToastMessage(`✅ +${montant}${parametres.devise} ajouté à "${objectif.nom}"`);
      }
      setShowToast(true);
    }
    
    setVersementMontant('');
    setShowVersementModal(false);
    setSelectedObjectifId(null);
  }, [versementMontant, selectedObjectifId, objectifs, saveObjectifs, parametres.devise]);

  const handleToggleRecurrence = useCallback((id: number) => {
    const updated = objectifs.map(o => {
      if (o.id === id && o.recurrence) {
        return { ...o, recurrence: { ...o.recurrence, actif: !o.recurrence.actif } };
      }
      return o;
    });
    saveObjectifs(updated);
    
    const obj = objectifs.find(o => o.id === id);
    if (obj?.recurrence) {
      setToastMessage(obj.recurrence.actif ? '⏸️ Récurrence désactivée' : '▶️ Récurrence activée');
      setShowToast(true);
    }
  }, [objectifs, saveObjectifs]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
  }, []);

  // Loading state
  if (isLoading) {
    return <SkeletonObjectifs />;
  }

  return (
    <>
      {/* Confettis */}
      <Confetti trigger={showConfetti} />
      
      {/* Toast */}
      {showToast && (
        <div 
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl animate-fadeIn backdrop-blur-md"
          style={{ 
            background: toastMessage.includes('🎉') || toastMessage.includes('✅')
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95))' 
              : toastMessage.includes('🗑️')
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95))',
            color: '#FFFFFF',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}
      
      <div className="pb-4">
        {/* Header */}
        <PageHeader />

        {/* Stats Cards */}
        <StatsCards
          totalObjectifs={stats.totalObjectifs}
          totalEpargne={stats.totalEpargne}
          progressionGlobale={progressionGlobale}
          devise={parametres.devise}
        />

        {/* Global Progress */}
        {objectifs.length > 0 && (
          <GlobalProgress
            progressionGlobale={progressionGlobale}
            objectifsCourtTerme={stats.objectifsCourtTerme}
            objectifsLongTerme={stats.objectifsLongTerme}
            objectifsAvecRecurrence={stats.objectifsAvecRecurrence}
          />
        )}

        {/* Filter Tabs */}
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={filterCounts}
        />

        {/* Add Button */}
        <AddButton onClick={handleOpenAddForm} />

        {/* Objectifs List */}
        {filteredObjectifs.length > 0 ? (
          <div className="space-y-3 mb-4">
            {filteredObjectifs.map((objectif, index) => (
              <ObjectifCard
                key={objectif.id}
                objectif={objectif}
                devise={parametres.devise}
                index={index}
                couleursDisponibles={couleursDisponibles}
                onVersement={handleOpenVersement}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleRecurrence={handleToggleRecurrence}
              />
            ))}
          </div>
        ) : (
          <EmptyState activeFilter={activeFilter} />
        )}

        {/* SmartTips */}
        <SmartTips page="objectifs" />
      </div>

      {/* Form Modal */}
      <ObjectifFormModal
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        formData={formData}
        onFormChange={handleFormChange}
        isEditing={editingId !== null}
        devise={parametres.devise}
        couleursDisponibles={couleursDisponibles}
      />

      {/* Versement Modal */}
      <VersementModal
        isOpen={showVersementModal}
        onClose={() => setShowVersementModal(false)}
        onSubmit={handleVersement}
        montant={versementMontant}
        onMontantChange={setVersementMontant}
        devise={parametres.devise}
      />
    </>
  );
}

export default function ObjectifsPage() {
  const router = useRouter();

  const handleNavigate = useCallback((page: string) => {
    if (page === 'accueil') router.push('/');
    else router.push(`/${page}`);
  }, [router]);

  return (
    <AppShell currentPage="objectifs" onNavigate={handleNavigate}>
      <ObjectifsContent />
    </AppShell>
  );
}
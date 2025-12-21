"use client";

import { Plus, Edit3, Trash2, Palmtree, Car, Home, Wallet, Gift, Smartphone, GraduationCap, PartyPopper, Gem, Baby, Heart, ShoppingBasket } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

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

interface CouleurOption {
  id: string;
  light: { bg: string; border: string; text: string; progress: string };
  dark: { bg: string; border: string; text: string; progress: string };
}

interface ObjectifCardProps {
  objectif: Objectif;
  devise: string;
  index: number;
  couleursDisponibles: CouleurOption[];
  onVersement: (id: number) => void;
  onEdit: (objectif: Objectif) => void;
  onDelete: (id: number) => void;
  onToggleRecurrence: (id: number) => void;
  onObjectifComplete?: () => void;
}

const iconesMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  palmtree: Palmtree, car: Car, home: Home, wallet: Wallet, gift: Gift, smartphone: Smartphone,
  graduation: GraduationCap, party: PartyPopper, gem: Gem, baby: Baby, heart: Heart, shopping: ShoppingBasket,
};

const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function ObjectifCard({
  objectif,
  devise,
  index,
  couleursDisponibles,
  onVersement,
  onEdit,
  onDelete,
  onToggleRecurrence,
}: ObjectifCardProps) {
  const { theme, isDarkMode } = useTheme();

  // Obtenir les couleurs selon le mode
  const getCouleur = (couleurId: string) => {
    const couleur = couleursDisponibles.find(c => c.id === couleurId) || couleursDisponibles[0];
    return isDarkMode ? couleur.dark : couleur.light;
  };

  const couleur = getCouleur(objectif.couleur);
  const IconComponent = iconesMap[objectif.icone] || Palmtree;
  
  const reste = objectif.montantCible - objectif.montantActuel;
  const pourcentage = objectif.montantCible > 0 ? (objectif.montantActuel / objectif.montantCible) * 100 : 0;
  const isComplete = pourcentage >= 100;
  const isAlmostComplete = pourcentage >= 80 && pourcentage < 100;

  // Calculs
  const getMoisRestants = (dateEcheance: string) => {
    if (!dateEcheance) return null;
    const now = new Date();
    const echeance = new Date(dateEcheance);
    return Math.max(0, (echeance.getFullYear() - now.getFullYear()) * 12 + (echeance.getMonth() - now.getMonth()));
  };

  const getSuggestionMensuelle = () => {
    const moisRestants = getMoisRestants(objectif.dateEcheance || '');
    if (!moisRestants || moisRestants === 0) return null;
    const resteAEpargner = objectif.montantCible - objectif.montantActuel;
    if (resteAEpargner <= 0) return null;
    return Math.ceil(resteAEpargner / moisRestants);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const getRecurrenceLabel = (rec: Objectif['recurrence']) => {
    if (!rec) return '';
    if (rec.frequence === 'mensuel') return `${rec.montant}${devise}/mois le ${rec.jourDuMois}`;
    if (rec.frequence === 'bimensuel') return `${rec.montant}${devise} 2x/mois`;
    if (rec.frequence === 'hebdomadaire') return `${rec.montant}${devise}/sem. (${joursSemaine[rec.jourSemaine || 0]})`;
    return '';
  };

  const moisRestants = getMoisRestants(objectif.dateEcheance || '');
  const suggestion = getSuggestionMensuelle();

  return (
    <div 
      className="rounded-2xl p-4 shadow-sm border transition-all duration-300 hover:shadow-lg hover:scale-[1.01] animate-fadeIn"
      style={{ 
        backgroundColor: couleur.bg, 
        borderColor: couleur.border,
        animationDelay: `${300 + index * 100}ms`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-300 hover:scale-110"
            style={{ backgroundColor: couleur.bg, borderColor: couleur.border }}
          >
            <IconComponent className="w-5 h-5" style={{ color: couleur.text }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: couleur.text }}>{objectif.nom}</p>
            <div className="flex items-center gap-1 flex-wrap">
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                objectif.priorite === 'haute' ? 'bg-red-200 text-red-700' : 
                objectif.priorite === 'moyenne' ? 'bg-orange-200 text-orange-700' : 
                'bg-green-200 text-green-700'
              }`}>
                {objectif.priorite === 'haute' ? '🔴 Haute' : objectif.priorite === 'moyenne' ? '🟠 Moyenne' : '🟢 Basse'}
              </span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                objectif.type === 'court' ? 'bg-blue-200 text-blue-700' : 'bg-purple-200 text-purple-700'
              }`}>
                {objectif.type === 'court' ? '🎯 Court' : '🏔️ Long'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onVersement(objectif.id)} 
            className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 hover:opacity-80"
          >
            <Plus className="w-4 h-4" style={{ color: couleur.text }} />
          </button>
          <button 
            onClick={() => onEdit(objectif)} 
            className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 hover:opacity-80"
          >
            <Edit3 className="w-4 h-4" style={{ color: couleur.text }} />
          </button>
          <button 
            onClick={() => onDelete(objectif.id)} 
            className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 hover:opacity-80"
          >
            <Trash2 className="w-4 h-4" style={{ color: couleur.text }} />
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div 
        className="h-3 rounded-full overflow-hidden mb-2"
        style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)' }}
      >
        <div 
          className="h-full transition-all duration-700 ease-out" 
          style={{ 
            width: `${Math.min(pourcentage, 100)}%`,
            backgroundColor: isComplete ? '#22c55e' : couleur.progress 
          }} 
        />
      </div>
      
      {/* Stats */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] opacity-60" style={{ color: couleur.text }}>Objectif</p>
            <p className="text-xs font-medium tabular-nums" style={{ color: couleur.text }}>
              {objectif.montantCible.toFixed(0)}{devise}
            </p>
          </div>
          <div>
            <p className="text-[10px] opacity-60" style={{ color: couleur.text }}>Épargné</p>
            <p className="text-xs font-medium tabular-nums" style={{ color: couleur.text }}>
              {objectif.montantActuel.toFixed(0)}{devise}
            </p>
          </div>
          <div>
            <p className="text-[10px] opacity-60" style={{ color: couleur.text }}>Reste</p>
            <p className="text-xs font-medium tabular-nums" style={{ color: reste > 0 ? couleur.text : '#22c55e' }}>
              {reste > 0 ? reste.toFixed(0) + devise : '✔'}
            </p>
          </div>
        </div>
        
        {/* Badge pourcentage */}
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
      
      {/* Footer infos */}
      <div className="pt-2 border-t border-opacity-30 space-y-1" style={{ borderColor: couleur.border }}>
        {objectif.dateEcheance && (
          <p className="text-[10px] opacity-70" style={{ color: couleur.text }}>
            📅 Échéance : {formatDate(objectif.dateEcheance)} ({moisRestants} mois)
          </p>
        )}
        {suggestion && !isComplete && (
          <p className="text-[10px] opacity-70" style={{ color: couleur.text }}>
            💡 Épargnez {suggestion}{devise}/mois pour atteindre votre objectif
          </p>
        )}
        {objectif.recurrence && (
          <div className="flex items-center justify-between">
            <p className="text-[10px] opacity-70" style={{ color: couleur.text }}>
              🔄 Récurrence : {getRecurrenceLabel(objectif.recurrence)}
            </p>
            <button 
              onClick={() => onToggleRecurrence(objectif.id)} 
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
}
// Constantes pour la page Enveloppes

import { 
  ShoppingCart, Utensils, Fuel, ShoppingBag, Film, Heart, Gift, Plane, 
  Coffee, Smartphone, Car, Zap, Home, Briefcase, GraduationCap, Baby, 
  PawPrint, Dumbbell, Music, Gamepad2, Book, Scissors, Wrench, Wifi,
  AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import { CouleurOption, IconeOption, ParametresData, AlertLevel } from './types';

export const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
export const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
export const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

export const defaultParametres: ParametresData = {
  devise: '€',
  categoriesDepenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Loisirs', 'Santé', 'Cadeaux', 'Autres'],
  categoriesRevenus: ['Salaire', 'Revenus Secondaires', 'Allocations', 'Aides', 'Remboursement', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Assurances', 'Internet', 'Mobile', 'Abonnements', 'Crédits', 'Impôts'],
  categoriesEpargnes: ['Livret A', 'Épargne', 'Tirelire', 'Vacances', 'Projets'],
  comptesBancaires: [{ id: 1, nom: 'Compte Principal' }, { id: 2, nom: 'Livret A' }]
};

export const couleursDisponibles: CouleurOption[] = [
  { id: 'pastel-green', nom: 'Vert', bg: 'bg-green-200 dark:bg-green-900', border: 'border-green-400 dark:border-green-700', text: 'text-green-700 dark:text-green-300', progress: 'bg-green-400 dark:bg-green-500', hex: '#4ade80' },
  { id: 'pastel-blue', nom: 'Bleu', bg: 'bg-blue-200 dark:bg-blue-900', border: 'border-blue-400 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-300', progress: 'bg-blue-400 dark:bg-blue-500', hex: '#60a5fa' },
  { id: 'pastel-pink', nom: 'Rose', bg: 'bg-pink-200 dark:bg-pink-900', border: 'border-pink-400 dark:border-pink-700', text: 'text-pink-700 dark:text-pink-300', progress: 'bg-pink-400 dark:bg-pink-500', hex: '#f472b6' },
  { id: 'pastel-purple', nom: 'Violet', bg: 'bg-purple-200 dark:bg-purple-900', border: 'border-purple-400 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-300', progress: 'bg-purple-400 dark:bg-purple-500', hex: '#a78bfa' },
  { id: 'pastel-orange', nom: 'Orange', bg: 'bg-orange-200 dark:bg-orange-900', border: 'border-orange-400 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-300', progress: 'bg-orange-400 dark:bg-orange-500', hex: '#fb923c' },
  { id: 'pastel-yellow', nom: 'Jaune', bg: 'bg-yellow-200 dark:bg-yellow-900', border: 'border-yellow-400 dark:border-yellow-700', text: 'text-yellow-700 dark:text-yellow-300', progress: 'bg-yellow-400 dark:bg-yellow-500', hex: '#facc15' },
  { id: 'pastel-teal', nom: 'Turquoise', bg: 'bg-teal-200 dark:bg-teal-900', border: 'border-teal-400 dark:border-teal-700', text: 'text-teal-700 dark:text-teal-300', progress: 'bg-teal-400 dark:bg-teal-500', hex: '#2dd4bf' },
  { id: 'pastel-red', nom: 'Rouge', bg: 'bg-red-200 dark:bg-red-900', border: 'border-red-400 dark:border-red-700', text: 'text-red-700 dark:text-red-300', progress: 'bg-red-400 dark:bg-red-500', hex: '#f87171' },
  { id: 'pastel-indigo', nom: 'Indigo', bg: 'bg-indigo-200 dark:bg-indigo-900', border: 'border-indigo-400 dark:border-indigo-700', text: 'text-indigo-700 dark:text-indigo-300', progress: 'bg-indigo-400 dark:bg-indigo-500', hex: '#818cf8' },
  { id: 'pastel-cyan', nom: 'Cyan', bg: 'bg-cyan-200 dark:bg-cyan-900', border: 'border-cyan-400 dark:border-cyan-700', text: 'text-cyan-700 dark:text-cyan-300', progress: 'bg-cyan-400 dark:bg-cyan-500', hex: '#22d3ee' },
  { id: 'pastel-lime', nom: 'Lime', bg: 'bg-lime-200 dark:bg-lime-900', border: 'border-lime-400 dark:border-lime-700', text: 'text-lime-700 dark:text-lime-300', progress: 'bg-lime-400 dark:bg-lime-500', hex: '#a3e635' },
  { id: 'pastel-amber', nom: 'Ambre', bg: 'bg-amber-200 dark:bg-amber-900', border: 'border-amber-400 dark:border-amber-700', text: 'text-amber-700 dark:text-amber-300', progress: 'bg-amber-400 dark:bg-amber-500', hex: '#fbbf24' },
];

export const iconesDisponibles: IconeOption[] = [
  { id: 'shopping-cart', nom: 'Courses', icon: ShoppingCart },
  { id: 'utensils', nom: 'Restaurant', icon: Utensils },
  { id: 'fuel', nom: 'Essence', icon: Fuel },
  { id: 'shopping-bag', nom: 'Shopping', icon: ShoppingBag },
  { id: 'film', nom: 'Loisirs', icon: Film },
  { id: 'heart', nom: 'Santé', icon: Heart },
  { id: 'gift', nom: 'Cadeaux', icon: Gift },
  { id: 'plane', nom: 'Voyages', icon: Plane },
  { id: 'coffee', nom: 'Café', icon: Coffee },
  { id: 'smartphone', nom: 'Tech', icon: Smartphone },
  { id: 'car', nom: 'Auto', icon: Car },
  { id: 'zap', nom: 'Énergie', icon: Zap },
  { id: 'home', nom: 'Maison', icon: Home },
  { id: 'briefcase', nom: 'Travail', icon: Briefcase },
  { id: 'graduation', nom: 'Études', icon: GraduationCap },
  { id: 'baby', nom: 'Bébé', icon: Baby },
  { id: 'pet', nom: 'Animaux', icon: PawPrint },
  { id: 'fitness', nom: 'Sport', icon: Dumbbell },
  { id: 'music', nom: 'Musique', icon: Music },
  { id: 'gaming', nom: 'Jeux', icon: Gamepad2 },
  { id: 'book', nom: 'Livres', icon: Book },
  { id: 'beauty', nom: 'Beauté', icon: Scissors },
  { id: 'repair', nom: 'Réparations', icon: Wrench },
  { id: 'internet', nom: 'Internet', icon: Wifi },
];

export const getCouleur = (couleurId: string): CouleurOption => 
  couleursDisponibles.find(c => c.id === couleurId) || couleursDisponibles[0];

export const getIcone = (iconeId: string): IconeOption => 
  iconesDisponibles.find(i => i.id === iconeId) || iconesDisponibles[0];

export const getAlertLevel = (pourcentage: number): AlertLevel => {
  if (pourcentage >= 100) return { level: 'danger', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500' };
  if (pourcentage >= 80) return { level: 'warning', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500' };
  if (pourcentage >= 50) return { level: 'info', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500' };
  return { level: 'success', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500' };
};

// Animations CSS
export const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes envelopePulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }
  @keyframes envelopeGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(var(--glow-color), 0.3); }
    50% { box-shadow: 0 0 35px rgba(var(--glow-color), 0.5); }
  }
  @keyframes envelopeFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.4s ease-out forwards;
    opacity: 0;
  }
  .skeleton-shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .envelope-pulse { animation: envelopePulse 2s ease-in-out infinite; }
  .envelope-glow { animation: envelopeGlow 2s ease-in-out infinite; }
  .envelope-float { animation: envelopeFloat 3s ease-in-out infinite; }
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.1s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.2s; }
  .stagger-5 { animation-delay: 0.25s; }
  .stagger-6 { animation-delay: 0.3s; }
  .stagger-7 { animation-delay: 0.35s; }
  .stagger-8 { animation-delay: 0.4s; }
`;
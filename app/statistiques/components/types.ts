// Types
export interface Transaction {
  id: string;
  type: 'Revenu' | 'Facture' | 'Dépense' | 'Épargne';
  categorie: string;
  montant: string;
  date?: string;
  description?: string;
  depuis?: string;
  vers?: string;
  moyenPaiement?: string;
}

export interface ObjectifBudget {
  id: string;
  categorie: string;
  type: 'Dépense' | 'Facture' | 'Épargne';
  montant: number;
}

export type TabType = 'resume' | 'revenus' | 'factures' | 'depenses' | 'epargnes' | 'evolution' | 'calendrier' | 'flux' | 'objectifs';

export interface TotalsData {
  revenus: number;
  factures: number;
  depenses: number;
  epargnes: number;
  solde: number;
  // Alias pour compatibilité
  totalRevenus?: number;
  totalFactures?: number;
  totalDepenses?: number;
  totalEpargnes?: number;
  prevRevenus?: number;
  prevFactures?: number;
  prevDepenses?: number;
  prevEpargnes?: number;
}

export interface MoyennesData {
  revenus: number;
  factures: number;
  depenses: number;
  epargnes: number;
}

export interface EvolutionDataItem {
  name: string;
  revenus: number;
  factures: number;
  depenses: number;
  epargnes: number;
  solde: number;
}

export interface CategoryData {
  name: string;
  value: number;
  count: number;
}

// Constantes
export const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
export const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
export const years = Array.from({ length: 76 }, (_, i) => 2025 + i);
export const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const COLORS = ['#D4AF37', '#8B4557', '#7DD3A8', '#5C9EAD', '#E8A87C', '#C38D9E', '#41B3A3', '#E27D60', '#85DCB8', '#E8A87C'];

export const COLORS_TYPE = {
  revenus: '#4CAF50',
  factures: '#F44336',
  depenses: '#FF9800',
  epargnes: '#2196F3'
};

// Animations CSS
export const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.4s ease-out forwards;
    opacity: 0;
  }
  
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.1s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.2s; }
  .stagger-5 { animation-delay: 0.25s; }
  .stagger-6 { animation-delay: 0.3s; }
  .stagger-7 { animation-delay: 0.35s; }
  .stagger-8 { animation-delay: 0.4s; }
`;
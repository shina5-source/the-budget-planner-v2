// Types pour la page Enveloppes

export interface Enveloppe {
  id: number;
  nom: string;
  budget: number;
  couleur: string;
  icone: string;
  categories: string[];
  favorite?: boolean;
  locked?: boolean;
  reportReste?: boolean;
  budgetVariable?: { [mois: string]: number };
}

export interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  memo?: string;
}

export interface ParametresData {
  devise: string;
  categoriesDepenses: string[];
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesEpargnes: string[];
  comptesBancaires: { id: number; nom: string }[];
}

export interface EnveloppeFormData {
  nom: string;
  budget: string;
  couleur: string;
  icone: string;
  categories: string[];
  favorite: boolean;
  locked: boolean;
  reportReste: boolean;
  budgetVariable: boolean;
  budgetsMensuels: { [mois: string]: string };
}

export interface CouleurOption {
  id: string;
  nom: string;
  bg: string;
  border: string;
  text: string;
  progress: string;
  hex: string;
}

export interface IconeOption {
  id: string;
  nom: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface HistoriqueItem {
  mois: string;
  depense: number;
  budget: number;
}

export interface AlertLevel {
  level: 'danger' | 'warning' | 'info' | 'success';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}
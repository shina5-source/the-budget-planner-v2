// Types pour la page Paramètres

export interface CompteBancaire {
  id: number;
  nom: string;
  soldeDepart: number;
  isEpargne: boolean;
}

// Configuration d'une paie pour un mois spécifique
export interface PaieMensuelle {
  mois: number; // 0-11 (janvier = 0)
  annee: number;
  jourPaie: number; // Jour du mois où la paie est reçue
  montant?: number; // Montant optionnel pour référence
  estPersonnalise: boolean; // true si modifié manuellement, false si par défaut
}

// Configuration globale des paies
export interface ConfigurationPaie {
  // Option 1 : Date de paie par défaut
  jourPaieDefaut: number; // Ex: 28 = le 28 de chaque mois
  
  // Option 2 : Paies personnalisées par mois
  paiesPersonnalisees: PaieMensuelle[];
  
  // Option 3 : Détection automatique
  detectionAutoActive: boolean;
  montantMinimumDetection: number; // Montant minimum pour détecter un salaire (ex: 500€)
  categoriesDetection: string[]; // Catégories à surveiller (ex: ['Salaire', 'Revenus'])
}

export interface ParametresData {
  dateDepart: string;
  budgetAvantPremier: boolean;
  devise: string;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  categoriesEpargnes: string[];
  comptesBancaires: CompteBancaire[];
  
  // Nouvelle configuration des paies
  configurationPaie: ConfigurationPaie;
}

export interface CompteFormData {
  nom: string;
  soldeDepart: string;
  isEpargne: boolean;
}

export type CategorieType = 'categoriesRevenus' | 'categoriesFactures' | 'categoriesDepenses' | 'categoriesEpargnes';

// Type pour une période de budget calculée
export interface PeriodeBudget {
  debut: Date;
  fin: Date;
  moisReference: number; // Le mois "logique" (0-11)
  anneeReference: number;
  label: string; // Ex: "28 nov - 27 déc 2025"
}
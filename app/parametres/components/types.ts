// Types pour la page Paramètres

export interface CompteBancaire {
  id: number;
  nom: string;
  soldeDepart: number;
  isEpargne: boolean;
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
}

export interface CompteFormData {
  nom: string;
  soldeDepart: string;
  isEpargne: boolean;
}

export type CategorieType = 'categoriesRevenus' | 'categoriesFactures' | 'categoriesDepenses' | 'categoriesEpargnes';
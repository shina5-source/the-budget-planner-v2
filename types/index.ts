export interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  depuis?: string;
  vers?: string;
  memo?: string;
  isCredit?: boolean;
  capitalTotal?: string;
  tauxInteret?: string;
  dureeMois?: string;
  dateDebut?: string;
}

export interface Enveloppe {
  id: number;
  nom: string;
  budget: number;
  couleur: string;
  icone: string;
  categories: string[];
}

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
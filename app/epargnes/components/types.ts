export interface Transaction {
  id?: number;
  type: string;
  categorie: string;
  montant: string;
  date: string;
  compte?: string;
  compteVers?: string;
  moyenPaiement?: string;
  notes?: string;
}

export interface CompteBancaire {
  id: number;
  nom: string;
  soldeDepart: number;
  isEpargne: boolean;
}

export interface ParametresData {
  devise: string;
  comptesBancaires: CompteBancaire[];
}

export type TabType = 'resume' | 'mensuel' | 'analyse' | 'historique';

export interface ThemeColors {
  primary: string;
  cardBackground: string;
  cardBackgroundLight: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
}

export interface EpargneStats {
  totalEpargnesMois: number;
  totalReprisesMois: number;
  netEpargneMois: number;
  tauxEpargne: number;
  totalRevenus: number;
  epargnesParCategorie: Record<string, number>;
  epargnesParCompte: Record<string, number>;
  evolutionAnnuelle: { mois: string; epargne: number; reprise: number; net: number }[];
}
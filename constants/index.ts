import { ParametresData } from '@/types';

export const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

export const defaultParametres: ParametresData = {
  dateDepart: new Date().toISOString().split('T')[0],
  budgetAvantPremier: false,
  devise: '€',
  categoriesRevenus: ['Salaire', 'Revenus Secondaires', 'Allocations', 'Aides', 'Remboursement', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Assurance', 'Internet', 'Mobile', 'Abonnements', 'Crédits', 'Impôts'],
  categoriesDepenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Loisirs', 'Santé', 'Cadeaux', 'Autres'],
  categoriesEpargnes: ['Livret A', 'Épargne', 'Tirelire', 'Vacances', 'Projets'],
  comptesBancaires: [
    { id: 1, nom: 'Compte Principal', soldeDepart: 0, isEpargne: false },
    { id: 2, nom: 'Livret A', soldeDepart: 0, isEpargne: true },
  ]
};
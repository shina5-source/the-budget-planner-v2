'use client';

import { useEffect, useState, useCallback } from 'react';
import { ConfigurationPaie, PeriodeBudget, PaieMensuelle } from '@/app/parametres/components/types';
import { defaultConfigurationPaie, nomsMoisCourts } from '@/app/parametres/components/constants';

// Type pour une transaction (simplifié pour la détection)
interface TransactionDetection {
  id: string;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

/**
 * Hook pour gérer les périodes de budget basées sur la date de paie
 * 
 * LOGIQUE FRANÇAISE :
 * - La paie que tu reçois finance ton budget du mois en cours ou suivant
 * - Si jour de paie ≤ 15 (début de mois) : paie du mois M → budget du mois M
 * - Si jour de paie > 15 (fin de mois) : paie du mois M → budget du mois M+1
 * 
 * DATE DE DÉPART :
 * - Définit la date du premier salaire / début du suivi
 * - Les périodes avant cette date ne sont pas accessibles
 * - Les transactions avant cette date ne sont pas comptées dans les stats
 */
export function useBudgetPeriod() {
  const [configurationPaie, setConfigurationPaie] = useState<ConfigurationPaie>(defaultConfigurationPaie);
  const [isLoaded, setIsLoaded] = useState(false);
  const [budgetAvantPremier, setBudgetAvantPremier] = useState(false);
  const [dateDepart, setDateDepart] = useState<string | null>(null);

  // Charger la configuration depuis localStorage
  useEffect(() => {
    try {
      const savedParametres = localStorage.getItem('budget-parametres');
      if (savedParametres) {
        const parsed = JSON.parse(savedParametres);
        if (parsed.configurationPaie) {
          setConfigurationPaie({ ...defaultConfigurationPaie, ...parsed.configurationPaie });
        }
        if (parsed.budgetAvantPremier !== undefined) {
          setBudgetAvantPremier(parsed.budgetAvantPremier);
        }
        if (parsed.dateDepart) {
          setDateDepart(parsed.dateDepart);
        }
      }
    } catch (error) {
      console.error('Erreur chargement configuration paie:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /**
   * Obtient le jour de paie pour un mois/année donné
   */
  const getJourPaie = useCallback((mois: number, annee: number): number => {
    const paiePerso = configurationPaie.paiesPersonnalisees.find(
      p => p.mois === mois && p.annee === annee
    );
    
    if (paiePerso) {
      return paiePerso.jourPaie;
    }
    
    return configurationPaie.jourPaieDefaut;
  }, [configurationPaie]);

  /**
   * Obtient le jour effectif (gère les mois avec moins de jours)
   */
  const getJourEffectif = useCallback((jour: number, mois: number, annee: number): number => {
    const dernierJourDuMois = new Date(annee, mois + 1, 0).getDate();
    return Math.min(jour, dernierJourDuMois);
  }, []);

  /**
   * Détermine si un jour de paie est en fin de mois (> 15)
   */
  const estPaieFinDeMois = useCallback((jourPaie: number): boolean => {
    return jourPaie > 15;
  }, []);

  /**
   * Calcule la période de budget pour un mois donné
   */
  const getPeriodeBudget = useCallback((mois: number, annee: number): PeriodeBudget => {
    const jourPaieDefaut = configurationPaie.jourPaieDefaut;
    
    // CAS 1: Si le jour de paie est le 1er, comportement classique
    if (jourPaieDefaut === 1) {
      const debut = new Date(annee, mois, 1);
      const fin = new Date(annee, mois + 1, 0);
      
      return {
        debut,
        fin,
        moisReference: mois,
        anneeReference: annee,
        label: `${nomsMoisCourts[mois]} ${annee}`
      };
    }
    
    const paieFinDeMois = estPaieFinDeMois(jourPaieDefaut);
    
    let debut: Date;
    let fin: Date;
    
    if (paieFinDeMois) {
      // PAIE EN FIN DE MOIS (> 15)
      let moisPaie = mois - 1;
      let anneePaie = annee;
      if (moisPaie < 0) {
        moisPaie = 11;
        anneePaie = annee - 1;
      }
      
      const jourPaieMoisPaie = getJourPaie(moisPaie, anneePaie);
      const jourDebutEffectif = getJourEffectif(jourPaieMoisPaie, moisPaie, anneePaie);
      
      debut = new Date(anneePaie, moisPaie, jourDebutEffectif);
      
      const jourPaieMoisCourant = getJourPaie(mois, annee);
      const jourFinEffectif = getJourEffectif(jourPaieMoisCourant, mois, annee);
      
      if (jourFinEffectif <= 1) {
        fin = new Date(annee, mois, 0);
      } else {
        fin = new Date(annee, mois, jourFinEffectif - 1);
      }
      
    } else {
      // PAIE EN DÉBUT DE MOIS (≤ 15)
      const jourPaieMoisCourant = getJourPaie(mois, annee);
      const jourDebutEffectif = getJourEffectif(jourPaieMoisCourant, mois, annee);
      
      debut = new Date(annee, mois, jourDebutEffectif);
      
      let moisSuivant = mois + 1;
      let anneeSuivante = annee;
      if (moisSuivant > 11) {
        moisSuivant = 0;
        anneeSuivante = annee + 1;
      }
      
      const jourPaieMoisSuivant = getJourPaie(moisSuivant, anneeSuivante);
      const jourFinEffectif = getJourEffectif(jourPaieMoisSuivant, moisSuivant, anneeSuivante);
      
      if (jourFinEffectif <= 1) {
        fin = new Date(anneeSuivante, moisSuivant, 0);
      } else {
        fin = new Date(anneeSuivante, moisSuivant, jourFinEffectif - 1);
      }
    }
    
    // Créer le label
    const labelDebut = `${debut.getDate()} ${nomsMoisCourts[debut.getMonth()]}`;
    const labelFin = `${fin.getDate()} ${nomsMoisCourts[fin.getMonth()]}`;
    
    let labelAnnees = '';
    if (debut.getFullYear() !== fin.getFullYear()) {
      labelAnnees = `${debut.getFullYear()}/${fin.getFullYear()}`;
    } else {
      labelAnnees = `${fin.getFullYear()}`;
    }
    
    return {
      debut,
      fin,
      moisReference: mois,
      anneeReference: annee,
      label: `${labelDebut} → ${labelFin} ${labelAnnees}`
    };
  }, [configurationPaie.jourPaieDefaut, getJourPaie, getJourEffectif, estPaieFinDeMois]);

  /**
   * Vérifie si une date est dans une période de budget donnée
   */
  const estDansPeriode = useCallback((date: Date, periode: PeriodeBudget): boolean => {
    const dateNormalisee = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const debutNormalise = new Date(periode.debut.getFullYear(), periode.debut.getMonth(), periode.debut.getDate());
    const finNormalisee = new Date(periode.fin.getFullYear(), periode.fin.getMonth(), periode.fin.getDate());
    
    return dateNormalisee >= debutNormalise && dateNormalisee <= finNormalisee;
  }, []);

  /**
   * Vérifie si une période est accessible (après la date de départ)
   */
  const estPeriodeAccessible = useCallback((mois: number, annee: number): boolean => {
    if (!dateDepart) return true;
    
    const dateD = new Date(dateDepart);
    const periode = getPeriodeBudget(mois, annee);
    
    // La période est accessible si sa date de fin est >= date de départ
    return periode.fin >= dateD;
  }, [dateDepart, getPeriodeBudget]);

  /**
   * Obtient le premier mois/année accessible (basé sur la date de départ)
   */
  const getPremierMoisAccessible = useCallback((): { mois: number; annee: number } | null => {
    if (!dateDepart) return null;
    
    const dateD = new Date(dateDepart);
    const mois = dateD.getMonth();
    const annee = dateD.getFullYear();
    const jourPaie = configurationPaie.jourPaieDefaut;
    
    // Si jour de paie = 1, le premier mois est celui de la date de départ
    if (jourPaie === 1) {
      return { mois, annee };
    }
    
    // Si paie en fin de mois (> 15), le premier budget est celui du mois suivant
    if (jourPaie > 15) {
      let premierMois = mois + 1;
      let premiereAnnee = annee;
      if (premierMois > 11) {
        premierMois = 0;
        premiereAnnee++;
      }
      return { mois: premierMois, annee: premiereAnnee };
    }
    
    // Sinon, le premier budget est celui du mois de la date de départ
    return { mois, annee };
  }, [dateDepart, configurationPaie.jourPaieDefaut]);

  /**
   * Obtient la période actuelle (basée sur aujourd'hui)
   */
  const getPeriodeActuelle = useCallback((): PeriodeBudget => {
    const aujourdhui = new Date();
    const moisActuel = aujourdhui.getMonth();
    const anneeActuelle = aujourdhui.getFullYear();
    
    // Tester la période du mois actuel
    const periodeMoisActuel = getPeriodeBudget(moisActuel, anneeActuelle);
    if (estDansPeriode(aujourdhui, periodeMoisActuel)) {
      return periodeMoisActuel;
    }
    
    // Tester la période du mois suivant
    let moisSuivant = moisActuel + 1;
    let anneeSuivante = anneeActuelle;
    if (moisSuivant > 11) {
      moisSuivant = 0;
      anneeSuivante = anneeActuelle + 1;
    }
    const periodeMoisSuivant = getPeriodeBudget(moisSuivant, anneeSuivante);
    if (estDansPeriode(aujourdhui, periodeMoisSuivant)) {
      return periodeMoisSuivant;
    }
    
    // Tester la période du mois précédent
    let moisPrecedent = moisActuel - 1;
    let anneePrecedente = anneeActuelle;
    if (moisPrecedent < 0) {
      moisPrecedent = 11;
      anneePrecedente = anneeActuelle - 1;
    }
    const periodeMoisPrecedent = getPeriodeBudget(moisPrecedent, anneePrecedente);
    if (estDansPeriode(aujourdhui, periodeMoisPrecedent)) {
      return periodeMoisPrecedent;
    }
    
    return periodeMoisActuel;
  }, [getPeriodeBudget, estDansPeriode]);

  /**
   * Filtre les transactions pour une période donnée
   * Prend en compte la date de départ (exclut les transactions avant)
   */
  const filtrerTransactionsPourPeriode = useCallback(<T extends { date?: string }>(transactions: T[], periode: PeriodeBudget): T[] => {
    return transactions.filter(t => {
      if (!t.date) return false;
      const dateTransaction = new Date(t.date);
      
      // Exclure les transactions avant la date de départ
      if (dateDepart) {
        const dateD = new Date(dateDepart);
        if (dateTransaction < dateD) return false;
      }
      
      return estDansPeriode(dateTransaction, periode);
    });
  }, [estDansPeriode, dateDepart]);

  /**
   * Filtre les transactions pour les statistiques (après la date de départ uniquement)
   */
  const filtrerTransactionsApresDateDepart = useCallback(<T extends { date?: string }>(transactions: T[]): T[] => {
    if (!dateDepart) return transactions;
    
    const dateD = new Date(dateDepart);
    return transactions.filter(t => {
      if (!t.date) return false;
      const dateTransaction = new Date(t.date);
      return dateTransaction >= dateD;
    });
  }, [dateDepart]);

  /**
   * Détecte automatiquement la date de paie basée sur les transactions de revenus
   */
  const detecterDatePaie = useCallback((transactions: TransactionDetection[], mois: number, annee: number): number | null => {
    if (!configurationPaie.detectionAutoActive) return null;
    
    const revenusduMois = transactions.filter(t => {
      if (!t.date) return false;
      const date = new Date(t.date);
      const estBonMois = date.getMonth() === mois && date.getFullYear() === annee;
      const estCategorieSurveillee = configurationPaie.categoriesDetection.includes(t.categorie);
      const estMontantSuffisant = parseFloat(t.montant) >= configurationPaie.montantMinimumDetection;
      
      return estBonMois && estCategorieSurveillee && estMontantSuffisant;
    });
    
    if (revenusduMois.length === 0) return null;
    
    const joursCompteur: Record<number, number> = {};
    revenusduMois.forEach(t => {
      const jour = new Date(t.date!).getDate();
      joursCompteur[jour] = (joursCompteur[jour] || 0) + 1;
    });
    
    let jourMax = 0;
    let countMax = 0;
    Object.entries(joursCompteur).forEach(([jour, count]) => {
      if (count > countMax || (count === countMax && parseInt(jour) < jourMax)) {
        jourMax = parseInt(jour);
        countMax = count;
      }
    });
    
    return jourMax > 0 ? jourMax : null;
  }, [configurationPaie]);

  /**
   * Ajoute ou met à jour une paie personnalisée pour un mois
   */
  const setJourPaiePersonnalise = useCallback((mois: number, annee: number, jourPaie: number) => {
    const nouvellePaie: PaieMensuelle = {
      mois,
      annee,
      jourPaie,
      estPersonnalise: true
    };
    
    const paiesExistantes = configurationPaie.paiesPersonnalisees.filter(
      p => !(p.mois === mois && p.annee === annee)
    );
    
    const nouvelleConfig: ConfigurationPaie = {
      ...configurationPaie,
      paiesPersonnalisees: [...paiesExistantes, nouvellePaie]
    };
    
    sauvegarderConfiguration(nouvelleConfig);
  }, [configurationPaie]);

  /**
   * Supprime une paie personnalisée
   */
  const supprimerJourPaiePersonnalise = useCallback((mois: number, annee: number) => {
    const nouvelleConfig: ConfigurationPaie = {
      ...configurationPaie,
      paiesPersonnalisees: configurationPaie.paiesPersonnalisees.filter(
        p => !(p.mois === mois && p.annee === annee)
      )
    };
    
    sauvegarderConfiguration(nouvelleConfig);
  }, [configurationPaie]);

  /**
   * Met à jour le jour de paie par défaut
   */
  const setJourPaieDefaut = useCallback((jour: number) => {
    const nouvelleConfig: ConfigurationPaie = {
      ...configurationPaie,
      jourPaieDefaut: jour
    };
    
    sauvegarderConfiguration(nouvelleConfig);
  }, [configurationPaie]);

  /**
   * Active/désactive la détection automatique
   */
  const setDetectionAuto = useCallback((active: boolean) => {
    const nouvelleConfig: ConfigurationPaie = {
      ...configurationPaie,
      detectionAutoActive: active
    };
    
    sauvegarderConfiguration(nouvelleConfig);
  }, [configurationPaie]);

  /**
   * Met à jour les paramètres de détection automatique
   */
  const setParametresDetection = useCallback((montantMinimum: number, categories: string[]) => {
    const nouvelleConfig: ConfigurationPaie = {
      ...configurationPaie,
      montantMinimumDetection: montantMinimum,
      categoriesDetection: categories
    };
    
    sauvegarderConfiguration(nouvelleConfig);
  }, [configurationPaie]);

  /**
   * Sauvegarde la configuration dans localStorage
   */
  const sauvegarderConfiguration = (nouvelleConfig: ConfigurationPaie) => {
    setConfigurationPaie(nouvelleConfig);
    
    try {
      const savedParametres = localStorage.getItem('budget-parametres');
      const parametres = savedParametres ? JSON.parse(savedParametres) : {};
      parametres.configurationPaie = nouvelleConfig;
      localStorage.setItem('budget-parametres', JSON.stringify(parametres));
    } catch (error) {
      console.error('Erreur sauvegarde configuration paie:', error);
    }
  };

  /**
   * Obtient toutes les périodes pour une année
   */
  const getPeriodesAnnee = useCallback((annee: number): PeriodeBudget[] => {
    return Array.from({ length: 12 }, (_, mois) => getPeriodeBudget(mois, annee));
  }, [getPeriodeBudget]);

  /**
   * Obtient un aperçu de la période pour un mois donné
   */
  const getApercuPeriode = useCallback((mois: number, annee: number): string => {
    const periode = getPeriodeBudget(mois, annee);
    return periode.label;
  }, [getPeriodeBudget]);

  return {
    // État
    configurationPaie,
    isLoaded,
    budgetAvantPremier,
    dateDepart,
    
    // Getters
    getJourPaie,
    getPeriodeBudget,
    getPeriodeActuelle,
    getPeriodesAnnee,
    getApercuPeriode,
    getPremierMoisAccessible,
    
    // Utilitaires
    estDansPeriode,
    estPeriodeAccessible,
    filtrerTransactionsPourPeriode,
    filtrerTransactionsApresDateDepart,
    detecterDatePaie,
    getJourEffectif,
    estPaieFinDeMois,
    
    // Setters
    setJourPaieDefaut,
    setJourPaiePersonnalise,
    supprimerJourPaiePersonnalise,
    setDetectionAuto,
    setParametresDetection
  };
}

export default useBudgetPeriod;
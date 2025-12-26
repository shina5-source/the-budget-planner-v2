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
 * EXEMPLES :
 * - Paie le 3 janvier → Budget Janvier = 3 jan → 2 fév
 * - Paie le 29 décembre → Budget Janvier = 29 déc → 28 jan
 * - Paie le 31 janvier → Budget Février = 31 jan → 27 fév
 * 
 * AJUSTEMENTS :
 * - Support des jours de paie variables par mois (avant-dernier jour ouvré, etc.)
 * - Gestion des mois avec moins de jours (février)
 */
export function useBudgetPeriod() {
  const [configurationPaie, setConfigurationPaie] = useState<ConfigurationPaie>(defaultConfigurationPaie);
  const [isLoaded, setIsLoaded] = useState(false);
  const [budgetAvantPremier, setBudgetAvantPremier] = useState(false);

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
      }
    } catch (error) {
      console.error('Erreur chargement configuration paie:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /**
   * Obtient le jour de paie pour un mois/année donné
   * Vérifie d'abord les paies personnalisées, sinon utilise le défaut
   */
  const getJourPaie = useCallback((mois: number, annee: number): number => {
    // Chercher une paie personnalisée pour ce mois
    const paiePerso = configurationPaie.paiesPersonnalisees.find(
      p => p.mois === mois && p.annee === annee
    );
    
    if (paiePerso) {
      return paiePerso.jourPaie;
    }
    
    // Sinon retourner le jour par défaut
    return configurationPaie.jourPaieDefaut;
  }, [configurationPaie]);

  /**
   * Obtient le jour effectif (gère les mois avec moins de jours)
   * Ex: 31 février n'existe pas → retourne 28 ou 29
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
   * 
   * LOGIQUE :
   * - Si jour de paie = 1 → Période standard (1er au dernier jour)
   * - Si jour de paie ≤ 15 → Budget M commence à la paie du mois M
   * - Si jour de paie > 15 → Budget M commence à la paie du mois M-1
   * 
   * EXEMPLE avec paie le 29 (fin de mois) :
   * - Budget JANVIER 2026 = paie de décembre (29 déc) → veille paie janvier (28 jan)
   * 
   * EXEMPLE avec paie le 3 (début de mois) :
   * - Budget JANVIER 2026 = paie de janvier (3 jan) → veille paie février (2 fév)
   */
  const getPeriodeBudget = useCallback((mois: number, annee: number): PeriodeBudget => {
    const jourPaieDefaut = configurationPaie.jourPaieDefaut;
    
    // CAS 1: Si le jour de paie est le 1er, comportement classique (1er au dernier jour)
    if (jourPaieDefaut === 1) {
      const debut = new Date(annee, mois, 1);
      const fin = new Date(annee, mois + 1, 0); // Dernier jour du mois
      
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
      // ========== PAIE EN FIN DE MOIS (> 15) ==========
      // La paie du mois M-1 finance le budget du mois M
      // Ex: Paie le 29 déc → Budget Janvier = 29 déc → 28 jan
      
      // Mois de la paie = mois précédent
      let moisPaie = mois - 1;
      let anneePaie = annee;
      if (moisPaie < 0) {
        moisPaie = 11;
        anneePaie = annee - 1;
      }
      
      // Jour de paie du mois de la paie (peut être personnalisé)
      const jourPaieMoisPaie = getJourPaie(moisPaie, anneePaie);
      const jourDebutEffectif = getJourEffectif(jourPaieMoisPaie, moisPaie, anneePaie);
      
      // DÉBUT = jour de paie du mois précédent
      debut = new Date(anneePaie, moisPaie, jourDebutEffectif);
      
      // Jour de paie du mois courant (pour calculer la fin)
      const jourPaieMoisCourant = getJourPaie(mois, annee);
      const jourFinEffectif = getJourEffectif(jourPaieMoisCourant, mois, annee);
      
      // FIN = veille du jour de paie du mois courant
      if (jourFinEffectif <= 1) {
        // Si la paie est le 1er, fin = dernier jour du mois précédent
        fin = new Date(annee, mois, 0);
      } else {
        fin = new Date(annee, mois, jourFinEffectif - 1);
      }
      
    } else {
      // ========== PAIE EN DÉBUT DE MOIS (≤ 15) ==========
      // La paie du mois M finance le budget du mois M
      // Ex: Paie le 3 jan → Budget Janvier = 3 jan → 2 fév
      
      // Jour de paie du mois courant
      const jourPaieMoisCourant = getJourPaie(mois, annee);
      const jourDebutEffectif = getJourEffectif(jourPaieMoisCourant, mois, annee);
      
      // DÉBUT = jour de paie du mois courant
      debut = new Date(annee, mois, jourDebutEffectif);
      
      // Mois suivant pour calculer la fin
      let moisSuivant = mois + 1;
      let anneeSuivante = annee;
      if (moisSuivant > 11) {
        moisSuivant = 0;
        anneeSuivante = annee + 1;
      }
      
      // Jour de paie du mois suivant
      const jourPaieMoisSuivant = getJourPaie(moisSuivant, anneeSuivante);
      const jourFinEffectif = getJourEffectif(jourPaieMoisSuivant, moisSuivant, anneeSuivante);
      
      // FIN = veille du jour de paie du mois suivant
      if (jourFinEffectif <= 1) {
        fin = new Date(anneeSuivante, moisSuivant, 0);
      } else {
        fin = new Date(anneeSuivante, moisSuivant, jourFinEffectif - 1);
      }
    }
    
    // Créer le label
    const labelDebut = `${debut.getDate()} ${nomsMoisCourts[debut.getMonth()]}`;
    const labelFin = `${fin.getDate()} ${nomsMoisCourts[fin.getMonth()]}`;
    
    // Afficher les années si elles sont différentes
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
   * Obtient la période actuelle (basée sur aujourd'hui)
   * Détermine dans quel budget on se trouve actuellement
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
    
    // Par défaut, retourner le mois actuel
    return periodeMoisActuel;
  }, [getPeriodeBudget, estDansPeriode]);

  /**
   * Filtre les transactions pour une période donnée
   */
  const filtrerTransactionsPourPeriode = useCallback(<T extends { date?: string }>(transactions: T[], periode: PeriodeBudget): T[] => {
    return transactions.filter(t => {
      if (!t.date) return false;
      const dateTransaction = new Date(t.date);
      return estDansPeriode(dateTransaction, periode);
    });
  }, [estDansPeriode]);

  /**
   * Détecte automatiquement la date de paie basée sur les transactions de revenus
   * Retourne le jour le plus fréquent pour les transactions de type revenus
   */
  const detecterDatePaie = useCallback((transactions: TransactionDetection[], mois: number, annee: number): number | null => {
    if (!configurationPaie.detectionAutoActive) return null;
    
    // Filtrer les transactions de revenus pour le mois donné
    const revenusduMois = transactions.filter(t => {
      if (!t.date) return false;
      const date = new Date(t.date);
      const estBonMois = date.getMonth() === mois && date.getFullYear() === annee;
      const estCategorieSurveillee = configurationPaie.categoriesDetection.includes(t.categorie);
      const estMontantSuffisant = parseFloat(t.montant) >= configurationPaie.montantMinimumDetection;
      
      return estBonMois && estCategorieSurveillee && estMontantSuffisant;
    });
    
    if (revenusduMois.length === 0) return null;
    
    // Trouver le jour le plus fréquent (ou le premier si égalité)
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
    
    // Sauvegarder
    sauvegarderConfiguration(nouvelleConfig);
  }, [configurationPaie]);

  /**
   * Supprime une paie personnalisée (revient au défaut)
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
   * Obtient un aperçu de la période pour un mois donné (pour l'affichage dans les paramètres)
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
    
    // Getters
    getJourPaie,
    getPeriodeBudget,
    getPeriodeActuelle,
    getPeriodesAnnee,
    getApercuPeriode,
    
    // Utilitaires
    estDansPeriode,
    filtrerTransactionsPourPeriode,
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
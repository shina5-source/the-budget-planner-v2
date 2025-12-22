'use client';

import { useMemo, useEffect, useState } from 'react';
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
 */
export function useBudgetPeriod() {
  const [configurationPaie, setConfigurationPaie] = useState<ConfigurationPaie>(defaultConfigurationPaie);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger la configuration depuis localStorage
  useEffect(() => {
    try {
      const savedParametres = localStorage.getItem('budget-parametres');
      if (savedParametres) {
        const parsed = JSON.parse(savedParametres);
        if (parsed.configurationPaie) {
          setConfigurationPaie({ ...defaultConfigurationPaie, ...parsed.configurationPaie });
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
  const getJourPaie = useMemo(() => {
    return (mois: number, annee: number): number => {
      // Chercher une paie personnalisée pour ce mois
      const paiePerso = configurationPaie.paiesPersonnalisees.find(
        p => p.mois === mois && p.annee === annee
      );
      
      if (paiePerso) {
        return paiePerso.jourPaie;
      }
      
      // Sinon retourner le jour par défaut
      return configurationPaie.jourPaieDefaut;
    };
  }, [configurationPaie]);

  /**
   * Calcule la période de budget pour un mois donné
   * La période va du jour de paie au jour avant la paie suivante
   */
  const getPeriodeBudget = useMemo(() => {
    return (mois: number, annee: number): PeriodeBudget => {
      const jourPaie = getJourPaie(mois, annee);
      
      // Si le jour de paie est le 1er, comportement classique (1er au dernier jour du mois)
      if (jourPaie === 1) {
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
      
      // Sinon, la période va du jour de paie du mois précédent au jour avant le jour de paie actuel
      // Ex: Si paie le 28, le budget de décembre = 28 nov au 27 déc
      
      // Calculer le mois précédent
      let moisPrecedent = mois - 1;
      let anneePrecedente = annee;
      if (moisPrecedent < 0) {
        moisPrecedent = 11;
        anneePrecedente = annee - 1;
      }
      
      const jourPaiePrecedent = getJourPaie(moisPrecedent, anneePrecedente);
      
      // Date de début = jour de paie du mois précédent
      const debut = new Date(anneePrecedente, moisPrecedent, jourPaiePrecedent);
      
      // Date de fin = jour avant le jour de paie du mois actuel
      const fin = new Date(annee, mois, jourPaie - 1);
      
      // Si le jour de fin est invalide (ex: jour 0), ajuster
      if (fin.getDate() !== jourPaie - 1) {
        // Le jour de paie est le 1er ou invalide, prendre le dernier jour du mois précédent
        fin.setDate(0);
      }
      
      // Créer le label
      const labelDebut = `${debut.getDate()} ${nomsMoisCourts[debut.getMonth()]}`;
      const labelFin = `${fin.getDate()} ${nomsMoisCourts[fin.getMonth()]}`;
      const labelAnnee = debut.getFullYear() !== fin.getFullYear() 
        ? `${debut.getFullYear()}/${fin.getFullYear()}`
        : `${fin.getFullYear()}`;
      
      return {
        debut,
        fin,
        moisReference: mois,
        anneeReference: annee,
        label: `${labelDebut} - ${labelFin} ${labelAnnee}`
      };
    };
  }, [getJourPaie]);

  /**
   * Vérifie si une date est dans une période de budget donnée
   */
  const estDansPeriode = useMemo(() => {
    return (date: Date, periode: PeriodeBudget): boolean => {
      const dateNormalisee = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const debutNormalise = new Date(periode.debut.getFullYear(), periode.debut.getMonth(), periode.debut.getDate());
      const finNormalisee = new Date(periode.fin.getFullYear(), periode.fin.getMonth(), periode.fin.getDate());
      
      return dateNormalisee >= debutNormalise && dateNormalisee <= finNormalisee;
    };
  }, []);

  /**
   * Obtient la période actuelle (basée sur aujourd'hui)
   */
  const getPeriodeActuelle = useMemo(() => {
    return (): PeriodeBudget => {
      const aujourdhui = new Date();
      const mois = aujourdhui.getMonth();
      const annee = aujourdhui.getFullYear();
      
      // Vérifier si on est avant ou après le jour de paie du mois actuel
      const jourPaieActuel = getJourPaie(mois, annee);
      
      if (aujourdhui.getDate() >= jourPaieActuel) {
        // On est après le jour de paie, donc dans la période du mois actuel
        return getPeriodeBudget(mois, annee);
      } else {
        // On est avant le jour de paie, donc encore dans la période du mois précédent
        let moisPrecedent = mois - 1;
        let anneePrecedente = annee;
        if (moisPrecedent < 0) {
          moisPrecedent = 11;
          anneePrecedente = annee - 1;
        }
        return getPeriodeBudget(moisPrecedent, anneePrecedente);
      }
    };
  }, [getJourPaie, getPeriodeBudget]);

  /**
   * Filtre les transactions pour une période donnée
   */
  const filtrerTransactionsPourPeriode = useMemo(() => {
    return <T extends { date?: string }>(transactions: T[], periode: PeriodeBudget): T[] => {
      return transactions.filter(t => {
        if (!t.date) return false;
        const dateTransaction = new Date(t.date);
        return estDansPeriode(dateTransaction, periode);
      });
    };
  }, [estDansPeriode]);

  /**
   * Détecte automatiquement la date de paie basée sur les transactions de revenus
   * Retourne le jour le plus fréquent pour les transactions de type revenus
   */
  const detecterDatePaie = useMemo(() => {
    return (transactions: TransactionDetection[], mois: number, annee: number): number | null => {
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
    };
  }, [configurationPaie]);

  /**
   * Ajoute ou met à jour une paie personnalisée pour un mois
   */
  const setJourPaiePersonnalise = (mois: number, annee: number, jourPaie: number) => {
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
  };

  /**
   * Supprime une paie personnalisée (revient au défaut)
   */
  const supprimerJourPaiePersonnalise = (mois: number, annee: number) => {
    const nouvelleConfig: ConfigurationPaie = {
      ...configurationPaie,
      paiesPersonnalisees: configurationPaie.paiesPersonnalisees.filter(
        p => !(p.mois === mois && p.annee === annee)
      )
    };
    
    sauvegarderConfiguration(nouvelleConfig);
  };

  /**
   * Met à jour le jour de paie par défaut
   */
  const setJourPaieDefaut = (jour: number) => {
    const nouvelleConfig: ConfigurationPaie = {
      ...configurationPaie,
      jourPaieDefaut: jour
    };
    
    sauvegarderConfiguration(nouvelleConfig);
  };

  /**
   * Active/désactive la détection automatique
   */
  const setDetectionAuto = (active: boolean) => {
    const nouvelleConfig: ConfigurationPaie = {
      ...configurationPaie,
      detectionAutoActive: active
    };
    
    sauvegarderConfiguration(nouvelleConfig);
  };

  /**
   * Met à jour les paramètres de détection automatique
   */
  const setParametresDetection = (montantMinimum: number, categories: string[]) => {
    const nouvelleConfig: ConfigurationPaie = {
      ...configurationPaie,
      montantMinimumDetection: montantMinimum,
      categoriesDetection: categories
    };
    
    sauvegarderConfiguration(nouvelleConfig);
  };

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
  const getPeriodesAnnee = useMemo(() => {
    return (annee: number): PeriodeBudget[] => {
      return Array.from({ length: 12 }, (_, mois) => getPeriodeBudget(mois, annee));
    };
  }, [getPeriodeBudget]);

  return {
    // État
    configurationPaie,
    isLoaded,
    
    // Getters
    getJourPaie,
    getPeriodeBudget,
    getPeriodeActuelle,
    getPeriodesAnnee,
    
    // Utilitaires
    estDansPeriode,
    filtrerTransactionsPourPeriode,
    detecterDatePaie,
    
    // Setters
    setJourPaieDefaut,
    setJourPaiePersonnalise,
    supprimerJourPaiePersonnalise,
    setDetectionAuto,
    setParametresDetection
  };
}

export default useBudgetPeriod;
import { Transaction, TotalsData, MoyennesData, EvolutionDataItem, CategoryData, monthsShort } from './types';

// ============================================================================
// FONCTIONS DE CALCUL DES TOTAUX
// ============================================================================

/**
 * Calculer les totaux pour une liste de transactions
 * IMPORTANT: Les types sont au pluriel ('Revenus', 'Factures', 'Dépenses', 'Épargnes')
 */
export function calculateTotals(transactions: Transaction[]): TotalsData {
  // Types au PLURIEL comme dans les données
  const revenus = transactions
    .filter(t => t.type === 'Revenus')
    .reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
  
  const factures = transactions
    .filter(t => t.type === 'Factures')
    .reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
  
  const depenses = transactions
    .filter(t => t.type === 'Dépenses')
    .reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
  
  const epargnes = transactions
    .filter(t => t.type === 'Épargnes')
    .reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
  
  const solde = revenus - factures - depenses - epargnes;
  
  return { 
    revenus, 
    factures, 
    depenses, 
    epargnes, 
    solde,
    // Alias pour compatibilité
    totalRevenus: revenus,
    totalFactures: factures,
    totalDepenses: depenses,
    totalEpargnes: epargnes
  };
}

// ============================================================================
// FONCTIONS DE FILTRAGE PAR PÉRIODE
// ============================================================================

/**
 * Interface pour la période de budget personnalisée
 */
export interface PeriodeBudget {
  debut: Date;
  fin: Date;
  label: string;
  mois: number;
  annee: number;
}

/**
 * Filtrer les transactions par période standard (mois calendaire)
 */
export function filterTransactionsByMonth(
  transactions: Transaction[],
  month: number | null,
  year: number
): Transaction[] {
  return transactions.filter(t => {
    if (!t.date) return false;
    const d = new Date(t.date);
    
    if (month === null) {
      // Vue annuelle
      return d.getFullYear() === year;
    }
    
    // Vue mensuelle standard
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

/**
 * Filtrer les transactions par période personnalisée (budget avant le 1er)
 */
export function filterTransactionsByCustomPeriod(
  transactions: Transaction[],
  periode: PeriodeBudget
): Transaction[] {
  const debutTime = periode.debut.getTime();
  const finTime = periode.fin.getTime();
  
  return transactions.filter(t => {
    if (!t.date) return false;
    const txTime = new Date(t.date).getTime();
    return txTime >= debutTime && txTime <= finTime;
  });
}

/**
 * Filtrer les transactions selon le mode (standard ou personnalisé)
 * C'est la fonction principale à utiliser
 */
export function filterTransactionsForPeriod(
  transactions: Transaction[],
  month: number | null,
  year: number,
  options?: {
    budgetAvantPremier?: boolean;
    jourPaieDefaut?: number;
    periode?: PeriodeBudget;
  }
): Transaction[] {
  // Vue annuelle - toujours filtrage standard
  if (month === null) {
    return filterTransactionsByMonth(transactions, null, year);
  }
  
  // Si mode personnalisé actif et jour de paie != 1
  if (options?.budgetAvantPremier && options?.jourPaieDefaut !== 1 && options?.periode) {
    return filterTransactionsByCustomPeriod(transactions, options.periode);
  }
  
  // Sinon filtrage standard par mois calendaire
  return filterTransactionsByMonth(transactions, month, year);
}

/**
 * Filtrer les transactions avec des filtres supplémentaires (compte, moyen de paiement)
 */
export function filterTransactionsByPeriod(
  transactions: Transaction[],
  month: number | null,
  year: number,
  filters?: { compte?: string; moyenPaiement?: string }
): Transaction[] {
  let filtered = filterTransactionsByMonth(transactions, month, year);
  
  if (filters?.compte && filters.compte !== 'all') {
    filtered = filtered.filter(t => t.depuis === filters.compte || t.vers === filters.compte);
  }
  
  if (filters?.moyenPaiement && filters.moyenPaiement !== 'all') {
    filtered = filtered.filter(t => t.moyenPaiement === filters.moyenPaiement);
  }
  
  return filtered;
}

// ============================================================================
// FONCTIONS DE CALCUL DES PÉRIODES PRÉCÉDENTES
// ============================================================================

/**
 * Calculer les totaux du mois/période précédent(e)
 */
export function calculatePrevTotals(
  transactions: Transaction[], 
  month: number | null, 
  year: number,
  options?: {
    budgetAvantPremier?: boolean;
    jourPaieDefaut?: number;
    getPeriodeBudget?: (m: number, y: number) => PeriodeBudget;
  }
): TotalsData & { hasData: boolean } {
  if (month === null) {
    const prevYearTx = filterTransactionsByMonth(transactions, null, year - 1);
    const totals = calculateTotals(prevYearTx);
    return { ...totals, hasData: prevYearTx.length > 0 };
  }
  
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear = year - 1;
  }
  
  let prevTx: Transaction[];
  
  if (options?.budgetAvantPremier && options?.jourPaieDefaut !== 1 && options?.getPeriodeBudget) {
    const prevPeriode = options.getPeriodeBudget(prevMonth, prevYear);
    prevTx = filterTransactionsByCustomPeriod(transactions, prevPeriode);
  } else {
    prevTx = filterTransactionsByMonth(transactions, prevMonth, prevYear);
  }
  
  const totals = calculateTotals(prevTx);
  return { ...totals, hasData: prevTx.length > 0 };
}

/**
 * Obtenir les transactions du mois précédent
 */
export function getPreviousMonthTransactions(
  transactions: Transaction[],
  month: number | null,
  year: number
): Transaction[] {
  if (month === null) {
    return filterTransactionsByMonth(transactions, null, year - 1);
  }
  
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear = year - 1;
  }
  
  return filterTransactionsByMonth(transactions, prevMonth, prevYear);
}

// ============================================================================
// FONCTIONS DE CALCUL DES MOYENNES ET ÉVOLUTION
// ============================================================================

/**
 * Calculer les moyennes annuelles
 */
export function calculateYearAverages(transactions: Transaction[], year: number): MoyennesData & { monthsWithData: number } {
  const monthsWithData = new Set<number>();
  
  transactions.forEach(t => {
    if (t.date) {
      const d = new Date(t.date);
      if (d.getFullYear() === year) {
        monthsWithData.add(d.getMonth());
      }
    }
  });
  
  const numMonths = monthsWithData.size || 1;
  const yearTx = filterTransactionsByMonth(transactions, null, year);
  const totals = calculateTotals(yearTx);
  
  return {
    revenus: totals.revenus / numMonths,
    factures: totals.factures / numMonths,
    depenses: totals.depenses / numMonths,
    epargnes: totals.epargnes / numMonths,
    monthsWithData: numMonths
  };
}

/**
 * Calculer les données d'évolution mensuelle (standard)
 */
export function calculateEvolutionData(transactions: Transaction[], year: number): EvolutionDataItem[] {
  return monthsShort.map((name, i) => {
    const monthTx = filterTransactionsByMonth(transactions, i, year);
    const totals = calculateTotals(monthTx);
    return { name, ...totals };
  });
}

/**
 * Calculer les données d'évolution avec période personnalisée
 */
export function calculateEvolutionDataWithCustomPeriod(
  transactions: Transaction[],
  year: number,
  options: {
    budgetAvantPremier: boolean;
    jourPaieDefaut: number;
    getPeriodeBudget: (m: number, y: number) => PeriodeBudget;
  }
): EvolutionDataItem[] {
  return monthsShort.map((name, i) => {
    let monthTx: Transaction[];
    
    if (options.budgetAvantPremier && options.jourPaieDefaut !== 1) {
      const periode = options.getPeriodeBudget(i, year);
      monthTx = filterTransactionsByCustomPeriod(transactions, periode);
    } else {
      monthTx = filterTransactionsByMonth(transactions, i, year);
    }
    
    const totals = calculateTotals(monthTx);
    return { name, ...totals };
  });
}

// ============================================================================
// FONCTIONS DE GROUPEMENT PAR CATÉGORIE
// ============================================================================

/**
 * Grouper les transactions par catégorie
 * Accepte les types au pluriel ('Revenus', 'Factures', 'Dépenses', 'Épargnes')
 */
export function groupByCategory(transactions: Transaction[], type: string): CategoryData[] {
  // Normaliser le type (accepter singulier ou pluriel)
  const typeNormalized = type.endsWith('s') ? type : `${type}s`;
  
  const filtered = transactions.filter(t => t.type === typeNormalized);
  
  const grouped: Record<string, { value: number; count: number }> = {};
  
  filtered.forEach(t => {
    const cat = t.categorie || 'Autre';
    if (!grouped[cat]) {
      grouped[cat] = { value: 0, count: 0 };
    }
    grouped[cat].value += parseFloat(t.montant || '0');
    grouped[cat].count += 1;
  });
  
  return Object.entries(grouped)
    .map(([name, data]) => ({ name, value: data.value, count: data.count }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Alias pour compatibilité
 */
export const getDataByCategorie = groupByCategory;

// ============================================================================
// FONCTIONS DE CALCUL DES VARIATIONS
// ============================================================================

/**
 * Calculer la variation en pourcentage
 */
export function calculateVariation(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Alias pour compatibilité
 */
export const calcVariation = calculateVariation;

// ============================================================================
// FONCTIONS POUR DONNÉES N-1 (ANNÉE PRÉCÉDENTE)
// ============================================================================

/**
 * Obtenir les totaux de l'année N-1
 */
export function getN1Totals(transactions: Transaction[], year: number): TotalsData & { hasData: boolean } {
  const n1Tx = filterTransactionsByMonth(transactions, null, year - 1);
  const totals = calculateTotals(n1Tx);
  return { ...totals, hasData: n1Tx.length > 0 };
}

/**
 * Obtenir les transactions de l'année N-1
 */
export function getN1Transactions(transactions: Transaction[], year: number): Transaction[] {
  return filterTransactionsByMonth(transactions, null, year - 1);
}
import { Transaction, TotalsData, MoyennesData, EvolutionDataItem, CategoryData, monthsShort } from './types';

// Calculer les totaux pour une liste de transactions
export function calculateTotals(transactions: Transaction[]): TotalsData {
  const revenus = transactions.filter(t => t.type === 'Revenu').reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
  const factures = transactions.filter(t => t.type === 'Facture').reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
  const depenses = transactions.filter(t => t.type === 'Dépense').reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
  const epargnes = transactions.filter(t => t.type === 'Épargne').reduce((s, t) => s + parseFloat(t.montant || '0'), 0);
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

// Calculer les totaux du mois précédent
export function calculatePrevTotals(transactions: Transaction[], month: number | null, year: number): TotalsData {
  if (month === null) {
    const prevYearTx = transactions.filter(t => {
      if (!t.date) return false;
      const d = new Date(t.date);
      return d.getFullYear() === year - 1;
    });
    return calculateTotals(prevYearTx);
  }
  
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear = year - 1;
  }
  
  const prevTx = transactions.filter(t => {
    if (!t.date) return false;
    const d = new Date(t.date);
    return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
  });
  
  return calculateTotals(prevTx);
}

// Calculer les moyennes annuelles
export function calculateYearAverages(transactions: Transaction[], year: number): MoyennesData {
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
  const yearTx = transactions.filter(t => {
    if (!t.date) return false;
    return new Date(t.date).getFullYear() === year;
  });
  
  const totals = calculateTotals(yearTx);
  
  return {
    revenus: totals.revenus / numMonths,
    factures: totals.factures / numMonths,
    depenses: totals.depenses / numMonths,
    epargnes: totals.epargnes / numMonths
  };
}

// Calculer les données d'évolution mensuelle
export function calculateEvolutionData(transactions: Transaction[], year: number): EvolutionDataItem[] {
  return monthsShort.map((name, i) => {
    const monthTx = transactions.filter(t => {
      if (!t.date) return false;
      const d = new Date(t.date);
      return d.getMonth() === i && d.getFullYear() === year;
    });
    
    const totals = calculateTotals(monthTx);
    return { name, ...totals };
  });
}

// Filtrer les transactions par période
export function filterTransactionsByPeriod(
  transactions: Transaction[],
  month: number | null,
  year: number,
  filters?: { compte?: string; moyenPaiement?: string }
): Transaction[] {
  return transactions.filter(t => {
    if (!t.date) return false;
    const d = new Date(t.date);
    
    if (d.getFullYear() !== year) return false;
    if (month !== null && d.getMonth() !== month) return false;
    
    if (filters?.compte && filters.compte !== 'all') {
      if (t.depuis !== filters.compte && t.vers !== filters.compte) return false;
    }
    
    if (filters?.moyenPaiement && filters.moyenPaiement !== 'all') {
      if (t.moyenPaiement !== filters.moyenPaiement) return false;
    }
    
    return true;
  });
}

// Obtenir les transactions du mois précédent
export function getPreviousMonthTransactions(
  transactions: Transaction[],
  month: number | null,
  year: number
): Transaction[] {
  if (month === null) {
    return transactions.filter(t => {
      if (!t.date) return false;
      return new Date(t.date).getFullYear() === year - 1;
    });
  }
  
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear = year - 1;
  }
  
  return transactions.filter(t => {
    if (!t.date) return false;
    const d = new Date(t.date);
    return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
  });
}

// Grouper les transactions par catégorie
export function groupByCategory(transactions: Transaction[], type: string): CategoryData[] {
  const typeMapping: Record<string, string> = {
    'Revenus': 'Revenu',
    'Factures': 'Facture',
    'Dépenses': 'Dépense',
    'Épargnes': 'Épargne'
  };
  
  const actualType = typeMapping[type] || type;
  const filtered = transactions.filter(t => t.type === actualType);
  
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

// Calculer la variation en pourcentage
export function calculateVariation(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Alias pour compatibilité
export const calcVariation = calculateVariation;

// Obtenir les données par catégorie (alias)
export function getDataByCategorie(transactions: Transaction[], type: string): CategoryData[] {
  return groupByCategory(transactions, type);
}

// Obtenir les N-1 totaux (année précédente)
export function getN1Totals(transactions: Transaction[], year: number): TotalsData & { hasData: boolean } {
  const n1Tx = transactions.filter(t => {
    if (!t.date) return false;
    return new Date(t.date).getFullYear() === year - 1;
  });
  
  const totals = calculateTotals(n1Tx);
  return { ...totals, hasData: n1Tx.length > 0 };
}

// Obtenir les transactions N-1
export function getN1Transactions(transactions: Transaction[], year: number): Transaction[] {
  return transactions.filter(t => {
    if (!t.date) return false;
    return new Date(t.date).getFullYear() === year - 1;
  });
}
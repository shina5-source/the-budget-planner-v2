// Types pour les transactions récurrentes
export interface RecurringTransaction {
  id: string;
  nom: string;
  montant: number;
  type: 'revenu' | 'facture' | 'depense' | 'epargne';
  categorie: string;
  compte: string;
  moyenPaiement?: string;
  frequence: 'mensuel' | 'hebdomadaire' | 'bimensuel' | 'trimestriel' | 'annuel';
  jourDuMois?: number;
  jourDeSemaine?: number;
  actif: boolean;
  derniereExecution?: string;
  dateCreation: string;
}

export interface Transaction {
  id: number;
  type: string;
  montant: string;
  categorie: string;
  depuis?: string;
  vers?: string;
  date: string;
  memo?: string;
  moyenPaiement?: string;
  isRecurring?: boolean;
  recurringId?: string;
}

const STORAGE_KEY = 'budget-planner-recurring';
const TRANSACTIONS_KEY = 'budget-transactions';

// Récupérer les transactions récurrentes
export function getRecurringTransactions(): RecurringTransaction[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Sauvegarder les transactions récurrentes
export function saveRecurringTransactions(transactions: RecurringTransaction[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// Ajouter une transaction récurrente
export function addRecurringTransaction(transaction: Omit<RecurringTransaction, 'id' | 'dateCreation'>): RecurringTransaction {
  const transactions = getRecurringTransactions();
  const newTransaction: RecurringTransaction = {
    ...transaction,
    id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    dateCreation: new Date().toISOString(),
  };
  transactions.push(newTransaction);
  saveRecurringTransactions(transactions);
  return newTransaction;
}

// Supprimer une transaction récurrente
export function deleteRecurringTransaction(id: string): void {
  const transactions = getRecurringTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  saveRecurringTransactions(filtered);
}

// Mettre à jour une transaction récurrente
export function updateRecurringTransaction(id: string, updates: Partial<RecurringTransaction>): void {
  const transactions = getRecurringTransactions();
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    saveRecurringTransactions(transactions);
  }
}

// Vérifier si une transaction doit être créée aujourd'hui
function shouldCreateTransaction(recurring: RecurringTransaction, today: Date): boolean {
  if (!recurring.actif) return false;

  const todayStr = today.toISOString().split('T')[0];
  
  if (recurring.derniereExecution) {
    const lastExec = new Date(recurring.derniereExecution);
    const lastExecStr = lastExec.toISOString().split('T')[0];
    if (lastExecStr === todayStr) return false;
  }

  const dayOfMonth = today.getDate();
  const dayOfWeek = today.getDay();
  const month = today.getMonth();

  switch (recurring.frequence) {
    case 'mensuel':
      if (recurring.jourDuMois === dayOfMonth) {
        if (recurring.derniereExecution) {
          const lastExec = new Date(recurring.derniereExecution);
          if (lastExec.getMonth() === month && lastExec.getFullYear() === today.getFullYear()) {
            return false;
          }
        }
        return true;
      }
      const lastDayOfMonth = new Date(today.getFullYear(), month + 1, 0).getDate();
      if (recurring.jourDuMois && recurring.jourDuMois > lastDayOfMonth && dayOfMonth === lastDayOfMonth) {
        if (recurring.derniereExecution) {
          const lastExec = new Date(recurring.derniereExecution);
          if (lastExec.getMonth() === month && lastExec.getFullYear() === today.getFullYear()) {
            return false;
          }
        }
        return true;
      }
      return false;

    case 'hebdomadaire':
      if (recurring.jourDeSemaine === dayOfWeek) {
        if (recurring.derniereExecution) {
          const lastExec = new Date(recurring.derniereExecution);
          const diffDays = Math.floor((today.getTime() - lastExec.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays < 7) return false;
        }
        return true;
      }
      return false;

    case 'bimensuel':
      if ((dayOfMonth === 1 || dayOfMonth === 15)) {
        if (recurring.derniereExecution) {
          const lastExec = new Date(recurring.derniereExecution);
          const lastExecStr = lastExec.toISOString().split('T')[0];
          if (lastExecStr === todayStr) return false;
          if (lastExec.getDate() === dayOfMonth && lastExec.getMonth() === month) return false;
        }
        return true;
      }
      return false;

    case 'trimestriel':
      if (recurring.jourDuMois === dayOfMonth && month % 3 === 0) {
        if (recurring.derniereExecution) {
          const lastExec = new Date(recurring.derniereExecution);
          const monthsDiff = (today.getFullYear() - lastExec.getFullYear()) * 12 + (month - lastExec.getMonth());
          if (monthsDiff < 3) return false;
        }
        return true;
      }
      return false;

    case 'annuel':
      if (recurring.jourDuMois === dayOfMonth) {
        if (recurring.derniereExecution) {
          const lastExec = new Date(recurring.derniereExecution);
          if (lastExec.getFullYear() === today.getFullYear()) return false;
        }
        return true;
      }
      return false;

    default:
      return false;
  }
}

// Mapper les types vers le format de la page Transactions
const typeMapping: Record<string, string> = {
  'revenu': 'Revenus',
  'facture': 'Factures',
  'depense': 'Dépenses',
  'epargne': 'Épargnes',
};

// Créer une transaction à partir d'une récurrente
function createTransactionFromRecurring(recurring: RecurringTransaction, date: Date): Transaction {
  const existingTransactions = getExistingTransactions();
  const maxId = existingTransactions.reduce((max, t) => Math.max(max, t.id || 0), 0);

  return {
    id: maxId + 1,
    type: typeMapping[recurring.type] || recurring.type,
    montant: recurring.montant.toString(),
    categorie: recurring.categorie,
    depuis: 'Externe',
    vers: recurring.compte,
    date: date.toISOString().split('T')[0],
    memo: '🔄 Transaction récurrente',
    moyenPaiement: 'Prélèvement',
    isRecurring: true,
    recurringId: recurring.id,
  };
}

// Récupérer les transactions existantes
function getExistingTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

// Sauvegarder les transactions
function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

// Fonction principale : vérifier et créer les transactions récurrentes
export function processRecurringTransactions(): Transaction[] {
  const today = new Date();
  const recurringList = getRecurringTransactions();
  const createdTransactions: Transaction[] = [];

  for (const recurring of recurringList) {
    if (shouldCreateTransaction(recurring, today)) {
      const newTransaction = createTransactionFromRecurring(recurring, today);
      
      const existingTransactions = getExistingTransactions();
      existingTransactions.push(newTransaction);
      saveTransactions(existingTransactions);
      
      updateRecurringTransaction(recurring.id, {
        derniereExecution: today.toISOString(),
      });
      
      createdTransactions.push(newTransaction);
    }
  }

  return createdTransactions;
}

// Labels pour l'affichage
export const frequenceLabels: Record<RecurringTransaction['frequence'], string> = {
  hebdomadaire: 'Chaque semaine',
  bimensuel: 'Deux fois par mois',
  mensuel: 'Chaque mois',
  trimestriel: 'Chaque trimestre',
  annuel: 'Chaque année',
};

export const joursSemaine = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];
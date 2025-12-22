"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';
import { Confetti } from '@/components/ui';
import {
  PageHeader,
  StatsCards,
  TauxEndettement,
  CreditsCounter,
  ProgressionChart,
  CreditItem,
  CreditForm,
  EmptyState,
  SkeletonCredits
} from './components';

// Types
interface Transaction {
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

interface ParametresData {
  devise: string;
  comptesBancaires: { id: number; nom: string }[];
  categoriesFactures: string[];
}

interface CreditStats {
  totalRembourse: number;
  resteADu: number;
  progression: number;
  moisEcoules: number;
  moisRestants: number;
  totalADu: number;
  interetsTotal: number;
  dateFin: Date | null;
  estTermine: boolean;
}

// Constantes
const defaultParametres: ParametresData = {
  devise: '€',
  comptesBancaires: [{ id: 1, nom: 'Compte Principal' }],
  categoriesFactures: ['Crédits']
};

function CreditsDettesContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  // States
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [isLoading, setIsLoading] = useState(true);
  const [revenusMensuels, setRevenusMensuels] = useState(0);

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingCredit, setEditingCredit] = useState<Transaction | null>(null);

  // Feedback states
  const [showConfetti, setShowConfetti] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'error'>('success');

  // Load data
  useEffect(() => {
    const loadData = () => {
      const savedTransactions = localStorage.getItem('budget-transactions');
      if (savedTransactions) {
        const allTransactions: Transaction[] = JSON.parse(savedTransactions);
        setTransactions(allTransactions);

        // Calculer revenus mensuels
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const revenus = allTransactions
          .filter(t => t.type === 'Revenus' && t.date?.startsWith(currentMonth))
          .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
        setRevenusMensuels(revenus);
      }

      const savedParametres = localStorage.getItem('budget-parametres');
      if (savedParametres) {
        setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
      }

      setIsLoading(false);
    };

    // Simuler un petit délai pour voir le skeleton
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, []);

  // Save transactions
  const saveTransactions = useCallback((newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem('budget-transactions', JSON.stringify(newTransactions));
  }, []);

  // Save parametres
  const saveParametres = useCallback((newParametres: ParametresData) => {
    setParametres(newParametres);
    localStorage.setItem('budget-parametres', JSON.stringify(newParametres));
  }, []);

  // Filtrer les crédits
  const credits = useMemo(() => {
    return transactions.filter(t => t.isCredit === true);
  }, [transactions]);

  // Fonction de calcul des remboursements
  const getRemboursements = useCallback((credit: Transaction): CreditStats => {
    if (!credit.dateDebut || !credit.dureeMois) {
      return {
        totalRembourse: 0,
        resteADu: parseFloat(credit.capitalTotal || '0'),
        progression: 0,
        moisEcoules: 0,
        moisRestants: parseInt(credit.dureeMois || '0'),
        totalADu: parseFloat(credit.capitalTotal || '0'),
        interetsTotal: 0,
        dateFin: null,
        estTermine: false
      };
    }

    const dateDebut = new Date(credit.dateDebut);
    const now = new Date();
    const moisEcoules = Math.max(0, (now.getFullYear() - dateDebut.getFullYear()) * 12 + (now.getMonth() - dateDebut.getMonth()));
    const mensualite = parseFloat(credit.montant || '0');
    const capital = parseFloat(credit.capitalTotal || '0');
    const taux = parseFloat(credit.tauxInteret || '0');
    const duree = parseInt(credit.dureeMois || '0');

    const interetsTotal = capital * (taux / 100) * (duree / 12);
    const totalADu = capital + interetsTotal;
    const totalRembourse = Math.min(moisEcoules * mensualite, totalADu);
    const resteADu = Math.max(0, totalADu - totalRembourse);
    const progression = totalADu > 0 ? (totalRembourse / totalADu) * 100 : 0;
    const moisRestants = Math.max(0, duree - moisEcoules);

    const dateFin = new Date(dateDebut);
    dateFin.setMonth(dateFin.getMonth() + duree);

    const estTermine = progression >= 100 || moisRestants <= 0;

    return { totalRembourse, resteADu, progression, moisEcoules, moisRestants, totalADu, interetsTotal, dateFin, estTermine };
  }, []);

  // Calculs mémorisés
  const stats = useMemo(() => {
    const totalMensualites = credits.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    const totalEndettement = credits.reduce((sum, credit) => sum + getRemboursements(credit).resteADu, 0);
    const tauxEndettement = revenusMensuels > 0 ? (totalMensualites / revenusMensuels) * 100 : 0;
    const cumulAnnuel = totalMensualites * 12;
    const nbCreditsTermines = credits.filter(c => getRemboursements(c).estTermine).length;
    const nbCreditsActifs = credits.length - nbCreditsTermines;

    return {
      totalMensualites,
      totalEndettement,
      tauxEndettement,
      cumulAnnuel,
      nbCreditsTermines,
      nbCreditsActifs
    };
  }, [credits, revenusMensuels, getRemboursements]);

  // Comptes disponibles
  const comptes = useMemo(() => {
    return ['Externe', ...parametres.comptesBancaires.map(c => c.nom)];
  }, [parametres.comptesBancaires]);

  // Toast helper
  const showToastMessage = useCallback((message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  // Handlers
  const handleOpenForm = useCallback(() => {
    setEditingCredit(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((credit: Transaction) => {
    setEditingCredit(credit);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id: number) => {
    if (confirm('Supprimer ce crédit ?')) {
      const newTransactions = transactions.filter(t => t.id !== id);
      saveTransactions(newTransactions);
      showToastMessage('🗑️ Crédit supprimé', 'warning');
    }
  }, [transactions, saveTransactions, showToastMessage]);

  // Ajouter un compte - synchronisé avec les paramètres globaux
  const handleAddCompte = useCallback((name: string) => {
    if (parametres.comptesBancaires.some(c => c.nom === name)) return;
    const maxId = parametres.comptesBancaires.reduce((m, c) => Math.max(m, c.id), 0);
    const newParametres = {
      ...parametres,
      comptesBancaires: [...parametres.comptesBancaires, { id: maxId + 1, nom: name }]
    };
    saveParametres(newParametres);
    showToastMessage(`✅ Compte "${name}" ajouté`, 'success');
  }, [parametres, saveParametres, showToastMessage]);

  const handleSubmit = useCallback((creditData: Omit<Transaction, 'id'> & { id?: number }) => {
    if (creditData.id) {
      // Modification
      const newTransactions = transactions.map(t => 
        t.id === creditData.id ? { ...creditData, id: creditData.id } as Transaction : t
      );
      saveTransactions(newTransactions);
      showToastMessage('✏️ Crédit modifié avec succès !', 'success');
    } else {
      // Création
      const newCredit: Transaction = {
        ...creditData,
        id: Date.now()
      } as Transaction;
      saveTransactions([...transactions, newCredit]);
      
      // Confettis pour nouveau crédit
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
      showToastMessage('🎉 Nouveau crédit ajouté !', 'success');
    }
    setEditingCredit(null);
    setShowForm(false);
  }, [transactions, saveTransactions, showToastMessage]);

  // Toast colors
  const getToastStyle = () => {
    switch (toastType) {
      case 'success': return { bg: 'bg-green-500/90', border: 'border-green-400' };
      case 'warning': return { bg: 'bg-orange-500/90', border: 'border-orange-400' };
      case 'error': return { bg: 'bg-red-500/90', border: 'border-red-400' };
      default: return { bg: 'bg-green-500/90', border: 'border-green-400' };
    }
  };

  // Loading state
  if (isLoading) {
    return <SkeletonCredits />;
  }

  return (
    <>
      {/* Confettis */}
      <Confetti trigger={showConfetti} />

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-lg border ${getToastStyle().bg} ${getToastStyle().border} text-white text-sm font-medium animate-slideDown`}>
          {toastMessage}
        </div>
      )}

      <div className="pb-4">
        {/* Header - Juste le titre, pas de bouton + */}
        <PageHeader />

        {/* Stats principales */}
        <StatsCards
          totalEndettement={stats.totalEndettement}
          totalMensualites={stats.totalMensualites}
          cumulAnnuel={stats.cumulAnnuel}
          devise={parametres.devise}
        />

        {/* Taux d'endettement */}
        <TauxEndettement tauxEndettement={stats.tauxEndettement} />

        {/* Compteur crédits */}
        <CreditsCounter
          total={credits.length}
          actifs={stats.nbCreditsActifs}
          termines={stats.nbCreditsTermines}
        />

        {/* Graphique progression */}
        <ProgressionChart
          credits={credits}
          getRemboursements={getRemboursements}
          devise={parametres.devise}
        />

        {/* Liste des crédits ou Empty State */}
        {credits.length > 0 ? (
          <div className="space-y-3 mb-4">
            <h3 
              className="text-sm font-semibold text-center uppercase tracking-wide animate-fadeIn"
              style={{ color: theme.colors.textPrimary, animationDelay: '400ms' }}
            >
              Détail des Crédits
            </h3>

            {credits.map((credit, index) => (
              <CreditItem
                key={credit.id}
                credit={credit}
                stats={getRemboursements(credit)}
                devise={parametres.devise}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState onAddCredit={handleOpenForm} />
        )}

        {/* SmartTips */}
        <SmartTips page="credits" />
      </div>

      {/* Modal Formulaire */}
      <CreditForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingCredit(null); }}
        onSubmit={handleSubmit}
        editingCredit={editingCredit}
        comptes={comptes}
        devise={parametres.devise}
        onAddCompte={handleAddCompte}
      />
    </>
  );
}

export default function CreditsDettesPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="credits-dettes" onNavigate={handleNavigate}>
      <CreditsDettesContent />
    </AppShell>
  );
}

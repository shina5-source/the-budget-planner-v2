"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Home as HomeIcon, Mail, PiggyBank, Sun, Target, PieChart, CheckSquare, Sparkles, Pencil, X, Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips } from '@/components';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

interface ParametresData {
  devise: string;
}

const defaultParametres: ParametresData = {
  devise: '€'
};

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

function AccueilContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [userName, setUserName] = useState('Utilisateur');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    // Charger les transactions
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    
    // Charger les paramètres
    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) setParametres({ ...defaultParametres, ...JSON.parse(savedParametres) });
    
    // Charger le nom
    const savedName = localStorage.getItem('budget-user-name');
    if (savedName) setUserName(savedName);
  }, []);

  const saveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('budget-user-name', tempName.trim());
    }
    setIsEditingName(false);
  };

  const startEditName = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  // Calculs
  const getMonthKey = () => `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
  const filteredTransactions = transactions.filter(t => t.date?.startsWith(getMonthKey()));
  
  const totalRevenus = filteredTransactions
    .filter(t => t.type === 'Revenus')
    .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  
  const totalFactures = filteredTransactions
    .filter(t => t.type === 'Factures')
    .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  
  const totalDepenses = filteredTransactions
    .filter(t => t.type === 'Dépenses')
    .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  
  const totalEpargnes = filteredTransactions
    .filter(t => t.type === 'Épargnes')
    .reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  
  const budgetPrevu = totalRevenus - totalFactures;
  const reposPrevu = totalRevenus - totalFactures - totalEpargnes;
  const soldeReel = totalRevenus - totalFactures - totalDepenses - totalEpargnes;

  // Navigation mois
  const prevMonth = () => {
    if (selectedMonth === 0) { 
      setSelectedMonth(11); 
      setSelectedYear(selectedYear - 1); 
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) { 
      setSelectedMonth(0); 
      setSelectedYear(selectedYear + 1); 
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Navigation pages
  const navigateTo = (page: string) => {
    router.push(`/${page}`);
  };

  // Styles
  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  // Données des cartes résumé
  const summaryCards = [
    { title: 'Revenus prévus', amount: totalRevenus, sub: `Reçus : ${totalRevenus.toFixed(2)} ${parametres.devise}`, icon: TrendingUp },
    { title: 'Dépenses fixes', amount: totalFactures, sub: `Payées : ${totalFactures.toFixed(2)} ${parametres.devise}`, icon: HomeIcon },
    { title: 'Enveloppes budgétaires', amount: budgetPrevu, sub: `Dépensé : ${totalDepenses.toFixed(2)} ${parametres.devise}`, icon: Mail },
    { title: 'Épargne CT prévu', amount: totalEpargnes, sub: `Versé : ${totalEpargnes.toFixed(2)} ${parametres.devise}`, icon: PiggyBank },
    { title: 'Repos prévu', amount: reposPrevu, sub: 'Après budget prévu', icon: Sun, hasCheck: true },
    { title: 'Solde réel', amount: soldeReel, sub: 'Dépenses réelles', icon: Sparkles, hasCheck: true },
  ];

  // Données des raccourcis
  const shortcuts = [
    { page: 'budget', title: 'Mon budget', sub: 'Vue d\'ensemble', icon: PieChart },
    { page: 'objectifs', title: 'Mes Objectifs', sub: 'Économiseur', icon: Target },
    { page: 'enveloppes', title: 'Mes enveloppes', sub: 'Gérer mes enveloppes', icon: Mail },
  ];

  return (
    <div className="pb-4">
      {/* Logo */}
      <div className="text-center mb-2">
        <div className="w-24 h-24 mx-auto mb-2 rounded-2xl overflow-hidden shadow-lg border-2" style={{ borderColor: theme.colors.cardBorder }}>
          <Image src="/logo-shina5.png" alt="Logo" width={96} height={96} className="w-full h-full object-cover" priority />
        </div>
      </div>

      {/* Salutation avec nom éditable */}
      <div className="text-center mb-4">
        {isEditingName ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-semibold" style={textPrimary}>Bonjour</span>
            <input 
              type="text" 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)} 
              className="text-xl font-semibold rounded-xl px-3 py-1 w-32 text-center border" 
              style={{ background: theme.colors.cardBackgroundLight, color: theme.colors.textPrimary, borderColor: theme.colors.primary }} 
              autoFocus 
              onKeyDown={(e) => { 
                if (e.key === 'Enter') saveName(); 
                if (e.key === 'Escape') setIsEditingName(false); 
              }} 
            />
            <button onClick={saveName} className="p-1 rounded-full border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
              <Check className="w-4 h-4" style={textPrimary} />
            </button>
            <button onClick={() => setIsEditingName(false)} className="p-1 rounded-full border" style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder }}>
              <X className="w-4 h-4" style={textPrimary} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-lg font-semibold" style={textPrimary}>Bonjour {userName} 👋</h1>
            <button onClick={startEditName} className="p-1 hover:opacity-80 rounded-full">
              <Pencil className="w-4 h-4" style={textSecondary} />
            </button>
          </div>
        )}
        <p className="text-xs mt-1 text-center" style={textSecondary}>Bienvenue sur The Budget Planner</p>
      </div>

      {/* Sélecteur de mois */}
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1">
            <ChevronLeft className="w-5 h-5" style={textPrimary} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold" style={textPrimary}>{monthsFull[selectedMonth]}</span>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
              className="rounded-lg px-3 py-1 text-lg font-semibold border" 
              style={inputStyle}
            >
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <button onClick={nextMonth} className="p-1">
            <ChevronRight className="w-5 h-5" style={textPrimary} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {monthsShort.map((month, index) => (
            <button 
              key={index} 
              onClick={() => setSelectedMonth(index)} 
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" 
              style={selectedMonth === index 
                ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } 
                : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }
              }
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Cartes résumé */}
      <div className="space-y-3 mb-6">
        {summaryCards.map((item, idx) => (
          <div key={idx} className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs" style={textSecondary}>{item.title}</p>
                <p className="text-2xl font-semibold mt-1" style={textPrimary}>
                  {item.amount.toFixed(2)} {parametres.devise}
                </p>
                {item.hasCheck ? (
                  <div className="flex items-center gap-1 mt-1">
                    <CheckSquare className="w-3 h-3" style={textSecondary} />
                    <p className="text-[10px]" style={textSecondary}>{item.sub}</p>
                  </div>
                ) : (
                  <p className="text-[10px] mt-1" style={textSecondary}>{item.sub}</p>
                )}
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
                <item.icon className="w-5 h-5" style={textPrimary} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Raccourcis */}
      <div className="space-y-3 mb-4">
        {shortcuts.map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => navigateTo(item.page)} 
            className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border w-full flex items-center gap-4" 
            style={cardStyle}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
              <item.icon className="w-6 h-6" style={textPrimary} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold" style={textPrimary}>{item.title}</p>
              <p className="text-[10px]" style={textSecondary}>{item.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* SmartTips - Conseils dynamiques */}
      <SmartTips page="accueil" />
    </div>
  );
}

function LoadingScreen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(180deg, ${theme.colors.backgroundGradientFrom} 0%, ${theme.colors.backgroundGradientTo} 50%, ${theme.colors.backgroundGradientFrom} 100%)` }}>
      <div className="text-center">
        <div 
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
          style={{ 
            borderLeftColor: theme.colors.primary, 
            borderRightColor: theme.colors.primary, 
            borderBottomColor: theme.colors.primary, 
            borderTopColor: 'transparent' 
          }}
        />
        <p className="font-medium" style={{ color: theme.colors.textPrimary }}>Chargement...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth');
        } else {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/auth');
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <AppShell currentPage="accueil" onNavigate={handleNavigate}>
      <AccueilContent />
    </AppShell>
  );
}

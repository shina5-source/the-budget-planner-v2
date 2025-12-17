'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, 
  TrendingUp, TrendingDown, PiggyBank, CreditCard, Calendar, Target,
  Award, Flame, Coffee, ShoppingBag, Clock, Bell, Wallet, BarChart3,
  Heart, Star, Zap, Gift, AlertCircle, Info, Sparkles
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

// Types
interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
  isCredit?: boolean;
  memo?: string;
}

interface RecurringTransaction {
  id: string;
  nom: string;
  montant: number;
  type: 'revenu' | 'facture' | 'depense' | 'epargne';
  categorie: string;
  compte: string;
  frequence: string;
  jourDuMois?: number;
  actif: boolean;
}

interface Objectif {
  id: number;
  nom: string;
  montantCible: number;
  montantActuel: number;
  dateEcheance?: string;
}

interface Tip {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info' | 'motivation';
  icon: React.ElementType;
  priority: number;
  category: string[];
}

interface SmartTipsProps {
  page?: 'accueil' | 'transactions' | 'previsionnel' | 'objectifs' | 'epargnes' | 'credits' | 'memo' | 'enveloppes' | 'budget' | 'parametres' | 'statistiques';
  autoRotate?: boolean;
  rotateInterval?: number;
}

export default function SmartTips({ 
  page = 'accueil', 
  autoRotate = true, 
  rotateInterval = 6000 
}: SmartTipsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tips, setTips] = useState<Tip[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [devise, setDevise] = useState('€');

  // Charger les données
  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

    const savedRecurring = localStorage.getItem('budget-recurring');
    if (savedRecurring) setRecurring(JSON.parse(savedRecurring));

    const savedObjectifs = localStorage.getItem('budget-objectifs');
    if (savedObjectifs) setObjectifs(JSON.parse(savedObjectifs));

    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) {
      const params = JSON.parse(savedParametres);
      if (params.devise) setDevise(params.devise);
    }
  }, []);

  // Helpers de calcul
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDay = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const getMonthKey = (year: number, month: number) => 
    `${year}-${(month + 1).toString().padStart(2, '0')}`;

  const currentMonthKey = getMonthKey(currentYear, currentMonth);
  
  const getPreviousMonthKey = () => {
    let y = currentYear;
    let m = currentMonth - 1;
    if (m < 0) { m = 11; y--; }
    return getMonthKey(y, m);
  };

  const getTransactionsByMonth = (monthKey: string) =>
    transactions.filter(t => t.date?.startsWith(monthKey));

  const currentMonthTransactions = getTransactionsByMonth(currentMonthKey);
  const previousMonthTransactions = getTransactionsByMonth(getPreviousMonthKey());

  // Calculs financiers
  const revenus = currentMonthTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const depenses = currentMonthTransactions.filter(t => ['Factures', 'Dépenses'].includes(t.type)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const epargne = currentMonthTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const repriseEpargne = currentMonthTransactions.filter(t => t.type === 'Reprise d\'épargne').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const solde = revenus - depenses - epargne + repriseEpargne;

  const revenusPrev = previousMonthTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const depensesPrev = previousMonthTransactions.filter(t => ['Factures', 'Dépenses'].includes(t.type)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);

  const depensesPourcentage = revenus > 0 ? (depenses / revenus) * 100 : 0;
  const epargnePourcentage = revenus > 0 ? (epargne / revenus) * 100 : 0;
  const variationDepenses = depensesPrev > 0 ? ((depenses - depensesPrev) / depensesPrev) * 100 : 0;
  const projectionDepenses = currentDay > 0 ? (depenses / currentDay) * daysInMonth : 0;

  const creditsActifs = transactions.filter(t => t.isCredit);
  const nbCredits = creditsActifs.length;

  const depensesParCategorie = currentMonthTransactions.filter(t => t.type === 'Dépenses').reduce((acc, t) => { acc[t.categorie] = (acc[t.categorie] || 0) + parseFloat(t.montant || '0'); return acc; }, {} as Record<string, number>);
  const categorieMax = Object.entries(depensesParCategorie).sort((a, b) => b[1] - a[1])[0];
  const petitesDepenses = currentMonthTransactions.filter(t => t.type === 'Dépenses' && parseFloat(t.montant || '0') < 10).length;

  const facturesAVenir = recurring.filter(r => r.actif && r.type === 'facture').filter(r => r.jourDuMois && r.jourDuMois > currentDay && r.jourDuMois <= currentDay + 7);
  const factureDemain = recurring.filter(r => r.actif && r.type === 'facture' && r.jourDuMois === currentDay + 1);
  const revenusAVenir = recurring.filter(r => r.actif && r.type === 'revenu').filter(r => r.jourDuMois && r.jourDuMois > currentDay && r.jourDuMois <= currentDay + 7);

  const objectifProche = objectifs.find(o => { const reste = o.montantCible - o.montantActuel; return reste > 0 && reste <= 100; });
  const objectifAtteint = objectifs.find(o => o.montantActuel >= o.montantCible);

  // Tendances 3 mois
  const getLast3MonthsData = () => {
    const months = [];
    for (let i = 0; i < 3; i++) {
      let y = currentYear, m = currentMonth - i;
      if (m < 0) { m += 12; y--; }
      const key = getMonthKey(y, m);
      const trans = getTransactionsByMonth(key);
      months.push({
        key,
        revenus: trans.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0),
        depenses: trans.filter(t => ['Factures', 'Dépenses'].includes(t.type)).reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0),
        epargne: trans.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0),
      });
    }
    return months;
  };

  const last3Months = getLast3MonthsData();
  const avgDepenses3M = last3Months.reduce((sum, m) => sum + m.depenses, 0) / 3;
  const avgEpargne3M = last3Months.reduce((sum, m) => sum + m.epargne, 0) / 3;

  const depensesPrevParCategorie = previousMonthTransactions.filter(t => t.type === 'Dépenses').reduce((acc, t) => { acc[t.categorie] = (acc[t.categorie] || 0) + parseFloat(t.montant || '0'); return acc; }, {} as Record<string, number>);
  const categoriesEnHausse = Object.entries(depensesParCategorie).filter(([cat, montant]) => { const prevMontant = depensesPrevParCategorie[cat] || 0; return prevMontant > 0 && montant > prevMontant * 1.3; }).map(([cat, montant]) => ({ categorie: cat, montant, variation: ((montant - (depensesPrevParCategorie[cat] || 0)) / (depensesPrevParCategorie[cat] || 1)) * 100 })).sort((a, b) => b.variation - a.variation);

  const depensesTransactions = currentMonthTransactions.filter(t => t.type === 'Dépenses');
  const moyenneParTransaction = depensesTransactions.length > 0 ? depensesTransactions.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0) / depensesTransactions.length : 0;
  const nbJoursAvecDepenses = new Set(currentMonthTransactions.filter(t => t.type === 'Dépenses').map(t => t.date?.split('T')[0])).size;

  // Générer les conseils
  const generateTips = (): Tip[] => {
    const allTips: Tip[] = [];

    if (solde < 0) allTips.push({ id: 'solde-negatif', message: `Attention ! Solde négatif de ${Math.abs(solde).toFixed(0)}${devise}`, type: 'danger', icon: AlertTriangle, priority: 1, category: ['accueil', 'transactions', 'budget'] });
    if (solde >= 0 && solde < 100 && currentMonthTransactions.length > 0) allTips.push({ id: 'solde-serre', message: `Solde serré (${solde.toFixed(0)}${devise}), surveillez vos dépenses`, type: 'warning', icon: AlertCircle, priority: 2, category: ['accueil', 'transactions', 'budget'] });
    if (solde > 0 && revenus > 0 && solde / revenus > 0.2) allTips.push({ id: 'solde-excellent', message: `Excellent ! ${(solde / revenus * 100).toFixed(0)}% de vos revenus disponibles`, type: 'success', icon: CheckCircle, priority: 3, category: ['accueil', 'transactions', 'budget'] });
    if (solde > 0 && revenus > 0 && solde / revenus > 0.5) allTips.push({ id: 'super-gestion', message: `Super gestion ! Pensez à investir ou épargner davantage`, type: 'success', icon: TrendingUp, priority: 3, category: ['accueil', 'epargnes'] });
    if (revenus === 0 && currentMonthTransactions.length > 0) allTips.push({ id: 'aucun-revenu', message: `Aucun revenu enregistré ce mois`, type: 'danger', icon: AlertTriangle, priority: 1, category: ['accueil', 'transactions'] });

    if (depensesPourcentage > 100) allTips.push({ id: 'depenses-depassent', message: `Dépenses supérieures aux revenus !`, type: 'danger', icon: AlertTriangle, priority: 1, category: ['accueil', 'transactions', 'budget'] });
    if (depensesPourcentage >= 80 && depensesPourcentage <= 100) allTips.push({ id: 'depenses-80', message: `Vous avez dépensé ${depensesPourcentage.toFixed(0)}% de vos revenus`, type: 'warning', icon: AlertCircle, priority: 2, category: ['accueil', 'transactions', 'budget'] });
    if (categorieMax && categorieMax[1] > 0) { const pct = revenus > 0 ? (categorieMax[1] / revenus * 100).toFixed(0) : 0; allTips.push({ id: 'categorie-top', message: `${categorieMax[0]} = ${pct}% de vos revenus`, type: 'info', icon: ShoppingBag, priority: 4, category: ['accueil', 'transactions', 'enveloppes'] }); }
    if (petitesDepenses >= 10) allTips.push({ id: 'petites-depenses', message: `${petitesDepenses} petites dépenses (<10${devise}) ce mois`, type: 'warning', icon: Coffee, priority: 3, category: ['transactions'] });
    if (projectionDepenses > revenus && revenus > 0) allTips.push({ id: 'projection-depasse', message: `Projection: ${projectionDepenses.toFixed(0)}${devise} de dépenses d'ici fin du mois`, type: 'warning', icon: TrendingUp, priority: 2, category: ['accueil', 'previsionnel', 'budget'] });

    if (nbCredits > 0) allTips.push({ id: 'credits-actifs', message: `${nbCredits} crédit(s) en cours`, type: 'info', icon: CreditCard, priority: 4, category: ['accueil', 'credits', 'transactions'] });
    if (epargnePourcentage >= 20) allTips.push({ id: 'epargne-super', message: `Super ! ${epargnePourcentage.toFixed(0)}% épargnés ce mois`, type: 'success', icon: PiggyBank, priority: 3, category: ['accueil', 'epargnes'] });
    if (epargne === 0 && revenus > 0 && currentMonthTransactions.length > 5) allTips.push({ id: 'pas-epargne', message: `Pensez à épargner, même 10${devise} compte !`, type: 'warning', icon: PiggyBank, priority: 3, category: ['accueil', 'epargnes'] });

    if (facturesAVenir.length > 0) { const total = facturesAVenir.reduce((sum, f) => sum + f.montant, 0); allTips.push({ id: 'factures-semaine', message: `${facturesAVenir.length} facture(s) prévue(s) cette semaine (${total.toFixed(0)}${devise})`, type: 'info', icon: Bell, priority: 2, category: ['accueil', 'previsionnel'] }); }
    if (factureDemain.length > 0) allTips.push({ id: 'facture-demain', message: `${factureDemain[0].nom} prévu demain : ${factureDemain[0].montant}${devise}`, type: 'warning', icon: Calendar, priority: 1, category: ['accueil', 'previsionnel'] });
    if (revenusAVenir.length > 0) allTips.push({ id: 'revenu-bientot', message: `${revenusAVenir[0].nom} prévu dans quelques jours`, type: 'success', icon: Wallet, priority: 3, category: ['accueil', 'previsionnel'] });

    if (variationDepenses < -10 && depensesPrev > 0) allTips.push({ id: 'depenses-baisse', message: `Dépenses en baisse de ${Math.abs(variationDepenses).toFixed(0)}% vs mois dernier 👏`, type: 'success', icon: TrendingDown, priority: 2, category: ['accueil', 'transactions', 'budget'] });
    if (variationDepenses > 20 && depensesPrev > 0) allTips.push({ id: 'depenses-hausse', message: `Dépenses en hausse de ${variationDepenses.toFixed(0)}% vs mois dernier`, type: 'warning', icon: TrendingUp, priority: 2, category: ['accueil', 'transactions', 'budget'] });

    if (categoriesEnHausse.length > 0) { const top = categoriesEnHausse[0]; allTips.push({ id: 'categorie-hausse-ia', message: `🤖 IA détecte : "${top.categorie}" +${top.variation.toFixed(0)}% vs mois dernier`, type: 'warning', icon: TrendingUp, priority: 2, category: ['accueil', 'transactions', 'statistiques', 'budget'] }); }
    if (depenses > avgDepenses3M * 1.15 && avgDepenses3M > 0) allTips.push({ id: 'au-dessus-moyenne-ia', message: `🤖 Dépenses ${((depenses / avgDepenses3M - 1) * 100).toFixed(0)}% au-dessus de votre moyenne`, type: 'warning', icon: BarChart3, priority: 2, category: ['accueil', 'statistiques', 'budget'] });
    if (depenses < avgDepenses3M * 0.85 && avgDepenses3M > 0 && currentDay > 15) allTips.push({ id: 'en-dessous-moyenne-ia', message: `🤖 Bravo ! Dépenses ${((1 - depenses / avgDepenses3M) * 100).toFixed(0)}% sous votre moyenne`, type: 'success', icon: Award, priority: 2, category: ['accueil', 'statistiques', 'budget'] });
    if (nbJoursAvecDepenses > currentDay * 0.7 && currentDay > 10) allTips.push({ id: 'frequence-achats-ia', message: `🤖 Achats fréquents : ${nbJoursAvecDepenses} jours sur ${currentDay} avec dépenses`, type: 'info', icon: ShoppingBag, priority: 4, category: ['accueil', 'transactions', 'statistiques'] });
    if (moyenneParTransaction > 50 && depensesTransactions.length >= 5) allTips.push({ id: 'panier-moyen-ia', message: `🤖 Panier moyen : ${moyenneParTransaction.toFixed(0)}${devise}/transaction`, type: 'info', icon: ShoppingBag, priority: 4, category: ['transactions', 'statistiques'] });
    if (epargne > avgEpargne3M * 1.2 && avgEpargne3M > 0) allTips.push({ id: 'epargne-hausse-ia', message: `🤖 Super ! Épargne en hausse vs votre moyenne`, type: 'success', icon: PiggyBank, priority: 2, category: ['accueil', 'epargnes', 'statistiques'] });
    if (epargne < avgEpargne3M * 0.5 && avgEpargne3M > 50 && currentDay > 20) allTips.push({ id: 'epargne-baisse-ia', message: `🤖 Épargne en baisse ce mois, pensez-y avant la fin`, type: 'warning', icon: PiggyBank, priority: 2, category: ['accueil', 'epargnes', 'statistiques'] });
    if (currentDay >= 25 && solde > 100) allTips.push({ id: 'fin-mois-epargne-ia', message: `🤖 Fin de mois : ${solde.toFixed(0)}${devise} dispo, placez-les en épargne ?`, type: 'success', icon: Sparkles, priority: 2, category: ['accueil', 'epargnes'] });

    if (objectifProche) { const reste = objectifProche.montantCible - objectifProche.montantActuel; allTips.push({ id: 'objectif-proche', message: `Plus que ${reste.toFixed(0)}${devise} pour "${objectifProche.nom}" !`, type: 'success', icon: Target, priority: 2, category: ['accueil', 'objectifs', 'epargnes'] }); }
    if (objectifAtteint) allTips.push({ id: 'objectif-atteint', message: `Objectif "${objectifAtteint.nom}" atteint ! Bravo ! 🎉`, type: 'success', icon: Award, priority: 1, category: ['accueil', 'objectifs'] });
    if (objectifs.length === 0) allTips.push({ id: 'pas-objectif', message: `Définissez un objectif d'épargne pour vous motiver !`, type: 'info', icon: Target, priority: 5, category: ['objectifs', 'epargnes'] });

    if (currentMonthTransactions.length === 0) allTips.push({ id: 'premiere-transaction', message: `Commencez à enregistrer vos transactions`, type: 'info', icon: Lightbulb, priority: 5, category: ['accueil', 'transactions'] });
    if (transactions.length >= 100) allTips.push({ id: 'felicitations-100', message: `${transactions.length} transactions ! Vous êtes organisé 🏆`, type: 'success', icon: Award, priority: 4, category: ['accueil', 'transactions'] });

    const astuces = [
      { id: 'astuce-1', message: `Règle 50/30/20 : Besoins/Envies/Épargne`, icon: Lightbulb },
      { id: 'astuce-2', message: `Un café/jour = ~1000${devise}/an ☕`, icon: Coffee },
      { id: 'astuce-3', message: `Attendez 48h avant un achat >50${devise}`, icon: Clock },
      { id: 'astuce-4', message: `Virement auto = épargne sans effort`, icon: Zap },
      { id: 'astuce-5', message: `Budget = liberté, pas contrainte`, icon: Heart },
    ];
    const randomAstuce = astuces[Math.floor(Math.random() * astuces.length)];
    allTips.push({ ...randomAstuce, type: 'info', priority: 6, category: ['accueil', 'transactions', 'memo', 'budget', 'epargnes', 'objectifs', 'previsionnel', 'credits', 'enveloppes', 'parametres', 'statistiques'] });

    const mois = now.getMonth();
    if (mois === 11) allTips.push({ id: 'noel', message: `Noël approche, prévoyez un budget cadeaux 🎄`, type: 'info', icon: Gift, priority: 4, category: ['accueil', 'budget', 'enveloppes'] });
    if (mois === 7 || mois === 6) allTips.push({ id: 'vacances', message: `Été : attention aux dépenses vacances ☀️`, type: 'info', icon: Star, priority: 4, category: ['accueil', 'budget'] });

    return allTips.filter(tip => tip.category.includes(page)).sort((a, b) => a.priority - b.priority);
  };

  useEffect(() => { setTips(generateTips()); }, [transactions, recurring, objectifs, devise, page]);
  useEffect(() => { if (!autoRotate || tips.length <= 1) return; const interval = setInterval(() => { setCurrentIndex(prev => (prev + 1) % tips.length); }, rotateInterval); return () => clearInterval(interval); }, [autoRotate, rotateInterval, tips.length]);

  const goToPrevious = () => setCurrentIndex(prev => (prev - 1 + tips.length) % tips.length);
  const goToNext = () => setCurrentIndex(prev => (prev + 1) % tips.length);

  if (tips.length === 0) {
    return (
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: theme.colors.primary }} />
          <p className="text-xs" style={{ color: theme.colors.textPrimary }}>Tout va bien ! Continuez comme ça 👍</p>
        </div>
      </div>
    );
  }

  const currentTip = tips[currentIndex];
  const IconComponent = currentTip?.icon || Lightbulb;

  // Couleurs selon le type - UTILISANT LE THÈME
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'danger': return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#EF4444', icon: '#EF4444' };
      case 'warning': return { bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.4)', text: '#F97316', icon: '#F97316' };
      case 'success': return { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', text: '#22C55E', icon: '#22C55E' };
      case 'motivation': return { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', text: '#A855F7', icon: '#A855F7' };
      default: return { bg: `${theme.colors.primary}15`, border: `${theme.colors.primary}40`, text: theme.colors.primary, icon: theme.colors.primary };
    }
  };

  const styles = getTypeStyles(currentTip.type);

  return (
    <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={{ background: styles.bg, borderColor: styles.border }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4" style={{ color: styles.icon }} />
          <h4 className="text-xs font-semibold" style={{ color: styles.text }}>💡 Conseils</h4>
        </div>
        {tips.length > 1 && (
          <span className="text-[9px]" style={{ color: styles.text, opacity: 0.7 }}>{currentIndex + 1}/{tips.length}</span>
        )}
      </div>

      {/* Conseil actuel */}
      <div className="flex items-start gap-3 mb-3">
        <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: styles.icon }} />
        <p className="text-xs leading-relaxed" style={{ color: styles.text }}>{currentTip.message}</p>
      </div>

      {/* Navigation */}
      {tips.length > 1 && (
        <div className="flex items-center justify-between">
          <button onClick={goToPrevious} className="p-1 rounded-lg transition-opacity hover:opacity-70" style={{ color: styles.text }}>
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1.5">
            {tips.slice(0, Math.min(tips.length, 7)).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ 
                  backgroundColor: i === currentIndex ? styles.icon : `${theme.colors.textSecondary}50`,
                  transform: i === currentIndex ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
            {tips.length > 7 && <span className="text-[8px]" style={{ color: styles.text }}>...</span>}
          </div>

          <button onClick={goToNext} className="p-1 rounded-lg transition-opacity hover:opacity-70" style={{ color: styles.text }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
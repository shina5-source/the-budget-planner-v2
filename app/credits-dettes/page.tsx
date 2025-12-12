"use client";

import { useState, useEffect } from 'react';
import { TrendingDown, Lightbulb, Calendar, Percent, Wallet, Clock, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell } from '@/components';

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
}

const defaultParametres: ParametresData = {
  devise: '€'
};

function CreditsDettesContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [revenusMensuels, setRevenusMensuels] = useState(0);
  const [expandedCredit, setExpandedCredit] = useState<number | null>(null);

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };

  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) {
      const allTransactions: Transaction[] = JSON.parse(savedTransactions);
      setTransactions(allTransactions);

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
  }, []);

  const credits = transactions.filter(t => t.isCredit === true);

  const getRemboursements = (credit: Transaction) => {
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
  };

  const totalMensualites = credits.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEndettement = credits.reduce((sum, credit) => sum + getRemboursements(credit).resteADu, 0);
  const tauxEndettement = revenusMensuels > 0 ? (totalMensualites / revenusMensuels) * 100 : 0;
  const cumulAnnuel = totalMensualites * 12;
  const nbCreditsTermines = credits.filter(c => getRemboursements(c).estTermine).length;
  const nbCreditsActifs = credits.length - nbCreditsTermines;

  const getProgressColor = (percent: number) => {
    if (percent >= 75) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    if (percent >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTauxColor = (taux: number) => {
    if (taux > 35) return 'text-red-400';
    if (taux > 25) return 'text-orange-400';
    return 'text-green-400';
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  const toggleCredit = (id: number) => {
    setExpandedCredit(prev => prev === id ? null : id);
  };

  return (
    <div className="pb-4">
      <div className="text-center mb-4">
        <h1 className="text-lg font-medium" style={textPrimary}>Crédits & Dettes</h1>
        <p className="text-xs" style={textSecondary}>Suivi automatique de vos remboursements</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet className="w-4 h-4" style={textPrimary} />
            <p className="text-[10px] uppercase tracking-wide" style={textSecondary}>Endettement Total</p>
          </div>
          <p className="text-lg font-semibold" style={textPrimary}>{totalEndettement.toFixed(2)} {parametres.devise}</p>
          <p className="text-[10px]" style={textSecondary}>reste à rembourser</p>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Percent className="w-4 h-4" style={textPrimary} />
            <p className="text-[10px] uppercase tracking-wide" style={textSecondary}>Taux d&apos;Endettement</p>
          </div>
          <div className="relative w-16 h-16 mx-auto">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke={theme.colors.primary} strokeOpacity="0.2" strokeWidth="6" fill="none" />
              <circle cx="32" cy="32" r="28" stroke={tauxEndettement > 35 ? '#ef4444' : tauxEndettement > 25 ? '#f97316' : '#22c55e'} strokeWidth="6" fill="none" strokeDasharray={`${Math.min(tauxEndettement, 100) * 1.76} 176`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${getTauxColor(tauxEndettement)}`}>{Math.round(tauxEndettement)}%</span>
            </div>
          </div>
          <p className="text-[10px] mt-1" style={textSecondary}>{tauxEndettement > 35 ? '⚠️ Au-dessus de 35%' : '✅ Sous le seuil'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center" style={cardStyle}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-3 h-3" style={textPrimary} />
            <p className="text-[10px]" style={textSecondary}>Mensualité totale</p>
          </div>
          <p className="text-lg font-semibold" style={textPrimary}>{totalMensualites.toFixed(2)} {parametres.devise}</p>
        </div>
        <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center" style={cardStyle}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingDown className="w-3 h-3" style={textPrimary} />
            <p className="text-[10px]" style={textSecondary}>Cumul annuel</p>
          </div>
          <p className="text-lg font-semibold" style={textPrimary}>{cumulAnnuel.toFixed(2)} {parametres.devise}</p>
        </div>
      </div>

      {credits.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center" style={cardStyle}>
            <p className="text-[10px]" style={textSecondary}>Total</p>
            <p className="text-lg font-bold" style={textPrimary}>{credits.length}</p>
            <p className="text-[10px]" style={textSecondary}>crédit(s)</p>
          </div>
          <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center" style={cardStyle}>
            <p className="text-[10px]" style={textSecondary}>En cours</p>
            <p className="text-lg font-bold text-orange-400">{nbCreditsActifs}</p>
            <p className="text-[10px]" style={textSecondary}>actif(s)</p>
          </div>
          <div className="backdrop-blur-sm rounded-2xl p-3 shadow-sm border text-center" style={cardStyle}>
            <p className="text-[10px]" style={textSecondary}>Terminé(s)</p>
            <p className="text-lg font-bold text-green-400">{nbCreditsTermines}</p>
            <p className="text-[10px]" style={textSecondary}>remboursé(s)</p>
          </div>
        </div>
      )}

      {credits.length > 0 && (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3 text-center uppercase tracking-wide" style={textPrimary}>Progression des Remboursements</h3>
          <div className="space-y-3">
            {credits.map((credit) => {
              const { progression, totalRembourse, estTermine } = getRemboursements(credit);
              return (
                <div key={credit.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] flex-1 truncate pr-2" style={textSecondary}>
                      {estTermine && <CheckCircle className="w-3 h-3 inline mr-1 text-green-400" />}
                      {credit.categorie}
                    </p>
                    <p className="text-[10px]" style={textSecondary}>{Math.round(progression)}%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 rounded-full overflow-hidden border" style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder }}>
                      <div className={`h-full ${getProgressColor(progression)} transition-all duration-500`} style={{ width: `${Math.min(progression, 100)}%` }} />
                    </div>
                    <p className="text-[10px] w-20 text-right" style={textSecondary}>{totalRembourse.toFixed(0)} {parametres.devise}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {credits.length > 0 ? (
        <div className="space-y-3 mb-4">
          <h3 className="text-sm font-semibold text-center uppercase tracking-wide" style={textPrimary}>Détail des Crédits</h3>

          {credits.map((credit) => {
            const { totalRembourse, resteADu, progression, moisRestants, totalADu, interetsTotal, dateFin, estTermine } = getRemboursements(credit);
            const isOpen = expandedCredit === credit.id;
            const mensualite = parseFloat(credit.montant || '0');

            return (
              <div key={credit.id} className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden p-0" style={{ ...cardStyle, borderColor: estTermine ? 'rgba(34, 197, 94, 0.5)' : theme.colors.cardBorder }}>
                <button onClick={() => toggleCredit(credit.id)} className="w-full p-4 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {estTermine ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /> : <Clock className="w-4 h-4 flex-shrink-0" style={textPrimary} />}
                      <span className="text-sm font-semibold truncate" style={textPrimary}>{credit.categorie}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${getProgressColor(progression)}`}>{Math.round(progression)}%</span>
                      {isOpen ? <ChevronUp className="w-5 h-5" style={textPrimary} /> : <ChevronDown className="w-5 h-5" style={textPrimary} />}
                    </div>
                  </div>

                  <div className="h-2 rounded-full overflow-hidden border mb-2" style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder }}>
                    <div className={`h-full ${getProgressColor(progression)} transition-all duration-500`} style={{ width: `${Math.min(progression, 100)}%` }} />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px]" style={textSecondary}>💳 {mensualite.toFixed(2)} {parametres.devise}/mois</span>
                    <span className="text-[10px]" style={textSecondary}>Reste: <span className={estTermine ? 'text-green-400' : 'text-orange-400'}>{resteADu.toFixed(2)} {parametres.devise}</span></span>
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder, background: theme.colors.cardBackgroundLight }}>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Capital', value: `${parseFloat(credit.capitalTotal || '0').toFixed(2)} ${parametres.devise}` },
                        { label: 'Intérêts', value: `${interetsTotal.toFixed(2)} ${parametres.devise}` },
                        { label: 'Durée', value: `${credit.dureeMois || '-'} mois` },
                        { label: 'Taux', value: `${credit.tauxInteret || '0'}%` },
                        { label: 'Coût total', value: `${totalADu.toFixed(2)} ${parametres.devise}` },
                        { label: 'Fin prévue', value: formatDate(dateFin) },
                      ].map((item, i) => (
                        <div key={i} className="p-2 rounded-lg" style={{ background: theme.colors.cardBackground }}>
                          <p className="text-[10px]" style={textSecondary}>{item.label}</p>
                          <p className="text-xs font-medium" style={textPrimary}>{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="p-2 bg-green-500/10 rounded-lg text-center border border-green-500/20">
                        <p className="text-[10px]" style={textSecondary}>Remboursé</p>
                        <p className="text-xs font-semibold text-green-400">{totalRembourse.toFixed(0)} {parametres.devise}</p>
                      </div>
                      <div className={`p-2 rounded-lg text-center border ${estTermine ? 'bg-green-500/10 border-green-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                        <p className="text-[10px]" style={textSecondary}>Reste dû</p>
                        <p className={`text-xs font-semibold ${estTermine ? 'text-green-400' : 'text-orange-400'}`}>{resteADu.toFixed(0)} {parametres.devise}</p>
                      </div>
                      <div className="p-2 rounded-lg text-center border" style={{ background: `${theme.colors.primary}10`, borderColor: theme.colors.cardBorder }}>
                        <p className="text-[10px]" style={textSecondary}>Mois restants</p>
                        <p className={`text-xs font-semibold ${moisRestants <= 3 ? 'text-green-400' : ''}`} style={moisRestants > 3 ? textPrimary : {}}>{moisRestants}</p>
                      </div>
                    </div>

                    {estTermine && (
                      <div className="mt-3 p-2 bg-green-500/20 rounded-lg text-center border border-green-500/30">
                        <p className="text-xs text-green-400 font-medium">🎉 Crédit remboursé !</p>
                      </div>
                    )}
                    {!estTermine && moisRestants <= 3 && moisRestants > 0 && (
                      <div className="mt-3 p-2 rounded-lg text-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
                        <p className="text-xs font-medium" style={textPrimary}>🏁 Plus que {moisRestants} mois !</p>
                      </div>
                    )}
                    {credit.memo && (
                      <div className="mt-3 p-2 rounded-lg" style={{ background: theme.colors.cardBackground }}>
                        <p className="text-[10px] italic" style={textSecondary}>📝 {credit.memo}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center py-8 mb-4" style={cardStyle}>
          <AlertTriangle className="w-12 h-12 mx-auto mb-3" style={{ color: theme.colors.textSecondary }} />
          <p className="text-xs mb-2" style={textSecondary}>Aucun crédit enregistré</p>
          <p className="text-[10px]" style={textSecondary}>
            Pour ajouter un crédit, allez dans <strong>Transactions</strong>,
            <br />créez une transaction de type &quot;Factures&quot; et cochez
            <br /><strong>&quot;C&apos;est un crédit&quot;</strong>
          </p>
        </div>
      )}

      <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-[#7DD3A8]" />
          <h4 className="text-xs font-semibold text-[#7DD3A8]">💡 Conseils</h4>
        </div>
        <div className="space-y-2">
          {tauxEndettement > 35 && (<p className="text-[10px] text-[#7DD3A8]">⚠️ Votre taux d&apos;endettement ({Math.round(tauxEndettement)}%) dépasse le seuil de 35%</p>)}
          {tauxEndettement > 0 && tauxEndettement <= 35 && (<p className="text-[10px] text-[#7DD3A8]">✅ Taux d&apos;endettement dans la norme ({Math.round(tauxEndettement)}%)</p>)}
          {credits.length === 0 && (<p className="text-[10px] text-[#7DD3A8]">📝 Ajoutez vos crédits dans Transactions pour un suivi automatique</p>)}
          {nbCreditsTermines > 0 && (<p className="text-[10px] text-[#7DD3A8]">🎉 Félicitations ! {nbCreditsTermines} crédit(s) terminé(s)</p>)}
          {credits.some(c => getRemboursements(c).moisRestants <= 3 && !getRemboursements(c).estTermine) && (<p className="text-[10px] text-[#7DD3A8]">🏁 Certains crédits sont presque terminés !</p>)}
          {revenusMensuels === 0 && credits.length > 0 && (<p className="text-[10px] text-[#7DD3A8]">💰 Ajoutez vos revenus pour calculer le taux d&apos;endettement</p>)}
          {credits.length > 0 && totalMensualites > 0 && (<p className="text-[10px] text-[#7DD3A8]">📊 Vous remboursez {totalMensualites.toFixed(2)} {parametres.devise}/mois</p>)}
        </div>
      </div>
    </div>
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
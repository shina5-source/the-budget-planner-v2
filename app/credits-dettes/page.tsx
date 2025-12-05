"use client";

import { useState, useEffect } from 'react';
import { TrendingDown, Lightbulb, Calendar, Percent, Wallet, Clock, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

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

// STYLES UNIFORMISÉS
const cardStyle = "bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#D4AF37]/40";
const pageTitleStyle = "text-lg font-medium text-[#D4AF37]";
const pageSubtitleStyle = "text-xs text-[#D4AF37]/70";
const smallTextStyle = "text-[10px] text-[#D4AF37]/60";
const labelStyle = "text-xs text-[#D4AF37]/80";
const valueStyle = "text-xs font-medium text-[#D4AF37]";
const sectionTitleStyle = "text-sm font-semibold text-[#D4AF37]";
const amountMediumStyle = "text-lg font-semibold text-[#D4AF37]";

// STYLE CONSEILS - Vert menthe
const conseilCardStyle = "bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50";
const conseilTitleStyle = "text-xs font-semibold text-[#7DD3A8]";
const conseilTextStyle = "text-[10px] text-[#7DD3A8]";
const conseilIconStyle = "w-4 h-4 text-[#7DD3A8]";

export default function CreditsDettesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [revenusMensuels, setRevenusMensuels] = useState(0);
  const [expandedCredit, setExpandedCredit] = useState<number | null>(null);

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

    return {
      totalRembourse,
      resteADu,
      progression,
      moisEcoules,
      moisRestants,
      totalADu,
      interetsTotal,
      dateFin,
      estTermine
    };
  };

  const totalMensualites = credits.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEndettement = credits.reduce((sum, credit) => sum + getRemboursements(credit).resteADu, 0);
  const tauxEndettement = revenusMensuels > 0 ? (totalMensualites / revenusMensuels) * 100 : 0;
  const cumulAnnuel = totalMensualites * 12;
  const nbCreditsTermines = credits.filter(c => getRemboursements(c).estTermine).length;
  const nbCreditsActifs = credits.length - nbCreditsTermines;

  const getProgressColor = (percent: number) => {
    if (percent >= 75) return 'bg-green-500';
    if (percent >= 50) return 'bg-[#D4AF37]';
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
      {/* Titre */}
      <div className="text-center mb-4">
        <h1 className={pageTitleStyle}>Crédits & Dettes</h1>
        <p className={pageSubtitleStyle}>Suivi automatique de vos remboursements</p>
      </div>

      {/* Résumé principal */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={cardStyle + " text-center"}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-[#D4AF37]" />
            <p className={smallTextStyle + " uppercase tracking-wide"}>Endettement Total</p>
          </div>
          <p className={amountMediumStyle}>{totalEndettement.toFixed(2)} {parametres.devise}</p>
          <p className={smallTextStyle}>reste à rembourser</p>
        </div>

        <div className={cardStyle + " text-center"}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-[#D4AF37]" />
            <p className={smallTextStyle + " uppercase tracking-wide"}>Taux d'Endettement</p>
          </div>
          <div className="relative w-16 h-16 mx-auto">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="#D4AF37" strokeOpacity="0.2" strokeWidth="6" fill="none" />
              <circle 
                cx="32" cy="32" r="28" 
                stroke={tauxEndettement > 35 ? '#ef4444' : tauxEndettement > 25 ? '#f97316' : '#22c55e'}
                strokeWidth="6" fill="none" 
                strokeDasharray={`${Math.min(tauxEndettement, 100) * 1.76} 176`} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${getTauxColor(tauxEndettement)}`}>
                {Math.round(tauxEndettement)}%
              </span>
            </div>
          </div>
          <p className={smallTextStyle + " mt-1"}>
            {tauxEndettement > 35 ? '⚠️ Au-dessus de 35%' : '✅ Sous le seuil'}
          </p>
        </div>
      </div>

      {/* Mensualités et Cumul */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={cardStyle + " text-center p-3"}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-3 h-3 text-[#D4AF37]" />
            <p className={smallTextStyle}>Mensualité totale</p>
          </div>
          <p className={amountMediumStyle}>{totalMensualites.toFixed(2)} {parametres.devise}</p>
        </div>
        <div className={cardStyle + " text-center p-3"}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingDown className="w-3 h-3 text-[#D4AF37]" />
            <p className={smallTextStyle}>Cumul annuel</p>
          </div>
          <p className={amountMediumStyle}>{cumulAnnuel.toFixed(2)} {parametres.devise}</p>
        </div>
      </div>

      {/* Statistiques crédits */}
      {credits.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className={cardStyle + " text-center p-3"}>
            <p className={smallTextStyle}>Total</p>
            <p className={valueStyle + " text-lg font-bold"}>{credits.length}</p>
            <p className={smallTextStyle}>crédit(s)</p>
          </div>
          <div className={cardStyle + " text-center p-3"}>
            <p className={smallTextStyle}>En cours</p>
            <p className={valueStyle + " text-lg font-bold text-orange-400"}>{nbCreditsActifs}</p>
            <p className={smallTextStyle}>actif(s)</p>
          </div>
          <div className={cardStyle + " text-center p-3"}>
            <p className={smallTextStyle}>Terminé(s)</p>
            <p className={valueStyle + " text-lg font-bold text-green-400"}>{nbCreditsTermines}</p>
            <p className={smallTextStyle}>remboursé(s)</p>
          </div>
        </div>
      )}

      {/* Barres de progression globales */}
      {credits.length > 0 && (
        <div className={cardStyle + " mb-4"}>
          <h3 className={sectionTitleStyle + " mb-3 text-center uppercase tracking-wide"}>
            Progression des Remboursements
          </h3>
          <div className="space-y-3">
            {credits.map((credit) => {
              const { progression, totalRembourse, estTermine } = getRemboursements(credit);
              return (
                <div key={credit.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={smallTextStyle + " flex-1 truncate pr-2"}>
                      {estTermine && <CheckCircle className="w-3 h-3 inline mr-1 text-green-400" />}
                      {credit.categorie}
                    </p>
                    <p className={smallTextStyle}>{Math.round(progression)}%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 bg-[#722F37]/50 rounded-full overflow-hidden border border-[#D4AF37]/20">
                      <div className={`h-full ${getProgressColor(progression)} transition-all duration-500`} style={{ width: `${Math.min(progression, 100)}%` }} />
                    </div>
                    <p className={smallTextStyle + " w-20 text-right"}>{totalRembourse.toFixed(0)} {parametres.devise}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Détail des crédits - ACCORDÉON COMPACT */}
      {credits.length > 0 ? (
        <div className="space-y-3 mb-4">
          <h3 className={sectionTitleStyle + " text-center uppercase tracking-wide"}>
            Détail des Crédits
          </h3>
          
          {credits.map((credit) => {
            const { 
              totalRembourse, resteADu, progression, moisEcoules,
              moisRestants, totalADu, interetsTotal, dateFin, estTermine
            } = getRemboursements(credit);
            
            const isOpen = expandedCredit === credit.id;
            const mensualite = parseFloat(credit.montant || '0');

            return (
              <div 
                key={credit.id} 
                className={`${cardStyle} overflow-hidden p-0 ${estTermine ? 'border-green-500/50' : ''}`}
              >
                {/* En-tête compact - toujours visible */}
                <button 
                  onClick={() => toggleCredit(credit.id)}
                  onTouchEnd={() => toggleCredit(credit.id)}
                  className="w-full p-4 hover:bg-[#D4AF37]/5 transition-colors cursor-pointer"
              
                >
                  {/* Ligne 1: Nom + Badge progression */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {estTermine ? (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                      )}
                      <span className={sectionTitleStyle + " truncate"}>{credit.categorie}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${getProgressColor(progression)}`}>
                        {Math.round(progression)}%
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#D4AF37]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
                      )}
                    </div>
                  </div>

                  {/* Ligne 2: Barre de progression */}
                  <div className="h-2 bg-[#722F37]/50 rounded-full overflow-hidden border border-[#D4AF37]/20 mb-2">
                    <div className={`h-full ${getProgressColor(progression)} transition-all duration-500`} style={{ width: `${Math.min(progression, 100)}%` }} />
                  </div>

                  {/* Ligne 3: Mensualité + Reste */}
                  <div className="flex justify-between items-center">
                    <span className={smallTextStyle}>
                      💳 {mensualite.toFixed(2)} {parametres.devise}/mois
                    </span>
                    <span className={smallTextStyle}>
                      Reste: <span className={estTermine ? 'text-green-400' : 'text-orange-400'}>{resteADu.toFixed(2)} {parametres.devise}</span>
                    </span>
                  </div>
                </button>

                {/* Détails étendus - visible si ouvert */}
                {isOpen && (
                  <div className="border-t border-[#D4AF37]/20 p-4 bg-[#722F37]/20">
                    {/* Grille d'infos 2 colonnes */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-[#722F37]/30 rounded-lg">
                        <p className={smallTextStyle}>Capital</p>
                        <p className={valueStyle}>{parseFloat(credit.capitalTotal || '0').toFixed(2)} {parametres.devise}</p>
                      </div>
                      <div className="p-2 bg-[#722F37]/30 rounded-lg">
                        <p className={smallTextStyle}>Intérêts</p>
                        <p className={valueStyle}>{interetsTotal.toFixed(2)} {parametres.devise}</p>
                      </div>
                      <div className="p-2 bg-[#722F37]/30 rounded-lg">
                        <p className={smallTextStyle}>Durée</p>
                        <p className={valueStyle}>{credit.dureeMois || '-'} mois</p>
                      </div>
                      <div className="p-2 bg-[#722F37]/30 rounded-lg">
                        <p className={smallTextStyle}>Taux</p>
                        <p className={valueStyle}>{credit.tauxInteret || '0'}%</p>
                      </div>
                      <div className="p-2 bg-[#722F37]/30 rounded-lg">
                        <p className={smallTextStyle}>Coût total</p>
                        <p className={valueStyle}>{totalADu.toFixed(2)} {parametres.devise}</p>
                      </div>
                      <div className="p-2 bg-[#722F37]/30 rounded-lg">
                        <p className={smallTextStyle}>Fin prévue</p>
                        <p className={valueStyle}>{formatDate(dateFin)}</p>
                      </div>
                    </div>

                    {/* Progression détaillée */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="p-2 bg-green-500/10 rounded-lg text-center border border-green-500/20">
                        <p className={smallTextStyle}>Remboursé</p>
                        <p className="text-xs font-semibold text-green-400">{totalRembourse.toFixed(0)} {parametres.devise}</p>
                      </div>
                      <div className={`p-2 rounded-lg text-center border ${estTermine ? 'bg-green-500/10 border-green-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                        <p className={smallTextStyle}>Reste dû</p>
                        <p className={`text-xs font-semibold ${estTermine ? 'text-green-400' : 'text-orange-400'}`}>{resteADu.toFixed(0)} {parametres.devise}</p>
                      </div>
                      <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-center border border-[#D4AF37]/20">
                        <p className={smallTextStyle}>Mois restants</p>
                        <p className={`text-xs font-semibold ${moisRestants <= 3 ? 'text-green-400' : 'text-[#D4AF37]'}`}>{moisRestants}</p>
                      </div>
                    </div>

                    {/* Messages contextuels */}
                    {estTermine && (
                      <div className="mt-3 p-2 bg-green-500/20 rounded-lg text-center border border-green-500/30">
                        <p className="text-xs text-green-400 font-medium">🎉 Crédit remboursé !</p>
                      </div>
                    )}
                    {!estTermine && moisRestants <= 3 && moisRestants > 0 && (
                      <div className="mt-3 p-2 bg-[#D4AF37]/20 rounded-lg text-center border border-[#D4AF37]/30">
                        <p className="text-xs text-[#D4AF37] font-medium">🏁 Plus que {moisRestants} mois !</p>
                      </div>
                    )}
                    {credit.memo && (
                      <div className="mt-3 p-2 bg-[#722F37]/30 rounded-lg">
                        <p className={smallTextStyle + " italic"}>📝 {credit.memo}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={cardStyle + " text-center py-8 mb-4"}>
          <AlertTriangle className="w-12 h-12 text-[#D4AF37]/50 mx-auto mb-3" />
          <p className={pageSubtitleStyle + " mb-2"}>Aucun crédit enregistré</p>
          <p className={smallTextStyle}>
            Pour ajouter un crédit, allez dans <strong>Transactions</strong>,
            <br />créez une transaction de type "Factures" et cochez 
            <br /><strong>"C'est un crédit"</strong>
          </p>
        </div>
      )}

      {/* Conseils */}
      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className={conseilIconStyle} />
          <h4 className={conseilTitleStyle}>💡 Conseils</h4>
        </div>
        <div className="space-y-2">
          {tauxEndettement > 35 && (
            <p className={conseilTextStyle}>⚠️ Votre taux d'endettement ({Math.round(tauxEndettement)}%) dépasse le seuil de 35%</p>
          )}
          {tauxEndettement > 0 && tauxEndettement <= 35 && (
            <p className={conseilTextStyle}>✅ Taux d'endettement dans la norme ({Math.round(tauxEndettement)}%)</p>
          )}
          {credits.length === 0 && (
            <p className={conseilTextStyle}>📝 Ajoutez vos crédits dans Transactions pour un suivi automatique</p>
          )}
          {nbCreditsTermines > 0 && (
            <p className={conseilTextStyle}>🎉 Félicitations ! {nbCreditsTermines} crédit(s) terminé(s)</p>
          )}
          {credits.some(c => getRemboursements(c).moisRestants <= 3 && !getRemboursements(c).estTermine) && (
            <p className={conseilTextStyle}>🏁 Certains crédits sont presque terminés !</p>
          )}
          {revenusMensuels === 0 && credits.length > 0 && (
            <p className={conseilTextStyle}>💰 Ajoutez vos revenus pour calculer le taux d'endettement</p>
          )}
          {credits.length > 0 && totalMensualites > 0 && (
            <p className={conseilTextStyle}>📊 Vous remboursez {totalMensualites.toFixed(2)} {parametres.devise}/mois</p>
          )}
        </div>
      </div>
    </div>
  );
}

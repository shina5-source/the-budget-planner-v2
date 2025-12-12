"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, TrendingUp, Home as HomeIcon, Mail, PiggyBank, FileText, RefreshCw, PieChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell } from '@/components';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

type TabType = 'vue' | 'revenus' | 'correctifs' | 'epargne' | 'bilan';
type BilanAccordionType = 'revenus' | 'factures' | 'depenses' | 'epargnes' | null;

function BudgetContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('vue');
  const [bilanAccordion, setBilanAccordion] = useState<BilanAccordionType>(null);

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  useEffect(() => {
    const saved = localStorage.getItem('budget-transactions');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setBilanAccordion(null);
  }, [selectedMonth, selectedYear]);

  const getMonthKey = () => {
    const month = (selectedMonth + 1).toString().padStart(2, '0');
    return `${selectedYear}-${month}`;
  };

  const filteredTransactions = transactions.filter(t => t.date?.startsWith(getMonthKey()));
  const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalFactures = filteredTransactions.filter(t => t.type === 'Factures').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalDepenses = filteredTransactions.filter(t => t.type === 'Dépenses').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalEpargnes = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const solde = totalRevenus - totalFactures - totalDepenses - totalEpargnes;
  const tauxEpargne = totalRevenus > 0 ? ((totalEpargnes / totalRevenus) * 100).toFixed(0) : 0;
  const budgetApresDepenses = totalRevenus - totalFactures;

  const revenusTransactions = filteredTransactions.filter(t => t.type === 'Revenus');
  const facturesTransactions = filteredTransactions.filter(t => t.type === 'Factures');
  const depensesTransactions = filteredTransactions.filter(t => t.type === 'Dépenses');
  const epargnesTransactions = filteredTransactions.filter(t => t.type === 'Épargnes');

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); }
    else setSelectedMonth(selectedMonth - 1);
  };

  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); }
    else setSelectedMonth(selectedMonth + 1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Card = ({ title, amount, subtitle, icon: Icon }: { title: string; amount: number; subtitle: string; icon: any }) => (
    <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs" style={textSecondary}>{title}</p>
          <p className="text-2xl font-semibold mt-1" style={textPrimary}>{amount.toFixed(2)} €</p>
          <p className="text-[10px] mt-1" style={textSecondary}>{subtitle}</p>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
          <Icon className="w-5 h-5" style={textPrimary} />
        </div>
      </div>
    </div>
  );

  const renderVue = () => (
    <div className="space-y-3">
      <Card title="Revenus prévus" amount={totalRevenus} subtitle={`Reçus: ${totalRevenus.toFixed(2)} €`} icon={TrendingUp} />
      <Card title="Dépenses fixes" amount={totalFactures} subtitle={`Payées: ${totalFactures.toFixed(2)} €`} icon={HomeIcon} />
      <Card title="Enveloppes budgétaires" amount={budgetApresDepenses} subtitle={`Dépensé: ${totalDepenses.toFixed(2)} €`} icon={Mail} />
      <Card title="Épargne CT prévu" amount={totalEpargnes} subtitle={`Versé: ${totalEpargnes.toFixed(2)} €`} icon={PiggyBank} />
      <Card title="Solde réel" amount={solde} subtitle="Dépenses réelles" icon={PieChart} />
    </div>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TransactionList = ({ transactions: txList, title, icon: Icon, emptyMessage }: { transactions: Transaction[]; title: string; icon: any; emptyMessage: string }) => {
    const total = txList.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
            <Icon className="w-5 h-5" style={textPrimary} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold" style={textPrimary}>{title}</h3>
            <p className="text-[10px]" style={textSecondary}>{monthsFull[selectedMonth]} {selectedYear}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold" style={textPrimary}>{total.toFixed(2)} €</p>
            <p className="text-[10px]" style={textSecondary}>{txList.length} transaction{txList.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        {txList.length === 0 ? (
          <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
            <p className="text-xs" style={textSecondary}>{emptyMessage}</p>
          </div>
        ) : (
          <div className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden p-0" style={cardStyle}>
            <div style={{ borderColor: theme.colors.cardBorder }}>
              {txList.map((t, index) => (
                <div key={index} className="p-3 flex items-center justify-between" style={{ borderBottomWidth: index < txList.length - 1 ? 1 : 0, borderColor: theme.colors.cardBorder }}>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={textPrimary}>{t.categorie}</p>
                    <p className="text-[10px]" style={textSecondary}>{t.date}</p>
                  </div>
                  <p className="text-sm font-semibold" style={textPrimary}>{parseFloat(t.montant).toFixed(2)} €</p>
                </div>
              ))}
            </div>
            <div className="p-3 flex items-center justify-between" style={{ background: theme.colors.cardBackgroundLight, borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
              <p className="text-sm font-medium" style={textPrimary}>Total</p>
              <p className="text-sm font-bold" style={textPrimary}>{total.toFixed(2)} €</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRevenus = () => <TransactionList transactions={revenusTransactions} title="Revenus mensuels" icon={TrendingUp} emptyMessage="Aucun revenu enregistré pour ce mois" />;

  const renderEpargne = () => (
    <div className="space-y-4">
      <TransactionList transactions={epargnesTransactions} title="Épargnes du mois" icon={PiggyBank} emptyMessage="Aucune épargne enregistrée pour ce mois" />
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
        <p className="text-xs mb-1" style={textSecondary}>Total épargné ce mois</p>
        <p className="text-2xl font-semibold" style={textPrimary}>{totalEpargnes.toFixed(2)} €</p>
        <div className="mt-3 rounded-xl p-3 inline-block border" style={{ background: `${theme.colors.primary}10`, borderColor: theme.colors.cardBorder }}>
          <p className="text-[10px]" style={textSecondary}>Taux d&apos;épargne</p>
          <p className="text-xl font-semibold" style={textPrimary}>{tauxEpargne} %</p>
        </div>
      </div>
    </div>
  );

  const renderCorrectifs = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
          <RefreshCw className="w-5 h-5" style={textPrimary} />
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={textPrimary}>Correctifs & Analyse</h3>
          <p className="text-[10px]" style={textSecondary}>{monthsFull[selectedMonth]} {selectedYear}</p>
        </div>
      </div>
      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border" style={cardStyle}>
        <h4 className="text-xs font-semibold mb-3" style={textSecondary}>📊 Résumé du mois</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}>
            <span className="text-xs" style={textSecondary}>Revenus totaux</span>
            <span className="text-xs font-medium" style={textPrimary}>+ {totalRevenus.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}>
            <span className="text-xs" style={textSecondary}>Dépenses fixes</span>
            <span className="text-xs font-medium" style={textPrimary}>- {totalFactures.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}>
            <span className="text-xs" style={textSecondary}>Dépenses variables</span>
            <span className="text-xs font-medium" style={textPrimary}>- {totalDepenses.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}>
            <span className="text-xs" style={textSecondary}>Épargnes</span>
            <span className="text-xs font-medium" style={textPrimary}>- {totalEpargnes.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs font-semibold" style={textSecondary}>Solde final</span>
            <span className="text-xs font-bold" style={textPrimary}>{solde >= 0 ? '+ ' : ''}{solde.toFixed(2)} €</span>
          </div>
        </div>
      </div>
      <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50">
        <h4 className="text-xs font-semibold text-[#7DD3A8] mb-3">💡 Conseils</h4>
        <div className="space-y-2">
          {totalDepenses > budgetApresDepenses && (
            <div className="bg-[#2E5A4C]/30 rounded-xl p-3 border border-[#7DD3A8]/30">
              <p className="text-[10px] text-[#7DD3A8]">⚠️ Vos dépenses variables dépassent votre budget de {(totalDepenses - budgetApresDepenses).toFixed(2)} €</p>
            </div>
          )}
          {totalEpargnes === 0 && totalRevenus > 0 && (
            <div className="bg-[#2E5A4C]/30 rounded-xl p-3 border border-[#7DD3A8]/30">
              <p className="text-[10px] text-[#7DD3A8]">💰 Pensez à épargner au moins 10% ({(totalRevenus * 0.1).toFixed(2)} €)</p>
            </div>
          )}
          {solde >= 0 && totalEpargnes > 0 && (
            <div className="bg-[#2E5A4C]/30 rounded-xl p-3 border border-[#7DD3A8]/30">
              <p className="text-[10px] text-[#7DD3A8]">✅ Bravo ! Solde positif et épargne active !</p>
            </div>
          )}
          {filteredTransactions.length === 0 && (
            <div className="bg-[#2E5A4C]/30 rounded-xl p-3 border border-[#7DD3A8]/30">
              <p className="text-[10px] text-[#7DD3A8]">📝 Aucune transaction. Commencez à enregistrer !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBilan = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AccordionSection = ({ title, icon: Icon, transactions: sectionTransactions, total, isExpense = true, sectionKey }: { title: string; icon: any; transactions: Transaction[]; total: number; isExpense?: boolean; sectionKey: BilanAccordionType }) => {
      const isOpen = bilanAccordion === sectionKey;
      const prefix = isExpense ? '-' : '+';
      const count = sectionTransactions.length;

      return (
        <div className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden p-0" style={cardStyle}>
          <button onClick={() => setBilanAccordion(isOpen ? null : sectionKey)} className="w-full flex items-center justify-between p-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
                <Icon className="w-4 h-4" style={textPrimary} />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium" style={textPrimary}>{title}</span>
                <span className="text-[10px] block" style={textSecondary}>{count} élément{count > 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${isExpense ? 'text-red-400' : 'text-green-400'}`}>{prefix} {total.toFixed(2)} €</span>
              {isOpen ? <ChevronUp className="w-5 h-5" style={textPrimary} /> : <ChevronDown className="w-5 h-5" style={textPrimary} />}
            </div>
          </button>

          {isOpen && (
            <div style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
              {sectionTransactions.length === 0 ? (
                <p className="text-[10px] text-center py-4" style={textSecondary}>Aucun élément ce mois</p>
              ) : (
                <div>
                  {sectionTransactions.map((t, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-2" style={{ borderBottomWidth: i < sectionTransactions.length - 1 ? 1 : 0, borderColor: theme.colors.cardBorder }}>
                      <span className="text-xs" style={textSecondary}>{t.categorie}</span>
                      <span className="text-xs font-medium" style={textPrimary}>{prefix} {parseFloat(t.montant).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="px-4 py-3 flex justify-between items-center" style={{ background: theme.colors.cardBackgroundLight, borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
                <span className="text-sm font-medium" style={textPrimary}>Total</span>
                <span className="text-sm font-bold" style={textPrimary}>{prefix} {total.toFixed(2)} €</span>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
            <FileText className="w-5 h-5" style={textPrimary} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={textPrimary}>Bilan mensuel</h3>
            <p className="text-[10px]" style={textSecondary}>{monthsFull[selectedMonth]} {selectedYear}</p>
          </div>
        </div>

        <AccordionSection title="Revenus mensuels" icon={TrendingUp} transactions={revenusTransactions} total={totalRevenus} isExpense={false} sectionKey="revenus" />
        <AccordionSection title="Dépenses fixes" icon={HomeIcon} transactions={facturesTransactions} total={totalFactures} isExpense={true} sectionKey="factures" />
        <AccordionSection title="Dépenses variables" icon={Mail} transactions={depensesTransactions} total={totalDepenses} isExpense={true} sectionKey="depenses" />
        <AccordionSection title="Épargnes" icon={PiggyBank} transactions={epargnesTransactions} total={totalEpargnes} isExpense={true} sectionKey="epargnes" />

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border text-center" style={cardStyle}>
          <p className="text-xs mb-1" style={textSecondary}>Solde du mois</p>
          <p className={`text-3xl font-semibold ${solde >= 0 ? 'text-green-400' : 'text-red-400'}`}>{solde >= 0 ? '+' : ''}{solde.toFixed(2)} €</p>
          <div className="rounded-xl p-3 mt-4 inline-flex items-center gap-2 border" style={{ background: `${theme.colors.primary}10`, borderColor: theme.colors.cardBorder }}>
            <PiggyBank className="w-4 h-4" style={textPrimary} />
            <span className="text-xs" style={textSecondary}>Taux d&apos;épargne</span>
          </div>
          <p className="text-2xl font-semibold mt-2" style={textPrimary}>{tauxEpargne} %</p>
          {solde > 0 ? (
            <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 inline-block">✨ Excellent ! Solde positif de {solde.toFixed(2)} €</p>
          ) : solde < 0 ? (
            <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 inline-block">⚠️ Attention ! Solde négatif de {Math.abs(solde).toFixed(2)} €</p>
          ) : (
            <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 inline-block">➖ Solde à l&apos;équilibre : 0.00 €</p>
          )}
        </div>
      </div>
    );
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'vue', label: 'Vue' },
    { id: 'revenus', label: 'Revenus' },
    { id: 'correctifs', label: 'Correctifs' },
    { id: 'epargne', label: 'Épargne' },
    { id: 'bilan', label: 'Bilan' },
  ];

  return (
    <div className="pb-4">
      <div className="text-center mb-4">
        <h1 className="text-lg font-medium" style={textPrimary}>Budget</h1>
        <p className="text-xs" style={textSecondary}>Vue d&apos;ensemble de {monthsFull[selectedMonth]} {selectedYear}</p>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5" style={textPrimary} /></button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold" style={textPrimary}>{monthsFull[selectedMonth]}</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="rounded-lg px-3 py-1 text-lg font-semibold border" style={inputStyle}>
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5" style={textPrimary} /></button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {monthsShort.map((month, index) => (
            <button key={index} onClick={() => setSelectedMonth(index)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" style={selectedMonth === index ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>{month}</button>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-sm rounded-2xl p-1 shadow-sm mb-4 flex border" style={cardStyle}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-colors" style={activeTab === tab.id ? { background: theme.colors.primary, color: theme.colors.textOnPrimary } : { color: theme.colors.textSecondary }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'vue' && renderVue()}
      {activeTab === 'revenus' && renderRevenus()}
      {activeTab === 'correctifs' && renderCorrectifs()}
      {activeTab === 'epargne' && renderEpargne()}
      {activeTab === 'bilan' && renderBilan()}
    </div>
  );
}

export default function BudgetPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="budget" onNavigate={handleNavigate}>
      <BudgetContent />
    </AppShell>
  );
}
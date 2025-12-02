"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Home as HomeIcon, Mail, PiggyBank, FileText, RefreshCw, PieChart } from 'lucide-react';

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

export default function BudgetPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('vue');

  useEffect(() => {
    const saved = localStorage.getItem('budget-transactions');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

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

  // STYLES UNIFORMISÉS - À utiliser sur toutes les pages
  const cardStyle = "bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#D4AF37]/40";
  const pageTitleStyle = "text-lg font-medium text-[#D4AF37]";
  const pageSubtitleStyle = "text-xs text-[#D4AF37]/70";
  const cardTitleStyle = "text-xs text-[#D4AF37]/80";
  const amountLargeStyle = "text-2xl font-semibold text-[#D4AF37]";
  const amountMediumStyle = "text-lg font-semibold text-[#D4AF37]";
  const smallTextStyle = "text-[10px] text-[#D4AF37]/60";
  const labelStyle = "text-xs text-[#D4AF37]/80";
  const valueStyle = "text-xs font-medium text-[#D4AF37]";
  const sectionTitleStyle = "text-sm font-semibold text-[#D4AF37]";

  // STYLE CONSEILS - Vert menthe
  const conseilCardStyle = "bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50";
  const conseilTitleStyle = "text-xs font-semibold text-[#7DD3A8]";
  const conseilTextStyle = "text-[10px] text-[#7DD3A8]";
  const conseilItemStyle = "bg-[#2E5A4C]/30 rounded-xl p-3 border border-[#7DD3A8]/30";

  const Card = ({ title, amount, subtitle, icon: Icon }: { title: string; amount: number; subtitle: string; icon: any }) => (
    <div className={cardStyle}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cardTitleStyle}>{title}</p>
          <p className={amountLargeStyle + " mt-1"}>{amount.toFixed(2)} €</p>
          <p className={smallTextStyle + " mt-1"}>{subtitle}</p>
        </div>
        <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/50">
          <Icon className="w-5 h-5 text-[#D4AF37]" />
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

  const TransactionList = ({ transactions, title, icon: Icon, emptyMessage }: { transactions: Transaction[]; title: string; icon: any; emptyMessage: string }) => {
    const total = transactions.reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center border border-[#D4AF37]/50">
            <Icon className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="flex-1">
            <h3 className={sectionTitleStyle}>{title}</h3>
            <p className={smallTextStyle}>{monthsFull[selectedMonth]} {selectedYear}</p>
          </div>
          <div className="text-right">
            <p className={amountMediumStyle}>{total.toFixed(2)} €</p>
            <p className={smallTextStyle}>{transactions.length} transaction{transactions.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        {transactions.length === 0 ? (
          <div className={cardStyle + " text-center"}>
            <p className={pageSubtitleStyle}>{emptyMessage}</p>
          </div>
        ) : (
          <div className={cardStyle + " overflow-hidden p-0"}>
            <div className="divide-y divide-[#D4AF37]/20">
              {transactions.map((t, index) => (
                <div key={index} className="p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#D4AF37]">{t.categorie}</p>
                    <p className={smallTextStyle}>{t.date}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#D4AF37]">{parseFloat(t.montant).toFixed(2)} €</p>
                </div>
              ))}
            </div>
            <div className="bg-[#722F37]/50 p-3 flex items-center justify-between border-t border-[#D4AF37]/30">
              <p className="text-sm font-medium text-[#D4AF37]">Total</p>
              <p className="text-sm font-bold text-[#D4AF37]">{total.toFixed(2)} €</p>
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
      <div className={cardStyle + " text-center"}>
        <p className={pageSubtitleStyle + " mb-1"}>Total épargné ce mois</p>
        <p className={amountLargeStyle}>{totalEpargnes.toFixed(2)} €</p>
        <div className="mt-3 bg-[#D4AF37]/10 rounded-xl p-3 inline-block border border-[#D4AF37]/30">
          <p className={smallTextStyle}>Taux d'épargne</p>
          <p className="text-xl font-semibold text-[#D4AF37]">{tauxEpargne} %</p>
        </div>
      </div>
    </div>
  );

  const renderCorrectifs = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center border border-[#D4AF37]/50">
          <RefreshCw className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className={sectionTitleStyle}>Correctifs & Analyse</h3>
          <p className={smallTextStyle}>{monthsFull[selectedMonth]} {selectedYear}</p>
        </div>
      </div>
      <div className={cardStyle}>
        <h4 className={cardTitleStyle + " font-semibold mb-3"}>📊 Résumé du mois</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={labelStyle}>Revenus totaux</span>
            <span className={valueStyle}>+ {totalRevenus.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={labelStyle}>Dépenses fixes</span>
            <span className={valueStyle}>- {totalFactures.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={labelStyle}>Dépenses variables</span>
            <span className={valueStyle}>- {totalDepenses.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={labelStyle}>Épargnes</span>
            <span className={valueStyle}>- {totalEpargnes.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className={labelStyle + " font-semibold"}>Solde final</span>
            <span className={valueStyle + " font-bold"}>{solde >= 0 ? '+ ' : ''}{solde.toFixed(2)} €</span>
          </div>
        </div>
      </div>
      <div className={conseilCardStyle}>
        <h4 className={conseilTitleStyle + " mb-3"}>💡 Conseils</h4>
        <div className="space-y-2">
          {totalDepenses > budgetApresDepenses && (
            <div className={conseilItemStyle}>
              <p className={conseilTextStyle}>⚠️ Vos dépenses variables dépassent votre budget de {(totalDepenses - budgetApresDepenses).toFixed(2)} €</p>
            </div>
          )}
          {totalEpargnes === 0 && totalRevenus > 0 && (
            <div className={conseilItemStyle}>
              <p className={conseilTextStyle}>💰 Pensez à épargner au moins 10% ({(totalRevenus * 0.1).toFixed(2)} €)</p>
            </div>
          )}
          {solde >= 0 && totalEpargnes > 0 && (
            <div className={conseilItemStyle}>
              <p className={conseilTextStyle}>✅ Bravo ! Solde positif et épargne active !</p>
            </div>
          )}
          {filteredTransactions.length === 0 && (
            <div className={conseilItemStyle}>
              <p className={conseilTextStyle}>📝 Aucune transaction. Commencez à enregistrer !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBilan = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center border border-[#D4AF37]/50">
          <FileText className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className={sectionTitleStyle}>Bilan mensuel</h3>
          <p className={smallTextStyle}>{monthsFull[selectedMonth]} {selectedYear}</p>
        </div>
      </div>

      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm font-medium text-[#D4AF37]">Revenus mensuels</span>
        </div>
        {revenusTransactions.length === 0 ? (
          <p className={smallTextStyle}>Aucun revenu ce mois</p>
        ) : (
          <div className="space-y-2">
            {revenusTransactions.map((t, i) => (
              <div key={i} className="flex justify-between">
                <span className={labelStyle}>{t.categorie}</span>
                <span className={valueStyle}>+ {parseFloat(t.montant).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-[#D4AF37]/20 mt-3 pt-3 flex justify-between">
          <span className={labelStyle}>Revenus totaux</span>
          <span className={valueStyle}>{totalRevenus.toFixed(2)} €</span>
        </div>
      </div>

      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <HomeIcon className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm font-medium text-[#D4AF37]">Dépenses fixes</span>
        </div>
        {facturesTransactions.length === 0 ? (
          <p className={smallTextStyle}>Aucune dépense fixe ce mois</p>
        ) : (
          <div className="space-y-2">
            {facturesTransactions.map((t, i) => (
              <div key={i} className="flex justify-between">
                <span className={labelStyle}>{t.categorie}</span>
                <span className={valueStyle}>- {parseFloat(t.montant).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-[#D4AF37]/20 mt-3 pt-3 flex justify-between">
          <span className={labelStyle}>Total</span>
          <span className={valueStyle}>- {totalFactures.toFixed(2)} €</span>
        </div>
      </div>

      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm font-medium text-[#D4AF37]">Dépenses variables</span>
        </div>
        {depensesTransactions.length === 0 ? (
          <p className={smallTextStyle + " text-center py-2"}>Aucune dépense variable</p>
        ) : (
          <div className="space-y-2">
            {depensesTransactions.map((t, i) => (
              <div key={i} className="flex justify-between">
                <span className={labelStyle}>{t.categorie}</span>
                <span className={valueStyle}>- {parseFloat(t.montant).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-[#D4AF37]/20 mt-3 pt-3 flex justify-between">
          <span className="text-sm font-medium text-[#D4AF37]">Total</span>
          <span className={valueStyle}>- {totalDepenses.toFixed(2)} €</span>
        </div>
      </div>

      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <PiggyBank className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm font-medium text-[#D4AF37]">Épargnes</span>
        </div>
        {epargnesTransactions.length === 0 ? (
          <p className={smallTextStyle}>Aucune épargne ce mois</p>
        ) : (
          <div className="space-y-2">
            {epargnesTransactions.map((t, i) => (
              <div key={i} className="flex justify-between">
                <span className={labelStyle}>{t.categorie}</span>
                <span className={valueStyle}>{parseFloat(t.montant).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-[#D4AF37]/20 mt-3 pt-3 flex justify-between">
          <span className={labelStyle}>Total</span>
          <span className={valueStyle}>{totalEpargnes.toFixed(2)} €</span>
        </div>
      </div>

      <div className={cardStyle + " text-center"}>
        <p className={pageSubtitleStyle + " mb-1"}>Solde du mois</p>
        <p className="text-3xl font-semibold text-[#D4AF37]">{solde >= 0 ? '+' : ''}{solde.toFixed(2)} €</p>
        <div className="bg-[#D4AF37]/10 rounded-xl p-3 mt-4 inline-flex items-center gap-2 border border-[#D4AF37]/30">
          <PiggyBank className="w-4 h-4 text-[#D4AF37]" />
          <span className={labelStyle}>Taux d'épargne</span>
        </div>
        <p className="text-2xl font-semibold mt-2 text-[#D4AF37]">{tauxEpargne} %</p>
        {solde > 0 ? (
          <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 inline-block">✨ Excellent ! Solde positif de {solde.toFixed(2)} €</p>
        ) : solde < 0 ? (
          <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 inline-block">⚠️ Attention ! Solde négatif de {Math.abs(solde).toFixed(2)} €</p>
        ) : (
          <p className="text-xs mt-3 px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 inline-block">➖ Solde à l'équilibre : 0.00 €</p>
        )}
      </div>
    </div>
  );

  const tabs: { id: TabType; label: string }[] = [
    { id: 'vue', label: 'Vue' },
    { id: 'revenus', label: 'Revenus' },
    { id: 'correctifs', label: 'Correctifs' },
    { id: 'epargne', label: 'Épargne' },
    { id: 'bilan', label: 'Bilan' },
  ];

  return (
    <div className="pb-4">
      {/* Titre centré */}
      <div className="text-center mb-4">
        <h1 className={pageTitleStyle}>Budget</h1>
        <p className={pageSubtitleStyle}>Vue d'ensemble de {monthsFull[selectedMonth]} {selectedYear}</p>
      </div>

      {/* Sélecteur de mois - UN SEUL menu déroulant pour l'année */}
      <div className={cardStyle + " mb-4"}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="w-5 h-5 text-[#D4AF37]" /></button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#D4AF37]">{monthsFull[selectedMonth]}</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-lg px-3 py-1 text-lg font-semibold text-[#D4AF37]">
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="w-5 h-5 text-[#D4AF37]" /></button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {monthsShort.map((month, index) => (
            <button key={index} onClick={() => setSelectedMonth(index)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedMonth === index ? 'bg-[#D4AF37] text-[#722F37] border-[#D4AF37]' : 'bg-transparent text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'}`}>{month}</button>
          ))}
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-1 shadow-sm mb-4 flex border border-[#D4AF37]/40">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-colors ${activeTab === tab.id ? 'bg-[#D4AF37] text-[#722F37]' : 'text-[#D4AF37]/70 hover:bg-[#D4AF37]/20'}`}>{tab.label}</button>
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

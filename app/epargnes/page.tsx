"use client";

import { useState, useEffect } from 'react';
import { PiggyBank, Plus, TrendingUp, Target, Wallet, ChevronLeft, ChevronRight, Edit3, Trash2, X, Check, Lightbulb } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

interface ObjectifEpargne {
  id: number;
  nom: string;
  objectif: number;
  actuel: number;
  dateDebut: string;
  dateFin?: string;
}

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

type TabType = 'resume' | 'mensuel' | 'objectifs' | 'historique';

// PAGINATION
const ITEMS_PER_PAGE = 50;

export default function EpargnesPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [objectifs, setObjectifs] = useState<ObjectifEpargne[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // PAGINATION STATE
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const [formData, setFormData] = useState({
    nom: '',
    objectif: '',
    actuel: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: ''
  });

  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

    const savedObjectifs = localStorage.getItem('budget-objectifs-epargne');
    if (savedObjectifs) setObjectifs(JSON.parse(savedObjectifs));
  }, []);

  // Réinitialiser la pagination quand on change de mois
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [selectedMonth, selectedYear]);

  const saveObjectifs = (newObjectifs: ObjectifEpargne[]) => {
    setObjectifs(newObjectifs);
    localStorage.setItem('budget-objectifs-epargne', JSON.stringify(newObjectifs));
  };

  const getMonthKey = () => {
    const month = (selectedMonth + 1).toString().padStart(2, '0');
    return `${selectedYear}-${month}`;
  };

  const filteredTransactions = transactions.filter(t => t.date?.startsWith(getMonthKey()));

  // Calculs
  const totalEpargnesMois = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalReprisesMois = filteredTransactions.filter(t => t.type === 'Reprise d\'épargne').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const netEpargneMois = totalEpargnesMois - totalReprisesMois;
  const totalRevenus = filteredTransactions.filter(t => t.type === 'Revenus').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const tauxEpargne = totalRevenus > 0 ? ((totalEpargnesMois / totalRevenus) * 100).toFixed(1) : 0;

  // Total épargne globale
  const totalEpargneGlobale = transactions.filter(t => t.type === 'Épargnes').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const totalReprisesGlobale = transactions.filter(t => t.type === 'Reprise d\'épargne').reduce((sum, t) => sum + parseFloat(t.montant || '0'), 0);
  const soldeEpargneGlobal = totalEpargneGlobale - totalReprisesGlobale;

  // Épargnes par catégorie
  const epargnesParCategorie = filteredTransactions.filter(t => t.type === 'Épargnes').reduce((acc, t) => {
    const cat = t.categorie;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += parseFloat(t.montant || '0');
    return acc;
  }, {} as { [key: string]: number });

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); }
    else setSelectedMonth(selectedMonth - 1);
  };

  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); }
    else setSelectedMonth(selectedMonth + 1);
  };

  const resetForm = () => {
    setFormData({ nom: '', objectif: '', actuel: '', dateDebut: new Date().toISOString().split('T')[0], dateFin: '' });
  };

  const handleSubmit = () => {
    if (!formData.nom || !formData.objectif) return;

    if (editingId !== null) {
      const updated = objectifs.map(o => o.id === editingId ? {
        ...o, nom: formData.nom, objectif: parseFloat(formData.objectif), actuel: parseFloat(formData.actuel || '0'),
        dateDebut: formData.dateDebut, dateFin: formData.dateFin || undefined
      } : o);
      saveObjectifs(updated);
      setEditingId(null);
    } else {
      const newObjectif: ObjectifEpargne = {
        id: Date.now(), nom: formData.nom, objectif: parseFloat(formData.objectif), actuel: parseFloat(formData.actuel || '0'),
        dateDebut: formData.dateDebut, dateFin: formData.dateFin || undefined
      };
      saveObjectifs([...objectifs, newObjectif]);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (objectif: ObjectifEpargne) => {
    setFormData({ nom: objectif.nom, objectif: objectif.objectif.toString(), actuel: objectif.actuel.toString(), dateDebut: objectif.dateDebut, dateFin: objectif.dateFin || '' });
    setEditingId(objectif.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => saveObjectifs(objectifs.filter(o => o.id !== id));

  // Fonction pour charger plus
  const loadMore = () => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };

  // STYLES UNIFORMISÉS
  const cardStyle = "bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#D4AF37]/40";
  const pageTitleStyle = "text-lg font-medium text-[#D4AF37]";
  const pageSubtitleStyle = "text-xs text-[#D4AF37]/70";
  const cardTitleStyle = "text-xs text-[#D4AF37]/80";
  const amountLargeStyle = "text-2xl font-semibold text-[#D4AF37]";
  const amountMediumStyle = "text-lg font-semibold text-[#D4AF37]";
  const smallTextStyle = "text-[10px] text-[#D4AF37]/60";
  const labelStyle = "text-xs font-medium text-[#D4AF37] mb-1 block";
  const valueStyle = "text-xs font-medium text-[#D4AF37]";
  const sectionTitleStyle = "text-sm font-semibold text-[#D4AF37]";
  const inputStyle = "w-full bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-sm text-[#D4AF37] placeholder-[#D4AF37]/50 focus:outline-none focus:border-[#D4AF37]";

  // STYLE SPÉCIAL POUR LES CONSEILS - Vert menthe
  const conseilCardStyle = "bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50";
  const conseilTitleStyle = "text-xs font-semibold text-[#7DD3A8]";
  const conseilTextStyle = "text-[10px] text-[#7DD3A8]";
  const conseilIconStyle = "w-4 h-4 text-[#7DD3A8]";

  const renderResume = () => (
    <div className="space-y-4">
      {/* Solde global */}
      <div className={cardStyle + " text-center"}>
        <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-[#D4AF37]/50">
          <PiggyBank className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <p className={pageSubtitleStyle}>Épargne totale</p>
        <p className="text-3xl font-semibold text-[#D4AF37] mt-1">{soldeEpargneGlobal.toFixed(2)} €</p>
        <p className={smallTextStyle + " mt-2"}>Cumul de tous vos versements</p>
      </div>

      {/* Stats du mois */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cardStyle + " text-center"}>
          <TrendingUp className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
          <p className={smallTextStyle}>Épargné ce mois</p>
          <p className={amountMediumStyle}>+{totalEpargnesMois.toFixed(2)} €</p>
        </div>
        <div className={cardStyle + " text-center"}>
          <Wallet className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
          <p className={smallTextStyle}>Reprises ce mois</p>
          <p className={amountMediumStyle}>-{totalReprisesMois.toFixed(2)} €</p>
        </div>
      </div>

      {/* Taux d'épargne */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between mb-3">
          <p className={sectionTitleStyle}>Taux d'épargne</p>
          <p className={amountMediumStyle}>{tauxEpargne}%</p>
        </div>
        <div className="w-full bg-[#722F37]/50 rounded-full h-3">
          <div className="bg-[#D4AF37] h-3 rounded-full transition-all" style={{ width: `${Math.min(Number(tauxEpargne), 100)}%` }} />
        </div>
        <p className={smallTextStyle + " mt-2"}>Objectif recommandé : 10-20%</p>
      </div>

      {/* Net du mois */}
      <div className={cardStyle + " text-center"}>
        <p className={pageSubtitleStyle}>Net épargne du mois</p>
        <p className={amountLargeStyle + " mt-1"}>{netEpargneMois >= 0 ? '+' : ''}{netEpargneMois.toFixed(2)} €</p>
      </div>

      {/* Conseils - COULEUR VERTE */}
      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className={conseilIconStyle} />
          <h4 className={conseilTitleStyle}>💡 Conseils épargne</h4>
        </div>
        <div className="space-y-2">
          {Number(tauxEpargne) < 10 && totalRevenus > 0 && (
            <p className={conseilTextStyle}>📌 Essayez d'atteindre un taux d'épargne de 10% minimum ({(totalRevenus * 0.1).toFixed(2)} €)</p>
          )}
          {Number(tauxEpargne) >= 10 && Number(tauxEpargne) < 20 && (
            <p className={conseilTextStyle}>✅ Bon taux d'épargne ! Visez 20% pour plus de sécurité</p>
          )}
          {Number(tauxEpargne) >= 20 && (
            <p className={conseilTextStyle}>🎉 Excellent ! Vous épargnez plus de 20% de vos revenus</p>
          )}
          {totalReprisesMois > totalEpargnesMois && (
            <p className={conseilTextStyle}>⚠️ Attention, vos reprises dépassent vos versements ce mois</p>
          )}
          {objectifs.length === 0 && (
            <p className={conseilTextStyle}>🎯 Créez des objectifs d'épargne pour mieux vous motiver !</p>
          )}
          {filteredTransactions.filter(t => t.type === 'Épargnes').length === 0 && (
            <p className={conseilTextStyle}>📝 Aucune épargne ce mois. Pensez à mettre de côté !</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderMensuel = () => (
    <div className="space-y-4">
      <div className={cardStyle}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center border border-[#D4AF37]/50">
            <PiggyBank className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className={sectionTitleStyle}>Détail du mois</h3>
            <p className={smallTextStyle}>{monthsFull[selectedMonth]} {selectedYear}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={labelStyle}>Total épargné</span>
            <span className={valueStyle}>+{totalEpargnesMois.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#D4AF37]/20">
            <span className={labelStyle}>Reprises</span>
            <span className={valueStyle}>-{totalReprisesMois.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className={labelStyle + " font-semibold"}>Net</span>
            <span className={valueStyle + " font-bold"}>{netEpargneMois >= 0 ? '+' : ''}{netEpargneMois.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <div className={cardStyle}>
        <h4 className={cardTitleStyle + " font-semibold mb-3"}>Par catégorie</h4>
        {Object.keys(epargnesParCategorie).length === 0 ? (
          <p className={pageSubtitleStyle + " text-center py-4"}>Aucune épargne ce mois</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(epargnesParCategorie).map(([cat, montant]) => (
              <div key={cat} className="flex justify-between items-center py-2 border-b border-[#D4AF37]/10">
                <span className={labelStyle}>{cat}</span>
                <span className={valueStyle}>{montant.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conseil Mensuel - COULEUR VERTE */}
      <div className={conseilCardStyle}>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className={conseilIconStyle} />
          <span className={conseilTitleStyle}>Conseil</span>
        </div>
        {netEpargneMois >= 0 ? (
          <p className={conseilTextStyle}>✅ Bonne gestion ! Vous avez épargné {netEpargneMois.toFixed(2)} € net ce mois</p>
        ) : (
          <p className={conseilTextStyle}>⚠️ Solde négatif : vous avez repris plus que versé ce mois</p>
        )}
      </div>
    </div>
  );

  const renderObjectifs = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={sectionTitleStyle}>Mes objectifs</h3>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1 px-3 py-1.5 bg-[#D4AF37] text-[#722F37] rounded-lg text-xs font-medium">
          <Plus className="w-3 h-3" />Ajouter
        </button>
      </div>

      {objectifs.length === 0 ? (
        <div className={cardStyle + " text-center py-8"}>
          <Target className="w-12 h-12 text-[#D4AF37]/30 mx-auto mb-3" />
          <p className={pageSubtitleStyle}>Aucun objectif d'épargne</p>
          <p className={smallTextStyle + " mt-1"}>Créez votre premier objectif !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {objectifs.map((objectif) => {
            const pourcentage = objectif.objectif > 0 ? ((objectif.actuel / objectif.objectif) * 100).toFixed(0) : 0;
            return (
              <div key={objectif.id} className={cardStyle}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className={sectionTitleStyle}>{objectif.nom}</p>
                    <p className={smallTextStyle}>{objectif.actuel.toFixed(2)} € / {objectif.objectif.toFixed(2)} €</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(objectif)} className="p-1.5 hover:bg-[#D4AF37]/20 rounded-lg">
                      <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                    <button onClick={() => handleDelete(objectif.id)} className="p-1.5 hover:bg-[#D4AF37]/20 rounded-lg">
                      <Trash2 className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>
                <div className="w-full bg-[#722F37]/50 rounded-full h-2 mb-2">
                  <div className="bg-[#D4AF37] h-2 rounded-full transition-all" style={{ width: `${Math.min(Number(pourcentage), 100)}%` }} />
                </div>
                <div className="flex justify-between">
                  <span className={smallTextStyle}>{pourcentage}% atteint</span>
                  <span className={smallTextStyle}>Reste : {(objectif.objectif - objectif.actuel).toFixed(2)} €</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Conseil Objectifs - COULEUR VERTE */}
      {objectifs.length > 0 && (
        <div className={conseilCardStyle}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className={conseilIconStyle} />
            <span className={conseilTitleStyle}>Conseil</span>
          </div>
          {objectifs.some(o => o.actuel >= o.objectif) ? (
            <p className={conseilTextStyle}>🎉 Félicitations ! Vous avez atteint au moins un objectif !</p>
          ) : (
            <p className={conseilTextStyle}>💪 Continuez vos efforts pour atteindre vos objectifs !</p>
          )}
        </div>
      )}
    </div>
  );

  const renderHistorique = () => {
    const epargnesTransactions = filteredTransactions
      .filter(t => t.type === 'Épargnes' || t.type === 'Reprise d\'épargne')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // PAGINATION
    const displayedTransactions = epargnesTransactions.slice(0, displayCount);
    const hasMore = displayCount < epargnesTransactions.length;
    const remainingCount = epargnesTransactions.length - displayCount;

    return (
      <div className="space-y-4">
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={cardTitleStyle + " font-semibold"}>Mouvements - {monthsFull[selectedMonth]} {selectedYear}</h4>
            {/* Compteur de pagination */}
            {epargnesTransactions.length > 0 && (
              <span className={smallTextStyle}>
                {displayedTransactions.length} sur {epargnesTransactions.length}
              </span>
            )}
          </div>

          {displayedTransactions.length === 0 ? (
            <p className={pageSubtitleStyle + " text-center py-8"}>Aucun mouvement ce mois</p>
          ) : (
            <div className="space-y-2">
              {displayedTransactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#D4AF37]/10">
                  <div>
                    <p className="text-sm font-medium text-[#D4AF37]">{t.categorie}</p>
                    <p className={smallTextStyle}>{t.date} • {t.type}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#D4AF37]">{t.type === 'Épargnes' ? '+' : '-'}{parseFloat(t.montant).toFixed(2)} €</p>
                </div>
              ))}

              {/* Bouton Voir plus */}
              {hasMore && (
                <button
                  onClick={loadMore}
                  className="w-full py-3 mt-3 border-2 border-dashed border-[#D4AF37]/50 rounded-xl text-sm font-medium text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                >
                  Voir plus ({remainingCount} restant{remainingCount > 1 ? 's' : ''})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Conseil Historique - COULEUR VERTE */}
        <div className={conseilCardStyle}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className={conseilIconStyle} />
            <span className={conseilTitleStyle}>Conseil</span>
          </div>
          {epargnesTransactions.length > 0 ? (
            <p className={conseilTextStyle}>📊 {epargnesTransactions.length} mouvement(s) ce mois pour un net de {netEpargneMois.toFixed(2)} €</p>
          ) : (
            <p className={conseilTextStyle}>📝 Aucun mouvement d'épargne ce mois</p>
          )}
        </div>
      </div>
    );
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'resume', label: 'Résumé' },
    { id: 'mensuel', label: 'Mensuel' },
    { id: 'objectifs', label: 'Objectifs' },
    { id: 'historique', label: 'Historique' },
  ];

  return (
    <div className="pb-4">
      {/* Titre centré */}
      <div className="text-center mb-4">
        <h1 className={pageTitleStyle}>Épargnes</h1>
        <p className={pageSubtitleStyle}>Suivi de votre épargne</p>
      </div>

      {/* Sélecteur de mois */}
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

      {/* Contenu */}
      {activeTab === 'resume' && renderResume()}
      {activeTab === 'mensuel' && renderMensuel()}
      {activeTab === 'objectifs' && renderObjectifs()}
      {activeTab === 'historique' && renderHistorique()}

      {/* Modal formulaire objectif */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#8B4557] rounded-2xl p-4 w-full max-w-md border border-[#D4AF37]/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className={pageTitleStyle}>{editingId ? 'Modifier' : 'Nouvel'} objectif</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1"><X className="w-5 h-5 text-[#D4AF37]" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className={labelStyle}>Nom de l'objectif</label>
                <input type="text" placeholder="Ex: Vacances, Voiture..." value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>Objectif (€)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={formData.objectif} onChange={(e) => setFormData({ ...formData, objectif: e.target.value })} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Déjà épargné (€)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={formData.actuel} onChange={(e) => setFormData({ ...formData, actuel: e.target.value })} className={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>Date début</label>
                  <input type="date" value={formData.dateDebut} onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Date fin (optionnel)</label>
                  <input type="date" value={formData.dateFin} onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })} className={inputStyle} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium">Annuler</button>
                <button onClick={handleSubmit} className="flex-1 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-semibold flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />{editingId ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
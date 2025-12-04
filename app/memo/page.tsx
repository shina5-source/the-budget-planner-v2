"use client";

import { useState, useEffect } from 'react';
import { Plus, X, Check, Trash2, Pencil, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

interface MemoItem {
  id: number;
  description: string;
  montant: string;
  checked: boolean;
}

interface MemoData {
  [yearMonth: string]: MemoItem[];
}

const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const months = [
  { id: 'janvier', label: 'Janvier', num: '01' },
  { id: 'fevrier', label: 'Février', num: '02' },
  { id: 'mars', label: 'Mars', num: '03' },
  { id: 'avril', label: 'Avril', num: '04' },
  { id: 'mai', label: 'Mai', num: '05' },
  { id: 'juin', label: 'Juin', num: '06' },
  { id: 'juillet', label: 'Juillet', num: '07' },
  { id: 'aout', label: 'Août', num: '08' },
  { id: 'septembre', label: 'Septembre', num: '09' },
  { id: 'octobre', label: 'Octobre', num: '10' },
  { id: 'novembre', label: 'Novembre', num: '11' },
  { id: 'decembre', label: 'Décembre', num: '12' },
];

const years = Array.from({ length: 81 }, (_, i) => 2020 + i);

// PAGINATION
const ITEMS_PER_PAGE = 50;

export default function MemoPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [memoData, setMemoData] = useState<MemoData>({});
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [formData, setFormData] = useState({ description: '', montant: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  // PAGINATION STATE - Un compteur par mois
  const [displayCounts, setDisplayCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const saved = localStorage.getItem('budget-memo');
    if (saved) setMemoData(JSON.parse(saved));
  }, []);

  // Réinitialiser la pagination quand on change d'année
  useEffect(() => {
    setDisplayCounts({});
  }, [selectedYear]);

  const saveMemoData = (newData: MemoData) => {
    setMemoData(newData);
    localStorage.setItem('budget-memo', JSON.stringify(newData));
  };

  const getMonthKey = (monthNum: string) => `${selectedYear}-${monthNum}`;

  const getDisplayCount = (monthNum: string) => {
    return displayCounts[monthNum] || ITEMS_PER_PAGE;
  };

  const loadMoreForMonth = (monthNum: string) => {
    setDisplayCounts(prev => ({
      ...prev,
      [monthNum]: (prev[monthNum] || ITEMS_PER_PAGE) + ITEMS_PER_PAGE
    }));
  };

  const openAddForm = (monthNum: string) => {
    setSelectedMonth(monthNum);
    setFormData({ description: '', montant: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (formData.description && selectedMonth) {
      const monthKey = getMonthKey(selectedMonth);
      const newItem: MemoItem = {
        id: editingId || Date.now(),
        description: formData.description,
        montant: formData.montant || '0,00',
        checked: false,
      };

      const monthItems = memoData[monthKey] || [];
      let newData: MemoData;

      if (editingId) {
        newData = { ...memoData, [monthKey]: monthItems.map(item => item.id === editingId ? newItem : item) };
      } else {
        newData = { ...memoData, [monthKey]: [...monthItems, newItem] };
      }

      saveMemoData(newData);
      setShowForm(false);
      setFormData({ description: '', montant: '' });
      setEditingId(null);
    }
  };

  const toggleCheck = (monthNum: string, itemId: number) => {
    const monthKey = getMonthKey(monthNum);
    const newData = { ...memoData, [monthKey]: (memoData[monthKey] || []).map(item => item.id === itemId ? { ...item, checked: !item.checked } : item) };
    saveMemoData(newData);
  };

  const deleteItem = (monthNum: string, itemId: number) => {
    const monthKey = getMonthKey(monthNum);
    const newData = { ...memoData, [monthKey]: (memoData[monthKey] || []).filter(item => item.id !== itemId) };
    saveMemoData(newData);
  };

  const editItem = (monthNum: string, item: MemoItem) => {
    setSelectedMonth(monthNum);
    setFormData({ description: item.description, montant: item.montant });
    setEditingId(item.id);
    setShowForm(true);
  };

  const getMonthTotal = (monthNum: string) => {
    const monthKey = getMonthKey(monthNum);
    const items = memoData[monthKey] || [];
    return items.reduce((sum, item) => {
      const montant = parseFloat(item.montant.replace(',', '.')) || 0;
      return sum + montant;
    }, 0);
  };

  const getYearTotal = () => months.reduce((sum, month) => sum + getMonthTotal(month.num), 0);

  const getTotalItems = () => months.reduce((sum, month) => {
    const monthKey = getMonthKey(month.num);
    return sum + (memoData[monthKey]?.length || 0);
  }, 0);

  const getCheckedItems = () => months.reduce((sum, month) => {
    const monthKey = getMonthKey(month.num);
    return sum + (memoData[monthKey]?.filter(item => item.checked).length || 0);
  }, 0);

  const toggleMonth = (monthNum: string) => setExpandedMonth(expandedMonth === monthNum ? null : monthNum);

  const prevYear = () => {
    if (selectedYear > 2020) { setSelectedYear(selectedYear - 1); setExpandedMonth(null); }
  };

  const nextYear = () => {
    if (selectedYear < 2100) { setSelectedYear(selectedYear + 1); setExpandedMonth(null); }
  };

  // STYLES UNIFORMISÉS
  const cardStyle = "bg-[#722F37]/30 backdrop-blur-sm rounded-2xl shadow-sm border border-[#D4AF37]/40 overflow-hidden";
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

  const totalItems = getTotalItems();
  const checkedItems = getCheckedItems();
  const yearTotal = getYearTotal();

  return (
    <div className="pb-4">
      {/* Titre centré */}
      <div className="text-center mb-4">
        <h1 className={pageTitleStyle}>Mémo Budget</h1>
        <p className={pageSubtitleStyle}>Calendrier annuel des dépenses prévues</p>
      </div>

      {/* Sélecteur d'année */}
      <div className={cardStyle + " mb-4 p-4"}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevYear} className="p-1"><ChevronLeft className="w-5 h-5 text-[#D4AF37]" /></button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#D4AF37]">Année</span>
            <select value={selectedYear} onChange={(e) => { setSelectedYear(parseInt(e.target.value)); setExpandedMonth(null); }} className="bg-[#722F37]/50 border border-[#D4AF37]/50 rounded-lg px-3 py-1 text-lg font-semibold text-[#D4AF37]">
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <button onClick={nextYear} className="p-1"><ChevronRight className="w-5 h-5 text-[#D4AF37]" /></button>
        </div>
        {/* Boutons de navigation rapide par mois */}
        <div className="flex flex-wrap gap-2 justify-center">
          {monthsShort.map((month, index) => {
            const monthNum = String(index + 1).padStart(2, '0');
            const hasItems = (memoData[getMonthKey(monthNum)]?.length || 0) > 0;
            return (
              <button key={index} onClick={() => { setExpandedMonth(monthNum); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${expandedMonth === monthNum ? 'bg-[#D4AF37] text-[#722F37] border-[#D4AF37]' : hasItems ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50' : 'bg-transparent text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'}`}>{month}</button>
            );
          })}
        </div>
      </div>

      {/* Total de l'année */}
      <div className={cardStyle + " mb-4 p-4 text-center"}>
        <p className={pageSubtitleStyle}>Total prévu pour {selectedYear}</p>
        <p className={amountLargeStyle + " mt-1"}>{yearTotal.toFixed(2)} €</p>
        <div className="flex justify-center gap-6 mt-3">
          <div>
            <p className={smallTextStyle}>Éléments</p>
            <p className={valueStyle}>{totalItems}</p>
          </div>
          <div>
            <p className={smallTextStyle}>Complétés</p>
            <p className={valueStyle}>{checkedItems} / {totalItems}</p>
          </div>
        </div>
      </div>

      {/* Conseils - COULEUR VERTE */}
      <div className={conseilCardStyle + " mb-4"}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className={conseilIconStyle} />
          <h4 className={conseilTitleStyle}>💡 Conseils</h4>
        </div>
        <div className="space-y-2">
          {totalItems === 0 && (
            <p className={conseilTextStyle}>📝 Ajoutez vos dépenses prévues pour mieux planifier votre budget</p>
          )}
          {totalItems > 0 && checkedItems === totalItems && (
            <p className={conseilTextStyle}>🎉 Bravo ! Tous vos éléments sont complétés pour {selectedYear}</p>
          )}
          {totalItems > 0 && checkedItems < totalItems && (
            <p className={conseilTextStyle}>📋 Il vous reste {totalItems - checkedItems} élément(s) à compléter</p>
          )}
          {yearTotal > 5000 && (
            <p className={conseilTextStyle}>💰 Budget annuel conséquent ({yearTotal.toFixed(0)} €). Planifiez bien vos épargnes !</p>
          )}
          {yearTotal > 0 && yearTotal <= 5000 && (
            <p className={conseilTextStyle}>✅ Budget annuel de {yearTotal.toFixed(0)} € prévu</p>
          )}
        </div>
      </div>

      {/* Liste des mois */}
      <div className="space-y-3">
        {months.map((month) => {
          const monthKey = getMonthKey(month.num);
          const items = memoData[monthKey] || [];
          const total = getMonthTotal(month.num);
          const isExpanded = expandedMonth === month.num;
          const checkedCount = items.filter(i => i.checked).length;

          // PAGINATION pour ce mois
          const displayCount = getDisplayCount(month.num);
          const displayedItems = items.slice(0, displayCount);
          const hasMore = displayCount < items.length;
          const remainingCount = items.length - displayCount;

          return (
            <div key={month.id} className={cardStyle}>
              {/* Header du mois */}
              <div className="bg-[#722F37]/50 px-4 py-3 flex items-center justify-between cursor-pointer border-b border-[#D4AF37]/30" onClick={() => toggleMonth(month.num)}>
                <div className="flex items-center gap-3">
                  <span className={sectionTitleStyle}>{month.label}</span>
                  <span className={smallTextStyle}>({items.length} élément{items.length > 1 ? 's' : ''})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={valueStyle}>{total.toFixed(2)} €</span>
                  <button onClick={(e) => { e.stopPropagation(); openAddForm(month.num); }} className="w-7 h-7 bg-[#D4AF37]/20 rounded-full flex items-center justify-center hover:bg-[#D4AF37]/30 transition-colors border border-[#D4AF37]/50">
                    <Plus className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-[#D4AF37]" /> : <ChevronDown className="w-4 h-4 text-[#D4AF37]" />}
                </div>
              </div>

              {/* Contenu du mois (accordéon) */}
              {isExpanded && (
                <div className="p-3">
                  {items.length === 0 ? (
                    <p className={pageSubtitleStyle + " text-center py-4"}>Aucun élément pour ce mois</p>
                  ) : (
                    <div className="space-y-2">
                      {/* En-tête */}
                      <div className="flex items-center px-2 pb-1 border-b border-[#D4AF37]/20">
                        <div className="w-6"></div>
                        <div className={smallTextStyle + " flex-1 font-medium"}>Description</div>
                        <div className={smallTextStyle + " w-20 text-right font-medium"}>Montant</div>
                        <div className="w-14"></div>
                      </div>

                      {/* Items avec pagination */}
                      {displayedItems.map((item) => (
                        <div key={item.id} className="flex items-center bg-[#722F37]/40 rounded-xl px-2 py-2 border border-[#D4AF37]/20">
                          <button onClick={() => toggleCheck(month.num, item.id)} className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.checked ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-[#D4AF37]/50 bg-transparent'}`}>
                            {item.checked && <Check className="w-3 h-3 text-[#722F37]" />}
                          </button>
                          <div className={`flex-1 px-3 text-sm ${item.checked ? 'line-through text-[#D4AF37]/50' : 'text-[#D4AF37]'}`}>{item.description}</div>
                          <div className={`w-20 text-right text-sm font-medium ${item.checked ? 'text-[#D4AF37]/50' : 'text-[#D4AF37]'}`}>{item.montant} €</div>
                          <div className="w-14 flex items-center justify-end gap-1">
                            <button onClick={() => editItem(month.num, item)} className="p-1.5 bg-[#D4AF37]/20 rounded-lg hover:bg-[#D4AF37]/30 border border-[#D4AF37]/30">
                              <Pencil className="w-3 h-3 text-[#D4AF37]" />
                            </button>
                            <button onClick={() => deleteItem(month.num, item.id)} className="p-1.5 bg-[#D4AF37]/20 rounded-lg hover:bg-[#D4AF37]/30 border border-[#D4AF37]/30">
                              <Trash2 className="w-3 h-3 text-[#D4AF37]" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Bouton Voir plus */}
                      {hasMore && (
                        <button
                          onClick={() => loadMoreForMonth(month.num)}
                          className="w-full py-3 mt-2 border-2 border-dashed border-[#D4AF37]/50 rounded-xl text-sm font-medium text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                        >
                          Voir plus ({remainingCount} restant{remainingCount > 1 ? 's' : ''})
                        </button>
                      )}

                      {/* Résumé du mois */}
                      {items.length > 0 && (
                        <div className="pt-2 mt-2 border-t border-[#D4AF37]/20 flex justify-between items-center">
                          <span className={smallTextStyle}>
                            {checkedCount}/{items.length} complété(s)
                            {items.length > ITEMS_PER_PAGE && ` • ${displayedItems.length} sur ${items.length} affichés`}
                          </span>
                          <span className={valueStyle + " font-semibold"}>Total: {total.toFixed(2)} €</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#8B4557] w-full max-w-sm rounded-2xl p-4 border border-[#D4AF37]/40">
            <div className="flex items-center justify-between mb-4">
              <h3 className={pageTitleStyle}>{editingId ? 'Modifier' : 'Ajouter'} - {months.find(m => m.num === selectedMonth)?.label} {selectedYear}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-[#D4AF37]" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className={labelStyle}>Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputStyle} placeholder="Ex: Anniversaire de Maman" />
              </div>
              <div>
                <label className={labelStyle}>Montant (€)</label>
                <input type="text" value={formData.montant} onChange={(e) => setFormData({ ...formData, montant: e.target.value })} className={inputStyle} placeholder="0,00" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium">Annuler</button>
                <button onClick={handleSubmit} className="flex-1 py-3 bg-[#D4AF37] text-[#722F37] rounded-xl font-semibold flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />{editingId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
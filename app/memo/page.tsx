"use client";

import { useState, useEffect } from 'react';
import { Plus, X, Check, Trash2, Pencil, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell } from '@/components';

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
const ITEMS_PER_PAGE = 50;

function MemoContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [memoData, setMemoData] = useState<MemoData>({});
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [formData, setFormData] = useState({ description: '', montant: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [displayCounts, setDisplayCounts] = useState<{ [key: string]: number }>({});

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  useEffect(() => {
    const saved = localStorage.getItem('budget-memo');
    if (saved) setMemoData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setDisplayCounts({});
  }, [selectedYear]);

  const saveMemoData = (newData: MemoData) => {
    setMemoData(newData);
    localStorage.setItem('budget-memo', JSON.stringify(newData));
  };

  const getMonthKey = (monthNum: string) => `${selectedYear}-${monthNum}`;
  const getDisplayCount = (monthNum: string) => displayCounts[monthNum] || ITEMS_PER_PAGE;
  const loadMoreForMonth = (monthNum: string) => setDisplayCounts(prev => ({ ...prev, [monthNum]: (prev[monthNum] || ITEMS_PER_PAGE) + ITEMS_PER_PAGE }));

  const openAddForm = (monthNum: string) => {
    setSelectedMonth(monthNum);
    setFormData({ description: '', montant: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (formData.description && selectedMonth) {
      const monthKey = getMonthKey(selectedMonth);
      const newItem: MemoItem = { id: editingId || Date.now(), description: formData.description, montant: formData.montant || '0,00', checked: false };
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
    return items.reduce((sum, item) => sum + (parseFloat(item.montant.replace(',', '.')) || 0), 0);
  };

  const getYearTotal = () => months.reduce((sum, month) => sum + getMonthTotal(month.num), 0);
  const getTotalItems = () => months.reduce((sum, month) => sum + (memoData[getMonthKey(month.num)]?.length || 0), 0);
  const getCheckedItems = () => months.reduce((sum, month) => sum + (memoData[getMonthKey(month.num)]?.filter(item => item.checked).length || 0), 0);
  const toggleMonth = (monthNum: string) => setExpandedMonth(expandedMonth === monthNum ? null : monthNum);
  const prevYear = () => { if (selectedYear > 2020) { setSelectedYear(selectedYear - 1); setExpandedMonth(null); } };
  const nextYear = () => { if (selectedYear < 2100) { setSelectedYear(selectedYear + 1); setExpandedMonth(null); } };

  const totalItems = getTotalItems();
  const checkedItems = getCheckedItems();
  const yearTotal = getYearTotal();

  return (
    <>
      <div className="pb-4">
        <div className="text-center mb-4">
          <h1 className="text-lg font-medium" style={textPrimary}>Mémo Budget</h1>
          <p className="text-xs" style={textSecondary}>Calendrier annuel des dépenses prévues</p>
        </div>

        <div className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden mb-4 p-4" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevYear} className="p-1"><ChevronLeft className="w-5 h-5" style={textPrimary} /></button>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold" style={textPrimary}>Année</span>
              <select value={selectedYear} onChange={(e) => { setSelectedYear(parseInt(e.target.value)); setExpandedMonth(null); }} className="rounded-lg px-3 py-1 text-lg font-semibold border" style={inputStyle}>
                {years.map(year => (<option key={year} value={year}>{year}</option>))}
              </select>
            </div>
            <button onClick={nextYear} className="p-1"><ChevronRight className="w-5 h-5" style={textPrimary} /></button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {monthsShort.map((month, index) => {
              const monthNum = String(index + 1).padStart(2, '0');
              const hasItems = (memoData[getMonthKey(monthNum)]?.length || 0) > 0;
              return (
                <button key={index} onClick={() => setExpandedMonth(monthNum)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border" style={expandedMonth === monthNum ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary } : hasItems ? { background: `${theme.colors.primary}20`, color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder } : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }}>{month}</button>
              );
            })}
          </div>
        </div>

        <div className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden mb-4 p-4 text-center" style={cardStyle}>
          <p className="text-xs" style={textSecondary}>Total prévu pour {selectedYear}</p>
          <p className="text-2xl font-semibold mt-1" style={textPrimary}>{yearTotal.toFixed(2)} €</p>
          <div className="flex justify-center gap-6 mt-3">
            <div><p className="text-[10px]" style={textSecondary}>Éléments</p><p className="text-xs font-medium" style={textPrimary}>{totalItems}</p></div>
            <div><p className="text-[10px]" style={textSecondary}>Complétés</p><p className="text-xs font-medium" style={textPrimary}>{checkedItems} / {totalItems}</p></div>
          </div>
        </div>

        <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50 mb-4">
          <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-[#7DD3A8]" /><h4 className="text-xs font-semibold text-[#7DD3A8]">💡 Conseils</h4></div>
          <div className="space-y-2">
            {totalItems === 0 && (<p className="text-[10px] text-[#7DD3A8]">📝 Ajoutez vos dépenses prévues pour mieux planifier votre budget</p>)}
            {totalItems > 0 && checkedItems === totalItems && (<p className="text-[10px] text-[#7DD3A8]">🎉 Bravo ! Tous vos éléments sont complétés pour {selectedYear}</p>)}
            {totalItems > 0 && checkedItems < totalItems && (<p className="text-[10px] text-[#7DD3A8]">📋 Il vous reste {totalItems - checkedItems} élément(s) à compléter</p>)}
            {yearTotal > 5000 && (<p className="text-[10px] text-[#7DD3A8]">💰 Budget annuel conséquent ({yearTotal.toFixed(0)} €). Planifiez bien vos épargnes !</p>)}
            {yearTotal > 0 && yearTotal <= 5000 && (<p className="text-[10px] text-[#7DD3A8]">✅ Budget annuel de {yearTotal.toFixed(0)} € prévu</p>)}
          </div>
        </div>

        <div className="space-y-3">
          {months.map((month) => {
            const monthKey = getMonthKey(month.num);
            const items = memoData[monthKey] || [];
            const total = getMonthTotal(month.num);
            const isExpanded = expandedMonth === month.num;
            const checkedCount = items.filter(i => i.checked).length;
            const displayCount = getDisplayCount(month.num);
            const displayedItems = items.slice(0, displayCount);
            const hasMore = displayCount < items.length;
            const remainingCount = items.length - displayCount;

            return (
              <div key={month.id} className="backdrop-blur-sm rounded-2xl shadow-sm border overflow-hidden" style={cardStyle}>
                <div className="px-4 py-3 flex items-center justify-between cursor-pointer" style={{ background: theme.colors.cardBackgroundLight, borderBottomWidth: 1, borderColor: theme.colors.cardBorder }} onClick={() => toggleMonth(month.num)}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={textPrimary}>{month.label}</span>
                    <span className="text-[10px]" style={textSecondary}>({items.length} élément{items.length > 1 ? 's' : ''})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={textPrimary}>{total.toFixed(2)} €</span>
                    <button onClick={(e) => { e.stopPropagation(); openAddForm(month.num); }} className="w-7 h-7 rounded-full flex items-center justify-center transition-colors border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
                      <Plus className="w-4 h-4" style={textPrimary} />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4" style={textPrimary} /> : <ChevronDown className="w-4 h-4" style={textPrimary} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-3">
                    {items.length === 0 ? (
                      <p className="text-xs text-center py-4" style={textSecondary}>Aucun élément pour ce mois</p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center px-2 pb-1" style={{ borderBottomWidth: 1, borderColor: theme.colors.cardBorder }}>
                          <div className="w-6"></div>
                          <div className="text-[10px] font-medium flex-1" style={textSecondary}>Description</div>
                          <div className="text-[10px] font-medium w-20 text-right" style={textSecondary}>Montant</div>
                          <div className="w-14"></div>
                        </div>

                        {displayedItems.map((item) => (
                          <div key={item.id} className="flex items-center rounded-xl px-2 py-2 border" style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder }}>
                            <button onClick={() => toggleCheck(month.num, item.id)} className="w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors" style={item.checked ? { background: theme.colors.primary, borderColor: theme.colors.primary } : { borderColor: theme.colors.cardBorder, background: 'transparent' }}>
                              {item.checked && <Check className="w-3 h-3" style={{ color: theme.colors.textOnPrimary }} />}
                            </button>
                            <div className={`flex-1 px-3 text-sm ${item.checked ? 'line-through opacity-50' : ''}`} style={textPrimary}>{item.description}</div>
                            <div className={`w-20 text-right text-sm font-medium ${item.checked ? 'opacity-50' : ''}`} style={textPrimary}>{item.montant} €</div>
                            <div className="w-14 flex items-center justify-end gap-1">
                              <button onClick={() => editItem(month.num, item)} className="p-1.5 rounded-lg border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
                                <Pencil className="w-3 h-3" style={textPrimary} />
                              </button>
                              <button onClick={() => deleteItem(month.num, item.id)} className="p-1.5 rounded-lg border" style={{ background: `${theme.colors.primary}20`, borderColor: theme.colors.cardBorder }}>
                                <Trash2 className="w-3 h-3" style={textPrimary} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {hasMore && (
                          <button onClick={() => loadMoreForMonth(month.num)} className="w-full py-3 mt-2 border-2 border-dashed rounded-xl text-sm font-medium transition-colors" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}>
                            Voir plus ({remainingCount} restant{remainingCount > 1 ? 's' : ''})
                          </button>
                        )}

                        {items.length > 0 && (
                          <div className="pt-2 mt-2 flex justify-between items-center" style={{ borderTopWidth: 1, borderColor: theme.colors.cardBorder }}>
                            <span className="text-[10px]" style={textSecondary}>{checkedCount}/{items.length} complété(s){items.length > ITEMS_PER_PAGE && ` • ${displayedItems.length} sur ${items.length} affichés`}</span>
                            <span className="text-xs font-semibold" style={textPrimary}>Total: {total.toFixed(2)} €</span>
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
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl p-4 border" style={{ background: theme.colors.secondary, borderColor: theme.colors.cardBorder }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium" style={textPrimary}>{editingId ? 'Modifier' : 'Ajouter'} - {months.find(m => m.num === selectedMonth)?.label} {selectedYear}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" style={textPrimary} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={inputStyle} placeholder="Ex: Anniversaire de Maman" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Montant (€)</label>
                <input type="text" value={formData.montant} onChange={(e) => setFormData({ ...formData, montant: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none" style={inputStyle} placeholder="0,00" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border rounded-xl font-medium" style={{ borderColor: theme.colors.primary, color: theme.colors.textPrimary }}>Annuler</button>
                <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}>
                  <Check className="w-5 h-5" />{editingId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function MemoPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="memo" onNavigate={handleNavigate}>
      <MemoContent />
    </AppShell>
  );
}
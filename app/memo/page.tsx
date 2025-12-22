"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips, PageTitle } from '@/components';
import confetti from 'canvas-confetti';
import SkeletonLoader from './components/SkeletonLoader';
import CalendarGrid from './components/CalendarGrid';
import StatsCards from './components/StatsCards';
import MonthDetail from './components/MonthDetail';
import MemoForm from './components/MemoForm';
import DeleteConfirmModal from './components/DeleteConfirmModal';

// Types
interface MemoItem {
  id: number;
  description: string;
  montant: string;
  checked: boolean;
}

interface MemoData {
  [yearMonth: string]: MemoItem[];
}

// Constantes
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

const ITEMS_PER_PAGE = 50;

function MemoContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  // États
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [memoData, setMemoData] = useState<MemoData>({});
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [formData, setFormData] = useState({ description: '', montant: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [displayCounts, setDisplayCounts] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [devise, setDevise] = useState('€');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; monthNum: string; item: MemoItem | null }>({
    isOpen: false,
    monthNum: '',
    item: null
  });

  // Chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = localStorage.getItem('budget-memo');
        if (saved) setMemoData(JSON.parse(saved));

        const savedParams = localStorage.getItem('budget-parametres');
        if (savedParams) {
          const params = JSON.parse(savedParams);
          if (params.devise) setDevise(params.devise);
        }
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    loadData();
  }, []);

  // Reset on year change
  useEffect(() => {
    setDisplayCounts({});
    setSelectedMonth(null);
  }, [selectedYear]);

  // Helpers
  const getMonthKey = useCallback((monthNum: string) => 
    `${selectedYear}-${monthNum}`, 
    [selectedYear]
  );

  const saveMemoData = useCallback((newData: MemoData) => {
    setMemoData(newData);
    localStorage.setItem('budget-memo', JSON.stringify(newData));
  }, []);

  // Calculs
  const getMonthData = useCallback((monthNum: string) => {
    const monthKey = getMonthKey(monthNum);
    const items = memoData[monthKey] || [];
    return {
      count: items.length,
      total: items.reduce((sum, item) => sum + (parseFloat(item.montant.replace(',', '.')) || 0), 0),
      checkedCount: items.filter(i => i.checked).length
    };
  }, [memoData, getMonthKey]);

  const yearStats = useMemo(() => {
    let totalItems = 0;
    let checkedItems = 0;
    let yearTotal = 0;

    months.forEach(month => {
      const data = getMonthData(month.num);
      totalItems += data.count;
      checkedItems += data.checkedCount;
      yearTotal += data.total;
    });

    return { totalItems, checkedItems, yearTotal };
  }, [getMonthData]);

  // Confetti
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#4ade80', '#86efac', theme.colors.primary, '#fbbf24']
    });
  }, [theme.colors.primary]);

  // Handlers
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const handlePrevYear = useCallback(() => {
    if (selectedYear > 2020) setSelectedYear(prev => prev - 1);
  }, [selectedYear]);

  const handleNextYear = useCallback(() => {
    if (selectedYear < 2100) setSelectedYear(prev => prev + 1);
  }, [selectedYear]);

  const handleMonthSelect = useCallback((monthNum: string) => {
    setSelectedMonth(prev => prev === monthNum ? null : monthNum);
  }, []);

  const openAddForm = useCallback((monthNum: string) => {
    setSelectedMonth(monthNum);
    setFormData({ description: '', montant: '' });
    setEditingId(null);
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback(() => {
    if (formData.description && selectedMonth) {
      const monthKey = getMonthKey(selectedMonth);
      const newItem: MemoItem = { 
        id: editingId || Date.now(), 
        description: formData.description, 
        montant: formData.montant || '0,00', 
        checked: false 
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
  }, [formData, selectedMonth, editingId, memoData, getMonthKey, saveMemoData]);

  const handleToggleCheck = useCallback((monthNum: string, itemId: number) => {
    const monthKey = getMonthKey(monthNum);
    const items = memoData[monthKey] || [];
    const newItems = items.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    const newData = { ...memoData, [monthKey]: newItems };
    saveMemoData(newData);

    // Confetti si tous complétés
    const allChecked = newItems.every(item => item.checked);
    if (allChecked && newItems.length > 0) {
      setTimeout(() => triggerConfetti(), 200);
    }
  }, [memoData, getMonthKey, saveMemoData, triggerConfetti]);

  const openDeleteModal = useCallback((monthNum: string, item: MemoItem) => {
    setDeleteModal({ isOpen: true, monthNum, item });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteModal.item && deleteModal.monthNum) {
      const monthKey = getMonthKey(deleteModal.monthNum);
      const newData = { 
        ...memoData, 
        [monthKey]: (memoData[monthKey] || []).filter(item => item.id !== deleteModal.item!.id) 
      };
      saveMemoData(newData);
    }
    setDeleteModal({ isOpen: false, monthNum: '', item: null });
  }, [deleteModal, memoData, getMonthKey, saveMemoData]);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, monthNum: '', item: null });
  }, []);

  const handleEdit = useCallback((monthNum: string, item: MemoItem) => {
    setSelectedMonth(monthNum);
    setFormData({ description: item.description, montant: item.montant });
    setEditingId(item.id);
    setShowForm(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setFormData({ description: '', montant: '' });
    setEditingId(null);
  }, []);

  const loadMoreForMonth = useCallback((monthNum: string) => {
    setDisplayCounts(prev => ({ 
      ...prev, 
      [monthNum]: (prev[monthNum] || ITEMS_PER_PAGE) + ITEMS_PER_PAGE 
    }));
  }, []);

  const getDisplayCount = useCallback((monthNum: string) => 
    displayCounts[monthNum] || ITEMS_PER_PAGE,
    [displayCounts]
  );

  const getMonthLabel = useCallback((monthNum: string) => {
    return months.find(m => m.num === monthNum)?.label || '';
  }, []);

  if (isLoading) {
    return (
      <div className="pb-4">
        <PageTitle page="memo" />
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <>
      {/* Animations CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>

      <div className="pb-4 space-y-4">
        {/* Titre */}
        <PageTitle page="memo" />

        {/* Calendrier Grille */}
        <CalendarGrid
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={handleYearChange}
          onPrevYear={handlePrevYear}
          onNextYear={handleNextYear}
          onMonthSelect={handleMonthSelect}
          getMonthData={getMonthData}
        />

        {/* Stats Cards */}
        <StatsCards
          yearTotal={yearStats.yearTotal}
          totalItems={yearStats.totalItems}
          checkedItems={yearStats.checkedItems}
          devise={devise}
        />

        {/* Détail du mois sélectionné */}
        {selectedMonth && (
          <MonthDetail
            monthLabel={getMonthLabel(selectedMonth)}
            monthNum={selectedMonth}
            items={memoData[getMonthKey(selectedMonth)] || []}
            total={getMonthData(selectedMonth).total}
            onAddClick={() => openAddForm(selectedMonth)}
            onToggleCheck={(itemId: number) => handleToggleCheck(selectedMonth, itemId)}
            onEdit={(item: MemoItem) => handleEdit(selectedMonth, item)}
            onDelete={(itemId: number) => {
              const item = (memoData[getMonthKey(selectedMonth)] || []).find(i => i.id === itemId);
              if (item) openDeleteModal(selectedMonth, item);
            }}
            devise={devise}
            displayCount={getDisplayCount(selectedMonth)}
            onLoadMore={() => loadMoreForMonth(selectedMonth)}
          />
        )}

        {/* Message si aucun mois sélectionné */}
        {!selectedMonth && (
          <div 
            className="rounded-2xl border p-8 text-center"
            style={{ 
              background: theme.colors.cardBackground, 
              borderColor: theme.colors.cardBorder 
            }}
          >
            <p 
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              👆 Sélectionnez un mois pour voir ou ajouter des mémos
            </p>
          </div>
        )}

        {/* SmartTips en bas */}
        <SmartTips page="memo" />
      </div>

      {/* Modal Formulaire */}
      <MemoForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        formData={formData}
        onFormChange={setFormData}
        isEditing={!!editingId}
        monthLabel={selectedMonth ? getMonthLabel(selectedMonth) : ''}
        selectedYear={selectedYear}
        devise={devise}
      />

      {/* Modal Confirmation Suppression */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        itemDescription={deleteModal.item?.description || ''}
        itemMontant={deleteModal.item?.montant || '0'}
        devise={devise}
      />
    </>
  );
}

export default function MemoPage() {
  const router = useRouter();

  const handleNavigate = useCallback((page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  }, [router]);

  return (
    <AppShell currentPage="memo" onNavigate={handleNavigate}>
      <MemoContent />
    </AppShell>
  );
}
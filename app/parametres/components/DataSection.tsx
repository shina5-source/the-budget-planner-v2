'use client';

import { Database, Upload, RefreshCw, Trash2, LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { ParametresData } from './types';
import { supabase } from '@/lib/supabase';

interface DataSectionProps {
  parametres: ParametresData;
  onSave: (data: ParametresData) => void;
}

export default function DataSection({ parametres, onSave }: DataSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const cardStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: theme.colors.cardBorder 
  };
  const textPrimary = { color: theme.colors.textPrimary };

  const exportData = () => {
    const data = {
      parametres,
      transactions: JSON.parse(localStorage.getItem('budget-transactions') || '[]'),
      enveloppes: JSON.parse(localStorage.getItem('budget-enveloppes') || '[]'),
      objectifs: JSON.parse(localStorage.getItem('budget-objectifs') || '[]'),
      memo: JSON.parse(localStorage.getItem('budget-memo') || '[]'),
      epargnes: JSON.parse(localStorage.getItem('budget-epargnes') || '[]'),
      credits: JSON.parse(localStorage.getItem('budget-credits') || '[]'),
      userName: localStorage.getItem('budget-user-name') || 'Utilisateur'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.parametres) onSave(data.parametres);
        if (data.transactions) localStorage.setItem('budget-transactions', JSON.stringify(data.transactions));
        if (data.enveloppes) localStorage.setItem('budget-enveloppes', JSON.stringify(data.enveloppes));
        if (data.objectifs) localStorage.setItem('budget-objectifs', JSON.stringify(data.objectifs));
        if (data.memo) localStorage.setItem('budget-memo', JSON.stringify(data.memo));
        if (data.epargnes) localStorage.setItem('budget-epargnes', JSON.stringify(data.epargnes));
        if (data.credits) localStorage.setItem('budget-credits', JSON.stringify(data.credits));
        if (data.userName) localStorage.setItem('budget-user-name', data.userName);
        alert('✅ Données importées avec succès ! Rechargez la page.');
      } catch {
        alert("❌ Erreur lors de l'importation.");
      }
    };
    reader.readAsText(file);
  };

  const resetAllData = () => {
    if (confirm('⚠️ Supprimer TOUTES les données ? Cette action est irréversible.')) {
      localStorage.removeItem('budget-transactions');
      localStorage.removeItem('budget-enveloppes');
      localStorage.removeItem('budget-objectifs');
      localStorage.removeItem('budget-memo');
      localStorage.removeItem('budget-epargnes');
      localStorage.removeItem('budget-credits');
      localStorage.removeItem('budget-parametres');
      localStorage.removeItem('budget-user-name');
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  return (
    <div 
      className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4 animate-fade-in-up stagger-7"
      style={cardStyle}
    >
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}>
        <Database className="w-5 h-5" style={{ color: theme.colors.primary }} />
        Données
      </h3>
      
      <div className="space-y-3">
        {/* Exporter */}
        <button 
          onClick={exportData} 
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          style={{ 
            background: theme.colors.primary, 
            color: theme.colors.textOnPrimary,
            boxShadow: `0 4px 15px ${theme.colors.primary}40`
          }}
        >
          <Upload className="w-5 h-5" />
          Exporter les données
        </button>
        
        {/* Importer */}
        <label 
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium cursor-pointer border transition-all duration-200 hover:scale-[1.02]"
          style={{ 
            background: theme.colors.cardBackgroundLight, 
            borderColor: theme.colors.cardBorder, 
            color: theme.colors.textPrimary 
          }}
        >
          <RefreshCw className="w-5 h-5" />
          Importer des données
          <input type="file" accept=".json" onChange={importData} className="hidden" />
        </label>
        
        {/* Réinitialiser */}
        <button 
          onClick={resetAllData} 
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] hover:bg-red-500/30"
        >
          <Trash2 className="w-5 h-5" />
          Réinitialiser toutes les données
        </button>
        
        {/* Déconnexion */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium border transition-all duration-200 hover:scale-[1.02]"
          style={{ 
            background: theme.colors.cardBackground, 
            borderColor: theme.colors.cardBorder, 
            color: theme.colors.textPrimary 
          }}
        >
          <LogOut className="w-5 h-5" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
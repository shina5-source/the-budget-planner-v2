"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit3, TrendingUp, FileText, ShoppingCart, PiggyBank, Building, Upload, RefreshCw, Database, Lightbulb, Settings, LogOut, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell } from '@/components';
import { supabase } from '@/lib/supabase';

interface CompteBancaire {
  id: number;
  nom: string;
  soldeDepart: number;
  isEpargne: boolean;
}

interface ParametresData {
  dateDepart: string;
  budgetAvantPremier: boolean;
  devise: string;
  categoriesRevenus: string[];
  categoriesFactures: string[];
  categoriesDepenses: string[];
  categoriesEpargnes: string[];
  comptesBancaires: CompteBancaire[];
}

const defaultParametres: ParametresData = {
  dateDepart: new Date().toISOString().split('T')[0],
  budgetAvantPremier: false,
  devise: '€',
  categoriesRevenus: ['Salaire', 'Revenus Secondaires', 'Allocations', 'Aides', 'Remboursement', 'Autres Revenus'],
  categoriesFactures: ['Loyer', 'Électricité', 'Eau', 'Assurance', 'Internet', 'Mobile', 'Abonnements', 'Crédits', 'Impôts'],
  categoriesDepenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Loisirs', 'Santé', 'Cadeaux', 'Autres'],
  categoriesEpargnes: ['Livret A', 'Épargne', 'Tirelire', 'Vacances', 'Projets'],
  comptesBancaires: [
    { id: 1, nom: 'Compte Principal', soldeDepart: 0, isEpargne: false },
    { id: 2, nom: 'Livret A', soldeDepart: 0, isEpargne: true },
  ]
};

function useParametres() {
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  useEffect(() => {
    const saved = localStorage.getItem('budget-parametres');
    if (saved) setParametres({ ...defaultParametres, ...JSON.parse(saved) });
  }, []);
  const saveParametres = (newParametres: ParametresData) => {
    setParametres(newParametres);
    localStorage.setItem('budget-parametres', JSON.stringify(newParametres));
  };
  return { parametres, saveParametres };
}

function ParametresContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const { parametres, saveParametres } = useParametres();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [newCategorie, setNewCategorie] = useState('');
  const [editingCompte, setEditingCompte] = useState<CompteBancaire | null>(null);
  const [showCompteForm, setShowCompteForm] = useState(false);
  const [compteForm, setCompteForm] = useState({ nom: '', soldeDepart: '', isEpargne: false });

  const toggleSection = (section: string) => setActiveSection(activeSection === section ? null : section);

  const addCategorie = (type: 'categoriesRevenus' | 'categoriesFactures' | 'categoriesDepenses' | 'categoriesEpargnes') => {
    if (!newCategorie.trim()) return;
    saveParametres({ ...parametres, [type]: [...parametres[type], newCategorie.trim()] });
    setNewCategorie('');
  };

  const removeCategorie = (type: 'categoriesRevenus' | 'categoriesFactures' | 'categoriesDepenses' | 'categoriesEpargnes', index: number) => {
    saveParametres({ ...parametres, [type]: parametres[type].filter((_, i) => i !== index) });
  };

  const handleCompteSubmit = () => {
    if (!compteForm.nom) return;
    if (editingCompte) {
      const updated = parametres.comptesBancaires.map(c => c.id === editingCompte.id ? { ...editingCompte, nom: compteForm.nom, soldeDepart: parseFloat(compteForm.soldeDepart) || 0, isEpargne: compteForm.isEpargne } : c);
      saveParametres({ ...parametres, comptesBancaires: updated });
    } else {
      const newCompte: CompteBancaire = { id: Date.now(), nom: compteForm.nom, soldeDepart: parseFloat(compteForm.soldeDepart) || 0, isEpargne: compteForm.isEpargne };
      saveParametres({ ...parametres, comptesBancaires: [...parametres.comptesBancaires, newCompte] });
    }
    setCompteForm({ nom: '', soldeDepart: '', isEpargne: false });
    setEditingCompte(null);
    setShowCompteForm(false);
  };

  const editCompte = (compte: CompteBancaire) => {
    setEditingCompte(compte);
    setCompteForm({ nom: compte.nom, soldeDepart: compte.soldeDepart.toString(), isEpargne: compte.isEpargne });
    setShowCompteForm(true);
  };

  const deleteCompte = (id: number) => saveParametres({ ...parametres, comptesBancaires: parametres.comptesBancaires.filter(c => c.id !== id) });

  const exportData = () => {
    const data = {
      parametres,
      transactions: JSON.parse(localStorage.getItem('budget-transactions') || '[]'),
      enveloppes: JSON.parse(localStorage.getItem('budget-enveloppes') || '[]'),
      objectifs: JSON.parse(localStorage.getItem('budget-objectifs') || '[]'),
      memo: JSON.parse(localStorage.getItem('budget-memo') || '[]'),
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
        if (data.parametres) saveParametres(data.parametres);
        if (data.transactions) localStorage.setItem('budget-transactions', JSON.stringify(data.transactions));
        if (data.enveloppes) localStorage.setItem('budget-enveloppes', JSON.stringify(data.enveloppes));
        if (data.objectifs) localStorage.setItem('budget-objectifs', JSON.stringify(data.objectifs));
        if (data.memo) localStorage.setItem('budget-memo', JSON.stringify(data.memo));
        if (data.userName) localStorage.setItem('budget-user-name', data.userName);
        alert('Données importées avec succès ! Rechargez la page.');
      } catch {
        alert("Erreur lors de l'importation.");
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
      localStorage.removeItem('budget-parametres');
      localStorage.removeItem('budget-user-name');
      window.location.reload();
    }
  };

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  const renderCategorieSection = (title: string, type: 'categoriesRevenus' | 'categoriesFactures' | 'categoriesDepenses' | 'categoriesEpargnes', icon: React.ReactNode) => (
    <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-3" style={cardStyle}>
      <button onClick={() => toggleSection(type)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">{icon}<span className="text-sm font-semibold" style={textPrimary}>{title}</span><span className="text-[10px]" style={textSecondary}>({parametres[type].length})</span></div>
        {activeSection === type ? <ChevronUp className="w-5 h-5" style={textPrimary} /> : <ChevronDown className="w-5 h-5" style={textPrimary} />}
      </button>
      {activeSection === type && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <input type="text" placeholder="Nouvelle catégorie..." value={newCategorie} onChange={(e) => setNewCategorie(e.target.value)} className="flex-1 rounded-xl px-3 py-2 text-sm border" style={inputStyle} onKeyDown={(e) => { if (e.key === 'Enter') addCategorie(type); }} />
            <button onClick={() => addCategorie(type)} className="px-4 py-2 rounded-xl" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Plus className="w-5 h-5" /></button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {parametres[type].map((cat, index) => (
              <div key={index} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: theme.colors.cardBackgroundLight }}>
                <span className="text-xs font-medium" style={textPrimary}>{cat}</span>
                <button onClick={() => removeCategorie(type, index)} className="p-1 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="pb-4">
        <div className="text-center mb-4">
          <h1 className="text-lg font-medium" style={textPrimary}>Paramètres</h1>
          <p className="text-xs" style={textSecondary}>Configuration de l'application</p>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}><Settings className="w-5 h-5" />Général</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block" style={textPrimary}>Devise</label>
              <select value={parametres.devise} onChange={(e) => saveParametres({ ...parametres, devise: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle}>
                <option value="€">€ Euro</option>
                <option value="$">$ Dollar</option>
                <option value="£">£ Livre</option>
                <option value="CHF">CHF Franc Suisse</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={textPrimary}>Date de départ</label>
              <input type="date" value={parametres.dateDepart} onChange={(e) => saveParametres({ ...parametres, dateDepart: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium" style={textPrimary}>Budget avant le 1er du mois</label>
              <button onClick={() => saveParametres({ ...parametres, budgetAvantPremier: !parametres.budgetAvantPremier })} className="w-12 h-6 rounded-full transition-colors" style={{ background: parametres.budgetAvantPremier ? theme.colors.primary : theme.colors.cardBackgroundLight }}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${parametres.budgetAvantPremier ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
          <button onClick={() => toggleSection('comptes')} className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3"><Building className="w-5 h-5" style={textPrimary} /><span className="text-sm font-semibold" style={textPrimary}>Comptes bancaires</span><span className="text-[10px]" style={textSecondary}>({parametres.comptesBancaires.length})</span></div>
            {activeSection === 'comptes' ? <ChevronUp className="w-5 h-5" style={textPrimary} /> : <ChevronDown className="w-5 h-5" style={textPrimary} />}
          </button>
          {activeSection === 'comptes' && (
            <div className="mt-4 space-y-3">
              <button onClick={() => { setCompteForm({ nom: '', soldeDepart: '', isEpargne: false }); setEditingCompte(null); setShowCompteForm(true); }} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Plus className="w-4 h-4" />Ajouter un compte</button>
              <div className="space-y-2">
                {parametres.comptesBancaires.map((compte) => (
                  <div key={compte.id} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: theme.colors.cardBackgroundLight }}>
                    <div>
                      <p className="text-xs font-medium" style={textPrimary}>{compte.nom}</p>
                      <p className="text-[10px]" style={textSecondary}>{compte.isEpargne ? '💰 Épargne' : '🏦 Courant'} • Solde: {compte.soldeDepart}{parametres.devise}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => editCompte(compte)} className="p-1.5 rounded-lg"><Edit3 className="w-4 h-4" style={textPrimary} /></button>
                      <button onClick={() => deleteCompte(compte.id)} className="p-1.5 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {renderCategorieSection('Catégories Revenus', 'categoriesRevenus', <TrendingUp className="w-5 h-5 text-green-400" />)}
        {renderCategorieSection('Catégories Factures', 'categoriesFactures', <FileText className="w-5 h-5 text-red-400" />)}
        {renderCategorieSection('Catégories Dépenses', 'categoriesDepenses', <ShoppingCart className="w-5 h-5 text-orange-400" />)}
        {renderCategorieSection('Catégories Épargnes', 'categoriesEpargnes', <PiggyBank className="w-5 h-5 text-blue-400" />)}

        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={textPrimary}><Database className="w-5 h-5" />Données</h3>
          <div className="space-y-3">
            <button onClick={exportData} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}><Upload className="w-5 h-5" />Exporter les données</button>
            <label className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium cursor-pointer border" style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}>
              <RefreshCw className="w-5 h-5" />Importer des données
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <button onClick={resetAllData} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-medium"><Trash2 className="w-5 h-5" />Réinitialiser toutes les données</button>
            <button onClick={async () => { document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; await supabase.auth.signOut(); window.location.href = '/auth'; }} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium border" style={{ background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary }}><LogOut className="w-5 h-5" />Se déconnecter</button>
          </div>
        </div>

        <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50">
          <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-[#7DD3A8]" /><h4 className="text-xs font-semibold text-[#7DD3A8]">💡 Conseils</h4></div>
          <div className="space-y-2">
            <p className="text-[10px] text-[#7DD3A8]">📦 Exportez régulièrement vos données pour les sauvegarder</p>
            <p className="text-[10px] text-[#7DD3A8]">🏦 Ajoutez tous vos comptes pour un suivi complet</p>
            <p className="text-[10px] text-[#7DD3A8]">📂 Personnalisez les catégories selon vos besoins</p>
          </div>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-4 mt-4 text-center border" style={cardStyle}>
          <p className="text-[10px]" style={textSecondary}>The Budget Planner v1.0</p>
          <p className="text-[10px]" style={textSecondary}>Créé avec ❤️ par Shina5</p>
        </div>
      </div>

      {showCompteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl p-4 w-full max-w-sm border" style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium" style={textPrimary}>{editingCompte ? 'Modifier' : 'Nouveau'} compte</h2>
              <button onClick={() => setShowCompteForm(false)} className="p-1"><X className="w-5 h-5" style={textPrimary} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Nom du compte</label>
                <input type="text" placeholder="Ex: CCP La Banque Postale" value={compteForm.nom} onChange={(e) => setCompteForm({ ...compteForm, nom: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Solde de départ ({parametres.devise})</label>
                <input type="number" placeholder="0" value={compteForm.soldeDepart} onChange={(e) => setCompteForm({ ...compteForm, soldeDepart: e.target.value })} className="w-full rounded-xl px-3 py-2 text-sm border" style={inputStyle} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium" style={textPrimary}>Compte épargne</label>
                <button onClick={() => setCompteForm({ ...compteForm, isEpargne: !compteForm.isEpargne })} className="w-12 h-6 rounded-full transition-colors" style={{ background: compteForm.isEpargne ? theme.colors.primary : theme.colors.cardBackgroundLight }}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${compteForm.isEpargne ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCompteForm(false)} className="flex-1 py-3 rounded-xl font-medium border" style={{ borderColor: theme.colors.primary, color: theme.colors.textPrimary }}>Annuler</button>
                <button onClick={handleCompteSubmit} className="flex-1 py-3 rounded-xl font-semibold" style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}>{editingCompte ? 'Modifier' : 'Créer'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ParametresPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="parametres" onNavigate={handleNavigate}>
      <ParametresContent />
    </AppShell>
  );
}
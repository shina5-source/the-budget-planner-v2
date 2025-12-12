"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, ChevronLeft, ChevronRight, Mail, Lightbulb, X, ShoppingCart, Home, Car, Utensils, Gift, Heart, Plane, Gamepad2, Music, Book, Shirt, Coffee, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell } from '@/components';

interface Enveloppe {
  id: number;
  nom: string;
  budget: number;
  couleur: string;
  icone: string;
  categories: string[];
}

interface Transaction {
  id: number;
  date: string;
  montant: string;
  type: string;
  categorie: string;
}

interface ParametresData {
  devise: string;
  categoriesDepenses: string[];
}

const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const years = [2023, 2024, 2025, 2026, 2027];

const couleursDisponibles = [
  { id: 'pastel-green', nom: 'Vert', bg: 'bg-green-200', border: 'border-green-400', text: 'text-green-700', progress: 'bg-green-400' },
  { id: 'pastel-blue', nom: 'Bleu', bg: 'bg-blue-200', border: 'border-blue-400', text: 'text-blue-700', progress: 'bg-blue-400' },
  { id: 'pastel-pink', nom: 'Rose', bg: 'bg-pink-200', border: 'border-pink-400', text: 'text-pink-700', progress: 'bg-pink-400' },
  { id: 'pastel-purple', nom: 'Violet', bg: 'bg-purple-200', border: 'border-purple-400', text: 'text-purple-700', progress: 'bg-purple-400' },
  { id: 'pastel-yellow', nom: 'Jaune', bg: 'bg-yellow-200', border: 'border-yellow-400', text: 'text-yellow-700', progress: 'bg-yellow-400' },
  { id: 'pastel-orange', nom: 'Orange', bg: 'bg-orange-200', border: 'border-orange-400', text: 'text-orange-700', progress: 'bg-orange-400' },
  { id: 'pastel-red', nom: 'Rouge', bg: 'bg-red-200', border: 'border-red-400', text: 'text-red-700', progress: 'bg-red-400' },
  { id: 'pastel-teal', nom: 'Turquoise', bg: 'bg-teal-200', border: 'border-teal-400', text: 'text-teal-700', progress: 'bg-teal-400' },
];

const iconesDisponibles = [
  { id: 'shopping-cart', nom: 'Courses', icon: ShoppingCart },
  { id: 'home', nom: 'Maison', icon: Home },
  { id: 'car', nom: 'Transport', icon: Car },
  { id: 'utensils', nom: 'Restaurant', icon: Utensils },
  { id: 'gift', nom: 'Cadeaux', icon: Gift },
  { id: 'heart', nom: 'Santé', icon: Heart },
  { id: 'plane', nom: 'Voyages', icon: Plane },
  { id: 'gamepad', nom: 'Loisirs', icon: Gamepad2 },
  { id: 'music', nom: 'Musique', icon: Music },
  { id: 'book', nom: 'Livres', icon: Book },
  { id: 'shirt', nom: 'Vêtements', icon: Shirt },
  { id: 'coffee', nom: 'Café', icon: Coffee },
  { id: 'smartphone', nom: 'Tech', icon: Smartphone },
];

function EnveloppesContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [parametres, setParametres] = useState<ParametresData>({
    devise: '€',
    categoriesDepenses: ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Loisirs', 'Santé', 'Cadeaux', 'Autres']
  });

  const [formData, setFormData] = useState({
    nom: '',
    budget: '',
    couleur: 'pastel-green',
    icone: 'shopping-cart',
    categories: [] as string[]
  });

  // Charger les données au démarrage
  useEffect(() => {
    const savedEnveloppes = localStorage.getItem('budget-enveloppes');
    if (savedEnveloppes) setEnveloppes(JSON.parse(savedEnveloppes));

    const savedTransactions = localStorage.getItem('budget-transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

    const savedParametres = localStorage.getItem('budget-parametres');
    if (savedParametres) {
      const parsed = JSON.parse(savedParametres);
      setParametres({
        devise: parsed.devise || '€',
        categoriesDepenses: parsed.categoriesDepenses || ['Courses', 'Restaurant', 'Essence', 'Shopping', 'Loisirs', 'Santé', 'Cadeaux', 'Autres']
      });
    }
  }, []);

  const saveEnveloppes = (newEnveloppes: Enveloppe[]) => {
    setEnveloppes(newEnveloppes);
    localStorage.setItem('budget-enveloppes', JSON.stringify(newEnveloppes));
  };

  const getCouleur = (id: string) => couleursDisponibles.find(c => c.id === id) || couleursDisponibles[0];
  const getIcone = (id: string) => iconesDisponibles.find(i => i.id === id) || iconesDisponibles[0];

  const getDepensesEnveloppe = (enveloppe: Enveloppe) => {
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'depense' &&
          enveloppe.categories.includes(t.categorie) &&
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear;
      })
      .reduce((sum, t) => sum + parseFloat(t.montant), 0);
  };

  const resetForm = () => {
    setFormData({ nom: '', budget: '', couleur: 'pastel-green', icone: 'shopping-cart', categories: [] });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.nom || !formData.budget) return;

    if (editingId) {
      const updated = enveloppes.map(e =>
        e.id === editingId ? { ...formData, id: editingId, budget: parseFloat(formData.budget) } : e
      );
      saveEnveloppes(updated);
      setEditingId(null);
    } else {
      const newEnveloppe: Enveloppe = {
        ...formData,
        id: Date.now(),
        budget: parseFloat(formData.budget)
      };
      saveEnveloppes([...enveloppes, newEnveloppe]);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (enveloppe: Enveloppe) => {
    setFormData({
      nom: enveloppe.nom,
      budget: enveloppe.budget.toString(),
      couleur: enveloppe.couleur,
      icone: enveloppe.icone,
      categories: enveloppe.categories
    });
    setEditingId(enveloppe.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette enveloppe ?')) {
      saveEnveloppes(enveloppes.filter(e => e.id !== id));
    }
  };

  const toggleCategorie = (cat: string) => {
    if (formData.categories.includes(cat)) {
      setFormData({ ...formData, categories: formData.categories.filter(c => c !== cat) });
    } else {
      setFormData({ ...formData, categories: [...formData.categories, cat] });
    }
  };

  const totalBudget = enveloppes.reduce((sum, e) => sum + e.budget, 0);
  const totalDepense = enveloppes.reduce((sum, e) => sum + getDepensesEnveloppe(e), 0);
  const totalReste = totalBudget - totalDepense;

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const cardStyle = { background: theme.colors.cardBackground, borderColor: theme.colors.cardBorder };
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const inputStyle = { background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary };

  return (
    <>
      <div className="pb-4">
        <div className="text-center mb-4">
          <h1 className="text-lg font-medium" style={textPrimary}>Enveloppes</h1>
          <p className="text-xs" style={textSecondary}>Gérez vos enveloppes budgétaires</p>
        </div>

        {/* Sélecteur de mois */}
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1">
              <ChevronLeft className="w-5 h-5" style={textPrimary} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold" style={textPrimary}>{monthsFull[selectedMonth]}</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="rounded-lg px-3 py-1 text-lg font-semibold border"
                style={inputStyle}
              >
                {years.map(year => (<option key={year} value={year}>{year}</option>))}
              </select>
            </div>
            <button onClick={nextMonth} className="p-1">
              <ChevronRight className="w-5 h-5" style={textPrimary} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {monthsShort.map((month, index) => (
              <button
                key={index}
                onClick={() => setSelectedMonth(index)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border`}
                style={selectedMonth === index
                  ? { background: theme.colors.primary, color: theme.colors.textOnPrimary, borderColor: theme.colors.primary }
                  : { background: 'transparent', color: theme.colors.textPrimary, borderColor: theme.colors.cardBorder }
                }
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Résumé */}
        <div className="backdrop-blur-sm rounded-2xl p-4 shadow-sm border mb-4" style={cardStyle}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[10px]" style={textSecondary}>Budget total</p>
              <p className="text-sm font-bold" style={textPrimary}>{totalBudget.toFixed(0)}{parametres.devise}</p>
            </div>
            <div>
              <p className="text-[10px]" style={textSecondary}>Dépensé</p>
              <p className="text-sm font-bold text-orange-500">{totalDepense.toFixed(0)}{parametres.devise}</p>
            </div>
            <div>
              <p className="text-[10px]" style={textSecondary}>Reste</p>
              <p className={`text-sm font-bold ${totalReste >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalReste.toFixed(0)}{parametres.devise}
              </p>
            </div>
          </div>
        </div>

        {/* Bouton ajouter */}
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium mb-4"
          style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
        >
          <Plus className="w-5 h-5" />
          Nouvelle enveloppe
        </button>

        {/* Liste des enveloppes */}
        {enveloppes.length > 0 ? (
          <div className="space-y-3 mb-4">
            {enveloppes.map((enveloppe) => {
              const couleur = getCouleur(enveloppe.couleur);
              const icone = getIcone(enveloppe.icone);
              const IconComponent = icone.icon;
              const depense = getDepensesEnveloppe(enveloppe);
              const reste = enveloppe.budget - depense;
              const pourcentage = enveloppe.budget > 0 ? (depense / enveloppe.budget) * 100 : 0;
              const isOverBudget = pourcentage > 100;
              const isWarning = pourcentage >= 80 && pourcentage <= 100;

              return (
                <div key={enveloppe.id} className={`${couleur.bg} rounded-2xl p-4 shadow-sm border ${couleur.border}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${couleur.bg} border ${couleur.border}`}>
                        <IconComponent className={`w-5 h-5 ${couleur.text}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${couleur.text}`}>{enveloppe.nom}</p>
                        <p className={`text-[10px] ${couleur.text} opacity-70`}>{enveloppe.categories.length} catégorie(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(enveloppe)} className="p-1.5 hover:bg-white/30 rounded-lg">
                        <Edit3 className={`w-4 h-4 ${couleur.text}`} />
                      </button>
                      <button onClick={() => handleDelete(enveloppe.id)} className="p-1.5 hover:bg-white/30 rounded-lg">
                        <Trash2 className={`w-4 h-4 ${couleur.text}`} />
                      </button>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : isWarning ? 'bg-orange-400' : couleur.progress}`}
                      style={{ width: `${Math.min(pourcentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <div>
                        <p className={`text-[10px] ${couleur.text} opacity-60`}>Budget</p>
                        <p className={`text-xs font-medium ${couleur.text}`}>{enveloppe.budget.toFixed(0)}{parametres.devise}</p>
                      </div>
                      <div>
                        <p className={`text-[10px] ${couleur.text} opacity-60`}>Dépensé</p>
                        <p className={`text-xs font-medium ${couleur.text}`}>{depense.toFixed(0)}{parametres.devise}</p>
                      </div>
                      <div>
                        <p className={`text-[10px] ${couleur.text} opacity-60`}>Reste</p>
                        <p className={`text-xs font-medium ${reste >= 0 ? couleur.text : 'text-red-600'}`}>{reste.toFixed(0)}{parametres.devise}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-[10px] font-medium ${isOverBudget ? 'bg-red-500 text-white' : isWarning ? 'bg-orange-400 text-white' : 'bg-white/50 ' + couleur.text}`}>
                      {Math.round(pourcentage)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="backdrop-blur-sm rounded-2xl text-center py-8 mb-4 border" style={cardStyle}>
            <Mail className="w-12 h-12 mx-auto mb-3" style={textSecondary} />
            <p className="text-xs mb-2" style={textSecondary}>Aucune enveloppe</p>
            <p className="text-[10px]" style={textSecondary}>Créez votre première enveloppe</p>
          </div>
        )}

        {/* Conseils */}
        <div className="bg-[#2E5A4C]/40 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#7DD3A8]/50">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-[#7DD3A8]" />
            <h4 className="text-xs font-semibold text-[#7DD3A8]">💡 Conseils</h4>
          </div>
          <div className="space-y-2">
            {enveloppes.length === 0 && (
              <p className="text-[10px] text-[#7DD3A8]">📝 Créez des enveloppes pour mieux gérer vos dépenses</p>
            )}
            {totalReste < 0 && (
              <p className="text-[10px] text-[#7DD3A8]">⚠️ Attention ! Vous avez dépassé votre budget total</p>
            )}
            {totalReste >= 0 && enveloppes.length > 0 && (
              <p className="text-[10px] text-[#7DD3A8]">✅ Bon travail ! Vos dépenses sont sous contrôle</p>
            )}
            <p className="text-[10px] text-[#7DD3A8]">💰 Associez des catégories à chaque enveloppe pour un suivi automatique</p>
          </div>
        </div>
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl p-4 w-full max-w-sm border max-h-[90vh] overflow-y-auto" style={{ background: theme.colors.cardBackgroundLight, borderColor: theme.colors.cardBorder }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium" style={textPrimary}>
                {editingId ? 'Modifier' : 'Nouvelle'} enveloppe
              </h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1">
                <X className="w-5 h-5" style={textPrimary} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nom */}
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Nom</label>
                <input
                  type="text"
                  placeholder="Ex: Courses alimentaires"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-sm border"
                  style={inputStyle}
                />
              </div>

              {/* Budget */}
              <div>
                <label className="text-xs font-medium mb-1 block" style={textPrimary}>Budget mensuel ({parametres.devise})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-sm border"
                  style={inputStyle}
                />
              </div>

              {/* Couleur */}
              <div>
                <label className="text-xs font-medium mb-2 block" style={textPrimary}>Couleur</label>
                <div className="flex flex-wrap gap-2">
                  {couleursDisponibles.map((couleur) => (
                    <button
                      key={couleur.id}
                      onClick={() => setFormData({ ...formData, couleur: couleur.id })}
                      className={`w-8 h-8 rounded-full ${couleur.bg} border-2 ${formData.couleur === couleur.id ? 'border-gray-800 scale-110' : couleur.border}`}
                    />
                  ))}
                </div>
              </div>

              {/* Icône */}
              <div>
                <label className="text-xs font-medium mb-2 block" style={textPrimary}>Icône</label>
                <div className="flex flex-wrap gap-2">
                  {iconesDisponibles.map((icone) => {
                    const IconComp = icone.icon;
                    return (
                      <button
                        key={icone.id}
                        onClick={() => setFormData({ ...formData, icone: icone.id })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border ${formData.icone === icone.id ? 'bg-gray-200 border-gray-800' : 'bg-white/50 border-gray-300'}`}
                      >
                        <IconComp className="w-5 h-5 text-gray-600" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Catégories */}
              <div>
                <label className="text-xs font-medium mb-2 block" style={textPrimary}>Catégories associées</label>
                <div className="flex flex-wrap gap-2">
                  {parametres.categoriesDepenses.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategorie(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.categories.includes(cat)
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white/50 border-gray-300 text-gray-600'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="flex-1 py-3 rounded-xl font-medium border"
                  style={{ borderColor: theme.colors.primary, color: theme.colors.textPrimary }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl font-semibold"
                  style={{ background: theme.colors.primary, color: theme.colors.textOnPrimary }}
                >
                  {editingId ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function EnveloppesPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="enveloppes" onNavigate={handleNavigate}>
      <EnveloppesContent />
    </AppShell>
  );
}

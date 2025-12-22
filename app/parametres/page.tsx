"use client";

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, FileText, ShoppingCart, PiggyBank } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, SmartTips, PageTitle } from '@/components';

import {
  SkeletonLoader,
  Footer,
  GeneralSection,
  PaieSection,
  CategorieSection,
  ComptesSection,
  DataSection,
  CompteFormModal,
  ParametresData,
  CompteBancaire,
  CompteFormData,
  defaultParametres,
  animationStyles
} from './components';

function ParametresContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  // États
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Form Modal
  const [showCompteForm, setShowCompteForm] = useState(false);
  const [editingCompte, setEditingCompte] = useState<CompteBancaire | null>(null);
  const [compteForm, setCompteForm] = useState<CompteFormData>({ 
    nom: '', 
    soldeDepart: '', 
    isEpargne: false 
  });

  // Chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = localStorage.getItem('budget-parametres');
        if (saved) {
          setParametres({ ...defaultParametres, ...JSON.parse(saved) });
        }
      } catch (error) {
        console.error('Erreur chargement paramètres:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    loadData();
  }, []);

  // Sauvegarde
  const saveParametres = useCallback((newParametres: ParametresData) => {
    setParametres(newParametres);
    localStorage.setItem('budget-parametres', JSON.stringify(newParametres));
  }, []);

  // Handlers
  const toggleSection = useCallback((section: string) => {
    setActiveSection(prev => prev === section ? null : section);
  }, []);

  const handleAddCompte = useCallback(() => {
    setCompteForm({ nom: '', soldeDepart: '', isEpargne: false });
    setEditingCompte(null);
    setShowCompteForm(true);
  }, []);

  const handleEditCompte = useCallback((compte: CompteBancaire) => {
    setEditingCompte(compte);
    setCompteForm({ 
      nom: compte.nom, 
      soldeDepart: compte.soldeDepart.toString(), 
      isEpargne: compte.isEpargne 
    });
    setShowCompteForm(true);
  }, []);

  const handleCompteSubmit = useCallback(() => {
    if (!compteForm.nom) return;
    
    if (editingCompte) {
      const updated = parametres.comptesBancaires.map(c => 
        c.id === editingCompte.id 
          ? { 
              ...editingCompte, 
              nom: compteForm.nom, 
              soldeDepart: parseFloat(compteForm.soldeDepart) || 0, 
              isEpargne: compteForm.isEpargne 
            } 
          : c
      );
      saveParametres({ ...parametres, comptesBancaires: updated });
    } else {
      const newCompte: CompteBancaire = { 
        id: Date.now(), 
        nom: compteForm.nom, 
        soldeDepart: parseFloat(compteForm.soldeDepart) || 0, 
        isEpargne: compteForm.isEpargne 
      };
      saveParametres({ ...parametres, comptesBancaires: [...parametres.comptesBancaires, newCompte] });
    }
    
    setCompteForm({ nom: '', soldeDepart: '', isEpargne: false });
    setEditingCompte(null);
    setShowCompteForm(false);
  }, [compteForm, editingCompte, parametres, saveParametres]);

  const handleFormClose = useCallback(() => {
    setShowCompteForm(false);
    setEditingCompte(null);
    setCompteForm({ nom: '', soldeDepart: '', isEpargne: false });
  }, []);

  // Loading
  if (isLoading) {
    return (
      <div className="pb-4">
        <style>{animationStyles}</style>
        <PageTitle page="parametres" />
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      
      <div className="pb-4">
        <PageTitle page="parametres" />

        {/* Section Général */}
        <GeneralSection 
          parametres={parametres} 
          onSave={saveParametres} 
        />

        {/* Section Gestion des Paies - NOUVEAU */}
        <PaieSection
          parametres={parametres}
          onSave={saveParametres}
          isActive={activeSection === 'paie'}
          onToggle={() => toggleSection('paie')}
        />

        {/* Section Comptes */}
        <ComptesSection
          parametres={parametres}
          onSave={saveParametres}
          isActive={activeSection === 'comptes'}
          onToggle={() => toggleSection('comptes')}
          onAddCompte={handleAddCompte}
          onEditCompte={handleEditCompte}
        />

        {/* Section Catégories Revenus */}
        <CategorieSection
          title="Catégories Revenus"
          type="categoriesRevenus"
          icon={<TrendingUp className="w-5 h-5 text-green-400" />}
          parametres={parametres}
          onSave={saveParametres}
          isActive={activeSection === 'categoriesRevenus'}
          onToggle={() => toggleSection('categoriesRevenus')}
          staggerIndex={3}
        />

        {/* Section Catégories Factures */}
        <CategorieSection
          title="Catégories Factures"
          type="categoriesFactures"
          icon={<FileText className="w-5 h-5 text-red-400" />}
          parametres={parametres}
          onSave={saveParametres}
          isActive={activeSection === 'categoriesFactures'}
          onToggle={() => toggleSection('categoriesFactures')}
          staggerIndex={4}
        />

        {/* Section Catégories Dépenses */}
        <CategorieSection
          title="Catégories Dépenses"
          type="categoriesDepenses"
          icon={<ShoppingCart className="w-5 h-5 text-orange-400" />}
          parametres={parametres}
          onSave={saveParametres}
          isActive={activeSection === 'categoriesDepenses'}
          onToggle={() => toggleSection('categoriesDepenses')}
          staggerIndex={5}
        />

        {/* Section Catégories Épargnes */}
        <CategorieSection
          title="Catégories Épargnes"
          type="categoriesEpargnes"
          icon={<PiggyBank className="w-5 h-5 text-blue-400" />}
          parametres={parametres}
          onSave={saveParametres}
          isActive={activeSection === 'categoriesEpargnes'}
          onToggle={() => toggleSection('categoriesEpargnes')}
          staggerIndex={6}
        />

        {/* Section Données */}
        <DataSection 
          parametres={parametres} 
          onSave={saveParametres} 
        />

        {/* SmartTips */}
        <SmartTips page="parametres" />

        {/* Footer avec effet Shina5 */}
        <Footer />
      </div>

      {/* Modal Compte */}
      <CompteFormModal
        isOpen={showCompteForm}
        onClose={handleFormClose}
        onSubmit={handleCompteSubmit}
        formData={compteForm}
        onFormChange={setCompteForm}
        editingCompte={editingCompte}
        devise={parametres.devise}
      />
    </>
  );
}

export default function ParametresPage() {
  const router = useRouter();

  const handleNavigate = useCallback((page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  }, [router]);

  return (
    <AppShell currentPage="parametres" onNavigate={handleNavigate}>
      <ParametresContent />
    </AppShell>
  );
}
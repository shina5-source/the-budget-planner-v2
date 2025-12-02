"use client";

import { X } from 'lucide-react';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  isEditing: boolean;
}

const typesOptions = ['Revenus', 'Factures', 'Dépenses', 'Épargnes', 'Reprise d\'épargne', 'Remboursement', 'Transfert de fond'];

const categoriesByType: Record<string, string[]> = {
  'Revenus': ['Salaire Foundever', 'Revenus Secondaires', 'Allocations Familiales', 'Aides Sociales', 'Sécurité Sociale', 'Remboursement', 'Aide Financière', 'Aide Familiale', 'Prêt & Crédit Reçu', 'Dépôt Espèces', 'Ventes'],
  'Factures': ['Loyer', 'Électricité', 'Eau', 'Assainissement', 'Assurance Habitation', 'Assurance Auto/Moto', 'Assurance Mobile', 'Assurance Chubb European', 'Abonnement Internet', 'Abonnement Mobile Dhc', 'Abonnement Mobile Moi', 'Abonnement Mobile Kayu', 'Abonnement Mobile Timothy', 'Abonnement Mobile Kim', 'Abonnement Salle de Sport', 'Abonnement Streaming', 'Abonnement Transport Commun', 'Abonnement Autres', 'Cotisation Syndical Sud', 'Emprunt Bourse Titi', 'Crédit Carrefour Banque', 'Crédit La Banque Postale', 'Crédit la Banque Postale Permis', 'Crédit Floa Bank', 'Crédit Cofidis', 'Crédit Cetelem', 'Crédit Floa Bank 4x', 'Crédit Paiement en 4x', 'Chèque Reporté Carrefour', 'Impôts Trésor Public'],
  'Dépenses': ['Courses', 'Courses Asiatique', 'Restaurant', 'Fast Food', 'Cafés Bar Boulangerie', 'Essence ou Carburant', 'Péage Parking', 'Entretien Auto Moto', 'Tabac Cigarettes', 'Achat CB', 'Achat Google', 'Achat CB Carrefour Banque', 'Chèque Reporté Carrefour', 'Aide Familiale', 'Remboursement Famille', 'Retrait', 'Cinéma', 'Sorties Vacances Voyages', 'Shopping', 'Shopping Enfant', 'Soins Personnel', 'Livres Manga', 'Ameublement Déco', 'Consultations Médicales', 'Pharmacie Médicaments', 'Cadeaux', 'Frais Bancaires', 'Frais Imprévus', 'Amendes', 'Autres Dépenses'],
  'Épargnes': ['Livret A', 'Livret A Kim', 'Tirelire', 'Espèces', 'Anniversaire Coy', 'Anniversaire Kayu', 'Anniversaire Titi', 'Anniversaire Kim', 'Anniversaire Negro', 'Anniversaire Acrat', 'Anniversaire La Naine', 'Anniversaire Noy', 'Voyages', 'Noël', 'Fonds Urgence', 'CCP La Banque Postale', 'CCP BoursoBank'],
  'Reprise d\'épargne': ['Livret A', 'Livret A Kim', 'Tirelire', 'Espèces', 'Anniversaire Coy', 'Anniversaire Kayu', 'Anniversaire Titi', 'Anniversaire Kim', 'Anniversaire Negro', 'Anniversaire Acrat', 'Anniversaire La Naine', 'Anniversaire Noy', 'Voyages', 'Noël', 'Fonds Urgence', 'CCP La Banque Postale', 'CCP BoursoBank'],
  'Remboursement': ['Livret A', 'Livret A Kim', 'Tirelire', 'Espèces', 'Anniversaire Coy', 'Anniversaire Kayu', 'Anniversaire Titi', 'Anniversaire Kim', 'Anniversaire Negro', 'Anniversaire Acrat', 'Anniversaire La Naine', 'Anniversaire Noy', 'Voyages', 'Noël', 'Fonds Urgence', 'CCP La Banque Postale', 'CCP BoursoBank'],
  'Transfert de fond': ['Livret A', 'Livret A Kim', 'Tirelire', 'Espèces', 'Anniversaire Coy', 'Anniversaire Kayu', 'Anniversaire Titi', 'Anniversaire Kim', 'Anniversaire Negro', 'Anniversaire Acrat', 'Anniversaire La Naine', 'Anniversaire Noy', 'Voyages', 'Noël', 'Fonds Urgence', 'CCP La Banque Postale', 'CCP BoursoBank']
};

const comptesOptions = ['CCP La Banque Postale', 'CCP BoursoBank', 'Livret A La Banque Postale', 'Livret A Kim La Banque Postale', 'Tirelire', 'Espèce', 'Anniversaire Coy', 'Anniversaire Kayu', 'Anniversaire Titi', 'Anniversaire Kim', 'Anniversaire Negro', 'Anniversaire Acrat', 'Anniversaire La Naine', 'Anniversaire Noy', 'Voyages', 'Noël', 'Fonds Urgence', 'Externe'];

const moyensPaiementOptions = ['Prélèvement', 'Paiement CB', 'Virement', 'Chèque', 'Espèces', 'Paiement en ligne', 'Paiement mobile'];

export default function TransactionForm({ isOpen, onClose, formData, setFormData, onSubmit, isEditing }: TransactionFormProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-gray-800">{isEditing ? 'Modifier' : 'Nouvelle transaction'}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Montant (€)</label>
              <input type="number" step="0.01" value={formData.montant} onChange={(e) => setFormData({...formData, montant: e.target.value})} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm mt-1" placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value, categorie: ''})} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm mt-1">
                {typesOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600">Catégorie</label>
              <select value={formData.categorie} onChange={(e) => setFormData({...formData, categorie: e.target.value})} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm mt-1">
                <option value="">Sélectionner...</option>
                {(categoriesByType[formData.type] || []).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input type="checkbox" checked={formData.isCredit} onChange={(e) => setFormData({...formData, isCredit: e.target.checked})} className="w-4 h-4 accent-purple-400" />
            <label className="text-xs text-gray-600">C&apos;est un crédit</label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Depuis</label>
              <select value={formData.depuis} onChange={(e) => setFormData({...formData, depuis: e.target.value})} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm mt-1">
                <option value="">Sélectionner...</option>
                {comptesOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600">Vers</label>
              <select value={formData.vers} onChange={(e) => setFormData({...formData, vers: e.target.value})} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm mt-1">
                <option value="">Sélectionner...</option>
                {comptesOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600">Moyen de paiement</label>
            <select value={formData.moyenPaiement} onChange={(e) => setFormData({...formData, moyenPaiement: e.target.value})} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm mt-1">
              <option value="">Sélectionner...</option>
              {moyensPaiementOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm mt-1" rows={2} placeholder="Note..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700">Annuler</button>
            <button onClick={onSubmit} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl text-sm">{isEditing ? 'Modifier' : 'Ajouter'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
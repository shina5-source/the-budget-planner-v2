"use client";

import { CreditCard, PiggyBank, Building2, FileText, Mail, Settings, BarChart3 } from 'lucide-react';

interface PlusPageProps {
  onNavigate: (page: string) => void;
}

export default function PlusPage({ onNavigate }: PlusPageProps) {
  const menuItems = [
    { icon: CreditCard, label: 'Transactions', page: 'transactions' },
    { icon: PiggyBank, label: 'Épargnes', page: 'epargnes' },
    { icon: Building2, label: 'Crédits & Dettes', page: 'credits-dettes' },
    { icon: FileText, label: 'Mémo', page: 'memo' },
    { icon: Mail, label: 'Enveloppes', page: 'enveloppes' },
    { icon: BarChart3, label: 'Statistiques', page: 'statistiques' },
    { icon: Settings, label: 'Paramètres', page: 'parametres' },
  ];

  const cardStyle = "bg-[#722F37]/30 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#D4AF37]/40";

  return (
    <div className="pb-4">
      {/* Titre centré */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-medium text-[#D4AF37]">Plus</h1>
        <p className="text-xs text-[#D4AF37]/70">Accès rapide aux fonctionnalités</p>
      </div>

      {/* Liste des raccourcis */}
      <div className="space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onNavigate(item.page)}
              className={cardStyle + " w-full flex items-center gap-4 active:scale-[0.98] transition-transform"}
            >
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center border border-[#D4AF37]/50">
                <Icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <span className="text-sm font-medium text-[#D4AF37]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
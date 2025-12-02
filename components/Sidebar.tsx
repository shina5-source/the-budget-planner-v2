"use client";

import { X, Home, CreditCard, Calendar, DollarSign, PiggyBank, Building2, FileText, Mail, Settings } from 'lucide-react';
import Image from 'next/image';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'accueil', icon: Home, label: 'Accueil' },
  { id: 'transactions', icon: CreditCard, label: 'Transactions' },
  { id: 'budget', icon: DollarSign, label: 'Budget' },
  { id: 'previsionnel', icon: Calendar, label: 'Prévisionnel' },
  { id: 'epargnes', icon: PiggyBank, label: 'Épargnes' },
  { id: 'credits-dettes', icon: Building2, label: 'Crédits & Dettes' },
  { id: 'memo', icon: FileText, label: 'Mémo' },
  { id: 'enveloppes', icon: Mail, label: 'Enveloppes' },
  { id: 'parametres', icon: Settings, label: 'Paramètres' },
];

export default function Sidebar({ isOpen, onClose, currentPage, onNavigate }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute top-0 left-0 h-full w-64 bg-[#5C1E2A] shadow-xl">
        {/* Header avec Logo */}
        <div className="p-4 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-md">
              <Image 
                src="/logo-shina5.png" 
                alt="Logo" 
                width={40} 
                height={40} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[#D4AF37] font-semibold text-xs">The Budget Planner</span>
          </div>
          <button onClick={onClose} className="p-2" type="button">
            <X className="w-5 h-5 text-[#D4AF37]" />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
                  isActive
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50'
                    : 'text-[#D4AF37]/70 hover:bg-[#D4AF37]/10 border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="text-center">
            <p className="text-[10px] text-[#D4AF37]/50">Créé avec ❤️</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { X, Home, CreditCard, Calendar, DollarSign, PiggyBank, Target, Building2, FileText, Mail, Settings, BarChart3, LogOut } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useTheme } from '../contexts/theme-context';

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
  { id: 'objectifs', icon: Target, label: 'Objectifs' },
  { id: 'credits-dettes', icon: Building2, label: 'Crédits & Dettes' },
  { id: 'memo', icon: FileText, label: 'Mémo' },
  { id: 'enveloppes', icon: Mail, label: 'Enveloppes' },
  { id: 'statistiques', icon: BarChart3, label: 'Statistiques' },
  { id: 'parametres', icon: Settings, label: 'Paramètres' },
];

export default function Sidebar({ isOpen, onClose, currentPage, onNavigate }: SidebarProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className="absolute top-0 left-0 h-full w-64 shadow-xl"
        style={{ backgroundColor: theme.colors.secondary }}
      >
        {/* Header avec Logo */}
        <div 
          className="p-4 flex items-center justify-between border-b"
          style={{ borderColor: `${theme.colors.primary}30` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl overflow-hidden border shadow-md"
              style={{ borderColor: `${theme.colors.primary}50` }}
            >
              <Image 
                src="/logo-shina5.png" 
                alt="Logo" 
                width={40} 
                height={40} 
                className="w-full h-full object-cover"
              />
            </div>
            <span 
              className="font-semibold text-xs"
              style={{ color: theme.colors.primary }}
            >
              The Budget Planner
            </span>
          </div>
          <button onClick={onClose} className="p-2" type="button">
            <X className="w-5 h-5" style={{ color: theme.colors.primary }} />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4 px-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors border"
                style={{
                  backgroundColor: isActive ? `${theme.colors.primary}20` : 'transparent',
                  color: isActive ? theme.colors.primary : `${theme.colors.primary}B0`,
                  borderColor: isActive ? `${theme.colors.primary}50` : 'transparent'
                }}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 px-4 space-y-3">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/auth';
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border"
            style={{
              backgroundColor: theme.colors.secondaryLight,
              borderColor: `${theme.colors.primary}50`,
              color: theme.colors.primary
            }}
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
          <div className="text-center">
            <p 
              className="text-[10px]"
              style={{ color: `${theme.colors.primary}50` }}
            >
              Créé avec ❤️ by Shina5
              
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
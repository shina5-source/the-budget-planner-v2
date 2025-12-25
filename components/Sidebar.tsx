"use client";

import { X, Home, CreditCard, Calendar, DollarSign, PiggyBank, Target, Building2, FileText, Mail, Settings, BarChart3, LogOut } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useTheme } from '../contexts/theme-context';

// Styles d'animation pour le cœur et le gradient
const animationStyles = `
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.3); }
    35% { transform: scale(1); }
    45% { transform: scale(1.2); }
    55% { transform: scale(1); }
  }
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

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
  
  // Couleur du texte sur fond secondary (sidebar)
  const sidebarTextColor = theme.colors.textOnSecondary;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      <style>{animationStyles}</style>
      
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
          style={{ borderColor: `${sidebarTextColor}30` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl overflow-hidden border shadow-md"
              style={{ borderColor: `${sidebarTextColor}50` }}
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
              style={{ color: sidebarTextColor }}
            >
              The Budget Planner
            </span>
          </div>
          <button onClick={onClose} className="p-2" type="button">
            <X className="w-5 h-5" style={{ color: sidebarTextColor }} />
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
                  backgroundColor: isActive ? `${sidebarTextColor}20` : 'transparent',
                  color: isActive ? sidebarTextColor : `${sidebarTextColor}B0`,
                  borderColor: isActive ? `${sidebarTextColor}50` : 'transparent'
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
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
              color: theme.colors.textOnPrimary
            }}
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
          <div className="text-center">
            <p 
              className="text-[10px]"
              style={{ color: `${sidebarTextColor}70` }}
            >
              Créé avec{' '}
              <span 
                className="text-red-400 text-sm inline-block"
                style={{ animation: 'heartbeat 1.5s ease-in-out infinite' }}
              >
                ❤️
              </span>
              {' '}by{' '}
              <span 
                className="font-semibold"
                style={{ 
                  background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #ec4899)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradient-shift 3s ease infinite'
                }}
              >
                Shina5
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
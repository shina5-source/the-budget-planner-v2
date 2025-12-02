"use client";

import { Home, DollarSign, Calendar, Target, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'accueil', icon: Home, label: 'Accueil' },
  { id: 'budget', icon: DollarSign, label: 'Budget' },
  { id: 'previsionnel', icon: Calendar, label: 'Prévisionnel' },
  { id: 'objectifs', icon: Target, label: 'Objectifs' },
  { id: 'plus', icon: MoreHorizontal, label: 'Plus' },
];

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[50] bg-[#5C1E2A] border-t border-[#D4AF37]/30">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'text-[#D4AF37]' : 'text-[#D4AF37]/50'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
"use client";

import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-[#5C1E2A]">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <button 
          onClick={onMenuClick} 
          className="p-2 relative z-[1000]"
          type="button"
        >
          <Menu className="w-5 h-5 text-[#D4AF37]" />
        </button>
        <h1 className="text-sm font-medium text-[#D4AF37]">The Budget Planner</h1>
        <div className="w-9"></div>
      </div>
    </header>
  );
}
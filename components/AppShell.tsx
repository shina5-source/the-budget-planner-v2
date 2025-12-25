"use client";

import { useState } from 'react';
import { Header, BottomNav, Sidebar } from '@/components';
import { ThemeModal } from '@/components/theme-modal';
import { useTheme } from '@/contexts/theme-context';
import { StarryBackground } from '@/components/ui/StarryBackground';

interface AppShellProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AppShell({ children, currentPage, onNavigate }: AppShellProps) {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setSidebarOpen(false);
    onNavigate(page);
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{ 
        background: `linear-gradient(180deg, ${theme.colors.backgroundGradientFrom} 0%, ${theme.colors.backgroundGradientTo} 50%, ${theme.colors.backgroundGradientFrom} 100%)` 
      }}
    >
      {/* Étoiles scintillantes pour le thème nuit-etoilee */}
      <StarryBackground />
      
      <Header 
        onMenuClick={() => setSidebarOpen(true)} 
        onThemeClick={() => setThemeModalOpen(true)} 
      />
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
      />
      <main className="px-4 pt-20 pb-24 max-w-md mx-auto relative z-10">
        {children}
      </main>
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      <ThemeModal isOpen={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </div>
  );
}
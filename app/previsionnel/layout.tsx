"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, BottomNav, Header } from '@/components';

export default function PrevisionnelLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (page: string) => {
    setIsSidebarOpen(false);
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-pink-100 via-purple-50 to-pink-50 min-h-screen relative">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPage="previsionnel" onNavigate={handleNavigate} />
      <div className="px-4 pt-4 pb-24">{children}</div>
      <BottomNav currentPage="previsionnel" onNavigate={handleNavigate} onOpenSidebar={() => setIsSidebarOpen(true)} />
    </div>
  );
}
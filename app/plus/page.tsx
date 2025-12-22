"use client";

import { useState, useEffect } from 'react';
import { CreditCard, PiggyBank, Building2, FileText, Mail, Settings, BarChart3, ChevronRight, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { AppShell, PageTitle } from '@/components';

// Animations CSS avec effets glow + mobile support
const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes shine {
    0% { left: -100%; }
    50%, 100% { left: 100%; }
  }
  @keyframes icon-bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
  @keyframes icon-pulse-subtle {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(var(--glow-rgb), 0.4); }
    50% { transform: scale(1.02); box-shadow: 0 0 15px 3px rgba(var(--glow-rgb), 0.2); }
  }
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.4s ease-out forwards;
    opacity: 0;
  }
  .skeleton-shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .menu-card {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .menu-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.15),
      transparent
    );
    transition: none;
    pointer-events: none;
  }
  
  /* Icon container - toujours visible avec couleur */
  .icon-container {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  /* Glow border - légèrement visible par défaut sur mobile */
  .glow-border {
    position: absolute;
    inset: -1px;
    border-radius: 1rem;
    opacity: 0.15;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  
  /* Desktop hover effects */
  @media (hover: hover) and (pointer: fine) {
    .glow-border {
      opacity: 0;
    }
    .menu-card:hover::before {
      animation: shine 0.8s ease-in-out;
    }
    .menu-card:hover {
      transform: translateY(-2px) scale(1.01);
    }
    .menu-card:hover .icon-container {
      animation: icon-bounce 0.4s ease-in-out;
    }
    .menu-card:hover .glow-border {
      opacity: 1;
    }
    .menu-card:hover .chevron-icon {
      transform: translateX(4px);
    }
  }
  
  /* Mobile/Touch - couleurs toujours visibles */
  @media (hover: none) and (pointer: coarse) {
    .glow-border {
      opacity: 0.2;
      animation: glow-pulse 3s ease-in-out infinite;
    }
    .icon-container {
      box-shadow: 0 2px 8px rgba(var(--glow-rgb), 0.3);
    }
  }
  
  /* Mobile/Touch active effects */
  .menu-card:active {
    transform: scale(0.98);
  }
  .menu-card:active .glow-border {
    opacity: 0.8 !important;
  }
  .menu-card:active .icon-container {
    transform: scale(1.1);
  }
  .menu-card:active .chevron-icon {
    transform: translateX(4px);
  }
  
  /* Touch feedback class (added via JS) */
  .menu-card.touched {
    transform: scale(0.98);
  }
  .menu-card.touched .glow-border {
    opacity: 0.8 !important;
  }
  .menu-card.touched .icon-container {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(var(--glow-rgb), 0.4);
  }
  .menu-card.touched::before {
    animation: shine 0.6s ease-in-out;
  }
  
  .chevron-icon {
    transition: transform 0.2s ease;
  }
  .stagger-1 { animation-delay: 0.03s; }
  .stagger-2 { animation-delay: 0.06s; }
  .stagger-3 { animation-delay: 0.09s; }
  .stagger-4 { animation-delay: 0.12s; }
  .stagger-5 { animation-delay: 0.15s; }
  .stagger-6 { animation-delay: 0.18s; }
  .stagger-7 { animation-delay: 0.21s; }
  .stagger-8 { animation-delay: 0.24s; }
`;

// Fonction pour convertir hex en RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '139, 92, 246';
}

// Skeleton Loader
function SkeletonLoader() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  
  return (
    <div className="pb-4 space-y-4">
      <style>{animationStyles}</style>
      {/* Skeleton titre */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div 
          className="w-10 h-10 rounded-xl skeleton-shimmer"
          style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
        />
        <div 
          className="h-5 w-24 rounded skeleton-shimmer"
          style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
        />
        <div 
          className="h-3 w-40 rounded skeleton-shimmer"
          style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
        />
      </div>
      
      {/* Skeleton menu items */}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div 
          key={i}
          className="rounded-2xl p-4 border flex items-center gap-4"
          style={{ 
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.cardBorder 
          }}
        >
          <div 
            className="w-12 h-12 rounded-2xl skeleton-shimmer"
            style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
          />
          <div className="flex-1 space-y-2">
            <div 
              className="h-4 w-28 rounded skeleton-shimmer"
              style={{ backgroundColor: `${theme.colors.cardBorder}30` }}
            />
            <div 
              className="h-3 w-40 rounded skeleton-shimmer"
              style={{ backgroundColor: `${theme.colors.cardBorder}20` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Menu Item Component avec effets glow + mobile
interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  description: string;
  page: string;
  index: number;
  glowColor: string;
  onClick: (page: string) => void;
}

function MenuItem({ icon: Icon, label, description, page, index, glowColor, onClick }: MenuItemProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const [isTouched, setIsTouched] = useState(false);
  
  const textPrimary = { color: theme.colors.textPrimary };
  const textSecondary = { color: theme.colors.textSecondary };
  const glowRgb = hexToRgb(glowColor);

  const handleTouchStart = () => {
    setIsTouched(true);
  };

  const handleTouchEnd = () => {
    // Petit délai pour voir l'effet avant navigation
    setTimeout(() => {
      setIsTouched(false);
    }, 150);
  };

  const handleClick = () => {
    onClick(page);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => setIsTouched(false)}
      className={`animate-fade-in-up stagger-${index + 1} menu-card backdrop-blur-sm rounded-2xl p-4 shadow-sm border w-full flex items-center gap-4 ${isTouched ? 'touched' : ''}`}
      style={{ 
        background: theme.colors.cardBackground, 
        borderColor: theme.colors.cardBorder,
        // CSS variable pour le glow RGB
        '--glow-rgb': glowRgb
      } as React.CSSProperties}
    >
      {/* Glow border effect - visible par défaut sur mobile */}
      <div 
        className="glow-border"
        style={{ 
          background: `linear-gradient(135deg, ${glowColor}60, ${glowColor}30, ${glowColor}60)`,
          boxShadow: `0 0 20px ${glowColor}30, inset 0 0 10px ${glowColor}10`
        }}
      />
      
      {/* Icon container - TOUJOURS coloré */}
      <div 
        className="icon-container w-12 h-12 rounded-2xl flex items-center justify-center border relative z-10"
        style={{ 
          background: `${glowColor}25`, 
          borderColor: `${glowColor}50`,
          boxShadow: `0 2px 10px ${glowColor}20`
        }}
      >
        <Icon 
          className="w-6 h-6" 
          style={{ color: glowColor }} 
        />
      </div>
      
      {/* Text content */}
      <div className="flex-1 text-left relative z-10">
        <span className="text-sm font-semibold block" style={textPrimary}>
          {label}
        </span>
        <span className="text-xs block mt-0.5" style={textSecondary}>
          {description}
        </span>
      </div>
      
      {/* Chevron - coloré */}
      <ChevronRight 
        className="chevron-icon w-5 h-5 relative z-10" 
        style={{ color: glowColor }} 
      />
    </button>
  );
}

function PlusContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Simuler le chargement
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { 
      icon: CreditCard, 
      label: 'Transactions', 
      description: 'Gérer vos mouvements financiers',
      page: '/transactions',
      glowColor: '#3B82F6' // Bleu
    },
    { 
      icon: PiggyBank, 
      label: 'Épargnes', 
      description: 'Suivre votre épargne mensuelle',
      page: '/epargnes',
      glowColor: '#22C55E' // Vert
    },
    { 
      icon: Target, 
      label: 'Objectifs', 
      description: 'Vos objectifs financiers',
      page: '/objectifs',
      glowColor: '#F59E0B' // Orange
    },
    { 
      icon: Building2, 
      label: 'Crédits & Dettes', 
      description: 'Suivi de vos engagements',
      page: '/credits-dettes',
      glowColor: '#EF4444' // Rouge
    },
    { 
      icon: FileText, 
      label: 'Mémo', 
      description: 'Notes et rappels personnels',
      page: '/memo',
      glowColor: '#A855F7' // Violet
    },
    { 
      icon: Mail, 
      label: 'Enveloppes', 
      description: 'Gestion par enveloppes budgétaires',
      page: '/enveloppes',
      glowColor: '#EC4899' // Rose
    },
    { 
      icon: BarChart3, 
      label: 'Statistiques', 
      description: 'Analyser vos finances',
      page: '/statistiques',
      glowColor: '#06B6D4' // Cyan
    },
    { 
      icon: Settings, 
      label: 'Paramètres', 
      description: 'Configurer l\'application',
      page: '/parametres',
      glowColor: '#6B7280' // Gris
    },
  ];

  const handleNavigate = (page: string) => {
    router.push(page);
  };

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="pb-4">
      <style>{animationStyles}</style>
      
      {/* Titre avec icône */}
      <PageTitle page="plus" />

      {/* Liste des raccourcis */}
      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <MenuItem
            key={item.page}
            icon={item.icon}
            label={item.label}
            description={item.description}
            page={item.page}
            index={index}
            glowColor={item.glowColor}
            onClick={handleNavigate}
          />
        ))}
      </div>

      {/* Footer info */}
      <div 
        className="mt-6 text-center animate-fade-in-up"
        style={{ animationDelay: '0.5s' }}
      >
        <p 
          className="text-xs"
          style={{ color: theme.colors.textSecondary }}
        >
          ✨ Accédez rapidement à toutes les fonctionnalités
        </p>
      </div>
    </div>
  );
}

export default function PlusPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'accueil') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <AppShell currentPage="plus" onNavigate={handleNavigate}>
      <PlusContent />
    </AppShell>
  );
}
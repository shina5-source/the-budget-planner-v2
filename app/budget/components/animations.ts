// Animations CSS-in-JS partagées - Version enrichie avec animations ludiques
export const animationStyles = `
  /* === Animations de base === */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* === Nouvelles animations ludiques === */
  
  /* Bounce élastique pour les succès */
  @keyframes bounceIn {
    0% { opacity: 0; transform: scale(0.3); }
    50% { opacity: 1; transform: scale(1.1); }
    70% { transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  }

  /* Célébration avec rotation */
  @keyframes celebrate {
    0% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.1) rotate(-3deg); }
    50% { transform: scale(1.05) rotate(3deg); }
    75% { transform: scale(1.1) rotate(-2deg); }
    100% { transform: scale(1) rotate(0deg); }
  }

  /* Glow pulsant pour les éléments excellents */
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 5px rgba(76, 175, 80, 0.3); }
    50% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.6), 0 0 30px rgba(76, 175, 80, 0.3); }
  }

  /* Effet shimmer (brillance glissante) */
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  /* Flottement doux pour les particules */
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
    50% { transform: translateY(-8px) rotate(10deg); opacity: 1; }
  }

  /* Pop pour les actions terminées */
  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  /* Shake pour les alertes */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }

  /* Checkmark animation pour les tâches */
  @keyframes checkPop {
    0% { transform: scale(0); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }

  /* === Classes utilitaires === */
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
  .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
  .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
  .animate-slide-in-right { animation: slideInRight 0.4s ease-out forwards; }
  
  /* Nouvelles classes */
  .animate-bounce-in { animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
  .animate-celebrate { animation: celebrate 0.6s ease-in-out; }
  .animate-glow-pulse { animation: glowPulse 2s ease-in-out infinite; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-pop { animation: pop 0.3s ease-out; }
  .animate-shake { animation: shake 0.4s ease-in-out; }
  .animate-check-pop { animation: checkPop 0.3s ease-out forwards; }

  /* Stagger delays */
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.1s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.2s; }
  .stagger-5 { animation-delay: 0.25s; }
  .stagger-6 { animation-delay: 0.3s; }
  .stagger-7 { animation-delay: 0.35s; }

  /* === Animations spécifiques HealthGauge === */
  .health-gauge-excellent {
    animation: glowPulse 2s ease-in-out infinite;
  }
  
  .health-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmer 2s ease-in-out infinite;
  }
  
  .health-shimmer-bar {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: shimmer 1.5s ease-in-out infinite;
  }
  
  .health-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .health-glow {
    animation: glowPulse 2s ease-in-out infinite;
  }
  
  .health-celebrate {
    animation: celebrate 0.6s ease-in-out;
  }

  /* === Animations pour les actions (Correctifs) === */
  .action-complete {
    animation: pop 0.3s ease-out;
  }
  
  .action-check {
    animation: checkPop 0.3s ease-out forwards;
  }

  /* Hover effects pour les cartes interactives */
  .hover-lift {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Couleurs par type de transaction
export const COLORS_TYPE = {
  revenus: '#4CAF50',
  factures: '#F44336',
  depenses: '#FF9800',
  epargnes: '#2196F3'
};

// Couleurs pour les graphiques
export const COLORS = ['#D4AF37', '#8B4557', '#7DD3A8', '#5C9EAD', '#E8A87C', '#C38D9E', '#41B3A3', '#E27D60', '#85DCB8', '#E8A87C'];
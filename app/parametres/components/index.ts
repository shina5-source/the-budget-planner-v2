// Exports des composants Paramètres
export { default as SkeletonLoader } from './SkeletonLoader';
export { default as Footer } from './Footer';
export { default as GeneralSection } from './GeneralSection';
export { default as CategorieSection } from './CategorieSection';
export { default as ComptesSection } from './ComptesSection';
export { default as DataSection } from './DataSection';
export { default as CompteFormModal } from './CompteFormModal';
export { default as PaieSection } from './PaieSection';

// Export types
export type { 
  CompteBancaire, 
  ParametresData, 
  CompteFormData,
  CategorieType,
  ConfigurationPaie,
  PaieMensuelle,
  PeriodeBudget
} from './types';

// Export constants
export { 
  defaultParametres,
  defaultConfigurationPaie,
  devises,
  joursOptions,
  nomsMois,
  nomsMoisCourts,
  animationStyles
} from './constants';
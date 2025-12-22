// Exports des composants Paramètres
export { default as SkeletonLoader } from './SkeletonLoader';
export { default as Footer } from './Footer';
export { default as GeneralSection } from './GeneralSection';
export { default as CategorieSection } from './CategorieSection';
export { default as ComptesSection } from './ComptesSection';
export { default as DataSection } from './DataSection';
export { default as CompteFormModal } from './CompteFormModal';
export { default as PaieSection } from './PaieSection';
export { joursOptions, nomsMois, nomsMoisCourts } from './constants';

// Export types
export type { 
  CompteBancaire, 
  ParametresData, 
  CompteFormData,
  CategorieType
} from './types';

// Export constants
export { 
  defaultParametres,
  devises,
  animationStyles
} from './constants';
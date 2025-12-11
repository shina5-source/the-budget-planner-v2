import { useState, useEffect } from 'react';
import { ParametresData } from '@/types';
import { defaultParametres } from '@/constants';

export function useParametres() {
  const [parametres, setParametres] = useState<ParametresData>(defaultParametres);
  
  useEffect(() => {
    const saved = localStorage.getItem('budget-parametres');
    if (saved) setParametres({ ...defaultParametres, ...JSON.parse(saved) });
  }, []);
  
  const saveParametres = (newParametres: ParametresData) => {
    setParametres(newParametres);
    localStorage.setItem('budget-parametres', JSON.stringify(newParametres));
  };
  
  return { parametres, saveParametres };
}
'use client';

import { TrendingDown, Calendar, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { Enveloppe, HistoriqueItem, Transaction, CouleurOption } from './types';

interface EnveloppeDetailsProps {
  enveloppe: Enveloppe;
  budgetEffectif: number;
  moyenne3Mois: number;
  projection: number;
  historique: HistoriqueItem[];
  transactionsLiees: Transaction[];
  devise: string;
  showTransactions: boolean;
  onToggleTransactions: () => void;
  couleur: CouleurOption;
}

export default function EnveloppeDetails({
  budgetEffectif,
  moyenne3Mois,
  projection,
  historique,
  transactionsLiees,
  devise,
  showTransactions,
  onToggleTransactions,
  couleur
}: EnveloppeDetailsProps) {
  return (
    <div className="px-4 pb-4 space-y-3">
      {/* Stats avancées */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/20 rounded-xl p-2">
          <div className="flex items-center gap-1 mb-1">
            <TrendingDown className={`w-3 h-3 ${couleur.text}`} />
            <span className={`text-[9px] ${couleur.text} opacity-70`}>Moyenne 3 mois</span>
          </div>
          <p className={`text-xs font-semibold ${couleur.text}`}>
            {moyenne3Mois.toFixed(0)}{devise}
          </p>
        </div>
        <div className="bg-white/20 rounded-xl p-2">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className={`w-3 h-3 ${couleur.text}`} />
            <span className={`text-[9px] ${couleur.text} opacity-70`}>Projection fin mois</span>
          </div>
          <p className={`text-xs font-semibold ${projection > budgetEffectif ? 'text-red-600' : couleur.text}`}>
            {projection.toFixed(0)}{devise}
          </p>
        </div>
      </div>

      {/* Historique 6 mois */}
      <div className="bg-white/20 rounded-xl p-3">
        <div className="flex items-center gap-1 mb-2">
          <BarChart3 className={`w-3 h-3 ${couleur.text}`} />
          <span className={`text-[10px] font-medium ${couleur.text}`}>Historique 6 mois</span>
        </div>
        <div className="flex justify-between items-end h-16">
          {historique.map((h, i) => {
            const maxVal = Math.max(...historique.map(x => Math.max(x.depense, x.budget)));
            const heightPct = maxVal > 0 ? (h.depense / maxVal) * 100 : 0;
            const isOver = h.depense > h.budget;
            
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full px-0.5">
                  <div 
                    className={`w-full rounded-t transition-all duration-300 ${isOver ? 'bg-red-400' : couleur.progress}`} 
                    style={{ height: `${Math.max(heightPct, 4)}%`, minHeight: '4px' }} 
                  />
                </div>
                <span className={`text-[8px] ${couleur.text}`}>{h.mois}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white/20 rounded-xl p-3">
        <button 
          onClick={onToggleTransactions} 
          className="w-full flex items-center justify-between"
        >
          <span className={`text-[10px] font-medium ${couleur.text}`}>
            Transactions ({transactionsLiees.length})
          </span>
          {showTransactions 
            ? <ChevronUp className={`w-4 h-4 ${couleur.text}`} /> 
            : <ChevronDown className={`w-4 h-4 ${couleur.text}`} />
          }
        </button>
        
        {showTransactions && (
          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
            {transactionsLiees.length > 0 ? (
              transactionsLiees.map(t => (
                <div 
                  key={t.id} 
                  className="flex justify-between items-center py-1 border-b border-white/20 last:border-0"
                >
                  <div>
                    <p className={`text-[10px] font-medium ${couleur.text}`}>{t.categorie}</p>
                    <p className={`text-[8px] ${couleur.text} opacity-60`}>{t.date}</p>
                  </div>
                  <span className={`text-[10px] font-semibold ${couleur.text}`}>
                    -{parseFloat(t.montant).toFixed(2)}{devise}
                  </span>
                </div>
              ))
            ) : (
              <p className={`text-[10px] ${couleur.text} opacity-60 text-center py-2`}>
                Aucune transaction ce mois
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
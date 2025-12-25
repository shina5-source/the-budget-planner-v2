'use client';

import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  enveloppeName: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  enveloppeName
}: DeleteConfirmModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="rounded-2xl p-4 w-full max-w-md border my-20"
        style={{ 
          backgroundColor: theme.colors.secondaryLight,
          borderColor: `${theme.colors.primary}40`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(239, 68, 68, 0.15)' }}
            >
              <AlertTriangle className="w-6 h-6" style={{ color: '#ef4444' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                Supprimer l&apos;enveloppe ?
              </h2>
              <p className="text-xs" style={{ color: `${theme.colors.primary}60` }}>
                Cette action est irréversible
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1"
          >
            <X className="w-5 h-5" style={{ color: theme.colors.primary }} />
          </button>
        </div>

        {/* Content */}
        <div 
          className="rounded-xl p-4 mb-5 border"
          style={{ 
            background: `${theme.colors.primary}10`,
            borderColor: `${theme.colors.primary}20`
          }}
        >
          <p className="text-sm font-medium text-center" style={{ color: theme.colors.primary }}>
            ✉️ {enveloppeName}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="flex-1 py-3 border rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              borderColor: theme.colors.primary, 
              color: theme.colors.primary 
            }}
          >
            Annuler
          </button>
          <button 
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{ 
              background: '#ef4444', 
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
            }}
          >
            <Trash2 className="w-5 h-5" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
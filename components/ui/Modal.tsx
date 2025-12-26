"use client";

import { X } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Taille du modal : 'sm' (384px), 'md' (448px), 'lg' (512px) */
  size?: 'sm' | 'md' | 'lg';
  /** Centrer verticalement le modal (pour les petits modals) */
  centered?: boolean;
  /** Afficher le bouton X pour fermer */
  showCloseButton?: boolean;
  /** Icône à afficher à côté du titre */
  icon?: ReactNode;
}

/**
 * Composant Modal réutilisable avec le pattern de style validé.
 * Utilise automatiquement les couleurs du thème actif.
 * 
 * @example
 * ```tsx
 * <Modal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Ajouter un élément"
 *   size="md"
 *   centered={false}
 * >
 *   <div className="space-y-4">
 *     // Contenu du modal
 *   </div>
 * </Modal>
 * ```
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  centered = false,
  showCloseButton = true,
  icon
}: ModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  if (!isOpen) return null;

  // Tailles disponibles
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  // ✅ PATTERN VALIDÉ - Styles uniformes pour tous les modals
  const modalStyle = { 
    background: theme.colors.secondaryLight, 
    borderColor: `${theme.colors.primary}40`
  };

  const textStyle = { 
    color: theme.colors.primary 
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex ${centered ? 'items-center' : 'items-start'} justify-center z-50 p-4 overflow-y-auto`}
      onClick={onClose}
    >
      <div 
        className={`rounded-2xl p-4 w-full ${sizeClasses[size]} border ${centered ? '' : 'mb-20 mt-20'}`}
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon && icon}
            <h2 className="text-lg font-medium" style={textStyle}>
              {title}
            </h2>
          </div>
          {showCloseButton && (
            <button 
              onClick={onClose} 
              className="p-1 rounded-lg transition-all duration-200 hover:scale-110"
              style={{ color: theme.colors.primary }}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

// ========== COMPOSANTS HELPER POUR LE CONTENU DU MODAL ==========

interface ModalInputProps {
  label: string;
  type?: 'text' | 'number' | 'date' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  suffix?: string;
}

/**
 * Input stylisé pour les modals
 */
export function ModalInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoFocus = false,
  suffix
}: ModalInputProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const inputStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: `${theme.colors.primary}30`, 
    color: theme.colors.textPrimary
  };

  const labelStyle = {
    color: `${theme.colors.primary}99`
  };

  return (
    <div>
      <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full rounded-xl px-4 py-2 text-sm border focus:outline-none"
          style={inputStyle}
        />
        {suffix && (
          <span 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: `${theme.colors.primary}60` }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

interface ModalSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

/**
 * Select stylisé pour les modals
 */
export function ModalSelect({
  label,
  value,
  onChange,
  options,
  required = false
}: ModalSelectProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const inputStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: `${theme.colors.primary}30`, 
    color: theme.colors.textPrimary
  };

  const labelStyle = {
    color: `${theme.colors.primary}99`
  };

  return (
    <div>
      <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-2 text-sm border focus:outline-none cursor-pointer"
        style={inputStyle}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

interface ModalTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

/**
 * Textarea stylisé pour les modals
 */
export function ModalTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3
}: ModalTextareaProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const inputStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: `${theme.colors.primary}30`, 
    color: theme.colors.textPrimary
  };

  const labelStyle = {
    color: `${theme.colors.primary}99`
  };

  return (
    <div>
      <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl px-4 py-2 text-sm border focus:outline-none resize-none"
        style={inputStyle}
      />
    </div>
  );
}

interface ModalButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  cancelText?: string;
  submitText?: string;
  submitIcon?: ReactNode;
  submitDisabled?: boolean;
  submitLoading?: boolean;
  /** Couleur du bouton submit : 'primary', 'success', 'danger' */
  submitVariant?: 'primary' | 'success' | 'danger';
}

/**
 * Boutons Annuler/Valider pour les modals
 */
export function ModalButtons({
  onCancel,
  onSubmit,
  cancelText = 'Annuler',
  submitText = 'Valider',
  submitIcon,
  submitDisabled = false,
  submitLoading = false,
  submitVariant = 'primary'
}: ModalButtonsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const buttonOutlineStyle = { 
    borderColor: theme.colors.primary, 
    color: theme.colors.primary 
  };

  const variantColors = {
    primary: theme.colors.primary,
    success: '#22c55e',
    danger: '#ef4444'
  };

  const submitStyle = {
    background: variantColors[submitVariant],
    color: submitVariant === 'primary' ? theme.colors.textOnPrimary : '#ffffff'
  };

  return (
    <div className="flex gap-3 pt-2">
      <button 
        type="button"
        onClick={onCancel} 
        className="flex-1 py-3 border rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={buttonOutlineStyle}
      >
        {cancelText}
      </button>
      <button 
        type="button"
        onClick={onSubmit}
        disabled={submitDisabled || submitLoading}
        className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={submitStyle}
      >
        {submitLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {submitIcon}
            {submitText}
          </>
        )}
      </button>
    </div>
  );
}

interface ModalToggleButtonsProps {
  options: { value: string; label: string; icon?: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4;
}

/**
 * Boutons toggle pour sélection (ex: Type, Priorité)
 */
export function ModalToggleButtons({
  options,
  value,
  onChange,
  columns = 2
}: ModalToggleButtonsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme() as any;

  const inputStyle = { 
    background: theme.colors.cardBackground, 
    borderColor: `${theme.colors.primary}30`, 
    color: theme.colors.textPrimary
  };

  const activeStyle = {
    background: theme.colors.primary,
    borderColor: theme.colors.primary,
    color: theme.colors.textOnPrimary
  };

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-2`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="py-2 rounded-xl text-sm font-medium border transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1"
          style={value === opt.value ? activeStyle : inputStyle}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
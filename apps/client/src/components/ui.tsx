'use client';

import { ReactNode, useState } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  type = 'button',
  disabled = false,
  className = '' 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#185FA5] text-white hover:bg-[#144d8a] focus:ring-[#185FA5]',
    secondary: 'bg-[#F7F6F3] text-[#1A1A1A] border border-[#D1D0CC] hover:bg-[#F1EFE8] focus:ring-[#D1D0CC]',
    danger: 'bg-[#A32D2D] text-white hover:bg-[#8a2626] focus:ring-[#A32D2D]',
    success: 'bg-[#0F6E56] text-white hover:bg-[#0d5c48] focus:ring-[#0F6E56]',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? disabledStyles : ''} ${className}`}
    >
      {children}
    </button>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          onClick={onClose}
        />
        <div className={`relative bg-white rounded-lg shadow-xl w-full ${sizes[size]} transform transition-all`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E4E0]">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#888780] hover:text-[#1A1A1A] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
}

export function FormField({ label, children, required }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
        {label}
        {required && <span className="text-[#A32D2D] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

interface InputProps {
  type?: 'text' | 'email' | 'number' | 'tel' | 'password' | 'date';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Input({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required, 
  disabled,
  className = '' 
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 text-sm border border-[#D1D0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#185FA5] focus:border-transparent disabled:bg-[#F7F6F3] disabled:cursor-not-allowed ${className}`}
    />
  );
}

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export function TextArea({ 
  value, 
  onChange, 
  placeholder, 
  rows = 3,
  required 
}: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="w-full px-3 py-2 text-sm border border-[#D1D0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#185FA5] focus:border-transparent resize-none"
    />
  );
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

export function Select({ 
  value, 
  onChange, 
  options, 
  placeholder,
  required 
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-3 py-2 text-sm border border-[#D1D0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#185FA5] focus:border-transparent bg-white"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`${sizes[size]} border-2 border-[#E5E4E0] border-t-[#185FA5] rounded-full animate-spin`} />
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-[#F7F6F3] rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-[#888780]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-[#1A1A1A] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#888780] mb-4">{description}</p>}
      {action}
    </div>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Confirmer',
  variant = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{title}</h3>
          <p className="text-sm text-[#5F5E5A] mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>Annuler</Button>
            <Button 
              variant={variant} 
              onClick={() => { onConfirm(); onClose(); }}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

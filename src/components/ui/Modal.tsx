import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export function Modal({ isOpen, onClose, title, children, variant = 'default' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className={cn(
          "relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-2xl transition-all",
          variant === 'destructive' ? 'border-destructive ring-1 ring-destructive' : 'border-border'
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
          <h2 className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            variant === 'destructive' && "text-destructive"
          )}>{title}</h2>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

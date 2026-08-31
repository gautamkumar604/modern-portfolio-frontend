'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-800/60 bg-emerald-950/80 text-emerald-200',
          error: 'border-rose-800/60 bg-rose-950/80 text-rose-200',
          info: 'border-blue-800/60 bg-blue-950/80 text-blue-200',
        };

        return (
          <div
            key={toast.id}
            className={`p-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-start justify-between gap-3 pointer-events-auto animate-in slide-in-from-bottom-5 duration-200 ${
              borders[toast.type]
            }`}
          >
            <div className="flex items-start gap-3">
              {icons[toast.type]}
              <div>
                {toast.title && <h5 className="font-bold text-xs">{toast.title}</h5>}
                <p className="text-xs leading-relaxed mt-0.5">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="opacity-70 hover:opacity-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

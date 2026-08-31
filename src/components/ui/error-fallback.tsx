import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = 'Unable to Load Section',
  message,
  onRetry,
}) => {
  return (
    <div
      className="p-5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-200 my-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-rose-300 text-sm">{title}</h4>
          <p className="text-xs text-rose-400 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-900/50 hover:bg-rose-800/80 text-rose-100 rounded-lg border border-rose-700/60 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

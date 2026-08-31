import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
      <span>
        Showing Page <strong className="text-[var(--text-primary)]">{page}</strong> of{' '}
        <strong className="text-[var(--text-primary)]">{totalPages}</strong> ({totalItems} items)
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-40 transition hover:bg-[var(--bg-surface-hover)]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-mono text-xs text-[var(--text-primary)] font-bold px-2">{page}</span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-40 transition hover:bg-[var(--bg-surface-hover)]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

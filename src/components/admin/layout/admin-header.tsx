'use client';

import React from 'react';
import { Menu, ExternalLink } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/auth-context';

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  pageTitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileSidebar,
  pageTitle = 'Dashboard',
}) => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
          aria-label="Open sidebar drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-bold text-base sm:text-lg text-[var(--text-primary)] tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
        >
          <span>View Public Portfolio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <ThemeToggle />
      </div>
    </header>
  );
};

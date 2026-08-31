'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/theme-context';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Light and Dark Mode"
      className="p-2 rounded-lg border border-slate-800 dark:border-slate-700 bg-slate-900/60 dark:bg-slate-800/60 text-slate-300 dark:text-slate-200 hover:text-white hover:border-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600" />
      )}
    </button>
  );
};

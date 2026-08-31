import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'published' | 'draft' | 'active' | 'inactive' | 'unread' | 'read' | 'replied' | 'archived' | 'info';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  const key = (variant || status).toLowerCase();

  const styles: Record<string, string> = {
    published: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    active: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    read: 'bg-slate-900/60 text-slate-400 border-slate-700/60',
    draft: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    inactive: 'bg-slate-900/60 text-slate-400 border-slate-700/60',
    unread: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    replied: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
    archived: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
    info: 'bg-sky-950/60 text-sky-300 border-sky-800/60',
  };

  const badgeStyle = styles[key] || 'bg-slate-900/60 text-slate-300 border-slate-700/60';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider border ${badgeStyle}`}
    >
      {status}
    </span>
  );
};

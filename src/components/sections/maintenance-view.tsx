import React from 'react';
import { Wrench, ShieldAlert } from 'lucide-react';
import { SiteSetting } from '@/types';

interface MaintenanceViewProps {
  siteSettings?: SiteSetting | null;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ siteSettings }) => {
  const siteTitle = siteSettings?.siteName || 'Portfolio';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl card-surface space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-800/60 text-amber-400 flex items-center justify-center mx-auto">
          <Wrench className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-400 border border-amber-800/60 font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Maintenance Mode</span>
          </span>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">{siteTitle}</h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            The portfolio is currently undergoing scheduled maintenance and updates. Please check back shortly.
          </p>
        </div>

        {siteSettings?.contactEmail && (
          <div className="pt-4 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
            Urgent inquiries:{' '}
            <a href={`mailto:${siteSettings.contactEmail}`} className="text-blue-400 hover:underline font-semibold font-mono">
              {siteSettings.contactEmail}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { SiteSetting, SocialLink } from '@/types';
import { SocialLinks } from '../ui/social-links';

interface FooterProps {
  siteSettings?: SiteSetting | null;
  socialLinks?: SocialLink[];
}

export const Footer: React.FC<FooterProps> = ({ siteSettings, socialLinks = [] }) => {
  const year = new Date().getFullYear();
  const brandName = siteSettings?.siteName || 'Portfolio';
  const copyright = siteSettings?.copyrightText || `© ${year} ${brandName}. All rights reserved.`;

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-12 text-[var(--text-secondary)] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{brandName}</h3>
            {siteSettings?.footerText && (
              <p className="text-xs text-[var(--text-secondary)] max-w-md">{siteSettings.footerText}</p>
            )}
            {siteSettings?.contactEmail && (
              <p className="text-xs text-[var(--text-secondary)]">
                Contact:{' '}
                <a href={`mailto:${siteSettings.contactEmail}`} className="text-blue-400 hover:underline font-semibold">
                  {siteSettings.contactEmail}
                </a>
              </p>
            )}
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <SocialLinks links={socialLinks} />
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <p>{copyright}</p>
          <div className="flex items-center gap-4">
            <a href="#hero" className="hover:text-[var(--text-primary)] transition">
              Back to Top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

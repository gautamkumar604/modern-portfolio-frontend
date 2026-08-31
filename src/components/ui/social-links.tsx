import React from 'react';
import { SocialLink } from '@/types';
import { renderIcon } from '@/lib/utils/icon-mapper';

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
  iconClassName?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  links,
  className = 'flex items-center gap-3',
  iconClassName = 'w-4 h-4',
}) => {
  if (!links || links.length === 0) return null;

  return (
    <div className={className}>
      {links
        .filter((l) => l.isActive)
        .map((link) => (
          <a
            key={link._id || link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.platform}
            aria-label={link.platform}
            className="p-2.5 rounded-lg bg-slate-900/60 dark:bg-slate-800/60 text-slate-400 hover:text-white border border-slate-800 dark:border-slate-700 hover:border-blue-500/50 hover:bg-blue-600/10 transition"
          >
            {renderIcon(link.icon || link.platform, iconClassName)}
          </a>
        ))}
    </div>
  );
};

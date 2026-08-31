import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionButton,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

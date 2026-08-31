import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  watermark?: string;
  centered?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  badgeText,
  watermark,
  centered = false,
}) => {
  const bgWatermark = watermark || badgeText || title.split(' ')[0];

  return (
    <div className={`relative space-y-2 mb-12 select-none ${centered ? 'text-center' : ''}`}>
      {/* Decorative Low-Opacity Background Watermark Word */}
      {bgWatermark && (
        <span
          className={`absolute -top-8 ${
            centered ? 'left-1/2 -translate-x-1/2' : 'left-0'
          } text-5xl sm:text-7xl font-extrabold uppercase text-slate-500/10 dark:text-slate-500/10 pointer-events-none tracking-widest font-mono z-0`}
        >
          {bgWatermark}
        </span>
      )}

      <div className="relative z-10 space-y-2">
        {badgeText && (
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/40 rounded-full border border-blue-800/40 font-mono">
            {badgeText}
          </span>
        )}

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          <span className="gradient-text gradient-glow">{title}</span>
        </h2>

        {subtitle && (
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl">
            {subtitle}
          </p>
        )}

        <div
          className={`w-16 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 rounded-full mt-3 ${
            centered ? 'mx-auto' : ''
          }`}
        />
      </div>
    </div>
  );
};

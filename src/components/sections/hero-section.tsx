'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { Profile, SocialLink } from '@/types';
import { HeroStats } from './hero-stats';
import { SocialLinks } from '../ui/social-links';
import { AvatarFallback } from '../ui/avatar-fallback';

interface HeroSectionProps {
  profile?: Profile | null;
  socialLinks?: SocialLink[];
  projectsCount?: number;
  skillsCount?: number;
  servicesCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  socialLinks = [],
  projectsCount,
  skillsCount,
  servicesCount,
}) => {
  const greeting = profile?.heroGreeting || "Hello, I'm";
  const name = profile?.name || 'Developer';
  const title = profile?.title || 'Full Stack Engineer';
  const headline = profile?.heroHeadline || profile?.shortBio || '';
  const subtitle = profile?.heroSubtitle || '';

  const primaryText = profile?.primaryCtaText || 'View Work';
  const primaryUrl = profile?.primaryCtaUrl || '#projects';
  const secondaryText = profile?.secondaryCtaText || 'Contact Me';
  const secondaryUrl = profile?.secondaryCtaUrl || '#contact';

  return (
    <section id="hero" className="relative pt-10 pb-16 overflow-hidden">
      {/* Ambient Background Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-pink-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column — Content & Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Greeting Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/40 border border-blue-800/40 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{greeting}</span>
            </div>

            {/* Dominant Name & Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                <span className="gradient-text gradient-glow">{name}</span>
              </h1>
              <h2 className="text-xl sm:text-3xl font-bold text-slate-300 dark:text-slate-300 text-slate-700">
                {title}
              </h2>
            </div>

            {headline && (
              <p className="text-sm sm:text-base text-slate-300 dark:text-slate-300 text-slate-700 leading-relaxed max-w-2xl">
                {headline}
              </p>
            )}

            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                {subtitle}
              </p>
            )}

            {/* Integrated Dynamic Social Links Row */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="pt-1">
                <SocialLinks links={socialLinks} />
              </div>
            )}

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={primaryUrl}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/25 transition transform hover:-translate-y-0.5"
              >
                <span>{primaryText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={secondaryUrl}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] font-semibold text-sm border border-[var(--border-color)] transition"
              >
                <span>{secondaryText}</span>
              </a>

              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm border border-[var(--border-color)] transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column — Profile Avatar Frame / Fallback (Aspect Square) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 aspect-square rounded-3xl p-2 bg-gradient-to-tr from-blue-500 via-indigo-500 to-pink-500 shadow-2xl shadow-indigo-500/25">
              <div className="w-full h-full rounded-2xl bg-slate-950 overflow-hidden relative">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AvatarFallback title={title} />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Real Statistics Bar */}
        <HeroStats
          yearsOfExperience={profile?.yearsOfExperience}
          projectsCount={projectsCount}
          skillsCount={skillsCount}
          servicesCount={servicesCount}
        />
      </div>
    </section>
  );
};

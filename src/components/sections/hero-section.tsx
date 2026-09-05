'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { Profile, SocialLink } from '@/types';
import { HeroStats } from './hero-stats';
import { SocialLinks } from '../ui/social-links';
import { AvatarFallback } from '../ui/avatar-fallback';
import { getImageUrl } from '@/lib/utils/image';

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

  const avatarSrc = getImageUrl(profile?.avatarUrl);
  const resumeSrc = getImageUrl(profile?.resumeUrl);

  return (
    <section id="hero" className="relative pt-20 pb-16 overflow-hidden">
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{greeting}</span>
            </div>

            {/* Dominant Name & Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                <span className="gradient-text gradient-glow">{name}</span>
              </h1>
              <h2 className="text-xl sm:text-3xl font-bold text-[var(--text-primary)] opacity-90">
                {title}
              </h2>
            </div>

            {headline && (
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl font-medium">
                {headline}
              </p>
            )}

            {subtitle && (
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] opacity-80 font-mono">
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

              {resumeSrc && (
                <a
                  href={resumeSrc}
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

          {/* Right Column — Profile Avatar Frame with Floating & Pulse Glow Animations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            {/* Animated Rotating & Pulsing Background Aura */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.65, 0.35],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0 max-w-xs sm:max-w-sm mx-auto rounded-3xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-pink-500 blur-2xl opacity-40 -z-10"
            />

            {/* Continuous Floating Main Avatar Container */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.03, rotate: 1 }}
              className="relative w-72 h-72 sm:w-80 sm:h-80 aspect-square rounded-3xl p-[3px] bg-gradient-to-tr from-blue-500 via-indigo-500 to-pink-500 shadow-2xl shadow-indigo-500/30 group cursor-pointer"
            >
              <div className="w-full h-full rounded-[22px] bg-[var(--bg-primary)] overflow-hidden relative">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                  />
                ) : (
                  <AvatarFallback title={title} />
                )}
                {/* Subtle Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
              </div>
            </motion.div>
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

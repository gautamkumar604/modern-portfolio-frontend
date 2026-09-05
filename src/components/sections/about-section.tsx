'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, FileText, CheckCircle2, User } from 'lucide-react';
import { Profile } from '@/types';
import { SectionHeading } from '../ui/section-heading';
import { Badge } from '../ui/badge';
import { getImageUrl } from '@/lib/utils/image';

interface AboutSectionProps {
  profile?: Profile | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  if (!profile) return null;

  const availabilityVariants = {
    available: { label: 'Available for Hire', variant: 'success' as const },
    open_to_offers: { label: 'Open to Offers', variant: 'info' as const },
    busy: { label: 'Currently Busy', variant: 'warning' as const },
    unavailable: { label: 'Unavailable', variant: 'danger' as const },
  };

  const statusConfig =
    availabilityVariants[profile.availabilityStatus] ||
    availabilityVariants.available;

  const resumeUrl = getImageUrl(profile.resumeUrl);

  return (
    <section id="profile" className="py-16 border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="About Me"
          subtitle="Background, technical depth, and core highlights."
          badgeText="Profile"
          watermark="ABOUT"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Bio Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 p-6 sm:p-8 rounded-2xl card-surface space-y-6"
          >
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{profile.name} — {profile.title}</span>
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed">
                {profile.shortBio}
              </p>
            </div>

            {profile.detailedBio && (
              <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
                <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                  Detailed Bio
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {profile.detailedBio}
                </p>
              </div>
            )}

            {/* Highlights Chips */}
            {profile.highlights && profile.highlights.length > 0 && (
              <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
                <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                  Core Highlights
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {profile.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Details Sidebar Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 p-6 sm:p-8 rounded-2xl card-surface space-y-6"
          >
            <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
              Quick Details
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-[var(--text-primary)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--bg-primary)] text-blue-600 dark:text-blue-400 border border-[var(--border-color)]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-[var(--text-secondary)] uppercase font-mono">Location</p>
                  <p className="font-semibold">{profile.location || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--bg-primary)] text-indigo-600 dark:text-indigo-400 border border-[var(--border-color)]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-[var(--text-secondary)] uppercase font-mono">Email</p>
                  <a href={`mailto:${profile.email}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    {profile.email}
                  </a>
                </div>
              </div>

              {profile.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--bg-primary)] text-purple-600 dark:text-purple-400 border border-[var(--border-color)]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--text-secondary)] uppercase font-mono">Phone</p>
                    <p className="font-semibold">{profile.phone}</p>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <p className="text-[11px] text-[var(--text-secondary)] uppercase mb-1 font-mono">Status</p>
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
              </div>
            </div>

            {resumeUrl && (
              <div className="pt-4 border-t border-[var(--border-color)]">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Resume PDF</span>
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Profile, SocialLink } from '@/types';
import { SectionHeading } from '../ui/section-heading';
import { SocialLinks } from '../ui/social-links';
import { messagesService } from '@/lib/services';
import { ApiError } from '@/lib/api/client';

interface ContactSectionProps {
  profile?: Profile | null;
  socialLinks?: SocialLink[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  socialLinks = [],
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await messagesService.sendMessage({
        name,
        email,
        subject,
        message,
      });

      setSuccessMessage(
        response.message || 'Thank you! Your message has been sent successfully.',
      );
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      if (err instanceof ApiError && err.statusCode === 429) {
        setErrorMessage(
          'Too many requests! You have exceeded the contact rate limit (3 submissions per minute). Please wait a minute before trying again.',
        );
      } else {
        setErrorMessage(
          err.message || 'Unable to send your message. Please try again later.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a project in mind or want to collaborate? Send a message directly."
          badgeText="Contact"
          watermark="CONTACT"
          centered
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Left Column — Contact Details & Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 p-6 sm:p-8 rounded-2xl card-surface space-y-6"
          >
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Let's Connect</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                I am open to discussing software engineering projects, cloud architectures, or technical consulting.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[var(--text-primary)]">
              {profile?.email && (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-blue-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--text-secondary)] uppercase font-mono">Email</p>
                    <a href={`mailto:${profile.email}`} className="font-semibold text-blue-400 hover:underline">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-indigo-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--text-secondary)] uppercase font-mono">Location</p>
                    <p className="font-semibold">{profile.location}</p>
                  </div>
                </div>
              )}
            </div>

            {socialLinks && socialLinks.length > 0 && (
              <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                  Social Channels
                </p>
                <SocialLinks links={socialLinks} />
              </div>
            )}
          </motion.div>

          {/* Right Column — Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 p-6 sm:p-8 rounded-2xl card-surface space-y-6"
            suppressHydrationWarning
          >
            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs sm:text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs sm:text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isMounted ? (
              <form onSubmit={handleSubmit} data-lpignore="true" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      data-lpignore="true"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                      Your Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      data-lpignore="true"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Project Collaboration"
                    data-lpignore="true"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    maxLength={3000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Details about your inquiry or project..."
                    data-lpignore="true"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/20 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-[var(--bg-primary)] rounded-xl" />
                <div className="h-10 bg-[var(--bg-primary)] rounded-xl" />
                <div className="h-28 bg-[var(--bg-primary)] rounded-xl" />
                <div className="h-12 bg-blue-600/30 rounded-xl" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

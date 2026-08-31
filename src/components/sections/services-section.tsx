'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Wrench } from 'lucide-react';
import { Service } from '@/types';
import { SectionHeading } from '../ui/section-heading';
import { renderIcon } from '@/lib/utils/icon-mapper';

interface ServicesSectionProps {
  services: Service[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const isEmpty = !services || services.length === 0;

  return (
    <section id="services" className="py-16 border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Services & Solutions"
          subtitle="Custom full-stack software development, architectural consulting, and technical solutions."
          badgeText="Services"
          watermark="SOLUTIONS"
        />

        {isEmpty ? (
          <div className="p-8 rounded-2xl card-surface text-center space-y-3 max-w-md mx-auto my-6">
            <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-pink-400 w-fit mx-auto">
              <Wrench className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">Services Information Coming Soon</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Service offerings will appear dynamically when populated on the backend.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service._id || service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 sm:p-8 rounded-2xl card-surface space-y-4 hover:border-pink-500/40 transition group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-pink-400 group-hover:text-pink-300 w-fit transition">
                    {renderIcon(service.icon || service.title, 'w-6 h-6')}
                  </div>

                  <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-pink-400 transition">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {service.detailedDescription && (
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {service.detailedDescription}
                    </p>
                  )}

                  {service.features && service.features.length > 0 && (
                    <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
                      <p className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                        Key Features
                      </p>
                      <ul className="space-y-1.5 text-xs text-[var(--text-primary)]">
                        {service.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

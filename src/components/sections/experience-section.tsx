'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { Experience } from '@/types';
import { SectionHeading } from '../ui/section-heading';
import { Badge } from '../ui/badge';
import { formatDate } from '@/lib/utils/formatters';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const isEmpty = !experiences || experiences.length === 0;

  return (
    <section id="experience" className="py-16 border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Work Experience"
          subtitle="Professional employment history and role responsibilities."
          badgeText="Career"
          watermark="EXPERIENCE"
        />

        {isEmpty ? (
          <div className="p-8 rounded-2xl card-surface text-center space-y-3 max-w-md mx-auto my-6">
            <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-blue-400 w-fit mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">Experience Details Coming Soon</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Work experience records will appear dynamically when populated on the backend.
            </p>
          </div>
        ) : (
          /* Vertical Timeline */
          <div className="relative border-l-2 border-[var(--border-color)] ml-4 sm:ml-8 space-y-12 pl-6 sm:pl-10">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id || index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Timeline Dot Icon */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-0 p-2 rounded-full bg-[var(--bg-primary)] border-2 border-blue-500 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Briefcase className="w-4 h-4" />
                </div>

                {/* Card Container */}
                <div className="p-6 sm:p-8 rounded-2xl card-surface space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">{exp.position}</h3>
                      <p className="text-sm font-semibold text-blue-400">{exp.company}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="default" className="capitalize">
                        {exp.employmentType}
                      </Badge>
                      {exp.isCurrentlyWorking && <Badge variant="success">Current Role</Badge>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] font-medium font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>
                        {formatDate(exp.startDate)} — {formatDate(exp.endDate, exp.isCurrentlyWorking)}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>

                  {exp.description && (
                    <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {/* Responsibilities List */}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                        Responsibilities
                      </h4>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--text-primary)]">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies Used */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 text-[11px] font-mono bg-[var(--bg-primary)] text-[var(--text-primary)] rounded border border-[var(--border-color)]"
                        >
                          {tech}
                        </span>
                      ))}
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

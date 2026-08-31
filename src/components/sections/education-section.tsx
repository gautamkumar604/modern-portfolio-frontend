'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { Education } from '@/types';
import { SectionHeading } from '../ui/section-heading';
import { Badge } from '../ui/badge';
import { formatDate } from '@/lib/utils/formatters';

interface EducationSectionProps {
  educationList: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ educationList }) => {
  const isEmpty = !educationList || educationList.length === 0;

  return (
    <section id="education" className="py-16 border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Education & Academics"
          subtitle="Academic qualifications, degrees, and educational milestones."
          badgeText="Education"
          watermark="ACADEMICS"
        />

        {isEmpty ? (
          <div className="p-8 rounded-2xl card-surface text-center space-y-3 max-w-md mx-auto my-6">
            <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-indigo-400 w-fit mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">Education Details Coming Soon</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Academic history will appear dynamically when populated on the backend.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educationList.map((edu, index) => (
              <motion.div
                key={edu._id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 sm:p-8 rounded-2xl card-surface space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-indigo-400">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)] text-lg">{edu.degree}</h3>
                        <p className="text-sm font-semibold text-indigo-400">{edu.institution}</p>
                      </div>
                    </div>
                    {edu.isCurrentlyStudying && <Badge variant="info">Studying</Badge>}
                  </div>

                  {edu.fieldOfStudy && (
                    <p className="text-xs text-[var(--text-primary)] font-medium">
                      Field of Study: <span className="text-blue-400">{edu.fieldOfStudy}</span>
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>
                        {formatDate(edu.startDate)} — {formatDate(edu.endDate, edu.isCurrentlyStudying)}
                      </span>
                    </div>
                    {edu.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{edu.location}</span>
                      </div>
                    )}
                    {edu.grade && (
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Grade: {edu.grade}</span>
                      </div>
                    )}
                  </div>

                  {edu.description && (
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {edu.description}
                    </p>
                  )}

                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)]">
                      <p className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                        Achievements
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-[var(--text-primary)]">
                        {edu.achievements.map((ach, idx) => (
                          <li key={idx}>{ach}</li>
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

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { Skill } from '@/types';
import { SectionHeading } from '../ui/section-heading';
import { renderIcon } from '@/lib/utils/icon-mapper';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const isEmpty = !skills || skills.length === 0;

  // Extract unique categories dynamically
  const categories = isEmpty
    ? ['All']
    : ['All', ...Array.from(new Set(skills.map((s) => s.category).filter(Boolean)))];

  const filteredSkills = isEmpty
    ? []
    : selectedCategory === 'All'
    ? skills
    : skills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="skills" className="py-16 border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Skills & Expertise"
          subtitle="Dynamic technical skills and proficiency breakdown."
          badgeText="Capabilities"
          watermark="SKILLS"
        />

        {isEmpty ? (
          <div className="p-8 rounded-2xl card-surface text-center space-y-3 max-w-md mx-auto my-6">
            <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-purple-400 w-fit mx-auto">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">No Skills Added Yet</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Skill entries will appear dynamically when populated on the backend.
            </p>
          </div>
        ) : (
          <>
            {/* Dynamic Category Filter Tabs */}
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-2 justify-center mb-10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                        : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill._id || skill.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="p-5 rounded-2xl card-surface hover:border-blue-500/40 transition group"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-blue-400 group-hover:text-blue-300 transition">
                        {renderIcon(skill.icon || skill.name, 'w-5 h-5')}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[var(--text-primary)]">{skill.name}</h4>
                        <p className="text-[11px] text-[var(--text-secondary)] font-mono">{skill.category}</p>
                      </div>
                    </div>

                    {skill.proficiency !== undefined && (
                      <span className="text-xs font-mono font-semibold text-blue-400">
                        {skill.proficiency}%
                      </span>
                    )}
                  </div>

                  {skill.description && (
                    <p className="text-xs text-[var(--text-secondary)] mb-3">{skill.description}</p>
                  )}

                  {/* Animated Progress Bar */}
                  {skill.proficiency !== undefined && (
                    <div className="w-full bg-[var(--bg-primary)] rounded-full h-1.5 overflow-hidden border border-[var(--border-color)]">
                      <div
                        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, Math.max(0, skill.proficiency))}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Sparkles, FolderGit2, Code2 } from 'lucide-react';
import { Project } from '@/types';
import { SectionHeading } from '../ui/section-heading';
import { Badge } from '../ui/badge';

import { getImageUrl } from '@/lib/utils/image';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [filterType, setFilterType] = useState<string>('All');

  const isEmpty = !projects || projects.length === 0;

  // Dynamically derive unique projectType string values from returned projects.data
  const projectTypes = isEmpty
    ? ['All']
    : ['All', ...Array.from(new Set(projects.map((p) => p.projectType).filter(Boolean)))];

  const filteredProjects = isEmpty
    ? []
    : filterType === 'All'
    ? projects
    : projects.filter((p) => p.projectType.toLowerCase() === filterType.toLowerCase());

  return (
    <section id="projects" className="py-16 border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Projects"
          subtitle="Recent full-stack applications, open-source work, and software solutions."
          badgeText="Portfolio"
          watermark="PROJECTS"
        />

        {isEmpty ? (
          <div className="p-8 rounded-2xl card-surface text-center space-y-3 max-w-md mx-auto my-6">
            <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-indigo-400 w-fit mx-auto">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">Projects Coming Soon</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Project showcases will appear dynamically when populated on the backend.
            </p>
          </div>
        ) : (
          <>
            {/* Dynamically Derived Project Type Filter Tabs */}
            {projectTypes.length > 2 && (
              <div className="flex flex-wrap gap-2 justify-center mb-10">
                {projectTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize font-mono transition ${
                      filterType === type
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                        : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id || project.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`rounded-2xl card-surface overflow-hidden flex flex-col justify-between hover:border-blue-500/50 transition group ${
                    project.isFeatured ? 'ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/10' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* Fixed Aspect Ratio Container to Minimize CLS */}
                    <div className="relative w-full aspect-[16/9] bg-[var(--bg-primary)] overflow-hidden">
                      {project.coverImage ? (
                        <img
                          src={getImageUrl(project.coverImage)}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-secondary)] p-4">
                          <FolderGit2 className="w-12 h-12 mb-2 text-blue-500/40" />
                          <span className="text-xs font-mono">{project.projectType} project</span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="info" className="capitalize">
                          {project.projectType}
                        </Badge>
                        {project.isFeatured && (
                          <Badge variant="warning" className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Featured</span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-blue-400 transition">
                        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                        {project.shortDescription}
                      </p>

                      {/* Tech Tags */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-0.5 text-[11px] font-mono bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md border border-[var(--border-color)]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0 mt-4 flex items-center justify-between border-t border-[var(--border-color)] pt-4 text-xs font-semibold">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition"
                          title="GitHub Repository"
                        >
                          <Code2 className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:text-white border border-blue-500/30 transition"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

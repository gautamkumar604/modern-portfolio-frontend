import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { projectsService } from '@/lib/services/projects.service';
import { getImageUrl } from '@/lib/utils/image';
import { siteSettingsService } from '@/lib/services/site-settings.service';
import { socialLinksService } from '@/lib/services/social-links.service';
import { ApiError } from '@/lib/api/client';
import {
  ArrowLeft,
  ExternalLink,
  FolderGit2,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Project, SiteSetting, SocialLink } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [project, siteSettings] = await Promise.all([
      projectsService.getProjectBySlug(slug),
      siteSettingsService.getSiteSettings(),
    ]);

    const siteName = siteSettings?.siteName || 'Developer Portfolio';
    const title = `${project.title} | ${siteName}`;
    const description = project.shortDescription || siteSettings?.defaultSeoDescription;

    const metadata: Metadata = {
      title,
      description,
    };

    if (
      project.coverImage &&
      typeof project.coverImage === 'string' &&
      project.coverImage.trim().length > 0
    ) {
      metadata.openGraph = {
        title,
        description,
        images: [{ url: project.coverImage }],
      };
    }

    return metadata;
  } catch {
    return {
      title: 'Project Details | Developer Portfolio',
      description: 'Software engineering project details and technical showcase.',
    };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let project: Project | null = null;
  let siteSettings: SiteSetting | null = null;
  let socialLinks: SocialLink[] = [];

  try {
    const [projectRes, settingsRes, socialRes] = await Promise.allSettled([
      projectsService.getProjectBySlug(slug),
      siteSettingsService.getSiteSettings(),
      socialLinksService.getSocialLinks(),
    ]);

    if (projectRes.status === 'fulfilled') {
      project = projectRes.value;
    } else {
      const err = projectRes.reason;
      if (err instanceof ApiError && err.statusCode === 404) {
        notFound();
      }
      notFound();
    }

    if (settingsRes.status === 'fulfilled') siteSettings = settingsRes.value;
    if (socialRes.status === 'fulfilled') socialLinks = socialRes.value.data;
  } catch {
    notFound();
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar siteSettings={siteSettings} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="mb-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-semibold font-mono text-blue-400 hover:text-blue-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects Showcase</span>
          </Link>
        </div>

        <article className="p-6 sm:p-10 rounded-3xl card-surface space-y-8 shadow-2xl">
          {/* Header & Meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <Badge variant="info" className="capitalize">
                {project.projectType}
              </Badge>
              <Badge variant="default" className="capitalize">
                {project.status}
              </Badge>
              {project.isFeatured && (
                <Badge variant="warning" className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Spotlight</span>
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium leading-relaxed">
              {project.shortDescription}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Live Demo</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] text-xs font-semibold border border-[var(--border-color)] transition"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}
            </div>
          </div>

          {/* Cover Image — Fixed Aspect Ratio Container to Eliminate CLS */}
          {project.coverImage && (
            <div className="w-full aspect-[16/9] rounded-2xl bg-[var(--bg-primary)] overflow-hidden border border-[var(--border-color)]">
              <img
                src={getImageUrl(project.coverImage)}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Detailed Description */}
          {project.detailedDescription && (
            <div className="space-y-3 pt-6 border-t border-[var(--border-color)]">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Detailed Overview</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {project.detailedDescription}
              </p>
            </div>
          )}

          {/* Tech Stack Tags */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-[var(--border-color)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 font-mono">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Technologies & Frameworks</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-mono bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg border border-[var(--border-color)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Features */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-[var(--border-color)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Key Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[var(--text-primary)]">
                {project.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges, Solution, Outcome Grid */}
          {(project.challenges || project.solution || project.outcome) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[var(--border-color)]">
              {project.challenges && (
                <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Challenges</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{project.challenges}</p>
                </div>
              )}
              {project.solution && (
                <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">Solution</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{project.solution}</p>
                </div>
              )}
              {project.outcome && (
                <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Outcome</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{project.outcome}</p>
                </div>
              )}
            </div>
          )}

          {/* Gallery Images */}
          {project.galleryImages && project.galleryImages.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[var(--border-color)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Project Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className="aspect-[16/9] rounded-xl bg-[var(--bg-primary)] overflow-hidden border border-[var(--border-color)]">
                    <img src={getImageUrl(imgUrl)} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer siteSettings={siteSettings} socialLinks={socialLinks} />
    </div>
  );
}

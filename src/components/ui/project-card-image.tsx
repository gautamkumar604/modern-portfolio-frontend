'use client';

import React, { useState } from 'react';
import { FolderGit2 } from 'lucide-react';
import { getImageUrl } from '@/lib/utils/image';

interface ProjectCardImageProps {
  src?: string;
  alt: string;
  projectType?: string;
  className?: string;
}

function ProjectCardImageInner({
  src,
  alt,
  projectType = 'Project',
  className = 'w-full h-full object-cover group-hover:scale-105 transition duration-500',
}: ProjectCardImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedUrl = src ? getImageUrl(src) : '';

  if (!resolvedUrl || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-secondary)] p-6 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-primary)]">
        <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)]/80 border border-[var(--border-color)] text-blue-400 mb-2 shadow-inner">
          <FolderGit2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono font-medium text-[var(--text-secondary)] capitalize">
          {projectType} Project
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[var(--bg-primary)]">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-surface)] animate-pulse">
          <FolderGit2 className="w-8 h-8 text-blue-500/30" />
        </div>
      )}
      <img
        src={resolvedUrl}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

export function ProjectCardImage(props: ProjectCardImageProps) {
  // Using key={props.src} automatically resets error and loading states when src changes without needing an effect
  return <ProjectCardImageInner key={props.src || 'empty'} {...props} />;
}

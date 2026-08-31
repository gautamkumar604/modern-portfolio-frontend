import React from 'react';
import { Briefcase, Code2, Cpu, Wrench } from 'lucide-react';

interface HeroStatsProps {
  yearsOfExperience?: number;
  projectsCount?: number;
  skillsCount?: number;
  servicesCount?: number;
}

export const HeroStats: React.FC<HeroStatsProps> = ({
  yearsOfExperience,
  projectsCount,
  skillsCount,
  servicesCount,
}) => {
  const stats = [];

  if (yearsOfExperience !== undefined && yearsOfExperience !== null) {
    stats.push({
      label: 'Years of Exp.',
      value: `${yearsOfExperience}+`,
      icon: Briefcase,
      color: 'text-blue-400',
    });
  }

  if (projectsCount !== undefined && projectsCount !== null) {
    stats.push({
      label: 'Projects Completed',
      value: `${projectsCount}`,
      icon: Code2,
      color: 'text-indigo-400',
    });
  }

  if (skillsCount !== undefined && skillsCount !== null) {
    stats.push({
      label: 'Technical Skills',
      value: `${skillsCount}`,
      icon: Cpu,
      color: 'text-purple-400',
    });
  }

  if (servicesCount !== undefined && servicesCount !== null) {
    stats.push({
      label: 'Services Offered',
      value: `${servicesCount}`,
      icon: Wrench,
      color: 'text-pink-400',
    });
  }

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl glass-panel shadow-xl">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-blue-500/40 transition duration-200"
          >
            <div className={`p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] ${item.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {item.value}
              </p>
              <p className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                {item.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

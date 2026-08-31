'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Cpu,
  GraduationCap,
  Briefcase,
  Wrench,
  Share2,
  Mail,
  ShieldAlert,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { StatusBadge } from '@/components/admin/ui/status-badge';
import {
  adminProjectsService,
  adminSkillsService,
  adminEducationService,
  adminExperienceService,
  adminServicesService,
  adminSocialService,
  adminMessagesService,
  adminSettingsService,
} from '@/lib/services';
import { AdminMessage, SiteSetting } from '@/types';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    totalSkills: 0,
    totalEducation: 0,
    totalExperience: 0,
    activeServices: 0,
    activeSocial: 0,
    unreadMessages: 0,
  });

  const [siteSettings, setSiteSettings] = useState<SiteSetting | null>(null);
  const [recentMessages, setRecentMessages] = useState<AdminMessage[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        allProjects,
        publishedProjects,
        draftProjects,
        skills,
        education,
        experience,
        services,
        social,
        unreadMsgs,
        settings,
        recentMsgs,
      ] = await Promise.allSettled([
        adminProjectsService.getProjects({ limit: 1 }),
        adminProjectsService.getProjects({ isPublished: true, limit: 1 }),
        adminProjectsService.getProjects({ isPublished: false, limit: 1 }),
        adminSkillsService.getSkills({ limit: 1 }),
        adminEducationService.getEducation({ limit: 1 }),
        adminExperienceService.getExperience({ limit: 1 }),
        adminServicesService.getServices({ isActive: true, limit: 1 }),
        adminSocialService.getSocialLinks({ isActive: true, limit: 1 }),
        adminMessagesService.getMessages({ status: 'unread', limit: 1 }),
        adminSettingsService.getSiteSettings(),
        adminMessagesService.getMessages({ limit: 5 }),
      ]);

      setStats({
        totalProjects: allProjects.status === 'fulfilled' ? allProjects.value.total || 0 : 0,
        publishedProjects: publishedProjects.status === 'fulfilled' ? publishedProjects.value.total || 0 : 0,
        draftProjects: draftProjects.status === 'fulfilled' ? draftProjects.value.total || 0 : 0,
        totalSkills: skills.status === 'fulfilled' ? skills.value.total || 0 : 0,
        totalEducation: education.status === 'fulfilled' ? education.value.total || 0 : 0,
        totalExperience: experience.status === 'fulfilled' ? experience.value.total || 0 : 0,
        activeServices: services.status === 'fulfilled' ? services.value.total || 0 : 0,
        activeSocial: social.status === 'fulfilled' ? social.value.total || 0 : 0,
        unreadMessages: unreadMsgs.status === 'fulfilled' ? unreadMsgs.value.total || 0 : 0,
      });

      if (settings.status === 'fulfilled') setSiteSettings(settings.value);
      if (recentMsgs.status === 'fulfilled') setRecentMessages(recentMsgs.value.data || []);
    } catch {
      // Graceful error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await adminMessagesService.updateMessage(id, { status: 'read' });
      fetchDashboardData();
    } catch {
      // Silence
    }
  };

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, sub: `${stats.publishedProjects} Pub / ${stats.draftProjects} Draft`, icon: FolderGit2, color: 'text-blue-400', href: '/admin/projects' },
    { label: 'Technical Skills', value: stats.totalSkills, sub: 'Configured Skills', icon: Cpu, color: 'text-purple-400', href: '/admin/skills' },
    { label: 'Experience Entries', value: stats.totalExperience, sub: 'Career Milestones', icon: Briefcase, color: 'text-indigo-400', href: '/admin/experience' },
    { label: 'Education Entries', value: stats.totalEducation, sub: 'Academics', icon: GraduationCap, color: 'text-emerald-400', href: '/admin/education' },
    { label: 'Active Services', value: stats.activeServices, sub: 'Offered Solutions', icon: Wrench, color: 'text-pink-400', href: '/admin/services' },
    { label: 'Active Social Links', value: stats.activeSocial, sub: 'Social Profiles', icon: Share2, color: 'text-sky-400', href: '/admin/social-links' },
    { label: 'Unread Messages', value: stats.unreadMessages, sub: 'Action Required', icon: Mail, color: stats.unreadMessages > 0 ? 'text-amber-400' : 'text-slate-400', href: '/admin/messages' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Live metrics, quick management shortcuts, and system health."
        actionButton={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </Link>
        }
      />

      {/* Maintenance Mode Warning Banner */}
      {siteSettings?.isMaintenanceMode && (
        <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-800/60 text-amber-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Site Maintenance Mode Active</h4>
              <p className="text-xs text-amber-200/80">Public homepage is currently displaying the maintenance screen.</p>
            </div>
          </div>
          <Link
            href="/admin/site-settings"
            className="px-3 py-1.5 rounded-lg bg-amber-900/60 border border-amber-700/60 text-xs font-semibold text-white hover:bg-amber-800 transition"
          >
            Manage Settings
          </Link>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="p-5 rounded-2xl card-surface hover:border-blue-500/40 transition group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  {loading ? '...' : card.value}
                </span>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{card.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Messages Inbox & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Messages Widget */}
        <div className="lg:col-span-8 p-6 rounded-2xl card-surface space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Recent Contact Messages</span>
            </h3>
            <Link
              href="/admin/messages"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Mail className="w-8 h-8 text-[var(--text-secondary)] mx-auto opacity-40" />
              <p className="text-xs text-[var(--text-secondary)]">No contact messages received yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg._id}
                  className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[var(--text-primary)] truncate">{msg.name}</span>
                      <StatusBadge status={msg.status} />
                    </div>
                    <p className="text-xs font-semibold text-blue-400 truncate">{msg.subject}</p>
                    <p className="text-[11px] text-[var(--text-secondary)] truncate">{msg.message}</p>
                  </div>

                  {msg.status === 'unread' && (
                    <button
                      onClick={() => handleMarkAsRead(msg._id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600 hover:text-white transition shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-4 p-6 rounded-2xl card-surface space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Quick Actions
          </h3>

          <div className="space-y-2.5">
            <Link
              href="/admin/profile"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] hover:border-blue-500/40 transition"
            >
              <span>Edit Profile & Hero Content</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </Link>

            <Link
              href="/admin/skills"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] hover:border-purple-500/40 transition"
            >
              <span>Manage Skills & Categories</span>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </Link>

            <Link
              href="/admin/site-settings"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] hover:border-emerald-500/40 transition"
            >
              <span>Configure SEO & Maintenance</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

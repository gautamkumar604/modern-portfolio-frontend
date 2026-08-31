'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  Briefcase,
  Wrench,
  Share2,
  Mail,
  Settings,
  LogOut,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/admin/profile', icon: User },
  { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { label: 'Skills', href: '/admin/skills', icon: Cpu },
  { label: 'Education', href: '/admin/education', icon: GraduationCap },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Services', href: '/admin/services', icon: Wrench },
  { label: 'Social Links', href: '/admin/social-links', icon: Share2 },
  { label: 'Messages', href: '/admin/messages', icon: Mail },
  { label: 'Site Settings', href: '/admin/site-settings', icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-full bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex flex-col justify-between select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[var(--border-color)] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-[var(--text-primary)] tracking-tight">Admin CMS</h2>
            <span className="text-[10px] font-mono font-semibold text-blue-400 uppercase tracking-wider">
              Management Portal
            </span>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="w-full inline-flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer User Badge & Logout */}
      <div className="p-4 border-t border-[var(--border-color)] space-y-3">
        {user && (
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--text-secondary)] font-mono truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-semibold transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

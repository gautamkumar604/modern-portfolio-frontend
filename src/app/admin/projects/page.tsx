'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit3, Trash2, ExternalLink, Sparkles, FolderGit2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { SearchInput } from '@/components/admin/ui/search-input';
import { Pagination } from '@/components/admin/ui/pagination';
import { StatusBadge } from '@/components/admin/ui/status-badge';
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog';
import { ToastContainer, ToastMessage } from '@/components/admin/ui/toast';
import { adminProjectsService } from '@/lib/services/admin-projects.service';
import { Project } from '@/types';

export default function AdminProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await adminProjectsService.getProjects({
        page,
        limit: 8,
        search: search || undefined,
        projectType: typeFilter || undefined,
        status: statusFilter || undefined,
      });
      setProjects(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to fetch projects list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, search, typeFilter, statusFilter]);

  const handleTogglePublish = async (project: Project) => {
    try {
      await adminProjectsService.updateProject(project._id, {
        isPublished: !project.isPublished,
      });
      addToast('success', `Project "${project.title}" ${!project.isPublished ? 'published' : 'unpublished'}.`);
      fetchProjects();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update publication status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminProjectsService.deleteProject(deleteId);
      addToast('success', 'Project deleted successfully.');
      setDeleteId(null);
      fetchProjects();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete project.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Project Confirmation"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete Project"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <PageHeader
        title="Projects Management"
        subtitle="Manage portfolio project showcases, technical details, links, and publication statuses."
        actionButton={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </Link>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl card-surface">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects by title or tech..." />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
          >
            <option value="">All Project Types</option>
            <option value="web">Web Application</option>
            <option value="mobile">Mobile Application</option>
            <option value="fullstack">Full Stack</option>
            <option value="backend">Backend Service</option>
            <option value="open-source">Open Source</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="planned">Planned</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="p-4 rounded-2xl card-surface space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-secondary)] font-mono">
            Loading projects data...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <FolderGit2 className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
            <h4 className="font-bold text-sm text-[var(--text-primary)]">No Projects Found</h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              Create your first project to showcase software projects on the public portfolio.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Visibility</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-[var(--bg-surface-hover)] transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] overflow-hidden shrink-0">
                          {p.coverImage ? (
                            <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-400">
                              <FolderGit2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[var(--text-primary)] truncate">{p.title}</p>
                          <p className="text-[11px] text-[var(--text-secondary)] font-mono truncate">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono capitalize">{p.projectType}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition ${
                            p.isPublished
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                          }`}
                        >
                          {p.isPublished ? 'Published' : 'Draft'}
                        </button>
                        {p.isFeatured && (
                          <span className="p-1 rounded bg-amber-950 text-amber-400 border border-amber-800" title="Featured Project">
                            <Sparkles className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projects/${p._id}`}
                          className="p-1.5 rounded-lg bg-[var(--bg-primary)] text-blue-400 hover:text-white border border-[var(--border-color)] transition"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="p-1.5 rounded-lg bg-[var(--bg-primary)] text-rose-400 hover:text-white border border-[var(--border-color)] transition"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} totalItems={total} onPageChange={setPage} />
      </div>
    </div>
  );
}

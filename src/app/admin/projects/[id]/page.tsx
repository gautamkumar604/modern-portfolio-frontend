'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FormField } from '@/components/admin/ui/form-field';
import { ToastContainer, ToastMessage } from '@/components/admin/ui/toast';
import { adminProjectsService } from '@/lib/services/admin-projects.service';
import { Project } from '@/types';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [formData, setFormData] = useState<Partial<Project>>({});
  const [techInput, setTechInput] = useState('');

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const toastId = Date.now().toString();
    setToasts((prev) => [...prev, { id: toastId, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toastId)), 4000);
  };

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      try {
        const project = await adminProjectsService.getProjectById(id);
        setFormData(project);
      } catch (err: any) {
        addToast('error', err.message || 'Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminProjectsService.updateProject(id, formData);
      addToast('success', 'Project updated successfully!');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update project.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[var(--text-secondary)] font-mono">Loading project data...</div>;
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(toastId) => setToasts((prev) => prev.filter((t) => t.id !== toastId))} />

      <div className="mb-2">
        <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects List</span>
        </Link>
      </div>

      <PageHeader
        title={`Edit Project: ${formData.title || ''}`}
        subtitle={`ID: ${id}`}
        actionButton={
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-2xl card-surface space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Core Project Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Project Title" required>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <FormField label="URL Slug" required>
              <input
                type="text"
                required
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <FormField label="Project Type">
              <select
                value={formData.projectType || 'fullstack'}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              >
                <option value="fullstack">Full Stack Application</option>
                <option value="web">Web Application</option>
                <option value="mobile">Mobile Application</option>
                <option value="backend">Backend Microservice</option>
                <option value="open-source">Open Source Library</option>
              </select>
            </FormField>

            <FormField label="Project Status">
              <select
                value={formData.status || 'completed'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </FormField>
          </div>

          <FormField label="Short Description" required>
            <textarea
              rows={2}
              required
              value={formData.shortDescription || ''}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
            />
          </FormField>

          <FormField label="Detailed Description">
            <textarea
              rows={4}
              value={formData.detailedDescription || ''}
              onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
            />
          </FormField>
        </div>

        <div className="p-6 rounded-2xl card-surface space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Media & Repository Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Cover Image URL">
              <input
                type="text"
                value={formData.coverImage || ''}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
            </FormField>

            <FormField label="GitHub URL">
              <input
                type="text"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
            </FormField>

            <FormField label="Live Demo URL">
              <input
                type="text"
                value={formData.liveDemoUrl || ''}
                onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
            </FormField>
          </div>

          <FormField label="Technologies & Frameworks">
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add tech..."
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (techInput.trim()) {
                    setFormData({ ...formData, technologies: [...(formData.technologies || []), techInput.trim()] });
                    setTechInput('');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {(formData.technologies || []).map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-mono text-blue-400">
                  {t}{' '}
                  <button type="button" onClick={() => setFormData({ ...formData, technologies: (formData.technologies || []).filter((_, i) => i !== idx) })} className="text-rose-400 font-bold ml-1">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </FormField>
        </div>

        <div className="p-6 rounded-2xl card-surface space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Visibility & Publication Options
          </h3>

          <div className="flex flex-wrap gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={formData.isPublished ?? true}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span>Published</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={formData.isFeatured ?? false}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span>Featured Spotlight</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

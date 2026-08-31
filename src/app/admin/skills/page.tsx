'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Cpu, Eye, EyeOff, Sparkles, X, Save } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { SearchInput } from '@/components/admin/ui/search-input';
import { Pagination } from '@/components/admin/ui/pagination';
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog';
import { FormField } from '@/components/admin/ui/form-field';
import { ToastContainer, ToastMessage } from '@/components/admin/ui/toast';
import { adminSkillsService } from '@/lib/services/admin-skills.service';
import { renderIcon } from '@/lib/utils/icon-mapper';
import { Skill } from '@/types';

export default function AdminSkillsPage() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [modalForm, setModalForm] = useState<Partial<Skill>>({
    name: '',
    category: 'Frontend',
    proficiency: 80,
    icon: 'code',
    description: '',
    displayOrder: 0,
    isFeatured: false,
    isVisible: true,
  });
  const [saving, setSaving] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await adminSkillsService.getSkills({
        page,
        limit: 10,
        search: search || undefined,
        category: categoryFilter || undefined,
      });
      setSkills(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(Math.ceil((res.total || 0) / 10) || 1);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to fetch skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [page, search, categoryFilter]);

  const handleOpenCreateModal = () => {
    setEditingSkill(null);
    setModalForm({
      name: '',
      category: 'Frontend',
      proficiency: 80,
      icon: 'code',
      description: '',
      displayOrder: 0,
      isFeatured: false,
      isVisible: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setModalForm(skill);
    setModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSkill) {
        await adminSkillsService.updateSkill(editingSkill._id, modalForm);
        addToast('success', `Skill "${modalForm.name}" updated successfully.`);
      } else {
        await adminSkillsService.createSkill(modalForm);
        addToast('success', `Skill "${modalForm.name}" created successfully.`);
      }
      setModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to save skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async (skill: Skill) => {
    try {
      await adminSkillsService.updateSkill(skill._id, { isVisible: !skill.isVisible });
      addToast('success', `Skill "${skill.name}" visibility updated.`);
      fetchSkills();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to toggle visibility.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminSkillsService.deleteSkill(deleteId);
      addToast('success', 'Skill deleted successfully.');
      setDeleteId(null);
      fetchSkills();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete skill.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Skill Confirmation"
        message="Are you sure you want to delete this skill? This will remove it from the public portfolio."
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <PageHeader
        title="Skills Management"
        subtitle="Manage technical competencies, categories, proficiency bars, and icon representations."
        actionButton={
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Skill</span>
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl card-surface">
        <SearchInput value={search} onChange={setSearch} placeholder="Search skills..." />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
        >
          <option value="">All Categories</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="DevOps">DevOps & Cloud</option>
          <option value="Database">Database</option>
          <option value="Language">Programming Languages</option>
        </select>
      </div>

      <div className="p-4 rounded-2xl card-surface space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-secondary)] font-mono">Loading skills data...</div>
        ) : skills.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Cpu className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
            <h4 className="font-bold text-sm text-[var(--text-primary)]">No Skills Found</h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              Add your first technical skill to display it on the public portfolio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill._id} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-blue-400">
                    {renderIcon(skill.icon || skill.name, 'w-5 h-5')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-[var(--text-primary)] truncate">{skill.name}</h4>
                      {skill.isFeatured && (
                        <span className="p-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800" title="Featured">
                          <Sparkles className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] font-mono">{skill.category} • {skill.proficiency}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleVisibility(skill)}
                    className={`p-1.5 rounded-lg border transition ${
                      skill.isVisible ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-slate-900 text-slate-500 border-slate-700'
                    }`}
                    title={skill.isVisible ? 'Visible' : 'Hidden'}
                  >
                    {skill.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(skill)}
                    className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-blue-400 border border-[var(--border-color)] hover:text-white transition"
                    title="Edit Skill"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(skill._id)}
                    className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-rose-400 border border-[var(--border-color)] hover:text-white transition"
                    title="Delete Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} totalItems={total} onPageChange={setPage} />
      </div>

      {/* Modal Dialog for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Skill Name" required>
                  <input
                    type="text"
                    required
                    value={modalForm.name || ''}
                    onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                    placeholder="TypeScript"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                </FormField>

                <FormField label="Category" required>
                  <input
                    type="text"
                    required
                    value={modalForm.category || ''}
                    onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                    placeholder="Frontend / Backend"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={`Proficiency Level (${modalForm.proficiency || 80}%)`}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={modalForm.proficiency || 80}
                    onChange={(e) => setModalForm({ ...modalForm, proficiency: parseInt(e.target.value) || 0 })}
                    className="w-full h-2 rounded-lg bg-[var(--bg-primary)] accent-blue-500"
                  />
                </FormField>

                <FormField label="Icon Key">
                  <input
                    type="text"
                    value={modalForm.icon || ''}
                    onChange={(e) => setModalForm({ ...modalForm, icon: e.target.value })}
                    placeholder="code / terminal / server"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] outline-none"
                  />
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  rows={2}
                  value={modalForm.description || ''}
                  onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                  placeholder="Optional brief detail..."
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                />
              </FormField>

              <div className="flex flex-wrap gap-6 items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={modalForm.isVisible ?? true}
                    onChange={(e) => setModalForm({ ...modalForm, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Visible on Portfolio</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={modalForm.isFeatured ?? false}
                    onChange={(e) => setModalForm({ ...modalForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Featured Skill</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Skill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Briefcase, X, Save } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { SearchInput } from '@/components/admin/ui/search-input';
import { Pagination } from '@/components/admin/ui/pagination';
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog';
import { FormField } from '@/components/admin/ui/form-field';
import { ToastContainer, ToastMessage } from '@/components/admin/ui/toast';
import { adminExperienceService } from '@/lib/services/admin-experience.service';
import { Experience } from '@/types';
import { formatDate } from '@/lib/utils/formatters';

export default function AdminExperiencePage() {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [modalForm, setModalForm] = useState<Partial<Experience>>({
    company: '',
    position: '',
    employmentType: 'full-time',
    location: '',
    startDate: '',
    endDate: '',
    isCurrentlyWorking: false,
    description: '',
    responsibilities: [],
    technologies: [],
    displayOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await adminExperienceService.getExperience({
        page,
        limit: 10,
        search: search || undefined,
      });
      setExperiences(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(Math.ceil((res.total || 0) / 10) || 1);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to fetch experience records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [page, search]);

  const handleOpenCreateModal = () => {
    setEditingExp(null);
    setModalForm({
      company: '',
      position: '',
      employmentType: 'full-time',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isCurrentlyWorking: false,
      description: '',
      responsibilities: [],
      technologies: [],
      displayOrder: 0,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (exp: Experience) => {
    setEditingExp(exp);
    setModalForm({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
    });
    setModalOpen(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...modalForm,
        endDate: modalForm.isCurrentlyWorking ? undefined : modalForm.endDate,
      };

      if (editingExp) {
        await adminExperienceService.updateExperience(editingExp._id, payload);
        addToast('success', 'Experience record updated.');
      } else {
        await adminExperienceService.createExperience(payload);
        addToast('success', 'Experience record created.');
      }
      setModalOpen(false);
      fetchExperiences();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to save experience record.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminExperienceService.deleteExperience(deleteId);
      addToast('success', 'Experience record deleted.');
      setDeleteId(null);
      fetchExperiences();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete experience record.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Experience Record"
        message="Are you sure you want to delete this work experience entry?"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <PageHeader
        title="Work Experience"
        subtitle="Manage employment history, roles, dates, responsibilities, and technologies."
        actionButton={
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        }
      />

      <div className="flex items-center justify-between p-4 rounded-2xl card-surface">
        <SearchInput value={search} onChange={setSearch} placeholder="Search position or company..." />
      </div>

      <div className="p-4 rounded-2xl card-surface space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-[var(--text-secondary)]">Loading experience data...</div>
        ) : experiences.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
            <h4 className="font-bold text-sm text-[var(--text-primary)]">No Experience Entries Found</h4>
          </div>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp._id} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{exp.position}</h4>
                  <p className="text-xs font-semibold text-blue-400">{exp.company} • <span className="capitalize font-mono text-[var(--text-secondary)]">{exp.employmentType}</span></p>
                  <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                    {formatDate(exp.startDate)} — {formatDate(exp.endDate, exp.isCurrentlyWorking)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(exp)}
                    className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-blue-400 border border-[var(--border-color)] hover:text-white transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(exp._id)}
                    className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-rose-400 border border-[var(--border-color)] hover:text-white transition"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                {editingExp ? 'Edit Experience' : 'Add Experience Record'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Company Name" required>
                  <input
                    type="text"
                    required
                    value={modalForm.company || ''}
                    onChange={(e) => setModalForm({ ...modalForm, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                </FormField>

                <FormField label="Position Title" required>
                  <input
                    type="text"
                    required
                    value={modalForm.position || ''}
                    onChange={(e) => setModalForm({ ...modalForm, position: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Employment Type">
                  <select
                    value={modalForm.employmentType || 'full-time'}
                    onChange={(e) => setModalForm({ ...modalForm, employmentType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </FormField>

                <FormField label="Location">
                  <input
                    type="text"
                    value={modalForm.location || ''}
                    onChange={(e) => setModalForm({ ...modalForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Start Date" required>
                  <input
                    type="date"
                    required
                    value={modalForm.startDate || ''}
                    onChange={(e) => setModalForm({ ...modalForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                </FormField>

                <FormField label="End Date">
                  <input
                    type="date"
                    disabled={modalForm.isCurrentlyWorking}
                    value={modalForm.endDate || ''}
                    onChange={(e) => setModalForm({ ...modalForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none disabled:opacity-40"
                  />
                </FormField>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={modalForm.isCurrentlyWorking ?? false}
                  onChange={(e) => setModalForm({ ...modalForm, isCurrentlyWorking: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Currently Working Here</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] text-xs text-[var(--text-primary)]">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition">
                  <Save className="w-4 h-4 inline mr-1" />
                  <span>{saving ? 'Saving...' : 'Save Experience'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

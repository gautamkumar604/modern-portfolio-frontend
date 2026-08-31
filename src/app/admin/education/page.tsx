'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, GraduationCap, X, Save, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { SearchInput } from '@/components/admin/ui/search-input';
import { Pagination } from '@/components/admin/ui/pagination';
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog';
import { FormField } from '@/components/admin/ui/form-field';
import { ToastContainer, ToastMessage } from '@/components/admin/ui/toast';
import { adminEducationService } from '@/lib/services/admin-education.service';
import { Education } from '@/types';
import { formatDate } from '@/lib/utils/formatters';

export default function AdminEducationPage() {
  const [loading, setLoading] = useState(true);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [modalForm, setModalForm] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrentlyStudying: false,
    location: '',
    description: '',
    grade: '',
    achievements: [],
    displayOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const res = await adminEducationService.getEducation({
        page,
        limit: 10,
        search: search || undefined,
      });
      setEducationList(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(Math.ceil((res.total || 0) / 10) || 1);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to fetch education records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, [page, search]);

  const handleOpenCreateModal = () => {
    setEditingEdu(null);
    setModalForm({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isCurrentlyStudying: false,
      location: '',
      description: '',
      grade: '',
      achievements: [],
      displayOrder: 0,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (edu: Education) => {
    setEditingEdu(edu);
    setModalForm({
      ...edu,
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
    });
    setModalOpen(true);
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...modalForm,
        endDate: modalForm.isCurrentlyStudying ? undefined : modalForm.endDate,
      };

      if (editingEdu) {
        await adminEducationService.updateEducation(editingEdu._id, payload);
        addToast('success', 'Education record updated.');
      } else {
        await adminEducationService.createEducation(payload);
        addToast('success', 'Education record created.');
      }
      setModalOpen(false);
      fetchEducation();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to save education record.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminEducationService.deleteEducation(deleteId);
      addToast('success', 'Education record deleted.');
      setDeleteId(null);
      fetchEducation();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete education record.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Education Record"
        message="Are you sure you want to delete this education record?"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <PageHeader
        title="Education & Academics"
        subtitle="Manage degrees, institutions, study dates, grades, and academic achievements."
        actionButton={
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </button>
        }
      />

      <div className="flex items-center justify-between p-4 rounded-2xl card-surface">
        <SearchInput value={search} onChange={setSearch} placeholder="Search degree or institution..." />
      </div>

      <div className="p-4 rounded-2xl card-surface space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-[var(--text-secondary)]">Loading education data...</div>
        ) : educationList.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <GraduationCap className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
            <h4 className="font-bold text-sm text-[var(--text-primary)]">No Education Entries Found</h4>
          </div>
        ) : (
          <div className="space-y-3">
            {educationList.map((edu) => (
              <div key={edu._id} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{edu.degree}</h4>
                  <p className="text-xs font-semibold text-blue-400">{edu.institution} {edu.fieldOfStudy ? `— ${edu.fieldOfStudy}` : ''}</p>
                  <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate, edu.isCurrentlyStudying)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(edu)}
                    className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-blue-400 border border-[var(--border-color)] hover:text-white transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(edu._id)}
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
                {editingEdu ? 'Edit Education' : 'Add Education Record'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdu} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Institution Name" required>
                  <input
                    type="text"
                    required
                    value={modalForm.institution || ''}
                    onChange={(e) => setModalForm({ ...modalForm, institution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                </FormField>

                <FormField label="Degree / Certificate" required>
                  <input
                    type="text"
                    required
                    value={modalForm.degree || ''}
                    onChange={(e) => setModalForm({ ...modalForm, degree: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Field of Study">
                  <input
                    type="text"
                    value={modalForm.fieldOfStudy || ''}
                    onChange={(e) => setModalForm({ ...modalForm, fieldOfStudy: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                </FormField>

                <FormField label="Grade / GPA">
                  <input
                    type="text"
                    value={modalForm.grade || ''}
                    onChange={(e) => setModalForm({ ...modalForm, grade: e.target.value })}
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
                    disabled={modalForm.isCurrentlyStudying}
                    value={modalForm.endDate || ''}
                    onChange={(e) => setModalForm({ ...modalForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none disabled:opacity-40"
                  />
                </FormField>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={modalForm.isCurrentlyStudying ?? false}
                  onChange={(e) => setModalForm({ ...modalForm, isCurrentlyStudying: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Currently Studying Here</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] text-xs text-[var(--text-primary)]">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition">
                  <Save className="w-4 h-4 inline mr-1" />
                  <span>{saving ? 'Saving...' : 'Save Education'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

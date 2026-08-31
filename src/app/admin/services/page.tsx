'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Wrench, X, Save, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { SearchInput } from '@/components/admin/ui/search-input';
import { Pagination } from '@/components/admin/ui/pagination';
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog';
import { FormField } from '@/components/admin/ui/form-field';
import { ToastContainer, ToastMessage } from '@/components/admin/ui/toast';
import { adminServicesService } from '@/lib/services/admin-services.service';
import { renderIcon } from '@/lib/utils/icon-mapper';
import { Service } from '@/types';

export default function AdminServicesPage() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [modalForm, setModalForm] = useState<Partial<Service>>({
    title: '',
    shortDescription: '',
    detailedDescription: '',
    icon: 'wrench',
    features: [],
    displayOrder: 0,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await adminServicesService.getServices({
        page,
        limit: 10,
        search: search || undefined,
      });
      setServices(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(Math.ceil((res.total || 0) / 10) || 1);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, search]);

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setModalForm({
      title: '',
      shortDescription: '',
      detailedDescription: '',
      icon: 'wrench',
      features: [],
      displayOrder: 0,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setModalForm(service);
    setModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingService) {
        await adminServicesService.updateService(editingService._id, modalForm);
        addToast('success', `Service "${modalForm.title}" updated.`);
      } else {
        await adminServicesService.createService(modalForm);
        addToast('success', `Service "${modalForm.title}" created.`);
      }
      setModalOpen(false);
      fetchServices();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await adminServicesService.updateService(service._id, { isActive: !service.isActive });
      addToast('success', `Service "${service.title}" status updated.`);
      fetchServices();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to toggle service status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminServicesService.deleteService(deleteId);
      addToast('success', 'Service deleted.');
      setDeleteId(null);
      fetchServices();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete service.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Service Confirmation"
        message="Are you sure you want to delete this service offering?"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <PageHeader
        title="Services & Solutions"
        subtitle="Manage professional software development services, architectural consulting, and feature lists."
        actionButton={
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        }
      />

      <div className="flex items-center justify-between p-4 rounded-2xl card-surface">
        <SearchInput value={search} onChange={setSearch} placeholder="Search service title..." />
      </div>

      <div className="p-4 rounded-2xl card-surface space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-[var(--text-secondary)]">Loading services data...</div>
        ) : services.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Wrench className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
            <h4 className="font-bold text-sm text-[var(--text-primary)]">No Service Offerings Found</h4>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service._id} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-start justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-pink-400">
                      {renderIcon(service.icon || service.title, 'w-4 h-4')}
                    </div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">{service.title}</h4>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{service.shortDescription}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleActive(service)}
                    className={`p-1.5 rounded-lg border transition ${
                      service.isActive ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' : 'bg-slate-900 text-slate-500 border-slate-700'
                    }`}
                    title={service.isActive ? 'Active' : 'Inactive'}
                  >
                    {service.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(service)}
                    className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-blue-400 border border-[var(--border-color)] hover:text-white transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(service._id)}
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
                {editingService ? 'Edit Service' : 'Add Service Offering'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Service Title" required>
                  <input
                    type="text"
                    required
                    value={modalForm.title || ''}
                    onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                </FormField>

                <FormField label="Icon Identifier">
                  <input
                    type="text"
                    value={modalForm.icon || ''}
                    onChange={(e) => setModalForm({ ...modalForm, icon: e.target.value })}
                    placeholder="wrench / code / server"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] outline-none"
                  />
                </FormField>
              </div>

              <FormField label="Short Description" required>
                <textarea
                  rows={2}
                  required
                  value={modalForm.shortDescription || ''}
                  onChange={(e) => setModalForm({ ...modalForm, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                />
              </FormField>

              <FormField label="Key Features">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add key feature..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (featureInput.trim()) {
                        setModalForm({ ...modalForm, features: [...(modalForm.features || []), featureInput.trim()] });
                        setFeatureInput('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(modalForm.features || []).map((f, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]">
                      {f}{' '}
                      <button type="button" onClick={() => setModalForm({ ...modalForm, features: (modalForm.features || []).filter((_, i) => i !== idx) })} className="text-rose-400 font-bold ml-1">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </FormField>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={modalForm.isActive ?? true}
                  onChange={(e) => setModalForm({ ...modalForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Active (Publicly Visible)</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] text-xs text-[var(--text-primary)]">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition">
                  <Save className="w-4 h-4 inline mr-1" />
                  <span>{saving ? 'Saving...' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

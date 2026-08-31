'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Share2, X, Save, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { SearchInput } from '@/components/admin/ui/search-input';
import { Pagination } from '@/components/admin/ui/pagination';
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog';
import { FormField } from '@/components/admin/ui/form-field';
import { ToastContainer, ToastMessage } from '@/components/admin/ui/toast';
import { adminSocialService } from '@/lib/services/admin-social.service';
import { renderIcon } from '@/lib/utils/icon-mapper';
import { SocialLink } from '@/types';

export default function AdminSocialLinksPage() {
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [modalForm, setModalForm] = useState<Partial<SocialLink>>({
    platform: '',
    url: '',
    icon: 'share-2',
    displayOrder: 0,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchSocialLinks = async () => {
    setLoading(true);
    try {
      const res = await adminSocialService.getSocialLinks({
        page,
        limit: 10,
        search: search || undefined,
      });
      setSocialLinks(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(Math.ceil((res.total || 0) / 10) || 1);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to fetch social links.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, [page, search]);

  const handleOpenCreateModal = () => {
    setEditingLink(null);
    setModalForm({
      platform: '',
      url: '',
      icon: 'share-2',
      displayOrder: 0,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (link: SocialLink) => {
    setEditingLink(link);
    setModalForm(link);
    setModalOpen(true);
  };

  const handleSaveSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingLink) {
        await adminSocialService.updateSocialLink(editingLink._id, modalForm);
        addToast('success', `Social link "${modalForm.platform}" updated.`);
      } else {
        await adminSocialService.createSocialLink(modalForm);
        addToast('success', `Social link "${modalForm.platform}" created.`);
      }
      setModalOpen(false);
      fetchSocialLinks();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to save social link.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (link: SocialLink) => {
    try {
      await adminSocialService.updateSocialLink(link._id, { isActive: !link.isActive });
      addToast('success', `Social link status updated.`);
      fetchSocialLinks();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to toggle active status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminSocialService.deleteSocialLink(deleteId);
      addToast('success', 'Social link deleted.');
      setDeleteId(null);
      fetchSocialLinks();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete social link.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Social Link Confirmation"
        message="Are you sure you want to delete this social link?"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <PageHeader
        title="Social Links Management"
        subtitle="Manage developer profile links (GitHub, LinkedIn, Twitter, YouTube, etc.)."
        actionButton={
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Social Link</span>
          </button>
        }
      />

      <div className="flex items-center justify-between p-4 rounded-2xl card-surface">
        <SearchInput value={search} onChange={setSearch} placeholder="Search platform..." />
      </div>

      <div className="p-4 rounded-2xl card-surface space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-[var(--text-secondary)]">Loading social links...</div>
        ) : socialLinks.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Share2 className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
            <h4 className="font-bold text-sm text-[var(--text-primary)]">No Social Links Configured</h4>
          </div>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link) => (
              <div key={link._id} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-blue-400">
                    {renderIcon(link.icon || link.platform, 'w-4 h-4')}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-[var(--text-primary)] capitalize">{link.platform}</h4>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-mono truncate">
                      <span className="truncate">{link.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleActive(link)}
                    className={`p-1.5 rounded-lg border transition ${
                      link.isActive ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' : 'bg-slate-900 text-slate-500 border-slate-700'
                    }`}
                  >
                    {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(link)}
                    className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-blue-400 border border-[var(--border-color)] hover:text-white transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(link._id)}
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
                {editingLink ? 'Edit Social Link' : 'Add Social Link'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSocialLink} className="space-y-4">
              <FormField label="Platform Name" required>
                <input
                  type="text"
                  required
                  value={modalForm.platform || ''}
                  onChange={(e) => setModalForm({ ...modalForm, platform: e.target.value })}
                  placeholder="github / linkedin / twitter"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                />
              </FormField>

              <FormField label="Target URL" required>
                <input
                  type="url"
                  required
                  value={modalForm.url || ''}
                  onChange={(e) => setModalForm({ ...modalForm, url: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Icon Key">
                  <input
                    type="text"
                    value={modalForm.icon || ''}
                    onChange={(e) => setModalForm({ ...modalForm, icon: e.target.value })}
                    placeholder="github / linkedin / share-2"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] outline-none"
                  />
                </FormField>

                <FormField label="Display Order">
                  <input
                    type="number"
                    value={modalForm.displayOrder ?? 0}
                    onChange={(e) => setModalForm({ ...modalForm, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                </FormField>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={modalForm.isActive ?? true}
                  onChange={(e) => setModalForm({ ...modalForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Active (Publicly Displayed)</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] text-xs text-[var(--text-primary)]">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition">
                  <Save className="w-4 h-4 inline mr-1" />
                  <span>{saving ? 'Saving...' : 'Save Link'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

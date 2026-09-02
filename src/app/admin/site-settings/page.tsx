'use client';

import React, { useEffect, useState } from 'react';
import { Save, Settings, ShieldAlert, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FormField } from '@/components/admin/ui/form-field';
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog';
import { ToastContainer, ToastMessage } from '@/components/admin/ui/toast';
import { adminSettingsService } from '@/lib/services/admin-settings.service';
import { ChangePasswordForm } from '@/components/admin/settings/change-password-form';
import { SiteSetting } from '@/types';

export default function AdminSiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [formData, setFormData] = useState<Partial<SiteSetting>>({
    siteName: '',
    tagline: '',
    defaultSeoTitle: '',
    defaultSeoDescription: '',
    keywords: [],
    contactEmail: '',
    footerText: '',
    copyrightText: '',
    isMaintenanceMode: false,
    analyticsId: '',
    logoUrl: '',
    faviconUrl: '',
    ogImageUrl: '',
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);
  const [pendingMaintenanceVal, setPendingMaintenanceVal] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminSettingsService.getSiteSettings();
      if (data) {
        setFormData(data);
      }
    } catch (err: any) {
      addToast('error', err.message || 'Failed to load site settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminSettingsService.updateSiteSettings(formData);
      setFormData(updated);
      addToast('success', 'Site settings updated successfully!');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update site settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMaintenanceClick = (targetVal: boolean) => {
    if (targetVal) {
      setPendingMaintenanceVal(true);
      setShowMaintenanceConfirm(true);
    } else {
      setFormData({ ...formData, isMaintenanceMode: false });
    }
  };

  const handleConfirmMaintenanceMode = () => {
    setFormData({ ...formData, isMaintenanceMode: true });
    setShowMaintenanceConfirm(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-mono text-[var(--text-secondary)]">Loading site settings...</div>;
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmDialog
        isOpen={showMaintenanceConfirm}
        title="Enable Maintenance Mode?"
        message="WARNING: Enabling Maintenance Mode will hide the public portfolio and display the maintenance screen to all visitors."
        confirmLabel="Enable Maintenance Mode"
        isDanger={true}
        onConfirm={handleConfirmMaintenanceMode}
        onCancel={() => setShowMaintenanceConfirm(false)}
      />

      <PageHeader
        title="Site Settings & Configuration"
        subtitle="Manage global branding, SEO metadata, contact email, footer text, and system maintenance mode."
        actionButton={
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        }
      />

      <form onSubmit={(e) => handleSave(e)} className="space-y-6">
        {/* Section 1: Maintenance Mode Safety Box */}
        <div className={`p-6 rounded-2xl border space-y-4 ${formData.isMaintenanceMode ? 'bg-amber-950/40 border-amber-800/60' : 'card-surface'}`}>
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${formData.isMaintenanceMode ? 'bg-amber-900/60 text-amber-400 border-amber-700' : 'bg-[var(--bg-primary)] text-blue-400 border-[var(--border-color)]'}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">Maintenance Mode Gatekeeper</h3>
                <p className="text-xs text-[var(--text-secondary)]">Controls public portfolio homepage availability.</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-mono text-xs font-bold">
              <input
                type="checkbox"
                checked={formData.isMaintenanceMode ?? false}
                onChange={(e) => handleToggleMaintenanceClick(e.target.checked)}
                className="w-5 h-5 rounded text-amber-500"
              />
              <span className={formData.isMaintenanceMode ? 'text-amber-400' : 'text-[var(--text-secondary)]'}>
                {formData.isMaintenanceMode ? 'MAINTENANCE MODE ACTIVE' : 'Site Online'}
              </span>
            </label>
          </div>
        </div>

        {/* Section 2: Global Branding */}
        <div className="p-6 rounded-2xl card-surface space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Site Branding & Logos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Site Name" required>
              <input
                type="text"
                required
                value={formData.siteName || ''}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
            </FormField>

            <FormField label="Tagline">
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
            </FormField>

            <FormField label="Logo URL">
              <input
                type="text"
                value={formData.logoUrl || ''}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
            </FormField>

            <FormField label="Favicon URL">
              <input
                type="text"
                value={formData.faviconUrl || ''}
                onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
            </FormField>
          </div>
        </div>

        {/* Section 3: SEO Configuration */}
        <div className="p-6 rounded-2xl card-surface space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Search Engine Optimization (SEO)
          </h3>

          <div className="space-y-4">
            <FormField label="Default SEO Title">
              <input
                type="text"
                value={formData.defaultSeoTitle || ''}
                onChange={(e) => setFormData({ ...formData, defaultSeoTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
            </FormField>

            <FormField label="Default SEO Description">
              <textarea
                rows={2}
                value={formData.defaultSeoDescription || ''}
                onChange={(e) => setFormData({ ...formData, defaultSeoDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
            </FormField>

            <FormField label="SEO Keywords">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="e.g. portfolio, fullstack, software engineer"
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (keywordInput.trim()) {
                      setFormData({ ...formData, keywords: [...(formData.keywords || []), keywordInput.trim()] });
                      setKeywordInput('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
                >
                  Add Keyword
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(formData.keywords || []).map((k, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-mono text-blue-400">
                    {k}{' '}
                    <button type="button" onClick={() => setFormData({ ...formData, keywords: (formData.keywords || []).filter((_, i) => i !== idx) })} className="text-rose-400 font-bold ml-1">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </FormField>
          </div>
        </div>

        {/* Section 4: Contact & Footer */}
        <div className="p-6 rounded-2xl card-surface space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Contact & Footer Copy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Contact Email" required>
              <input
                type="email"
                required
                value={formData.contactEmail || ''}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
            </FormField>

            <FormField label="Copyright Text">
              <input
                type="text"
                value={formData.copyrightText || ''}
                onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
              />
            </FormField>
          </div>

          <FormField label="Footer Information Text">
            <textarea
              rows={2}
              value={formData.footerText || ''}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
            />
          </FormField>
        </div>
      </form>

      {/* Section 5: Change Password Security Component */}
      <ChangePasswordForm
        onSuccessToast={(msg) => addToast('success', msg)}
        onErrorToast={(msg) => addToast('error', msg)}
      />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Save, User, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { FormField } from '@/components/admin/ui/form-field';
import { ToastContainer, ToastMessage } from '@/components/admin/ui/toast';
import { adminProfileService } from '@/lib/services/admin-profile.service';
import { Profile } from '@/types';

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    heroGreeting: '',
    heroHeadline: '',
    heroSubtitle: '',
    primaryCtaText: '',
    primaryCtaUrl: '',
    secondaryCtaText: '',
    secondaryCtaUrl: '',
    shortBio: '',
    detailedBio: '',
    highlights: [],
    availabilityStatus: 'available',
    yearsOfExperience: 0,
    avatarUrl: '',
    resumeUrl: '',
  });

  const [highlightInput, setHighlightInput] = useState('');

  const addToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await adminProfileService.getProfile();
      if (data) {
        setFormData(data);
      }
    } catch (err: any) {
      addToast('error', err.message || 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminProfileService.updateProfile(formData);
      setFormData(updated);
      addToast('success', 'Profile and Hero settings updated successfully!', 'Saved');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update profile.', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddHighlight = () => {
    if (!highlightInput.trim()) return;
    const current = formData.highlights || [];
    setFormData({ ...formData, highlights: [...current, highlightInput.trim()] });
    setHighlightInput('');
  };

  const handleRemoveHighlight = (idx: number) => {
    const current = formData.highlights || [];
    setFormData({ ...formData, highlights: current.filter((_, i) => i !== idx) });
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        Loading profile configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <PageHeader
        title="Profile & Hero Content"
        subtitle="Manage developer credentials, bio descriptions, CTAs, and profile media."
        actionButton={
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        }
      />

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="p-6 rounded-2xl card-surface space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <span>Basic Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Full Name" required>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Professional Title" required>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Contact Email" required>
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Location">
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Phone Number">
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Availability Status">
              <select
                value={formData.availabilityStatus || 'available'}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="available">Available for Hire</option>
                <option value="open_to_offers">Open to Offers</option>
                <option value="busy">Currently Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </FormField>

            <FormField label="Years of Experience">
              <input
                type="number"
                min={0}
                max={50}
                value={formData.yearsOfExperience ?? 0}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>
          </div>
        </div>

        {/* Section 2: Hero Content & CTAs */}
        <div className="p-6 rounded-2xl card-surface space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Hero Section Copy & Action Buttons
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Hero Greeting Badge">
              <input
                type="text"
                value={formData.heroGreeting || ''}
                onChange={(e) => setFormData({ ...formData, heroGreeting: e.target.value })}
                placeholder="Hello, I'm"
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Primary CTA Label">
              <input
                type="text"
                value={formData.primaryCtaText || ''}
                onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                placeholder="View Work"
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Primary CTA URL">
              <input
                type="text"
                value={formData.primaryCtaUrl || ''}
                onChange={(e) => setFormData({ ...formData, primaryCtaUrl: e.target.value })}
                placeholder="#projects"
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Hero Headline">
              <textarea
                rows={2}
                value={formData.heroHeadline || ''}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </FormField>

            <FormField label="Hero Subtitle (Monospace)">
              <textarea
                rows={2}
                value={formData.heroSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </FormField>
          </div>
        </div>

        {/* Section 3: Bios & Highlights */}
        <div className="p-6 rounded-2xl card-surface space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            About Bio & Core Highlights
          </h3>

          <div className="space-y-4">
            <FormField label="Short Bio" required>
              <textarea
                rows={3}
                required
                value={formData.shortBio || ''}
                onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Detailed Bio">
              <textarea
                rows={5}
                value={formData.detailedBio || ''}
                onChange={(e) => setFormData({ ...formData, detailedBio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Highlights Chips">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="e.g. Distributed Systems Architecture"
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {(formData.highlights || []).map((h, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)]"
                    >
                      <span>{h}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-rose-400 hover:text-rose-300 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </FormField>
          </div>
        </div>

        {/* Section 4: Media URLs */}
        <div className="p-6 rounded-2xl card-surface space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Media Links (Avatar Photo & Resume PDF)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Avatar Photo URL">
              <input
                type="text"
                value={formData.avatarUrl || ''}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Resume PDF URL">
              <input
                type="text"
                value={formData.resumeUrl || ''}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
}

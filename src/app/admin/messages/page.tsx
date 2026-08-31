'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle2, Archive, Reply, Eye, X, Globe, User, Clock } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { SearchInput } from '@/components/admin/ui/search-input';
import { Pagination } from '@/components/admin/ui/pagination';
import { StatusBadge } from '@/components/admin/ui/status-badge';
import { ConfirmDialog } from '@/components/admin/ui/confirm-dialog';
import { ToastContainer, ToastMessage } from '@/components/admin/ui/toast';
import { adminMessagesService } from '@/lib/services/admin-messages.service';
import { AdminMessage } from '@/types';
import { formatDate } from '@/lib/utils/formatters';

export default function AdminMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await adminMessagesService.getMessages({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setMessages(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to fetch messages.');
    } fiud: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, search, statusFilter]);

  const handleOpenMessage = async (msg: AdminMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      try {
        const updated = await adminMessagesService.updateMessage(msg._id, { status: 'read' });
        setSelectedMessage(updated);
        fetchMessages();
      } catch {
        // Silence
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: 'read' | 'replied' | 'archived') => {
    try {
      const updated = await adminMessagesService.updateMessage(id, { status });
      addToast('success', `Message status updated to "${status}".`);
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(updated);
      }
      fetchMessages();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminMessagesService.deleteMessage(deleteId);
      addToast('success', 'Message deleted.');
      if (selectedMessage && selectedMessage._id === deleteId) {
        setSelectedMessage(null);
      }
      setDeleteId(null);
      fetchMessages();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete message.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Contact Message"
        message="Are you sure you want to delete this contact message?"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <PageHeader
        title="Contact Messages Inbox"
        subtitle="Review, respond to, and manage client and recruiter contact inquiries."
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl card-surface">
        <SearchInput value={search} onChange={setSearch} placeholder="Search sender, email, or subject..." />

        <div className="flex items-center gap-2">
          {['all', 'unread', 'read', 'replied', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List Column */}
        <div className={`${selectedMessage ? 'lg:col-span-6' : 'lg:col-span-12'} p-4 rounded-2xl card-surface space-y-4`}>
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-[var(--text-secondary)]">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Mail className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
              <h4 className="font-bold text-sm text-[var(--text-primary)]">No Messages Found</h4>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => {
                const isSelected = selectedMessage?._id === msg._id;
                return (
                  <div
                    key={msg._id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500/50 shadow-md'
                        : 'bg-[var(--bg-primary)] border-[var(--border-color)] hover:border-blue-500/30'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-[var(--text-primary)] truncate">{msg.name}</span>
                        <StatusBadge status={msg.status} />
                      </div>
                      <p className="text-xs font-semibold text-blue-400 truncate">{msg.subject}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] truncate">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} totalItems={total} onPageChange={setPage} />
        </div>

        {/* Message Detail Drawer / Panel */}
        {selectedMessage && (
          <div className="lg:col-span-6 p-6 rounded-2xl card-surface space-y-6 sticky top-20">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedMessage.status} />
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {formatDate(selectedMessage.createdAt)}
                </span>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{selectedMessage.subject}</h3>

              <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1 text-xs">
                <p className="text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sender: {selectedMessage.name}</span>
                </p>
                <p className="text-blue-400 font-mono flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <a href={`mailto:${selectedMessage.email}`} className="hover:underline">
                    {selectedMessage.email}
                  </a>
                </p>
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                {selectedMessage.message}
              </div>

              {/* Metadata */}
              {(selectedMessage.ipAddress || selectedMessage.userAgent) && (
                <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-secondary)] space-y-1">
                  {selectedMessage.ipAddress && (
                    <p className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-sky-400" />
                      <span>IP Address: {selectedMessage.ipAddress}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-color)]">
              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  onClick={() => handleUpdateStatus(selectedMessage._id, 'replied')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition inline-flex items-center gap-1.5"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>

                {selectedMessage.status !== 'archived' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage._id, 'archived')}
                    className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-purple-400 text-xs font-semibold hover:bg-[var(--bg-surface-hover)] transition inline-flex items-center gap-1.5"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setDeleteId(selectedMessage._id)}
                className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-400 text-xs font-semibold hover:bg-rose-900/60 transition inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

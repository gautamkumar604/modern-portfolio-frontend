'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { adminAuthService } from '@/lib/services/admin-auth.service';
import { useAuth } from '@/context/auth-context';

interface ChangePasswordFormProps {
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSuccessToast,
  onErrorToast,
}) => {
  const router = useRouter();
  const { clearAuthLocally } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Client-side Password Strength Checkers
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumberOrSymbol = /[\d\W]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isFormValid =
    currentPassword.length > 0 &&
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumberOrSymbol &&
    passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage('Current password is required.');
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumberOrSymbol) {
      setErrorMessage(
        'New password does not meet the minimum security requirements.',
      );
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await adminAuthService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      const msg =
        res.message ||
        'Password changed successfully. Please log in again with your new password.';
      setSuccessMessage(msg);
      if (onSuccessToast) onSuccessToast(msg);

      // Reset Form State
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Wait 1.5s, clear auth state locally, and redirect to /admin/login
      setTimeout(() => {
        clearAuthLocally();
        router.replace('/admin/login');
      }, 1500);
    } catch (err: any) {
      const errText = err.message || 'Failed to change password. Please check your credentials.';
      setErrorMessage(errText);
      if (onErrorToast) onErrorToast(errText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl card-surface space-y-6">
      {/* Form Header */}
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
        <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Security & Admin Password Management
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Update your admin account password. After changing your password, your active browser session will be invalidated and you will be required to sign in again.
          </p>
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Alert Box */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Change Password Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Field 1: Current Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="currentPassword"
            className="block text-xs font-semibold text-[var(--text-secondary)]"
          >
            Current Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full pl-3 pr-12 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none focus:border-blue-500 transition min-h-[44px]"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
              className="absolute right-1 top-1 bottom-1 px-3 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition min-h-[40px] min-w-[40px]"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Field 2: New Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="newPassword"
            className="block text-xs font-semibold text-[var(--text-secondary)]"
          >
            New Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNew ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full pl-3 pr-12 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none focus:border-blue-500 transition min-h-[44px]"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              aria-label={showNew ? 'Hide new password' : 'Show new password'}
              className="absolute right-1 top-1 bottom-1 px-3 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition min-h-[40px] min-w-[40px]"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicators */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-semibold' : 'text-[var(--text-secondary)]'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>8+ Characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-400 font-semibold' : 'text-[var(--text-secondary)]'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>1 Uppercase</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-400 font-semibold' : 'text-[var(--text-secondary)]'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>1 Lowercase</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumberOrSymbol ? 'text-emerald-400 font-semibold' : 'text-[var(--text-secondary)]'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>1 Number/Symbol</span>
            </div>
          </div>
        </div>

        {/* Field 3: Confirm New Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-[var(--text-secondary)]"
          >
            Confirm New Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={`w-full pl-3 pr-12 py-2.5 rounded-xl bg-[var(--bg-primary)] border text-xs text-[var(--text-primary)] outline-none transition min-h-[44px] ${
                confirmPassword.length > 0
                  ? passwordsMatch
                    ? 'border-emerald-500/50'
                    : 'border-rose-500/50'
                  : 'border-[var(--border-color)]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Hide confirmation password' : 'Show confirmation password'}
              className="absolute right-1 top-1 bottom-1 px-3 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition min-h-[40px] min-w-[40px]"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-[11px] text-rose-400 font-mono">
              Passwords do not match.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

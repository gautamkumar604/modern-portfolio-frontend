'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar';
import { AdminHeader } from '@/components/admin/layout/admin-header';
import { ShieldAlert, Loader2 } from 'lucide-react';

function AdminProtectedContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading) {
      if (isLoginPage && isAuthenticated) {
        router.replace('/admin/dashboard');
      } else if (!isLoginPage && !isAuthenticated) {
        router.replace('/admin/login');
      }
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // Handle Login Page view separately
  if (isLoginPage) {
    if (isLoading || isAuthenticated) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] space-y-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      );
    }
    return <>{children}</>;
  }

  // Protected Admin Pages Session Guard
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs font-mono font-semibold text-[var(--text-secondary)]">
          Verifying Admin Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] space-y-4">
        <ShieldAlert className="w-8 h-8 text-rose-500" />
        <p className="text-xs font-mono font-semibold text-[var(--text-secondary)]">
          Redirecting to Admin Login...
        </p>
      </div>
    );
  }

  // Active Admin Layout (Desktop & Mobile Drawer)
  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-x-hidden">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 h-full z-10">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminProtectedContent>{children}</AdminProtectedContent>
    </AuthProvider>
  );
}

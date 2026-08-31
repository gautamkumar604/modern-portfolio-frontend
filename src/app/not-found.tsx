import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-950/60 border border-blue-800/60 text-blue-400 flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">404 Error</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The requested project or resource could not be found or has been unpublished.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

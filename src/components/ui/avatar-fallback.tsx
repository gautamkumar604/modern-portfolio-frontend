import React from 'react';
import { Code2, Terminal, Cpu } from 'lucide-react';

interface AvatarFallbackProps {
  className?: string;
  title?: string;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  className = 'w-full h-full',
  title = 'Full-Stack Developer',
}) => {
  return (
    <div
      className={`relative w-full h-full rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden border border-slate-800/80 ${className}`}
    >
      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {/* Ambient Pulsing Glow Circle */}
      <div className="absolute w-36 h-36 bg-gradient-to-tr from-blue-600/30 via-indigo-600/30 to-pink-600/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

      {/* Visual Composition: Code Icon & Floating Nodes */}
      <div className="relative z-10 space-y-4 flex flex-col items-center">
        <div className="relative p-5 rounded-2xl bg-slate-900/90 border border-blue-500/30 shadow-xl shadow-blue-500/10 text-blue-400">
          <Code2 className="w-12 h-12 stroke-[1.5]" />
          <div className="absolute -top-1.5 -right-1.5 p-1 rounded-md bg-indigo-600 text-white shadow-md">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div className="absolute -bottom-1.5 -left-1.5 p-1 rounded-md bg-pink-600 text-white shadow-md">
            <Cpu className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-mono font-semibold text-blue-400 tracking-wider uppercase">
            Developer Profile
          </p>
          <p className="text-xs text-slate-400 max-w-[180px] truncate">{title}</p>
        </div>
      </div>
    </div>
  );
};

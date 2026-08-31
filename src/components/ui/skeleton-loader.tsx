import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  height = 'h-24',
  className = '',
}) => {
  return (
    <div className={`space-y-4 w-full ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`w-full ${height} rounded-xl bg-slate-800/40 animate-pulse border border-slate-800/50`}
        />
      ))}
    </div>
  );
};

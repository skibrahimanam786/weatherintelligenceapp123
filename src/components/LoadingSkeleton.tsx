import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse max-w-7xl mx-auto py-6 px-4">
      
      {/* Hero Skeleton */}
      <div className="h-80 rounded-3xl bg-slate-800/60 border border-slate-800 p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-700/80 rounded-lg" />
            <div className="h-10 w-64 bg-slate-700/80 rounded-xl" />
          </div>
          <div className="h-10 w-24 bg-slate-700/80 rounded-xl" />
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <div className="h-16 w-48 bg-slate-700/80 rounded-2xl" />
            <div className="h-5 w-40 bg-slate-700/80 rounded-lg" />
          </div>
          <div className="w-24 h-24 rounded-full bg-slate-700/80" />
        </div>
      </div>

      {/* Hourly Timeline Skeleton */}
      <div className="h-44 rounded-3xl bg-slate-800/60 border border-slate-800 p-6 flex flex-col justify-between">
        <div className="h-5 w-48 bg-slate-700/80 rounded-lg" />
        <div className="flex gap-4 overflow-hidden pt-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-24 h-24 rounded-2xl bg-slate-700/60 shrink-0" />
          ))}
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-slate-800/60 border border-slate-800 p-4" />
        ))}
      </div>

    </div>
  );
};

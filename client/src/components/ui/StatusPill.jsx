import React from 'react';

const statusConfig = {
  pending: { bg: 'bg-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-500', pulse: false },
  active: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', dot: 'bg-cyan-400', pulse: true },
  completed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500', pulse: false },
  error: { bg: 'bg-rose-500/20', text: 'text-rose-400', dot: 'bg-rose-500', pulse: false }
};

export default function StatusPill({ status = 'pending', label }) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-white/5 ${config.bg} ${config.text}`}>
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}></span>
      </span>
      <span>{label}</span>
    </div>
  );
}

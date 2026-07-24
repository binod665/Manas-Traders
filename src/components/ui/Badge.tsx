import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'slate' | 'blue';
  className?: string;
}

export function Badge({ children, variant = 'emerald', className = '' }: BadgeProps) {
  const variants = {
    emerald: 'bg-emerald-100/80 text-emerald-800 border-emerald-200/60',
    amber: 'bg-amber-100/80 text-amber-900 border-amber-200/60',
    slate: 'bg-slate-100 text-slate-800 border-slate-200',
    blue: 'bg-blue-100/80 text-blue-900 border-blue-200/60',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

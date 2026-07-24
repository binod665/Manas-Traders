import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function Card({ children, className = '', hoverEffect = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm ${
        hoverEffect ? 'hover:shadow-md hover:border-emerald-200 transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

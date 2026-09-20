import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'luxury' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-stone-100 text-stone-800 border-stone-200',
    outline: 'border border-stone-300 text-stone-700 bg-transparent',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border border-amber-200',
    luxury: 'bg-stone-900 text-amber-200 border border-amber-800/40',
    neutral: 'bg-stone-200/60 text-stone-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

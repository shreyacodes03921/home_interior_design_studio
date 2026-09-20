import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'luxury' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-offset-2 tracking-wide';

    const variants = {
      primary:
        'bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-sm focus:ring-stone-900',
      secondary:
        'bg-stone-200 text-stone-800 hover:bg-stone-300 focus:ring-stone-400',
      outline:
        'border border-stone-300 bg-transparent text-stone-800 hover:bg-stone-100 hover:border-stone-400 focus:ring-stone-400',
      ghost:
        'bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-900 focus:ring-stone-400',
      luxury:
        'bg-stone-900 text-amber-100 border border-amber-900/30 hover:bg-stone-800 shadow-md focus:ring-amber-700',
      danger:
        'bg-rose-700 text-white hover:bg-rose-800 focus:ring-rose-500',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
      md: 'text-sm px-4 py-2 rounded-md gap-2',
      lg: 'text-base px-6 py-3 rounded-lg gap-2.5',
      icon: 'p-2 rounded-md',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

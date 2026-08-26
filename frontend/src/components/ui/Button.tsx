import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-gradient-neon text-white hover:shadow-neon-cyan hover:scale-105',
      secondary: 'bg-cream-200 text-dark-900 hover:bg-cream-300 border border-cream-300',
      outline: 'border border-neon-cyan/50 bg-white/50 text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-neon-cyan',
      ghost: 'text-dark-900/70 hover:bg-cream-200',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      neon: 'bg-gradient-neon text-white hover:shadow-neon-cyan hover:scale-105 font-bold',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner className="mr-2" size="sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

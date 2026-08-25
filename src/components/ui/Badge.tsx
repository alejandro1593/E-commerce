import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neon';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-cream-200 text-dark-900/70 border border-cream-300',
    primary: 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30',
    success: 'bg-neon-green/10 text-neon-green border border-neon-green/30',
    warning: 'bg-yellow-400/10 text-yellow-600 border border-yellow-400/30',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/30',
    neon: 'bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 text-dark-900 border border-neon-cyan/30',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

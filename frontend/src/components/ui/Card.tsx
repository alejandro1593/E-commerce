import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white/70 backdrop-blur-xl rounded-2xl border border-cream-300/50 shadow-card transition-all duration-300',
        'hover:shadow-card-hover hover:border-neon-cyan/30',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={clsx('px-6 py-4 border-b border-cream-300/50', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardProps) {
  return (
    <div className={clsx('px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div className={clsx('px-6 py-4 border-t border-cream-300/50 bg-cream-100/50 rounded-b-2xl', className)}>
      {children}
    </div>
  );
}

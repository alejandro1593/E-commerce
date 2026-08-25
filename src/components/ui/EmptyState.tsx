import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="text-dark-900/20 mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-dark-900 mb-3">{title}</h3>
      {description && (
        <p className="text-dark-900/60 mb-6 max-w-sm">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="neon">{action.label}</Button>
      )}
    </div>
  );
}

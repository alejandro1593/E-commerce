import { Spinner } from './Spinner';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message = 'Cargando...', fullScreen = false }: LoadingProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream-100 z-50 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-dark-900/60">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Spinner size="lg" />
      <p className="mt-4 text-dark-900/60">{message}</p>
    </div>
  );
}

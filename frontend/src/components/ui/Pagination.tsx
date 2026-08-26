import { clsx } from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const showPages = 5;
  let start = Math.max(1, currentPage - Math.floor(showPages / 2));
  const end = Math.min(totalPages, start + showPages - 1);

  if (end - start + 1 < showPages) {
    start = Math.max(1, end - showPages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
          currentPage === 1
            ? 'text-dark-900/30 cursor-not-allowed'
            : 'text-dark-900/60 hover:bg-cream-200 hover:text-dark-900'
        )}
      >
        Anterior
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 text-sm font-medium text-dark-900/60 rounded-xl hover:bg-cream-200 hover:text-dark-900 transition-all duration-300"
          >
            1
          </button>
          {start > 2 && (
            <span className="px-2 py-2 text-dark-900/40">...</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx(
            'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
            page === currentPage
              ? 'bg-gradient-neon text-white shadow-glow'
              : 'text-dark-900/60 hover:bg-cream-200 hover:text-dark-900'
          )}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-2 py-2 text-dark-900/40">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 text-sm font-medium text-dark-900/60 rounded-xl hover:bg-cream-200 hover:text-dark-900 transition-all duration-300"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
          currentPage === totalPages
            ? 'text-dark-900/30 cursor-not-allowed'
            : 'text-dark-900/60 hover:bg-cream-200 hover:text-dark-900'
        )}
      >
        Siguiente
      </button>
    </nav>
  );
}

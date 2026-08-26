import { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { Loading } from '../components/ui/Loading';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import { ITEMS_PER_PAGE } from '../lib/constants';

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useProducts({
    page,
    limit: ITEMS_PER_PAGE,
    sort,
    category: category || undefined,
    search: debouncedSearch || undefined,
  });

  const products = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  if (isLoading && page === 1) {
    return <Loading message="Cargando productos..." />;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-dark-900">Productos</h1>
        <p className="text-dark-900/60">Explora nuestra selección de productos de calidad</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <ProductFilters
          sort={sort}
          category={category}
          onSortChange={(s) => { setSort(s); setPage(1); }}
          onCategoryChange={(c) => { setCategory(c); setPage(1); }}
        />
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No se encontraron productos"
          description="Intenta con otros términos de búsqueda"
          action={{ label: 'Limpiar búsqueda', onClick: () => { setSearch(''); setCategory(''); setPage(1); } }}
        />
      ) : (
        <>
          <ProductGrid products={products} />
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

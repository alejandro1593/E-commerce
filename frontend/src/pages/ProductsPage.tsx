import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/ErrorState';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import { ITEMS_PER_PAGE } from '../lib/constants';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(searchParams.get('cat') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError } = useProducts({
    page,
    limit: ITEMS_PER_PAGE,
    sort,
    category: category || undefined,
    search: debouncedSearch || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  const products = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleCategoryChange = (c: string) => {
    setCategory(c);
    setPage(1);
    if (c) {
      setSearchParams({ cat: c });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setCategory('');
    setSearch('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  if (isLoading && page === 1) {
    return <Loading message="Cargando productos..." />;
  }

  if (isError) {
    return (
      <div className="container py-8">
        <ErrorState message="No pudimos cargar los productos. Intenta de nuevo." />
      </div>
    );
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
          minPrice={minPrice}
          maxPrice={maxPrice}
          onSortChange={(s) => { setSort(s); setPage(1); }}
          onCategoryChange={handleCategoryChange}
          onMinPriceChange={(v) => { setMinPrice(v); setPage(1); }}
          onMaxPriceChange={(v) => { setMaxPrice(v); setPage(1); }}
          onClear={clearFilters}
        />
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No se encontraron productos"
          description="Intenta con otros términos de búsqueda o filtros"
          action={{ label: 'Limpiar filtros', onClick: clearFilters }}
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

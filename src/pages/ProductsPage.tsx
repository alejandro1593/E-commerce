import { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { Loading } from '../components/ui/Loading';
import { PRODUCT_SORT_OPTIONS, ITEMS_PER_PAGE } from '../lib/constants';
import { formatPrice } from '../lib/utils';

const mockProducts = [
  {
    id: '1',
    name: 'Laptop HP Pavilion',
    slug: 'laptop-hp-pavilion',
    price: 15999,
    image: 'https://via.placeholder.com/300x300/FFF8F0/00b4d8?text=Laptop',
    category: 'Electrónica',
    stock: 15,
  },
  {
    id: '2',
    name: 'Auriculares Sony WH-1000XM4',
    slug: 'auriculares-sony-wh1000xm4',
    price: 6999,
    image: 'https://via.placeholder.com/300x300/FFF8F0/e040a0?text=Auriculares',
    category: 'Electrónica',
    stock: 25,
  },
  {
    id: '3',
    name: 'Camiseta Nike Dri-FIT',
    slug: 'camiseta-nike-dri-fit',
    price: 599,
    image: 'https://via.placeholder.com/300x300/FFF8F0/7c3aed?text=Camiseta',
    category: 'Ropa',
    stock: 50,
  },
];

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [isLoading] = useState(false);

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return <Loading message="Cargando productos..." />;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-dark-900">Productos</h1>
        <p className="text-dark-900/60">
          Explora nuestra selección de productos de calidad
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={PRODUCT_SORT_OPTIONS}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No se encontraron productos"
          description="Intenta con otros términos de búsqueda"
          action={{
            label: 'Limpiar búsqueda',
            onClick: () => setSearch(''),
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-5">
                  <Badge variant="neon" className="mb-3">{product.category}</Badge>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-dark-900">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gradient">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-dark-900/50">
                      Stock: {product.stock}
                    </span>
                  </div>
                  <Button className="w-full" variant="outline">
                    Agregar al carrito
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

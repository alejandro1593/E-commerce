import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isAdding } = useCart();
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300x300/FFF8F0/00b4d8?text=Product';
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ productId: product.id, quantity: 1 });
  };

  return (
    <Link to={`/productos/${product.slug}`}>
      <Card className="group overflow-hidden h-full">
        <div className="aspect-square overflow-hidden relative">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <Badge variant="success">-{discount}%</Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-5">
          {product.category && (
            <Badge variant="neon" className="mb-3">{product.category.name}</Badge>
          )}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-dark-900 min-h-[3.5rem]">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-gradient">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-dark-900/40 line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <Button
            className="w-full"
            variant="outline"
            onClick={handleAddToCart}
            isLoading={isAdding}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

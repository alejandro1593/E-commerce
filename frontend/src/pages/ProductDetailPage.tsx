import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Loading } from '../components/ui/Loading';
import { ImageGallery } from '../components/products/ImageGallery';
import { ReviewsSection } from '../components/products/ReviewsSection';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../lib/utils';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || '');
  const { addItem, isAdding } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <Loading message="Cargando producto..." />;
  if (error || !product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-dark-900">Producto no encontrado</h1>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const rating = product.reviews?.length
    ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const handleAddToCart = () => {
    addItem({ productId: product.id, quantity });
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ImageGallery images={product.images} productName={product.name} />

        <div>
          {product.category && <Badge variant="neon" className="mb-4">{product.category.name}</Badge>}
          <h1 className="text-4xl font-bold mb-4 text-dark-900">{product.name}</h1>

          {product.reviews && product.reviews.length > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-cream-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-dark-900/60">({product.reviews.length} reseñas)</span>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gradient">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl text-dark-900/40 line-through">{formatPrice(product.compareAtPrice)}</span>
                  <Badge variant="success">-{discount}%</Badge>
                </>
              )}
            </div>
          </div>

          <p className="text-dark-900/70 mb-8 text-lg leading-relaxed">{product.description}</p>

          <div className="mb-8">
            <p className="text-sm text-dark-900/50 mb-2">SKU: {product.sku}</p>
            <p className="text-sm">
              {product.stock > 0 ? (
                <span className="text-neon-green">En stock ({product.stock} disponibles)</span>
              ) : (
                <span className="text-red-500">Agotado</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-32">
              <Input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <Button
              size="lg"
              variant="neon"
              className="flex-1"
              onClick={handleAddToCart}
              isLoading={isAdding}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </Button>
          </div>
        </div>
      </div>

      <ReviewsSection productId={product.id} />
    </div>
  );
}

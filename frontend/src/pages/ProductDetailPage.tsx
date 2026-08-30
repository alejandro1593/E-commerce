import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Loading } from '../components/ui/Loading';
import { ImageGallery } from '../components/products/ImageGallery';
import { ReviewsSection } from '../components/products/ReviewsSection';
import { useProduct, useRelatedProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuthStore } from '../store/authStore';
import { formatPrice } from '../lib/utils';
import { ProductCard } from '../components/products/ProductCard';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || '');
  const { addItem, isAdding } = useCart();
  const { isFavorite, toggle, isToggling } = useWishlist();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: relatedProducts } = useRelatedProducts(slug || '', !!slug);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  if (isLoading) return <Loading message="Cargando producto..." />;
  if (error || !product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-dark-900">Producto no encontrado</h1>
      </div>
    );
  }

  const variants = product.variants || [];
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || null;

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const rating = product.reviews?.length
    ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const handleAddToCart = () => {
    addItem({ productId: product.id, variantId: selectedVariantId || undefined, quantity });
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
              <span className="text-4xl font-bold text-gradient">{formatPrice(displayPrice)}</span>
              {product.compareAtPrice && !selectedVariant && (
                <>
                  <span className="text-xl text-dark-900/40 line-through">{formatPrice(product.compareAtPrice)}</span>
                  <Badge variant="success">-{discount}%</Badge>
                </>
              )}
            </div>
          </div>

          <p className="text-dark-900/70 mb-8 text-lg leading-relaxed">{product.description}</p>

          <div className="mb-8">
            <p className="text-sm text-dark-900/50 mb-2">SKU: {selectedVariant?.sku || product.sku}</p>
            <p className="text-sm">
              {displayStock > 0 ? (
                <span className="text-neon-green">En stock ({displayStock} disponibles)</span>
              ) : (
                <span className="text-red-500">Agotado</span>
              )}
            </p>
          </div>

          {variants.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-dark-900/50 mb-2">Elige una opción:</p>
              <div className="flex flex-wrap gap-3">
                {variants.map((v) => {
                  const attrLabel = Object.entries(v.options || {})
                    .map(([, val]) => val)
                    .filter(Boolean)
                    .join(' · ');
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedVariantId(v.id);
                        setQuantity(1);
                      }}
                      disabled={v.stock === 0}
                      className={`px-4 py-3 rounded-xl border text-left transition-colors ${
                        selectedVariantId === v.id
                          ? 'border-neon-cyan bg-neon-cyan/10 text-dark-900'
                          : 'border-cream-300 hover:border-neon-cyan/60'
                      } ${v.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="block text-sm font-medium">{v.name}</span>
                      {attrLabel && <span className="block text-xs text-dark-900/50">{attrLabel}</span>}
                      <span className="block text-sm font-semibold text-neon-cyan mt-1">
                        {formatPrice(v.price)}
                        {v.stock === 0 && <span className="text-red-500"> · Agotado</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

            <div className="flex items-center gap-4">
              <div className="w-32">
                <Input
                  type="number"
                  min={1}
                  max={Math.max(displayStock, 1)}
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
                disabled={displayStock === 0 || (variants.length > 0 && !selectedVariant)}
              >
                {displayStock === 0 ? 'Agotado' : variants.length > 0 && !selectedVariant ? 'Selecciona una opción' : 'Agregar al carrito'}
              </Button>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => toggle(product.id)}
                  disabled={isToggling}
                  title={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  className={`w-14 h-14 shrink-0 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-50 ${
                    isFavorite(product.id)
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'border-cream-300 text-dark-900/50 hover:border-red-400 hover:text-red-500'
                  }`}
                >
                  <svg className="h-6 w-6" fill={isFavorite(product.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              )}
            </div>
        </div>
      </div>

      <ReviewsSection productId={product.id} />

      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-dark-900 mb-6">Quizá también te guste</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

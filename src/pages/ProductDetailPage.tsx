import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { formatPrice } from '../lib/utils';

const mockProduct = {
  id: '1',
  name: 'Laptop HP Pavilion',
  slug: 'laptop-hp-pavilion',
  description: 'Laptop de alto rendimiento con procesador Intel Core i7, 16GB de RAM y 512GB SSD. Perfecta para trabajo y entretenimiento.',
  price: 15999,
  compareAtPrice: 18999,
  images: [
    'https://via.placeholder.com/600x600/FFF8F0/00b4d8?text=Laptop+1',
    'https://via.placeholder.com/600x600/FFF8F0/e040a0?text=Laptop+2',
    'https://via.placeholder.com/600x600/FFF8F0/7c3aed?text=Laptop+3',
  ],
  category: 'Electrónica',
  sku: 'ELEC-0001',
  stock: 15,
  rating: 4.5,
  reviewCount: 128,
};

export function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const product = mockProduct;

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-cream-300/50 shadow-card">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  selectedImage === index
                    ? 'border-neon-cyan shadow-neon-cyan'
                    : 'border-cream-300/50 hover:border-cream-400'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Badge variant="neon" className="mb-4">{product.category}</Badge>
          <h1 className="text-4xl font-bold mb-4 text-dark-900">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-cream-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-dark-900/60">({product.reviewCount} reseñas)</span>
            </div>
          </div>

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
            <Button size="lg" variant="neon" className="flex-1">
              Agregar al carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

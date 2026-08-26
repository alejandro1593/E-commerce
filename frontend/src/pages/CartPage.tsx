import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { useCart } from '../hooks/useCart';
import { Input } from '../components/ui/Input';
import { useState } from 'react';

export function CartPage() {
  const { items, couponCode, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    } catch {}
  };

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.872l1.836-8.046A1.125 1.125 0 0019.5 3H6.893M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          }
          title="Tu carrito está vacío"
          description="Agrega productos para continuar"
          action={{ label: 'Ver Productos', onClick: () => window.location.href = '/productos' }}
        />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-dark-900">Carrito de Compras</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold text-dark-900">{items.length} {items.length === 1 ? 'artículo' : 'artículos'}</h2>
            </CardHeader>
            <CardContent className="divide-y divide-cream-300/50">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>

          {/* Coupon */}
          <Card className="mt-4">
            <CardContent className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  label="Cupón de descuento"
                  placeholder="Código de cupón"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleApplyCoupon}>Aplicar</Button>
              {couponCode && (
                <Button variant="ghost" onClick={() => removeCoupon()} className="text-red-500">
                  Quitar cupón
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <h2 className="text-lg font-semibold text-dark-900">Resumen</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <CartSummary />
              <Link to="/checkout" className="block">
                <Button className="w-full" size="lg" variant="neon">Proceder al pago</Button>
              </Link>
              <Link to="/productos" className="block text-center">
                <Button variant="ghost" className="w-full">Seguir comprando</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

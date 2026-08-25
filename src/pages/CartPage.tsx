import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../lib/utils';

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getTotal } = useCartStore();

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
          action={{
            label: 'Ver Productos',
            onClick: () => window.location.href = '/productos',
          }}
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
              <h2 className="text-lg font-semibold text-dark-900">
                {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
              </h2>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                Vaciar carrito
              </Button>
            </CardHeader>
            <CardContent className="divide-y divide-cream-300/50">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-cream-300/50">
                    <img
                      src={item.image || 'https://via.placeholder.com/96/FFF8F0/00b4d8?text=Product'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-dark-900">{item.name}</h3>
                    <p className="text-neon-cyan font-semibold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
                      <span className="w-10 text-center text-dark-900">{item.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-dark-900">{formatPrice(item.price * item.quantity)}</p>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 mt-2" onClick={() => removeItem(item.id)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <h2 className="text-lg font-semibold text-dark-900">Resumen</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-dark-900/60">Subtotal</span>
                <span className="text-dark-900">{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-900/60">Envío</span>
                <span className="text-neon-green">Gratis</span>
              </div>
              <div className="border-t border-cream-300/50 pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-dark-900">Total</span>
                  <span className="text-gradient">{formatPrice(getTotal())}</span>
                </div>
              </div>
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

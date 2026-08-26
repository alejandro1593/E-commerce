import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useCart } from '../../hooks/useCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { Button } from '../ui/Button';

export function CartDrawer() {
  const { isCartOpen, toggleCart } = useUIStore();
  const { items, itemCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm" onClick={toggleCart} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-cream-100 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-cream-300/50">
          <h2 className="text-xl font-bold text-dark-900">Carrito ({itemCount})</h2>
          <button onClick={toggleCart} className="text-dark-900/50 hover:text-dark-900">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-900/60 mb-4">Tu carrito está vacío</p>
              <Button variant="outline" onClick={toggleCart}>Seguir comprando</Button>
            </div>
          ) : (
            <div className="divide-y divide-cream-300/50">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-cream-300/50">
            <CartSummary />
            <div className="mt-4 space-y-2">
              <Link to="/carrito" onClick={toggleCart} className="block">
                <Button className="w-full" variant="neon">Ver carrito</Button>
              </Link>
              <Link to="/checkout" onClick={toggleCart} className="block">
                <Button className="w-full" variant="outline">Ir a checkout</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

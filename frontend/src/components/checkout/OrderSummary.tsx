import { CartSummary } from '../cart/CartSummary';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/utils';

export function OrderSummary() {
  const { items } = useCart();

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <h2 className="text-lg font-semibold text-dark-900">Resumen del pedido</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const price = item.variant?.price || item.product?.price || 0;
          return (
            <div key={item.id} className="flex justify-between">
              <span className="text-dark-900/60 truncate mr-2">
                {item.product?.name || 'Producto'} x{item.quantity}
              </span>
              <span className="text-dark-900 whitespace-nowrap">{formatPrice(price * item.quantity)}</span>
            </div>
          );
        })}
        <div className="border-t border-cream-300/50 pt-4">
          <CartSummary />
        </div>
      </CardContent>
    </Card>
  );
}

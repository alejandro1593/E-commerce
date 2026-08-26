import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/utils';

export function CartSummary() {
  const { subtotal, tax, discount, total, itemCount, couponCode } = useCart();

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-dark-900/60">Subtotal ({itemCount} items)</span>
        <span className="text-dark-900">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-dark-900/60">IVA (16%)</span>
        <span className="text-dark-900">{formatPrice(tax)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-neon-green">
          <span>Descuento {couponCode && `(${couponCode})`}</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-dark-900/60">Envío</span>
        <span className="text-neon-green">Gratis</span>
      </div>
      <div className="border-t border-cream-300/50 pt-4">
        <div className="flex justify-between font-semibold text-lg">
          <span className="text-dark-900">Total</span>
          <span className="text-gradient">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

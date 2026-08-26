import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';
import { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCart();
  const product = item.product;
  const variant = item.variant;
  const imageUrl = product?.images?.[0]?.url || 'https://via.placeholder.com/96/FFF8F0/00b4d8?text=Product';
  const price = variant?.price || product?.price || 0;
  const name = variant?.name || product?.name || 'Producto';
  const stock = variant?.stock || product?.stock || 0;

  return (
    <div className="flex gap-4 py-4">
      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-cream-300/50">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-dark-900 truncate">{name}</h3>
        <p className="text-neon-cyan font-semibold mt-1">{formatPrice(price)}</p>
        <div className="flex items-center gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateItem({ itemId: item.id, quantity: item.quantity - 1 })}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <span className="w-10 text-center text-dark-900">{item.quantity}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateItem({ itemId: item.id, quantity: item.quantity + 1 })}
            disabled={item.quantity >= stock}
          >
            +
          </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-dark-900">{formatPrice(price * item.quantity)}</p>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 mt-2"
          onClick={() => removeItem(item.id)}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
}

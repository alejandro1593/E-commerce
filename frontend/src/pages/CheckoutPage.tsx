import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { useCart } from '../hooks/useCart';
import { ordersApi } from '../api/orders.api';
import { useUIStore } from '../store/uiStore';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const addToast = useUIStore((s) => s.addToast);
  const [isLoading, setIsLoading] = useState(false);

  if (items.length === 0) {
    navigate('/carrito');
    return null;
  }

  const handleSubmit = async (data: {
    email: string;
    name: string;
    phone: string;
    shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string };
  }) => {
    setIsLoading(true);
    try {
      const order = await ordersApi.create(data);
      clearCart();
      navigate('/orden-exitosa', { state: { orderId: order.id } });
    } catch (error: any) {
      addToast({ message: error.response?.data?.message || 'Error al crear la orden', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-dark-900">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              <CheckoutForm onSubmit={handleSubmit} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
        <OrderSummary />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { StripePaymentForm } from '../components/checkout/StripePaymentForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { useCart } from '../hooks/useCart';
import { useAuthStore } from '../store/authStore';
import { ordersApi, paymentsApi } from '../api/orders.api';
import { useUIStore } from '../store/uiStore';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, total } = useCart();
  const user = useAuthStore((s) => s.user);
  const addToast = useUIStore((s) => s.addToast);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [order, setOrder] = useState<{ id: string; paymentIntentId?: string } | null>(null);
  const [clientSecret, setClientSecret] = useState('');

  if (items.length === 0 && !order) {
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
      const newOrder: any = await ordersApi.create(data);
      // Si la orden ya trae paymentIntentId se reutiliza
      const orderWithPayment = newOrder.paymentIntentId
        ? newOrder
        : await paymentsApi.createIntent(newOrder.id);
      setOrder({ id: newOrder.id, paymentIntentId: orderWithPayment.paymentIntentId });
      setClientSecret(orderWithPayment.clientSecret || '');
    } catch (error: any) {
      addToast({ message: error.response?.data?.message || 'Error al crear la orden', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentConfirmed = async (paymentIntentId: string) => {
    setIsConfirming(true);
    try {
      await paymentsApi.confirm(paymentIntentId);
      clearCart();
      navigate('/orden-exitosa', { state: { orderId: order!.id } });
    } catch (error: any) {
      addToast({ message: error.response?.data?.message || 'Error al confirmar el pago', type: 'error' });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-dark-900">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              {!order ? (
                <CheckoutForm onSubmit={handleSubmit} isLoading={isLoading} user={user} />
              ) : (
                <StripePaymentForm
                  clientSecret={clientSecret}
                  paymentIntentId={order.paymentIntentId || ''}
                  amount={total}
                  onSubmit={handlePaymentConfirmed}
                  isSubmitting={isConfirming}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <OrderSummary />
      </div>
    </div>
  );
}

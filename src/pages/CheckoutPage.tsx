import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../lib/utils';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', name: '', phone: '', address: '', city: '', state: '', zipCode: '',
    cardNumber: '', cardExpiry: '', cardCvc: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    navigate('/orden-exitosa');
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-dark-900">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader><h2 className="text-lg font-semibold text-dark-900">Información de contacto</h2></CardHeader>
              <CardContent className="space-y-4">
                <Input label="Email" name="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Nombre" name="name" placeholder="Tu nombre" value={formData.name} onChange={handleChange} required />
                  <Input label="Teléfono" name="phone" placeholder="Tu teléfono" value={formData.phone} onChange={handleChange} required />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><h2 className="text-lg font-semibold text-dark-900">Dirección de envío</h2></CardHeader>
              <CardContent className="space-y-4">
                <Input label="Dirección" name="address" placeholder="Calle y número" value={formData.address} onChange={handleChange} required />
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Ciudad" name="city" placeholder="Ciudad" value={formData.city} onChange={handleChange} required />
                  <Input label="Estado" name="state" placeholder="Estado" value={formData.state} onChange={handleChange} required />
                  <Input label="Código Postal" name="zipCode" placeholder="CP" value={formData.zipCode} onChange={handleChange} required />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><h2 className="text-lg font-semibold text-dark-900">Pago</h2></CardHeader>
              <CardContent className="space-y-4">
                <Input label="Número de tarjeta" name="cardNumber" placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={handleChange} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Fecha de expiración" name="cardExpiry" placeholder="MM/AA" value={formData.cardExpiry} onChange={handleChange} required />
                  <Input label="CVC" name="cardCvc" placeholder="123" value={formData.cardCvc} onChange={handleChange} required />
                </div>
              </CardContent>
            </Card>
            <Button type="submit" size="lg" className="w-full" variant="neon" isLoading={isLoading}>
              Pagar {formatPrice(getTotal())}
            </Button>
          </form>
        </div>
        <div>
          <Card className="sticky top-24">
            <CardHeader><h2 className="text-lg font-semibold text-dark-900">Resumen del pedido</h2></CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-dark-900/60">{item.name} x{item.quantity}</span>
                  <span className="text-dark-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-cream-300/50 pt-4">
                <div className="flex justify-between">
                  <span className="text-dark-900/60">Subtotal</span>
                  <span className="text-dark-900">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-900/60">Envío</span>
                  <span className="text-neon-green">Gratis</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2">
                  <span className="text-dark-900">Total</span>
                  <span className="text-gradient">{formatPrice(getTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

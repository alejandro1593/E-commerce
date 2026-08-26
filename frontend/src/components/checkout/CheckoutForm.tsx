import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCart } from '../../hooks/useCart';

interface CheckoutFormProps {
  onSubmit: (data: {
    email: string;
    name: string;
    phone: string;
    shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string };
  }) => void;
  isLoading: boolean;
}

export function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const { total } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      shippingAddress: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: 'MX',
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-dark-900">Información de contacto</h2>
        <Input label="Email" name="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre" name="name" placeholder="Tu nombre" value={formData.name} onChange={handleChange} required />
          <Input label="Teléfono" name="phone" placeholder="Tu teléfono" value={formData.phone} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-dark-900">Dirección de envío</h2>
        <Input label="Dirección" name="address" placeholder="Calle y número" value={formData.address} onChange={handleChange} required />
        <div className="grid grid-cols-3 gap-4">
          <Input label="Ciudad" name="city" placeholder="Ciudad" value={formData.city} onChange={handleChange} required />
          <Input label="Estado" name="state" placeholder="Estado" value={formData.state} onChange={handleChange} required />
          <Input label="Código Postal" name="zipCode" placeholder="CP" value={formData.zipCode} onChange={handleChange} required />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" variant="neon" isLoading={isLoading}>
        Pagar {formatPrice(total)}
      </Button>
    </form>
  );
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

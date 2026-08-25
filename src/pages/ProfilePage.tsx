import { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export function ProfilePage() {
  const [formData, setFormData] = useState({ name: 'Juan Pérez', email: 'juan@ejemplo.com', phone: '+52 123 456 7890' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Update profile:', formData);
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-dark-900">Mi Perfil</h1>
      <div className="max-w-2xl">
        <Card>
          <CardHeader><h2 className="text-lg font-semibold text-dark-900">Información personal</h2></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Nombre" name="name" value={formData.name} onChange={handleChange} required />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <Input label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} />
              <Button type="submit" isLoading={isLoading} variant="neon">Guardar cambios</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

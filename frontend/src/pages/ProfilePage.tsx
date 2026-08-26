import { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/client';
import { useUIStore } from '../store/uiStore';

export function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.put('/users/me', { name: formData.name, phone: formData.phone });
      updateUser(response.data.data);
      addToast({ message: 'Perfil actualizado', type: 'success' });
    } catch (error: any) {
      addToast({ message: error.response?.data?.message || 'Error al actualizar', type: 'error' });
    } finally {
      setIsLoading(false);
    }
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
              <Input label="Email" name="email" type="email" value={formData.email} disabled />
              <Input label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} />
              <Button type="submit" isLoading={isLoading} variant="neon">Guardar cambios</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

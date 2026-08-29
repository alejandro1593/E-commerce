import { useState, useEffect } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { usersApi } from '../api/users.api';
import { useUIStore } from '../store/uiStore';
import { Address } from '../types';

type Tab = 'info' | 'password' | 'addresses';

export function ProfilePage() {
  const [tab, setTab] = useState<Tab>('info');

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-dark-900">Mi Perfil</h1>
      <div className="flex gap-2 mb-8 border-b border-cream-300/60 overflow-x-auto">
        {([
          ['info', 'Información personal'],
          ['password', 'Cambiar contraseña'],
          ['addresses', 'Mis direcciones'],
        ] as [Tab, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === value
                ? 'text-neon-cyan border-neon-cyan'
                : 'text-dark-900/50 border-transparent hover:text-dark-900/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">
        {tab === 'info' && <InfoTab />}
        {tab === 'password' && <PasswordTab />}
        {tab === 'addresses' && <AddressesTab />}
      </div>
    </div>
  );
}

function InfoTab() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
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
      const updated = await usersApi.updateProfile({ name: formData.name, phone: formData.phone });
      updateUser(updated);
      addToast({ message: 'Perfil actualizado', type: 'success' });
    } catch (error: any) {
      addToast({ message: error.response?.data?.message || 'Error al actualizar', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader><h2 className="text-lg font-semibold text-dark-900">Información personal</h2></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Nombre" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" name="email" type="email" value={formData.email} disabled />
          <Input label="Teléfono" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <Button type="submit" isLoading={isLoading} variant="neon">Guardar cambios</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordTab() {
  const addToast = useUIStore((s) => s.addToast);
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      addToast({ message: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }
    setIsLoading(true);
    try {
      await usersApi.changePassword(formData.currentPassword, formData.newPassword);
      addToast({ message: 'Contraseña actualizada', type: 'success' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      addToast({ message: error.response?.data?.message || 'Error al cambiar contraseña', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader><h2 className="text-lg font-semibold text-dark-900">Cambiar contraseña</h2></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Contraseña actual" name="currentPassword" type="password" placeholder="••••••••" value={formData.currentPassword} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} required />
          <Input label="Nueva contraseña" name="newPassword" type="password" placeholder="••••••••" value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} required />
          <Input label="Confirmar nueva contraseña" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
          <Button type="submit" isLoading={isLoading} variant="neon">Cambiar contraseña</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AddressesTab() {
  const addToast = useUIStore((s) => s.addToast);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ street: '', city: '', state: '', zipCode: '', isDefault: false });

  const loadAddresses = async () => {
    try {
      const data = await usersApi.getAddresses();
      setAddresses(data);
    } catch (error: any) {
      addToast({ message: error.response?.data?.message || 'Error al cargar direcciones', type: 'error' });
    }
  };

  useEffect(() => { loadAddresses(); }, []);

  const resetForm = () => {
    setFormData({ street: '', city: '', state: '', zipCode: '', isDefault: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        await usersApi.updateAddress(editingId, { ...formData });
      } else {
        await usersApi.createAddress({ ...formData });
      }
      resetForm();
      await loadAddresses();
      addToast({ message: editingId ? 'Dirección actualizada' : 'Dirección agregada', type: 'success' });
    } catch (error: any) {
      addToast({ message: error.response?.data?.message || 'Error al guardar dirección', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (addr: Address) => {
    setFormData({ street: addr.street, city: addr.city, state: addr.state, zipCode: addr.zipCode, isDefault: addr.isDefault });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (addr: Address) => {
    try {
      await usersApi.deleteAddress(addr.id);
      await loadAddresses();
      addToast({ message: 'Dirección eliminada', type: 'success' });
    } catch (error: any) {
      addToast({ message: error.response?.data?.message || 'Error al eliminar', type: 'error' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dark-900">Mis direcciones</h2>
          <Button variant="neon" size="sm" onClick={() => (showForm && editingId ? resetForm() : setShowForm(!showForm))}>
            {showForm ? 'Cancelar' : 'Agregar dirección'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 border-b border-cream-300/60 pb-6">
            <h3 className="font-medium text-dark-900">{editingId ? 'Editar dirección' : 'Nueva dirección'}</h3>
            <Input label="Dirección" name="street" placeholder="Calle y número" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} required />
            <div className="grid grid-cols-3 gap-4">
              <Input label="Ciudad" name="city" placeholder="Ciudad" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
              <Input label="Estado" name="state" placeholder="Estado" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required />
              <Input label="Código Postal" name="zipCode" placeholder="CP" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} required />
            </div>
            <label className="flex items-center gap-2 text-sm text-dark-900/70">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded border-cream-300"
              />
              Usar como dirección predeterminada
            </label>
            <Button type="submit" isLoading={isLoading}>{editingId ? 'Guardar cambios' : 'Guardar dirección'}</Button>
          </form>
        )}

        {addresses.length === 0 && !showForm ? (
          <p className="text-dark-900/50 py-4">Aún no tienes direcciones guardadas.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="border border-cream-300/60 rounded-xl p-4 flex items-start justify-between">
                <div>
                  <p className="font-medium text-dark-900">{addr.street}</p>
                  <p className="text-sm text-dark-900/60">
                    {addr.zipCode}, {addr.city}, {addr.state} — {addr.country}
                  </p>
                  {addr.isDefault && (
                    <span className="inline-block mt-1 text-xs text-neon-cyan font-medium">Predeterminada</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(addr)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(addr)} className="text-red-500">
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

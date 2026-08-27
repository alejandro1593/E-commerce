import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { authApi } from '../api/auth.api';
import { useUIStore } from '../store/uiStore';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const addToast = useUIStore((s) => s.addToast);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast({ message: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }
    setIsLoading(true);
    try {
      await authApi.resetPassword(token, password, confirmPassword);
      addToast({ message: 'Contraseña restablecida. Inicia sesión.', type: 'success' });
      navigate('/login');
    } catch (error: any) {
      addToast({ message: error.response?.data?.message || 'Error al restablecer contraseña', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
      </div>
      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-neon rounded-2xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-3xl">E</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-dark-900">Nueva contraseña</h2>
          <p className="text-center text-dark-900/60 mt-2">Ingresa tu nueva contraseña</p>
        </CardHeader>
        <CardContent>
          {!token ? (
            <p className="text-center text-dark-900/70">Enlace inválido o expirado.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Nueva contraseña" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Input label="Confirmar contraseña" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <Button type="submit" className="w-full" variant="neon" isLoading={isLoading}>Restablecer contraseña</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

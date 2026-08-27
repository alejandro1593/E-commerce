import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { authApi } from '../api/auth.api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
      </div>
      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-neon rounded-2xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-3xl">E</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-dark-900">Recuperar contraseña</h2>
          <p className="text-center text-dark-900/60 mt-2">
            {sent ? 'Revisa tu correo' : 'Te enviaremos un enlace para restablecer tu contraseña'}
          </p>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-dark-900/70">
                Si existe una cuenta con ese correo, hemos enviado un enlace para restablecer tu contraseña.
              </p>
              <Link to="/login" className="inline-block text-neon-cyan hover:text-neon-cyan/80 font-medium">
                Volver a iniciar sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Button type="submit" className="w-full" variant="neon" isLoading={isLoading}>Enviar enlace</Button>
              <div className="text-center">
                <Link to="/login" className="text-neon-cyan hover:text-neon-cyan/80 text-sm font-medium">
                  ← Volver a iniciar sesión
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

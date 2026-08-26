import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login, isLoginLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
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
          <h2 className="text-2xl font-bold text-center text-dark-900">Iniciar Sesión</h2>
          <p className="text-center text-dark-900/60 mt-2">Ingresa a tu cuenta para continuar</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Contraseña" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full" variant="neon" isLoading={isLoginLoading}>Iniciar Sesión</Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-dark-900/60">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors duration-300">Regístrate</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

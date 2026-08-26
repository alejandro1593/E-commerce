import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

export function RegisterPage() {
  const { register, isRegisterLoading } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    register(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <h2 className="text-2xl font-bold text-center text-dark-900">Crear Cuenta</h2>
          <p className="text-center text-dark-900/60 mt-2">Regístrate para empezar a comprar</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Nombre completo" name="name" placeholder="Tu nombre" value={formData.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} required />
            <Input label="Contraseña" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            <Input label="Confirmar contraseña" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
            <Button type="submit" className="w-full" variant="neon" isLoading={isRegisterLoading}>Crear Cuenta</Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-dark-900/60">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors duration-300">Inicia sesión</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

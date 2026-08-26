import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export function OrderSuccessPage() {
  const location = useLocation();
  const orderId = (location.state as any)?.orderId || 'N/A';

  return (
    <div className="container py-12">
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <div className="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-neon-green" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3 text-dark-900">¡Pedido Realizado!</h1>
          <p className="text-dark-900/60 mb-6">Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación en breve.</p>
          <p className="text-sm text-dark-900/50 mb-8">
            Número de orden: <span className="font-mono font-medium text-neon-cyan">{orderId}</span>
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/mis-ordenes"><Button className="w-full" variant="neon">Ver mis órdenes</Button></Link>
            <Link to="/productos"><Button variant="outline" className="w-full">Seguir comprando</Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

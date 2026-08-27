import { Button } from '../ui/Button';
import { useUIStore } from '../../store/uiStore';

interface StripePaymentFormProps {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  onSubmit: (paymentIntentId: string) => void;
  isSubmitting: boolean;
}

export function StripePaymentForm({ clientSecret: _clientSecret, paymentIntentId, amount, onSubmit, isSubmitting }: StripePaymentFormProps) {
  const addToast = useUIStore((s) => s.addToast);
  const isTestMode = paymentIntentId.startsWith('pi_mock_');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isTestMode) {
      addToast({
        message: 'El pago con tarjeta real requiere configurar tus llaves Stripe. La orden quedó pendiente.',
        type: 'warning',
      });
      return;
    }

    onSubmit(paymentIntentId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-dark-900 mb-4">Confirmar pago</h2>

        {isTestMode ? (
          <div className="border border-neon-cyan/30 bg-neon-cyan/5 rounded-xl p-4 mb-4">
            <p className="text-sm text-dark-900/70 mb-2">
              <span className="font-semibold text-neon-cyan">Modo de prueba</span> — Stripe no está
              configurado con llaves reales. El pago se simulará localmente.
            </p>
            <p className="text-xs text-dark-900/50">
              Para activar pagos con tarjeta real, agrega tus llaves de
              <span className="font-medium"> dashboard.stripe.com</span> en <span className="font-mono">backend/.env</span>.
            </p>
          </div>
        ) : (
          <p className="text-sm text-dark-900/70 mb-4">Conectando con la pasarela de pago...</p>
        )}

        <p className="text-xs text-dark-900/50 mt-2">
          Al confirmar se completará tu orden por{' '}
          <span className="font-medium text-dark-900">
            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)}
          </span>.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" variant="neon" isLoading={isSubmitting}>
        {isSubmitting ? 'Procesando...' : isTestMode ? 'Confirmar pago (modo prueba)' : 'Procesar pago'}
      </Button>
    </form>
  );
}

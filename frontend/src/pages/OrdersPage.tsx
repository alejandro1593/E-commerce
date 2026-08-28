import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Loading } from '../components/ui/Loading';
import { ordersApi } from '../api/orders.api';
import { useUIStore } from '../store/uiStore';
import { formatPrice, formatDateTime } from '../lib/utils';
import { ORDER_STATUS_LABELS } from '../lib/constants';
import { Order } from '../types';

const STATUS_VARIANT: Record<string, string> = {
  PENDING: 'warning',
  CONFIRMED: 'primary',
  PROCESSING: 'primary',
  SHIPPED: 'neon',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

const CANCELLABLE: Record<string, boolean> = {
  PENDING: true,
  CONFIRMED: true,
};

export function OrdersPage() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.list(),
  });

  const cancelMutation = useMutation({
    mutationFn: ordersApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      addToast({ message: 'Orden cancelada correctamente', type: 'success' });
    },
    onError: (error: any) => {
      addToast({ message: error.response?.data?.message || 'No se pudo cancelar la orden', type: 'error' });
    },
  });

  const orders = data?.data || [];

  if (isLoading) return <Loading message="Cargando órdenes..." />;

  if (isError) {
    return (
      <div className="container py-8">
        <ErrorState message="No pudimos cargar tus órdenes." />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-12">
        <EmptyState
          icon={<svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>}
          title="No tienes órdenes"
          description="Cuando realices una compra, aparecerá aquí"
          action={{ label: 'Ver Productos', onClick: () => window.location.href = '/productos' }}
        />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-dark-900">Mis Órdenes</h1>
      <div className="space-y-4">
        {orders.map((order: Order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <p className="font-mono text-sm text-dark-900/50">{order.id}</p>
                <p className="text-sm text-dark-900/50">{formatDateTime(order.createdAt)}</p>
              </div>
              <Badge variant={(STATUS_VARIANT[order.status] || 'primary') as any}>
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-dark-900/60">{item.product?.name || 'Producto'} x{item.quantity}</span>
                    <span className="text-dark-900">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-cream-300/50">
                <span className="font-semibold text-lg text-dark-900">Total: <span className="text-gradient">{formatPrice(order.total)}</span></span>
                {CANCELLABLE[order.status] && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={cancelMutation.isPending}
                    onClick={() => {
                      if (confirm('¿Estás seguro de que quieres cancelar esta orden?')) {
                        cancelMutation.mutate(order.id);
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

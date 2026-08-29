import { useState } from 'react';
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

const FLOW_STATES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export function OrdersPage() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, Order>>({});

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

  const toggleExpand = async (order: Order) => {
    if (expandedId === order.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(order.id);
    if (!details[order.id]) {
      try {
        const detail = await ordersApi.getById(order.id);
        setDetails((prev) => ({ ...prev, [order.id]: detail }));
      } catch (error: any) {
        addToast({ message: error.response?.data?.message || 'No se pudo cargar el detalle', type: 'error' });
      }
    }
  };

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
        {orders.map((order: Order) => {
          const detail = details[order.id] || order;
          const isExpanded = expandedId === order.id;
          const isCancelled = order.status === 'CANCELLED';
          const currentStep = isCancelled ? -1 : FLOW_STATES.indexOf(order.status);

          return (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-dark-900/50">{order.id}</p>
                  <p className="text-sm text-dark-900/50">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={(STATUS_VARIANT[order.status] || 'primary') as any}>
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => toggleExpand(order)}>
                    {isExpanded ? 'Ocultar' : 'Ver detalle'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-dark-900/60">
                        {item.variant?.name || item.product?.name || 'Producto'} x{item.quantity}
                      </span>
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

                {isExpanded && (
                  <div className="mt-6 space-y-6 border-t border-cream-300/40 pt-6">
                    <div>
                      <h3 className="text-sm font-semibold text-dark-900/70 mb-3">Seguimiento del envío</h3>
                      {isCancelled ? (
                        <div className="flex items-center gap-2 text-red-500">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          <span className="font-medium">Esta orden fue cancelada</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {FLOW_STATES.map((state, i) => {
                            const active = i <= currentStep;
                            return (
                              <div key={state} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${active ? 'bg-neon-cyan text-white' : 'bg-cream-200 text-dark-900/40'}`}>
                                    {i + 1}
                                  </div>
                                  <span className={`mt-1 text-xs whitespace-nowrap ${i === currentStep ? 'text-neon-cyan font-medium' : 'text-dark-900/50'}`}>
                                    {ORDER_STATUS_LABELS[state]}
                                  </span>
                                </div>
                                {i < FLOW_STATES.length - 1 && (
                                  <div className={`flex-1 h-0.5 mx-2 mb-5 ${i < currentStep ? 'bg-neon-cyan' : 'bg-cream-200'}`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold text-dark-900/70 mb-2">Dirección de envío</h3>
                        <p className="text-dark-900/70 text-sm">
                          {detail.shippingAddress.street}, {detail.shippingAddress.city}, {detail.shippingAddress.state} — {detail.shippingAddress.zipCode}<br />
                          {detail.shippingAddress.country}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-dark-900/70 mb-2">Resumen de pago</h3>
                        <div className="text-sm text-dark-900/70 space-y-1">
                          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(detail.subtotal)}</span></div>
                          <div className="flex justify-between"><span>Impuesto</span><span>{formatPrice(detail.tax)}</span></div>
                          {detail.discount > 0 && (
                            <div className="flex justify-between text-neon-cyan"><span>Descuento</span><span>-{formatPrice(detail.discount)}</span></div>
                          )}
                          <div className="flex justify-between font-semibold text-dark-900 pt-1 border-t border-cream-300/40"><span>Total</span><span>{formatPrice(detail.total)}</span></div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

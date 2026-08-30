import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { useUIStore } from '../../store/uiStore';
import { downloadCsv } from '../../lib/csv';
import { formatPrice, formatDateTime, truncate } from '../../lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS } from '../../lib/constants';

const STATUS_VARIANT: Record<string, string> = {
  PENDING: 'warning',
  CONFIRMED: 'primary',
  PROCESSING: 'primary',
  SHIPPED: 'neon',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

const ALL_STATUSES = Object.values(ORDER_STATUS);

export function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      await downloadCsv('orders');
      addToast({ message: 'Órdenes exportadas', type: 'success' });
    } catch (error: any) {
      addToast({ message: error?.message || 'Error al exportar', type: 'error' });
    } finally {
      setExporting(false);
    }
  };
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page],
    queryFn: () => adminApi.listOrders({ page, limit: 10 }),
  });

  const allOrders = data?.data || [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      addToast({ message: 'Estado actualizado', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err: any) => {
      addToast({ message: err.response?.data?.message || 'Error al actualizar', type: 'error' });
    },
  });

  const orders = filter ? allOrders.filter((o) => o.status === filter) : allOrders;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Órdenes</h1>
          <p className="text-dark-900/60">Administra todas las órdenes de la tienda</p>
        </div>
        <Button size="sm" variant="secondary" onClick={handleExport} isLoading={exporting}>
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Exportar CSV
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant={filter === '' ? 'primary' : 'secondary'} onClick={() => setFilter('')}>
          Todas
        </Button>
        {ALL_STATUSES.map((s) => (
          <Button key={s} size="sm" variant={filter === s ? 'primary' : 'secondary'} onClick={() => setFilter(s)}>
            {ORDER_STATUS_LABELS[s]}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="px-0">
          {isLoading ? (
            <Loading message="Cargando órdenes..." />
          ) : orders.length === 0 ? (
            <EmptyState title="Sin órdenes" description="No hay órdenes para mostrar" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-dark-900/50 border-b border-cream-300/50">
                    <th className="px-6 py-3 font-medium">#</th>
                    <th className="px-6 py-3 font-medium">Cliente</th>
                    <th className="px-6 py-3 font-medium">Fecha</th>
                    <th className="px-6 py-3 font-medium">Total</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium text-right">Cambiar estado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-cream-300/30 hover:bg-cream-100/50">
                      <td className="px-6 py-3 font-medium text-dark-900">#{o.id.slice(0, 8)}</td>
                      <td className="px-6 py-3">
                        <p className="font-medium text-dark-900">{o.user.name}</p>
                        <p className="text-dark-900/50 text-xs truncate">{truncate(o.user.email, 28)}</p>
                      </td>
                      <td className="px-6 py-3 text-dark-900/70">{formatDateTime(o.createdAt)}</td>
                      <td className="px-6 py-3 font-semibold text-dark-900">{formatPrice(o.total)}</td>
                      <td className="px-6 py-3">
                        <Badge variant={STATUS_VARIANT[o.status] as any}>
                          {ORDER_STATUS_LABELS[o.status] || o.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => statusMutation.mutate({ id: o.id, status: e.target.value })}
                          className="w-40 px-3 py-2 bg-white border border-cream-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <span className="text-sm text-dark-900/60">
            Página {page} de {data.pagination.totalPages}
          </span>
          <Button size="sm" variant="outline" disabled={!data.pagination.hasNext} onClick={() => setPage((p) => p + 1)}>
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}

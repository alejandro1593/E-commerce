import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { formatPrice, formatDateTime } from '../../lib/utils';
import { ORDER_STATUS_LABELS } from '../../lib/constants';

const STATUS_VARIANT: Record<string, string> = {
  PENDING: 'warning',
  CONFIRMED: 'primary',
  PROCESSING: 'primary',
  SHIPPED: 'neon',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  CONFIRMED: 'bg-neon-cyan',
  PROCESSING: 'bg-neon-cyan',
  SHIPPED: 'bg-neon-purple',
  DELIVERED: 'bg-neon-green',
  CANCELLED: 'bg-red-500',
};

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard(),
  });

  if (isLoading) return <Loading message="Cargando estadísticas..." />;
  if (!stats) return null;

  const statCards = [
    { label: 'Usuarios', value: stats.totalUsers, icon: '👥', color: 'from-neon-cyan/20 to-transparent' },
    { label: 'Productos', value: stats.totalProducts, icon: '🛍️', color: 'from-neon-purple/20 to-transparent' },
    { label: 'Órdenes totales', value: stats.totalOrders, icon: '📦', color: 'from-neon-magenta/20 to-transparent' },
    { label: 'Órdenes del mes', value: stats.monthlyOrders, icon: '📅', color: 'from-neon-green/20 to-transparent' },
  ];

  const maxCount = Math.max(1, ...stats.ordersByStatus.map((s) => s.count));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Dashboard</h1>
        <p className="text-dark-900/60">Resumen general de la tienda</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} pointer-events-none`} />
            <CardContent className="relative">
              <div className="text-2xl mb-2">{card.icon}</div>
              <p className="text-3xl font-bold text-dark-900">{card.value}</p>
              <p className="text-sm text-dark-900/60 mt-1">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-dark-900">Ingresos</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-dark-900/60">Este mes</p>
                <p className="text-2xl font-bold text-neon-green">
                  {formatPrice(stats.monthlyRevenue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-dark-900/60">Este año</p>
                <p className="text-2xl font-bold text-neon-cyan">
                  {formatPrice(stats.yearlyRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-dark-900">Órdenes por estado</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.ordersByStatus.length === 0 && (
                <p className="text-dark-900/60 text-sm">Sin órdenes</p>
              )}
              {stats.ordersByStatus.map((s) => (
                <div key={s.status} className="flex items-center gap-3">
                  <span className="w-32 text-sm text-dark-900/70">
                    {ORDER_STATUS_LABELS[s.status] || s.status}
                  </span>
                  <div className="flex-1 h-2.5 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${STATUS_COLORS[s.status] || 'bg-cream-300'} rounded-full`}
                      style={{ width: `${(s.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-dark-900 w-6 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-dark-900">Top productos</h2>
          </CardHeader>
          <CardContent>
            {stats.topProducts.length === 0 ? (
              <p className="text-dark-900/60 text-sm">Sin ventas todavía</p>
            ) : (
              <div className="space-y-3">
                {stats.topProducts.map((p, i) => (
                  <div key={p.productId} className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cream-200 text-xs font-semibold text-dark-900/60 shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-900 truncate">{p.name}</p>
                    </div>
                    <span className="text-sm font-semibold text-dark-900">{p.quantity} vendidos</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-dark-900">Stock bajo</h2>
          </CardHeader>
          <CardContent>
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-dark-900/60 text-sm">Todo el inventario está bien</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-900 truncate">{p.name}</p>
                      <p className="text-xs text-dark-900/50">{p.sku}</p>
                    </div>
                    <Badge variant={p.stock === 0 ? 'danger' : 'warning'}>
                      {p.stock === 0 ? 'Sin stock' : `${p.stock} uds.`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-dark-900">Ventas por día (últimos 14 días)</h2>
        </CardHeader>
        <CardContent>
          {stats.salesPerDay.length === 0 ? (
            <p className="text-dark-900/60 text-sm">Sin ventas en los últimos 14 días</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {stats.salesPerDay.map((s) => {
                const maxRevenue = Math.max(1, ...stats.salesPerDay.map((d) => d.revenue));
                const height = `${Math.max(6, (s.revenue / maxRevenue) * 100)}%`;
                return (
                  <div key={s.day} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <span className="text-[10px] text-dark-900/50 truncate w-full text-center" title={formatPrice(s.revenue)}>
                      {formatPrice(s.revenue)}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-neon-cyan/40 to-neon-cyan rounded-t-lg"
                      style={{ height }}
                      title={`${s.day}: ${formatPrice(s.revenue)} (${s.orders} órdenes)`}
                    />
                    <span className="text-[10px] text-dark-900/40">
                      {new Date(s.day + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-semibold text-dark-900">Órdenes recientes</h2>
          <Link to="/admin/ordenes" className="text-sm text-neon-cyan hover:text-neon-cyan/80 font-medium">
            Ver todas
          </Link>
        </CardHeader>
        <CardContent className="px-0">
          {stats.recentOrders.length === 0 ? (
            <p className="text-dark-900/60 text-sm px-6 py-4">Sin órdenes recientes</p>
          ) : (
            <ul className="divide-y divide-cream-300/50">
              {stats.recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-4 px-6 py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-dark-900 truncate text-sm">
                      {order.user.name}
                    </p>
                    <p className="text-dark-900/50 text-xs">
                      {formatDateTime(order.createdAt)} · #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={STATUS_VARIANT[order.status] as any}>
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </Badge>
                    <span className="font-semibold text-dark-900">{formatPrice(order.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { useUIStore } from '../../store/uiStore';
import { formatDate } from '../../lib/utils';

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => adminApi.listUsers({ page, limit: 10 }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updateUserStatus(id, isActive),
    onSuccess: () => {
      addToast({ message: 'Usuario actualizado', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: any) => {
      addToast({ message: err.response?.data?.message || 'Error al actualizar', type: 'error' });
    },
  });

  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Usuarios</h1>
        <p className="text-dark-900/60">Administra las cuentas de los usuarios</p>
      </div>

      <Card>
        <CardContent className="px-0">
          {isLoading ? (
            <Loading message="Cargando usuarios..." />
          ) : users.length === 0 ? (
            <EmptyState title="Sin usuarios" description="No hay usuarios registrados" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-dark-900/50 border-b border-cream-300/50">
                    <th className="px-6 py-3 font-medium">Usuario</th>
                    <th className="px-6 py-3 font-medium">Rol</th>
                    <th className="px-6 py-3 font-medium">Órdenes</th>
                    <th className="px-6 py-3 font-medium">Registro</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-cream-300/30 hover:bg-cream-100/50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 bg-gradient-neon rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-dark-900">{u.name}</p>
                            <p className="text-dark-900/50 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant={u.role === 'ADMIN' ? 'neon' : 'default'}>{u.role}</Badge>
                      </td>
                      <td className="px-6 py-3 text-dark-900/70">{u._count?.orders ?? 0}</td>
                      <td className="px-6 py-3 text-dark-900/70">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-3">
                        <Badge variant={u.isActive ? 'success' : 'danger'}>
                          {u.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Button
                          size="sm"
                          variant={u.isActive ? 'danger' : 'outline'}
                          disabled={u.role === 'ADMIN'}
                          onClick={() => statusMutation.mutate({ id: u.id, isActive: !u.isActive })}
                        >
                          {u.isActive ? 'Desactivar' : 'Activar'}
                        </Button>
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

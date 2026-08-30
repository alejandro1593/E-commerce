import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { useUIStore } from '../../store/uiStore';
import { downloadCsv } from '../../lib/csv';
import { formatDate } from '../../lib/utils';
import { AdminUser } from '../../api/admin.api';

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      await downloadCsv('users');
      addToast({ message: 'Usuarios exportados', type: 'success' });
    } catch (error: any) {
      addToast({ message: error?.message || 'Error al exportar', type: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'USER' as 'USER' | 'ADMIN',
    isActive: true,
  });

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

  const openEdit = (user: AdminUser) => {
    setEditing(user);
    setForm({ name: user.name, email: user.email, role: user.role, isActive: user.isActive });
    setIsModalOpen(true);
  };

  const editMutation = useMutation({
    mutationFn: () =>
      adminApi.updateUser(editing!.id, {
        name: form.name,
        email: form.email,
        role: form.role,
        isActive: form.isActive,
      }),
    onSuccess: () => {
      addToast({ message: 'Usuario modificado correctamente', type: 'success' });
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: any) => {
      addToast({ message: err.response?.data?.message || 'Error al modificar usuario', type: 'error' });
    },
  });

  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Usuarios</h1>
          <p className="text-dark-900/60">Administra las cuentas de los usuarios registrados</p>
        </div>
        <Button size="sm" variant="secondary" onClick={handleExport} isLoading={exporting}>
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Exportar CSV
        </Button>
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
                      <td className="px-6 py-3">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant={u.isActive ? 'danger' : 'outline'}
                            disabled={u.role === 'ADMIN'}
                            onClick={() => statusMutation.mutate({ id: u.id, isActive: !u.isActive })}
                          >
                            {u.isActive ? 'Desactivar' : 'Activar'}
                          </Button>
                        </div>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Editar usuario — ${editing?.name || ''}`}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Select
            label="Rol"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'USER' | 'ADMIN' }))}
            options={[
              { value: 'USER', label: 'Usuario' },
              { value: 'ADMIN', label: 'Administrador' },
            ]}
          />
          <div className="flex items-center gap-3">
            <input
              id="user-active"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 text-neon-cyan"
            />
            <label htmlFor="user-active" className="text-sm text-dark-900/70">Usuario activo</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button
              variant="neon"
              isLoading={editMutation.isPending}
              disabled={!form.name || !form.email}
              onClick={() => editMutation.mutate()}
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

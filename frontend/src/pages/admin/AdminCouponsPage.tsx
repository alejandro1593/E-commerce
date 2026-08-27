import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { useUIStore } from '../../store/uiStore';
import { formatPrice, formatDate } from '../../lib/utils';
import { Coupon } from '../../types';

const EMPTY_FORM = {
  code: '',
  discountType: 'PERCENTAGE',
  discountValue: '',
  minPurchase: '0',
  maxUses: '',
  expiresAt: '',
  isActive: true,
};

export function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => adminApi.listCoupons(),
  });

  const set = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minPurchase: String(coupon.minPurchase ?? 0),
      maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
      isActive: coupon.isActive,
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload: Record<string, unknown> = {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minPurchase: Number(form.minPurchase) || 0,
        isActive: form.isActive,
      };
      if (form.maxUses) payload.maxUses = Number(form.maxUses);
      if (form.expiresAt) payload.expiresAt = new Date(form.expiresAt).toISOString();

      return editing ? adminApi.updateCoupon(editing.id, payload) : adminApi.createCoupon(payload);
    },
    onSuccess: () => {
      addToast({ message: editing ? 'Cupón actualizado' : 'Cupón creado', type: 'success' });
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
    },
    onError: (err: any) => {
      addToast({ message: err.response?.data?.message || 'Error al guardar cupón', type: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteCoupon(id),
    onSuccess: () => {
      addToast({ message: 'Cupón eliminado', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
    },
    onError: (err: any) => {
      addToast({ message: err.response?.data?.message || 'Error al eliminar', type: 'error' });
    },
  });

  const coupons = data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Cupones</h1>
          <p className="text-dark-900/60">Crea códigos de descuento</p>
        </div>
        <Button variant="neon" onClick={openCreate}>+ Nuevo cupón</Button>
      </div>

      <Card>
        <CardContent className="px-0">
          {isLoading ? (
            <Loading message="Cargando cupones..." />
          ) : coupons.length === 0 ? (
            <EmptyState title="Sin cupones" description="Crea tu primer cupón de descuento" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-dark-900/50 border-b border-cream-300/50">
                    <th className="px-6 py-3 font-medium">Código</th>
                    <th className="px-6 py-3 font-medium">Descuento</th>
                    <th className="px-6 py-3 font-medium">Min. compra</th>
                    <th className="px-6 py-3 font-medium">Usos</th>
                    <th className="px-6 py-3 font-medium">Vence</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id} className="border-b border-cream-300/30 hover:bg-cream-100/50">
                      <td className="px-6 py-3 font-mono font-semibold text-dark-900">{c.code}</td>
                      <td className="px-6 py-3 font-medium text-dark-900">
                        {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : formatPrice(c.discountValue)}
                      </td>
                      <td className="px-6 py-3 text-dark-900/70">{formatPrice(c.minPurchase ?? 0)}</td>
                      <td className="px-6 py-3 text-dark-900/70">
                        {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}
                      </td>
                      <td className="px-6 py-3 text-dark-900/70">{c.expiresAt ? formatDate(c.expiresAt) : '—'}</td>
                      <td className="px-6 py-3">
                        <Badge variant={c.isActive ? 'success' : 'danger'}>
                          {c.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => openEdit(c)}>Editar</Button>
                          <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(c.id)}>Eliminar</Button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Editar cupón' : 'Nuevo cupón'}>
        <div className="space-y-4">
          <Input label="Código" value={form.code} onChange={set('code')} placeholder="DESCUENTO10" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-900/70 mb-1">Tipo</label>
              <select
                value={form.discountType}
                onChange={set('discountType')}
                className="w-full px-4 py-3 bg-white/80 border border-cream-300 rounded-xl text-dark-900 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              >
                <option value="PERCENTAGE">Porcentaje</option>
                <option value="FIXED">Cantidad fija</option>
              </select>
            </div>
            <Input
              label={form.discountType === 'PERCENTAGE' ? 'Valor (%)' : 'Valor (MXN)'}
              type="number"
              value={form.discountValue}
              onChange={set('discountValue')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Compra mínima" type="number" value={form.minPurchase} onChange={set('minPurchase')} />
            <Input label="Usos máximos" type="number" value={form.maxUses} onChange={set('maxUses')} />
          </div>
          <Input label="Fecha de expiración" type="date" value={form.expiresAt} onChange={set('expiresAt')} />
          <div className="flex items-center gap-3">
            <input
              id="couponActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 text-neon-cyan"
            />
            <label htmlFor="couponActive" className="text-sm text-dark-900/70">Cupón activo</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="neon" isLoading={saveMutation.isPending} disabled={!form.code || !form.discountValue} onClick={() => saveMutation.mutate()}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

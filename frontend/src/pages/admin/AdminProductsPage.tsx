import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import { categoriesApi } from '../../api/products.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { useUIStore } from '../../store/uiStore';
import { formatPrice } from '../../lib/utils';
import { Product, Variant } from '../../types';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  sku: '',
  stock: '',
  categoryId: '',
  isActive: true,
  imageUrl: '',
  variantName: '',
  variantPrice: '',
  variantStock: '',
};

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => adminApi.listProducts({ page, limit: 10, search: search || undefined }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  });

  const set = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      sku: product.sku,
      stock: String(product.stock),
      categoryId: product.categoryId,
      isActive: product.isActive,
      imageUrl: product.images?.[0]?.url || '',
      variantName: '',
      variantPrice: '',
      variantStock: '',
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload: Record<string, unknown> = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        sku: form.sku,
        stock: Number(form.stock),
        categoryId: form.categoryId,
        isActive: form.isActive,
      };

      const images = form.imageUrl ? [{ url: form.imageUrl, sortOrder: 0 }] : [];
      if (images.length) payload.images = images;

      const variants: Omit<Variant, 'id'>[] = [];
      if (editing) {
        // keep existing variants on edit
      } else if (form.variantName && form.variantPrice) {
        variants.push({
          name: form.variantName,
          sku: `${form.sku}-1`,
          price: Number(form.variantPrice),
          stock: Number(form.variantStock) || 0,
          options: {},
        });
      }
      if (variants.length) payload.variants = variants;

      return editing ? adminApi.updateProduct(editing.id, payload) : adminApi.createProduct(payload);
    },
    onSuccess: () => {
      addToast({ message: editing ? 'Producto actualizado' : 'Producto creado', type: 'success' });
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err: any) => {
      addToast({ message: err.response?.data?.message || 'Error al guardar producto', type: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      addToast({ message: 'Producto eliminado', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err: any) => {
      addToast({ message: err.response?.data?.message || 'Error al eliminar', type: 'error' });
    },
  });

  const products = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Productos</h1>
          <p className="text-dark-900/60">Administra el catálogo de productos</p>
        </div>
        <Button variant="neon" onClick={openCreate}>+ Nuevo producto</Button>
      </div>

      <Input
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      <Card>
        <CardContent className="px-0">
          {isLoading ? (
            <Loading message="Cargando productos..." />
          ) : products.length === 0 ? (
            <EmptyState title="Sin productos" description="Crea tu primer producto" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-dark-900/50 border-b border-cream-300/50">
                    <th className="px-6 py-3 font-medium">Producto</th>
                    <th className="px-6 py-3 font-medium">Precio</th>
                    <th className="px-6 py-3 font-medium">Stock</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-cream-300/30 hover:bg-cream-100/50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {p.images?.[0] && (
                            <img src={p.images[0].url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-dark-900 truncate">{p.name}</p>
                            <p className="text-dark-900/50 text-xs">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-dark-900">{formatPrice(p.price)}</td>
                      <td className="px-6 py-3 text-dark-900/70">{p.stock}</td>
                      <td className="px-6 py-3">
                        <Badge variant={p.isActive ? 'success' : 'danger'}>
                          {p.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Editar</Button>
                          <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(p.id)}>Eliminar</Button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Editar producto' : 'Nuevo producto'} size="lg">
        <div className="space-y-4">
          <Input label="Nombre" value={form.name} onChange={set('name')} />
          <div>
            <label className="block text-sm font-medium text-dark-900/70 mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={3}
              className="w-full px-4 py-3 bg-white/80 border border-cream-300 rounded-xl text-dark-900 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio (MXN)" type="number" value={form.price} onChange={set('price')} />
            <Input label="Stock" type="number" value={form.stock} onChange={set('stock')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="SKU" value={form.sku} onChange={set('sku')} />
            <div>
              <label className="block text-sm font-medium text-dark-900/70 mb-1">Categoría</label>
              <select
                value={form.categoryId}
                onChange={set('categoryId')}
                className="w-full px-4 py-3 bg-white/80 border border-cream-300 rounded-xl text-dark-900 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              >
                <option value="">Seleccionar...</option>
                {(categories || []).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <Input label="URL de imagen" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Vista previa" className="h-24 w-24 object-cover rounded-lg" />
          )}

          {!editing && (
            <div className="bg-cream-100/60 rounded-xl p-4 space-y-3 border border-cream-300/50">
              <p className="text-sm font-medium text-dark-900/70">Variante (opcional)</p>
              <div className="grid grid-cols-3 gap-3">
                <Input placeholder="Nombre (ej: Rojo)" value={form.variantName} onChange={set('variantName')} />
                <Input type="number" placeholder="Precio" value={form.variantPrice} onChange={set('variantPrice')} />
                <Input type="number" placeholder="Stock" value={form.variantStock} onChange={set('variantStock')} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 text-neon-cyan"
            />
            <label htmlFor="isActive" className="text-sm text-dark-900/70">Producto activo</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="neon" isLoading={saveMutation.isPending} disabled={!form.name || !form.price} onClick={() => saveMutation.mutate()}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

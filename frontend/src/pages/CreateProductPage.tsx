import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminProductsPage } from './admin/AdminProductsPage';

export function CreateProductPage() {
  return (
    <AdminLayout>
      <AdminProductsPage />
    </AdminLayout>
  );
}

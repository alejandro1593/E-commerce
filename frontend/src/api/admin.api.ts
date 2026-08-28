import { api } from './client';
import { Product, PaginatedResponse, Coupon } from '../types';

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  monthlyOrders: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
  }>;
  ordersByStatus: Array<{ status: string; count: number }>;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  _count?: { orders: number };
}

export const adminApi = {
  getDashboard: () =>
    api.get<{ data: DashboardStats }>('/admin/dashboard').then((r) => r.data.data),

  listOrders: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<{ id: string; total: number; status: string; createdAt: string; userId: string; items: any[]; user: { name: string; email: string } }>>('/admin/orders', { params }).then((r) => r.data),

  updateOrderStatus: (id: string, status: string) =>
    api.put(`/admin/orders/${id}/status`, { status }).then((r) => r.data.data),

  listUsers: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<AdminUser>>('/admin/users', { params }).then((r) => r.data),

  updateUserStatus: (id: string, isActive: boolean) =>
    api.put(`/admin/users/${id}`, { isActive }).then((r) => r.data.data),

  updateUser: (id: string, data: { name?: string; email?: string; role?: 'USER' | 'ADMIN'; isActive?: boolean }) =>
    api.put(`/admin/users/${id}`, data).then((r) => r.data.data),

  listProducts: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<Product>>('/admin/products', { params }).then((r) => r.data),

  createProduct: (data: Record<string, unknown>) =>
    api.post('/admin/products', data).then((r) => r.data.data),

  updateProduct: (id: string, data: Record<string, unknown>) =>
    api.put(`/admin/products/${id}`, data).then((r) => r.data.data),

  deleteProduct: (id: string) =>
    api.delete(`/admin/products/${id}`).then((r) => r.data.data),

  listCoupons: () =>
    api.get<{ data: Coupon[] }>('/admin/coupons').then((r) => r.data.data),

  createCoupon: (data: Record<string, unknown>) =>
    api.post('/admin/coupons', data).then((r) => r.data.data),

  updateCoupon: (id: string, data: Record<string, unknown>) =>
    api.put(`/admin/coupons/${id}`, data).then((r) => r.data.data),

  deleteCoupon: (id: string) =>
    api.delete(`/admin/coupons/${id}`).then((r) => r.data.data),
};

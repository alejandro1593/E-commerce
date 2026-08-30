import { api } from './client';
import { Product, PaginatedResponse, Category } from '../types';

interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const productsApi = {
  list: (filters?: ProductFilters) =>
    api.get<PaginatedResponse<Product>>('/products', { params: filters }).then((r) => r.data),

  getBySlug: (slug: string) =>
    api.get<{ data: Product }>(`/products/${slug}`).then((r) => r.data.data),

  getFeatured: () =>
    api.get<{ data: Product[] }>('/products/featured').then((r) => r.data.data),

  getRelated: (slug: string, limit = 4) =>
    api.get<{ data: Product[] }>('/products/related', { params: { slug, limit } }).then((r) => r.data.data),

  getReviews: (productId: string, page = 1, limit = 10) =>
    api.get(`/products/${productId}/reviews`, { params: { page, limit } }).then((r) => r.data),

  createReview: (productId: string, data: { rating: number; comment?: string }) =>
    api.post(`/products/${productId}/reviews`, data).then((r) => r.data.data),
};

export const categoriesApi = {
  list: () =>
    api.get<{ data: Category[] }>('/categories').then((r) => r.data.data),

  getBySlug: (slug: string) =>
    api.get<{ data: Category & { products: Product[] } }>(`/categories/${slug}`).then((r) => r.data.data),
};

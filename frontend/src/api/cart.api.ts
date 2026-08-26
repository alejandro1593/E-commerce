import { api } from './client';
import { Cart } from '../types';

export const cartApi = {
  get: () =>
    api.get<{ data: Cart }>('/cart').then((r) => r.data.data),

  addItem: (data: { productId: string; variantId?: string; quantity: number }) =>
    api.post<{ data: Cart }>('/cart/items', data).then((r) => r.data.data),

  updateItem: (itemId: string, quantity: number) =>
    api.put<{ data: Cart }>(`/cart/items/${itemId}`, { quantity }).then((r) => r.data.data),

  removeItem: (itemId: string) =>
    api.delete<{ data: Cart }>(`/cart/items/${itemId}`).then((r) => r.data.data),

  clear: () =>
    api.delete<{ data: Cart }>('/cart').then((r) => r.data.data),

  applyCoupon: (code: string) =>
    api.post<{ data: Cart }>('/cart/coupon', { code }).then((r) => r.data.data),

  removeCoupon: () =>
    api.delete<{ data: Cart }>('/cart/coupon').then((r) => r.data.data),
};

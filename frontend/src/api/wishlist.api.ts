import { api } from './client';
import { Product } from '../types';

export const wishlistApi = {
  get: () =>
    api.get<{ data: Product[] }>('/wishlist').then((r) => r.data.data),

  toggle: (productId: string) =>
    api.post<{ data: { isFavorite: boolean } }>(`/wishlist/${productId}`).then((r) => r.data.data),
};

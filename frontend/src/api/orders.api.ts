import { api } from './client';
import { Order, PaginatedResponse } from '../types';

export const ordersApi = {
  create: (data: { shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string } }) =>
    api.post<{ data: Order }>('/orders', data).then((r) => r.data.data),

  list: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<Order>>('/orders', { params: { page, limit } }).then((r) => r.data),

  getById: (id: string) =>
    api.get<{ data: Order }>(`/orders/${id}`).then((r) => r.data.data),

  cancel: (id: string) =>
    api.post<{ data: Order }>(`/orders/${id}/cancel`).then((r) => r.data.data),
};

export const paymentsApi = {
  createIntent: (orderId: string) =>
    api.post<{ data: { clientSecret: string; paymentIntentId: string } }>('/payments/create-intent', { orderId }).then((r) => r.data.data),

  confirm: (paymentIntentId: string) =>
    api.post<{ data: { status: string } }>('/payments/confirm', { paymentIntentId }).then((r) => r.data.data),
};

import { api } from './client';
import { User, Address } from '../types';

export const usersApi = {
  getProfile: () => api.get<{ data: User }>('/users/me').then((r) => r.data.data),

  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) =>
    api.put<{ data: User }>('/users/me', data).then((r) => r.data.data),

  getAddresses: () => api.get<{ data: Address[] }>('/users/me/addresses').then((r) => r.data.data),

  createAddress: (data: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    isDefault?: boolean;
  }) => api.post<{ data: Address }>('/users/me/addresses', data).then((r) => r.data.data),

  deleteAddress: (id: string) => api.delete(`/users/me/addresses/${id}`),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put<{ data: null }>('/users/me/password', { currentPassword, newPassword }).then((r) => r.data),
};

import { api } from './client';

export const authApi = {
  register: (data: { name: string; email: string; password: string; confirmPassword: string }) =>
    api.post('/auth/register', data).then((r) => r.data.data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data.data),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }).then((r) => r.data.data),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string, confirmPassword: string) =>
    api.post('/auth/reset-password', { token, password, confirmPassword }),
};

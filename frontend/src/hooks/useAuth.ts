import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      addToast({ message: '¡Bienvenido!', type: 'success' });
      navigate('/');
    },
    onError: (error: any) => {
      addToast({ message: error.response?.data?.message || 'Error al iniciar sesión', type: 'error' });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      addToast({ message: '¡Cuenta creada exitosamente!', type: 'success' });
      navigate('/');
    },
    onError: (error: any) => {
      addToast({ message: error.response?.data?.message || 'Error al crear cuenta', type: 'error' });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(useAuthStore.getState().refreshToken || ''),
    onSettled: () => {
      logout();
      queryClient.clear();
      addToast({ message: 'Sesión cerrada', type: 'info' });
      navigate('/');
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.refresh(useAuthStore.getState().refreshToken || ''),
    enabled: isAuthenticated,
    retry: false,
  });

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '../api/wishlist.api';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

export function useWishlist() {
  const addToast = useUIStore((s) => s.addToast);
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.get,
    staleTime: 30000,
    enabled: isAuthenticated,
  });

  const toggleMutation = useMutation({
    mutationFn: wishlistApi.toggle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      addToast({
        message: data.isFavorite ? 'Agregado a favoritos' : 'Eliminado de favoritos',
        type: data.isFavorite ? 'success' : 'info',
      });
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        addToast({ message: 'Inicia sesión para guardar favoritos', type: 'warning' });
      } else {
        addToast({ message: error.response?.data?.message || 'Error al actualizar favoritos', type: 'error' });
      }
    },
  });

  const favorites = wishlistQuery.data || [];

  return {
    favorites,
    isFavorite: (productId: string) => favorites.some((p) => p.id === productId),
    toggle: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
    isLoading: wishlistQuery.isLoading,
  };
}

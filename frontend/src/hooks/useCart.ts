import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cart.api';
import { useUIStore } from '../store/uiStore';

export function useCart() {
  const addToast = useUIStore((s) => s.addToast);
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
    staleTime: 30000,
  });

  const addItemMutation = useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast({ message: 'Producto agregado al carrito', type: 'success' });
    },
    onError: (error: any) => {
      addToast({ message: error.response?.data?.message || 'Error al agregar al carrito', type: 'error' });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast({ message: 'Producto eliminado del carrito', type: 'info' });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: cartApi.applyCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast({ message: 'Cupón aplicado', type: 'success' });
    },
    onError: (error: any) => {
      addToast({ message: error.response?.data?.message || 'Cupón inválido', type: 'error' });
    },
  });

  const removeCouponMutation = useMutation({
    mutationFn: cartApi.removeCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const cart = cartQuery.data;

  return {
    cart,
    items: cart?.items || [],
    subtotal: (cart as any)?.subtotal || 0,
    tax: (cart as any)?.tax || 0,
    discount: (cart as any)?.discount || 0,
    total: (cart as any)?.total || 0,
    itemCount: (cart as any)?.itemCount || 0,
    couponCode: (cart as any)?.coupon?.code || null,
    isLoading: cartQuery.isLoading,
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    applyCoupon: applyCouponMutation.mutate,
    removeCoupon: removeCouponMutation.mutate,
    isAdding: addItemMutation.isPending,
  };
}

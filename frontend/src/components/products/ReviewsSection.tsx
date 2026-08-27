import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/products.api';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Loading } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { formatDate } from '../../lib/utils';
import { Review } from '../../types';

interface ReviewsSectionProps {
  productId: string;
}

function StarRating({ value, onChange, size = 'w-5 h-5' }: { value: number; onChange?: (v: number) => void; size?: string }) {
  const [hover, setHover] = useState(0);
  const active = onChange ? (hover || value) : value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[...Array(5)].map((_, i) => {
        const filled = i < active;
        return (
          <button
            key={i}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(i + 1)}
            onMouseEnter={() => onChange && setHover(i + 1)}
            className={onChange ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
            aria-label={`${i + 1} estrellas`}
          >
            <svg className={`${size} ${filled ? 'text-yellow-400' : 'text-cream-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const { isAuthenticated } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => productsApi.getReviews(productId, 1, 50).then((r) => r),
  });

  const reviews: Review[] = data?.data || [];

  const createMutation = useMutation({
    mutationFn: () =>
      productsApi.createReview(productId, { rating, comment: comment || undefined }),
    onSuccess: () => {
      addToast({ message: 'Reseña enviada. ¡Gracias!', type: 'success' });
      setRating(0);
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
    onError: (err: any) => {
      addToast({ message: err.response?.data?.message || 'Error al enviar reseña', type: 'error' });
    },
  });

  const canSubmit = rating > 0;

  return (
    <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 self-start">
        <CardHeader>
          <h2 className="text-xl font-bold text-dark-900">Reseñas</h2>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="px-6"><Loading message="Cargando reseñas..." /></div>
          ) : reviews.length === 0 ? (
            <div className="px-4">
              <EmptyState
                title="Sin reseñas aún"
                description="Sé el primero en opinar sobre este producto"
              />
            </div>
          ) : (
            <ul className="divide-y divide-cream-300/50">
              {reviews.map((review) => (
                <li key={review.id} className="px-6 py-5">
                  <div className="flex items-center gap-3 mb-2">
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} alt={review.user.name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 bg-gradient-neon rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {(review.user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-dark-900 text-sm">{review.user?.name}</p>
                      <p className="text-dark-900/40 text-xs">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="ml-auto">
                      <StarRating value={review.rating} size="w-4 h-4" />
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-dark-900/70 mt-2 leading-relaxed">{review.comment}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="self-start">
        <CardHeader>
          <h3 className="font-semibold text-dark-900">Deja tu opinión</h3>
        </CardHeader>
        <CardContent>
          {!isAuthenticated ? (
            <div className="text-center">
              <p className="text-dark-900/60 mb-4 text-sm">Inicia sesión para dejar una reseña</p>
              <Link to="/login">
                <Button variant="neon" className="w-full">Iniciar sesión</Button>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (canSubmit) createMutation.mutate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-dark-900/70 mb-2">Calificación</label>
                <StarRating value={rating} onChange={setRating} size="w-7 h-7" />
                {rating === 0 && <p className="text-sm text-dark-900/40 mt-1">Selecciona de 1 a 5 estrellas</p>}
              </div>
              <div>
                <label htmlFor="review-comment" className="block text-sm font-medium text-dark-900/70 mb-2">
                  Comentario (opcional)
                </label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/80 border border-cream-300 rounded-xl text-dark-900 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
              <Button type="submit" variant="neon" className="w-full" disabled={!canSubmit} isLoading={createMutation.isPending}>
                Enviar reseña
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

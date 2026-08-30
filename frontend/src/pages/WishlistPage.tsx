import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { useAuthStore } from '../store/authStore';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';

export function WishlistPage() {
  const { favorites, isLoading } = useWishlist();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold text-dark-900 mb-4">Mis favoritos</h1>
        <p className="text-dark-900/60 mb-6">Inicia sesión para ver tus productos favoritos.</p>
        <Link to="/login">
          <Button variant="neon">Iniciar sesión</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-dark-900 mb-2">Mis favoritos</h1>
      <p className="text-dark-900/50 mb-8">{favorites.length} producto{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}</p>

      {isLoading ? (
        <Loading message="Cargando favoritos..." />
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <svg className="h-16 w-16 mx-auto text-dark-900/20 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <h2 className="text-xl font-semibold text-dark-900 mb-2">No tienes favoritos aún</h2>
          <p className="text-dark-900/60 mb-6">Toca el corazón en un producto para guardarlo aquí.</p>
          <Link to="/productos">
            <Button variant="neon">Explorar productos</Button>
          </Link>
        </div>
      ) : (
        <ProductGrid products={favorites} />
      )}
    </div>
  );
}

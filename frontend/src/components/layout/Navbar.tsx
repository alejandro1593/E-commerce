import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export function Navbar() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, isAuthenticated, logout } = useAuthStore();
  const toggleCart = useUIStore((s) => s.toggleCart);

  return (
    <nav className="sticky top-0 z-40 bg-cream-100/80 backdrop-blur-xl border-b border-cream-300/50">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-neon rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold text-dark-900 hidden sm:block">E-Commerce</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/productos" className="text-dark-900/60 hover:text-neon-cyan font-medium transition-colors duration-300">
              Productos
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleCart}
              className="relative text-dark-900/60 hover:text-neon-cyan transition-colors duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.872l1.836-8.046A1.125 1.125 0 0019.5 3H6.893M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-neon-cyan text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/perfil" className="text-dark-900/60 hover:text-neon-cyan font-medium transition-colors duration-300">
                  {user?.name || 'Mi cuenta'}
                </Link>
                <Link to="/mis-ordenes" className="text-dark-900/60 hover:text-neon-cyan font-medium transition-colors duration-300 text-sm hidden sm:block">
                  Órdenes
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-neon-purple hover:text-neon-purple/80 font-medium transition-colors duration-300 text-sm">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-dark-900/60 hover:text-red-500 font-medium transition-colors duration-300 text-sm"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-dark-900/60 hover:text-neon-cyan font-medium transition-colors duration-300">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

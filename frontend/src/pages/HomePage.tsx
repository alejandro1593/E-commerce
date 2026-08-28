import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useFeaturedProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/products/ProductCard';
import { Loading } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';

export function HomePage() {
  const navigate = useNavigate();
  const { data: featuredProducts = [], isLoading, isError } = useFeaturedProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full text-neon-cyan text-sm font-medium">
                Tecnología de Última Generación
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-dark-900">
              Los mejores{' '}
              <span className="text-gradient">productos</span>{' '}
              al mejor precio
            </h1>
            <p className="text-xl text-dark-900/60 mb-8 max-w-xl">
              Descubre nuestra selección de productos de calidad. Envío rápido y seguro a todo el país.
            </p>
            <div className="flex gap-4">
              <Link to="/productos">
                <Button size="lg" variant="neon">Explorar Productos</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-cream-100/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-dark-900">Productos Destacados</h2>
          {isLoading ? (
            <Loading message="Cargando productos..." />
          ) : isError ? (
            <EmptyState
              title="No pudimos cargar los productos destacados"
              description="Intenta recargar la página en unos momentos."
            />
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Pronto habrá productos destacados"
              description="Mientras tanto, explora nuestro catálogo completo."
              action={{ label: 'Ver productos', onClick: () => navigate('/productos') }}
            />
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-cream-100/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 text-center group glass-hover">
              <div className="w-16 h-16 bg-neon-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-neon-cyan transition-all duration-300">
                <svg className="w-8 h-8 text-neon-cyan" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-dark-900">Envío Gratis</h3>
              <p className="text-dark-900/60">En compras mayores a $500</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center group glass-hover">
              <div className="w-16 h-16 bg-neon-magenta/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-neon-magenta transition-all duration-300">
                <svg className="w-8 h-8 text-neon-magenta" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-dark-900">Pago Seguro</h3>
              <p className="text-dark-900/60">Protegemos tus datos</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center group glass-hover">
              <div className="w-16 h-16 bg-neon-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-neon-purple transition-all duration-300">
                <svg className="w-8 h-8 text-neon-purple" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-dark-900">Devolución Fácil</h3>
              <p className="text-dark-900/60">30 días para devolver</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream-200/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5" />
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-4 text-dark-900">¿Listo para comprar?</h2>
          <p className="text-dark-900/60 mb-8 max-w-2xl mx-auto text-lg">
            Explora nuestro catálogo y encuentra lo que necesitas.
          </p>
          <Link to="/productos">
            <Button size="lg" variant="neon">Explorar Productos</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

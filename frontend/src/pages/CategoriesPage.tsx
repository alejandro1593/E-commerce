import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useProducts';
import { Card, CardContent } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';

export function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();
  const parentCategories = (categories || []).filter((c) => !c.parentId);

  if (isLoading) return <Loading message="Cargando categorías..." />;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-dark-900">Categorías</h1>
        <p className="text-dark-900/60">Explora nuestros productos por categoría</p>
      </div>

      {isError || categories?.length === 0 ? (
        <EmptyState title="No hay categorías" description="Pronto agregaremos más categorías de productos" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {parentCategories.map((category) => (
            <Link key={category.id} to={`/productos?cat=${category.slug}`}>
              <Card className="h-full overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                <div className="h-40 bg-gradient-neon/20 relative overflow-hidden">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl text-neon-cyan/40">🛍️</span>
                    </div>
                  )}
                </div>
                <CardContent>
                  <h2 className="font-bold text-dark-900 text-center text-lg">{category.name}</h2>
                  {category.description && (
                    <p className="text-dark-900/50 text-sm text-center mt-1 line-clamp-2">{category.description}</p>
                  )}
                  {category.children && category.children.length > 0 && (
                    <p className="text-neon-cyan text-xs font-medium text-center mt-2">
                      {category.children.length} subcategoría{category.children.length > 1 ? 's' : ''}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

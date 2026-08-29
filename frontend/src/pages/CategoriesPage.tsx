import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useProducts';
import { Card, CardContent } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';
import { Category } from '../types';

function CategoryTree({ category, depth }: { category: Category; depth: number }) {
  const hasChildren = category.children && category.children.length > 0;

  if (depth > 0) {
    return (
      <li>
        <Link
          to={`/productos?cat=${category.slug}`}
          className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-cream-100 transition-colors"
        >
          <span className="text-sm text-dark-900/70 truncate">{category.name}</span>
        </Link>
        {hasChildren && (
          <ul className="ml-4 border-l border-cream-300/50 pl-2 space-y-0.5 mt-0.5">
            {(category.children || []).map((child) => (
              <CategoryTree key={child.id} category={child} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <Link to={`/productos?cat=${category.slug}`}>
      <Card className="h-full overflow-hidden hover:scale-[1.02] transition-transform duration-300 flex flex-col">
        <div className="h-40 bg-gradient-neon/20 relative overflow-hidden">
          {category.image ? (
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl text-neon-cyan/40">🛍️</span>
            </div>
          )}
        </div>
        <CardContent className="flex-1 flex flex-col">
          <h2 className="font-bold text-dark-900 text-center text-lg">{category.name}</h2>
          {category.description && (
            <p className="text-dark-900/50 text-sm text-center mt-1 line-clamp-2">{category.description}</p>
          )}
          {hasChildren && (
            <div className="mt-3 border-t border-cream-300/50 pt-3">
              <p className="text-neon-cyan text-xs font-medium mb-1">
                {category.children!.length} subcategoría{category.children!.length > 1 ? 's' : ''}
              </p>
              <ul className="space-y-0.5 max-h-40 overflow-y-auto">
                {(category.children || []).map((child) => (
                  <CategoryTree key={child.id} category={child} depth={depth + 1} />
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();

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
          {(categories || []).map((category) => (
            <CategoryTree key={category.id} category={category} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}
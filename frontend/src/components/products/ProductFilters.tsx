import { Select } from '../ui/Select';
import { useCategories } from '../../hooks/useProducts';

interface ProductFiltersProps {
  sort: string;
  category: string;
  onSortChange: (sort: string) => void;
  onCategoryChange: (category: string) => void;
}

export function ProductFilters({ sort, category, onSortChange, onCategoryChange }: ProductFiltersProps) {
  const { data: categories } = useCategories();

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full md:w-48">
        <Select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          options={[
            { value: 'newest', label: 'Más recientes' },
            { value: 'price_asc', label: 'Menor precio' },
            { value: 'price_desc', label: 'Mayor precio' },
            { value: 'name_asc', label: 'Nombre A-Z' },
            { value: 'name_desc', label: 'Nombre Z-A' },
          ]}
        />
      </div>
      {categories && categories.length > 0 && (
        <div className="w-full md:w-48">
          <Select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={[
              { value: '', label: 'Todas las categorías' },
              ...categories.map((c) => ({ value: c.slug, label: c.name })),
            ]}
          />
        </div>
      )}
    </div>
  );
}

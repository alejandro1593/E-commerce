import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { useCategories } from '../../hooks/useProducts';
import { buildCategorySelectOptions, categoryLabelByDepth } from '../../lib/categories';

interface ProductFiltersProps {
  sort: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  onSortChange: (sort: string) => void;
  onCategoryChange: (category: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onClear: () => void;
}

export function ProductFilters({
  sort,
  category,
  minPrice,
  maxPrice,
  onSortChange,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClear,
}: ProductFiltersProps) {
  const { data: categories } = useCategories();
  const hasFilters = !!(minPrice || maxPrice || category);

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
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          placeholder="Precio mín."
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          className="w-28"
        />
        <span className="text-dark-900/40">-</span>
        <Input
          type="number"
          min={0}
          placeholder="Precio máx."
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          className="w-28"
        />
      </div>
      {categories && categories.length > 0 && (
        <div className="w-full md:w-48">
          <Select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={[
              { value: '', label: 'Todas las categorías' },
              ...buildCategorySelectOptions(categories).map((opt) => ({
                value: opt.slug,
                label: categoryLabelByDepth(opt),
              })),
            ]}
          />
        </div>
      )}
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-neon-cyan hover:underline self-center"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

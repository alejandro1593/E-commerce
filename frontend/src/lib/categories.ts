import { Category } from '../types';

export interface CategoryOption {
  value: string;
  slug: string;
  label: string;
  depth: number;
}

export function flattenCategories(children: Category[], depth = 0): CategoryOption[] {
  const result: CategoryOption[] = [];
  for (const category of children || []) {
    result.push({ value: category.id, slug: category.slug, label: category.name, depth });
    if (category.children && category.children.length > 0) {
      result.push(...flattenCategories(category.children, depth + 1));
    }
  }
  return result;
}

export function buildCategorySelectOptions(categories?: Category[]): CategoryOption[] {
  return flattenCategories(categories || []);
}

export function categoryLabelByDepth(option: CategoryOption): string {
  return `${'— '.repeat(option.depth)}${option.label}`;
}
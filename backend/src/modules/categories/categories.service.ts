import prisma from '../../config/database';
import { slugify } from '../../shared/utils/slugify';
import { ApiError } from '../../shared/utils/ApiError';

export async function listCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });

  const byParent = new Map<string | null, any[]>();
  for (const category of categories) {
    if (!byParent.has(category.parentId)) byParent.set(category.parentId, []);
    byParent.get(category.parentId)!.push(category);
  }

  const activeIds = new Set(categories.map((c) => c.id));

  const buildTree = (parentId: string | null): any[] =>
    (byParent.get(parentId) || []).map((category) => ({
      ...category,
      children: buildTree(category.id),
    }));

  // Una categoría se trata como raíz si no tiene padre o si su padre no está
  // entre las categorías activas (huérfana), evitando que se pierda del árbol.
  const roots = categories.filter((c) => !c.parentId || !activeIds.has(c.parentId));
  return roots.map((c) => ({ ...c, children: buildTree(c.id) }));
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: { where: { isActive: true } },
      products: {
        where: { isActive: true },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          _count: { select: { reviews: true } },
        },
        take: 20,
      },
    },
  });

  if (!category) throw ApiError.notFound('Category not found');
  return category;
}

export async function createCategory(data: any) {
  const slug = slugify(data.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw ApiError.conflict('A category with this name already exists');

  return prisma.category.create({
    data: { ...data, slug },
  });
}

export async function updateCategory(id: string, data: any) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Category not found');

  if (data.name) data.slug = slugify(data.name);

  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { products: true, children: true },
  });
  if (!existing) throw ApiError.notFound('Category not found');
  if (existing.products.length > 0) {
    throw ApiError.badRequest('Cannot delete category with products');
  }
  if (existing.children.length > 0) {
    throw ApiError.badRequest('Cannot delete category with subcategories');
  }

  await prisma.category.delete({ where: { id } });
}

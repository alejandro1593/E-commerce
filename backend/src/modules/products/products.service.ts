import prisma from '../../config/database';
import { slugify } from '../../shared/utils/slugify';
import { paginate } from '../../shared/utils/paginate';
import { ApiError } from '../../shared/utils/ApiError';

const productInclude = {
  images: { orderBy: { sortOrder: 'asc' as const } },
  variants: true,
  category: true,
  _count: { select: { reviews: true } },
};

export async function listProducts(filters: {
  page: number;
  limit: number;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) {
  const { page, limit, skip } = paginate(filters.page, filters.limit);

  const where: any = { isActive: true };

  if (filters.category) {
    where.category = { slug: filters.category };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  switch (filters.sort) {
    case 'price_asc': orderBy = { price: 'asc' }; break;
    case 'price_desc': orderBy = { price: 'desc' }; break;
    case 'name_asc': orderBy = { name: 'asc' }; break;
    case 'name_desc': orderBy = { name: 'desc' }; break;
    case 'oldest': orderBy = { createdAt: 'asc' }; break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      ...productInclude,
      reviews: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: 8,
  });
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

export async function createProduct(data: any) {
  const slug = slugify(data.name);

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) throw ApiError.conflict('A product with this name already exists');

  const { images, variants, ...productData } = data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      slug,
      images: images ? { create: images } : undefined,
      variants: variants ? { create: variants } : undefined,
    },
    include: productInclude,
  });

  return product;
}

export async function updateProduct(id: string, data: any) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Product not found');

  const { images, variants, ...productData } = data;

  if (productData.name) {
    productData.slug = slugify(productData.name);
  }

  const product = await prisma.product.update({
    where: { id },
    data: productData,
    include: productInclude,
  });

  return product;
}

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Product not found');

  await prisma.product.delete({ where: { id } });
}

export async function adminListProducts(filters: {
  page: number;
  limit: number;
  search?: string;
}) {
  const { page, limit, skip } = paginate(filters.page, filters.limit);

  const where: any = {};
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { sku: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit };
}

import { Prisma } from '@prisma/client';
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

  // Full-text search via the generated tsvector column (GIN indexed).
  if (filters.search) {
    const totalRow = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM "products" p
      JOIN "categories" c ON c."id" = p."categoryId"
      WHERE p."isActive" = true
        AND p."searchVector" @@ websearch_to_tsquery('spanish', ${filters.search})
        ${filters.category ? Prisma.sql`AND c."slug" = ${filters.category}` : Prisma.empty}
        ${filters.minPrice !== undefined ? Prisma.sql`AND p."price" >= ${filters.minPrice}` : Prisma.empty}
        ${filters.maxPrice !== undefined ? Prisma.sql`AND p."price" <= ${filters.maxPrice}` : Prisma.empty}`;

    const total = Number(totalRow[0]?.count ?? 0);

    const rows = await prisma.$queryRaw<{ id: string }[]>`
      SELECT p."id"
      FROM "products" p
      JOIN "categories" c ON c."id" = p."categoryId"
      WHERE p."isActive" = true
        AND p."searchVector" @@ websearch_to_tsquery('spanish', ${filters.search})
        ${filters.category ? Prisma.sql`AND c."slug" = ${filters.category}` : Prisma.empty}
        ${filters.minPrice !== undefined ? Prisma.sql`AND p."price" >= ${filters.minPrice}` : Prisma.empty}
        ${filters.maxPrice !== undefined ? Prisma.sql`AND p."price" <= ${filters.maxPrice}` : Prisma.empty}
      ORDER BY ts_rank(p."searchVector", websearch_to_tsquery('spanish', ${filters.search})) DESC, p."createdAt" DESC
      LIMIT ${limit} OFFSET ${skip}`;

    const ids = rows.map((r) => r.id);
    const products = ids.length
      ? await prisma.product.findMany({
          where: { id: { in: ids } },
          include: productInclude,
        })
      : [];
    const byId = new Map(products.map((p) => [p.id, p]));
    const ordered = ids.map((id) => byId.get(id)!).filter(Boolean);

    return { products: ordered, total, page, limit };
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

  const product = await prisma.$transaction(async (tx) => {
    if (variants) {
      await tx.variant.deleteMany({ where: { productId: id } });
    }

    return tx.product.update({
      where: { id },
      data: {
        ...productData,
        ...(variants ? { variants: { create: variants } } : {}),
      },
      include: productInclude,
    });
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

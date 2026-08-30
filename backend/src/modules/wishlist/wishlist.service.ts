import prisma from '../../config/database';
import { ApiError } from '../../shared/utils/ApiError';

const wishlistInclude = {
  product: {
    include: {
      images: { orderBy: { sortOrder: 'asc' as const } },
      variants: true,
      category: true,
      _count: { select: { reviews: true } },
    },
  },
};

export async function getWishlist(userId: string) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: wishlistInclude,
    orderBy: { createdAt: 'desc' },
  });

  return items.map((item) => item.product);
}

export async function toggleWishlistItem(userId: string, productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound('Product not found');

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return { isFavorite: false };
  }

  await prisma.wishlistItem.create({ data: { userId, productId } });
  return { isFavorite: true };
}
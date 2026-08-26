import prisma from '../../config/database';
import { ApiError } from '../../shared/utils/ApiError';

export async function getProductReviews(productId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  return { reviews, total, page, limit };
}

export async function createReview(userId: string, productId: string, data: { rating: number; comment?: string }) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound('Product not found');

  const existingReview = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existingReview) throw ApiError.conflict('You have already reviewed this product');

  return prisma.review.create({
    data: {
      userId,
      productId,
      rating: data.rating,
      comment: data.comment,
    },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });
}

import prisma from '../../config/database';
import { paginate } from '../../shared/utils/paginate';
import { ApiError } from '../../shared/utils/ApiError';

export async function listCoupons(page: number, limit: number) {
  const { page: p, limit: l, skip } = paginate(page, limit);

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: l,
    }),
    prisma.coupon.count(),
  ]);

  return { coupons, total, page: p, limit: l };
}

export async function createCoupon(data: any) {
  const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
  if (existing) throw ApiError.conflict('Coupon code already exists');

  return prisma.coupon.create({
    data: {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });
}

export async function updateCoupon(id: string, data: any) {
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Coupon not found');

  if (data.expiresAt) data.expiresAt = new Date(data.expiresAt);

  return prisma.coupon.update({
    where: { id },
    data,
  });
}

export async function deleteCoupon(id: string) {
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Coupon not found');

  await prisma.coupon.delete({ where: { id } });
}

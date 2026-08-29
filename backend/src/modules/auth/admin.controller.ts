import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { ApiError } from '../../shared/utils/ApiError';
import prisma from '../../config/database';
import { restockOrderItems } from '../orders/orders.service';

export async function getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfLast14Days = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000);
    startOfLast14Days.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      monthlyOrders,
      monthlyRevenue,
      yearlyRevenue,
      recentOrders,
      ordersByStatus,
      topProducts,
      lowStockProducts,
      salesPerDay,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfMonth }, status: { not: 'CANCELLED' } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfYear }, status: { not: 'CANCELLED' } },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      prisma.product.findMany({
        where: { stock: { lte: 10 } },
        orderBy: { stock: 'asc' },
        take: 5,
        select: { id: true, name: true, sku: true, stock: true },
      }),
      prisma.$queryRaw`
        SELECT TO_CHAR(date_trunc('day', o."createdAt"), 'YYYY-MM-DD') AS day,
               COALESCE(SUM(o."total"), 0) AS revenue,
               COUNT(*)::int AS orders
        FROM "orders" o
        WHERE o."createdAt" >= ${startOfLast14Days}
          AND o."status" != 'CANCELLED'
        GROUP BY date_trunc('day', o."createdAt")
        ORDER BY date_trunc('day', o."createdAt") ASC
      `,
    ]);

    const topProductIds = topProducts.map((p) => p.productId);
    const topProductsWithNames = topProductIds.length
      ? await prisma.product.findMany({
          where: { id: { in: topProductIds } },
          select: { id: true, name: true },
        })
      : [];
    const productNameMap = new Map(topProductsWithNames.map((p) => [p.id, p.name]));

    return ApiResponse.success(res, {
      totalUsers,
      totalProducts,
      totalOrders,
      monthlyOrders,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
      yearlyRevenue: yearlyRevenue._sum.total || 0,
      recentOrders,
      ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count })),
      topProducts: topProducts.map((p) => ({
        productId: p.productId,
        name: productNameMap.get(p.productId) || 'Producto',
        quantity: p._sum.quantity || 0,
      })),
      lowStockProducts,
      salesPerDay: (salesPerDay as any[]).map((s) => ({
        day: s.day,
        revenue: Number(s.revenue),
        orders: s.orders,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req: any, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count(),
    ]);

    return ApiResponse.paginated(res, orders, total, page, limit);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;

    const order = await prisma.$transaction(async (tx) => {
      if (status === 'CANCELLED') {
        const current = await tx.order.findUnique({
          where: { id: req.params.id },
          select: { status: true },
        });
        if (current && current.status !== 'CANCELLED') {
          await restockOrderItems(tx, req.params.id);
        }
      }

      return tx.order.update({
        where: { id: req.params.id },
        data: { status },
        include: { items: true },
      });
    });

    return ApiResponse.success(res, order, 'Order status updated');
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(req: any, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return ApiResponse.paginated(res, users, total, page, limit);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data: any = {};
    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.email !== undefined) data.email = req.body.email;
    if (req.body.role !== undefined) {
      if (!['USER', 'ADMIN'].includes(req.body.role)) {
        throw ApiError.badRequest('Invalid role');
      }
      data.role = req.body.role;
    }
    if (req.body.isActive !== undefined) data.isActive = req.body.isActive;

    if (Object.keys(data).length === 0) {
      throw ApiError.badRequest('No fields to update');
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
    return ApiResponse.success(res, user, 'User updated');
  } catch (error) {
    next(error);
  }
}

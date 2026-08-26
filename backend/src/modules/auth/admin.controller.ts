import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import prisma from '../../config/database';

export async function getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      monthlyOrders,
      monthlyRevenue,
      yearlyRevenue,
      recentOrders,
      ordersByStatus,
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
    ]);

    return ApiResponse.success(res, {
      totalUsers,
      totalProducts,
      totalOrders,
      monthlyOrders,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
      yearlyRevenue: yearlyRevenue._sum.total || 0,
      recentOrders,
      ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count })),
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
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: true },
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

export async function updateUserStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: req.body.isActive },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
    return ApiResponse.success(res, user, 'User status updated');
  } catch (error) {
    next(error);
  }
}

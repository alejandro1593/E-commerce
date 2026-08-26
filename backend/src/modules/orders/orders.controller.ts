import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import * as ordersService from './orders.service';

export async function createOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.createOrder(req.user!.id, req.body);
    return ApiResponse.created(res, order, 'Order created successfully');
  } catch (error) {
    next(error);
  }
}

export async function getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await ordersService.getUserOrders(req.user!.id, page, limit);
    return ApiResponse.paginated(res, result.orders, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.getOrderById(req.user!.id, req.params.id);
    return ApiResponse.success(res, order);
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.cancelOrder(req.user!.id, req.params.id);
    return ApiResponse.success(res, order, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
}

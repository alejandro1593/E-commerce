import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import * as couponsService from './coupons.service';

export async function listCoupons(req: any, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await couponsService.listCoupons(page, limit);
    return ApiResponse.paginated(res, result.coupons, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
}

export async function createCoupon(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const coupon = await couponsService.createCoupon(req.body);
    return ApiResponse.created(res, coupon, 'Coupon created successfully');
  } catch (error) {
    next(error);
  }
}

export async function updateCoupon(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const coupon = await couponsService.updateCoupon(req.params.id, req.body);
    return ApiResponse.success(res, coupon, 'Coupon updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteCoupon(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await couponsService.deleteCoupon(req.params.id);
    return ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
}

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { ApiError } from '../../shared/utils/ApiError';
import * as wishlistService from './wishlist.service';

export async function getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const products = await wishlistService.getWishlist(req.user!.id);
    return ApiResponse.success(res, products);
  } catch (error) {
    next(error);
  }
}

export async function toggleWishlistItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id?: string };
    if (!id) throw ApiError.badRequest('Product ID is required');
    const result = await wishlistService.toggleWishlistItem(req.user!.id, id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
}
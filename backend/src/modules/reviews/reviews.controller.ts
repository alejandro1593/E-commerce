import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import * as reviewsService from './reviews.service';

export async function getProductReviews(req: any, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await reviewsService.getProductReviews(req.params.productId, page, limit);
    return ApiResponse.paginated(res, result.reviews, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
}

export async function createReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const review = await reviewsService.createReview(req.user!.id, req.params.productId, req.body);
    return ApiResponse.created(res, review, 'Review created successfully');
  } catch (error) {
    next(error);
  }
}

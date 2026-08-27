import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import * as paymentsService from './payments.service';

export async function createPaymentIntent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await paymentsService.createPaymentIntent(req.user!.id, req.body.orderId);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
}

export async function confirmPayment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await paymentsService.confirmPayment(req.user!.id, req.body.paymentIntentId);
    return ApiResponse.success(res, result, 'Payment confirmed');
  } catch (error) {
    next(error);
  }
}

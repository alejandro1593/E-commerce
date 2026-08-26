import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import * as cartService from './cart.service';

export async function getCart(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.getCart(req.user!.id);
    return ApiResponse.success(res, cart);
  } catch (error) {
    next(error);
  }
}

export async function addItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.addItem(req.user!.id, req.body);
    return ApiResponse.success(res, cart, 'Item added to cart');
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.updateCartItem(req.user!.id, req.params.id, req.body.quantity);
    return ApiResponse.success(res, cart, 'Cart updated');
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.removeCartItem(req.user!.id, req.params.id);
    return ApiResponse.success(res, cart, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.clearCart(req.user!.id);
    return ApiResponse.success(res, cart, 'Cart cleared');
  } catch (error) {
    next(error);
  }
}

export async function applyCoupon(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.applyCoupon(req.user!.id, req.body.code);
    return ApiResponse.success(res, cart, 'Coupon applied');
  } catch (error) {
    next(error);
  }
}

export async function removeCoupon(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.removeCoupon(req.user!.id);
    return ApiResponse.success(res, cart, 'Coupon removed');
  } catch (error) {
    next(error);
  }
}

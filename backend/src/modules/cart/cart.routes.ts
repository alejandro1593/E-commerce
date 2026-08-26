import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { z } from 'zod';
import * as cartController from './cart.controller';

const router = Router();

const addItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).default(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0),
});

const couponSchema = z.object({
  code: z.string().min(1),
});

router.get('/', authenticate, cartController.getCart);
router.post('/items', authenticate, validate(addItemSchema), cartController.addItem);
router.put('/items/:id', authenticate, validate(updateItemSchema), cartController.updateCartItem);
router.delete('/items/:id', authenticate, cartController.removeCartItem);
router.delete('/', authenticate, cartController.clearCart);

router.post('/coupon', authenticate, validate(couponSchema), cartController.applyCoupon);
router.delete('/coupon', authenticate, cartController.removeCoupon);

export default router;

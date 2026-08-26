import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { z } from 'zod';
import * as paymentsController from './payments.controller';

const router = Router();

const createIntentSchema = z.object({
  orderId: z.string().uuid(),
});

const confirmSchema = z.object({
  paymentIntentId: z.string().min(1),
});

router.post('/create-intent', authenticate, validate(createIntentSchema), paymentsController.createPaymentIntent);
router.post('/confirm', authenticate, validate(confirmSchema), paymentsController.confirmPayment);

export default router;

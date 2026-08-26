import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { createOrderSchema } from './orders.validation';
import { idParamSchema } from '../../shared/validators/common';
import * as ordersController from './orders.controller';

const router = Router();

router.post('/', authenticate, validate(createOrderSchema), ordersController.createOrder);
router.get('/', authenticate, ordersController.getUserOrders);
router.get('/:id', authenticate, validate(idParamSchema, 'params'), ordersController.getOrderById);
router.post('/:id/cancel', authenticate, validate(idParamSchema, 'params'), ordersController.cancelOrder);

export default router;

import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { authorize } from '../../shared/middleware/role.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { idParamSchema } from '../../shared/validators/common';
import { createCouponSchema, updateCouponSchema } from './coupons.validation';
import * as couponsController from './coupons.controller';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), couponsController.listCoupons);
router.post('/', authenticate, authorize('ADMIN'), validate(createCouponSchema), couponsController.createCoupon);
router.put('/:id', authenticate, authorize('ADMIN'), validate(idParamSchema, 'params'), validate(updateCouponSchema), couponsController.updateCoupon);
router.delete('/:id', authenticate, authorize('ADMIN'), validate(idParamSchema, 'params'), couponsController.deleteCoupon);

export default router;

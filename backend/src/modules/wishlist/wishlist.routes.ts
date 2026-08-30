import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { idParamSchema } from '../../shared/validators/common';
import { validate } from '../../shared/middleware/validate.middleware';
import * as wishlistController from './wishlist.controller';

const router = Router();

router.get('/', authenticate, wishlistController.getWishlist);
router.post('/:id', authenticate, validate(idParamSchema, 'params'), wishlistController.toggleWishlistItem);

export default router;
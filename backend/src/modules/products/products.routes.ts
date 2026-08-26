import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { authorize } from '../../shared/middleware/role.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { productFilterSchema, createProductSchema, updateProductSchema } from './products.validation';
import { idParamSchema, slugParamSchema } from '../../shared/validators/common';
import * as productsController from './products.controller';

const router = Router();

router.get('/', validate(productFilterSchema, 'query'), productsController.listProducts);
router.get('/featured', productsController.getFeaturedProducts);
router.get('/:slug', validate(slugParamSchema, 'params'), productsController.getProductBySlug);

export const adminProductsRouter = Router();

adminProductsRouter.get('/', validate(productFilterSchema, 'query'), productsController.adminListProducts);
adminProductsRouter.post('/', authenticate, authorize('ADMIN'), validate(createProductSchema), productsController.createProduct);
adminProductsRouter.put('/:id', authenticate, authorize('ADMIN'), validate(idParamSchema, 'params'), validate(updateProductSchema), productsController.updateProduct);
adminProductsRouter.delete('/:id', authenticate, authorize('ADMIN'), validate(idParamSchema, 'params'), productsController.deleteProduct);

export default router;

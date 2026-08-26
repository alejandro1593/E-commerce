import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { authorize } from '../../shared/middleware/role.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from './categories.validation';
import { slugParamSchema, idParamSchema } from '../../shared/validators/common';
import * as categoriesController from './categories.controller';

const router = Router();

router.get('/', categoriesController.listCategories);
router.get('/:slug', validate(slugParamSchema, 'params'), categoriesController.getCategoryBySlug);

export const adminCategoriesRouter = Router();

adminCategoriesRouter.post('/', authenticate, authorize('ADMIN'), validate(createCategorySchema), categoriesController.createCategory);
adminCategoriesRouter.put('/:id', authenticate, authorize('ADMIN'), validate(idParamSchema, 'params'), validate(updateCategorySchema), categoriesController.updateCategory);
adminCategoriesRouter.delete('/:id', authenticate, authorize('ADMIN'), validate(idParamSchema, 'params'), categoriesController.deleteCategory);

export default router;

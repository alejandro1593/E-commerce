import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { updateProfileSchema, createAddressSchema, updateAddressSchema, changePasswordSchema } from './users.validation';
import { idParamSchema } from '../../shared/validators/common';
import * as usersController from './users.controller';

const router = Router();

router.get('/me', authenticate, usersController.getProfile);
router.put('/me', authenticate, validate(updateProfileSchema), usersController.updateProfile);

router.get('/me/addresses', authenticate, usersController.getAddresses);
router.post('/me/addresses', authenticate, validate(createAddressSchema), usersController.createAddress);
router.put('/me/addresses/:id', authenticate, validate(idParamSchema, 'params'), validate(updateAddressSchema), usersController.updateAddress);
router.delete('/me/addresses/:id', authenticate, validate(idParamSchema, 'params'), usersController.deleteAddress);

router.put('/me/password', authenticate, validate(changePasswordSchema), usersController.changePassword);

export default router;

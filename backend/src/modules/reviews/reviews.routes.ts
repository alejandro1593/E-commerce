import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { z } from 'zod';
import * as reviewsController from './reviews.controller';

const router = Router({ mergeParams: true });

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

router.get('/', reviewsController.getProductReviews);
router.post('/', authenticate, validate(createReviewSchema), reviewsController.createReview);

export default router;

import { Router } from 'express';
import { upload } from '../../shared/middleware/upload.middleware';
import * as uploadsController from './uploads.controller';

const router = Router();

router.post('/images', upload.single('file'), uploadsController.uploadProductImage);

export const uploadsRouter = router;
export default router;
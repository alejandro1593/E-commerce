import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { ApiError } from '../../shared/utils/ApiError';
import { uploadImage, isCloudinaryConfigured } from '../../config/cloudinary';

export async function uploadProductImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!isCloudinaryConfigured()) {
      throw ApiError.badRequest('Cloudinary no está configurado. Añade CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET al .env.');
    }

    const file = (req as any).file;
    if (!file) {
      throw ApiError.badRequest('No file uploaded');
    }

    const result = await uploadImage(file.buffer, { folder: 'ecommerce/products' });
    return ApiResponse.success(res, result, 'Image uploaded successfully');
  } catch (error) {
    next(error);
  }
}
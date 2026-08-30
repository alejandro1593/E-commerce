import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import * as productsService from './products.service';

export async function listProducts(req: any, res: Response, next: NextFunction) {
  try {
    const result = await productsService.listProducts(req.query);
    return ApiResponse.paginated(res, result.products, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req: any, res: Response, next: NextFunction) {
  try {
    const product = await productsService.getProductBySlug(req.params.slug);
    return ApiResponse.success(res, product);
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedProducts(req: any, res: Response, next: NextFunction) {
  try {
    const products = await productsService.getFeaturedProducts();
    return ApiResponse.success(res, products);
  } catch (error) {
    next(error);
  }
}

export async function getRelatedProducts(req: any, res: Response, next: NextFunction) {
  try {
    const slug = req.query.slug as string;
    const take = parseInt(req.query.limit as string) || 4;
    const products = await productsService.getRelatedProducts(slug, take);
    return ApiResponse.success(res, products);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const product = await productsService.createProduct(req.body);
    return ApiResponse.created(res, product, 'Product created successfully');
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const product = await productsService.updateProduct(req.params.id, req.body);
    return ApiResponse.success(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await productsService.deleteProduct(req.params.id);
    return ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
}

export async function adminListProducts(req: any, res: Response, next: NextFunction) {
  try {
    const result = await productsService.adminListProducts(req.query);
    return ApiResponse.paginated(res, result.products, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
}

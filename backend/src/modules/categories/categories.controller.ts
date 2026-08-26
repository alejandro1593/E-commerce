import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import * as categoriesService from './categories.service';

export async function listCategories(req: any, res: Response, next: NextFunction) {
  try {
    const categories = await categoriesService.listCategories();
    return ApiResponse.success(res, categories);
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlug(req: any, res: Response, next: NextFunction) {
  try {
    const category = await categoriesService.getCategoryBySlug(req.params.slug);
    return ApiResponse.success(res, category);
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const category = await categoriesService.createCategory(req.body);
    return ApiResponse.created(res, category, 'Category created successfully');
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const category = await categoriesService.updateCategory(req.params.id, req.body);
    return ApiResponse.success(res, category, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await categoriesService.deleteCategory(req.params.id);
    return ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
}

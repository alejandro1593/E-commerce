import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import * as usersService from './users.service';

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await usersService.getProfile(req.user!.id);
    return ApiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await usersService.updateProfile(req.user!.id, req.body);
    return ApiResponse.success(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function getAddresses(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const addresses = await usersService.getAddresses(req.user!.id);
    return ApiResponse.success(res, addresses);
  } catch (error) {
    next(error);
  }
}

export async function createAddress(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const address = await usersService.createAddress(req.user!.id, req.body);
    return ApiResponse.created(res, address, 'Address created successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await usersService.deleteAddress(req.user!.id, req.params.id);
    return ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
}

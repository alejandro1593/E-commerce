import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ApiResponse } from '../../shared/utils/apiResponse';
import * as authService from './auth.service';

export async function register(req: any, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    return ApiResponse.created(res, result, 'User registered successfully');
  } catch (error) {
    next(error);
  }
}

export async function login(req: any, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    return ApiResponse.success(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: any, res: Response, next: NextFunction) {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    return ApiResponse.success(res, result, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
}

export async function logout(req: any, res: Response, next: NextFunction) {
  try {
    await authService.logout(req.body.refreshToken);
    return ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: any, res: Response, next: NextFunction) {
  try {
    await authService.forgotPassword(req.body.email);
    return ApiResponse.success(res, null, 'If the email exists, a reset link has been sent');
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: any, res: Response, next: NextFunction) {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    return ApiResponse.success(res, null, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
}

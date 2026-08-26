import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { ApiError } from '../utils/ApiError';

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }

    next();
  };
}

import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthUser {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ProductFilterQuery extends PaginationQuery {
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}

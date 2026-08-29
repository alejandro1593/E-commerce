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

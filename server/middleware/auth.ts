import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { UserModel, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
  tokenPayload?: TokenPayload;
}

export function authenticateUser(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. Please provide a valid bearer token.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please log in again.',
    });
    return;
  }

  const user = UserModel.findById(payload.id);
  if (!user) {
    res.status(401).json({
      success: false,
      error: 'User account associated with this token no longer exists.',
    });
    return;
  }

  if (user.status === 'deactivated') {
    res.status(403).json({
      success: false,
      error: 'This account has been deactivated. Please contact support.',
    });
    return;
  }

  req.user = user;
  req.tokenPayload = payload;
  next();
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Access denied. Administrator privileges required.',
    });
    return;
  }
  next();
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) {
      const user = UserModel.findById(payload.id);
      if (user && user.status === 'active') {
        req.user = user;
        req.tokenPayload = payload;
      }
    }
  }
  next();
}

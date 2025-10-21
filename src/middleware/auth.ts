import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken, JWTPayload } from '../utils/jwt';

// Extend Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required',
      message: 'Please provide a Bearer token in Authorization header'
    });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    console.error('Token verification error:', error);

    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          error: 'Token expired',
          message: 'Please login again to get a new token'
        });
        return;
      }

      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
          success: false,
          error: 'Invalid token',
          message: 'The provided token is malformed or invalid'
        });
        return;
      }
    }

    res.status(401).json({
      success: false,
      error: 'Token verification failed',
      message: 'Unable to verify your authentication token'
    });
  }
}

// Optional: Role-based authorization middleware
export function authorizeRoles(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: 'Access denied',
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
      return;
    }

    next();
  };
}

// Specific role authorizers for convenience
export const authorizeAdmin = authorizeRoles(['ADMIN']);
export const authorizeVendor = authorizeRoles(['ADMIN', 'VENDOR']);
export const authorizeCustomer = authorizeRoles(['ADMIN', 'VENDOR', 'CUSTOMER']);
export const authorizeMLMMember = authorizeRoles(['ADMIN', 'MLM_MEMBER']);
export const authorizeAnyUser = authorizeRoles(['ADMIN', 'VENDOR', 'CUSTOMER', 'MLM_MEMBER']);
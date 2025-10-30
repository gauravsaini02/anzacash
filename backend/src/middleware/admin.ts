import { Request, Response, NextFunction } from 'express';

// Extend Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
        role: string;
      };
    }
  }
}

export function requireAdminRole(req: Request, res: Response, next: NextFunction): void {
  // Check if user is authenticated
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Please login to access this resource'
    });
    return;
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Access denied',
      message: 'Admin access required to view this resource'
    });
    return;
  }

  next();
}

// Additional admin utilities
export function adminOrVendorRole(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  const allowedRoles = ['admin', 'vendor'];
  if (!allowedRoles.includes(req.user.role)) {
    res.status(403).json({
      success: false,
      error: 'Access denied',
      message: 'Admin or Vendor access required'
    });
    return;
  }

  next();
}
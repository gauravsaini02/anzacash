import { Request, Response, NextFunction } from 'express';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'VENDOR' | 'CUSTOMER' | 'MLM_MEMBER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export function validateRegistration(req: Request, res: Response, next: NextFunction): void {
  const { firstName, lastName, email, password, role } = req.body as RegisterRequest;

  // Required fields validation
  if (!firstName || !lastName || !email || !password || !role) {
    res.status(400).json({
      error: 'Missing required fields',
      required: ['firstName', 'lastName', 'email', 'password', 'role']
    });
    return;
  }

  // Name validation
  if (firstName.length < 2 || firstName.length > 100) {
    res.status(400).json({ error: 'First name must be between 2 and 100 characters' });
    return;
  }

  if (lastName.length < 2 || lastName.length > 100) {
    res.status(400).json({ error: 'Last name must be between 2 and 100 characters' });
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  // Password validation
  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long' });
    return;
  }

  // Role validation
  const validRoles = ['ADMIN', 'VENDOR', 'CUSTOMER', 'MLM_MEMBER'];
  if (!validRoles.includes(role)) {
    res.status(400).json({
      error: 'Invalid role',
      validRoles
    });
    return;
  }

  // Phone validation (optional)
  if (req.body.phone && req.body.phone.length > 20) {
    res.status(400).json({ error: 'Phone number must be less than 20 characters' });
    return;
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body as LoginRequest;

  // Required fields validation
  if (!email || !password) {
    res.status(400).json({
      error: 'Missing required fields',
      required: ['email', 'password']
    });
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  // Password validation
  if (password.length < 1) {
    res.status(400).json({ error: 'Password is required' });
    return;
  }

  next();
}
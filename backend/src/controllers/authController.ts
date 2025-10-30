import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { RegisterRequest, LoginRequest } from '../middleware/validation';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body as RegisterRequest;

      const user = await authService.registerUser(userData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      console.error('Registration error:', error);

      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          res.status(409).json({
            success: false,
            error: error.message
          });
          return;
        }

        res.status(500).json({
          success: false,
          error: 'Internal server error',
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log('🚀 Login controller hit');
      console.log('📥 Request body:', req.body);

      const { usr_uname, usr_passwd } = req.body as LoginRequest;
      console.log('📋 Extracted - username:', usr_uname, 'password length:', usr_passwd?.length);

      const result = await authService.loginUser(usr_uname, usr_passwd);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);

      if (error instanceof Error) {
        if (error.message.includes('Invalid username or password') ||
            error.message.includes('Account is not active')) {
          res.status(401).json({
            success: false,
            error: error.message
          });
          return;
        }

        res.status(500).json({
          success: false,
          error: 'Internal server error',
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // User ID will be set by authentication middleware
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      // For JWT-based logout, we typically inform the client to discard the token
      // In a more advanced implementation, you could maintain a blacklist of tokens
      res.status(200).json({
        success: true,
        message: 'Logout successful. Please discard your token.',
        // Note: JWT tokens are stateless, so actual logout happens on client side
        // by removing the token from storage
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      console.log('🚀 Forgot password controller hit');
      console.log('📥 Request body:', req.body);

      const { email } = req.body;

      if (!email || !email.trim()) {
        res.status(400).json({
          success: false,
          error: 'Email is required'
        });
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        res.status(400).json({
          success: false,
          error: 'Please enter a valid email address'
        });
        return;
      }

      const result = await authService.forgotPassword(email.trim());

      res.status(200).json({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      console.error('Forgot password error:', error);

      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      console.log('🚀 Reset password controller hit');
      console.log('📥 Request body:', req.body);

      const { verificationCode, newPassword } = req.body;

      if (!verificationCode || !verificationCode.trim()) {
        res.status(400).json({
          success: false,
          error: 'Verification code is required'
        });
        return;
      }

      if (!newPassword || !newPassword.trim()) {
        res.status(400).json({
          success: false,
          error: 'New password is required'
        });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long'
        });
        return;
      }

      const result = await authService.resetPassword(verificationCode.trim(), newPassword.trim());

      res.status(200).json({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      console.error('Reset password error:', error);

      if (error instanceof Error) {
        if (error.message.includes('Invalid or expired verification code') ||
            error.message.includes('Account is not active')) {
          res.status(400).json({
            success: false,
            error: error.message
          });
          return;
        }

        res.status(500).json({
          success: false,
          error: 'Internal server error',
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }
}
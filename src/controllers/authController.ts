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
      const { email, password } = req.body as LoginRequest;

      const result = await authService.loginUser(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);

      if (error instanceof Error) {
        if (error.message.includes('Invalid email or password') ||
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
}
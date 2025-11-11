import { Request, Response } from 'express';
import prisma from '../config/database';
import path from 'path';
import fs from 'fs';

export class VendorController {
  async getVendorProfile(req: Request, res: Response): Promise<void> {
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

      // Get user data
      const user = await prisma.nasso_users.findUnique({
        where: { usr_Id: userId },
        select: {
          usr_Id: true,
          usr_uname: true,
          usr_posio: true,
          usr_status: true,
          usr_email: true,
          usr_phone: true,
          usr_county: true,
          usr_photo: true,
          full_name: true,
          join_date: true
        }
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Check if user is a vendor
      if (user.usr_posio !== 'vendor' && user.usr_posio !== 'traders') {
        res.status(403).json({
          success: false,
          error: 'Access denied. Vendor privileges required.'
        });
        return;
      }

      // Get account balance and financial data
      const account = await prisma.nasso_accounts.findFirst({
        where: { ac_usr: user.usr_uname },
        select: {
          ac_balance: true,
          ac_profit: true,
          ac_bonus: true,
          ac_withdraw: true
        }
      });

      // Get vendor's products count
      const productsCount = await prisma.tbl_products.count({
        where: { seller_nm: userId }
      });

      // Get vendor's orders count (FIXED: Use seller_id instead of o_user)
      const ordersCount = await prisma.tbl_sh_orders.count({
        where: { seller_id: userId }
      });

      const vendorData = {
        user: {
          id: user.usr_Id,
          username: user.usr_uname,
          fullName: user.full_name || 'Vendor',
          email: user.usr_email,
          phone: user.usr_phone,
          country: user.usr_county,
          photo: user.usr_photo,
          joinDate: user.join_date,
          status: user.usr_status,
          position: user.usr_posio
        },
        finances: {
          balance: account?.ac_balance?.toString() || '0',
          profit: account?.ac_profit?.toString() || '0',
          bonus: account?.ac_bonus?.toString() || '0',
          totalWithdrawn: account?.ac_withdraw?.toString() || '0'
        },
        stats: {
          totalProducts: productsCount,
          totalOrders: ordersCount,
          monthlySales: '0',
          totalRevenue: '0'
        }
      };

      res.status(200).json({
        success: true,
        data: vendorData
      });
    } catch (error) {
      console.error('Get vendor profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getVendorStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Get vendor's products
      const products = await prisma.tbl_products.findMany({
        where: { seller_nm: userId },
        select: {
          pro_ID: true,
          pro_name: true,
          pro_price: true,
          pro_status: true,
          pro_date: true
        }
      });

      // Get vendor's orders (FIXED: Use seller_id instead of o_user)
      const orders = await prisma.tbl_sh_orders.findMany({
        where: { seller_id: userId },
        select: {
          o_ID: true,
          o_pro_Id: true,
          o_date: true,
          oda_status: true,
          o_idadi: true
        }
      });

      // Calculate statistics
      const activeProducts = products.filter((p: any) => p.pro_status === 'Approved').length;
      const pendingProducts = products.filter((p: any) => p.pro_status === 'Not Approved').length;
      const totalOrders = orders.length;
      const completedOrders = orders.filter((o: any) => o.oda_status === 'Completed').length;

      // Calculate basic statistics (simplified for now)
      const totalRevenue = 0; // Will be calculated properly in frontend
      const totalEarnings = 0; // Will be calculated properly in frontend
      const monthlySales = 0; // Will be calculated properly in frontend

      const stats = {
        products: {
          total: products.length,
          active: activeProducts,
          pending: pendingProducts
        },
        orders: {
          total: totalOrders,
          completed: completedOrders
        },
        revenue: {
          total: totalRevenue.toString(),
          monthly: monthlySales.toString(),
          earnings: totalEarnings.toString()
        }
      };

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get vendor stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getVendorProducts(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const products = await prisma.tbl_products.findMany({
        where: { seller_nm: userId },
        include: {
          pro_photo: {
            select: {
              p_ID: true,
              p_path: true
            }
          }
        },
        orderBy: { pro_ID: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Get vendor products error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async updateVendorProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const { fullName, email, phone, country } = req.body;

      // Validate required fields
      if (fullName && typeof fullName !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Full name must be a string'
        });
        return;
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
        return;
      }

      // Update user profile
      const updatedUser = await prisma.nasso_users.update({
        where: { usr_Id: userId },
        data: {
          ...(fullName && { full_name: fullName.trim() }),
          ...(email && { usr_email: email.trim() }),
          ...(phone && { usr_phone: phone.trim() }),
          ...(country && { usr_county: country.trim() })
        },
        select: {
          usr_Id: true,
          usr_uname: true,
          usr_posio: true,
          usr_status: true,
          usr_email: true,
          usr_phone: true,
          usr_county: true,
          usr_photo: true,
          full_name: true,
          join_date: true
        }
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updatedUser.usr_Id,
          username: updatedUser.usr_uname,
          fullName: updatedUser.full_name || 'Vendor',
          email: updatedUser.usr_email,
          phone: updatedUser.usr_phone,
          country: updatedUser.usr_county,
          photo: updatedUser.usr_photo,
          joinDate: updatedUser.join_date,
          status: updatedUser.usr_status,
          position: updatedUser.usr_posio
        }
      });
    } catch (error) {
      console.error('Update vendor profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async uploadProfilePicture(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
        return;
      }

      const file = req.file;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        // Delete uploaded file if invalid type
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        res.status(400).json({
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
        });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        res.status(400).json({
          success: false,
          error: 'File size too large. Maximum size is 5MB.'
        });
        return;
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'uploads', 'profile-pictures');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `vendor_${userId}_${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      // Move file to uploads directory
      fs.renameSync(file.path, filePath);

      // Generate file URL (relative to server root)
      const fileUrl = `/uploads/profile-pictures/${fileName}`;

      // Update user's photo in database
      await prisma.nasso_users.update({
        where: { usr_Id: userId },
        data: { usr_photo: fileUrl }
      });

      res.status(200).json({
        success: true,
        message: 'Profile picture uploaded successfully',
        data: {
          photoUrl: fileUrl,
          fileName: fileName
        }
      });
    } catch (error) {
      console.error('Upload profile picture error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
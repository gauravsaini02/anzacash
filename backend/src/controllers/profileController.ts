import { Request, Response } from 'express';
import prisma from '../config/database';

export class ProfileController {
  // Get seller profile
  async getSellerProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Get basic user info
      const user = await prisma.nasso_users.findUnique({
        where: { usr_Id: userId },
        select: {
          usr_Id: true,
          usr_uname: true,
          usr_email: true,
          usr_phone: true,
          usr_county: true,
          usr_photo: true,
          full_name: true,
          join_date: true,
          usr_posio: true,
          usr_status: true
        }
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Check if user is a seller
      if (user.usr_posio !== 'vendor' && user.usr_posio !== 'traders') {
        res.status(403).json({
          success: false,
          error: 'Access denied. Seller privileges required.'
        });
        return;
      }

      // Get seller profile - check if table exists first
      let sellerProfile = null;
      try {
        sellerProfile = await prisma.$queryRaw`SELECT * FROM tbl_seller_profiles WHERE user_id = ${userId}`;
      } catch (error) {
        // Table doesn't exist, create basic profile
        sellerProfile = null;
      }

      // Get seller stats
      const [productsCount, ordersCount, completedOrders] = await Promise.all([
        prisma.tbl_products.count({
          where: { seller_nm: userId }
        }),
        prisma.tbl_sh_orders.count({
          where: { seller_id: userId }
        }),
        prisma.tbl_sh_orders.count({
          where: {
            seller_id: userId,
            oda_status: 'Completed'
          }
        })
      ]);

      // Get account balance
      const account = await prisma.nasso_accounts.findFirst({
        where: { ac_usr: user.usr_uname },
        select: {
          ac_balance: true,
          ac_profit: true,
          ac_bonus: true,
          ac_withdraw: true
        }
      });

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.usr_Id,
            username: user.usr_uname,
            fullName: user.full_name || 'Seller',
            email: user.usr_email,
            phone: user.usr_phone,
            country: user.usr_county,
            photo: user.usr_photo,
            joinDate: user.join_date,
            status: user.usr_status,
            position: user.usr_posio
          },
          profile: sellerProfile ? (sellerProfile as any)[0] : null,
          finances: {
            balance: account?.ac_balance?.toString() || '0',
            profit: account?.ac_profit?.toString() || '0',
            bonus: account?.ac_bonus?.toString() || '0',
            totalWithdrawn: account?.ac_withdraw?.toString() || '0'
          },
          stats: {
            totalProducts: productsCount,
            totalOrders: ordersCount,
            completedOrders: completedOrders
          }
        }
      });

    } catch (error) {
      console.error('Get seller profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch seller profile'
      });
    }
  }

  // Update seller profile
  async updateSellerProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const {
        business_name,
        business_description,
        business_phone,
        business_email,
        business_address,
        commission_rate
      } = req.body;

      // Check if seller profile exists and update/create
      try {
        const existingProfile = await prisma.$queryRaw`SELECT * FROM tbl_seller_profiles WHERE user_id = ${userId}`;

        if (existingProfile && (existingProfile as any).length > 0) {
          // Update existing profile
          const updateFields = [];
          const values = [];

          if (business_name !== undefined) {
            updateFields.push('business_name = ?');
            values.push(business_name);
          }
          if (business_description !== undefined) {
            updateFields.push('business_description = ?');
            values.push(business_description);
          }
          if (business_phone !== undefined) {
            updateFields.push('business_phone = ?');
            values.push(business_phone);
          }
          if (business_email !== undefined) {
            updateFields.push('business_email = ?');
            values.push(business_email);
          }
          if (business_address !== undefined) {
            updateFields.push('business_address = ?');
            values.push(business_address);
          }
          if (commission_rate !== undefined) {
            updateFields.push('commission_rate = ?');
            values.push(parseFloat(commission_rate));
          }

          if (updateFields.length > 0) {
            values.push(userId);
            await prisma.$queryRaw`UPDATE tbl_seller_profiles SET ${updateFields.join(', ')} WHERE user_id = ${values[values.length - 1]}`;
          }
        } else {
          // Create new profile
          await prisma.$queryRaw`
            INSERT INTO tbl_seller_profiles
            (user_id, business_name, business_description, business_phone, business_email, business_address, commission_rate, verification_status)
            VALUES (${userId}, ${business_name || 'My Business'}, ${business_description || ''}, ${business_phone || null}, ${business_email || null}, ${business_address || null}, ${commission_rate ? parseFloat(commission_rate) : 15.00}, 'pending')
          `;
        }
      } catch (error) {
        // Table doesn't exist or other error
        console.log('Seller profile table not available:', error);
      }

      res.status(200).json({
        success: true,
        message: 'Seller profile updated successfully'
      });

    } catch (error) {
      console.error('Update seller profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update seller profile'
      });
    }
  }

  // Get customer profile
  async getCustomerProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Get basic user info
      const user = await prisma.nasso_users.findUnique({
        where: { usr_Id: userId },
        select: {
          usr_Id: true,
          usr_uname: true,
          usr_email: true,
          usr_phone: true,
          usr_county: true,
          usr_photo: true,
          full_name: true,
          join_date: true,
          usr_posio: true,
          usr_status: true
        }
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Get customer profile
      let customerProfile = null;
      try {
        customerProfile = await prisma.$queryRaw`SELECT * FROM tbl_customer_profiles WHERE user_id = ${userId}`;
      } catch (error) {
        customerProfile = null;
      }

      // Get customer stats
      const ordersCount = await prisma.tbl_sh_orders.count({
        where: { customer_id: userId }
      });

      // Calculate actual total spent
      const orders = await prisma.tbl_sh_orders.findMany({
        where: {
          customer_id: userId,
          oda_status: 'Completed'
        }
      });

      let actualTotalSpent = 0;
      for (const order of orders) {
        const product = await prisma.tbl_products.findUnique({
          where: { pro_ID: order.o_pro_Id || 0 },
          select: { pro_price: true }
        });
        if (product && product.pro_price) {
          actualTotalSpent += product.pro_price * (order.o_idadi || 1);
        }
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.usr_Id,
            username: user.usr_uname,
            fullName: user.full_name || 'Customer',
            email: user.usr_email,
            phone: user.usr_phone,
            country: user.usr_county,
            photo: user.usr_photo,
            joinDate: user.join_date,
            status: user.usr_status,
            position: user.usr_posio
          },
          profile: customerProfile ? customerProfile[0] : null,
          stats: {
            totalOrders: ordersCount,
            totalSpent: actualTotalSpent,
            loyaltyPoints: (customerProfile as any)?.[0]?.loyalty_points || 0
          }
        }
      });

    } catch (error) {
      console.error('Get customer profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch customer profile'
      });
    }
  }

  // Update customer profile
  async updateCustomerProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const {
        shipping_address,
        billing_address,
        phone_number,
        preferences
      } = req.body;

      // Check if customer profile exists and update/create
      try {
        const existingProfile = await prisma.$queryRaw`SELECT * FROM tbl_customer_profiles WHERE user_id = ${userId}`;

        if (existingProfile && (existingProfile as any).length > 0) {
          // Update existing profile
          const updateFields = [];
          const values = [];

          if (shipping_address !== undefined) {
            updateFields.push('shipping_address = ?');
            values.push(shipping_address);
          }
          if (billing_address !== undefined) {
            updateFields.push('billing_address = ?');
            values.push(billing_address);
          }
          if (phone_number !== undefined) {
            updateFields.push('phone_number = ?');
            values.push(phone_number);
          }
          if (preferences !== undefined) {
            updateFields.push('preferences = ?');
            values.push(JSON.stringify(preferences));
          }

          if (updateFields.length > 0) {
            values.push(userId);
            await prisma.$queryRaw`UPDATE tbl_customer_profiles SET ${updateFields.join(', ')} WHERE user_id = ${values[values.length - 1]}`;
          }
        } else {
          // Create new profile
          await prisma.$queryRaw`
            INSERT INTO tbl_customer_profiles
            (user_id, shipping_address, billing_address, phone_number, preferences, loyalty_points, total_orders, total_spent)
            VALUES (${userId}, ${shipping_address || null}, ${billing_address || null}, ${phone_number || null}, ${preferences ? JSON.stringify(preferences) : null}, 0, 0, 0.00)
          `;
        }
      } catch (error) {
        console.log('Customer profile table not available:', error);
      }

      // Also update basic user info if provided
      const { fullName, email, country } = req.body;
      if (fullName || email || country) {
        const userUpdateData: any = {};
        if (fullName) userUpdateData.full_name = fullName;
        if (email) userUpdateData.usr_email = email;
        if (country) userUpdateData.usr_county = country;

        await prisma.nasso_users.update({
          where: { usr_Id: userId },
          data: userUpdateData
        });
      }

      res.status(200).json({
        success: true,
        message: 'Customer profile updated successfully'
      });

    } catch (error) {
      console.error('Update customer profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update customer profile'
      });
    }
  }

  // Get public seller profile (for customers to view)
  async getPublicSellerProfile(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params;

      if (!sellerId) {
        res.status(400).json({
          success: false,
          error: 'Seller ID is required'
        });
        return;
      }

      // Get seller info
      const seller = await prisma.nasso_users.findUnique({
        where: { usr_Id: parseInt(sellerId) },
        select: {
          usr_Id: true,
          usr_uname: true,
          full_name: true,
          usr_county: true,
          usr_photo: true,
          join_date: true
        }
      });

      if (!seller) {
        res.status(404).json({
          success: false,
          error: 'Seller not found'
        });
        return;
      }

      // Get seller profile
      let sellerProfile = null;
      try {
        sellerProfile = await prisma.$queryRaw`SELECT * FROM tbl_seller_profiles WHERE user_id = ${parseInt(sellerId)}`;
      } catch (error) {
        sellerProfile = null;
      }

      // Get seller stats
      const [productsCount, completedOrders] = await Promise.all([
        prisma.tbl_products.count({
          where: {
            seller_nm: parseInt(sellerId),
            pro_status: 'Approved'
          }
        }),
        prisma.tbl_sh_orders.count({
          where: {
            seller_id: parseInt(sellerId),
            oda_status: 'Completed'
          }
        })
      ]);

      // Get seller's active products
      const products = await prisma.tbl_products.findMany({
        where: {
          seller_nm: parseInt(sellerId),
          pro_status: 'Approved'
        },
        select: {
          pro_ID: true,
          pro_name: true,
          pro_price: true,
          pro_category: true
        },
        take: 10,
        orderBy: { pro_ID: 'desc' }
      });

      // Get product photos
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const photo = await prisma.pro_photo.findFirst({
            where: { pro_ID: product.pro_ID },
            select: { p_path: true }
          });

          return {
            id: product.pro_ID,
            name: product.pro_name,
            price: product.pro_price,
            category: product.pro_category,
            image: photo?.p_path || null
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          seller: {
            id: seller.usr_Id,
            username: seller.usr_uname,
            fullName: seller.full_name || 'Seller',
            country: seller.usr_county,
            photo: seller.usr_photo,
            joinDate: seller.join_date
          },
          profile: sellerProfile ? (sellerProfile as any)[0] : null,
          stats: {
            totalProducts: productsCount,
            completedOrders: completedOrders,
            averageRating: sellerProfile?.[0]?.rating || 0.0
          },
          products: productsWithImages
        }
      });

    } catch (error) {
      console.error('Get public seller profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch seller profile'
      });
    }
  }
}
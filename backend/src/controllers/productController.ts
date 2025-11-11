import { Request, Response } from 'express';
import prisma from '../config/database';

export class ProductController {
  // Create a new product
  async createProduct(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const {
        name,
        description,
        shortDescription,
        price,
        salePrice,
        sku,
        stockQuantity,
        lowStockAlert,
        commission,
        category,
        subcategory,
        weight,
        shippingClass,
        dimensions,
        videoUrl,
        metaTitle,
        metaDescription,
        status
      } = req.body;

      console.log('🚀 Creating product with data:', {
        name,
        price,
        category,
        userId,
        commission
      });

      // Get seller profile to use default commission if not provided
      let defaultCommission = 15; // Default commission
      try {
        const sellerProfile = await prisma.$queryRaw`SELECT commission_rate FROM tbl_seller_profiles WHERE user_id = ${userId}`;
        if (sellerProfile && (sellerProfile as any).length > 0 && (sellerProfile as any)[0].commission_rate) {
          defaultCommission = (sellerProfile as any)[0].commission_rate;
        }
      } catch (error) {
        // Profile table doesn't exist, use default commission
      }

      // Get current date
      const currentDate = new Date().toISOString().split('T')[0];

      // Create the product
      const newProduct = await prisma.tbl_products.create({
        data: {
          pro_name: name || 'Untitled Product',
          pro_des: description || '',
          pro_price: parseFloat(price) || 0,
          pro_category: category || 'General',
          sel_comisio: parseInt(commission) || defaultCommission,
          seller_nm: userId,
          pro_status: status === 'Published' ? 'Approved' : 'Pending',
          pro_date: currentDate,
          pro_location: subcategory || '',
          pro_country: 'Tanzania',
          // Additional fields we might want to store in description or separate handling
          // For now, we'll store extra details as JSON in description
        },
      });

      console.log('✅ Product created successfully:', newProduct);

      // If there are product images, handle them separately
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          await prisma.pro_photo.create({
            data: {
              pro_ID: newProduct.pro_ID,
              p_path: `/uploads/products/${file.filename}`,
              user_Id: userId,
            },
          });
        }
      }

      res.status(201).json({
        message: 'Product created successfully',
        data: {
          id: newProduct.pro_ID,
          name: newProduct.pro_name,
          description: newProduct.pro_des,
          price: newProduct.pro_price,
          category: newProduct.pro_category,
          commission: newProduct.sel_comisio,
          status: newProduct.pro_status,
          date: newProduct.pro_date,
        },
      });
    } catch (error) {
      console.error('❌ Error creating product:', error);
      res.status(500).json({
        error: 'Failed to create product',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get all products for a vendor
  async getVendorProducts(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const products = await prisma.tbl_products.findMany({
        where: {
          seller_nm: userId,
        },
        include: {
          pro_photo: true,
        },
        orderBy: {
          pro_ID: 'desc',
        },
      });

      // Get seller profile information
      let sellerProfile = null;
      try {
        sellerProfile = await prisma.$queryRaw`SELECT * FROM tbl_seller_profiles WHERE user_id = ${userId}`;
      } catch (error) {
        // Profile table doesn't exist, continue without it
      }

      const formattedProducts = products.map((product: any) => ({
        id: product.pro_ID,
        name: product.pro_name,
        description: product.pro_des,
        price: product.pro_price,
        category: product.pro_category,
        commission: product.sel_comisio,
        status: product.pro_status,
        date: product.pro_date,
        location: product.pro_location,
        country: product.pro_country,
        images: product.pro_photo.map((photo: any) => ({
          id: photo.p_ID,
          path: photo.p_path,
        })),
        sellerInfo: {
          id: userId,
          businessName: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0].business_name : null,
          verificationStatus: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0].verification_status : 'pending'
        }
      }));

      res.json({
        message: 'Products retrieved successfully',
        data: formattedProducts,
        sellerProfile: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0] : null
      });
    } catch (error) {
      console.error('❌ Error fetching vendor products:', error);
      res.status(500).json({
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get a single product by ID
  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const product = await prisma.tbl_products.findFirst({
        where: {
          pro_ID: parseInt(id),
          seller_nm: userId,
        },
        include: {
          pro_photo: true,
        },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const formattedProduct = {
        id: product.pro_ID,
        name: product.pro_name,
        description: product.pro_des,
        price: product.pro_price,
        category: product.pro_category,
        commission: product.sel_comisio,
        status: product.pro_status,
        date: product.pro_date,
        location: product.pro_location,
        country: product.pro_country,
        images: product.pro_photo.map((photo: any) => ({
          id: photo.p_ID,
          path: photo.p_path,
        })),
      };

      res.json({
        message: 'Product retrieved successfully',
        data: formattedProduct,
      });
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      res.status(500).json({
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Update a product
  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const updateData = req.body;

      const existingProduct = await prisma.tbl_products.findFirst({
        where: {
          pro_ID: parseInt(id),
          seller_nm: userId,
        },
      });

      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const updatedProduct = await prisma.tbl_products.update({
        where: {
          pro_ID: parseInt(id),
        },
        data: {
          ...(updateData.name && { pro_name: updateData.name }),
          ...(updateData.description && { pro_des: updateData.description }),
          ...(updateData.price !== undefined && { pro_price: updateData.price }),
          ...(updateData.category && { pro_category: updateData.category }),
          ...(updateData.commission !== undefined && { sel_comisio: updateData.commission }),
          ...(updateData.status && { pro_status: updateData.status }),
          ...(updateData.location && { pro_location: updateData.location }),
        },
      });

      res.json({
        message: 'Product updated successfully',
        data: {
          id: updatedProduct.pro_ID,
          name: updatedProduct.pro_name,
          description: updatedProduct.pro_des,
          price: updatedProduct.pro_price,
          category: updatedProduct.pro_category,
          commission: updatedProduct.sel_comisio,
          status: updatedProduct.pro_status,
        },
      });
    } catch (error) {
      console.error('❌ Error updating product:', error);
      res.status(500).json({
        error: 'Failed to update product',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Delete a product
  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const existingProduct = await prisma.tbl_products.findFirst({
        where: {
          pro_ID: parseInt(id),
          seller_nm: userId,
        },
      });

      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Delete product and related images (cascade should handle this)
      await prisma.tbl_products.delete({
        where: {
          pro_ID: parseInt(id),
        },
      });

      res.json({
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      res.status(500).json({
        error: 'Failed to delete product',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get all approved products for customers (with seller information)
  async getProductsForCustomers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, category, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const whereClause: any = {
        pro_status: 'Approved'
      };

      if (category && category !== 'all') {
        whereClause.pro_category = category;
      }

      if (search) {
        whereClause.pro_name = {
          contains: search as string,
          mode: 'insensitive'
        };
      }

      const products = await prisma.tbl_products.findMany({
        where: whereClause,
        include: {
          pro_photo: {
            select: { p_path: true },
            take: 1
          }
        },
        orderBy: { pro_ID: 'desc' },
        skip,
        take: Number(limit)
      });

      // Get seller information for each product
      const productsWithSellers = await Promise.all(
        products.map(async (product) => {
          const seller = await prisma.nasso_users.findUnique({
            where: { usr_Id: product.seller_nm || 0 },
            select: {
              usr_Id: true,
              usr_uname: true,
              full_name: true,
              usr_county: true,
              usr_photo: true
            }
          });

          // Get seller profile if available
          let sellerProfile = null;
          try {
            sellerProfile = await prisma.$queryRaw`SELECT business_name, verification_status, rating FROM tbl_seller_profiles WHERE user_id = ${product.seller_nm}`;
          } catch (error) {
            // Profile table doesn't exist
          }

          return {
            id: product.pro_ID,
            name: product.pro_name,
            description: product.pro_des,
            price: product.pro_price,
            category: product.pro_category,
            commission: product.sel_comisio,
            location: product.pro_location,
            country: product.pro_country,
            date: product.pro_date,
            image: product.pro_photo[0]?.p_path || null,
            seller: seller ? {
              id: seller.usr_Id,
              username: seller.usr_uname,
              fullName: seller.full_name || 'Seller',
              country: seller.usr_county,
              photo: seller.usr_photo,
              businessName: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0].business_name : null,
              verificationStatus: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0].verification_status : 'pending',
              rating: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0].rating : 0
            } : null
          };
        })
      );

      const total = await prisma.tbl_products.count({
        where: whereClause
      });

      res.status(200).json({
        success: true,
        data: {
          products: productsWithSellers,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalProducts: total,
            hasMore: skip + Number(limit) < total
          }
        }
      });

    } catch (error) {
      console.error('❌ Error fetching products for customers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get product details for customers
  async getProductDetailsForCustomers(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product = await prisma.tbl_products.findFirst({
        where: {
          pro_ID: parseInt(id),
          pro_status: 'Approved'
        },
        include: {
          pro_photo: {
            select: { p_path: true }
          }
        }
      });

      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      // Get seller information
      const seller = await prisma.nasso_users.findUnique({
        where: { usr_Id: product.seller_nm || 0 },
        select: {
          usr_Id: true,
          usr_uname: true,
          full_name: true,
          usr_email: true,
          usr_phone: true,
          usr_county: true,
          usr_photo: true,
          join_date: true
        }
      });

      // Get seller profile if available
      let sellerProfile = null;
      try {
        sellerProfile = await prisma.$queryRaw`SELECT * FROM tbl_seller_profiles WHERE user_id = ${product.seller_nm}`;
      } catch (error) {
        // Profile table doesn't exist
      }

      const productDetails = {
        id: product.pro_ID,
        name: product.pro_name,
        description: product.pro_des,
        price: product.pro_price,
        category: product.pro_category,
        commission: product.sel_comisio,
        location: product.pro_location,
        country: product.pro_country,
        date: product.pro_date,
        images: product.pro_photo.map(photo => photo.p_path),
        seller: seller ? {
          id: seller.usr_Id,
          username: seller.usr_uname,
          fullName: seller.full_name || 'Seller',
          email: seller.usr_email,
          phone: seller.usr_phone,
          country: seller.usr_county,
          photo: seller.usr_photo,
          joinDate: seller.join_date,
          businessName: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0].business_name : null,
          businessDescription: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0].business_description : null,
          businessEmail: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0].business_email : null,
          businessPhone: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0].business_phone : null,
          verificationStatus: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0].verification_status : 'pending',
          rating: sellerProfile && (sellerProfile as any).length > 0 ? (sellerProfile as any)[0].rating : 0
        } : null
      };

      res.status(200).json({
        success: true,
        data: productDetails
      });

    } catch (error) {
      console.error('❌ Error fetching product details for customers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch product details',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
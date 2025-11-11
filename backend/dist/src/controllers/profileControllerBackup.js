"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const database_1 = __importDefault(require("../config/database"));
class ProfileController {
    // Get seller profile
    async getSellerProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            // Get basic user info
            const user = await database_1.default.nasso_users.findUnique({
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
            // Get seller profile
            let sellerProfile = await database_1.default.tbl_seller_profiles.findUnique({
                where: { user_id: userId }
            });
            // If no profile exists, create one
            if (!sellerProfile) {
                sellerProfile = await database_1.default.tbl_seller_profiles.create({
                    data: {
                        user_id: userId,
                        business_name: `${user.full_name || user.usr_uname}'s Business`,
                        commission_rate: 15.00,
                        verification_status: 'pending'
                    }
                });
            }
            // Get seller stats
            const [productsCount, ordersCount, completedOrders] = await Promise.all([
                database_1.default.tbl_products.count({
                    where: { seller_nm: userId }
                }),
                database_1.default.tbl_sh_orders.count({
                    where: { seller_id: userId }
                }),
                database_1.default.tbl_sh_orders.count({
                    where: {
                        seller_id: userId,
                        oda_status: 'Completed'
                    }
                })
            ]);
            // Get account balance
            const account = await database_1.default.nasso_accounts.findFirst({
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
                    profile: sellerProfile,
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
        }
        catch (error) {
            console.error('Get seller profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch seller profile'
            });
        }
    }
    // Update seller profile
    async updateSellerProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            const { business_name, business_description, business_phone, business_email, business_address, commission_rate } = req.body;
            // Check if seller profile exists
            let sellerProfile = await database_1.default.tbl_seller_profiles.findUnique({
                where: { user_id: userId }
            });
            if (!sellerProfile) {
                // Create profile if it doesn't exist
                sellerProfile = await database_1.default.tbl_seller_profiles.create({
                    data: {
                        user_id: userId,
                        business_name: business_name || 'My Business',
                        business_description: business_description || '',
                        business_phone: business_phone || null,
                        business_email: business_email || null,
                        business_address: business_address || null,
                        commission_rate: commission_rate ? parseFloat(commission_rate) : 15.00,
                        verification_status: 'pending'
                    }
                });
            }
            else {
                // Update existing profile
                const updateData = {};
                if (business_name !== undefined)
                    updateData.business_name = business_name;
                if (business_description !== undefined)
                    updateData.business_description = business_description;
                if (business_phone !== undefined)
                    updateData.business_phone = business_phone;
                if (business_email !== undefined)
                    updateData.business_email = business_email;
                if (business_address !== undefined)
                    updateData.business_address = business_address;
                if (commission_rate !== undefined)
                    updateData.commission_rate = parseFloat(commission_rate);
                sellerProfile = await database_1.default.tbl_seller_profiles.update({
                    where: { user_id: userId },
                    data: updateData
                });
            }
            res.status(200).json({
                success: true,
                message: 'Seller profile updated successfully',
                data: sellerProfile
            });
        }
        catch (error) {
            console.error('Update seller profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update seller profile'
            });
        }
    }
    // Get customer profile
    async getCustomerProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            // Get basic user info
            const user = await database_1.default.nasso_users.findUnique({
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
            let customerProfile = await database_1.default.tbl_customer_profiles.findUnique({
                where: { user_id: userId }
            });
            // If no profile exists, create one
            if (!customerProfile) {
                customerProfile = await database_1.default.tbl_customer_profiles.create({
                    data: {
                        user_id: userId,
                        loyalty_points: 0,
                        total_orders: 0,
                        total_spent: 0.00
                    }
                });
            }
            // Get customer stats
            const [ordersCount, totalSpent] = await Promise.all([
                database_1.default.tbl_sh_orders.count({
                    where: { customer_id: userId }
                }),
                database_1.default.tbl_sh_orders.aggregate({
                    where: {
                        customer_id: userId,
                        oda_status: 'Completed'
                    },
                    _sum: {
                    // This is a simplified calculation, in real implementation you'd join with products
                    }
                })
            ]);
            // Calculate actual total spent
            const orders = await database_1.default.tbl_sh_orders.findMany({
                where: {
                    customer_id: userId,
                    oda_status: 'Completed'
                },
                include: {
                    tbl_products: {
                        select: {
                            pro_price: true
                        }
                    }
                }
            });
            const actualTotalSpent = orders.reduce((sum, order) => {
                return sum + (order.tbl_products.pro_price * order.o_idadi);
            }, 0);
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
                    profile: {
                        ...customerProfile,
                        total_orders: ordersCount,
                        total_spent: actualTotalSpent
                    },
                    stats: {
                        totalOrders: ordersCount,
                        totalSpent: actualTotalSpent,
                        loyaltyPoints: customerProfile.loyalty_points
                    }
                }
            });
        }
        catch (error) {
            console.error('Get customer profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch customer profile'
            });
        }
    }
    // Update customer profile
    async updateCustomerProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            const { shipping_address, billing_address, phone_number, preferences } = req.body;
            // Check if customer profile exists
            let customerProfile = await database_1.default.tbl_customer_profiles.findUnique({
                where: { user_id: userId }
            });
            if (!customerProfile) {
                // Create profile if it doesn't exist
                customerProfile = await database_1.default.tbl_customer_profiles.create({
                    data: {
                        user_id: userId,
                        shipping_address: shipping_address || null,
                        billing_address: billing_address || null,
                        phone_number: phone_number || null,
                        preferences: preferences ? JSON.stringify(preferences) : null,
                        loyalty_points: 0,
                        total_orders: 0,
                        total_spent: 0.00
                    }
                });
            }
            else {
                // Update existing profile
                const updateData = {};
                if (shipping_address !== undefined)
                    updateData.shipping_address = shipping_address;
                if (billing_address !== undefined)
                    updateData.billing_address = billing_address;
                if (phone_number !== undefined)
                    updateData.phone_number = phone_number;
                if (preferences !== undefined)
                    updateData.preferences = preferences ? JSON.stringify(preferences) : null;
                customerProfile = await database_1.default.tbl_customer_profiles.update({
                    where: { user_id: userId },
                    data: updateData
                });
            }
            // Also update basic user info if provided
            const { fullName, email, country } = req.body;
            if (fullName || email || country) {
                const userUpdateData = {};
                if (fullName)
                    userUpdateData.full_name = fullName;
                if (email)
                    userUpdateData.usr_email = email;
                if (country)
                    userUpdateData.usr_county = country;
                await database_1.default.nasso_users.update({
                    where: { usr_Id: userId },
                    data: userUpdateData
                });
            }
            res.status(200).json({
                success: true,
                message: 'Customer profile updated successfully',
                data: customerProfile
            });
        }
        catch (error) {
            console.error('Update customer profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update customer profile'
            });
        }
    }
    // Get public seller profile (for customers to view)
    async getPublicSellerProfile(req, res) {
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
            const seller = await database_1.default.nasso_users.findUnique({
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
            const sellerProfile = await database_1.default.tbl_seller_profiles.findUnique({
                where: { user_id: parseInt(sellerId) }
            });
            // Get seller stats
            const [productsCount, completedOrders, averageRating] = await Promise.all([
                database_1.default.tbl_products.count({
                    where: {
                        seller_nm: parseInt(sellerId),
                        pro_status: 'Approved'
                    }
                }),
                database_1.default.tbl_sh_orders.count({
                    where: {
                        seller_id: parseInt(sellerId),
                        oda_status: 'Completed'
                    }
                }),
                // This would come from a reviews/ratings table in a full implementation
                Promise.resolve(sellerProfile?.rating || 0.0)
            ]);
            // Get seller's active products
            const products = await database_1.default.tbl_products.findMany({
                where: {
                    seller_nm: parseInt(sellerId),
                    pro_status: 'Approved'
                },
                select: {
                    pro_ID: true,
                    pro_name: true,
                    pro_price: true,
                    pro_category: true,
                    pro_photo: {
                        select: {
                            p_path: true
                        },
                        take: 1
                    }
                },
                take: 10,
                orderBy: { pro_ID: 'desc' }
            });
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
                    profile: sellerProfile,
                    stats: {
                        totalProducts: productsCount,
                        completedOrders: completedOrders,
                        averageRating: averageRating
                    },
                    products: products.map(product => ({
                        id: product.pro_ID,
                        name: product.pro_name,
                        price: product.pro_price,
                        category: product.pro_category,
                        image: product.pro_photo[0]?.p_path || null
                    }))
                }
            });
        }
        catch (error) {
            console.error('Get public seller profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch seller profile'
            });
        }
    }
}
exports.ProfileController = ProfileController;

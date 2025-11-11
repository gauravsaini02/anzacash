"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const database_1 = __importDefault(require("../config/database"));
class OrderController {
    // Create a new order
    async createOrder(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            const { productId, quantity = 1 } = req.body;
            if (!productId) {
                res.status(400).json({
                    success: false,
                    error: 'Product ID is required'
                });
                return;
            }
            // Get product information to find the seller
            const product = await database_1.default.tbl_products.findUnique({
                where: { pro_ID: parseInt(productId) }
            });
            if (!product) {
                res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
                return;
            }
            if (product.pro_status !== 'Approved') {
                res.status(400).json({
                    success: false,
                    error: 'Product is not available for purchase'
                });
                return;
            }
            // Get seller information
            const seller = await database_1.default.nasso_users.findUnique({
                where: { usr_Id: product.seller_nm || 0 },
                select: {
                    usr_Id: true,
                    usr_uname: true,
                    usr_email: true,
                    full_name: true
                }
            });
            // Generate unique order ID
            const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
            // Create the order with proper customer and seller tracking
            const newOrder = await database_1.default.tbl_sh_orders.create({
                data: {
                    order_ID: orderNumber,
                    o_pro_Id: product.pro_ID,
                    o_user: userId, // Keep for backward compatibility
                    customer_id: userId, // NEW: Proper customer tracking
                    seller_id: product.seller_nm, // NEW: Proper seller tracking
                    o_idadi: quantity,
                    o_date: new Date().toISOString(),
                    oda_status: 'Pending',
                    o_delivery: 'Not Received',
                    o_datetimes: new Date().toISOString()
                }
            });
            const price = product.pro_price || 0;
            const totalAmount = price * quantity;
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: {
                    orderId: newOrder.o_ID,
                    orderNumber: newOrder.order_ID,
                    product: {
                        id: product.pro_ID,
                        name: product.pro_name,
                        price: price
                    },
                    seller: seller ? {
                        id: seller.usr_Id,
                        username: seller.usr_uname,
                        fullName: seller.full_name
                    } : null,
                    quantity: quantity,
                    totalAmount: totalAmount,
                    status: newOrder.oda_status,
                    orderDate: newOrder.o_date
                }
            });
        }
        catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create order'
            });
        }
    }
    // Get orders for a customer
    async getCustomerOrders(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            const { page = 1, limit = 10, status } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const whereClause = {
                customer_id: userId
            };
            if (status) {
                whereClause.oda_status = status;
            }
            const orders = await database_1.default.tbl_sh_orders.findMany({
                where: whereClause,
                orderBy: { o_ID: 'desc' },
                skip,
                take: Number(limit)
            });
            // Get product details for each order
            const ordersWithProducts = await Promise.all(orders.map(async (order) => {
                const product = await database_1.default.tbl_products.findUnique({
                    where: { pro_ID: order.o_pro_Id || 0 },
                    include: {
                        pro_photo: {
                            select: { p_path: true },
                            take: 1
                        }
                    }
                });
                const seller = await database_1.default.nasso_users.findUnique({
                    where: { usr_Id: product?.seller_nm || 0 },
                    select: {
                        usr_Id: true,
                        usr_uname: true,
                        full_name: true,
                        usr_email: true,
                        usr_phone: true
                    }
                });
                const price = product?.pro_price || 0;
                const quantity = order.o_idadi || 1;
                return {
                    orderId: order.o_ID,
                    orderNumber: order.order_ID,
                    product: {
                        id: product?.pro_ID,
                        name: product?.pro_name,
                        price: price,
                        image: product?.pro_photo[0]?.p_path || null
                    },
                    seller: seller ? {
                        id: seller.usr_Id,
                        username: seller.usr_uname,
                        fullName: seller.full_name || 'Seller',
                        email: seller.usr_email,
                        phone: seller.usr_phone
                    } : null,
                    quantity: quantity,
                    totalAmount: price * quantity,
                    status: order.oda_status,
                    deliveryStatus: order.o_delivery,
                    orderDate: order.o_date,
                    orderDateTime: order.o_datetimes
                };
            }));
            const total = await database_1.default.tbl_sh_orders.count({
                where: whereClause
            });
            res.status(200).json({
                success: true,
                data: {
                    orders: ordersWithProducts,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(total / Number(limit)),
                        totalOrders: total,
                        hasMore: skip + Number(limit) < total
                    }
                }
            });
        }
        catch (error) {
            console.error('Get customer orders error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch orders'
            });
        }
    }
    // Get orders for a seller
    async getSellerOrders(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            const { page = 1, limit = 10, status } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const whereClause = {
                seller_id: userId
            };
            if (status) {
                whereClause.oda_status = status;
            }
            const orders = await database_1.default.tbl_sh_orders.findMany({
                where: whereClause,
                orderBy: { o_ID: 'desc' },
                skip,
                take: Number(limit)
            });
            // Get product and customer details for each order
            const ordersWithDetails = await Promise.all(orders.map(async (order) => {
                const product = await database_1.default.tbl_products.findUnique({
                    where: { pro_ID: order.o_pro_Id || 0 },
                    include: {
                        pro_photo: {
                            select: { p_path: true },
                            take: 1
                        }
                    }
                });
                const customer = await database_1.default.nasso_users.findUnique({
                    where: { usr_Id: order.customer_id || 0 },
                    select: {
                        usr_Id: true,
                        usr_uname: true,
                        full_name: true,
                        usr_email: true,
                        usr_phone: true
                    }
                });
                const price = product?.pro_price || 0;
                const quantity = order.o_idadi || 1;
                return {
                    orderId: order.o_ID,
                    orderNumber: order.order_ID,
                    product: {
                        id: product?.pro_ID,
                        name: product?.pro_name,
                        price: price,
                        image: product?.pro_photo[0]?.p_path || null
                    },
                    customer: customer ? {
                        id: customer.usr_Id,
                        username: customer.usr_uname,
                        fullName: customer.full_name || 'Customer',
                        email: customer.usr_email,
                        phone: customer.usr_phone
                    } : null,
                    quantity: quantity,
                    totalAmount: price * quantity,
                    status: order.oda_status,
                    deliveryStatus: order.o_delivery,
                    orderDate: order.o_date,
                    orderDateTime: order.o_datetimes
                };
            }));
            const total = await database_1.default.tbl_sh_orders.count({
                where: whereClause
            });
            res.status(200).json({
                success: true,
                data: {
                    orders: ordersWithDetails,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(total / Number(limit)),
                        totalOrders: total,
                        hasMore: skip + Number(limit) < total
                    }
                }
            });
        }
        catch (error) {
            console.error('Get seller orders error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch orders'
            });
        }
    }
    // Update order status
    async updateOrderStatus(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            const { orderId } = req.params;
            const { status, deliveryStatus } = req.body;
            if (!orderId) {
                res.status(400).json({
                    success: false,
                    error: 'Order ID is required'
                });
                return;
            }
            // Get the order to verify seller ownership
            const order = await database_1.default.tbl_sh_orders.findFirst({
                where: {
                    o_ID: parseInt(orderId),
                    seller_id: userId
                }
            });
            if (!order) {
                res.status(404).json({
                    success: false,
                    error: 'Order not found or access denied'
                });
                return;
            }
            const updateData = {};
            if (status)
                updateData.oda_status = status;
            if (deliveryStatus)
                updateData.o_delivery = deliveryStatus;
            const updatedOrder = await database_1.default.tbl_sh_orders.update({
                where: { o_ID: parseInt(orderId) },
                data: updateData
            });
            res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                data: {
                    orderId: updatedOrder.o_ID,
                    orderNumber: updatedOrder.order_ID,
                    status: updatedOrder.oda_status,
                    deliveryStatus: updatedOrder.o_delivery
                }
            });
        }
        catch (error) {
            console.error('Update order status error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update order status'
            });
        }
    }
    // Get order details
    async getOrderDetails(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            const { orderId } = req.params;
            if (!orderId) {
                res.status(400).json({
                    success: false,
                    error: 'Order ID is required'
                });
                return;
            }
            const order = await database_1.default.tbl_sh_orders.findFirst({
                where: {
                    o_ID: parseInt(orderId),
                    OR: [
                        { customer_id: userId },
                        { seller_id: userId }
                    ]
                }
            });
            if (!order) {
                res.status(404).json({
                    success: false,
                    error: 'Order not found'
                });
                return;
            }
            // Get product details
            const product = await database_1.default.tbl_products.findUnique({
                where: { pro_ID: order.o_pro_Id || 0 },
                include: {
                    pro_photo: {
                        select: { p_path: true }
                    }
                }
            });
            // Get other party details
            const isSeller = order.seller_id === userId;
            const otherPartyId = isSeller ? order.customer_id : product?.seller_nm || 0;
            const otherParty = await database_1.default.nasso_users.findUnique({
                where: { usr_Id: otherPartyId },
                select: {
                    usr_Id: true,
                    usr_uname: true,
                    full_name: true,
                    usr_email: true,
                    usr_phone: true
                }
            });
            const price = product?.pro_price || 0;
            const quantity = order.o_idadi || 1;
            const commission = product?.sel_comisio || 0;
            const orderDetails = {
                orderId: order.o_ID,
                orderNumber: order.order_ID,
                product: {
                    id: product?.pro_ID,
                    name: product?.pro_name,
                    price: price,
                    commission: commission,
                    images: product?.pro_photo.map(photo => photo.p_path) || []
                },
                [isSeller ? 'customer' : 'seller']: otherParty ? {
                    id: otherParty.usr_Id,
                    username: otherParty.usr_uname,
                    fullName: otherParty.full_name || (isSeller ? 'Customer' : 'Seller'),
                    email: otherParty.usr_email,
                    phone: otherParty.usr_phone
                } : null,
                quantity: quantity,
                totalAmount: price * quantity,
                commissionAmount: price * quantity * (commission / 100),
                sellerEarnings: price * quantity * (1 - commission / 100),
                status: order.oda_status,
                deliveryStatus: order.o_delivery,
                orderDate: order.o_date,
                orderDateTime: order.o_datetimes,
                userRole: isSeller ? 'seller' : 'customer'
            };
            res.status(200).json({
                success: true,
                data: orderDetails
            });
        }
        catch (error) {
            console.error('Get order details error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch order details'
            });
        }
    }
}
exports.OrderController = OrderController;

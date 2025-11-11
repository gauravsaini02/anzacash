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
            const { productId, quantity = 1, customerInfo } = req.body;
            if (!productId) {
                res.status(400).json({
                    success: false,
                    error: 'Product ID is required'
                });
                return;
            }
            // Get product information to find the seller
            const product = await database_1.default.tbl_products.findUnique({
                where: { pro_ID: parseInt(productId) },
                include: {
                    nasso_users: {
                        select: {
                            usr_Id: true,
                            usr_uname: true,
                            usr_email: true,
                            full_name: true
                        }
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
            if (product.pro_status !== 'Approved') {
                res.status(400).json({
                    success: false,
                    error: 'Product is not available for purchase'
                });
                return;
            }
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
            // Create transaction record
            await database_1.default.tbl_transactions.create({
                data: {
                    user_id: product.seller_nm,
                    order_id: newOrder.o_ID,
                    amount: product.pro_price * quantity,
                    transaction_type: 'sale',
                    description: `Sale of ${product.pro_name} (Order: ${orderNumber})`,
                    reference_id: orderNumber
                }
            });
            // Create customer commission transaction
            const commissionAmount = product.pro_price * quantity * (product.sel_comisio / 100);
            if (commissionAmount > 0) {
                await database_1.default.tbl_transactions.create({
                    data: {
                        user_id: product.seller_nm,
                        order_id: newOrder.o_ID,
                        amount: commissionAmount,
                        transaction_type: 'commission',
                        description: `Commission for order ${orderNumber}`,
                        reference_id: orderNumber
                    }
                });
            }
            // Update inventory if exists
            const inventory = await database_1.default.tbl_inventory.findFirst({
                where: {
                    product_id: product.pro_ID,
                    seller_id: product.seller_nm
                }
            });
            if (inventory) {
                await database_1.default.tbl_inventory.update({
                    where: { inventory_id: inventory.inventory_id },
                    data: {
                        quantity_available: inventory.quantity_available - quantity,
                        quantity_sold: inventory.quantity_sold + quantity
                    }
                });
            }
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: {
                    orderId: newOrder.o_ID,
                    orderNumber: newOrder.order_ID,
                    product: {
                        id: product.pro_ID,
                        name: product.pro_name,
                        price: product.pro_price
                    },
                    seller: {
                        id: product.nasso_users.usr_Id,
                        username: product.nasso_users.usr_uname,
                        fullName: product.nasso_users.full_name
                    },
                    quantity: quantity,
                    totalAmount: product.pro_price * quantity,
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
                include: {
                    tbl_products: {
                        include: {
                            nasso_users: {
                                select: {
                                    usr_Id: true,
                                    usr_uname: true,
                                    full_name: true,
                                    usr_email: true,
                                    usr_phone: true
                                }
                            },
                            pro_photo: {
                                select: {
                                    p_path: true
                                },
                                take: 1
                            }
                        }
                    }
                },
                orderBy: { o_ID: 'desc' },
                skip,
                take: Number(limit)
            });
            const total = await database_1.default.tbl_sh_orders.count({
                where: whereClause
            });
            const formattedOrders = orders.map(order => ({
                orderId: order.o_ID,
                orderNumber: order.order_ID,
                product: {
                    id: order.tbl_products.pro_ID,
                    name: order.tbl_products.pro_name,
                    price: order.tbl_products.pro_price,
                    image: order.tbl_products.pro_photo[0]?.p_path || null
                },
                seller: {
                    id: order.tbl_products.nasso_users.usr_Id,
                    username: order.tbl_products.nasso_users.usr_uname,
                    fullName: order.tbl_products.nasso_users.full_name || 'Seller',
                    email: order.tbl_products.nasso_users.usr_email,
                    phone: order.tbl_products.nasso_users.usr_phone
                },
                quantity: order.o_idadi,
                totalAmount: order.tbl_products.pro_price * order.o_idadi,
                status: order.oda_status,
                deliveryStatus: order.o_delivery,
                orderDate: order.o_date,
                orderDateTime: order.o_datetimes
            }));
            res.status(200).json({
                success: true,
                data: {
                    orders: formattedOrders,
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
    // Get orders for a seller (updated from vendorController)
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
                seller_id: userId // NEW: Use seller_id instead of o_user
            };
            if (status) {
                whereClause.oda_status = status;
            }
            const orders = await database_1.default.tbl_sh_orders.findMany({
                where: whereClause,
                include: {
                    tbl_products: {
                        select: {
                            pro_ID: true,
                            pro_name: true,
                            pro_price: true,
                            pro_photo: {
                                select: {
                                    p_path: true
                                },
                                take: 1
                            }
                        }
                    },
                    nasso_users: {
                        select: {
                            usr_Id: true,
                            usr_uname: true,
                            full_name: true,
                            usr_email: true,
                            usr_phone: true
                        }
                    }
                },
                orderBy: { o_ID: 'desc' },
                skip,
                take: Number(limit)
            });
            const total = await database_1.default.tbl_sh_orders.count({
                where: whereClause
            });
            const formattedOrders = orders.map(order => ({
                orderId: order.o_ID,
                orderNumber: order.order_ID,
                product: {
                    id: order.tbl_products.pro_ID,
                    name: order.tbl_products.pro_name,
                    price: order.tbl_products.pro_price,
                    image: order.tbl_products.pro_photo[0]?.p_path || null
                },
                customer: {
                    id: order.nasso_users.usr_Id,
                    username: order.nasso_users.usr_uname,
                    fullName: order.nasso_users.full_name || 'Customer',
                    email: order.nasso_users.usr_email,
                    phone: order.nasso_users.usr_phone
                },
                quantity: order.o_idadi,
                totalAmount: order.tbl_products.pro_price * order.o_idadi,
                status: order.oda_status,
                deliveryStatus: order.o_delivery,
                orderDate: order.o_date,
                orderDateTime: order.o_datetimes
            }));
            res.status(200).json({
                success: true,
                data: {
                    orders: formattedOrders,
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
                    seller_id: userId // NEW: Verify using seller_id
                },
                include: {
                    tbl_products: {
                        select: {
                            pro_name: true,
                            pro_price: true,
                            sel_comisio: true
                        }
                    }
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
            // If order is completed, create a transaction
            if (status === 'Completed' && order.oda_status !== 'Completed') {
                const totalAmount = order.tbl_products.pro_price * order.o_idadi;
                const commissionAmount = totalAmount * (order.tbl_products.sel_comisio / 100);
                const sellerEarnings = totalAmount - commissionAmount;
                await database_1.default.tbl_transactions.create({
                    data: {
                        user_id: userId,
                        order_id: order.o_ID,
                        amount: sellerEarnings,
                        transaction_type: 'sale',
                        description: `Completed order ${order.order_ID}`,
                        reference_id: order.order_ID
                    }
                });
            }
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
                },
                include: {
                    tbl_products: {
                        include: {
                            nasso_users: {
                                select: {
                                    usr_Id: true,
                                    usr_uname: true,
                                    full_name: true,
                                    usr_email: true,
                                    usr_phone: true
                                }
                            },
                            pro_photo: {
                                select: {
                                    p_path: true
                                }
                            }
                        }
                    },
                    nasso_users: {
                        select: {
                            usr_Id: true,
                            usr_uname: true,
                            full_name: true,
                            usr_email: true,
                            usr_phone: true
                        }
                    }
                }
            });
            if (!order) {
                res.status(404).json({
                    success: false,
                    error: 'Order not found'
                });
                return;
            }
            const isSeller = order.seller_id === userId;
            const otherParty = isSeller ? order.nasso_users : order.tbl_products.nasso_users;
            const orderDetails = {
                orderId: order.o_ID,
                orderNumber: order.order_ID,
                product: {
                    id: order.tbl_products.pro_ID,
                    name: order.tbl_products.pro_name,
                    price: order.tbl_products.pro_price,
                    commission: order.tbl_products.sel_comisio,
                    images: order.tbl_products.pro_photo.map(photo => photo.p_path)
                },
                [isSeller ? 'customer' : 'seller']: {
                    id: otherParty.usr_Id,
                    username: otherParty.usr_uname,
                    fullName: otherParty.full_name || (isSeller ? 'Customer' : 'Seller'),
                    email: otherParty.usr_email,
                    phone: otherParty.usr_phone
                },
                quantity: order.o_idadi,
                totalAmount: order.tbl_products.pro_price * order.o_idadi,
                commissionAmount: order.tbl_products.pro_price * order.o_idadi * (order.tbl_products.sel_comisio / 100),
                sellerEarnings: order.tbl_products.pro_price * order.o_idadi * (1 - order.tbl_products.sel_comisio / 100),
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

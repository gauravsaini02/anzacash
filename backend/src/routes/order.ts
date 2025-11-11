import express from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const orderController = new OrderController();

// Customer routes
router.post('/orders', authenticateToken, orderController.createOrder.bind(orderController));
router.get('/orders/customer', authenticateToken, orderController.getCustomerOrders.bind(orderController));
router.get('/orders/:orderId', authenticateToken, orderController.getOrderDetails.bind(orderController));

// Seller routes
router.get('/orders/seller', authenticateToken, orderController.getSellerOrders.bind(orderController));
router.put('/orders/:orderId/status', authenticateToken, orderController.updateOrderStatus.bind(orderController));

export default router;
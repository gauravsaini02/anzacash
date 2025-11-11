"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const orderController = new orderController_1.OrderController();
// Customer routes
router.post('/orders', auth_1.authenticateToken, orderController.createOrder.bind(orderController));
router.get('/orders/customer', auth_1.authenticateToken, orderController.getCustomerOrders.bind(orderController));
router.get('/orders/:orderId', auth_1.authenticateToken, orderController.getOrderDetails.bind(orderController));
// Seller routes
router.get('/orders/seller', auth_1.authenticateToken, orderController.getSellerOrders.bind(orderController));
router.put('/orders/:orderId/status', auth_1.authenticateToken, orderController.updateOrderStatus.bind(orderController));
exports.default = router;

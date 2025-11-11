"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const router = (0, express_1.Router)();
const adminController = new adminController_1.AdminController();
/**
 * @route   GET /api/admin/revenue/current-month
 * @desc    Get total revenue generated this month
 * @access  Private (Admin only)
 */
router.get('/revenue/current-month', auth_1.authenticateToken, admin_1.requireAdminRole, adminController.getRevenueThisMonth);
router.get('/vendors/current-vendors', auth_1.authenticateToken, admin_1.requireAdminRole, adminController.getActiveVendorsCount);
router.get('/users/statistics', auth_1.authenticateToken, admin_1.requireAdminRole, adminController.getUserStatistics);
exports.default = router;

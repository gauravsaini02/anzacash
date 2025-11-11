"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const adminService_1 = require("../services/adminService");
const adminService = new adminService_1.AdminService();
class AdminController {
    async getRevenueThisMonth(req, res) {
        try {
            const revenueData = await adminService.getRevenueThisMonth();
            res.status(200).json({
                success: true,
                message: 'Monthly revenue data retrieved successfully',
                data: {
                    ...revenueData,
                    currency: 'USD',
                    period: 'current_month',
                    generatedAt: new Date().toISOString()
                }
            });
        }
        catch (error) {
            console.error('Get revenue this month error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve revenue data'
            });
        }
    }
    async getActiveVendorsCount(req, res) {
        try {
            const vendorCountData = await adminService.getActiveVendorCount();
            res.status(200).json({
                success: true,
                message: "active vendor count data retrieved successfully",
                data: {
                    ...vendorCountData,
                    generatedAt: new Date().toISOString()
                }
            });
        }
        catch (error) {
            console.error('Error in getting vendor count :', error);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: 'Failed to get active vendor count'
            });
        }
    }
    async getUserStatistics(req, res) {
        try {
            const userStats = await adminService.getUserStatistics();
            res.status(200).json({
                success: true,
                message: 'User statistics retrieved successfully',
                data: {
                    ...userStats,
                    generatedAt: new Date().toISOString()
                }
            });
        }
        catch (error) {
            console.error('Get user statistics error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve user statistics'
            });
        }
    }
}
exports.AdminController = AdminController;

import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';

const adminService = new AdminService();

export class AdminController {
  async getRevenueThisMonth(req: Request, res: Response): Promise<void> {
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
    } catch (error) {
      console.error('Get revenue this month error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve revenue data'
      });
    }
  }

  async getActiveVendorsCount(req: Request, res: Response): Promise<void>{

    try{

        const vendorCountData = await adminService.getActiveVendorCount();

        res.status(200).json({
          success: true,
          message: "active vendor count data retrieved successfully",
          data : {
            ...vendorCountData,
            generatedAt : new Date().toISOString()
          }
        });
    }
    catch(error){
      console.error('Error in getting vendor count :', error)

      res.status(500).json({
        success : false,
        error : 'Internal Server Error',
        message : 'Failed to get active vendor count'
      });
    }
  }
}
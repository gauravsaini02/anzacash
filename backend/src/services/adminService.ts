import prisma from '../config/database';

export interface RevenueMetrics {
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  averagePaymentValue: number;
}

export interface VendorMetrics {
  totalVendors: number;
  activeVendors: number;
}

export class AdminService {
  async getRevenueThisMonth(): Promise<RevenueMetrics> {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM format

    try {
      // Get payments for current month from tbl_payments
      const payments = await prisma.tbl_payments.findMany({
        where: {
          pay_date: {
            contains: currentMonth
          },
          pay_status: 'Paid'
        }
      });

      // Calculate revenue metrics
      const totalRevenue = payments.reduce((sum: number, payment: any) => sum + Number(payment.pay_amount || 0), 0);
      const totalPayments = payments.length;
      const averagePaymentValue = totalPayments > 0 ? totalRevenue / totalPayments : 0;

      return {
        totalRevenue,
        totalPayments,
        successfulPayments: totalPayments,
        averagePaymentValue
      };
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      // Return default values if query fails
      return {
        totalRevenue: 0,
        totalPayments: 0,
        successfulPayments: 0,
        averagePaymentValue: 0
      };
    }
  }

  async getActiveVendorCount(): Promise<VendorMetrics> {
    try {
      // Get total users with vendor position
      const totalVendors = await prisma.nasso_users.count({
        where: {
          usr_posio: 'vendor'
        }
      });

      // Get active vendors (status is Active)
      const activeVendors = await prisma.nasso_users.count({
        where: {
          usr_posio: 'vendor',
          usr_status: 'Active'
        }
      });

      return {
        totalVendors,
        activeVendors
      };
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      return {
        totalVendors: 0,
        activeVendors: 0
      };
    }
  }

  async getUserStatistics() {
    try {
      const totalUsers = await prisma.nasso_users.count();
      const activeUsers = await prisma.nasso_users.count({
        where: {
          usr_status: 'Active'
        }
      });

      const usersByPosition = await prisma.nasso_users.groupBy({
        by: ['usr_posio'],
        _count: {
          usr_posio: true
        }
      });

      return {
        totalUsers,
        activeUsers,
        usersByPosition
      };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        usersByPosition: []
      };
    }
  }
}
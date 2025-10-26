import prisma from '../config/database';

export interface RevenueMetrics {
  totalRevenue: number;
  platformRevenue: number;
  vendorRevenue: number;
  totalOrders: number;
  paidOrders: number;
  averageOrderValue: number;
}

export class AdminService {
  async getRevenueThisMonth(): Promise<RevenueMetrics> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Get orders for current month with successful payments
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfDay
        },
        paymentTransaction: {
          status: 'SUCCEEDED'
        }
      },
      include: {
        paymentTransaction: true
      }
    });

    // Calculate revenue metrics
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const platformRevenue = orders.reduce((sum, order) => sum + Number(order.platformCommission), 0);
    const vendorRevenue = orders.reduce((sum, order) => sum + Number(order.vendorPayoutAmount), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      platformRevenue,
      vendorRevenue,
      totalOrders,
      paidOrders: totalOrders, // All orders here are paid
      averageOrderValue
    };
  }


  async getActiveVendorCount(): Promise<void>{
    
  }
}
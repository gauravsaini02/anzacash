import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';
import { requireAdminRole } from '../middleware/admin';

const router = Router();
const adminController = new AdminController();

/**
 * @route   GET /api/admin/revenue/current-month
 * @desc    Get total revenue generated this month
 * @access  Private (Admin only)
 */
router.get('/revenue/current-month', authenticateToken, requireAdminRole, adminController.getRevenueThisMonth);

router.get('/vendors/current-vendors',authenticateToken,requireAdminRole,)

export default router;
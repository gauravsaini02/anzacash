import express from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const profileController = new ProfileController();

// Seller profile routes
router.get('/profile/seller', authenticateToken, profileController.getSellerProfile.bind(profileController));
router.put('/profile/seller', authenticateToken, profileController.updateSellerProfile.bind(profileController));

// Customer profile routes
router.get('/profile/customer', authenticateToken, profileController.getCustomerProfile.bind(profileController));
router.put('/profile/customer', authenticateToken, profileController.updateCustomerProfile.bind(profileController));

// Public profile routes (no authentication required)
router.get('/profile/seller/public/:sellerId', profileController.getPublicSellerProfile.bind(profileController));

export default router;
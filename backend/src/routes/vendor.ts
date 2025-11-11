import { Router } from 'express';
import { VendorController } from '../controllers/vendorController';
import { authenticateToken } from '../middleware/auth';
import { uploadProfilePicture } from '../middleware/upload';

const router = Router();
const vendorController = new VendorController();

// All vendor routes require authentication
router.use(authenticateToken);

// Get vendor profile with financial data
router.get('/profile', vendorController.getVendorProfile);

// Update vendor profile information
router.put('/profile', vendorController.updateVendorProfile);

// Upload vendor profile picture
router.post('/profile-picture', uploadProfilePicture, vendorController.uploadProfilePicture);

// Get vendor statistics
router.get('/stats', vendorController.getVendorStats);

// Get vendor's products
router.get('/products', vendorController.getVendorProducts);

export default router;
import { Router } from 'express';
import authRoutes from './auth';
import adminRoutes from './admin';
import vendorRoutes from './vendor';
import productRoutes from './product';
import orderRoutes from './order';
import profileRoutes from './profile';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/vendor', vendorRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes); // Order management routes
router.use('/profile', profileRoutes); // Profile management routes

export default router;
import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';
import { uploadProductImages } from '../middleware/productUpload';

const router = Router();
const productController = new ProductController();

// Public/Customer routes (no authentication required)
router.get('/public', productController.getProductsForCustomers);
router.get('/public/details/:id', productController.getProductDetailsForCustomers);

// Protected routes (authentication required)
router.use(authenticateToken);

// Create a new product with image upload
router.post('/', uploadProductImages.array('productImages', 5), productController.createProduct);

// Get all products for the authenticated vendor (default route for vendors)
router.get('/', productController.getVendorProducts);

// Alternative route for vendor products
router.get('/vendor', productController.getVendorProducts);

// Get a single product by ID (for vendor)
router.get('/:id', productController.getProductById);

// Alternative route for vendor product by ID
router.get('/vendor/:id', productController.getProductById);

// Update a product
router.put('/:id', productController.updateProduct);

// Delete a product
router.delete('/:id', productController.deleteProduct);

export default router;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const productUpload_1 = require("../middleware/productUpload");
const router = (0, express_1.Router)();
const productController = new productController_1.ProductController();
// Public/Customer routes (no authentication required)
router.get('/public', productController.getProductsForCustomers);
router.get('/public/details/:id', productController.getProductDetailsForCustomers);
// Protected routes (authentication required)
router.use(auth_1.authenticateToken);
// Create a new product with image upload
router.post('/', productUpload_1.uploadProductImages.array('productImages', 5), productController.createProduct);
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
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendorController_1 = require("../controllers/vendorController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
const vendorController = new vendorController_1.VendorController();
// All vendor routes require authentication
router.use(auth_1.authenticateToken);
// Get vendor profile with financial data
router.get('/profile', vendorController.getVendorProfile);
// Update vendor profile information
router.put('/profile', vendorController.updateVendorProfile);
// Upload vendor profile picture
router.post('/profile-picture', upload_1.uploadProfilePicture, vendorController.uploadProfilePicture);
// Get vendor statistics
router.get('/stats', vendorController.getVendorStats);
// Get vendor's products
router.get('/products', vendorController.getVendorProducts);
exports.default = router;

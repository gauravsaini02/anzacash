"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../controllers/profileController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const profileController = new profileController_1.ProfileController();
// Seller profile routes
router.get('/profile/seller', auth_1.authenticateToken, profileController.getSellerProfile.bind(profileController));
router.put('/profile/seller', auth_1.authenticateToken, profileController.updateSellerProfile.bind(profileController));
// Customer profile routes
router.get('/profile/customer', auth_1.authenticateToken, profileController.getCustomerProfile.bind(profileController));
router.put('/profile/customer', auth_1.authenticateToken, profileController.updateCustomerProfile.bind(profileController));
// Public profile routes (no authentication required)
router.get('/profile/seller/public/:sellerId', profileController.getPublicSellerProfile.bind(profileController));
exports.default = router;

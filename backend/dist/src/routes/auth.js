"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const authController = new authController_1.AuthController();
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (customer, vendor, or mlm member)
 * @access  Public
 */
router.post('/register', validation_1.validateRegistration, authController.register);
/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', validation_1.validateLogin, authController.login);
/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', auth_1.authenticateToken, authController.logout);
/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', auth_1.authenticateToken, authController.getProfile);
exports.default = router;

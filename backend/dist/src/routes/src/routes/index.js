"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const admin_1 = __importDefault(require("./admin"));
const vendor_1 = __importDefault(require("./vendor"));
const product_1 = __importDefault(require("./product"));
const order_1 = __importDefault(require("./order"));
const profile_1 = __importDefault(require("./profile"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/admin', admin_1.default);
router.use('/vendor', vendor_1.default);
router.use('/products', product_1.default);
router.use('/orders', order_1.default); // Order management routes
router.use('/profile', profile_1.default); // Profile management routes
exports.default = router;

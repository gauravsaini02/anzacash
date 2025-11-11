"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAnyUser = exports.authorizeCustomer = exports.authorizeTraders = exports.authorizeVendor = exports.authorizeAdmin = void 0;
exports.authenticateToken = authenticateToken;
exports.authorizeRoles = authorizeRoles;
const jwt_1 = require("../utils/jwt");
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
    if (!token) {
        res.status(401).json({
            success: false,
            error: 'Access token required',
            message: 'Please provide a Bearer token in Authorization header'
        });
        return;
    }
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({
                    success: false,
                    error: 'Token expired',
                    message: 'Please login again to get a new token'
                });
                return;
            }
            if (error.name === 'JsonWebTokenError') {
                res.status(401).json({
                    success: false,
                    error: 'Invalid token',
                    message: 'The provided token is malformed or invalid'
                });
                return;
            }
        }
        res.status(401).json({
            success: false,
            error: 'Token verification failed',
            message: 'Unable to verify your authentication token'
        });
    }
}
// Optional: Role-based authorization middleware
function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
            return;
        }
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({
                success: false,
                error: 'Access denied',
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
            });
            return;
        }
        next();
    };
}
// Specific role authorizers for convenience based on nasso_users positions
exports.authorizeAdmin = authorizeRoles(['admin']);
exports.authorizeVendor = authorizeRoles(['admin', 'vendor']);
exports.authorizeTraders = authorizeRoles(['admin', 'vendor', 'traders']);
exports.authorizeCustomer = authorizeRoles(['admin', 'vendor', 'customer']);
exports.authorizeAnyUser = authorizeRoles(['admin', 'vendor', 'traders', 'customer']);

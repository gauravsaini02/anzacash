"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const emailService_1 = __importDefault(require("./emailService"));
class AuthService {
    constructor() {
        this.emailService = new emailService_1.default();
    }
    async registerUser(userData) {
        const { usr_uname, usr_passwd, usr_email, usr_phone, usr_posio, full_name, usr_county } = userData;
        // Check if user already exists
        const existingUser = await database_1.default.nasso_users.findUnique({
            where: { usr_uname }
        });
        if (existingUser) {
            throw new Error('User with this username already exists');
        }
        // Hash password
        const hashedPassword = await (0, password_1.hashPassword)(usr_passwd);
        // Create user
        const user = await database_1.default.nasso_users.create({
            data: {
                usr_uname,
                usr_passwd: hashedPassword,
                usr_email: usr_email || 'N/A',
                usr_phone: usr_phone || 'N/A',
                usr_posio: usr_posio || 'traders',
                usr_status: usr_posio === 'customer' ? 'Active' : 'Not Active', // Only customers are active by default
                full_name: full_name || null,
                usr_county: usr_county || 'N/A',
                join_date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
            },
            select: {
                usr_Id: true,
                usr_uname: true,
                usr_email: true,
                usr_phone: true,
                usr_posio: true,
                usr_status: true,
                full_name: true,
                usr_county: true,
                join_date: true
            }
        });
        return user;
    }
    async loginUser(usr_uname, usr_passwd) {
        console.log('🔍 Login attempt for username:', usr_uname);
        // Find user by username
        const user = await database_1.default.nasso_users.findUnique({
            where: { usr_uname }
        });
        console.log('👤 User found:', !!user);
        if (user) {
            console.log('📊 User details:', {
                id: user.usr_Id,
                username: user.usr_uname,
                status: user.usr_status,
                position: user.usr_posio
            });
        }
        if (!user) {
            console.log('❌ User not found');
            throw new Error('Invalid username or password');
        }
        // Check user status
        if (user.usr_status !== 'Active') { // Note: schema shows "Not Active" as default, but login should check for "Active"
            console.log('❌ User not active, status:', user.usr_status);
            throw new Error('Account is not active. Please contact support.');
        }
        console.log('🔑 Comparing passwords...');
        // Verify password
        // console.log("the hash password stored in db is:",user.usr_passwd)
        // console.log("password string is :", typeof usr_passwd)
        const isPasswordValid = await (0, password_1.comparePassword)(usr_passwd, user.usr_passwd);
        console.log('✅ Password valid:', isPasswordValid);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
            userId: user.usr_Id,
            username: user.usr_uname,
            role: user.usr_posio
        });
        // Return user data without password
        const userResponse = {
            usr_Id: user.usr_Id,
            usr_uname: user.usr_uname,
            usr_email: user.usr_email,
            usr_phone: user.usr_phone,
            usr_posio: user.usr_posio,
            usr_status: user.usr_status,
            full_name: user.full_name,
            usr_county: user.usr_county,
            join_date: user.join_date
        };
        return {
            user: userResponse,
            token
        };
    }
    async getUserById(userId) {
        return database_1.default.nasso_users.findUnique({
            where: { usr_Id: userId },
            select: {
                usr_Id: true,
                usr_uname: true,
                usr_email: true,
                usr_phone: true,
                usr_posio: true,
                usr_status: true,
                full_name: true,
                usr_county: true,
                join_date: true
            }
        });
    }
    async getUserByUsername(usr_uname) {
        return database_1.default.nasso_users.findUnique({
            where: { usr_uname },
            select: {
                usr_Id: true,
                usr_uname: true,
                usr_email: true,
                usr_phone: true,
                usr_posio: true,
                usr_status: true,
                full_name: true,
                usr_county: true,
                join_date: true
            }
        });
    }
    async forgotPassword(email) {
        console.log('🔍 Forgot password request for email:', email);
        // Find user by email
        const user = await database_1.default.nasso_users.findFirst({
            where: {
                usr_email: email,
                usr_status: 'Active' // Only allow password reset for active users
            },
            select: {
                usr_Id: true,
                usr_uname: true,
                usr_email: true,
                full_name: true
            }
        });
        console.log('👤 User found for password reset:', !!user);
        if (!user) {
            // Don't reveal that email doesn't exist for security
            console.log('❌ No active user found with this email');
            return {
                success: true,
                message: 'If an account with this email exists, a verification code has been sent.'
            };
        }
        // Generate 6-digit verification code
        const verificationCode = this.emailService.generateVerificationCode();
        console.log('🔢 Generated verification code:', verificationCode);
        // Update usr_code field in database
        await database_1.default.nasso_users.update({
            where: { usr_Id: user.usr_Id },
            data: { usr_code: verificationCode }
        });
        console.log('💾 Stored verification code in database');
        // Send email with verification code
        const emailResult = await this.emailService.sendPasswordResetCode(user.usr_email || 'N/A', verificationCode, user.full_name || user.usr_uname);
        console.log('📧 Email send result:', emailResult);
        if (emailResult.success) {
            return {
                success: true,
                message: 'Verification code sent to your email address.'
            };
        }
        else {
            // If email fails, still return success for security but log the error
            console.error('❌ Failed to send email:', emailResult.message);
            return {
                success: true,
                message: 'If an account with this email exists, a verification code has been sent.'
            };
        }
    }
    async resetPassword(verificationCode, newPassword) {
        console.log('🔍 Reset password request with code:', verificationCode);
        // Find user by verification code
        const user = await database_1.default.nasso_users.findFirst({
            where: { usr_code: verificationCode },
            select: {
                usr_Id: true,
                usr_uname: true,
                usr_email: true,
                usr_status: true
            }
        });
        console.log('👤 User found for verification code:', !!user);
        if (!user) {
            throw new Error('Invalid or expired verification code');
        }
        if (user.usr_status !== 'Active') {
            throw new Error('Account is not active. Please contact support.');
        }
        // Hash new password
        const hashedPassword = await (0, password_1.hashPassword)(newPassword);
        console.log('🔐 New password hashed');
        // Update password and clear verification code
        await database_1.default.nasso_users.update({
            where: { usr_Id: user.usr_Id },
            data: {
                usr_passwd: hashedPassword,
                usr_code: null // Clear the verification code
            }
        });
        console.log('💾 Password updated successfully');
        return {
            success: true,
            message: 'Password reset successful. You can now login with your new password.'
        };
    }
}
exports.AuthService = AuthService;

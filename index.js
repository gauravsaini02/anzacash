/**
 * AnzaCash Backend Application
 * Main entry point for the package
 */

// Export the main server app for potential module usage
const app = require('./dist/server.js');

// Export authentication utilities
const { AuthService } = require('./dist/services/authService.js');
const { generateToken, verifyToken } = require('./dist/utils/jwt.js');
const { hashPassword, comparePassword } = require('./dist/utils/password.js');

// Export Prisma client for database operations
const { PrismaClient } = require('./generated/prisma/index.js');

module.exports = {
  // Main application
  app,

  // Services
  AuthService,

  // Utilities
  jwt: {
    generateToken,
    verifyToken
  },
  password: {
    hashPassword,
    comparePassword
  },

  // Database
  PrismaClient,

  // Version and metadata
  version: require('./package.json').version,
  name: require('./package.json').name
};

// If this file is run directly, start the server
if (require.main === module) {
  console.log('🚀 Starting AnzaCash Backend Server...');
  console.log('📋 For development, use: npm run dev');
  console.log('📋 For production, use: npm start');
  console.log('');
  console.log('🔗 Available endpoints:');
  console.log('  POST /api/auth/register - Register new user');
  console.log('  POST /api/auth/login    - User login');
  console.log('  POST /api/auth/logout   - User logout');
  console.log('  GET  /api/auth/profile  - Get user profile');
  console.log('  GET  /health            - Health check');
}
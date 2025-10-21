require('dotenv').config();
const { PrismaClient } = require('./generated/prisma');

async function testPrismaConnection() {
  const prisma = new PrismaClient();

  try {
    console.log('🔌 Testing Prisma connection to MySQL...');

    // Test raw query
    const result = await prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp`;
    console.log('✅ Prisma raw query successful:', {
      test: Number(result[0].test),
      timestamp: result[0].timestamp
    });

    // Test database connection
    await prisma.$connect();
    console.log('✅ Prisma connected successfully to MySQL database');

  } catch (error) {
    console.error('❌ Prisma connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Prisma connection closed');
  }
}

testPrismaConnection();
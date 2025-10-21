require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('./generated/prisma');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Prisma client
const prisma = new PrismaClient();

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to MySQL database via Prisma');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}

// POST endpoint at root path
app.get('/', (req, res) => {
  res.json({ message: 'welcome' });
});

// Test database connection endpoint
app.get('/test-db', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp`;

    // Handle BigInt serialization
    const data = {
      test: Number(result[0].test),
      timestamp: result[0].timestamp
    };

    res.json({
      status: 'success',
      message: 'Prisma database connection working',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Prisma database connection failed',
      error: error.message
    });
  }
});

// Start the server
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await testConnection();
});
const API_BASE_URL = 'http://localhost:3000';

async function activateSellerViaDatabase() {
  try {
    console.log('🔍 Trying to activate seller via Prisma...');

    // Use Prisma directly (if available in this context)
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Activate the seller
    const result = await prisma.nasso_users.updateMany({
      where: {
        usr_uname: 'testseller'
      },
      data: {
        usr_status: 'Active'
      }
    });

    console.log('✅ Seller activated via Prisma:', result);

    // Verify activation
    const seller = await prisma.nasso_users.findUnique({
      where: { usr_uname: 'testseller' },
      select: {
        usr_Id: true,
        usr_uname: true,
        usr_status: true,
        usr_posio: true,
        full_name: true
      }
    });

    if (seller) {
      console.log('📋 Seller details after activation:');
      console.log(`  ID: ${seller.usr_Id}`);
      console.log(`  Username: ${seller.usr_uname}`);
      console.log(`  Status: ${seller.usr_status}`);
      console.log(`  Position: ${seller.usr_posio}`);
      console.log(`  Full Name: ${seller.full_name}`);
    }

    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ Could not activate seller via Prisma:', error.message);

    // If Prisma doesn't work, we'll need to do it manually
    console.log('💡 Manual activation required: UPDATE nasso_users SET usr_status = "Active" WHERE usr_uname = "testseller"');
  }
}

activateSellerViaDatabase();
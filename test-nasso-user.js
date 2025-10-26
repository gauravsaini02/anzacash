const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function testNassoUserTable() {
  console.log('🧪 Testing NassoUser Table Structure...\n');

  try {
    // Create test user
    console.log('📝 Creating test user...');
    const testUser = await prisma.nassoUser.create({
      data: {
        username: 'testuser_' + Date.now(),
        position: 'traders',
        status: 'Active',
        email: 'testuser@example.com',
        passwordHash: 'hashedpassword',
        country: 'TestCountry',
        joinDate: new Date(),
        fullName: 'Test User'
      }
    });

    console.log('✅ Test user created successfully');
    console.log('User ID:', testUser.id);
    console.log('Username:', testUser.username);
    console.log('');

    // Test sponsor relationship
    if (testUser.id) {
      console.log('👥 Creating sponsored user...');
      const sponsorUser = await prisma.nassoUser.create({
        data: {
          username: 'sponsor_' + Date.now(),
          position: 'traders',
          status: 'Active',
          email: 'sponsor@example.com',
          passwordHash: 'hashedpassword',
          country: 'SponsorCountry',
          joinDate: new Date(),
          fullName: 'Sponsor User'
        }
      });

      // Update sponsor relationship
      await prisma.nassoUser.update({
        where: { id: testUser.id },
        data: {
          sponsorId: sponsorUser.id
        }
      });

      console.log('✅ Sponsor relationship created');
      console.log('Sponsor ID:', sponsorUser.id);
      console.log('');
    }

    // Test left child
    console.log('👶 Creating left child user...');
    const leftChild = await prisma.nassoUser.create({
      data: {
        username: 'leftchild_' + Date.now(),
        position: 'traders',
        status: 'Active',
        email: 'leftchild@example.com',
        passwordHash: 'hashedpassword',
        country: 'LeftChildCountry',
        joinDate: new Date(),
        fullName: 'Left Child User'
      }
    });

    // Update left relationship
    await prisma.nassoUser.update({
      where: { id: testUser.id },
      data: {
        leftUserId: leftChild.id
      }
    });

    console.log('✅ Left child relationship created');
    console.log('Left Child ID:', leftChild.id);
    console.log('');

    // Test right child
    console.log('👴 Creating right child user...');
    const rightChild = await prisma.nassoUser.create({
      data: {
        username: 'rightchild_' + Date.now(),
        position: 'traders',
        status: 'Active',
        email: 'rightchild@example.com',
        passwordHash: 'hashedpassword',
        country: 'RightChildCountry',
        joinDate: new Date(),
        fullName: 'Right Child User'
      }
    });

    // Update right relationship
    await prisma.nassoUser.update({
      where: { id: testUser.id },
      data: {
        rightUserId: rightChild.id
      }
    });

    console.log('✅ Right child relationship created');
    console.log('Right Child ID:', rightChild.id);
    console.log('');

    // Test all relationships query
    console.log('🔗 Testing user with all relationships...');
    const userWithRelations = await prisma.nassoUser.findUnique({
      where: { id: testUser.id },
      include: {
        sponsor: true,
        leftChildren: true,
        rightChildren: true,
        allReferrals: true
      }
    });

    console.log('✅ User with relationships retrieved');
    console.log('Username:', userWithRelations.username);
    console.log('Sponsor ID:', userWithRelations.sponsor?.id || null);
    console.log('Left Children Count:', userWithRelations.leftChildren?.length || 0);
    console.log('Right Children Count:', userWithRelations.rightChildren?.length || 0);
    console.log('All Referrals Count:', userWithRelations.allReferrals?.length || 0);
    console.log('');

    // Test simple queries
    const totalUsers = await prisma.nassoUser.count();
    const activeUsers = await prisma.nassoUser.count({
      where: { status: 'Active' }
    });
    const tradersUsers = await prisma.nassoUser.count({
      where: { position: 'traders' }
    });

    console.log('📊 Database Statistics:');
    console.log('Total Users:', totalUsers);
    console.log('Active Users:', activeUsers);
    console.log('Traders:', tradersUsers);
    console.log('');

    console.log('🎉 NassoUser table test completed successfully!');
    console.log('');
    console.log('Table Name: nasso_users');
    console.log('Field Mappings:');
    console.log('  - usr_Id (id) → id');
    console.log('  - usr_uname (username) → username');
    console.log('  - usr_posio (position) → position (default: "traders")');
    console.log('  - usr_status (status) → status (default: "Not Active")');
    console.log('  - usr_code (code) → code');
    console.log('  - usr_passwd (passwordHash) → passwordHash');
    console.log('  - usr_email (email) → email');
    console.log('  - usr_phone (phone) → phone');
    console.log('  - usr_county (country) → country');
    console.log('  - usr_photo (photo) → photo');
    console.log('  - join_date (joinDate) → joinDate');
    console.log('  - full_name (fullName) → fullName');
    console.log('  - sponsor_id (sponsorId) → sponsorId');
    console.log('  - left_user_id (leftUserId) → leftUserId');
    console.log('  - right_user_id (rightUserId) → rightUserId');
    console.log('  - level (level) → level');

  } catch (error) {
    console.error('❌ Error testing NassoUser table:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testNassoUserTable();
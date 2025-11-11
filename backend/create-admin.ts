import bcrypt from 'bcryptjs';
import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Admin user details
    const adminUser = {
      usr_uname: 'admin',
      usr_posio: 'admin',
      usr_status: 'Active',
      usr_passwd: 'Admin@123456',
      usr_email: 'admin@anzacash.com',
      usr_phone: '+255712345678',
      usr_county: 'Tanzania',
      full_name: 'System Administrator',
      join_date: new Date().toISOString().split('T')[0]
    };

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminUser.usr_passwd, 10);

    // Check if admin user already exists
    const existingAdmin = await prisma.nasso_users.findUnique({
      where: { usr_uname: adminUser.usr_uname }
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password and position...');

      // Update existing user to admin
      const updatedUser = await prisma.nasso_users.update({
        where: { usr_uname: adminUser.usr_uname },
        data: {
          usr_posio: 'admin',
          usr_status: 'Active',
          usr_passwd: hashedPassword,
          usr_email: adminUser.usr_email,
          full_name: adminUser.full_name
        }
      });

      console.log('✅ Admin user updated successfully!');
      console.log('📝 Username:', adminUser.usr_uname);
      console.log('🔑 Password:', adminUser.usr_passwd);
      console.log('📧 Email:', adminUser.usr_email);
      console.log('👤 Role:', updatedUser.usr_posio);
      console.log('📊 Status:', updatedUser.usr_status);

    } else {
      // Create new admin user
      const newAdmin = await prisma.nasso_users.create({
        data: {
          usr_uname: adminUser.usr_uname,
          usr_posio: adminUser.usr_posio,
          usr_status: adminUser.usr_status,
          usr_passwd: hashedPassword,
          usr_email: adminUser.usr_email,
          usr_phone: adminUser.usr_phone,
          usr_county: adminUser.usr_county,
          full_name: adminUser.full_name,
          join_date: adminUser.join_date
        }
      });

      console.log('✅ Admin user created successfully!');
      console.log('📝 Username:', adminUser.usr_uname);
      console.log('🔑 Password:', adminUser.usr_passwd);
      console.log('📧 Email:', adminUser.usr_email);
      console.log('👤 Role:', newAdmin.usr_posio);
      console.log('📊 Status:', newAdmin.usr_status);
      console.log('🆔 User ID:', newAdmin.usr_Id);
    }

    // Note: The nasso_accounts entry will be created automatically by the database relation
    console.log('ℹ️  Admin account will be created automatically via database relation');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
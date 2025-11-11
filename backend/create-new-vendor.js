const mysql = require('mysql2/promise');
const crypto = require('crypto');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'anzacash_1997',
  database: 'anzacash-db'
};

// New vendor data
const newVendor = {
  username: 'techvendor_plus',
  password: 'vendor123456',
  email: 'techvendor@anzacash.com',
  phone: '+1-555-012-3456',
  fullName: 'TechVendor Plus Store',
  country: 'Canada',
  position: 'vendor',
  status: 'Active',
  businessName: 'TechVendor Plus Electronics',
  businessDescription: 'Premium electronics and tech accessories store with focus on quality products and customer satisfaction.',
  commissionRate: 12.5,
  verificationStatus: 'verified',
  businessPhone: '+1-555-012-3456',
  businessEmail: 'support@techvendorplus.com',
  businessAddress: '123 Tech Street, Vancouver, BC V6B 2W8, Canada'
};

async function createNewVendor() {
  let connection;

  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    console.log('Creating new vendor user...');

    // Insert into nasso_users table
    const hashedPassword = crypto.createHash('sha256').update(newVendor.password).digest('hex');

    const userSql = `
      INSERT INTO nasso_users (usr_uname, usr_passwd, usr_email, usr_phone, full_name, usr_county, usr_posio, usr_status, join_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const userValues = [
      newVendor.username,
      hashedPassword,
      newVendor.email,
      newVendor.phone,
      newVendor.fullName,
      newVendor.country,
      newVendor.position,
      newVendor.status,
      new Date().toISOString().split('T')[0] // Current date
    ];

    const [userResult] = await connection.execute(userSql, userValues);
    const newUserId = userResult.insertId;

    console.log(`Created user with ID: ${newUserId}`);

    // Insert into tbl_seller_profiles table
    console.log('Creating seller profile...');

    const sellerProfileSql = `
      INSERT INTO tbl_seller_profiles (user_id, business_name, business_description, commission_rate, verification_status,
                                      business_phone, business_email, business_address, rating, total_sales, total_products, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const sellerProfileValues = [
      newUserId,
      newVendor.businessName,
      newVendor.businessDescription,
      newVendor.commissionRate,
      newVendor.verificationStatus,
      newVendor.businessPhone,
      newVendor.businessEmail,
      newVendor.businessAddress,
      4.8, // Starting rating
      0.00, // Starting total sales
      0,    // Starting total products
      new Date()
    ];

    await connection.execute(sellerProfileSql, sellerProfileValues);

    // Create nasso_accounts entry
    console.log('Creating user account...');

    const accountSql = `
      INSERT INTO nasso_accounts (ac_usr, ac_balance, ac_bonus, ac_profit, ac_withdraw, ac_spin, ac_video,
                                  ac_trivia, ac_status, ac_expense, ac_mshahara, ac_ads, task_balance, task_withdraw, aff_balance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const accountValues = [
      newVendor.username,
      0,    // balance
      0,    // bonus
      0,    // profit
      0,    // withdraw
      0,    // spin
      0,    // video
      0,    // trivia
      1,    // status (1 = active)
      0,    // expense
      0,    // mshahara
      0,    // ads
      0,    // task_balance
      0,    // task_withdraw
      0     // aff_balance
    ];

    await connection.execute(accountSql, accountValues);

    // Commit transaction
    await connection.commit();

    console.log(`✅ Successfully created new vendor: ${newVendor.businessName}`);
    console.log(`📍 User ID: ${newUserId}`);
    console.log(`👤 Username: ${newVendor.username}`);
    console.log(`📧 Email: ${newVendor.email}`);
    console.log(`📱 Phone: ${newVendor.phone}`);
    console.log(`🏢 Business: ${newVendor.businessName}`);
    console.log(`⭐ Verification Status: ${newVendor.verificationStatus}`);
    console.log(`💰 Commission Rate: ${newVendor.commissionRate}%`);

    return newUserId;

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error creating new vendor:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the script
createNewVendor().catch(console.error);
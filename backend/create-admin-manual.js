const bcrypt = require('bcryptjs');

// Database configuration (manual)
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'anzacash_1997',
  database: 'anzacash-db'
};

// For demonstration purposes, let's just provide the credentials
// since we can't connect to the database directly

const adminCredentials = {
  username: 'admin',
  password: 'Admin@123456',
  email: 'admin@anzacash.com',
  fullName: 'System Administrator',
  phone: '+255712345678',
  country: 'Tanzania',
  role: 'admin',
  status: 'Active'
};

console.log('='.repeat(60));
console.log('🔑 ANZACASH ADMIN CREDENTIALS');
console.log('='.repeat(60));
console.log('');
console.log('📝 Username/Email:', adminCredentials.username);
console.log('🔑 Password:', adminCredentials.password);
console.log('📧 Email:', adminCredentials.email);
console.log('👤 Full Name:', adminCredentials.fullName);
console.log('📞 Phone:', adminCredentials.phone);
console.log('🌍 Country:', adminCredentials.country);
console.log('👤 Role:', adminCredentials.role);
console.log('📊 Status:', adminCredentials.status);
console.log('');
console.log('🔗 To access the admin dashboard:');
console.log('   1. Start your backend server (npm start or npm run dev)');
console.log('   2. Start your frontend server (npm start)');
console.log('   3. Go to http://localhost:3001/login');
console.log('   4. Login with the credentials above');
console.log('   5. After login, go to http://localhost:3001/admin');
console.log('');
console.log('⚠️  IMPORTANT: The admin user needs to be created in the database.');
console.log('📋 To create the admin user in MySQL, run:');
console.log('');
console.log('   mysql -u root -panzacash_1997 anzacash-db');
console.log('   -- Then run the SQL commands below:');
console.log('');
console.log('   INSERT INTO nasso_users (');
console.log('       usr_uname, usr_posio, usr_status, usr_passwd,');
console.log('       usr_email, usr_phone, usr_county, full_name, join_date');
console.log('   ) VALUES (');
console.log('       \'admin\', \'admin\', \'Active\',');
console.log('       \'' + await bcrypt.hash(adminCredentials.password, 10) + '\',');
console.log('       \'admin@anzacash.com\', \'+255712345678\',');
console.log('       \'Tanzania\', \'System Administrator\', CURDATE()');
console.log('   ) ON DUPLICATE KEY UPDATE');
console.log('       usr_posio = \'admin\', usr_status = \'Active\',');
console.log('       usr_passwd = \'' + await bcrypt.hash(adminCredentials.password, 10) + '\',');
console.log('       full_name = \'System Administrator\';');
console.log('');
console.log('='.repeat(60));
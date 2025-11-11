const bcrypt = require('bcryptjs');

async function generateCorrectHash() {
  const password = 'testadmin@123';
  const saltRounds = 10;

  console.log('🔑 Generating hash for password:', password);

  // Generate the hash
  const hash = await bcrypt.hash(password, saltRounds);

  console.log('📊 Generated hash:', hash);
  console.log('📏 Hash length:', hash.length);

  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('✅ Hash verification:', isValid);

  // Create the SQL update command
  console.log('\n📝 SQL Update Command:');
  console.log(`UPDATE nasso_users SET usr_passwd = '${hash}' WHERE usr_uname = 'testadmin';`);

  // Create the complete insert command
  console.log('\n📝 Complete Insert Command:');
  console.log(`INSERT INTO nasso_users (
    usr_uname, usr_posio, usr_status, usr_passwd,
    usr_email, usr_phone, usr_county, full_name, join_date
) VALUES (
    'testadmin', 'admin', 'Active',
    '${hash}',
    'testadmin@anzacash.com', '+255712345679',
    'Tanzania', 'Test Administrator', CURDATE()
) ON DUPLICATE KEY UPDATE usr_passwd = '${hash}', usr_posio = 'admin', usr_status = 'Active';`);
}

generateCorrectHash().catch(console.error);
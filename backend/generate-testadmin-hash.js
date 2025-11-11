const bcrypt = require('bcryptjs');

async function generateTestAdminHash() {
  const password = 'testadmin@123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
  return hash;
}

generateTestAdminHash();
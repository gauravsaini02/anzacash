const mysql = require('mysql2/promise');

async function activateSeller() {
  let connection;

  try {
    // Database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'anzacash',
      port: process.env.DB_PORT || 3306
    });

    // Activate the test seller account
    const [result] = await connection.execute(
      'UPDATE nasso_users SET usr_status = ? WHERE usr_uname = ?',
      ['Active', 'testseller']
    );

    console.log('✅ Seller account activated successfully!');
    console.log(`Rows affected: ${result.affectedRows}`);

    // Verify the activation
    const [seller] = await connection.execute(
      'SELECT usr_Id, usr_uname, usr_status, usr_posio FROM nasso_users WHERE usr_uname = ?',
      ['testseller']
    );

    if (seller.length > 0) {
      console.log('📋 Seller details:');
      console.log(`  ID: ${seller[0].usr_Id}`);
      console.log(`  Username: ${seller[0].usr_uname}`);
      console.log(`  Status: ${seller[0].usr_status}`);
      console.log(`  Position: ${seller[0].usr_posio}`);
    }

  } catch (error) {
    console.error('❌ Error activating seller:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

activateSeller();
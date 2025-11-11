const mysql = require('mysql2/promise');
const fs = require('fs');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'anzacash_1997',
  database: 'anzacash-db'
};

async function insertVendor2Products() {
  let connection;

  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);

    console.log('Reading TechVendor Plus products from JSON file...');
    const productsData = fs.readFileSync('techvendor2-products.json', 'utf8');
    const products = JSON.parse(productsData);

    console.log(`Found ${products.length} products to insert for TechVendor Plus...`);

    let insertedCount = 0;
    const newVendorId = 103674; // TechVendor Plus ID

    for (const product of products) {
      const sql = `
        INSERT INTO tbl_products (pro_name, pro_des, pro_price, pro_category, sel_comisio, pro_location, pro_country, seller_nm, pro_date, pro_status, pro_seller)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        product.name,
        product.description,
        product.price,
        product.category,
        product.commission,
        product.location,
        product.country,
        newVendorId, // seller_nm (TechVendor Plus ID)
        product.date,
        'Approved', // Set status to Approved
        'techvendor_plus' // pro_seller
      ];

      await connection.execute(sql, values);
      insertedCount++;

      if (insertedCount % 10 === 0) {
        console.log(`Inserted ${insertedCount} products...`);
      }
    }

    console.log(`Successfully inserted ${insertedCount} TechVendor Plus products!`);

    // Update the seller profile with the new product count
    console.log('Updating seller profile...');
    await connection.execute(
      'UPDATE tbl_seller_profiles SET total_products = ? WHERE user_id = ?',
      [insertedCount, newVendorId]
    );

    // Verify the insertion
    const [rows] = await connection.execute(
      'SELECT COUNT(*) as count FROM tbl_products WHERE seller_nm = ?',
      [newVendorId]
    );

    console.log(`Total products for TechVendor Plus (ID: ${newVendorId}): ${rows[0].count}`);

    // Show sample of inserted products
    const [sampleRows] = await connection.execute(
      'SELECT pro_name, pro_category, pro_price, sel_comisio FROM tbl_products WHERE seller_nm = ? LIMIT 5',
      [newVendorId]
    );

    console.log('\n=== Sample TechVendor Plus Products ===');
    sampleRows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.pro_name}`);
      console.log(`   Category: ${row.pro_category} | Price: $${row.pro_price} | Commission: ${row.sel_comisio}%`);
    });

    return insertedCount;

  } catch (error) {
    console.error('Error inserting TechVendor Plus products:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the insertion
insertVendor2Products().then(count => {
  console.log(`\n🎉 TechVendor Plus setup complete! Added ${count} tech products to the marketplace.`);
}).catch(console.error);
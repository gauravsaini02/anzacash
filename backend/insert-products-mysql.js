const mysql = require('mysql2/promise');
const fs = require('fs');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'anzacash_1997',
  database: 'anzacash-db'
};

async function insertProducts() {
  let connection;

  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);

    console.log('Reading products from JSON file...');
    const productsData = fs.readFileSync('test-products.json', 'utf8');
    const products = JSON.parse(productsData);

    console.log(`Found ${products.length} products to insert...`);

    let insertedCount = 0;

    for (const product of products) {
      const sql = `
        INSERT INTO tbl_products (pro_name, pro_des, pro_price, pro_category, sel_comisio, pro_location, pro_country, seller_nm, pro_date, pro_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        product.name,
        product.description,
        product.price,
        product.category,
        product.commission,
        product.location,
        product.country,
        103669, // seller ID
        product.date,
        'Approved' // Set status to Approved
      ];

      await connection.execute(sql, values);
      insertedCount++;

      if (insertedCount % 10 === 0) {
        console.log(`Inserted ${insertedCount} products...`);
      }
    }

    console.log(`Successfully inserted ${insertedCount} products!`);

    // Verify the insertion
    const [rows] = await connection.execute(
      'SELECT COUNT(*) as count FROM tbl_products WHERE seller_nm = ?',
      [103669]
    );

    console.log(`Total products for seller 103669: ${rows[0].count}`);

  } catch (error) {
    console.error('Error inserting products:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the insertion
insertProducts();
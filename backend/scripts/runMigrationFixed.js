const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    // Database connection
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'anzacash_1997',
        database: 'anzacash-db',
        multipleStatements: true
    });

    try {
        console.log('🚀 Starting database migration...');

        // Execute individual statements in correct order
        const statements = [
            // 1. Add columns first
            "ALTER TABLE tbl_sh_orders ADD COLUMN customer_id INT NULL, ADD COLUMN seller_id INT NULL",

            // 2. Create new tables
            `CREATE TABLE IF NOT EXISTS tbl_seller_profiles (
                profile_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNIQUE NOT NULL,
                business_name VARCHAR(200) NULL,
                business_description TEXT NULL,
                commission_rate DECIMAL(5,2) DEFAULT 15.00,
                verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
                business_phone VARCHAR(20) NULL,
                business_email VARCHAR(254) NULL,
                business_address TEXT NULL,
                rating DECIMAL(3,2) DEFAULT 0.00,
                total_sales DECIMAL(15,2) DEFAULT 0.00,
                total_products INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES nasso_users(usr_Id) ON DELETE CASCADE,
                INDEX idx_seller_user (user_id),
                INDEX idx_seller_status (verification_status),
                INDEX idx_seller_rating (rating)
            )`,

            `CREATE TABLE IF NOT EXISTS tbl_customer_profiles (
                profile_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNIQUE NOT NULL,
                shipping_address TEXT NULL,
                billing_address TEXT NULL,
                phone_number VARCHAR(20) NULL,
                preferences JSON NULL,
                loyalty_points INT DEFAULT 0,
                total_orders INT DEFAULT 0,
                total_spent DECIMAL(15,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES nasso_users(usr_Id) ON DELETE CASCADE,
                INDEX idx_customer_user (user_id),
                INDEX idx_customer_loyalty (loyalty_points)
            )`,

            `CREATE TABLE IF NOT EXISTS tbl_order_items (
                item_id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                unit_price DECIMAL(10,2) NOT NULL,
                total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES tbl_sh_orders(o_ID) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES tbl_products(pro_ID) ON DELETE RESTRICT,
                INDEX idx_order_items_order (order_id),
                INDEX idx_order_items_product (product_id),
                INDEX idx_order_items_created (created_at)
            )`,

            `CREATE TABLE IF NOT EXISTS tbl_inventory (
                inventory_id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                seller_id INT NOT NULL,
                quantity_available INT DEFAULT 0,
                quantity_sold INT DEFAULT 0,
                reorder_level INT DEFAULT 0,
                cost_price DECIMAL(10,2) NULL,
                selling_price DECIMAL(10,2) NULL,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES tbl_products(pro_ID) ON DELETE CASCADE,
                FOREIGN KEY (seller_id) REFERENCES nasso_users(usr_Id) ON DELETE CASCADE,
                UNIQUE KEY unique_product_seller (product_id, seller_id),
                INDEX idx_inventory_product (product_id),
                INDEX idx_inventory_seller (seller_id),
                INDEX idx_inventory_stock (quantity_available)
            )`,

            `CREATE TABLE IF NOT EXISTS tbl_transactions (
                transaction_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                order_id INT NULL,
                amount DECIMAL(10,2) NOT NULL,
                transaction_type ENUM('sale', 'commission', 'refund', 'withdrawal', 'payment') NOT NULL,
                description TEXT NULL,
                reference_id VARCHAR(100) NULL,
                balance_after DECIMAL(15,2) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES nasso_users(usr_Id) ON DELETE CASCADE,
                FOREIGN KEY (order_id) REFERENCES tbl_sh_orders(o_ID) ON DELETE SET NULL,
                INDEX idx_transactions_user (user_id),
                INDEX idx_transactions_order (order_id),
                INDEX idx_transactions_type (transaction_type),
                INDEX idx_transactions_date (created_at)
            )`,

            // 3. Add indexes after columns exist
            "CREATE INDEX IF NOT EXISTS idx_orders_customer ON tbl_sh_orders(customer_id)",
            "CREATE INDEX IF NOT EXISTS idx_orders_seller ON tbl_sh_orders(seller_id)",
            "CREATE INDEX IF NOT EXISTS idx_products_seller ON tbl_products(seller_nm)",
            "CREATE INDEX IF NOT EXISTS idx_users_username ON nasso_users(usr_uname)",
            "CREATE INDEX IF NOT EXISTS idx_orders_status ON tbl_sh_orders(oda_status)",
            "CREATE INDEX IF NOT EXISTS idx_products_status ON tbl_products(pro_status)",

            // 4. Add foreign key constraints
            "ALTER TABLE tbl_sh_orders ADD CONSTRAINT IF NOT EXISTS fk_orders_customer FOREIGN KEY (customer_id) REFERENCES nasso_users(usr_Id) ON DELETE SET NULL",
            "ALTER TABLE tbl_sh_orders ADD CONSTRAINT IF NOT EXISTS fk_orders_seller FOREIGN KEY (seller_id) REFERENCES nasso_users(usr_Id) ON DELETE SET NULL",
            "ALTER TABLE tbl_sh_orders ADD CONSTRAINT IF NOT EXISTS fk_orders_product FOREIGN KEY (o_pro_Id) REFERENCES tbl_products(pro_ID) ON DELETE SET NULL",
            "ALTER TABLE tbl_products ADD CONSTRAINT IF NOT EXISTS fk_products_seller FOREIGN KEY (seller_nm) REFERENCES nasso_users(usr_Id) ON DELETE SET NULL",

            // 5. Update existing orders with derived seller data
            "UPDATE tbl_sh_orders o JOIN tbl_products p ON o.o_pro_Id = p.pro_ID SET o.seller_id = p.seller_nm WHERE o.seller_id IS NULL AND o.o_pro_Id IS NOT NULL"
        ];

        console.log(`📝 Executing ${statements.length} SQL statements...`);

        let completed = 0;
        let errors = [];

        // Execute statements one by one
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            try {
                await connection.execute(statement);
                completed++;
                console.log(`✅ Statement ${completed}/${statements.length} completed`);
            } catch (error) {
                // Check if it's a "duplicate" error which is fine
                const errorMsg = error.message.toLowerCase();
                if (errorMsg.includes('duplicate column name') ||
                    errorMsg.includes('table') && errorMsg.includes('already exists') ||
                    errorMsg.includes('duplicate key name') ||
                    errorMsg.includes('constraint') && errorMsg.includes('already exists') ||
                    errorMsg.includes('check that column/key exists')) {
                    console.log(`⚠️  Skipping (already exists): Statement ${i + 1}`);
                    completed++;
                } else {
                    console.error(`❌ Error in statement ${i + 1}: ${error.message}`);
                    errors.push({statement: i + 1, error: error.message});
                }
            }
        }

        console.log(`\n🎉 Migration completed!`);
        console.log(`✅ Successful statements: ${completed}`);
        console.log(`❌ Errors: ${errors.length}`);

        if (errors.length > 0) {
            console.log('\n📋 Errors encountered:');
            errors.forEach(err => {
                console.log(`  Statement ${err.statement}: ${err.error}`);
            });
        }

        // Verify the migration results
        console.log('\n🔍 Verifying migration results...');

        try {
            const [columns] = await connection.execute("DESCRIBE tbl_sh_orders");
            const hasCustomerId = columns.some(col => col.Field === 'customer_id');
            const hasSellerId = columns.some(col => col.Field === 'seller_id');

            console.log(`  ✓ Orders table has customer_id: ${hasCustomerId}`);
            console.log(`  ✓ Orders table has seller_id: ${hasSellerId}`);

            const [sellerTables] = await connection.execute("SHOW TABLES LIKE 'tbl_seller_profiles'");
            console.log(`  ✓ Seller profiles table exists: ${sellerTables.length > 0}`);

            const [customerTables] = await connection.execute("SHOW TABLES LIKE 'tbl_customer_profiles'");
            console.log(`  ✓ Customer profiles table exists: ${customerTables.length > 0}`);

            const [orderItemsTables] = await connection.execute("SHOW TABLES LIKE 'tbl_order_items'");
            console.log(`  ✓ Order items table exists: ${orderItemsTables.length > 0}`);

            const [inventoryTables] = await connection.execute("SHOW TABLES LIKE 'tbl_inventory'");
            console.log(`  ✓ Inventory table exists: ${inventoryTables.length > 0}`);

            const [transactionsTables] = await connection.execute("SHOW TABLES LIKE 'tbl_transactions'");
            console.log(`  ✓ Transactions table exists: ${transactionsTables.length > 0}`);

            // Check if any existing orders were updated
            const [updatedOrders] = await connection.execute("SELECT COUNT(*) as count FROM tbl_sh_orders WHERE seller_id IS NOT NULL");
            console.log(`  ✓ Orders with seller info: ${updatedOrders[0].count}`);

        } catch (verifyError) {
            console.log(`⚠️  Verification error: ${verifyError.message}`);
        }

        console.log('\n🚀 Database migration is complete!');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

// Run the migration
runMigration().catch(console.error);
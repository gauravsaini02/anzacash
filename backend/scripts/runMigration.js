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

        // Read migration file
        const migrationPath = path.join(__dirname, 'migration.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        // Split SQL into individual statements (basic approach)
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt && !stmt.startsWith('--'));

        console.log(`📝 Found ${statements.length} SQL statements to execute`);

        let completed = 0;
        let errors = [];

        // Execute statements one by one for better error handling
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            try {
                await connection.execute(statement);
                completed++;
                if (completed % 5 === 0) {
                    console.log(`✅ Completed ${completed}/${statements.length} statements`);
                }
            } catch (error) {
                // Check if it's a "duplicate column" or "table already exists" error
                const errorMsg = error.message.toLowerCase();
                if (errorMsg.includes('duplicate column name') ||
                    errorMsg.includes('table') && errorMsg.includes('already exists') ||
                    errorMsg.includes('duplicate key name') ||
                    errorMsg.includes('constraint') && errorMsg.includes('already exists')) {
                    console.log(`⚠️  Skipping (already exists): ${statement.substring(0, 50)}...`);
                    completed++;
                } else {
                    console.error(`❌ Error in statement ${i + 1}: ${error.message}`);
                    console.error(`Statement: ${statement.substring(0, 100)}...`);
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

        // Verify the new tables and columns were created
        console.log('\n🔍 Verifying migration results...');

        const [columns] = await connection.execute("DESCRIBE tbl_sh_orders");
        const hasCustomerId = columns.some(col => col.Field === 'customer_id');
        const hasSellerId = columns.some(col => col.Field === 'seller_id');

        console.log(`  ✓ Orders table has customer_id: ${hasCustomerId}`);
        console.log(`  ✓ Orders table has seller_id: ${hasSellerId}`);

        try {
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

            const [views] = await connection.execute("SHOW TABLES LIKE 'v_%'");
            console.log(`  ✓ Views created: ${views.length}`);

        } catch (verifyError) {
            console.log(`⚠️  Could not verify all tables: ${verifyError.message}`);
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
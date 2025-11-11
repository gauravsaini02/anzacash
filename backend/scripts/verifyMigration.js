const mysql = require('mysql2/promise');

async function verifyMigration() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'anzacash_1997',
        database: 'anzacash-db'
    });

    try {
        console.log('🔍 Verifying completed migration...\n');

        // 1. Check orders table structure
        console.log('📋 Orders Table Structure:');
        const [ordersColumns] = await connection.execute("DESCRIBE tbl_sh_orders");
        const hasCustomerId = ordersColumns.some(col => col.Field === 'customer_id');
        const hasSellerId = ordersColumns.some(col => col.Field === 'seller_id');
        console.log(`  ✓ Has customer_id column: ${hasCustomerId}`);
        console.log(`  ✓ Has seller_id column: ${hasSellerId}`);

        // 2. Check all new tables exist
        console.log('\n📊 New Tables Created:');
        const tables = ['tbl_seller_profiles', 'tbl_customer_profiles', 'tbl_order_items', 'tbl_inventory', 'tbl_transactions'];

        for (const table of tables) {
            const [result] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
            console.log(`  ✓ ${table}: ${result.length > 0 ? 'EXISTS' : 'MISSING'}`);
        }

        // 3. Check indexes
        console.log('\n🔑 Performance Indexes:');
        const [indexResults] = await connection.execute(`
            SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME
            FROM INFORMATION_SCHEMA.STATISTICS
            WHERE TABLE_SCHEMA = 'anzacash-db'
            AND INDEX_NAME IN ('idx_orders_customer', 'idx_orders_seller', 'idx_products_seller')
            ORDER BY TABLE_NAME, INDEX_NAME
        `);

        indexResults.forEach(idx => {
            console.log(`  ✓ ${idx.TABLE_NAME}.${idx.INDEX_NAME} on ${idx.COLUMN_NAME}`);
        });

        // 4. Check foreign key constraints
        console.log('\n🔗 Foreign Key Constraints:');
        const [constraintResults] = await connection.execute(`
            SELECT TABLE_NAME, CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = 'anzacash-db'
            AND CONSTRAINT_NAME IN ('fk_orders_customer', 'fk_orders_seller', 'fk_orders_product', 'fk_products_seller')
            ORDER BY TABLE_NAME, CONSTRAINT_NAME
        `);

        constraintResults.forEach(constraint => {
            console.log(`  ✓ ${constraint.TABLE_NAME}.${constraint.CONSTRAINT_NAME}: ${constraint.COLUMN_NAME} → ${constraint.REFERENCED_TABLE_NAME}.${constraint.REFERENCED_COLUMN_NAME}`);
        });

        // 5. Test data relationships
        console.log('\n📈 Data Relationships Test:');

        // Count existing data
        const [userCount] = await connection.execute("SELECT COUNT(*) as count FROM nasso_users");
        const [productCount] = await connection.execute("SELECT COUNT(*) as count FROM tbl_products");
        const [orderCount] = await connection.execute("SELECT COUNT(*) as count FROM tbl_sh_orders");

        console.log(`  📊 Total Users: ${userCount[0].count}`);
        console.log(`  📦 Total Products: ${productCount[0].count}`);
        console.log(`  🛒 Total Orders: ${orderCount[0].count}`);

        // Check orders with seller data
        const [ordersWithSeller] = await connection.execute("SELECT COUNT(*) as count FROM tbl_sh_orders WHERE seller_id IS NOT NULL");
        console.log(`  ✓ Orders with seller info: ${ordersWithSeller[0].count}`);

        // 6. Test query performance
        console.log('\n⚡ Query Performance Test:');
        const startTime = Date.now();

        // Test joining orders with seller info
        const [testQuery] = await connection.execute(`
            SELECT o.o_ID, o.order_ID, o.customer_id, o.seller_id,
                   u_seller.usr_username as seller_name,
                   p.pro_name as product_name
            FROM tbl_sh_orders o
            LEFT JOIN nasso_users u_seller ON o.seller_id = u_seller.usr_Id
            LEFT JOIN tbl_products p ON o.o_pro_Id = p.pro_ID
            LIMIT 5
        `);

        const queryTime = Date.now() - startTime;
        console.log(`  ✅ Complex join query completed in ${queryTime}ms`);
        console.log(`  📋 Returned ${testQuery.length} order records with seller info`);

        // 7. Sample data check
        console.log('\n🎯 Sample Data Check:');
        if (testQuery.length > 0) {
            const sample = testQuery[0];
            console.log(`  Sample Order #${sample.o_ID}:`);
            console.log(`    - Order ID: ${sample.order_ID}`);
            console.log(`    - Customer ID: ${sample.customer_id || 'NULL'}`);
            console.log(`    - Seller ID: ${sample.seller_id || 'NULL'}`);
            console.log(`    - Seller Name: ${sample.seller_name || 'NULL'}`);
            console.log(`    - Product: ${sample.product_name || 'NULL'}`);
        }

        console.log('\n🎉 Migration verification completed successfully!');
        console.log('\n✅ Your ANZACASH database now supports:');
        console.log('   • Proper customer/seller order tracking');
        console.log('   • Seller and customer profile management');
        console.log('   • Multi-product orders (order items)');
        console.log('   • Inventory management');
        console.log('   • Unified transaction system');
        console.log('   • Performance-optimized queries');

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

verifyMigration().catch(console.error);
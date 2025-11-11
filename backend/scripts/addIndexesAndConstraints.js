const mysql = require('mysql2/promise');

async function addIndexesAndConstraints() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'anzacash_1997',
        database: 'anzacash-db',
        multipleStatements: false
    });

    try {
        console.log('🔧 Adding missing indexes and constraints...');

        // Check and add indexes one by one
        const indexes = [
            { name: 'idx_orders_customer', table: 'tbl_sh_orders', column: 'customer_id' },
            { name: 'idx_orders_seller', table: 'tbl_sh_orders', column: 'seller_id' },
            { name: 'idx_products_seller', table: 'tbl_products', column: 'seller_nm' },
            { name: 'idx_users_username', table: 'nasso_users', column: 'usr_uname' },
            { name: 'idx_orders_status', table: 'tbl_sh_orders', column: 'oda_status' },
            { name: 'idx_products_status', table: 'tbl_products', column: 'pro_status' }
        ];

        for (const index of indexes) {
            try {
                // Check if index exists
                const [existingIndexes] = await connection.execute(
                    `SHOW INDEX FROM ${index.table} WHERE Key_name = ?`,
                    [index.name]
                );

                if (existingIndexes.length === 0) {
                    // Create index if it doesn't exist
                    await connection.execute(
                        `CREATE INDEX ${index.name} ON ${index.table}(${index.column})`
                    );
                    console.log(`✅ Created index: ${index.name}`);
                } else {
                    console.log(`⚠️  Index already exists: ${index.name}`);
                }
            } catch (error) {
                console.log(`❌ Error creating index ${index.name}: ${error.message}`);
            }
        }

        // Add foreign key constraints (check if they exist first)
        const constraints = [
            { name: 'fk_orders_customer', table: 'tbl_sh_orders', column: 'customer_id', refTable: 'nasso_users', refColumn: 'usr_Id', onDelete: 'SET NULL' },
            { name: 'fk_orders_seller', table: 'tbl_sh_orders', column: 'seller_id', refTable: 'nasso_users', refColumn: 'usr_Id', onDelete: 'SET NULL' },
            { name: 'fk_orders_product', table: 'tbl_sh_orders', column: 'o_pro_Id', refTable: 'tbl_products', refColumn: 'pro_ID', onDelete: 'SET NULL' },
            { name: 'fk_products_seller', table: 'tbl_products', column: 'seller_nm', refTable: 'nasso_users', refColumn: 'usr_Id', onDelete: 'SET NULL' }
        ];

        for (const constraint of constraints) {
            try {
                // Check if constraint exists
                const [existingConstraints] = await connection.execute(
                    `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                     WHERE TABLE_SCHEMA = 'anzacash-db' AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?`,
                    [constraint.table, constraint.name]
                );

                if (existingConstraints.length === 0) {
                    // Create constraint if it doesn't exist
                    await connection.execute(
                        `ALTER TABLE ${constraint.table}
                         ADD CONSTRAINT ${constraint.name}
                         FOREIGN KEY (${constraint.column})
                         REFERENCES ${constraint.refTable}(${constraint.refColumn})
                         ON DELETE ${constraint.onDelete}`
                    );
                    console.log(`✅ Created constraint: ${constraint.name}`);
                } else {
                    console.log(`⚠️  Constraint already exists: ${constraint.name}`);
                }
            } catch (error) {
                console.log(`❌ Error creating constraint ${constraint.name}: ${error.message}`);
            }
        }

        console.log('\n🎉 Indexes and constraints migration completed!');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

addIndexesAndConstraints().catch(console.error);
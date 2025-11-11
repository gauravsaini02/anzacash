-- ANZACASH Database Migration Script
-- Fixes customer/seller order tracking and adds proper relationships

-- =====================================================
-- 1. Add customer_id and seller_id to orders table
-- =====================================================
ALTER TABLE tbl_sh_orders
ADD COLUMN customer_id INT NULL,
ADD COLUMN seller_id INT NULL;

-- =====================================================
-- 2. Add performance indexes
-- =====================================================
CREATE INDEX idx_orders_customer ON tbl_sh_orders(customer_id);
CREATE INDEX idx_orders_seller ON tbl_sh_orders(seller_id);
CREATE INDEX idx_products_seller ON tbl_products(seller_nm);
CREATE INDEX idx_users_username ON nasso_users(usr_uname);
CREATE INDEX idx_orders_status ON tbl_sh_orders(oda_status);
CREATE INDEX idx_products_status ON tbl_products(pro_status);

-- =====================================================
-- 3. Add foreign key constraints
-- =====================================================
-- Order relationships
ALTER TABLE tbl_sh_orders
ADD CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES nasso_users(usr_Id) ON DELETE SET NULL,
ADD CONSTRAINT fk_orders_seller FOREIGN KEY (seller_id) REFERENCES nasso_users(usr_Id) ON DELETE SET NULL,
ADD CONSTRAINT fk_orders_product FOREIGN KEY (o_pro_Id) REFERENCES tbl_products(pro_ID) ON DELETE SET NULL;

-- Product-seller relationship
ALTER TABLE tbl_products
ADD CONSTRAINT fk_products_seller FOREIGN KEY (seller_nm) REFERENCES nasso_users(usr_Id) ON DELETE SET NULL;

-- Payment relationships
ALTER TABLE tbl_payments
ADD CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES nasso_users(usr_Id) ON DELETE SET NULL,
ADD CONSTRAINT fk_payments_seller FOREIGN KEY (sh_usr_ID) REFERENCES nasso_users(usr_Id) ON DELETE SET NULL,
ADD CONSTRAINT fk_payments_product FOREIGN KEY (sh_pro_Id) REFERENCES tbl_products(pro_ID) ON DELETE SET NULL;

-- =====================================================
-- 4. Create seller profile table
-- =====================================================
CREATE TABLE tbl_seller_profiles (
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
);

-- =====================================================
-- 5. Create customer profile table
-- =====================================================
CREATE TABLE tbl_customer_profiles (
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
);

-- =====================================================
-- 6. Create order items table for multi-product orders
-- =====================================================
CREATE TABLE tbl_order_items (
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
);

-- =====================================================
-- 7. Create inventory management table
-- =====================================================
CREATE TABLE tbl_inventory (
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
);

-- =====================================================
-- 8. Create unified transaction system
-- =====================================================
CREATE TABLE tbl_transactions (
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
);

-- =====================================================
-- 9. Update existing orders with derived seller data
-- =====================================================
-- Set seller_id based on product ownership for existing orders
UPDATE tbl_sh_orders o
JOIN tbl_products p ON o.o_pro_Id = p.pro_ID
SET o.seller_id = p.seller_nm
WHERE o.seller_id IS NULL AND o.o_pro_Id IS NOT NULL;

-- =====================================================
-- 10. Create view for order details with seller/customer info
-- =====================================================
CREATE VIEW v_order_details AS
SELECT
    o.o_ID,
    o.order_ID,
    o.o_date,
    o.oda_status,
    o.o_idadi as quantity,
    o.o_delivery,
    o.customer_id,
    o.seller_id,
    o.o_pro_Id as product_id,
    p.pro_name as product_name,
    p.pro_price as product_price,

    -- Customer info
    cu.usr_username as customer_username,
    cu.usr_email as customer_email,
    cu.full_name as customer_name,
    cu.usr_phone as customer_phone,

    -- Seller info
    su.usr_username as seller_username,
    su.usr_email as seller_email,
    su.full_name as seller_name,
    su.usr_phone as seller_phone,
    sp.business_name,
    sp.commission_rate,

    -- Calculated fields
    (o.o_idadi * p.pro_price) as order_total,
    (o.o_idadi * p.pro_price * (sp.commission_rate / 100)) as commission_amount,
    (o.o_idadi * p.pro_price * (1 - sp.commission_rate / 100)) as seller_earning

FROM tbl_sh_orders o
LEFT JOIN tbl_products p ON o.o_pro_Id = p.pro_ID
LEFT JOIN nasso_users cu ON o.customer_id = cu.usr_Id
LEFT JOIN nasso_users su ON o.seller_id = su.usr_Id
LEFT JOIN tbl_seller_profiles sp ON su.usr_Id = sp.user_id;

-- =====================================================
-- 11. Create view for seller statistics
-- =====================================================
CREATE VIEW v_seller_stats AS
SELECT
    u.usr_Id as seller_id,
    u.usr_username,
    u.full_name,
    sp.business_name,
    sp.commission_rate,
    sp.verification_status,
    sp.rating,
    COUNT(DISTINCT p.pro_ID) as total_products,
    COUNT(DISTINCT o.o_ID) as total_orders,
    SUM(CASE WHEN o.oda_status = 'Completed' THEN 1 ELSE 0 END) as completed_orders,
    SUM(CASE WHEN o.oda_status = 'Pending' THEN 1 ELSE 0 END) as pending_orders,
    COALESCE(SUM(o.o_idadi * p.pro_price), 0) as total_revenue,
    COALESCE(SUM(o.o_idadi * p.pro_price * (sp.commission_rate / 100)), 0) as total_commission,
    COALESCE(SUM(o.o_idadi * p.pro_price * (1 - sp.commission_rate / 100)), 0) as total_earnings,
    sp.total_sales as reported_sales,
    ac.ac_balance as current_balance

FROM nasso_users u
LEFT JOIN tbl_seller_profiles sp ON u.usr_Id = sp.user_id
LEFT JOIN tbl_products p ON u.usr_Id = p.seller_nm
LEFT JOIN tbl_sh_orders o ON p.pro_ID = o.o_pro_Id
LEFT JOIN nasso_accounts ac ON u.usr_Id = ac.ac_usr
WHERE u.usr_posio IN ('vendor', 'traders') OR sp.user_id IS NOT NULL
GROUP BY u.usr_Id, u.usr_username, u.full_name, sp.business_name, sp.commission_rate, sp.verification_status, sp.rating, sp.total_sales, ac.ac_balance;

-- =====================================================
-- 12. Create view for customer statistics
-- =====================================================
CREATE VIEW v_customer_stats AS
SELECT
    u.usr_Id as customer_id,
    u.usr_username,
    u.full_name,
    u.usr_email,
    u.usr_phone,
    COUNT(DISTINCT o.o_ID) as total_orders,
    SUM(CASE WHEN o.oda_status = 'Completed' THEN 1 ELSE 0 END) as completed_orders,
    SUM(CASE WHEN o.oda_status = 'Pending' THEN 1 ELSE 0 END) as pending_orders,
    COALESCE(SUM(o.o_idadi * p.pro_price), 0) as total_spent,
    cp.loyalty_points,
    cp.total_orders as reported_orders,
    cp.total_spent as reported_spent

FROM nasso_users u
LEFT JOIN tbl_customer_profiles cp ON u.usr_Id = cp.user_id
LEFT JOIN tbl_sh_orders o ON u.usr_Id = o.customer_id
LEFT JOIN tbl_products p ON o.o_pro_Id = p.pro_ID
GROUP BY u.usr_Id, u.usr_username, u.full_name, u.usr_email, u.usr_phone, cp.loyalty_points, cp.total_orders, cp.total_spent;

-- =====================================================
-- Migration Complete
-- =====================================================
SELECT 'Database migration completed successfully!' as message;
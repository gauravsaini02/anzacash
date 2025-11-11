-- Get existing techhub user ID
SET @vendor_id = (SELECT usr_Id FROM nasso_users WHERE usr_uname = 'techhub');

-- Update or insert account data
INSERT INTO nasso_accounts (ac_usr, ac_balance, ac_profit, ac_bonus, ac_withdraw, ac_spin, ac_video, ac_trivia, ac_status)
VALUES ('techhub', 2450000, 1500000, 500000, 300000, 0, 0, 0, 1)
ON DUPLICATE KEY UPDATE
ac_balance = 2450000,
ac_profit = 1500000,
ac_bonus = 500000,
ac_withdraw = 300000;

-- Check if we have the user ID
SELECT @vendor_id as vendor_id;

-- Add some sample products if they don't exist already
INSERT IGNORE INTO tbl_products (pro_ID, pro_name, pro_seller, pro_location, pro_date, pro_price, pro_category, pro_pay_method, pro_status, pro_country, pro_des, seller_nm, sel_comisio) VALUES
(1, 'Smartphone Pro Max', 'TechHub Electronics', 'Dar es Salaam, Tanzania', '2024-01-20', 2500000, 'Electronics', 'Mobile Money', 'Approved', 'Tanzania', 'Latest smartphone with advanced features and high-quality camera', @vendor_id, 10),
(2, 'Laptop UltraBook', 'TechHub Electronics', 'Dar es Salaam, Tanzania', '2024-01-21', 1800000, 'Electronics', 'Bank Transfer', 'Approved', 'Tanzania', 'High-performance laptop for professionals and students', @vendor_id, 8),
(3, 'Wireless Headphones', 'TechHub Electronics', 'Dar es Salaam, Tanzania', '2024-01-22', 350000, 'Electronics', 'Mobile Money', 'Approved', 'Tanzania', 'Premium wireless headphones with noise cancellation', @vendor_id, 12),
(4, 'Smart Watch Series 5', 'TechHub Electronics', 'Dar es Salaam, Tanzania', '2024-01-23', 850000, 'Electronics', 'Mobile Money', 'Not Approved', 'Tanzania', 'Advanced smartwatch with health tracking features', @vendor_id, 15),
(5, 'Tablet Pro 12"', 'TechHub Electronics', 'Dar es Salaam, Tanzania', '2024-01-24', 1200000, 'Electronics', 'Bank Transfer', 'Approved', 'Tanzania', 'Professional tablet with stylus support and high-resolution display', @vendor_id, 10);

-- Add sample orders if they don't exist
INSERT IGNORE INTO tbl_sh_orders (o_pro_Id, order_ID, o_user, o_date, oda_status) VALUES
(1, 'ORD-2024-001', @vendor_id, '2024-01-25', 'Completed'),
(2, 'ORD-2024-002', @vendor_id, '2024-01-26', 'Completed'),
(3, 'ORD-2024-003', @vendor_id, '2024-01-27', 'Processing'),
(1, 'ORD-2024-004', @vendor_id, '2024-01-28', 'Pending'),
(5, 'ORD-2024-005', @vendor_id, '2024-01-29', 'Completed');
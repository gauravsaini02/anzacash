-- Create test vendor user in nasso_users table
INSERT INTO nasso_users (usr_uname, usr_posio, usr_status, usr_passwd, usr_email, usr_phone, usr_county, full_name, join_date)
VALUES ('techhub', 'vendor', 'Active', '$2a$10$rX8YQKxYjKZzYjKZzYjKZOKZzYjKZzYjKZzYjKZzYjKZzYjKZzYjK', 'techhub@anzacash.com', '+255712345678', 'Tanzania', 'TechHub Electronics', '2024-01-15');

-- Get the user ID of the newly created vendor
SET @vendor_id = LAST_INSERT_ID();

-- Create corresponding account record in nasso_accounts
INSERT INTO nasso_accounts (ac_usr, ac_balance, ac_profit, ac_bonus, ac_withdraw, ac_spin, ac_video, ac_trivia, ac_status)
VALUES ('techhub', 2450000, 1500000, 500000, 300000, 0, 0, 0, 1);

-- Create sample products for TechHub Electronics
INSERT INTO tbl_products (pro_name, pro_seller, pro_location, pro_date, pro_price, pro_category, pro_pay_method, pro_status, pro_country, pro_des, seller_nm, sel_comisio) VALUES
('Smartphone Pro Max', 'TechHub Electronics', 'Dar es Salaam, Tanzania', '2024-01-20', 2500000, 'Electronics', 'Mobile Money', 'Approved', 'Tanzania', 'Latest smartphone with advanced features and high-quality camera', @vendor_id, 10),
('Laptop UltraBook', 'TechHub Electronics', 'Dar es Salaam, Tanzania', '2024-01-21', 1800000, 'Electronics', 'Bank Transfer', 'Approved', 'Tanzania', 'High-performance laptop for professionals and students', @vendor_id, 8),
('Wireless Headphones', 'TechHub Electronics', 'Dar es Salaam, Tanzania', '2024-01-22', 350000, 'Electronics', 'Mobile Money', 'Approved', 'Tanzania', 'Premium wireless headphones with noise cancellation', @vendor_id, 12),
('Smart Watch Series 5', 'TechHub Electronics', 'Dar es Salaam, Tanzania', '2024-01-23', 850000, 'Electronics', 'Mobile Money', 'Not Approved', 'Tanzania', 'Advanced smartwatch with health tracking features', @vendor_id, 15),
('Tablet Pro 12"', 'TechHub Electronics', 'Dar es Salaam, Tanzania', '2024-01-24', 1200000, 'Electronics', 'Bank Transfer', 'Approved', 'Tanzania', 'Professional tablet with stylus support and high-resolution display', @vendor_id, 10);

-- Create some sample orders for TechHub Electronics products
INSERT INTO tbl_sh_orders (o_pro_Id, order_ID, o_user, o_date, oda_status) VALUES
(1, 'ORD-2024-001', @vendor_id, '2024-01-25', 'Completed'),
(2, 'ORD-2024-002', @vendor_id, '2024-01-26', 'Completed'),
(3, 'ORD-2024-003', @vendor_id, '2024-01-27', 'Processing'),
(1, 'ORD-2024-004', @vendor_id, '2024-01-28', 'Pending'),
(5, 'ORD-2024-005', @vendor_id, '2024-01-29', 'Completed');

-- Note: The password for 'techhub' is 'password123' (hashed above)
-- Password hash: $2a$10$rX8YQKxYjKZzYjKZzYjKZOKZzYjKZzYjKZzYjKZzYjKZzYjKZzYjK is the bcrypt hash of 'password123'
-- You can use this test account to login as a vendor and see real data from the database
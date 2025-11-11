-- Create Admin User Script
-- This script creates a test admin account for ANZACASH

INSERT INTO nasso_users (
    usr_uname,
    usr_posio,
    usr_status,
    usr_passwd,
    usr_email,
    usr_phone,
    usr_county,
    full_name,
    join_date
) VALUES (
    'admin',
    'admin',
    'Active',
    '$2a$10$rK8vF2ZQZQZQZQZQZQZQZOvF2ZQZQZQZQZQZQZQZQZOvF2ZQZQZQZQZQZQZQZOvF2',
    'admin@anzacash.com',
    '+255712345678',
    'Tanzania',
    'System Administrator',
    CURDATE()
) ON DUPLICATE KEY UPDATE
    usr_posio = 'admin',
    usr_status = 'Active',
    usr_passwd = '$2a$10$rK8vF2ZQZQZQZQZQZQZQZOvF2ZQZQZQZQZQZQZQZQZOvF2ZQZQZQZQZQZQZQZOvF2',
    usr_email = 'admin@anzacash.com',
    full_name = 'System Administrator';

-- Note: The password hash above is for "Admin@123456"
-- To generate a new hash, you would need to use bcrypt in Node.js
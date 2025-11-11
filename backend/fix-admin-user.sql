-- Complete fix for testadmin user
-- Run this in your Docker database

-- First, delete any existing testadmin user to start fresh
DELETE FROM nasso_users WHERE usr_uname = 'testadmin';

-- Insert the testadmin user with correct admin settings
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
    'testadmin',                                    -- Username
    'admin',                                        -- Role: admin (full admin permissions)
    'Active',                                       -- Status: Active (required for login)
    '$2b$10$RWJ2SutCoGDp0hln/LZW/u5/aZ538Lb1SHVIcuKF/zBEHdqBMiB2S', -- Hashed password for "testadmin@123"
    'testadmin@anzacash.com',                       -- Email
    '+255712345679',                                -- Phone
    'Tanzania',                                     -- Country
    'Test Administrator',                           -- Full Name
    CURDATE()                                       -- Join Date
);

-- Verify the admin user was created correctly
SELECT
    usr_Id as 'User ID',
    usr_uname as 'Username',
    usr_posio as 'Role',
    usr_status as 'Status',
    usr_email as 'Email',
    full_name as 'Full Name'
FROM nasso_users
WHERE usr_uname = 'testadmin';

-- Show all admin users in the system
SELECT
    usr_Id as 'User ID',
    usr_uname as 'Username',
    usr_posio as 'Role',
    usr_status as 'Status',
    usr_email as 'Email',
    full_name as 'Full Name'
FROM nasso_users
WHERE usr_posio = 'admin';
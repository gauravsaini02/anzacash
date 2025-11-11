-- Check if testadmin user exists and verify its status
SELECT
    usr_Id,
    usr_uname,
    usr_posio,
    usr_status,
    usr_email,
    full_name,
    join_date
FROM nasso_users
WHERE usr_uname = 'testadmin';

-- If user doesn't exist, create it with proper status
INSERT IGNORE INTO nasso_users (
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
    'testadmin',
    'admin',
    'Active',
    '$2b$10$RWJ2SutCoGDp0hln/LZW/u5/aZ538Lb1SHVIcuKF/zBEHdqBMiB2S',
    'testadmin@anzacash.com',
    '+255712345679',
    'Tanzania',
    'Test Administrator',
    CURDATE()
);

-- Update user to ensure it has Active status
UPDATE nasso_users
SET usr_status = 'Active', usr_posio = 'admin'
WHERE usr_uname = 'testadmin';

-- Final verification
SELECT
    usr_Id,
    usr_uname,
    usr_posio,
    usr_status,
    usr_email,
    full_name
FROM nasso_users
WHERE usr_uname = 'testadmin';
-- Update the techhub user's password to 'password123'
UPDATE nasso_users
SET usr_passwd = '$2b$10$jbPiVwxrB91P1j8RezdfZ.OELbRNYBlmPByfRd6Sbt3Kx1zkRc0Iy'
WHERE usr_uname = 'techhub';

-- Verify the update
SELECT usr_uname, usr_posio, usr_status, usr_email, full_name
FROM nasso_users
WHERE usr_uname = 'techhub';
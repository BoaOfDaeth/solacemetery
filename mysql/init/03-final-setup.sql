-- Final setup and verification
-- This script runs after all other initialization

USE `solace_db`;

-- Verify all tables exist and have data
SELECT 
    'MVP' as table_name,
    COUNT(*) as record_count,
    'OK' as status
FROM MVP
UNION ALL
SELECT 
    'PVP' as table_name,
    COUNT(*) as record_count,
    'OK' as status
FROM PVP
UNION ALL
SELECT 
    'accounts' as table_name,
    COUNT(*) as record_count,
    'OK' as status
FROM accounts;

-- Show final status
SELECT 'Database initialization complete' as status;
SELECT 'Available tables:' as info;
SHOW TABLES;

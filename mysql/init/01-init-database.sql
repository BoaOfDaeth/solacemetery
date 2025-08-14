-- Initialize solace_db database
-- This script runs before the main dump import

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `solace_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- Use the database
USE `solace_db`;

-- Create additional user with specific permissions
CREATE USER IF NOT EXISTS 'solacemetry_user'@'%' IDENTIFIED BY 'solacemetry_password';
GRANT ALL PRIVILEGES ON `solace_db`.* TO 'solacemetry_user'@'%';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Set timezone
SET time_zone = '+00:00';

-- Set character set
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection = utf8mb4;

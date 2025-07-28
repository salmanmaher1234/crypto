-- SuperCoin Database Schema for MySQL
-- Run this in your Hostinger MySQL database

CREATE DATABASE IF NOT EXISTS supercoin;
USE supercoin;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    balance DECIMAL(15,2) DEFAULT 0.00,
    available_balance DECIMAL(15,2) DEFAULT 0.00,
    frozen_balance DECIMAL(15,2) DEFAULT 0.00,
    reputation INT DEFAULT 100,
    profile_image TEXT,
    signature TEXT,
    gender VARCHAR(20) DEFAULT 'Confidential',
    direction ENUM('Buy Up', 'Buy Down', 'Actual') DEFAULT 'Actual',
    is_banned BOOLEAN DEFAULT FALSE,
    withdrawal_prohibited BOOLEAN DEFAULT FALSE,
    fund_password_hash VARCHAR(255),
    agent_invitation_code VARCHAR(50),
    invitation_code VARCHAR(50),
    user_type ENUM('Normal', 'VIP', 'Agent') DEFAULT 'Normal',
    general_agent VARCHAR(100),
    registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bank accounts table
CREATE TABLE bank_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    holder_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('deposit', 'withdrawal', 'freeze', 'unfreeze') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status ENUM('pending', 'completed', 'rejected') DEFAULT 'pending',
    description TEXT,
    transaction_no VARCHAR(100),
    recharge_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Betting orders table
CREATE TABLE betting_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    asset VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    direction ENUM('Buy Up', 'Buy Down') NOT NULL,
    actual_direction ENUM('Buy Up', 'Buy Down'),
    duration INT NOT NULL,
    entry_price DECIMAL(15,4) NOT NULL,
    exit_price DECIMAL(15,4),
    profit DECIMAL(15,2) DEFAULT 0.00,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Withdrawal requests table
CREATE TABLE withdrawal_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bank_account_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE
);

-- Announcements table
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT INTO users (
    username, 
    email, 
    password_hash, 
    name, 
    role, 
    balance, 
    available_balance, 
    reputation,
    invitation_code
) VALUES (
    'admin', 
    'admin@supercoin.com', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
    'Administrator', 
    'admin', 
    1000000.00, 
    1000000.00, 
    100,
    '100025'
);

-- Insert test customer users
INSERT INTO users (
    username, 
    email, 
    password_hash, 
    name, 
    role, 
    balance, 
    available_balance, 
    reputation,
    invitation_code
) VALUES 
(
    'sarah', 
    'sarah@example.com', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password123
    'Sarah Johnson', 
    'customer', 
    50000.00, 
    50000.00, 
    100,
    '100026'
),
(
    'john', 
    'john@example.com', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password123
    'John Smith', 
    'customer', 
    25000.00, 
    25000.00, 
    100,
    '100027'
);
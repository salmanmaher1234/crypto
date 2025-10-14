-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2025 at 12:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `supercoin`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` enum('News','Update','Alert') DEFAULT 'News',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `type`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Welcome to SuperCoin', 'Welcome to our cryptocurrency trading platform. Start trading today!', 'News', 1, '2025-08-13 09:56:58', '2025-08-13 09:56:58'),
(2, 'System Maintenance', 'Scheduled maintenance will be performed on Sunday 2:00-4:00 AM UTC.', 'Alert', 1, '2025-08-13 09:56:58', '2025-08-13 09:56:58'),
(3, 'New Features Available', 'We have added new trading pairs and improved our order processing system.', 'Update', 1, '2025-08-13 09:56:58', '2025-08-13 09:56:58'),
(4, 'hello', 'PAkistan', 'News', 1, '2025-09-03 09:26:25', '2025-09-03 09:26:25');

-- --------------------------------------------------------

--
-- Table structure for table `bank_accounts`
--

CREATE TABLE `bank_accounts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `binding_type` varchar(50) NOT NULL DEFAULT 'Bank Card',
  `currency` varchar(10) NOT NULL DEFAULT 'INR',
  `account_holder_name` varchar(255) NOT NULL,
  `account_number` varchar(100) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `branch_name` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(20) NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bank_accounts`
--

INSERT INTO `bank_accounts` (`id`, `user_id`, `binding_type`, `currency`, `account_holder_name`, `account_number`, `bank_name`, `branch_name`, `ifsc_code`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 1, 'Bank Card', 'INR', 'ahsan', '1234567890', 'Mezan', '1', '1234', 0, '2025-09-03 09:06:50', '2025-09-03 09:06:50');

-- --------------------------------------------------------

--
-- Table structure for table `betting_orders`
--

CREATE TABLE `betting_orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  `asset` varchar(50) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `direction` enum('Buy Up','Buy Down') NOT NULL,
  `duration` int(11) NOT NULL,
  `entry_price` decimal(15,4) NOT NULL,
  `exit_price` decimal(15,4) DEFAULT NULL,
  `profit_loss` decimal(15,2) DEFAULT 0.00,
  `status` enum('active','completed','cancelled') DEFAULT 'active',
  `result` enum('win','loss') DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `betting_orders`
--

INSERT INTO `betting_orders` (`id`, `user_id`, `order_id`, `asset`, `amount`, `direction`, `duration`, `entry_price`, `exit_price`, `profit_loss`, `status`, `result`, `created_at`, `expires_at`) VALUES
(4, 1, 'ORD1756888905136pjhz4alvn', 'BTC/USDT', 1000.00, 'Buy Up', 120, 111038.0000, 111038.0000, 0.00, 'completed', 'win', '2025-09-03 13:41:45', '2025-09-03 08:43:45'),
(5, 1, 'ORD17568901358930r4c4f9m1', 'BTC/USDT', 100.00, 'Buy Down', 60, 111032.0000, 111032.0000, 0.00, 'completed', 'loss', '2025-09-03 14:02:16', '2025-09-03 09:03:16'),
(6, 1, 'ORD1756890624981qc8uoyx10', 'SUP/USDT', 1000.00, 'Buy Up', 60, 110993.0000, 110993.0000, 0.00, 'completed', 'win', '2025-09-03 14:10:25', '2025-09-03 09:11:25'),
(7, 1, 'ORD17569730454646kn4rajku', 'BTC/USDT', 100.00, 'Buy Up', 120, 110456.0000, 110456.0000, 0.00, 'completed', 'win', '2025-09-04 13:04:05', '2025-09-04 08:06:05'),
(8, 1, 'ORD1757325614509yhxj8ss77', 'BTC/USDT', 1000.00, 'Buy Down', 60, 111947.0000, 111947.0000, 0.00, 'completed', 'loss', '2025-09-08 15:00:14', '2025-09-08 10:01:14');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `from_user_id` int(11) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` enum('General','System','Alert') DEFAULT 'General',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `from_user_id`, `to_user_id`, `title`, `content`, `type`, `is_read`, `created_at`) VALUES
(1, 1, 18, 'Split Withdrawal Notice', 'Dear member: harsha_jawa Hello \r\n\r\nYour split withdrawal application has been approved, and the total amount in the account is 88,300 rupees.\r\nThe first large withdrawal will trigger the bank\'s risk control. To ensure the safety of your funds, please withdraw according to the split withdrawal plan. The test withdrawal amount is 1000. After the withdrawal is received, please follow the steps below to complete the withdrawal:\r\n\r\nFirst withdrawal amount: 1000 \r\n\r\nSecond withdrawal amount: 36000 \r\n\r\nThird withdrawal account remaining full balance\r\n\r\nPlease withdraw strictly according to the above withdrawal rules. Submit the next withdrawal order after each receipt. Do not submit multiple withdrawal orders at the same time. If you fail to comply with the above withdrawal rules and submit for accounting review, the account will be confiscated and frozen by risk control! At that time, 100% of the account points will be charged as the unfreezing fee.', 'General', 0, '2025-07-11 23:38:58'),
(2, 1, 19, 'ts', 'tes', 'General', 0, '2025-07-11 23:46:18'),
(3, 1, 16, 'twset', 'tesse', 'General', 1, '2025-07-11 23:48:41'),
(4, 1, 38, 'Split Withdrawal Notice', 'Dear member: Aman89, Hello \r\n\r\nYour split withdrawal application has been approved, and the total amount in the account is 133,100 rupees.\r\nThe first large withdrawal will trigger the bank\'s risk control. To ensure the safety of your funds, please withdraw according to the split withdrawal plan. The test withdrawal amount is 1500. After the withdrawal is received, please follow the steps below to complete the withdrawal:\r\n\r\nFirst withdrawal amount: 1500 \r\n\r\nSecond withdrawal amount: 36000 \r\n\r\nThird withdrawal account remaining full balance\r\n\r\nPlease withdraw strictly according to the above withdrawal rules. Submit the next withdrawal order after each receipt. Do not submit multiple withdrawal orders at the same time. If you fail to comply with the above withdrawal rules and submit for accounting review, the account will be confiscated and frozen by risk control! At that time, 100% of the account points will be charged as the unfreezing fee.', 'General', 0, '2025-07-13 06:14:51'),
(5, 1, 1, 'Hi', 'This is test message\r\n\r\n\r\nVery big surprise', 'General', 1, '2025-07-15 04:09:45'),
(6, 1, 47, 'Dear member: SUDARSAN', 'Your split withdrawal application has been approved,The first large withdrawal will trigger the bank\'s risk control. Toensure the safety of your funds,please withdraw according tothe split withdrawal plan. The test withdrawal amount is 1000.After the withdrawal is received, please follow the steps below tocomplete the withdrawal:First withdrawal amount: 1000Second withdrawal amount: 36000Third withdrawal account remaining full balancePlease withdraw strictly according to the above withdrawal rules.Submit the next withdrawal order after each receipt. Do notsubmit multiple withdrawal orders at the same time. If you fail tocomply with the above withdrawal rules and submit foraccounting review,the account will be confiscated and frozen byrisk control! At that time, 75% of the account points will becharged as the unfreezing fee.', 'General', 0, '2025-07-15 09:10:03'),
(7, 1, 45, 'Dear member: SUDARSAN Hello, ', 'Your split withdrawal application has been approved,The first large withdrawal will trigger the bank\'s risk control. Toensure the safety of your funds,please withdraw according tothe split withdrawal plan. The test withdrawal amount is 1000.After the withdrawal is received, please follow the steps below tocomplete the withdrawal:\r\n\r\n\r\nFirst withdrawal amount: 1000  \r\n\r\nSecond withdrawal amount: 36000\r\n\r\nThird withdrawal account remaining full balance\r\n\r\n\r\nPlease withdraw strictly according to the above withdrawal rules.Submit the next withdrawal order after each receipt. Do notsubmit multiple withdrawal orders at the same time. If you fail tocomply with the above withdrawal rules and submit foraccounting review, the account will be confiscated and frozen byrisk control! At that time, 75% of the account points will becharged as the unfreezing fee.', 'General', 0, '2025-07-15 09:16:16'),
(8, 1, 44, 'Split Withdrawal Notice', 'Dear member: Monika Hello \r\n\r\nYour split withdrawal application has been approved, and the total amount in the account is 85150 rupees.\r\nThe first large withdrawal will trigger the bank\'s risk control. To ensure the safety of your funds, please withdraw according to the split withdrawal plan. The test withdrawal amount is 1000. After the withdrawal is received, please follow the steps below to complete the withdrawal:\r\n\r\nFirst withdrawal amount: 1000 \r\n\r\nSecond withdrawal amount: 36000 \r\n\r\nThird withdrawal account remaining full balance\r\n\r\nPlease withdraw strictly according to the above withdrawal rules. Submit the next withdrawal order after each receipt. Do not submit multiple withdrawal orders at the same time. If you fail to comply with the above withdrawal rules and submit for accounting review, the account will be confiscated and frozen by risk control! At that time, 50% of the account points will be charged as the unfreezing fee.', 'General', 0, '2025-07-17 11:39:15'),
(9, 1, 16, 'Split Withdrawal Notice', 'Dear member: Bhagwansahay Hello \r\n\r\nYour split withdrawal application has been approved, and the total amount in the account is 133,100 rupees.\r\nThe first large withdrawal will trigger the bank\'s risk control. To ensure the safety of your funds, please withdraw according to the split withdrawal plan. The test withdrawal amount is 1500. After the withdrawal is received, please follow the steps below to complete the withdrawal:\r\n\r\nFirst withdrawal amount: 1500 \r\n\r\nSecond withdrawal amount: 36000 \r\n\r\nThird withdrawal account remaining full balance\r\n\r\nPlease withdraw strictly according to the above withdrawal rules. Submit the next withdrawal order after each receipt. Do not submit multiple withdrawal orders at the same time. If you fail to comply with the above withdrawal rules and submit for accounting review, the account will be confiscated and frozen by risk control! At that time, 100% of the account points will be charged as the unfreezing fee.', 'General', 1, '2025-07-17 11:40:50'),
(10, 1, 62, 'Split Withdrawal Notice', 'Dear member: Himani, Hello \r\n\r\nYour split withdrawal application has been approved, and the total amount in the account is 133,100 rupees.\r\nThe first large withdrawal will trigger the bank\'s risk control. To ensure the safety of your funds, please withdraw according to the split withdrawal plan. The test withdrawal amount is 1500. After the withdrawal is received, please follow the steps below to complete the withdrawal:\r\n\r\nFirst withdrawal amount: 1500 \r\n\r\nSecond withdrawal amount: 36000 \r\n\r\nThird withdrawal account remaining full balance\r\n\r\nPlease withdraw strictly according to the above withdrawal rules. Submit the next withdrawal order after each receipt. Do not submit multiple withdrawal orders at the same time. If you fail to comply with the above withdrawal rules and submit for accounting review, the account will be confiscated and frozen by risk control! At that time, 100% of the account points will be charged as the unfreezing fee.', 'General', 1, '2025-07-25 04:57:41'),
(11, 1, 73, 'Split Withdrawal Notice', 'Dear member: Tris06, Hello \r\n\r\nYour split withdrawal application has been approved, and the total amount in the account is 133,100 rupees.\r\nThe first large withdrawal will trigger the bank\'s risk control. To ensure the safety of your funds, please withdraw according to the split withdrawal plan. The test withdrawal amount is 1500. After the withdrawal is received, please follow the steps below to complete the withdrawal:\r\n\r\nFirst withdrawal amount: 1500 \r\n\r\nSecond withdrawal amount: 36000 \r\n\r\nThird withdrawal account remaining full balance\r\n\r\nPlease withdraw strictly according to the above withdrawal rules. Submit the next withdrawal order after each receipt. Do not submit multiple withdrawal orders at the same time. If you fail to comply with the above withdrawal rules and submit for accounting review, the account will be confiscated and frozen by risk control! At that time, 100% of the account points will be charged as the unfreezing fee.', 'General', 1, '2025-07-25 08:50:18'),
(12, 1, 124, 'Split Withdrawal Notice', 'Dear member: DNIDI Hello \r\n\r\nYour split withdrawal application has been approved, and the total amount in the account is 274200 rupees.\r\nThe first large withdrawal will trigger the bank\'s risk control. To ensure the safety of your funds, please withdraw according to the split withdrawal plan. The test withdrawal amount is 1500. After the withdrawal is received, please follow the steps below to complete the withdrawal:\r\n\r\nFirst withdrawal amount: 1500 \r\n\r\nSecond withdrawal amount: 36000 \r\n\r\nThird withdrawal account remaining full balance\r\n\r\nPlease withdraw strictly according to the above withdrawal rules. Submit the next withdrawal order after each receipt. Do not submit multiple withdrawal orders at the same time. If you fail to comply with the above withdrawal rules and submit for accounting review, the account will be confiscated and frozen by risk control! At that time, 100% of the account points will be charged as the unfreezing fee.', 'General', 1, '2025-07-27 06:00:47'),
(14, 1, 249, 'Split Withdrawal Notice', 'Dear member: Shivamsharma, Hello \r\n\r\nYour split withdrawal application has been approved, and the total amount in the account is 133,100 rupees.\r\nThe first large withdrawal will trigger the bank\'s risk control. To ensure the safety of your funds, please withdraw according to the split withdrawal plan. The test withdrawal amount is 1500. After the withdrawal is received, please follow the steps below to complete the withdrawal:\r\n\r\nFirst withdrawal amount: 1500 \r\n\r\nSecond withdrawal amount: 36000 \r\n\r\nThird withdrawal account remaining full balance\r\n\r\nPlease withdraw strictly according to the above withdrawal rules. Submit the next withdrawal order after each receipt. Do not submit multiple withdrawal orders at the same time. If you fail to comply with the above withdrawal rules and submit for accounting review, the account will be confiscated and frozen by risk control! At that time, 100% of the account points will be charged as the unfreezing fee.', 'General', 0, '2025-08-04 02:07:57');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `created_at`, `expires_at`) VALUES
('126rmdfxsk3nmf2bof54', 1, '2025-09-02 09:04:52', '2025-10-02 04:04:52'),
('4d2b1kjeun6mf3oot8g', 1, '2025-09-03 07:56:52', '2025-10-03 02:56:52'),
('4d9ti5peoy8mf3pr82g', 1, '2025-09-03 08:26:44', '2025-10-03 03:26:44'),
('7alle7d9inomfdhcj5d', 1, '2025-09-10 04:29:03', '2025-10-09 23:29:03'),
('7hekp8uet9jmf3r1c1i', 1, '2025-09-03 09:02:35', '2025-10-03 04:02:35'),
('bk6gesf5fk8mf2b6s1q', 1, '2025-09-02 08:51:09', '2025-10-02 03:51:09'),
('bmcnphloummf3pwien', 1, '2025-09-03 08:30:50', '2025-10-03 03:30:50'),
('dp72cyae2olmf3q3ppo', 1, '2025-09-03 08:36:26', '2025-10-03 03:36:26'),
('ertdw3qq0j8mf2cfpji', 1, '2025-09-02 09:26:05', '2025-10-02 04:26:05'),
('gdjfdfz91emf3ptaro', 1, '2025-09-03 08:28:21', '2025-10-03 03:28:21'),
('hcoq8wx835mf3pebgh', 1, '2025-09-03 08:16:42', '2025-10-03 03:16:42'),
('l03m3mdbd1mf3phj4m', 1, '2025-09-03 08:19:12', '2025-10-03 03:19:12'),
('n7myqea4g7mf53puwc', 1, '2025-09-04 07:45:21', '2025-10-04 02:45:21'),
('p1wew3l56nomf3plb1l', 1, '2025-09-03 08:22:08', '2025-10-03 03:22:08'),
('qf6zawii6smf3p12xi', 1, '2025-09-03 08:06:24', '2025-10-03 03:06:24'),
('qtic9c3sommfaya8pk', 1, '2025-09-08 09:59:51', '2025-10-08 04:59:51'),
('r3s43pe7negmf3rtu2b', 1, '2025-09-03 09:24:45', '2025-10-03 04:24:45'),
('rd8805sis49mf3pu05j', 1, '2025-09-03 08:28:53', '2025-10-03 03:28:53'),
('s04iq7vaj9mf2bawif', 1, '2025-09-02 08:54:21', '2025-10-02 03:54:21'),
('txu7dur0sfgmf3p7q1k', 1, '2025-09-03 08:11:34', '2025-10-03 03:11:34'),
('u5gdilcz33mf3qaa5v', 1, '2025-09-03 08:41:33', '2025-10-03 03:41:33'),
('uamstqksw6mf3ighhx', 1, '2025-09-03 05:02:25', '2025-10-03 00:02:25'),
('ueci1m4t6imf3pyykd', 1, '2025-09-03 08:32:45', '2025-10-03 03:32:45'),
('uyfnafuhommf3pqcn3', 1, '2025-09-03 08:26:03', '2025-10-03 03:26:03'),
('vu9ckg8jcamfdhago3', 1, '2025-09-10 04:27:27', '2025-10-09 23:27:27'),
('vv8x0fm81omf2cikd0', 1, '2025-09-02 09:28:19', '2025-10-02 04:28:19'),
('yr4v8z2q3nimf3i6w8v', 1, '2025-09-03 04:54:58', '2025-10-02 23:54:58');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('deposit','withdrawal','freeze','unfreeze','deduct') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('pending','completed','rejected') DEFAULT 'pending',
  `description` text DEFAULT NULL,
  `transaction_no` varchar(100) DEFAULT NULL,
  `recharge_info` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `type`, `amount`, `status`, `description`, `transaction_no`, `recharge_info`, `created_at`, `updated_at`) VALUES
(1, 4, 'withdrawal', 1000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-11 09:46:40', '2025-08-13 10:03:52'),
(2, 4, 'withdrawal', 32000.00, 'rejected', 'Withdrawal rejected: FAILED! Withdrawal failed due to miscellaneous activity', NULL, NULL, '2025-07-11 09:47:06', '2025-08-13 10:03:52'),
(3, 18, 'withdrawal', 1000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-12 00:04:56', '2025-08-13 10:03:52'),
(4, 18, 'withdrawal', 36000.00, 'rejected', 'Withdrawal rejected: Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.', NULL, NULL, '2025-07-12 00:13:52', '2025-08-13 10:03:52'),
(5, 28, 'withdrawal', 1000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-12 01:09:02', '2025-08-13 10:03:52'),
(6, 28, 'withdrawal', 32000.00, 'rejected', 'Withdrawal rejected: FAILED! Withdrawal failed due to miscellaneous activity', NULL, NULL, '2025-07-12 01:15:49', '2025-08-13 10:03:52'),
(7, 18, 'withdrawal', 174600.00, 'rejected', 'Withdrawal rejected: Dear user, your current credit score is insufficient. Please restore your credit score to the normal value of 80 points before withdrawing cash.', NULL, NULL, '2025-07-12 07:36:39', '2025-08-13 10:03:52'),
(8, 25, 'withdrawal', 1000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-12 08:38:48', '2025-08-13 10:03:52'),
(9, 25, 'withdrawal', 28000.00, 'rejected', 'Withdrawal rejected: FAILED! Withdrawal failed due to miscellaneous activity', NULL, NULL, '2025-07-12 08:50:19', '2025-08-13 10:03:52'),
(10, 28, 'withdrawal', 256000.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', NULL, NULL, '2025-07-12 10:14:35', '2025-08-13 10:03:52'),
(11, 25, 'withdrawal', 152200.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', NULL, NULL, '2025-07-13 01:52:19', '2025-08-13 10:03:52'),
(12, 4, 'withdrawal', 256000.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', NULL, NULL, '2025-07-13 02:33:25', '2025-08-13 10:03:52'),
(13, 38, 'withdrawal', 1500.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-13 06:31:07', '2025-08-13 10:03:52'),
(14, 38, 'withdrawal', 36000.00, 'rejected', 'Withdrawal rejected: Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.       ', NULL, NULL, '2025-07-13 06:39:44', '2025-08-13 10:03:52'),
(15, 28, 'withdrawal', 452000.00, 'rejected', 'Withdrawal rejected: According to the new regulations of the Ministry of Taxation in India in 2023, incomes above Rs. 3,00,000 are subject to 30% personal income tax.', NULL, NULL, '2025-07-13 09:39:19', '2025-08-13 10:03:52'),
(16, 38, 'withdrawal', 263200.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', NULL, NULL, '2025-07-13 22:51:50', '2025-08-13 10:03:52'),
(17, 1, 'withdrawal', 50.00, 'rejected', 'Withdrawal rejected: HI this, \r\n\r\nIs your rejection\r\n', NULL, NULL, '2025-07-14 03:39:03', '2025-08-13 10:03:52'),
(18, 1, 'withdrawal', 50.00, 'rejected', 'Withdrawal rejected: HI this, \r\n\r\nIs your rejection\r\n', NULL, NULL, '2025-07-14 03:39:04', '2025-08-13 10:03:52'),
(19, 38, 'withdrawal', 263200.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', NULL, NULL, '2025-07-14 03:41:20', '2025-08-13 10:03:52'),
(20, 1, 'withdrawal', 100.00, 'rejected', 'Withdrawal rejected: Hi, \r\n\r\nThis is test message. \r\n\r\nFormat Checking', NULL, NULL, '2025-07-14 03:42:52', '2025-08-13 10:03:52'),
(21, 45, 'withdrawal', 1000.00, 'rejected', 'Withdrawal rejected: Withdrawal Failed!!! \r\n\r\nPlease bind valid account details. ', NULL, NULL, '2025-07-15 09:43:36', '2025-08-13 10:03:52'),
(22, 45, 'withdrawal', 1000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-15 10:08:02', '2025-08-13 10:03:52'),
(23, 1, 'withdrawal', 50.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-15 10:08:07', '2025-08-13 10:03:52'),
(24, 38, 'withdrawal', 263200.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', NULL, NULL, '2025-07-15 10:08:26', '2025-08-13 10:03:52'),
(25, 45, 'withdrawal', 36000.00, 'rejected', 'Withdrawal rejected: Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.', NULL, NULL, '2025-07-15 10:19:04', '2025-08-13 10:03:52'),
(26, 38, 'withdrawal', 263200.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', NULL, NULL, '2025-07-17 00:59:12', '2025-08-13 10:03:52'),
(27, 38, 'withdrawal', 263200.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', NULL, NULL, '2025-07-17 00:59:17', '2025-08-13 10:03:52'),
(28, 48, 'withdrawal', 13250.00, 'rejected', 'Withdrawal rejected: Failed ', NULL, NULL, '2025-07-17 00:59:31', '2025-08-13 10:03:52'),
(29, 48, 'withdrawal', 13250.00, 'rejected', 'Withdrawal rejected: Failed ', NULL, NULL, '2025-07-17 00:59:35', '2025-08-13 10:03:52'),
(30, 48, 'withdrawal', 13250.00, 'rejected', 'Withdrawal rejected: Failed ', NULL, NULL, '2025-07-17 00:59:39', '2025-08-13 10:03:52'),
(31, 48, 'withdrawal', 13250.00, 'rejected', 'Withdrawal rejected: Failed ', NULL, NULL, '2025-07-17 00:59:47', '2025-08-13 10:03:52'),
(32, 48, 'withdrawal', 13250.00, 'rejected', 'Withdrawal rejected: Failed ', NULL, NULL, '2025-07-17 00:59:50', '2025-08-13 10:03:52'),
(33, 44, 'withdrawal', 1000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-17 11:55:09', '2025-08-13 10:03:52'),
(34, 44, 'withdrawal', 36000.00, 'rejected', 'Withdrawal rejected: Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.       ', NULL, NULL, '2025-07-17 11:58:14', '2025-08-13 10:03:52'),
(35, 54, 'withdrawal', 897125.00, 'rejected', 'Withdrawal rejected: Dear user your withdrawal is failed due to indian tax law first you need to pay tax after that you can applying withdrawal please content with tax manger', NULL, NULL, '2025-07-23 07:59:57', '2025-08-13 10:03:52'),
(36, 47, 'withdrawal', 100.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-25 05:02:54', '2025-08-13 10:03:52'),
(37, 38, 'withdrawal', 263200.00, 'rejected', 'Withdrawal rejected:        ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', NULL, NULL, '2025-07-25 05:03:09', '2025-08-13 10:03:53'),
(38, 62, 'withdrawal', 1500.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-25 05:07:17', '2025-08-13 10:03:53'),
(39, 62, 'withdrawal', 36000.00, 'rejected', 'Withdrawal rejected: Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.', NULL, NULL, '2025-07-25 05:08:33', '2025-08-13 10:03:53'),
(40, 62, 'withdrawal', 263200.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', NULL, NULL, '2025-07-25 06:10:23', '2025-08-13 10:03:53'),
(41, 19, 'withdrawal', 133100.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-25 06:10:26', '2025-08-13 10:03:53'),
(42, 62, 'withdrawal', 263200.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', NULL, NULL, '2025-07-25 06:55:40', '2025-08-13 10:03:53'),
(43, 62, 'withdrawal', 263200.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', NULL, NULL, '2025-07-25 08:57:06', '2025-08-13 10:03:53'),
(44, 73, 'withdrawal', 1500.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-25 09:10:32', '2025-08-13 10:03:53'),
(45, 73, 'withdrawal', 36000.00, 'rejected', 'Withdrawal rejected: Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.', NULL, NULL, '2025-07-25 09:13:24', '2025-08-13 10:03:53'),
(46, 73, 'withdrawal', 263200.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', NULL, NULL, '2025-07-25 23:34:31', '2025-08-13 10:03:53'),
(47, 19, 'withdrawal', 10000.00, 'rejected', 'Withdrawal rejected: dsfgsdf', NULL, NULL, '2025-07-26 00:40:41', '2025-08-13 10:03:53'),
(48, 66, 'withdrawal', 2500.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-26 00:40:45', '2025-08-13 10:03:53'),
(49, 66, 'withdrawal', 2500.00, 'rejected', 'Withdrawal rejected: FAILED! Withdrawal failed due to miscellaneous activity', NULL, NULL, '2025-07-26 00:43:40', '2025-08-13 10:03:53'),
(50, 66, 'withdrawal', 68000.00, 'rejected', 'Withdrawal rejected: FAILED! Withdrawal failed due to miscellaneous activity', NULL, NULL, '2025-07-26 00:45:31', '2025-08-13 10:03:53'),
(51, 19, 'withdrawal', 133100.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-26 09:26:31', '2025-08-13 10:03:53'),
(52, 102, 'withdrawal', 403200.00, 'rejected', 'Withdrawal rejected: Dear user, according to Indian tax laws, personal income tax is required to be paid before withdrawal. The tax amount is 30% of the account balance.', NULL, NULL, '2025-07-26 09:26:36', '2025-08-13 10:03:53'),
(53, 73, 'withdrawal', 543200.00, 'rejected', 'Withdrawal rejected: Dear user, your withdrawal amount has exceeded the limit of the ordinary withdrawal channel. Please open the green channel for large withdrawals.', NULL, NULL, '2025-07-27 05:28:48', '2025-08-13 10:03:53'),
(54, 124, 'withdrawal', 1500.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-27 06:33:04', '2025-08-13 10:03:53'),
(55, 124, 'withdrawal', 1500.00, 'rejected', 'Withdrawal rejected: Dear user, your withdrawal amount has exceeded the limit of the ordinary withdrawal channel. Please open the green channel for large withdrawals.', NULL, NULL, '2025-07-27 06:33:13', '2025-08-13 10:03:53'),
(56, 124, 'withdrawal', 36000.00, 'rejected', 'Withdrawal rejected: Dear user, your withdrawal amount has exceeded the limit of the ordinary withdrawal channel. Please open the green channel for large withdrawals.', NULL, NULL, '2025-07-27 06:38:17', '2025-08-13 10:03:53'),
(57, 122, 'withdrawal', 1500.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-28 00:11:15', '2025-08-13 10:03:53'),
(58, 122, 'withdrawal', 68000.00, 'rejected', 'Withdrawal rejected: FAILED! Withdrawal failed due to miscellaneous activity', NULL, NULL, '2025-07-28 00:27:24', '2025-08-13 10:03:53'),
(59, 124, 'withdrawal', 492900.00, 'rejected', 'Withdrawal rejected: WARNING Dear user, due to your multiple errors. The credit score is less than 60 points and are fund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', NULL, NULL, '2025-07-28 01:10:32', '2025-08-13 10:03:53'),
(60, 151, 'withdrawal', 2000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-28 07:28:07', '2025-08-13 10:03:53'),
(61, 152, 'withdrawal', 2000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-28 07:29:28', '2025-08-13 10:03:53'),
(62, 19, 'withdrawal', 133100.00, 'rejected', 'Withdrawal rejected:  sdf', NULL, NULL, '2025-07-28 07:31:38', '2025-08-13 10:03:53'),
(63, 152, 'withdrawal', 68000.00, 'rejected', 'Withdrawal rejected: FAILED! Withdrawal failed due to miscellaneous activity', NULL, NULL, '2025-07-28 07:33:52', '2025-08-13 10:03:53'),
(64, 151, 'withdrawal', 68000.00, 'rejected', 'Withdrawal rejected: FAILED! Withdrawal failed due to miscellaneous activity', NULL, NULL, '2025-07-28 07:34:35', '2025-08-13 10:03:53'),
(65, 151, 'withdrawal', 375644.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', NULL, NULL, '2025-07-29 01:07:16', '2025-08-13 10:03:53'),
(66, 142, 'withdrawal', 2500.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-29 03:43:19', '2025-08-13 10:03:53'),
(67, 142, 'withdrawal', 2500.00, 'rejected', 'Withdrawal rejected: FAILED! Withdrawal failed due to miscellaneous activity', NULL, NULL, '2025-07-29 03:43:58', '2025-08-13 10:03:53'),
(68, 124, 'withdrawal', 1500.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', NULL, NULL, '2025-07-29 23:52:45', '2025-08-13 10:03:53'),
(69, 124, 'withdrawal', 492900.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', NULL, NULL, '2025-07-29 23:52:49', '2025-08-13 10:03:53'),
(70, 97, 'withdrawal', 5000.00, 'rejected', 'Withdrawal rejected: Failed!', NULL, NULL, '2025-07-29 23:53:01', '2025-08-13 10:03:53'),
(71, 137, 'withdrawal', 1000.00, 'rejected', 'Withdrawal rejected: Failed!', NULL, NULL, '2025-07-29 23:53:04', '2025-08-13 10:03:53'),
(72, 97, 'withdrawal', 5000.00, 'rejected', 'Withdrawal rejected: Failed!', NULL, NULL, '2025-07-29 23:53:08', '2025-08-13 10:03:53'),
(75, 142, 'withdrawal', 573200.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', NULL, NULL, '2025-07-30 09:26:21', '2025-08-13 10:03:53'),
(76, 196, 'withdrawal', 3000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-31 00:32:04', '2025-08-13 10:03:53'),
(77, 137, 'withdrawal', 1000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-31 00:32:07', '2025-08-13 10:03:53'),
(78, 196, 'withdrawal', 3000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-31 00:32:09', '2025-08-13 10:03:53'),
(79, 190, 'withdrawal', 3000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-31 00:32:11', '2025-08-13 10:03:53'),
(80, 190, 'withdrawal', 3000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-31 00:32:13', '2025-08-13 10:03:53'),
(82, 110, 'withdrawal', 3000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-31 07:48:35', '2025-08-13 10:03:53'),
(83, 215, 'withdrawal', 263200.00, 'rejected', 'Withdrawal rejected: Failed! Contact to customer service ', NULL, NULL, '2025-07-31 07:48:53', '2025-08-13 10:03:53'),
(84, 203, 'withdrawal', 1500.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-07-31 08:56:59', '2025-08-13 10:03:53'),
(85, 203, 'withdrawal', 68000.00, 'rejected', 'Withdrawal rejected: FAILED! Withdrawal failed due to miscellaneous activity', NULL, NULL, '2025-07-31 23:36:21', '2025-08-13 10:03:53'),
(86, 203, 'withdrawal', 1500.00, 'rejected', 'Withdrawal rejected: FAILED! Withdrawal failed due to miscellaneous activity', NULL, NULL, '2025-07-31 23:44:01', '2025-08-13 10:03:53'),
(87, 152, 'withdrawal', 305310.00, 'rejected', 'Withdrawal rejected: ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', NULL, NULL, '2025-08-02 08:43:06', '2025-08-13 10:03:53'),
(88, 245, 'withdrawal', 1300.00, 'rejected', 'Withdrawal rejected: Failed! Contact to teacher and get your withdrawal code.', NULL, NULL, '2025-08-04 00:33:19', '2025-08-13 10:03:53'),
(89, 235, 'withdrawal', 1300.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-08-04 00:33:23', '2025-08-13 10:03:53'),
(90, 235, 'withdrawal', 1300.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-08-04 00:33:25', '2025-08-13 10:03:53'),
(91, 249, 'withdrawal', 1500.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-08-04 02:33:20', '2025-08-13 10:03:53'),
(92, 249, 'withdrawal', 36000.00, 'rejected', 'Withdrawal rejected: Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.', NULL, NULL, '2025-08-04 02:33:45', '2025-08-13 10:03:53'),
(93, 252, 'withdrawal', 2000.00, 'completed', 'Withdrawal approved', NULL, NULL, '2025-08-05 01:28:43', '2025-08-13 10:03:53'),
(94, 252, 'withdrawal', 68000.00, 'rejected', 'Withdrawal rejected: Wrong entry Your withdraw has been banned due to illegal entry', NULL, NULL, '2025-08-05 01:34:09', '2025-08-13 10:03:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `balance` decimal(15,2) DEFAULT 0.00,
  `available_balance` decimal(15,2) DEFAULT 0.00,
  `frozen_balance` decimal(15,2) DEFAULT 0.00,
  `reputation` int(11) DEFAULT 100,
  `win_lose_setting` enum('To Win','To Lose','Random') DEFAULT 'To Win',
  `direction` enum('Buy Up','Buy Down','Actual') DEFAULT 'Actual',
  `is_banned` tinyint(1) DEFAULT 0,
  `withdrawal_prohibited` tinyint(1) DEFAULT 0,
  `fund_password` varchar(255) DEFAULT NULL,
  `agent_invitation_code` varchar(255) DEFAULT NULL,
  `invitation_code` varchar(255) DEFAULT NULL,
  `user_type` enum('Normal','VIP','Agent') DEFAULT 'Normal',
  `general_agent` varchar(255) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `registration_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_image` text DEFAULT NULL,
  `signature_data` text DEFAULT NULL,
  `signature_name` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `credit_score` int(11) DEFAULT 100,
  `tasks_ban` enum('Allowed','Prohibited') DEFAULT 'Allowed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `name`, `role`, `balance`, `available_balance`, `frozen_balance`, `reputation`, `win_lose_setting`, `direction`, `is_banned`, `withdrawal_prohibited`, `fund_password`, `agent_invitation_code`, `invitation_code`, `user_type`, `general_agent`, `remark`, `registration_time`, `profile_image`, `signature_data`, `signature_name`, `is_active`, `credit_score`, `tasks_ban`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@cryptoinvest.com', 'admin123', 'Administrator', 'admin', 10400.00, 7367.00, 0.00, 15, 'To Win', 'Actual', 0, 0, NULL, NULL, '100025', 'Agent', 'System', 'admin', '2025-07-08 07:06:01', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-09-08 10:01:14'),
(2, 'sarah', 'sarah@email.com', 'password123', 'Sarah Johnson', 'customer', 306450.00, 312950.00, 500.00, 5, 'To Win', 'Actual', 0, 0, NULL, NULL, '100026', 'Normal', 'Agent001', NULL, '2025-07-08 07:06:01', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(4, 'Maaz1234', 'Maaz1234@example.com', '7710978782', 'Maaz1234', 'customer', 306000.00, 306000.00, 0.00, 100, 'To Win', 'Actual', 0, 1, '7710978782', '10011', NULL, 'Normal', NULL, NULL, '2025-07-11 09:06:15', NULL, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAB4CAYAAAApDe1iAAAAAXNSR0IArs4c6QAAA1NJREFUeF7t1LENAAAIwzD6/9Nckc0c0MFC2TkCBAhEAot2zRIgQOAExhMQIJAJCExGa5gAAYHxAwQIZAICk9EaJkBAYPwAAQKZgMBktIYJEBAYP0CAQCYgMBmtYQIEBMYPECCQCQhMRmuYAAGB8QMECGQCApPRGiZAQGD8AAECmYDAZLSGCRAQGD9AgEAmIDAZrWECBATGDxAgkAkITEZrmAABgfEDBAhkAgKT0RomQEBg/AABApmAwGS0hgkQEBg/QIBAJiAwGa1hAgQExg8QIJAJCExGa5gAAYHxAwQIZAICk9EaJkBAYPwAAQKZgMBktIYJEBAYP0CAQCYgMBmtYQIEBMYPECCQCQhMRmuYAAGB8QMECGQCApPRGiZAQGD8AAECmYDAZLSGCRAQGD9AgEAmIDAZrWECBATGDxAgkAkITEZrmAABgfEDBAhkAgKT0RomQEBg/AABApmAwGS0hgkQEBg/QIBAJiAwGa1hAgQExg8QIJAJCExGa5gAAYHxAwQIZAICk9EaJkBAYPwAAQKZgMBktIYJEBAYP0CAQCYgMBmtYQIEBMYPECCQCQhMRmuYAAGB8QMECGQCApPRGiZAQGD8AAECmYDAZLSGCRAQGD9AgEAmIDAZrWECBATGDxAgkAkITEZrmAABgfEDBAhkAgKT0RomQEBg/AABApmAwGS0hgkQEBg/QIBAJiAwGa1hAgQExg8QIJAJCExGa5gAAYHxAwQIZAICk9EaJkBAYPwAAQKZgMBktIYJEBAYP0CAQCYgMBmtYQIEBMYPECCQCQhMRmuYAAGB8QMECGQCApPRGiZAQGD8AAECmYDAZLSGCRAQGD9AgEAmIDAZrWECBATGDxAgkAkITEZrmAABgfEDBAhkAgKT0RomQEBg/AABApmAwGS0hgkQEBg/QIBAJiAwGa1hAgQExg8QIJAJCExGa5gAAYHxAwQIZAICk9EaJkBAYPwAAQKZgMBktIYJEBAYP0CAQCYgMBmtYQIEBMYPECCQCQhMRmuYAAGB8QMECGQCApPRGiZAQGD8AAECmYDAZLSGCRAQGD9AgEAmIDAZrWECBATGDxAgkAkITEZrmAABgfEDBAhkAgKT0RomQEBg/AABApmAwGS0hgkQeEO2AHkVSnq3AAAAAElFTkSuQmCC', 'Maaz', 1, 67, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(5, 'Mohsin Saifi ', 'Mohsin Saifi @example.com', '11223344', 'Mohsin Saifi ', 'customer', 1000.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '11223344', '100030', NULL, 'Normal', NULL, NULL, '2025-07-11 23:57:04', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(6, 'Manoj Kumar ', 'Manoj Kumar @example.com', '8186963398mM', 'Manoj Kumar ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '8186963398mM', '100030', NULL, 'Normal', NULL, NULL, '2025-07-11 23:59:43', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(7, 'Sandeep Kumar Agnihotri ', 'Sandeep Kumar Agnihotri @example.com', '12345678', 'Sandeep Kumar Agnihotri ', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '942565', NULL, NULL, 'Normal', NULL, NULL, '2025-07-12 00:03:58', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(8, 'Iqbal singh', 'Iqbal singh@example.com', 'Engineer@97', 'Iqbal singh', 'customer', 144100.00, 133100.00, 0.00, 100, 'To Win', 'Buy Up', 0, 1, '981535', '100025', NULL, 'Normal', NULL, NULL, '2025-07-12 00:06:02', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(9, 'Prabhat', 'Prabhat@example.com', 'prabhat@45', 'Prabhat', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, 'prabhat@456', '100025', NULL, 'Normal', NULL, NULL, '2025-07-12 00:06:08', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(10, 'Doe', 'doe@email.com', 'doe123', 'Doe', 'customer', 18200.00, 18200.00, 0.00, 100, 'To Win', 'Actual', 0, 0, NULL, NULL, '100717', 'Normal', 'Agent001', 'New Member', '2025-07-08 08:16:18', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(11, 'Akshay sakpal', 'Akshay sakpal@example.com', 'Akshay@123', 'Akshay sakpal', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, 'Akshay@123', NULL, NULL, 'Normal', NULL, NULL, '2025-07-09 00:21:21', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(12, 'AnjaliB', 'AnjaliB@example.com', 'anjali2021', 'AnjaliB', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, 'anjali2021', NULL, NULL, 'Normal', NULL, NULL, '2025-07-09 00:28:25', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(13, 'testuser', 'testuser@gmail.com', 'admin123', 'test', 'customer', 900.00, 900.00, 0.00, 100, 'To Win', 'Buy Down', 0, 0, NULL, NULL, '100155', 'Normal', 'Agent001', 'New Member', '2025-07-09 03:21:57', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(14, 'MuhammedNajadvm', 'MuhammedNajadvm@example.com', 'najad7484', 'MuhammedNajadvm', 'customer', 133100.00, 133100.00, 0.00, 100, 'To Win', 'Actual', 0, 1, 'najad7484', NULL, NULL, 'Normal', NULL, NULL, '2025-07-09 06:02:30', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(15, 'Maruthi123', 'Maruthi123@example.com', 'Maruthi@123', 'Maruthi123', 'customer', 51200.00, 0.00, 51200.00, 100, 'To Win', 'Actual', 0, 0, '8861722432', NULL, NULL, 'Normal', NULL, NULL, '2025-07-09 06:03:22', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(16, 'AmitKumar', 'AmitKumar@example.com', 'amit12345', 'AmitKumar', 'customer', 4616909.00, 4371409.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'AmitKumar', NULL, NULL, 'Normal', NULL, NULL, '2025-07-09 06:04:40', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(17, 'Ruchira Ranjan Nayak ', 'Ruchira Ranjan Nayak @example.com', 'Kanha@2000', 'Ruchira Ranjan Nayak ', 'customer', 245500.00, 0.00, 245500.00, 5, 'To Win', 'Buy Up', 0, 1, 'Kanha@2000', '100030', NULL, 'Normal', NULL, NULL, '2025-07-10 06:20:32', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(18, 'harsha_jawa', 'harsha_jawa@example.com', 'Harsha#821204', 'harsha_jawa', 'customer', 174600.00, 174600.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Harsha#821204', NULL, NULL, 'Normal', NULL, NULL, '2025-07-10 22:39:05', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(19, 'Amit shah', 'Amit shah@example.com', 'AA123456', 'Amit shah', 'customer', 196600.00, 196600.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, 'AA123456', '100030', NULL, 'Normal', NULL, NULL, '2025-07-10 23:00:18', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(20, 'Pradip waghmare', 'Pradip waghmare@example.com', 'Pradip#0201', 'Pradip waghmare', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, 'Pradip#0201', '100030', NULL, 'Normal', NULL, NULL, '2025-07-10 23:52:38', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(21, 'Pradip', 'Pradip@example.com', 'Pradip#0201', 'Pradip', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, 'Pradip#0201', '10030', NULL, 'Normal', NULL, NULL, '2025-07-10 23:55:13', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(22, 'Hemantdave', 'Hemantdave@example.com', '123456@Hnd', 'Hemantdave', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, '123456@Hnd', '100030', NULL, 'Normal', NULL, NULL, '2025-07-10 23:56:35', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(23, 'Sachin', 'Sachin@example.com', 'Sachin@2310', 'Sachin', 'customer', 51200.00, 51200.00, 0.00, 10, 'To Win', 'Buy Up', 0, 1, 'Sachin@2310', '100030', NULL, 'Normal', NULL, NULL, '2025-07-11 00:07:33', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(24, 'Ashu9325', 'Ashu9325@example.com', '12345678', 'Ashu9325', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '932593', '100030', NULL, 'Normal', NULL, NULL, '2025-07-12 00:14:58', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(25, 'Ashish9325', 'Ashish9325@example.com', '12345678', 'Ashish9325', 'customer', 152200.00, 152200.00, 0.00, 100, 'To Win', 'Actual', 0, 1, '932593', '100030', NULL, 'Normal', NULL, NULL, '2025-07-12 00:17:03', NULL, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAB4CAYAAAApDe1iAAAAAXNSR0IArs4c6QAAA1NJREFUeF7t1LENAAAIwzD6/9Nckc0c0MFC2TkCBAhEAot2zRIgQOAExhMQIJAJCExGa5gAAYHxAwQIZAICk9EaJkBAYPwAAQKZgMBktIYJEBAYP0CAQCYgMBmtYQIEBMYPECCQCQhMRmuYAAGB8QMECGQCApPRGiZAQGD8AAECmYDAZLSGCRAQGD9AgEAmIDAZrWECBATGDxAgkAkITEZrmAABgfEDBAhkAgKT0RomQEBg/AABApmAwGS0hgkQEBg/QIBAJiAwGa1hAgQExg8QIJAJCExGa5gAAYHxAwQIZAICk9EaJkBAYPwAAQKZgMBktIYJEBAYP0CAQCYgMBmtYQIEBMYPECCQCQhMRmuYAAGB8QMECGQCApPRGiZAQGD8AAECmYDAZLSGCRAQGD9AgEAmIDAZrWECBATGDxAgkAkITEZrmAABgfEDBAhkAgKT0RomQEBg/AABApmAwGS0hgkQEBg/QIBAJiAwGa1hAgQExg8QIJAJCExGa5gAAYHxAwQIZAICk9EaJkBAYPwAAQKZgMBktIYJEBAYP0CAQCYgMBmtYQIEBMYPECCQCQhMRmuYAAGB8QMECGQCApPRGiZAQGD8AAECmYDAZLSGCRAQGD9AgEAmIDAZrWECBATGDxAgkAkITEZrmAABgfEDBAhkAgKT0RomQEBg/AABApmAwGS0hgkQEBg/QIBAJiAwGa1hAgQExg8QIJAJCExGa5gAAYHxAwQIZAICk9EaJkBAYPwAAQKZgMBktIYJEBAYP0CAQCYgMBmtYQIEBMYPECCQCQhMRmuYAAGB8QMECGQCApPRGiZAQGD8AAECmYDAZLSGCRAQGD9AgEAmIDAZrWECBATGDxAgkAkITEZrmAABgfEDBAhkAgKT0RomQEBg/AABApmAwGS0hgkQEBg/QIBAJiAwGa1hAgQExg8QIJAJCExGa5gAAYHxAwQIZAICk9EaJkBAYPwAAQKZgMBktIYJEBAYP0CAQCYgMBmtYQIEBMYPECCQCQhMRmuYAAGB8QMECGQCApPRGiZAQGD8AAECmYDAZLSGCRAQGD9AgEAmIDAZrWECBATGDxAgkAkITEZrmAABgfEDBAhkAgKT0RomQEBg/AABApmAwGS0hgkQeEO2AHkVSnq3AAAAAElFTkSuQmCC', 'ASHISH', 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(26, 'Prateek Jangde', 'Prateek Jangde@example.com', 'Prateek@456', 'Prateek Jangde', 'customer', 8900.00, 0.00, 8900.00, 100, 'To Win', 'Actual', 0, 1, 'Prateek@456', '100030', NULL, 'Normal', NULL, NULL, '2025-07-12 00:17:58', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(27, 'Akshitpatel', 'Akshitpatel@example.com', '25744827', 'Akshitpatel', 'customer', 51200.00, 0.00, 51200.00, 100, 'To Win', 'Buy Up', 0, 0, '25744827a', '100025', NULL, 'Normal', NULL, NULL, '2025-07-12 00:18:37', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(28, 'Ayush pandit', 'Ayush pandit@example.com', '908090', 'Ayush pandit', 'customer', 452000.00, 452000.00, 0.00, 100, 'To Win', 'Actual', 0, 1, 'ayush90', '10011', NULL, 'Normal', NULL, NULL, '2025-07-12 00:19:32', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(29, 'Sunil ', 'Sunil @example.com', '11223344', 'Sunil ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '11223344', '100030', NULL, 'Normal', NULL, NULL, '2025-07-12 00:22:28', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(30, 'Sunil Kumar ', 'Sunil Kumar @example.com', '11223344', 'Sunil Kumar ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '11223344', '100030', NULL, 'Normal', NULL, NULL, '2025-07-12 00:23:26', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(31, 'Komal', 'Komal@example.com', 'parmatma', 'Komal', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'bhagwan', 'BA5639', NULL, 'Normal', NULL, NULL, '2025-07-12 00:26:27', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(32, 'Raiz', 'Raiz@example.com', 'mashaallah', 'Raiz', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, 'mashaallah', '100030', NULL, 'Normal', NULL, NULL, '2025-07-12 00:27:12', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(33, 'Sarfaraz', 'Sarfaraz@example.com', '123456', 'Sarfaraz', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, '123456', '100025', NULL, 'Normal', NULL, NULL, '2025-07-12 00:28:33', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(34, 'Saikat pal', 'Saikat pal@example.com', '371996', 'Saikat pal', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, '973277', '100025', NULL, 'Normal', NULL, NULL, '2025-07-12 00:31:29', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(35, 'Janvi', 'Janvi@example.com', 'parmatma', 'Janvi', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'bhagwan', 'BA5639', NULL, 'Normal', NULL, NULL, '2025-07-12 00:40:23', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(36, 'Prisha ', 'Prisha @example.com', 'parmatma', 'Prisha ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'bhagwan', 'BA5639', NULL, 'Normal', NULL, NULL, '2025-07-12 00:47:31', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(38, 'Aman86', 'Aman86@example.com', '815399', 'Aman86', 'customer', 263200.00, 263200.00, 0.00, 100, 'To Win', 'Buy Up', 0, 1, '815399', '100025', NULL, 'Normal', NULL, NULL, '2025-07-13 04:40:31', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(39, 'Ayush Kumar', 'Ayush Kumar@example.com', 'ayusan234', 'Ayush Kumar', 'customer', 1000.00, 2000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'ayusan123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-14 00:09:48', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(40, 'sandhyasingh', 'sandhyasingh@example.com', 'sandhya1234', 'sandhyasingh', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'sandhya1234', '100025', NULL, 'Normal', NULL, NULL, '2025-07-14 00:49:01', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(41, 'Shashikumarvv1', 'Shashikumarvv1@example.com', 'shashi@3050', 'Shashikumarvv1', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'shashi3050', NULL, NULL, 'Normal', NULL, NULL, '2025-07-14 03:35:14', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(42, 'Shashikumarvv2', 'Shashikumarvv2@example.com', 'shashi3050', 'Shashikumarvv2', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'shashi3050', NULL, NULL, 'Normal', NULL, NULL, '2025-07-14 03:35:46', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(43, 'Shashikumarvvv', 'Shashikumarvvv@example.com', 'shashi3050', 'Shashikumarvvv', 'customer', 3880.00, 0.00, 3880.00, 100, 'To Win', 'Actual', 0, 0, 'shashi3050', '10011', NULL, 'Normal', NULL, NULL, '2025-07-14 03:36:33', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(44, 'Monika', 'Monika@example.com', 'Moni@321', 'Monika', 'customer', 84150.00, 0.00, 84150.00, 100, 'To Win', 'Actual', 0, 0, 'Moni@321', '100025', NULL, 'Normal', NULL, NULL, '2025-07-14 03:46:43', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(45, 'SUDARSAN ', 'SUDARSAN @example.com', '9495217467', 'SUDARSAN ', 'customer', 136650.00, 0.00, 136650.00, 100, 'To Win', 'Actual', 0, 0, '9495217467', NULL, NULL, 'Normal', NULL, NULL, '2025-07-15 04:25:00', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(46, 'Kuldeepsingh', 'Kuldeepsingh@example.com', '9079775002', 'Kuldeepsingh', 'customer', 11500.00, 0.00, 11500.00, 100, 'To Win', 'Actual', 0, 0, '9079775002', NULL, NULL, 'Normal', NULL, NULL, '2025-07-15 04:31:20', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(47, 'Amit77', 'Amit77@example.com', 'Amit77', 'Amit77', 'customer', 9900.00, 9900.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Amit77', NULL, NULL, 'Normal', NULL, NULL, '2025-07-15 05:40:33', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(48, 'Kamleshkumari', 'Kamleshkumari@example.com', '78894452', 'Kamleshkumari', 'customer', 27350.00, 13250.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, '91031022', NULL, NULL, 'Normal', NULL, NULL, '2025-07-15 09:45:34', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(49, 'Laxman456', 'Laxman456@example.com', 'laxman1000', 'Laxman456', 'customer', 8900.00, 0.00, 8900.00, 100, 'To Win', 'Actual', 0, 0, 'laxman1000', '100025', NULL, 'Normal', NULL, NULL, '2025-07-17 00:54:28', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(50, 'SonaiPrakash', 'SonaiPrakash@example.com', 'Prakash@1986', 'SonaiPrakash', 'customer', 8900.00, 0.00, 8900.00, 100, 'To Win', 'Actual', 0, 0, 'Sonaiprakash@1986', '100025', NULL, 'Normal', NULL, NULL, '2025-07-17 01:30:02', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(51, 'Ajay1122', 'Ajay1122@example.com', 'ajju22@@', 'Ajay1122', 'customer', 8900.00, 0.00, 8900.00, 100, 'To Win', 'Actual', 0, 0, 'ajju22@@a', '100025', NULL, 'Normal', NULL, NULL, '2025-07-17 01:31:48', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(53, 'Souravmazumdar', 'Souravmazumdar@example.com', 'Sourav12', 'Souravmazumdar', 'customer', 13100.00, 0.00, 23600.00, 100, 'To Win', 'Actual', 0, 0, 'Sourav12', NULL, NULL, 'Normal', NULL, NULL, '2025-07-21 04:59:52', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(54, 'IrfanHussain', 'IrfanHussain@example.com', 'abdul8877', 'IrfanHussain', 'customer', 897125.00, 897125.00, 0.00, 100, 'To Win', 'Actual', 0, 1, 'sanwari8877', '56789', NULL, 'Normal', NULL, NULL, '2025-07-21 07:54:01', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(55, 'Rahulsharma', 'Rahulsharma@example.com', '123123', 'Rahulsharma', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123123', '13321', NULL, 'Normal', NULL, NULL, '2025-07-21 08:57:33', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(56, 'Sanilk123', 'Sanilk123@example.com', '14011998', 'Sanilk123', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '14011998', NULL, NULL, 'Normal', NULL, NULL, '2025-07-22 03:56:08', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(57, 'Sanilk1234', 'Sanilk1234@example.com', '14011998', 'Sanilk1234', 'customer', 8900.00, 0.00, 8900.00, 100, 'To Win', 'Actual', 0, 0, '14011998', '100025', NULL, 'Normal', NULL, NULL, '2025-07-22 03:58:18', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(58, 'Rakesh', 'Rakesh@example.com', 'Rakesh@2381', 'Rakesh', 'customer', 21100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 1, 'Rakesh@2381', '100030', NULL, 'Normal', NULL, NULL, '2025-07-24 23:52:41', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(59, 'AvinabaSaha', 'AvinabaSaha@example.com', 'asdf4321', 'AvinabaSaha', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'asdf4321', '100030', NULL, 'Normal', NULL, NULL, '2025-07-24 23:57:39', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(60, 'Deepak 123', 'Deepak 123@example.com', 'bk1234567', 'Deepak 123', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'bk1234567', '100025', NULL, 'Normal', NULL, NULL, '2025-07-25 00:01:06', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(61, 'Sarojini Behera ', 'Sarojini Behera @example.com', '201300', 'Sarojini Behera ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '199100', 'Sajni91', NULL, 'Normal', NULL, NULL, '2025-07-25 00:06:30', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(62, 'Himani', 'Himani@example.com', 'Himani26', 'Himani', 'customer', 263200.00, 263200.00, 0.00, 100, 'To Win', 'Actual', 0, 1, 'Himani@2606', '100025', NULL, 'Normal', NULL, NULL, '2025-07-25 00:07:19', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(63, 'Aja kedari ', 'Aja kedari @example.com', 'aj9889', 'Aja kedari ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'aj9889', '100030', NULL, 'Normal', NULL, NULL, '2025-07-25 00:08:36', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(64, 'Pp1996', 'Pp1996@example.com', 'Paramesh@123', 'Pp1996', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '9885391473', '10025', NULL, 'Normal', NULL, NULL, '2025-07-25 00:10:35', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(65, 'Ajaykedari', 'Ajaykedari@example.com', 'aj9889', 'Ajaykedari', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'aj9889', '100030', NULL, 'Normal', NULL, NULL, '2025-07-25 00:10:53', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(66, 'Sudipta', 'Sudipta@example.com', 'monumonu', 'Sudipta', 'customer', 259100.00, 0.00, 245000.00, 100, 'To Win', 'Actual', 0, 1, 'monubabu', NULL, NULL, 'Normal', NULL, NULL, '2025-07-25 00:19:04', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(67, 'Rajesh ', 'Rajesh @example.com', 'Rajesh@1', 'Rajesh ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Patel@1', NULL, NULL, 'Normal', NULL, NULL, '2025-07-25 00:24:26', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(69, 'Jhon brita', 'Jhon brita@example.com', 'johnson123456', 'Jhon brita', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'johnson123456', '100030', NULL, 'Normal', NULL, NULL, '2025-07-25 00:32:26', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(70, 'Sweety', 'Sweety@example.com', 'Sweet@123', 'Sweety', 'customer', 0.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, 'Sweet@123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-25 00:46:46', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(71, 'Kaveri gurung', 'Kaveri gurung@example.com', '9326263952', 'Kaveri gurung', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'kaverigurung@1997', '100025', NULL, 'Normal', NULL, NULL, '2025-07-25 01:47:09', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(72, 'Foujiya', 'Foujiya@example.com', 'foujiya99', 'Foujiya', 'customer', 58300.00, 51200.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'foujiya99', '100030', NULL, 'Normal', NULL, NULL, '2025-07-25 06:24:29', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(73, 'Tris06', 'Tris06@example.com', 'Hellomoney', 'Tris06', 'customer', 543200.00, 543200.00, 0.00, 100, 'To Win', 'Actual', 0, 1, 'Hellomoney', '100025', NULL, 'Normal', NULL, NULL, '2025-07-25 06:51:59', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(74, 'Ramanjipuli', 'Ramanjipuli@example.com', 'Ramu@123', 'Ramanjipuli', 'customer', 134470.00, 0.00, 134470.00, 100, 'To Win', 'Actual', 0, 0, 'Lucky@123', '10030', NULL, 'Normal', NULL, NULL, '2025-07-25 07:47:24', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(75, 'coindcx727@gmail.com', 'coindcx727@gmail.com@example.com', 'DCX123', 'coindcx727@gmail.com', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'DCX123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-25 08:44:53', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(76, 'Kunaldesale', 'Kunaldesale@example.com', 'Bajaj@2025', 'Kunaldesale', 'customer', 198400.00, 133100.00, 0.00, 100, 'To Win', 'Actual', 0, 1, 'Money@2025', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 00:01:10', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(78, 'Billy2121', 'Billy2121@example.com', '7709182104@21', 'Billy2121', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, '7709182104@21', '100025', NULL, 'Normal', NULL, NULL, '2025-07-26 00:08:57', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(79, 'Pappu shaw', 'Pappu shaw@example.com', '123456', 'Pappu shaw', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456_1', '100025', NULL, 'Normal', NULL, NULL, '2025-07-26 00:08:58', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(80, 'Jinsha', 'Jinsha@example.com', 'ABCD12@', 'Jinsha', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'ABCD12@', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 00:13:21', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(84, 'Sibabratakhatua', 'Sibabratakhatua@example.com', 'sibu1984', 'Sibabratakhatua', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'sibabr', '100025', NULL, 'Normal', NULL, NULL, '2025-07-26 00:18:29', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(87, 'Waseem Akram ', 'Waseem Akram @example.com', 'Waseem@123', 'Waseem Akram ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Waseem@123', NULL, NULL, 'Normal', NULL, NULL, '2025-07-26 00:23:47', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(90, 'SuparnaMitra ', 'SuparnaMitra @example.com', 'Champa@425', 'SuparnaMitra ', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 1, '905171', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 00:33:12', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(91, 'Shwetamaddu', 'Shwetamaddu@example.com', 'shwetam', 'Shwetamaddu', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'shweta16', '100025', NULL, 'Normal', NULL, NULL, '2025-07-26 00:34:07', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(92, 'Mubaibrar', 'Mubaibrar@example.com', 'abc1123456', 'Mubaibrar', 'customer', 201800.00, 201800.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'abc1123456', '10030', NULL, 'Normal', NULL, NULL, '2025-07-26 00:42:24', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(93, 'Nandankr', 'Nandankr@example.com', 'nandan9113', 'Nandankr', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'nandan8155', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 00:58:41', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(94, 'Nasreeneajaz', 'Nasreeneajaz@example.com', 'ABC12345', 'Nasreeneajaz', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'ABC12345', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 00:58:51', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(95, 'Nasreen5656', 'Nasreen5656@example.com', 'ABC12345', 'Nasreen5656', 'customer', 16300.00, 0.00, 16300.00, 100, 'To Win', 'Actual', 0, 1, 'ABC12345', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 01:02:20', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(96, 'Jay', 'Jay@example.com', '52906499', 'Jay', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '52906499', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 02:27:45', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(97, 'Alak Bhattacharjee', 'Alak Bhattacharjee@example.com', 'alak123@2', 'Alak Bhattacharjee', 'customer', 7000.00, 7000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '762877', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 02:52:08', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(98, 'priyanka8451_1', 'priyanka8451_1@example.com', 'priya@123', 'priyanka8451_1', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'priya@123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 03:35:22', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(99, 'Priyanka8451_2', 'Priyanka8451_2@example.com', 'priya@123', 'Priyanka8451_2', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'priya@123_2', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 03:37:38', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(100, 'Priyanka8573', 'Priyanka8573@example.com', 'priya@123', 'Priyanka8573', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, 'priya@123_1', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 03:41:41', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(101, 'Shaldekar123', 'Shaldekar123@example.com', 'Shaldekar@123', 'Shaldekar123', 'customer', 51200.00, 51200.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Shaldekar@123', NULL, NULL, 'Normal', NULL, NULL, '2025-07-26 05:39:56', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(102, 'Nirmay_14', 'Nirmay_14@example.com', 'Nirmay@8808', 'Nirmay_14', 'customer', 403200.00, 403200.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Nirmay@8808', NULL, NULL, 'Normal', NULL, NULL, '2025-07-26 09:08:50', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(103, 'Deepakkumarswami ', 'Deepakkumarswami @example.com', '123456', 'Deepakkumarswami ', 'customer', 51926.00, 0.00, 51926.00, 100, 'To Win', 'Actual', 0, 0, '000000', '10021', NULL, 'Normal', NULL, NULL, '2025-07-26 23:04:10', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(104, 'Hari', 'Hari@example.com', 'hari1288', 'Hari', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '100025', '100025', NULL, 'Normal', NULL, NULL, '2025-07-26 23:53:55', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(105, 'Nishant Sachan', 'Nishant Sachan@example.com', '190903', 'Nishant Sachan', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456_3', '100025', NULL, 'Normal', NULL, NULL, '2025-07-26 23:54:54', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(106, 'ROHITKUMAR_2', 'ROHITKUMAR_2@example.com', 'Admin@2025', 'ROHITKUMAR_2', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Rohit@2025', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 23:58:04', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(107, 'Haidar99', 'Haidar99@example.com', 'haidar123', 'Haidar99', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456_2', '100030', NULL, 'Normal', NULL, NULL, '2025-07-26 23:59:48', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(108, 'RohitKumar ', 'RohitKumar @example.com', '8587841214', 'RohitKumar ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '8802147262', '100030', NULL, 'Normal', NULL, NULL, '2025-07-27 00:02:27', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(109, 'swapnilshivankar', 'swapnilshivankar@example.com', 'swapnil@123', 'swapnilshivankar', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'swapnil@123', '100025', NULL, 'Normal', NULL, NULL, '2025-07-27 00:03:54', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(110, 'Mohsin', 'Mohsin@example.com', 'mohsin@123', 'Mohsin', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Mohsin@1306', '100030', NULL, 'Normal', NULL, NULL, '2025-07-27 00:05:35', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(111, 'swapnil.s', 'swapnil.s@example.com', 'swapnil@123', 'swapnil.s', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'swapnil@123', '100025', NULL, 'Normal', NULL, NULL, '2025-07-27 00:06:10', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(112, 'Radha Kumari ', 'Radha Kumari @example.com', 'Pass$0000', 'Radha Kumari ', 'customer', 51200.00, 0.00, 51200.00, 100, 'To Win', 'Actual', 0, 0, 'Pass#0000', '100025', NULL, 'Normal', NULL, NULL, '2025-07-27 00:08:52', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(113, 'Rohitkumar_1', 'Rohitkumar_1@example.com', 'Admin@12345', 'Rohitkumar_1', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '880214', '100030', NULL, 'Normal', NULL, NULL, '2025-07-27 00:08:59', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(114, 'Vikram goyal', 'Vikram goyal@example.com', 'vikramgoyal', 'Vikram goyal', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'vikramgoyal', '100025', NULL, 'Normal', NULL, NULL, '2025-07-27 00:12:07', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(115, 'Divyani ware', 'Divyani ware@example.com', 'divyani1900', 'Divyani ware', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'divyani1900', NULL, NULL, 'Normal', NULL, NULL, '2025-07-27 00:26:06', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(116, 'Gaurishingote ', 'Gaurishingote @example.com', '9529138655gauri', 'Gaurishingote ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '9529138655gauri', '100030', NULL, 'Normal', NULL, NULL, '2025-07-27 00:27:02', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(117, 'Nituyati', 'Nituyati@example.com', 'nitu1234', 'Nituyati', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '100025', NULL, NULL, 'Normal', NULL, NULL, '2025-07-27 00:28:13', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(118, 'Gauri shingote ', 'Gauri shingote @example.com', '731998', 'Gauri shingote ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '731998', '100030', NULL, 'Normal', NULL, NULL, '2025-07-27 00:29:41', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(119, 'divyaniware', 'divyaniware@example.com', 'divyani1900', 'divyaniware', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'divyani1900', '10021', NULL, 'Normal', NULL, NULL, '2025-07-27 00:41:08', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(120, 'Rakesh Prasad', 'Rakesh Prasad@example.com', 'Rakesh@123', 'Rakesh Prasad', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Rakesh@12345', '100030', NULL, 'Normal', NULL, NULL, '2025-07-27 00:46:28', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(121, 'Nituyati88', 'Nituyati88@example.com', 'Nituyati03', 'Nituyati88', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, 'Nituyati03', '100025', NULL, 'Normal', NULL, NULL, '2025-07-27 00:47:12', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(122, 'Rakesh Prasad_2', 'Rakesh Prasad @example.com', 'Rakesh@123', 'Rakesh Prasad ', 'customer', 131600.00, 0.00, 131600.00, 100, 'To Win', 'Actual', 0, 1, 'Rakesh@12345_1', '100030', NULL, 'Normal', NULL, NULL, '2025-07-27 00:48:52', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(123, 'Sachintendulkar ', 'Sachintendulkar @example.com', 'Qazwsxedc', 'Sachintendulkar ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Qazwsxedc', '100020', NULL, 'Normal', NULL, NULL, '2025-07-27 01:37:45', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(124, 'Nidhi', 'Nidhi@example.com', 'Qazwsxedc', 'Nidhi', 'customer', 492900.00, 492900.00, 0.00, 100, 'To Win', 'Actual', 0, 1, 'Qazwsxedc', '100020', NULL, 'Normal', NULL, NULL, '2025-07-27 01:38:59', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(125, 'Gau shingote ', 'Gau shingote @example.com', '7891011', 'Gau shingote ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '7891011', '100030', NULL, 'Normal', NULL, NULL, '2025-07-27 01:50:25', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(126, 'sarvesh Kumar patel', 'sarvesh Kumar patel@example.com', '123456', 'sarvesh Kumar patel', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456', '100030', NULL, 'Normal', NULL, NULL, '2025-07-27 23:54:58', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(127, 'Sarveshkumar', 'Sarveshkumar@example.com', '123456', 'Sarveshkumar', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456', '100030', NULL, 'Normal', NULL, NULL, '2025-07-27 23:56:45', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(128, 'Hardik ', 'Hardik @example.com', 'Dhyan@123', 'Hardik ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Patel@123', NULL, NULL, 'Normal', NULL, NULL, '2025-07-27 23:59:34', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(129, 'Ganesh kumar', 'Ganesh kumar@example.com', 'ganesh@7838', 'Ganesh kumar', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, 'ganesh@7838', '7838', NULL, 'Normal', NULL, NULL, '2025-07-28 00:01:49', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(130, 'Hardik patel ', 'Hardik patel @example.com', 'Dhyan@123', 'Hardik patel ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Depot@123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 00:03:13', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(131, 'SUDESH KUMAR MAHTO', 'SUDESH KUMAR MAHTO@example.com', 'Sudesh@12345', 'SUDESH KUMAR MAHTO', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 00:04:41', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(132, 'Hardik M ', 'Hardik M @example.com', 'Dhyan@123', 'Hardik M ', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Depot@123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 00:05:55', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(133, 'Vishnu Kumar ', 'Vishnu Kumar @example.com', 'Vishnu@12', 'Vishnu Kumar ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Vishnu@123', '100025', NULL, 'Normal', NULL, NULL, '2025-07-28 00:05:57', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(134, 'Gurneet ', 'Gurneet @example.com', 'asdfghjkl', 'Gurneet ', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'asdfghjkl', NULL, NULL, 'Normal', NULL, NULL, '2025-07-28 00:06:20', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(135, 'Balaji Wankhede', 'Balaji Wankhede@example.com', '09876patil', 'Balaji Wankhede', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 1, '09876wpatil', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 00:07:20', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(136, 'Jaspreet kaur', 'Jaspreet kaur@example.com', '199193', 'Jaspreet kaur', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '199193', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 00:07:40', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(137, 'Sudesh45', 'Sudesh45@example.com', 'Sudesh@12345', 'Sudesh45', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 00:09:50', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(138, 'Jaspreet', 'Jaspreet@example.com', '199193', 'Jaspreet', 'customer', 51200.00, 0.00, 51200.00, 100, 'To Win', 'Actual', 0, 1, '199193', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 00:11:44', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(139, 'Roop jaiswal', 'Roop jaiswal@example.com', 'Roop@1991', 'Roop jaiswal', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Roop@2025', '100025', NULL, 'Normal', NULL, NULL, '2025-07-28 00:20:06', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(140, 'Prajwal', 'Prajwal@example.com', 'Vp2810', 'Prajwal', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'vp2810', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 00:32:46', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(141, 'aditya3213_1', 'aditya3213_1@example.com', 'Aditya1234', 'aditya3213_1', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Aditya1234', '100033', NULL, 'Normal', NULL, NULL, '2025-07-28 00:36:27', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(142, 'Gulzar', 'Gulzar@example.com', '22312231', 'Gulzar', 'customer', 624400.00, 573200.00, 0.00, 100, 'To Win', 'Actual', 0, 1, '22312231', NULL, NULL, 'Normal', NULL, NULL, '2025-07-28 00:39:44', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(143, 'Aditya 3213', 'Aditya 3213@example.com', 'aditya1234', 'Aditya 3213', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'aditya1234', NULL, NULL, 'Normal', NULL, NULL, '2025-07-28 01:21:21', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(144, 'Subhakalyan Das ', 'Subhakalyan Das @example.com', 'Gugu1122', 'Subhakalyan Das ', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Guguna2233', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 01:26:54', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(145, 'Subhakalyan ', 'Subhakalyan @example.com', 'Gugu1122', 'Subhakalyan ', 'customer', 10000.00, 10000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Subha2233', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 01:30:18', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(146, 'Aditya3213_2', 'Aditya3213_2@example.com', 'aditya1234', 'Aditya3213_2', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'aditya1234', '100033', NULL, 'Normal', NULL, NULL, '2025-07-28 01:37:38', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(147, 'Jaspreet k', 'Jaspreet k@example.com', '199193', 'Jaspreet k', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '199193', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 01:49:16', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(150, 'Jadpreet', 'Jadpreet@example.com', '199193', 'Jadpreet', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '199193', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 04:44:23', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(151, 'Vishnu45', 'Vishnu45@example.com', '011006', 'Vishnu45', 'customer', 375644.00, 375644.00, 0.00, 100, 'To Win', 'Actual', 0, 1, '011006', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 05:42:26', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(152, 'anmoltarexalxo', 'anmoltarexalxo@example.com', '7770atx6260', 'anmoltarexalxo', 'customer', 305310.00, 305310.00, 0.00, 100, 'To Win', 'Actual', 0, 1, '7770atx6260', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 05:46:05', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(153, 'Rachel2404', 'Rachel2404@example.com', 'Password@123', 'Rachel2404', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Rebston@2022', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 23:49:09', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(154, 'Ranisha', 'Ranisha@example.com', 'reni6612', 'Ranisha', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'reni6612', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 23:54:13', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(155, 'Ranisha.R', 'Ranisha.R@example.com', 'Reni6612', 'Ranisha.R', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '6612reni', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 23:55:11', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(156, 'Cha@123#', 'Cha@123#@example.com', 'Bab@123#', 'Cha@123#', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Babu@123#', 'Kanakadurga@123#', NULL, 'Normal', NULL, NULL, '2025-07-28 23:55:52', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(157, 'Ganesh', 'Ganesh@example.com', 'Ganesh@123', 'Ganesh', 'customer', -1000.00, 0.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, 'Ganesh@123', '100025', NULL, 'Normal', NULL, NULL, '2025-07-28 23:58:23', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(158, 'Chandu@123#', 'Chandu@123#@example.com', 'Chandu@123#', 'Chandu@123#', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, 'Babi@123#', '100030', NULL, 'Normal', NULL, NULL, '2025-07-28 23:59:01', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(159, 'Subir@1', 'Subir@1@example.com', 'Hellrider', 'Subir@1', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '869754', NULL, NULL, 'Normal', NULL, NULL, '2025-07-28 23:59:18', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(160, 'Karttick@2001', 'Karttick@2001@example.com', 'Karttick@2001', 'Karttick@2001', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Karttick@2001', '100030', NULL, 'Normal', NULL, NULL, '2025-07-29 00:00:17', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(161, 'Rio', 'Rio@example.com', 'hellrider', 'Rio', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'rio123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-29 00:01:19', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(162, 'Aakriti', 'Aakriti@example.com', 'Aakriti1105', 'Aakriti', 'customer', 3000.00, 3000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Aak1105', '100030', NULL, 'Normal', NULL, NULL, '2025-07-29 00:01:57', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(163, 'Mohanab', 'Mohanab@example.com', 'Havish@135', 'Mohanab', 'customer', 51200.00, 0.00, 51200.00, 100, 'To Win', 'Buy Up', 0, 0, 'Havish@135', '100025', NULL, 'Normal', NULL, NULL, '2025-07-29 00:03:10', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(164, 'Sunitalboo', 'Sunitalboo@example.com', 'sunita44', 'Sunitalboo', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'sunita44', '100025', NULL, 'Normal', NULL, NULL, '2025-07-29 00:03:30', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(165, 'Sunitalim', 'Sunitalim@example.com', 'sunita44', 'Sunitalim', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Buy Up', 0, 0, 'sunita44', '100025', NULL, 'Normal', NULL, NULL, '2025-07-29 00:07:32', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(166, 'Amita15', 'Amita15@example.com', 'Parth@1234', 'Amita15', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, 'Parth@1234', '100025', NULL, 'Normal', NULL, NULL, '2025-07-29 00:13:24', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(168, 'Kiran2001', 'Kiran2001@example.com', 'Kiran@2001', 'Kiran2001', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456', '100030', NULL, 'Normal', NULL, NULL, '2025-07-29 00:22:05', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(169, '__Ganesh__', '__Ganesh__@example.com', 'Ganesh@123', '__Ganesh__', 'customer', 134504.00, 0.00, 134504.00, 100, 'To Win', 'Actual', 0, 0, '123@Ganesh', '10021', NULL, 'Normal', NULL, NULL, '2025-07-29 00:23:47', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(170, 'Mubasheera', 'Mubasheera@example.com', 'Welcome@456', 'Mubasheera', 'customer', 99100.00, 0.00, 99100.00, 100, 'To Win', 'Actual', 0, 0, 'Welcome@456', NULL, NULL, 'Normal', NULL, NULL, '2025-07-29 00:24:37', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(172, 'Mahhi', 'Mahhi@example.com', '6950mahi', 'Mahhi', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Buy Up', 0, 0, '265840', '100025', NULL, 'Normal', NULL, NULL, '2025-07-29 01:04:30', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(173, 'abc123', 'abc123@example.com', 'abc123', 'abc123', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'abc123', 'Fgg', NULL, 'Normal', NULL, NULL, '2025-07-29 03:04:07', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(174, 'Lala', 'Lala@example.com', 'lalala', 'Lala', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'lalala', NULL, NULL, 'Normal', NULL, NULL, '2025-07-29 07:12:50', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(175, 'Helio', 'Helio@example.com', 'Testing', 'Helio', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456', NULL, NULL, 'Normal', NULL, NULL, '2025-07-29 07:54:16', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(176, 'Helios', 'Helios@example.com', 'Testing', 'Helios', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456', NULL, NULL, 'Normal', NULL, NULL, '2025-07-29 07:54:50', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `name`, `role`, `balance`, `available_balance`, `frozen_balance`, `reputation`, `win_lose_setting`, `direction`, `is_banned`, `withdrawal_prohibited`, `fund_password`, `agent_invitation_code`, `invitation_code`, `user_type`, `general_agent`, `remark`, `registration_time`, `profile_image`, `signature_data`, `signature_name`, `is_active`, `credit_score`, `tasks_ban`, `created_at`, `updated_at`) VALUES
(177, 'Ismailhaider001', 'Ismailhaider001@example.com', '123123', 'Ismailhaider001', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-29 23:29:19', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(178, 'Mdabdullahbinsharif', 'Mdabdullahbinsharif@example.com', 'Bangladesh123#', 'Mdabdullahbinsharif', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Bangladesh123#', '100030', NULL, 'Normal', NULL, NULL, '2025-07-29 23:39:56', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(179, 'Mohdashif42', 'Mohdashif42@example.com', 'Ashif@100', 'Mohdashif42', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, 'Ikra@100', '100030', NULL, 'Normal', NULL, NULL, '2025-07-29 23:53:30', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(180, 'Sunita', 'Sunita@example.com', '1sunita', 'Sunita', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '1sunita', '100030', NULL, 'Normal', NULL, NULL, '2025-07-29 23:55:20', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(181, 'pratiswa62@gmail.com', 'pratiswa62@gmail.com@example.com', 'Abinash@21', 'pratiswa62@gmail.com', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Sonu@#123456', '100025', NULL, 'Normal', NULL, NULL, '2025-07-29 23:56:16', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(182, 'Rased', 'Rased@example.com', 'RG@72462', 'Rased', 'customer', 7100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, 'RASED@1995', '100030', NULL, 'Normal', NULL, NULL, '2025-07-29 23:58:10', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(183, 'Vishal', 'Vishal@example.com', 'Crypto@23', 'Vishal', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Crypto@23f', '100030', NULL, 'Normal', NULL, NULL, '2025-07-29 23:58:19', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(184, 'Jintu', 'Jintu@example.com', '781349', 'Jintu', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '7002823', '100030', NULL, 'Normal', NULL, NULL, '2025-07-29 23:59:25', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(185, '9980429663', '9980429663@example.com', '9980429663@Nu', '9980429663', 'customer', 22000.00, 23000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '509300', '100030', NULL, 'Normal', NULL, NULL, '2025-07-30 00:00:35', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(186, 'Kou', 'Kou@example.com', 'ajay1122', 'Kou', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'sura890', NULL, NULL, 'Normal', NULL, NULL, '2025-07-30 00:02:59', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(187, 'Anirudh', 'Anirudh@example.com', 'wipro@6087', 'Anirudh', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'wipro@6087', '100030', NULL, 'Normal', NULL, NULL, '2025-07-30 00:03:04', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(188, 'thaj007', 'thaj007@example.com', 'strainstrenght', 'thaj007', 'customer', 3000.00, 3000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '007007', '100030', NULL, 'Normal', NULL, NULL, '2025-07-30 00:07:10', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(189, 'Divakarr', 'Divakarr@example.com', 'div@98', 'Divakarr', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'diva98', NULL, NULL, 'Normal', NULL, NULL, '2025-07-30 00:09:42', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(190, 'choudharynikhil090900', 'choudharynikhil090900@example.com', 'Nikhil090900@', 'choudharynikhil090900', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Nikhil123@', '100030', NULL, 'Normal', NULL, NULL, '2025-07-30 00:12:31', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(191, 'Ashis97', 'Ashis97@example.com', 'Sorry123045', 'Ashis97', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Buy Up', 0, 0, '1230456', '100025', NULL, 'Normal', NULL, NULL, '2025-07-30 00:14:45', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(192, 'Kumar', 'Kumar@example.com', '9927611745', 'Kumar', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '9927611745', '100030', NULL, 'Normal', NULL, NULL, '2025-07-30 00:15:00', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(193, 'AbhishekDhariwal', 'AbhishekDhariwal@example.com', 'Abhi123@', 'AbhishekDhariwal', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Abhi8899@', '100025', NULL, 'Normal', NULL, NULL, '2025-07-30 00:15:38', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(194, 'Abhishek', 'Abhishek@example.com', 'Abhi8899@', 'Abhishek', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Abhi8899@', '100025', NULL, 'Normal', NULL, NULL, '2025-07-30 00:24:52', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(195, 'Kumar2123', 'Kumar2123@example.com', '9927611745', 'Kumar2123', 'customer', 3000.00, 3000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '9927611745', '100030', NULL, 'Normal', NULL, NULL, '2025-07-30 00:41:43', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(196, 'Sonu2123', 'Sonu2123@example.com', '9927611745', 'Sonu2123', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '9927611745', '100030', NULL, 'Normal', NULL, NULL, '2025-07-30 01:18:49', NULL, 'data:image/png;base64,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', 'Sonu Kumar', 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(197, 'Ruhiparweennaaz', 'Ruhiparweennaaz@example.com', 'Ruhi@123', 'Ruhiparweennaaz', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Ruhi@123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-30 02:11:50', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(198, 'Ruhinaazparween', 'Ruhinaazparween@example.com', 'Ruhi@123', 'Ruhinaazparween', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Ruhi@123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-30 02:14:41', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(199, 'Sudheerchennuri', 'Sudheerchennuri@example.com', 'Lalith@2405#2014', 'Sudheerchennuri', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '240514', '10021', NULL, 'Normal', NULL, NULL, '2025-07-30 02:16:34', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(200, 'dsfsf', 'dsfsf@example.com', 'dsfsfsf', 'dsfsf', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'sddsfsd', 'sdfsfds', NULL, 'Normal', NULL, NULL, '2025-07-30 07:02:05', NULL, 'data:image/png;base64,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', 'asdsad', 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(201, 'youasshole', 'youasshole@example.com', 'hello123@123', 'youasshole', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'hello123@123', 'Asn', NULL, 'Normal', NULL, NULL, '2025-07-30 23:08:12', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(202, 'Nitesh', 'Nitesh@example.com', 'nitesh1212', 'Nitesh', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '121512', '100030', NULL, 'Normal', NULL, NULL, '2025-07-31 00:00:29', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(203, 'girijaray_7', 'girijaray_7@example.com', 'Girijaray@2005', 'girijaray_7', 'customer', 145700.00, 0.00, 131600.00, 100, 'To Win', 'Actual', 0, 1, '123456', '100030', NULL, 'Normal', NULL, NULL, '2025-07-31 00:02:02', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(204, 'Vijay', 'Vijay@example.com', 'buddy7704', 'Vijay', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'buddy7704', '100030', NULL, 'Normal', NULL, NULL, '2025-07-31 00:08:32', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(205, 'Sureshbhai', 'Sureshbhai@example.com', '129393', 'Sureshbhai', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Buy Up', 0, 0, '129393', '100025', NULL, 'Normal', NULL, NULL, '2025-07-31 00:14:48', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(206, 'SwethaG', 'SwethaG@example.com', 'Shwetha@123', 'SwethaG', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, 'Shwetha@123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-31 00:21:40', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(207, 'praveshchauhan190@gmail.com', 'praveshchauhan190@gmail.com@example.com', 'Pravesh@123', 'praveshchauhan190@gmail.com', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Anchal@123', '100030', NULL, 'Normal', NULL, NULL, '2025-07-31 00:40:39', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:26', '2025-08-13 09:57:26'),
(208, 'Rukamanand', 'Rukamanand@example.com', '80035@', 'Rukamanand', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '80035@', '100030', NULL, 'Normal', NULL, NULL, '2025-07-31 01:25:34', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(209, 'Rkjangid', 'Rkjangid@example.com', '512200@', 'Rkjangid', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '512200@', '100030', NULL, 'Normal', NULL, NULL, '2025-07-31 01:28:06', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(210, 'Vikash', 'Vikash@example.com', 'Vikas5122@', 'Vikash', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, 'Vikas0010@', '100030', NULL, 'Normal', NULL, NULL, '2025-07-31 01:30:02', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(211, 'Somashekar', 'Somashekar@example.com', 'Soma@3456', 'Somashekar', 'customer', 1000.00, 1000.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Soma@3456', '100030', NULL, 'Normal', NULL, NULL, '2025-07-31 01:43:21', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(212, 'Saikumarchinthada', 'Saikumarchinthada@example.com', 'saikumar2345', 'Saikumarchinthada', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'saikumar2345', '100030', NULL, 'Normal', NULL, NULL, '2025-07-31 04:14:23', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(213, 'Chinthadasaikumar', 'Chinthadasaikumar@example.com', '2345saikumar', 'Chinthadasaikumar', 'customer', 118100.00, 0.00, 118100.00, 100, 'To Win', 'Actual', 0, 0, 'ismartsai420', '100030', NULL, 'Normal', NULL, NULL, '2025-07-31 04:21:56', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(215, 'Skumar', 'Skumar@example.com', 'Sand1234', 'Skumar', 'customer', 263200.00, 263200.00, 0.00, 100, 'To Win', 'Actual', 0, 1, 'Manu1234', '74514', NULL, 'Normal', NULL, NULL, '2025-07-31 07:17:35', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(216, 'Himalaya', 'Himalaya@example.com', 'Him@12345', 'Himalaya', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Him#9466', '100030', NULL, 'Normal', NULL, NULL, '2025-08-01 00:01:37', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(217, 'Yogihsr', 'Yogihsr@example.com', 'Him@12345', 'Yogihsr', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Him#9466', '100030', NULL, 'Normal', NULL, NULL, '2025-08-01 00:03:10', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(218, 'phoenix07', 'phoenix07@example.com', 'jejudi', 'phoenix07', 'customer', 51200.00, 0.00, 51200.00, 100, 'To Win', 'Buy Up', 0, 0, 'jejudi', '100025', NULL, 'Normal', NULL, NULL, '2025-08-01 00:04:32', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(219, 'Vasundhara', 'Vasundhara@example.com', 'Abc@1234', 'Vasundhara', 'customer', 7900.00, 0.00, 8900.00, 100, 'To Win', 'Buy Up', 0, 0, 'Abc#1234', '100030', NULL, 'Normal', NULL, NULL, '2025-08-01 00:05:26', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(220, 'sharmarajan1965@gmail.com', 'sharmarajan1965@gmail.com@example.com', '09034504951', 'sharmarajan1965@gmail.com', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '504951', NULL, NULL, 'Normal', NULL, NULL, '2025-08-01 00:07:30', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(221, 'raja78965', 'raja78965@example.com', '4132563', 'raja78965', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Buy Up', 0, 0, '132563', '100025', NULL, 'Normal', NULL, NULL, '2025-08-01 00:23:20', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(222, 'Babashri', 'Babashri@example.com', 'Balushri6@', 'Babashri', 'customer', 57200.00, 0.00, 51200.00, 100, 'To Win', 'Actual', 0, 0, '143016', '100030', NULL, 'Normal', NULL, NULL, '2025-08-01 00:46:27', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(224, 'Nandha', 'Nandha@example.com', '1516555', 'Nandha', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456', '100025', NULL, 'Normal', NULL, NULL, '2025-08-02 00:05:10', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(225, 'NaseerNas', 'NaseerNas@example.com', 'Naseer@3160', 'NaseerNas', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '009846', '100025', NULL, 'Normal', NULL, NULL, '2025-08-02 00:12:01', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(226, 'Supercoin8907', 'Supercoin8907@example.com', '741852', 'Supercoin8907', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '776593', '100025', NULL, 'Normal', NULL, NULL, '2025-08-02 00:12:40', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(227, 'coin23658', 'coin23658@example.com', '852741', 'coin23658', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '852741', '100025', NULL, 'Normal', NULL, NULL, '2025-08-02 00:17:02', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(228, 'Ajay555', 'Ajay555@example.com', 'Ajay555', 'Ajay555', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Ajay555', '100025', NULL, 'Normal', NULL, NULL, '2025-08-02 00:17:16', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(229, 'NaseeNass55', 'NaseeNass55@example.com', 'abcd12345', 'NaseeNass55', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, 'NaseeNass55', '100025', NULL, 'Normal', NULL, NULL, '2025-08-02 00:26:31', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(230, 'Mohdamzadali', 'Mohdamzadali@example.com', '@123456', 'Mohdamzadali', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '@123456_1', '100025', NULL, 'Normal', NULL, NULL, '2025-08-02 00:38:34', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(231, 'Amzad123', 'Amzad123@example.com', '@123456', 'Amzad123', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '@123456_4', '@123456', NULL, 'Normal', NULL, NULL, '2025-08-02 00:46:07', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(232, 'Samatha1451', 'Samatha1451@example.com', '12345678', 'Samatha1451', 'customer', 1300.00, 1300.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '12345678', '100030', NULL, 'Normal', NULL, NULL, '2025-08-02 00:55:29', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(233, 'Amzadali123', 'Amzadali123@example.com', '@123456', 'Amzadali123', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '@123456_2', '100025', NULL, 'Normal', NULL, NULL, '2025-08-02 01:01:51', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(234, 'Amzadali@123', 'Amzadali@123@example.com', '@123456', 'Amzadali@123', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '@123456_3', '100025', NULL, 'Normal', NULL, NULL, '2025-08-02 01:08:57', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(235, 'Madhavram', 'Madhavram@example.com', '121212', 'Madhavram', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '895396', '100025', NULL, 'Normal', NULL, NULL, '2025-08-02 02:16:07', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(236, 'Asiya5645', 'Asiya5645@example.com', 'jl21mdd@', 'Asiya5645', 'customer', 1200.00, 1200.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456', '500030', NULL, 'Normal', NULL, NULL, '2025-08-02 03:00:19', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(237, 'Vishal619', 'Vishal619@example.com', 'vishu619', 'Vishal619', 'customer', 1300.00, 1300.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'vishu619', '100030', NULL, 'Normal', NULL, NULL, '2025-08-02 04:52:53', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(239, 'Govindkumar', 'Govindkumar@example.com', 'Govind@123', 'Govindkumar', 'customer', 51200.00, 0.00, 51200.00, 100, 'To Win', 'Actual', 0, 0, 'Govind@123', '100025', NULL, 'Normal', NULL, NULL, '2025-08-03 00:00:09', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(240, 'Nothing', 'Nothing@example.com', 'No1357', 'Nothing', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123789', NULL, NULL, 'Normal', NULL, NULL, '2025-08-03 00:00:36', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(241, 'Never', 'Never@example.com', 'No1357', 'Never', 'customer', 4300.00, 0.00, 4300.00, 100, 'To Win', 'Actual', 0, 0, '123789', '10021', NULL, 'Normal', NULL, NULL, '2025-08-03 00:02:33', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(242, 'Banwari1', 'Banwari1@example.com', '7357759577', 'Banwari1', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, '9783121602', '100025', NULL, 'Normal', NULL, NULL, '2025-08-03 00:59:44', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(243, 'santosh4801', 'santosh4801@example.com', 'santosh1', 'santosh4801', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'santosh1', '100030', NULL, 'Normal', NULL, NULL, '2025-08-03 23:58:51', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(244, 'Adishwar', 'Adishwar@example.com', 'Aadhi@1234', 'Adishwar', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '123456', '100025', NULL, 'Normal', NULL, NULL, '2025-08-04 00:16:32', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(245, 'Raghavendra', 'Raghavendra@example.com', 'Raghu@118', 'Raghavendra', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Raghu@118', '100025', NULL, 'Normal', NULL, NULL, '2025-08-04 00:18:23', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(246, 'Adishwarreddy', 'Adishwarreddy@example.com', 'Aadhi@1234', 'Adishwarreddy', 'customer', 14100.00, 0.00, 14100.00, 100, 'To Win', 'Actual', 0, 0, '123456', '100025', NULL, 'Normal', NULL, NULL, '2025-08-04 00:18:54', NULL, NULL, NULL, 1, 80, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(247, 'Namangupta7752', 'Namangupta7752@example.com', 'Namangupta9999', 'Namangupta7752', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Mmmmmmmmmm', '100030', NULL, 'Normal', NULL, NULL, '2025-08-04 00:43:30', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(248, 'Namangupta7777', 'Namangupta7777@example.com', 'Namangupta7742', 'Namangupta7777', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Namangupta7742', '100030', NULL, 'Normal', NULL, NULL, '2025-08-04 00:45:25', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(249, 'Shivamsharma', 'Shivamsharma@example.com', 'Shivam@98', 'Shivamsharma', 'customer', 131600.00, 0.00, 131600.00, 100, 'To Win', 'Actual', 0, 0, 'Shivam@9558', NULL, NULL, 'Normal', NULL, NULL, '2025-08-04 01:26:59', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(250, 'Shahnawaz', 'Shahnawaz@example.com', 'Khan@123', 'Shahnawaz', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Khan@098', '100025', NULL, 'Normal', NULL, NULL, '2025-08-04 01:39:47', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(251, 'Khanshahnawaz', 'Khanshahnawaz@example.com', '1234qwer', 'Khanshahnawaz', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, '1234qwer', NULL, NULL, 'Normal', NULL, NULL, '2025-08-04 04:48:13', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(252, 'Aditya77', 'Aditya77@example.com', 'ABC123', 'Aditya77', 'customer', 140206.00, 140206.00, 0.00, 100, 'To Win', 'Actual', 0, 1, 'ABC123', '10021', NULL, 'Normal', NULL, NULL, '2025-08-04 22:38:41', NULL, NULL, NULL, 1, 60, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(253, 'Ishmeetsingh', 'Ishmeetsingh@example.com', 'Ishmeet@1997', 'Ishmeetsingh', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Manmeet@1997', '100030', NULL, 'Normal', NULL, NULL, '2025-08-04 23:56:48', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(254, 'Azar123', 'Azar123@example.com', 'Athifa@2682', 'Azar123', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Tansi@1234', '100030', NULL, 'Normal', NULL, NULL, '2025-08-04 23:58:47', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(255, 'Vyshnow', 'Vyshnow@example.com', 'Vyshnow@123', 'Vyshnow', 'customer', 3900.00, 3900.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Vyshnow@123', NULL, NULL, 'Normal', NULL, NULL, '2025-08-05 00:00:36', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(256, 'Shashi18', 'Shashi18@example.com', 'Sh@shi18', 'Shashi18', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Sh@shi18', '100025', NULL, 'Normal', NULL, NULL, '2025-08-05 00:02:26', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(257, 'Mohdalam', 'Mohdalam@example.com', 'at1234', 'Mohdalam', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'at1234', '100030', NULL, 'Normal', NULL, NULL, '2025-08-05 00:02:54', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(258, 'Aditi33', 'Aditi33@example.com', 'crypto123', 'Aditi33', 'customer', 3600.00, 3600.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'aditi123', '100025', NULL, 'Normal', NULL, NULL, '2025-08-05 00:03:23', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(259, 'Chanchal', 'Chanchal@example.com', 'Ch@nchal', 'Chanchal', 'customer', 1300.00, 1300.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Ch@nchal', '100030', NULL, 'Normal', NULL, NULL, '2025-08-05 00:05:01', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(260, 'SUBHAMSAHOO983', 'SUBHAMSAHOO983@example.com', 'Subham@123', 'SUBHAMSAHOO983', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Subham@1234', '100030', NULL, 'Normal', NULL, NULL, '2025-08-05 00:06:51', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(261, 'Pri', 'Pri@example.com', 'Bhairav', 'Pri', 'customer', 3900.00, 3900.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Bhairav1', '100025', NULL, 'Normal', NULL, NULL, '2025-08-05 00:09:29', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(262, 'Vishnu', 'Vishnu@example.com', 'vishnu@4321', 'Vishnu', 'customer', 3900.00, 3900.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'vishnu@1234', '100025', NULL, 'Normal', NULL, NULL, '2025-08-05 00:11:28', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-09-08 10:04:36'),
(263, 'WaghmareAnjali', 'WaghmareAnjali@example.com', 'barbieee', 'WaghmareAnjali', 'customer', -1000.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'barbieee', '100030', NULL, 'Normal', NULL, NULL, '2025-08-05 00:11:52', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27'),
(264, 'SINGUANIL', 'SINGUANIL@example.com', 'Aa@12345', 'SINGUANIL', 'customer', 0.00, 0.00, 0.00, 100, 'To Win', 'Actual', 0, 0, 'Aa@12345', '10025', NULL, 'Normal', NULL, NULL, '2025-08-05 00:15:17', NULL, NULL, NULL, 1, 100, 'Allowed', '2025-08-13 09:57:27', '2025-08-13 09:57:27');

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal_requests`
--

CREATE TABLE `withdrawal_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bank_account_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `processed_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `withdrawal_requests`
--

INSERT INTO `withdrawal_requests` (`id`, `user_id`, `bank_account_id`, `amount`, `status`, `note`, `created_at`, `processed_at`, `updated_at`) VALUES
(1, 4, 1, 1000.00, 'approved', NULL, '2025-07-11 09:30:52', '2025-07-11 09:46:40', '2025-08-13 10:04:37'),
(2, 4, 1, 32000.00, 'rejected', 'FAILED! Withdrawal failed due to miscellaneous activity', '2025-07-11 09:41:59', '2025-07-11 09:47:06', '2025-08-13 10:04:37'),
(3, 18, 2, 1000.00, 'approved', NULL, '2025-07-11 23:55:01', '2025-07-12 00:04:56', '2025-08-13 10:04:37'),
(4, 18, 2, 36000.00, 'rejected', 'Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.', '2025-07-12 00:11:30', '2025-07-12 00:13:52', '2025-08-13 10:04:37'),
(5, 28, 3, 1000.00, 'approved', NULL, '2025-07-12 00:52:37', '2025-07-12 01:09:02', '2025-08-13 10:04:37'),
(6, 28, 3, 32000.00, 'rejected', 'FAILED! Withdrawal failed due to miscellaneous activity', '2025-07-12 01:14:26', '2025-07-12 01:15:49', '2025-08-13 10:04:37'),
(7, 18, 2, 174600.00, 'rejected', 'Dear user, your current credit score is insufficient. Please restore your credit score to the normal value of 80 points before withdrawing cash.', '2025-07-12 06:25:54', '2025-07-12 07:36:39', '2025-08-13 10:04:37'),
(8, 25, 4, 1000.00, 'approved', NULL, '2025-07-12 08:22:24', '2025-07-12 08:38:48', '2025-08-13 10:04:37'),
(9, 25, 4, 28000.00, 'rejected', 'FAILED! Withdrawal failed due to miscellaneous activity', '2025-07-12 08:49:25', '2025-07-12 08:50:19', '2025-08-13 10:04:37'),
(10, 28, 3, 256000.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', '2025-07-12 09:19:28', '2025-07-12 10:14:35', '2025-08-13 10:04:37'),
(11, 25, 4, 152200.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', '2025-07-13 01:41:17', '2025-07-13 01:52:19', '2025-08-13 10:04:37'),
(12, 4, 1, 256000.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', '2025-07-13 02:10:49', '2025-07-13 02:33:25', '2025-08-13 10:04:37'),
(13, 38, 6, 1500.00, 'approved', NULL, '2025-07-13 06:23:14', '2025-07-13 06:31:07', '2025-08-13 10:04:37'),
(14, 38, 6, 36000.00, 'rejected', 'Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.      ', '2025-07-13 06:39:07', '2025-07-13 06:39:44', '2025-08-13 10:04:37'),
(15, 28, 3, 452000.00, 'rejected', 'According to the new regulations of the Ministry of Taxation in India in 2023, incomes above Rs. 3,00,000 are subject to 30% personal income tax.', '2025-07-13 07:53:45', '2025-07-13 09:39:18', '2025-08-13 10:04:37'),
(16, 38, 6, 263200.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', '2025-07-13 22:41:37', '2025-07-13 22:51:50', '2025-08-13 10:04:37'),
(17, 38, 6, 263200.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', '2025-07-14 01:47:33', '2025-07-14 03:41:20', '2025-08-13 10:04:37'),
(18, 1, 7, 50.00, 'approved', NULL, '2025-07-14 03:37:09', '2025-07-15 10:08:07', '2025-08-13 10:04:37'),
(19, 1, 7, 50.00, 'rejected', 'HI this, \r\n\r\nIs your rejection\r\n', '2025-07-14 03:37:31', '2025-07-14 03:39:04', '2025-08-13 10:04:37'),
(20, 1, 7, 100.00, 'rejected', 'Hi, \r\n\r\nThis is test message. \r\n\r\nFormat Checking', '2025-07-14 03:40:05', '2025-07-14 03:42:52', '2025-08-13 10:04:37'),
(21, 38, 6, 263200.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', '2025-07-14 07:41:23', '2025-07-15 10:08:26', '2025-08-13 10:04:37'),
(22, 45, 8, 1000.00, 'rejected', 'Withdrawal Failed!!! \r\n\r\nPlease bind valid account details. ', '2025-07-15 09:25:37', '2025-07-15 09:43:36', '2025-08-13 10:04:37'),
(23, 45, 8, 1000.00, 'approved', NULL, '2025-07-15 09:56:44', '2025-07-15 10:08:02', '2025-08-13 10:04:37'),
(24, 45, 8, 36000.00, 'rejected', 'Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.', '2025-07-15 10:16:57', '2025-07-15 10:19:04', '2025-08-13 10:04:37'),
(25, 48, 9, 13250.00, 'rejected', 'Failed ', '2025-07-15 10:54:49', '2025-07-17 00:59:31', '2025-08-13 10:04:37'),
(26, 48, 9, 13250.00, 'rejected', 'Failed ', '2025-07-15 10:56:17', '2025-07-17 00:59:35', '2025-08-13 10:04:37'),
(27, 48, 9, 13250.00, 'rejected', 'Failed ', '2025-07-15 11:24:46', '2025-07-17 00:59:39', '2025-08-13 10:04:37'),
(28, 48, 9, 13250.00, 'rejected', 'Failed ', '2025-07-16 01:20:47', '2025-07-17 00:59:46', '2025-08-13 10:04:37'),
(29, 38, 6, 263200.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', '2025-07-16 09:07:12', '2025-07-17 00:59:17', '2025-08-13 10:04:37'),
(30, 38, 6, 263200.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', '2025-07-17 00:12:04', '2025-07-17 00:59:12', '2025-08-13 10:04:37'),
(31, 48, 9, 13250.00, 'rejected', 'Failed ', '2025-07-17 00:42:29', '2025-07-17 00:59:50', '2025-08-13 10:04:37'),
(32, 44, 12, 1000.00, 'approved', NULL, '2025-07-17 11:49:05', '2025-07-17 11:55:09', '2025-08-13 10:04:37'),
(33, 44, 12, 36000.00, 'rejected', 'Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.     ', '2025-07-17 11:56:54', '2025-07-17 11:58:13', '2025-08-13 10:04:37'),
(34, 38, 6, 263200.00, 'rejected', '      ❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', '2025-07-21 08:22:19', '2025-07-25 05:03:09', '2025-08-13 10:04:37'),
(35, 47, 14, 100.00, 'approved', NULL, '2025-07-23 07:39:07', '2025-07-25 05:02:54', '2025-08-13 10:04:37'),
(36, 54, 15, 897125.00, 'rejected', 'Dear user your withdrawal is failed due to indian tax law first you need to pay tax after that you can applying withdrawal please content with tax manger', '2025-07-23 07:44:10', '2025-07-23 07:59:57', '2025-08-13 10:04:37'),
(37, 62, 16, 1500.00, 'approved', NULL, '2025-07-25 05:02:20', '2025-07-25 05:07:17', '2025-08-13 10:04:37'),
(38, 62, 16, 36000.00, 'rejected', 'Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.', '2025-07-25 05:07:54', '2025-07-25 05:08:33', '2025-08-13 10:04:37'),
(39, 19, 17, 133100.00, 'approved', NULL, '2025-07-25 05:58:47', '2025-07-25 06:10:26', '2025-08-13 10:04:37'),
(40, 62, 16, 263200.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', '2025-07-25 06:04:53', '2025-07-25 06:10:23', '2025-08-13 10:04:37'),
(41, 62, 16, 263200.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', '2025-07-25 06:32:43', '2025-07-25 06:55:40', '2025-08-13 10:04:37'),
(42, 62, 16, 263200.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', '2025-07-25 07:10:25', '2025-07-25 08:57:06', '2025-08-13 10:04:37'),
(43, 73, 18, 1500.00, 'approved', NULL, '2025-07-25 08:54:52', '2025-07-25 09:10:32', '2025-08-13 10:04:37'),
(44, 73, 18, 36000.00, 'rejected', 'Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.', '2025-07-25 09:12:16', '2025-07-25 09:13:24', '2025-08-13 10:04:37'),
(45, 73, 18, 263200.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than 60 points and a refund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', '2025-07-25 23:26:14', '2025-07-25 23:34:31', '2025-08-13 10:04:37'),
(46, 66, 19, 2500.00, 'approved', NULL, '2025-07-26 00:14:59', '2025-07-26 00:40:45', '2025-08-13 10:04:37'),
(47, 66, 19, 2500.00, 'rejected', 'FAILED! Withdrawal failed due to miscellaneous activity', '2025-07-26 00:23:53', '2025-07-26 00:43:40', '2025-08-13 10:04:37'),
(48, 19, 17, 10000.00, 'rejected', 'dsfgsdf', '2025-07-26 00:40:31', '2025-07-26 00:40:41', '2025-08-13 10:04:37'),
(49, 66, 19, 68000.00, 'rejected', 'FAILED! Withdrawal failed due to miscellaneous activity', '2025-07-26 00:44:51', '2025-07-26 00:45:31', '2025-08-13 10:04:37'),
(50, 19, 17, 133100.00, 'approved', NULL, '2025-07-26 07:35:10', '2025-07-26 09:26:31', '2025-08-13 10:04:37'),
(51, 102, 20, 403200.00, 'rejected', 'Dear user, according to Indian tax laws, personal income tax is required to be paid before withdrawal. The tax amount is 30% of the account balance.', '2025-07-26 09:24:08', '2025-07-26 09:26:36', '2025-08-13 10:04:37'),
(52, 73, 18, 543200.00, 'rejected', 'Dear user, your withdrawal amount has exceeded the limit of the ordinary withdrawal channel. Please open the green channel for large withdrawals.', '2025-07-27 05:19:53', '2025-07-27 05:28:48', '2025-08-13 10:04:37'),
(53, 124, 23, 1500.00, 'approved', NULL, '2025-07-27 06:07:15', '2025-07-27 06:33:04', '2025-08-13 10:04:37'),
(54, 124, 23, 1500.00, 'rejected', 'Dear user, your withdrawal amount has exceeded the limit of the ordinary withdrawal channel. Please open the green channel for large withdrawals.', '2025-07-27 06:09:31', '2025-07-27 06:33:12', '2025-08-13 10:04:37'),
(55, 124, 23, 36000.00, 'rejected', 'Dear user, your withdrawal amount has exceeded the limit of the ordinary withdrawal channel. Please open the green channel for large withdrawals.', '2025-07-27 06:36:56', '2025-07-27 06:38:17', '2025-08-13 10:04:37'),
(56, 122, 24, 1500.00, 'approved', NULL, '2025-07-27 23:41:53', '2025-07-28 00:11:15', '2025-08-13 10:04:37'),
(57, 122, 24, 68000.00, 'rejected', 'FAILED! Withdrawal failed due to miscellaneous activity', '2025-07-28 00:21:22', '2025-07-28 00:27:24', '2025-08-13 10:04:37'),
(58, 124, 23, 492900.00, 'rejected', 'WARNING Dear user, due to your multiple errors. The credit score is less than 60 points and are fund cannot be obtained. Please apply again after restoring your reputation score to 80. Thank you!', '2025-07-28 01:02:56', '2025-07-28 01:10:32', '2025-08-13 10:04:37'),
(59, 151, 25, 2000.00, 'approved', NULL, '2025-07-28 06:09:47', '2025-07-28 07:28:07', '2025-08-13 10:04:37'),
(60, 152, 26, 2000.00, 'approved', NULL, '2025-07-28 06:47:21', '2025-07-28 07:29:28', '2025-08-13 10:04:37'),
(61, 19, 17, 133100.00, 'rejected', ' sdf', '2025-07-28 07:08:07', '2025-07-28 07:31:38', '2025-08-13 10:04:37'),
(62, 152, 26, 68000.00, 'rejected', 'FAILED! Withdrawal failed due to miscellaneous activity', '2025-07-28 07:33:41', '2025-07-28 07:33:52', '2025-08-13 10:04:37'),
(63, 151, 25, 68000.00, 'rejected', 'FAILED! Withdrawal failed due to miscellaneous activity', '2025-07-28 07:34:21', '2025-07-28 07:34:35', '2025-08-13 10:04:37'),
(64, 151, 25, 375644.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', '2025-07-29 00:51:22', '2025-07-29 01:07:16', '2025-08-13 10:04:37'),
(65, 142, 28, 2500.00, 'approved', NULL, '2025-07-29 03:31:34', '2025-07-29 03:43:19', '2025-08-13 10:04:37'),
(66, 142, 28, 2500.00, 'rejected', 'FAILED! Withdrawal failed due to miscellaneous activity', '2025-07-29 03:35:13', '2025-07-29 03:43:57', '2025-08-13 10:04:37'),
(67, 124, 23, 492900.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', '2025-07-29 11:10:14', '2025-07-29 23:52:49', '2025-08-13 10:04:37'),
(68, 97, 30, 5000.00, 'rejected', 'Failed!', '2025-07-29 11:37:00', '2025-07-29 23:53:01', '2025-08-13 10:04:37'),
(69, 137, 31, 1000.00, 'rejected', 'Failed!', '2025-07-29 20:40:26', '2025-07-29 23:53:04', '2025-08-13 10:04:37'),
(70, 124, 23, 1500.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', '2025-07-29 22:14:35', '2025-07-29 23:52:45', '2025-08-13 10:04:37'),
(71, 97, 30, 5000.00, 'rejected', 'Failed!', '2025-07-29 23:31:23', '2025-07-29 23:53:08', '2025-08-13 10:04:37'),
(74, 190, 33, 3000.00, 'approved', NULL, '2025-07-30 03:33:29', '2025-07-31 00:32:11', '2025-08-13 10:04:37'),
(75, 190, 33, 3000.00, 'approved', NULL, '2025-07-30 03:36:46', '2025-07-31 00:32:13', '2025-08-13 10:04:37'),
(76, 137, 31, 1000.00, 'approved', NULL, '2025-07-30 06:43:43', '2025-07-31 00:32:07', '2025-08-13 10:04:37'),
(77, 142, 28, 573200.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', '2025-07-30 09:23:26', '2025-07-30 09:26:21', '2025-08-13 10:04:37'),
(78, 196, 36, 3000.00, 'approved', NULL, '2025-07-30 21:01:22', '2025-07-31 00:32:09', '2025-08-13 10:04:37'),
(79, 196, 36, 3000.00, 'approved', NULL, '2025-07-30 21:03:18', '2025-07-31 00:32:04', '2025-08-13 10:04:37'),
(81, 110, 37, 3000.00, 'approved', NULL, '2025-07-31 04:11:39', '2025-07-31 07:48:35', '2025-08-13 10:04:37'),
(82, 215, 39, 263200.00, 'rejected', 'Failed! Contact to customer service ', '2025-07-31 07:35:12', '2025-07-31 07:48:53', '2025-08-13 10:04:37'),
(83, 203, 40, 1500.00, 'approved', NULL, '2025-07-31 08:47:47', '2025-07-31 08:56:59', '2025-08-13 10:04:37'),
(84, 203, 40, 68000.00, 'rejected', 'FAILED! Withdrawal failed due to miscellaneous activity', '2025-07-31 23:35:49', '2025-07-31 23:36:21', '2025-08-13 10:04:37'),
(85, 203, 40, 1500.00, 'rejected', 'FAILED! Withdrawal failed due to miscellaneous activity', '2025-07-31 23:42:35', '2025-07-31 23:44:01', '2025-08-13 10:04:37'),
(86, 235, 42, 1300.00, 'approved', NULL, '2025-08-02 04:04:41', '2025-08-04 00:33:25', '2025-08-13 10:04:37'),
(87, 235, 42, 1300.00, 'approved', NULL, '2025-08-02 05:22:17', '2025-08-04 00:33:23', '2025-08-13 10:04:37'),
(88, 152, 26, 305310.00, 'rejected', '❌❌WARNING❌❌ Dear user, due to your multiple errors. The credit score is less than =60 points and a refund cannot be obtained. Please apply again after restoring your reputation score. Thank you!', '2025-08-02 08:41:59', '2025-08-02 08:43:06', '2025-08-13 10:04:37'),
(89, 245, 43, 1300.00, 'rejected', 'Failed! Contact to teacher and get your withdrawal code.', '2025-08-04 00:32:31', '2025-08-04 00:33:19', '2025-08-13 10:04:37'),
(90, 249, 44, 1500.00, 'approved', NULL, '2025-08-04 02:14:10', '2025-08-04 02:33:20', '2025-08-13 10:04:37'),
(91, 249, 44, 36000.00, 'rejected', 'Dear user, due to the split withdrawal error, the account has entered a risky state. The account withdrawal function is restricted and the funds are temporarily frozen. Please contact the staff for processing.', '2025-08-04 02:31:47', '2025-08-04 02:33:44', '2025-08-13 10:04:37'),
(92, 252, 45, 2000.00, 'approved', NULL, '2025-08-05 01:21:14', '2025-08-05 01:28:43', '2025-08-13 10:04:37'),
(93, 252, 45, 68000.00, 'rejected', 'Wrong entry Your withdraw has been banned due to illegal entry', '2025-08-05 01:32:07', '2025-08-05 01:34:09', '2025-08-13 10:04:37'),
(94, 1, 1, 866343.00, 'pending', NULL, '2025-09-08 10:01:16', NULL, '2025-09-08 10:01:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `betting_orders`
--
ALTER TABLE `betting_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `from_user_id` (`from_user_id`),
  ADD KEY `idx_messages_to_user_id` (`to_user_id`),
  ADD KEY `idx_messages_is_read` (`is_read`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transactions_user_id` (`user_id`),
  ADD KEY `idx_transactions_type` (`type`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_username` (`username`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- Indexes for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank_account_id` (`bank_account_id`),
  ADD KEY `idx_withdrawal_requests_user_id` (`user_id`),
  ADD KEY `idx_withdrawal_requests_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `betting_orders`
--
ALTER TABLE `betting_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=266;

--
-- AUTO_INCREMENT for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD CONSTRAINT `bank_accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `betting_orders`
--
ALTER TABLE `betting_orders`
  ADD CONSTRAINT `betting_orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

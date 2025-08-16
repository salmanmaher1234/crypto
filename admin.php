<?php
session_start();
require_once 'php/config/database.php';

// Check if user is logged in and is admin
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: /?error=Access denied');
    exit;
}

$db = new Database();
$conn = $db->getConnection();

// Get user info
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Get summary stats
$stmt = $conn->prepare("SELECT COUNT(*) as total_users FROM users WHERE role = 'customer'");
$stmt->execute();
$total_users = $stmt->fetch(PDO::FETCH_ASSOC)['total_users'];

$stmt = $conn->prepare("SELECT COUNT(*) as total_orders FROM betting_orders");
$stmt->execute();
$total_orders = $stmt->fetch(PDO::FETCH_ASSOC)['total_orders'];

$stmt = $conn->prepare("SELECT SUM(amount) as total_volume FROM betting_orders WHERE status = 'completed'");
$stmt->execute();
$total_volume = $stmt->fetch(PDO::FETCH_ASSOC)['total_volume'] ?? 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - SuperCoin</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-semibold text-gray-900">SuperCoin Admin</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-gray-700">Welcome, <?php echo htmlspecialchars($user['name']); ?></span>
                    <a href="?logout=1" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm">
                        Logout
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Dashboard Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                <span class="text-white text-sm font-bold">U</span>
                            </div>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                <dd class="text-lg font-medium text-gray-900"><?php echo number_format($total_users); ?></dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                <span class="text-white text-sm font-bold">O</span>
                            </div>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                                <dd class="text-lg font-medium text-gray-900"><?php echo number_format($total_orders); ?></dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                <span class="text-white text-sm font-bold">$</span>
                            </div>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Trading Volume</dt>
                                <dd class="text-lg font-medium text-gray-900"><?php echo number_format($total_volume, 2); ?></dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Admin Sections -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Member Management -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Member Management</h3>
                    <div class="space-y-3">
                        <a href="admin/members.php" class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md">
                            View All Members
                        </a>
                        <a href="admin/add-member.php" class="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md">
                            Add New Member
                        </a>
                    </div>
                </div>
            </div>

            <!-- Betting Orders -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Betting Orders</h3>
                    <div class="space-y-3">
                        <a href="admin/orders.php" class="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-md">
                            View All Orders
                        </a>
                        <a href="admin/active-orders.php" class="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-4 rounded-md">
                            Active Orders
                        </a>
                    </div>
                </div>
            </div>

            <!-- Wallet Management -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Wallet Management</h3>
                    <div class="space-y-3">
                        <a href="admin/transactions.php" class="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-md">
                            View Transactions
                        </a>
                        <a href="admin/withdrawals.php" class="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-2 px-4 rounded-md">
                            Withdrawal Requests
                        </a>
                    </div>
                </div>
            </div>

            <!-- System Management -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">System Management</h3>
                    <div class="space-y-3">
                        <a href="admin/announcements.php" class="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center py-2 px-4 rounded-md">
                            Announcements
                        </a>
                        <a href="admin/reports.php" class="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-md">
                            Reports
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
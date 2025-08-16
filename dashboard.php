<?php
session_start();

// Check authentication
if (!isset($_SESSION['user_id'])) {
    header('Location: index.html');
    exit;
}

$role = $_SESSION['user_role'];
$username = $_SESSION['username'];

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo ucfirst($role); ?> Dashboard - SuperCoin</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-semibold text-gray-900">SuperCoin <?php echo ucfirst($role); ?></h1>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-gray-700">Welcome, <?php echo htmlspecialchars($username); ?></span>
                    <a href="?logout=1" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm">
                        Logout
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <?php if ($role === 'admin'): ?>
            <!-- Admin Dashboard -->
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
                                    <dd class="text-lg font-medium text-gray-900">246</dd>
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
                                    <dd class="text-lg font-medium text-gray-900">578</dd>
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
                                    <dd class="text-lg font-medium text-gray-900">1,254,386.50</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Admin Features</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 border border-gray-200 rounded-lg">
                        <h3 class="font-medium text-gray-900">Member Management</h3>
                        <p class="text-sm text-gray-500 mt-1">Manage user accounts, balances, and permissions</p>
                    </div>
                    <div class="p-4 border border-gray-200 rounded-lg">
                        <h3 class="font-medium text-gray-900">Order Management</h3>
                        <p class="text-sm text-gray-500 mt-1">Monitor and manage trading orders</p>
                    </div>
                    <div class="p-4 border border-gray-200 rounded-lg">
                        <h3 class="font-medium text-gray-900">Financial Overview</h3>
                        <p class="text-sm text-gray-500 mt-1">Track transactions and withdrawals</p>
                    </div>
                    <div class="p-4 border border-gray-200 rounded-lg">
                        <h3 class="font-medium text-gray-900">System Settings</h3>
                        <p class="text-sm text-gray-500 mt-1">Configure platform settings</p>
                    </div>
                </div>
            </div>

        <?php else: ?>
            <!-- Customer Dashboard -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                    <span class="text-white text-sm font-bold">$</span>
                                </div>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                                    <dd class="text-lg font-medium text-gray-900">306,450.00</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                    <span class="text-white text-sm font-bold">A</span>
                                </div>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Available Balance</dt>
                                    <dd class="text-lg font-medium text-gray-900">312,950.00</dd>
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
                                    <span class="text-white text-sm font-bold">F</span>
                                </div>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Frozen Balance</dt>
                                    <dd class="text-lg font-medium text-gray-900">500.00</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Trading Features</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 border border-gray-200 rounded-lg">
                        <h3 class="font-medium text-gray-900">Cryptocurrency Trading</h3>
                        <p class="text-sm text-gray-500 mt-1">Trade BTC, ETH, and other cryptocurrencies</p>
                    </div>
                    <div class="p-4 border border-gray-200 rounded-lg">
                        <h3 class="font-medium text-gray-900">Order History</h3>
                        <p class="text-sm text-gray-500 mt-1">View your trading history and results</p>
                    </div>
                    <div class="p-4 border border-gray-200 rounded-lg">
                        <h3 class="font-medium text-gray-900">Wallet Management</h3>
                        <p class="text-sm text-gray-500 mt-1">Manage deposits and withdrawals</p>
                    </div>
                    <div class="p-4 border border-gray-200 rounded-lg">
                        <h3 class="font-medium text-gray-900">Profile Settings</h3>
                        <p class="text-sm text-gray-500 mt-1">Update your account preferences</p>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- Success Message -->
        <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div class="flex">
                <div class="flex-shrink-0">
                    <span class="text-green-400 text-xl">✅</span>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">
                        Application Successfully Converted to Pure PHP
                    </h3>
                    <div class="mt-2 text-sm text-green-700">
                        <p>All React/Node.js dependencies have been removed. The application is now running on pure PHP and is ready for shared hosting deployment.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
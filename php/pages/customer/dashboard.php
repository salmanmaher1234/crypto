<?php
require_once 'includes/session.php';
$user = getCurrentUser();
?>

<div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-gray-900">C BOE Dashboard</h1>
                <div class="flex items-center space-x-4">
                    <span class="text-gray-600">Welcome, <?php echo htmlspecialchars($user['name']); ?></span>
                    <a href="/php/api/auth/logout" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Balance Section -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-900">Total Balance</h3>
                <p class="text-3xl font-bold text-blue-600">₹<?php echo number_format($user['balance'], 2); ?></p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-900">Available Balance</h3>
                <p class="text-3xl font-bold text-green-600">₹<?php echo number_format($user['available_balance'], 2); ?></p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-900">Frozen Balance</h3>
                <p class="text-3xl font-bold text-red-600">₹<?php echo number_format($user['frozen_balance'], 2); ?></p>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <a href="?page=trading" class="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700">
                <div class="text-2xl mb-2">📈</div>
                <div class="font-semibold">Trade SUP</div>
            </a>
            <a href="?page=profile" class="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700">
                <div class="text-2xl mb-2">🏦</div>
                <div class="font-semibold">Bank Accounts</div>
            </a>
            <a href="?page=transactions" class="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700">
                <div class="text-2xl mb-2">💳</div>
                <div class="font-semibold">Transactions</div>
            </a>
            <a href="?page=orders" class="bg-orange-600 text-white p-4 rounded-lg text-center hover:bg-orange-700">
                <div class="text-2xl mb-2">📋</div>
                <div class="font-semibold">My Orders</div>
            </a>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b">
                <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div class="p-6">
                <div id="recentActivity">
                    <p class="text-gray-500">Loading recent activity...</p>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Load recent activity
async function loadRecentActivity() {
    try {
        const response = await fetch('/php/api/betting-orders');
        const orders = await response.json();
        
        const container = document.getElementById('recentActivity');
        
        if (orders.length === 0) {
            container.innerHTML = '<p class="text-gray-500">No recent activity</p>';
            return;
        }
        
        container.innerHTML = orders.slice(0, 5).map(order => `
            <div class="flex justify-between items-center py-3 border-b last:border-b-0">
                <div>
                    <div class="font-medium">${order.asset} - ${order.direction}</div>
                    <div class="text-sm text-gray-500">₹${order.amount} - ${order.status}</div>
                </div>
                <div class="text-right">
                    <div class="font-medium ${order.result === 'win' ? 'text-green-600' : order.result === 'loss' ? 'text-red-600' : 'text-gray-600'}">
                        ${order.result ? (order.result === 'win' ? '+' : '') + '₹' + order.profit : 'Pending'}
                    </div>
                    <div class="text-xs text-gray-500">${new Date(order.created_at).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        document.getElementById('recentActivity').innerHTML = '<p class="text-red-500">Error loading activity</p>';
    }
}

// Load activity on page load
loadRecentActivity();
</script>
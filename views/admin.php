<?php
requireAdmin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SuperCoin - Admin Dashboard</title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">
            <h2>SuperCoin Admin</h2>
        </div>
        <ul class="nav-menu">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/trading">Trading</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/admin" class="active">Admin</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="admin-header">
            <h1>Admin Dashboard</h1>
            <p>Manage users, orders, and platform operations</p>
        </div>

        <div class="admin-nav">
            <a href="/admin/members" class="admin-nav-item">
                <h3>Member Management</h3>
                <p>Manage user accounts and settings</p>
            </a>
            <a href="/admin/orders" class="admin-nav-item">
                <h3>Trading Orders</h3>
                <p>Monitor and manage betting orders</p>
            </a>
            <a href="/admin/transactions" class="admin-nav-item">
                <h3>Transactions</h3>
                <p>Handle recharges and withdrawals</p>
            </a>
        </div>

        <div class="admin-stats">
            <div class="stat-card">
                <h3>Total Users</h3>
                <p class="stat-number" id="totalUsers">Loading...</p>
            </div>
            <div class="stat-card">
                <h3>Active Orders</h3>
                <p class="stat-number" id="activeOrders">Loading...</p>
            </div>
            <div class="stat-card">
                <h3>Pending Transactions</h3>
                <p class="stat-number" id="pendingTransactions">Loading...</p>
            </div>
            <div class="stat-card">
                <h3>Total Volume</h3>
                <p class="stat-number" id="totalVolume">Loading...</p>
            </div>
        </div>

        <div class="admin-section">
            <h2>Recent Activities</h2>
            <div class="activity-list" id="recentActivities">
                Loading activities...
            </div>
        </div>
    </div>

    <script src="/assets/app.js"></script>
    <script>
        async function loadAdminStats() {
            try {
                // Load user count
                const usersResponse = await fetch('/api/users');
                const usersData = await usersResponse.json();
                if (usersResponse.ok) {
                    document.getElementById('totalUsers').textContent = usersData.users.length;
                }

                // Load orders count
                const ordersResponse = await fetch('/api/betting-orders');
                const ordersData = await ordersResponse.json();
                if (ordersResponse.ok) {
                    const activeOrders = ordersData.orders.filter(order => order.status === 'Open').length;
                    document.getElementById('activeOrders').textContent = activeOrders;
                }

                // Load transactions count
                const transResponse = await fetch('/api/transactions');
                const transData = await transResponse.json();
                if (transResponse.ok) {
                    const pendingTrans = transData.transactions.filter(trans => trans.status === 'Pending').length;
                    document.getElementById('pendingTransactions').textContent = pendingTrans;
                    
                    const totalVolume = transData.transactions.reduce((sum, trans) => sum + Math.abs(trans.amount), 0);
                    document.getElementById('totalVolume').textContent = formatCurrency(totalVolume);
                }
            } catch (error) {
                console.error('Error loading admin stats:', error);
            }
        }

        async function loadRecentActivities() {
            try {
                // Combine recent orders and transactions
                const [ordersResponse, transResponse] = await Promise.all([
                    fetch('/api/betting-orders?limit=5'),
                    fetch('/api/transactions?limit=5')
                ]);

                const [ordersData, transData] = await Promise.all([
                    ordersResponse.json(),
                    transResponse.json()
                ]);

                const activities = [];
                
                if (ordersResponse.ok) {
                    ordersData.orders.forEach(order => {
                        activities.push({
                            type: 'order',
                            description: `${order.username} placed ${order.direction} order for ${order.crypto_symbol}`,
                            amount: order.amount,
                            time: order.created_at
                        });
                    });
                }

                if (transResponse.ok) {
                    transData.transactions.forEach(trans => {
                        activities.push({
                            type: 'transaction',
                            description: `${trans.username} ${trans.type} transaction`,
                            amount: trans.amount,
                            time: trans.created_at
                        });
                    });
                }

                // Sort by time and display
                activities.sort((a, b) => new Date(b.time) - new Date(a.time));
                displayRecentActivities(activities.slice(0, 10));

            } catch (error) {
                console.error('Error loading activities:', error);
                document.getElementById('recentActivities').innerHTML = 'Error loading activities';
            }
        }

        function displayRecentActivities(activities) {
            const container = document.getElementById('recentActivities');
            
            if (activities.length === 0) {
                container.innerHTML = '<p>No recent activities</p>';
                return;
            }
            
            container.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-amount">${formatCurrency(Math.abs(activity.amount))}</div>
                    <div class="activity-time">${formatDate(activity.time)}</div>
                </div>
            `).join('');
        }

        // Load admin data on page load
        loadAdminStats();
        loadRecentActivities();
        
        // Refresh data every 30 seconds
        setInterval(() => {
            loadAdminStats();
            loadRecentActivities();
        }, 30000);
    </script>
</body>
</html>
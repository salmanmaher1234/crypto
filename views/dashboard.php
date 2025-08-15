<?php
requireAuth();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SuperCoin - Dashboard</title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">
            <h2>SuperCoin</h2>
        </div>
        <ul class="nav-menu">
            <li><a href="/dashboard" class="active">Dashboard</a></li>
            <li><a href="/trading">Trading</a></li>
            <li><a href="/profile">Profile</a></li>
            <?php if ($_SESSION['user_role'] === 'admin'): ?>
            <li><a href="/admin">Admin</a></li>
            <?php endif; ?>
            <li><a href="#" onclick="logout()">Logout</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="dashboard-header">
            <h1>Welcome, <span id="userName"><?php echo htmlspecialchars($_SESSION['user_name']); ?></span></h1>
            <p>Your cryptocurrency investment dashboard</p>
        </div>

        <div class="dashboard-cards">
            <div class="card balance-card">
                <h3>Available Balance</h3>
                <p class="balance-amount" id="availableBalance">Loading...</p>
            </div>
            
            <div class="card balance-card">
                <h3>Total Balance</h3>
                <p class="balance-amount" id="totalBalance">Loading...</p>
            </div>
            
            <div class="card balance-card">
                <h3>Frozen Balance</h3>
                <p class="balance-amount" id="frozenBalance">Loading...</p>
            </div>
            
            <div class="card">
                <h3>Reputation Score</h3>
                <p class="reputation-score" id="reputationScore">Loading...</p>
            </div>
        </div>

        <div class="dashboard-section">
            <h2>Recent Trading Orders</h2>
            <div class="orders-table">
                <table id="recentOrders">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colspan="5">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="dashboard-section">
            <h2>Quick Actions</h2>
            <div class="quick-actions">
                <a href="/trading" class="btn btn-primary">Start Trading</a>
                <a href="/profile" class="btn btn-secondary">View Profile</a>
                <button onclick="showRechargeModal()" class="btn btn-success">Recharge Account</button>
            </div>
        </div>
    </div>

    <!-- Recharge Modal -->
    <div id="rechargeModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="hideRechargeModal()">&times;</span>
            <h2>Recharge Account</h2>
            <p>Contact admin to recharge your account with the desired amount.</p>
            <div class="form-group">
                <label>Requested Amount:</label>
                <input type="number" id="rechargeAmount" placeholder="Enter amount">
            </div>
            <button onclick="requestRecharge()" class="btn btn-primary">Request Recharge</button>
        </div>
    </div>

    <script src="/assets/app.js"></script>
    <script>
        // Load user data and recent orders
        async function loadDashboardData() {
            try {
                // Load user data
                const userResponse = await fetch('/api/auth/me');
                const userData = await userResponse.json();
                
                if (userResponse.ok) {
                    document.getElementById('availableBalance').textContent = formatCurrency(userData.user.available_balance);
                    document.getElementById('totalBalance').textContent = formatCurrency(userData.user.balance);
                    document.getElementById('frozenBalance').textContent = formatCurrency(userData.user.frozen_balance);
                    document.getElementById('reputationScore').textContent = userData.user.reputation;
                }

                // Load recent orders
                const ordersResponse = await fetch('/api/betting-orders?limit=5');
                const ordersData = await ordersResponse.json();
                
                if (ordersResponse.ok) {
                    displayRecentOrders(ordersData.orders);
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        }

        function displayRecentOrders(orders) {
            const tbody = document.querySelector('#recentOrders tbody');
            tbody.innerHTML = '';
            
            if (orders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">No recent orders</td></tr>';
                return;
            }
            
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.crypto_symbol}</td>
                    <td>${order.direction}</td>
                    <td>${formatCurrency(order.amount)}</td>
                    <td><span class="status-${order.status.toLowerCase()}">${order.status}</span></td>
                    <td>${formatDate(order.created_at)}</td>
                `;
                tbody.appendChild(row);
            });
        }

        function showRechargeModal() {
            document.getElementById('rechargeModal').style.display = 'block';
        }

        function hideRechargeModal() {
            document.getElementById('rechargeModal').style.display = 'none';
        }

        async function requestRecharge() {
            const amount = document.getElementById('rechargeAmount').value;
            if (!amount || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }

            try {
                const response = await fetch('/api/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'recharge',
                        amount: parseFloat(amount),
                        description: 'Recharge request'
                    })
                });

                if (response.ok) {
                    alert('Recharge request submitted. Admin will process it shortly.');
                    hideRechargeModal();
                    document.getElementById('rechargeAmount').value = '';
                } else {
                    alert('Error submitting recharge request');
                }
            } catch (error) {
                alert('Connection error. Please try again.');
            }
        }

        // Load dashboard data on page load
        loadDashboardData();
        
        // Refresh data every 30 seconds
        setInterval(loadDashboardData, 30000);
    </script>
</body>
</html>
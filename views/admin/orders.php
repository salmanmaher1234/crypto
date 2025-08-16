<?php
requireAdmin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SuperCoin - Order Management</title>
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
            <li><a href="/admin">Admin</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="admin-header">
            <h1>Order Management</h1>
            <div class="admin-breadcrumb">
                <a href="/admin">Admin</a> > Order Management
            </div>
        </div>

        <div class="admin-controls">
            <div class="filter-controls">
                <select id="statusFilter" onchange="filterOrders()">
                    <option value="">All Status</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                </select>
                <select id="symbolFilter" onchange="filterOrders()">
                    <option value="">All Symbols</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="ethereum">Ethereum</option>
                    <option value="binancecoin">Binance Coin</option>
                    <option value="cardano">Cardano</option>
                    <option value="solana">Solana</option>
                </select>
                <input type="text" id="userFilter" placeholder="Filter by user..." onkeyup="filterOrders()">
            </div>
            <button onclick="loadOrders()" class="btn btn-secondary">Refresh</button>
        </div>

        <div class="orders-table">
            <table id="ordersTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Symbol</th>
                        <th>Direction</th>
                        <th>Amount</th>
                        <th>Duration</th>
                        <th>Entry Price</th>
                        <th>Close Price</th>
                        <th>Profit/Loss</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td colspan="12">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Order Details Modal -->
    <div id="orderModal" class="modal">
        <div class="modal-content large">
            <span class="close" onclick="hideOrderModal()">&times;</span>
            <h2>Order Details</h2>
            <div id="orderDetails">
                Loading...
            </div>
            <div class="modal-actions">
                <button onclick="forceCloseOrder()" class="btn btn-danger">Force Close</button>
                <button onclick="hideOrderModal()" class="btn btn-secondary">Close</button>
            </div>
        </div>
    </div>

    <script src="/assets/app.js"></script>
    <script>
        let allOrders = [];
        let currentOrderId = null;

        async function loadOrders() {
            try {
                const response = await fetch('/api/betting-orders');
                const data = await response.json();
                
                if (response.ok) {
                    allOrders = data.orders;
                    displayOrders(allOrders);
                }
            } catch (error) {
                console.error('Error loading orders:', error);
            }
        }

        function displayOrders(orders) {
            const tbody = document.querySelector('#ordersTable tbody');
            tbody.innerHTML = '';
            
            if (orders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="12">No orders found</td></tr>';
                return;
            }
            
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.username}</td>
                    <td>${order.crypto_symbol.toUpperCase()}</td>
                    <td>${order.direction}</td>
                    <td>${formatCurrency(order.amount)}</td>
                    <td>${order.duration} min</td>
                    <td>${order.entry_price ? formatCurrency(order.entry_price) : '-'}</td>
                    <td>${order.close_price ? formatCurrency(order.close_price) : '-'}</td>
                    <td class="${order.profit_loss >= 0 ? 'positive' : 'negative'}">
                        ${order.profit_loss ? formatCurrency(order.profit_loss) : '-'}
                    </td>
                    <td><span class="status-${order.status.toLowerCase()}">${order.status}</span></td>
                    <td>${formatDate(order.created_at)}</td>
                    <td class="actions">
                        <button onclick="viewOrder(${order.id})" class="btn-small">View</button>
                        ${order.status === 'Open' ? `<button onclick="forceCloseOrderDirect(${order.id})" class="btn-small btn-danger">Force Close</button>` : ''}
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        function filterOrders() {
            const statusFilter = document.getElementById('statusFilter').value;
            const symbolFilter = document.getElementById('symbolFilter').value;
            const userFilter = document.getElementById('userFilter').value.toLowerCase();

            const filteredOrders = allOrders.filter(order => {
                const statusMatch = !statusFilter || order.status === statusFilter;
                const symbolMatch = !symbolFilter || order.crypto_symbol === symbolFilter;
                const userMatch = !userFilter || order.username.toLowerCase().includes(userFilter);
                
                return statusMatch && symbolMatch && userMatch;
            });

            displayOrders(filteredOrders);
        }

        function viewOrder(orderId) {
            const order = allOrders.find(o => o.id === orderId);
            if (!order) return;

            currentOrderId = orderId;
            
            const detailsHtml = `
                <div class="order-detail-grid">
                    <div class="detail-item">
                        <label>Order ID:</label>
                        <span>${order.id}</span>
                    </div>
                    <div class="detail-item">
                        <label>User:</label>
                        <span>${order.username}</span>
                    </div>
                    <div class="detail-item">
                        <label>Cryptocurrency:</label>
                        <span>${order.crypto_symbol.toUpperCase()}</span>
                    </div>
                    <div class="detail-item">
                        <label>Direction:</label>
                        <span>${order.direction}</span>
                    </div>
                    <div class="detail-item">
                        <label>Amount:</label>
                        <span>${formatCurrency(order.amount)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Duration:</label>
                        <span>${order.duration} minutes</span>
                    </div>
                    <div class="detail-item">
                        <label>Entry Price:</label>
                        <span>${order.entry_price ? formatCurrency(order.entry_price) : 'Not set'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Close Price:</label>
                        <span>${order.close_price ? formatCurrency(order.close_price) : 'Not set'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Profit/Loss:</label>
                        <span class="${order.profit_loss >= 0 ? 'positive' : 'negative'}">
                            ${order.profit_loss ? formatCurrency(order.profit_loss) : '-'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>Status:</label>
                        <span class="status-${order.status.toLowerCase()}">${order.status}</span>
                    </div>
                    <div class="detail-item">
                        <label>Created:</label>
                        <span>${formatDate(order.created_at)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Closed:</label>
                        <span>${order.closed_at ? formatDate(order.closed_at) : 'Not closed'}</span>
                    </div>
                </div>
            `;
            
            document.getElementById('orderDetails').innerHTML = detailsHtml;
            document.getElementById('orderModal').style.display = 'block';
        }

        function hideOrderModal() {
            document.getElementById('orderModal').style.display = 'none';
            currentOrderId = null;
        }

        async function forceCloseOrder() {
            if (!currentOrderId) return;
            await forceCloseOrderDirect(currentOrderId);
        }

        async function forceCloseOrderDirect(orderId) {
            if (!confirm('Are you sure you want to force close this order?')) return;

            try {
                // Get current crypto price for closing
                const order = allOrders.find(o => o.id === orderId);
                const pricesResponse = await fetch('/api/crypto/prices');
                const pricesData = await pricesResponse.json();
                
                if (!pricesResponse.ok || !pricesData.prices[order.crypto_symbol]) {
                    alert('Error getting current price');
                    return;
                }

                const closePrice = pricesData.prices[order.crypto_symbol].current_price;
                
                const response = await fetch(`/api/betting-orders/${orderId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: 'Closed',
                        close_price: closePrice,
                        force_close: true
                    })
                });

                if (response.ok) {
                    alert('Order force closed successfully!');
                    hideOrderModal();
                    loadOrders();
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Connection error. Please try again.');
            }
        }

        // Load orders on page load
        loadOrders();
        
        // Refresh orders every 15 seconds
        setInterval(loadOrders, 15000);
    </script>
</body>
</html>
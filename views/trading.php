<?php
requireAuth();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SuperCoin - Trading</title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">
            <h2>SuperCoin</h2>
        </div>
        <ul class="nav-menu">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/trading" class="active">Trading</a></li>
            <li><a href="/profile">Profile</a></li>
            <?php if ($_SESSION['user_role'] === 'admin'): ?>
            <li><a href="/admin">Admin</a></li>
            <?php endif; ?>
            <li><a href="#" onclick="logout()">Logout</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="trading-header">
            <h1>Cryptocurrency Trading</h1>
            <div class="balance-info">
                <span>Available Balance: <strong id="availableBalance">Loading...</strong></span>
            </div>
        </div>

        <div class="trading-grid">
            <div class="crypto-prices">
                <h2>Live Crypto Prices</h2>
                <div id="cryptoPrices" class="price-list">
                    Loading prices...
                </div>
                <button onclick="refreshPrices()" class="btn btn-secondary">Refresh Prices</button>
            </div>

            <div class="trading-form">
                <h2>Place Order</h2>
                <form id="tradingForm">
                    <div class="form-group">
                        <label for="crypto_symbol">Cryptocurrency</label>
                        <select id="crypto_symbol" name="crypto_symbol" required>
                            <option value="">Select Cryptocurrency</option>
                            <option value="bitcoin">Bitcoin (BTC)</option>
                            <option value="ethereum">Ethereum (ETH)</option>
                            <option value="binancecoin">Binance Coin (BNB)</option>
                            <option value="cardano">Cardano (ADA)</option>
                            <option value="solana">Solana (SOL)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="direction">Direction</label>
                        <div class="direction-buttons">
                            <button type="button" class="btn-direction" onclick="selectDirection('Buy Up')" id="buyUpBtn">
                                Buy Up
                            </button>
                            <button type="button" class="btn-direction" onclick="selectDirection('Buy Down')" id="buyDownBtn">
                                Buy Down
                            </button>
                        </div>
                        <input type="hidden" id="direction" name="direction" required>
                    </div>

                    <div class="form-group">
                        <label for="amount">Investment Amount</label>
                        <input type="number" id="amount" name="amount" min="1" step="0.01" required>
                    </div>

                    <div class="form-group">
                        <label for="duration">Duration (Minutes)</label>
                        <select id="duration" name="duration" required>
                            <option value="1">1 Minute (20% rate)</option>
                            <option value="3">3 Minutes (30% rate)</option>
                            <option value="5">5 Minutes (40% rate)</option>
                            <option value="10">10 Minutes (50% rate)</option>
                            <option value="15">15 Minutes (60% rate)</option>
                        </select>
                    </div>

                    <div class="potential-profit">
                        <p>Potential Profit: <span id="potentialProfit">0.00</span></p>
                    </div>

                    <button type="submit" class="btn-primary">Place Order</button>
                </form>
            </div>
        </div>

        <div class="trading-orders">
            <h2>Your Trading Orders</h2>
            <div class="orders-table">
                <table id="tradingOrders">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Direction</th>
                            <th>Amount</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Entry Price</th>
                            <th>Close Price</th>
                            <th>Profit/Loss</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colspan="9">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="/assets/app.js"></script>
    <script>
        let cryptoPrices = {};
        let selectedDirection = '';

        function selectDirection(direction) {
            selectedDirection = direction;
            document.getElementById('direction').value = direction;
            
            // Update button styles
            const buyUpBtn = document.getElementById('buyUpBtn');
            const buyDownBtn = document.getElementById('buyDownBtn');
            
            buyUpBtn.classList.remove('active');
            buyDownBtn.classList.remove('active');
            
            if (direction === 'Buy Up') {
                buyUpBtn.classList.add('active');
            } else {
                buyDownBtn.classList.add('active');
            }
            
            calculatePotentialProfit();
        }

        function calculatePotentialProfit() {
            const amount = parseFloat(document.getElementById('amount').value) || 0;
            const duration = parseInt(document.getElementById('duration').value) || 1;
            
            const rates = { 1: 0.20, 3: 0.30, 5: 0.40, 10: 0.50, 15: 0.60 };
            const rate = rates[duration] || 0.20;
            const profit = amount * rate;
            
            document.getElementById('potentialProfit').textContent = formatCurrency(profit);
        }

        async function loadCryptoPrices() {
            try {
                const response = await fetch('/api/crypto/prices');
                const data = await response.json();
                
                if (response.ok) {
                    cryptoPrices = data.prices;
                    displayCryptoPrices(data.prices);
                }
            } catch (error) {
                console.error('Error loading crypto prices:', error);
                document.getElementById('cryptoPrices').innerHTML = 'Error loading prices';
            }
        }

        function displayCryptoPrices(prices) {
            const container = document.getElementById('cryptoPrices');
            container.innerHTML = '';
            
            Object.entries(prices).forEach(([symbol, data]) => {
                const priceItem = document.createElement('div');
                priceItem.className = 'price-item';
                priceItem.innerHTML = `
                    <div class="crypto-name">${data.name} (${data.symbol.toUpperCase()})</div>
                    <div class="crypto-price">${formatCurrency(data.current_price)}</div>
                    <div class="crypto-change ${data.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                        ${data.price_change_percentage_24h >= 0 ? '+' : ''}${data.price_change_percentage_24h.toFixed(2)}%
                    </div>
                `;
                container.appendChild(priceItem);
            });
        }

        async function loadTradingOrders() {
            try {
                const response = await fetch('/api/betting-orders');
                const data = await response.json();
                
                if (response.ok) {
                    displayTradingOrders(data.orders);
                }
            } catch (error) {
                console.error('Error loading orders:', error);
            }
        }

        function displayTradingOrders(orders) {
            const tbody = document.querySelector('#tradingOrders tbody');
            tbody.innerHTML = '';
            
            if (orders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9">No orders found</td></tr>';
                return;
            }
            
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.crypto_symbol.toUpperCase()}</td>
                    <td>${order.direction}</td>
                    <td>${formatCurrency(order.amount)}</td>
                    <td>${order.duration} min</td>
                    <td><span class="status-${order.status.toLowerCase()}">${order.status}</span></td>
                    <td>${order.entry_price ? formatCurrency(order.entry_price) : '-'}</td>
                    <td>${order.close_price ? formatCurrency(order.close_price) : '-'}</td>
                    <td class="${order.profit_loss >= 0 ? 'positive' : 'negative'}">${order.profit_loss ? formatCurrency(order.profit_loss) : '-'}</td>
                    <td>${formatDate(order.created_at)}</td>
                `;
                tbody.appendChild(row);
            });
        }

        async function loadUserBalance() {
            try {
                const response = await fetch('/api/auth/me');
                const data = await response.json();
                
                if (response.ok) {
                    document.getElementById('availableBalance').textContent = formatCurrency(data.user.available_balance);
                }
            } catch (error) {
                console.error('Error loading balance:', error);
            }
        }

        function refreshPrices() {
            loadCryptoPrices();
        }

        // Trading form submission
        document.getElementById('tradingForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                crypto_symbol: document.getElementById('crypto_symbol').value,
                direction: document.getElementById('direction').value,
                amount: parseFloat(document.getElementById('amount').value),
                duration: parseInt(document.getElementById('duration').value)
            };

            try {
                const response = await fetch('/api/betting-orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    alert('Order placed successfully!');
                    document.getElementById('tradingForm').reset();
                    selectedDirection = '';
                    document.querySelectorAll('.btn-direction').forEach(btn => btn.classList.remove('active'));
                    loadTradingOrders();
                    loadUserBalance();
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Connection error. Please try again.');
            }
        });

        // Calculate profit when amount or duration changes
        document.getElementById('amount').addEventListener('input', calculatePotentialProfit);
        document.getElementById('duration').addEventListener('change', calculatePotentialProfit);

        // Load initial data
        loadCryptoPrices();
        loadTradingOrders();
        loadUserBalance();
        
        // Auto-refresh prices every 30 seconds
        setInterval(loadCryptoPrices, 30000);
        
        // Auto-refresh orders every 10 seconds
        setInterval(loadTradingOrders, 10000);
    </script>
</body>
</html>
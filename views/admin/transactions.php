<?php
requireAdmin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SuperCoin - Transaction Management</title>
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
            <h1>Transaction Management</h1>
            <div class="admin-breadcrumb">
                <a href="/admin">Admin</a> > Transaction Management
            </div>
        </div>

        <div class="admin-controls">
            <div class="filter-controls">
                <select id="typeFilter" onchange="filterTransactions()">
                    <option value="">All Types</option>
                    <option value="recharge">Recharge</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="betting">Betting</option>
                    <option value="commission">Commission</option>
                </select>
                <select id="statusFilter" onchange="filterTransactions()">
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                </select>
                <input type="text" id="userFilter" placeholder="Filter by user..." onkeyup="filterTransactions()">
            </div>
            <button onclick="loadTransactions()" class="btn btn-secondary">Refresh</button>
        </div>

        <div class="transactions-table">
            <table id="transactionsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td colspan="8">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Transaction Details Modal -->
    <div id="transactionModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="hideTransactionModal()">&times;</span>
            <h2>Transaction Details</h2>
            <div id="transactionDetails">
                Loading...
            </div>
            <div class="modal-actions">
                <button onclick="approveTransaction()" class="btn btn-success">Approve</button>
                <button onclick="rejectTransaction()" class="btn btn-danger">Reject</button>
                <button onclick="hideTransactionModal()" class="btn btn-secondary">Close</button>
            </div>
        </div>
    </div>

    <!-- Manual Recharge Modal -->
    <div id="rechargeModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="hideRechargeModal()">&times;</span>
            <h2>Manual Recharge</h2>
            <form id="rechargeForm">
                <div class="form-group">
                    <label for="rechargeUserId">User ID</label>
                    <input type="number" id="rechargeUserId" name="user_id" required>
                </div>
                <div class="form-group">
                    <label for="rechargeAmount">Amount</label>
                    <input type="number" id="rechargeAmount" name="amount" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="rechargeDescription">Description</label>
                    <textarea id="rechargeDescription" name="description" rows="3"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Process Recharge</button>
            </form>
        </div>
    </div>

    <script src="/assets/app.js"></script>
    <script>
        let allTransactions = [];
        let currentTransactionId = null;

        async function loadTransactions() {
            try {
                const response = await fetch('/api/transactions');
                const data = await response.json();
                
                if (response.ok) {
                    allTransactions = data.transactions;
                    displayTransactions(allTransactions);
                }
            } catch (error) {
                console.error('Error loading transactions:', error);
            }
        }

        function displayTransactions(transactions) {
            const tbody = document.querySelector('#transactionsTable tbody');
            tbody.innerHTML = '';
            
            if (transactions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8">No transactions found</td></tr>';
                return;
            }
            
            transactions.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${transaction.id}</td>
                    <td>${transaction.username}</td>
                    <td>${transaction.type}</td>
                    <td class="${transaction.amount >= 0 ? 'positive' : 'negative'}">
                        ${formatCurrency(Math.abs(transaction.amount))}
                    </td>
                    <td><span class="status-${transaction.status.toLowerCase()}">${transaction.status}</span></td>
                    <td>${transaction.description || '-'}</td>
                    <td>${formatDate(transaction.created_at)}</td>
                    <td class="actions">
                        <button onclick="viewTransaction(${transaction.id})" class="btn-small">View</button>
                        ${transaction.status === 'Pending' ? `
                            <button onclick="quickApprove(${transaction.id})" class="btn-small btn-success">Approve</button>
                            <button onclick="quickReject(${transaction.id})" class="btn-small btn-danger">Reject</button>
                        ` : ''}
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        function filterTransactions() {
            const typeFilter = document.getElementById('typeFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;
            const userFilter = document.getElementById('userFilter').value.toLowerCase();

            const filteredTransactions = allTransactions.filter(transaction => {
                const typeMatch = !typeFilter || transaction.type === typeFilter;
                const statusMatch = !statusFilter || transaction.status === statusFilter;
                const userMatch = !userFilter || transaction.username.toLowerCase().includes(userFilter);
                
                return typeMatch && statusMatch && userMatch;
            });

            displayTransactions(filteredTransactions);
        }

        function viewTransaction(transactionId) {
            const transaction = allTransactions.find(t => t.id === transactionId);
            if (!transaction) return;

            currentTransactionId = transactionId;
            
            const detailsHtml = `
                <div class="transaction-detail-grid">
                    <div class="detail-item">
                        <label>Transaction ID:</label>
                        <span>${transaction.id}</span>
                    </div>
                    <div class="detail-item">
                        <label>User:</label>
                        <span>${transaction.username}</span>
                    </div>
                    <div class="detail-item">
                        <label>Type:</label>
                        <span>${transaction.type}</span>
                    </div>
                    <div class="detail-item">
                        <label>Amount:</label>
                        <span class="${transaction.amount >= 0 ? 'positive' : 'negative'}">
                            ${formatCurrency(Math.abs(transaction.amount))}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>Status:</label>
                        <span class="status-${transaction.status.toLowerCase()}">${transaction.status}</span>
                    </div>
                    <div class="detail-item">
                        <label>Description:</label>
                        <span>${transaction.description || 'No description'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Created:</label>
                        <span>${formatDate(transaction.created_at)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Updated:</label>
                        <span>${transaction.updated_at ? formatDate(transaction.updated_at) : 'Not updated'}</span>
                    </div>
                </div>
            `;
            
            document.getElementById('transactionDetails').innerHTML = detailsHtml;
            document.getElementById('transactionModal').style.display = 'block';
            
            // Hide approve/reject buttons if already processed
            const actionButtons = document.querySelector('#transactionModal .modal-actions');
            if (transaction.status !== 'Pending') {
                actionButtons.style.display = 'none';
            } else {
                actionButtons.style.display = 'block';
            }
        }

        function hideTransactionModal() {
            document.getElementById('transactionModal').style.display = 'none';
            currentTransactionId = null;
        }

        function showRechargeModal() {
            document.getElementById('rechargeModal').style.display = 'block';
        }

        function hideRechargeModal() {
            document.getElementById('rechargeModal').style.display = 'none';
        }

        async function approveTransaction() {
            if (!currentTransactionId) return;
            await updateTransactionStatus(currentTransactionId, 'Approved');
        }

        async function rejectTransaction() {
            if (!currentTransactionId) return;
            await updateTransactionStatus(currentTransactionId, 'Rejected');
        }

        async function quickApprove(transactionId) {
            await updateTransactionStatus(transactionId, 'Approved');
        }

        async function quickReject(transactionId) {
            await updateTransactionStatus(transactionId, 'Rejected');
        }

        async function updateTransactionStatus(transactionId, status) {
            if (!confirm(`Are you sure you want to ${status.toLowerCase()} this transaction?`)) return;

            try {
                const response = await fetch(`/api/transactions/${transactionId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: status })
                });

                if (response.ok) {
                    alert(`Transaction ${status.toLowerCase()} successfully!`);
                    hideTransactionModal();
                    loadTransactions();
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Connection error. Please try again.');
            }
        }

        // Manual recharge form submission
        document.getElementById('rechargeForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                user_id: parseInt(document.getElementById('rechargeUserId').value),
                type: 'recharge',
                amount: parseFloat(document.getElementById('rechargeAmount').value),
                description: document.getElementById('rechargeDescription').value,
                status: 'Approved'
            };

            try {
                const response = await fetch('/api/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Manual recharge processed successfully!');
                    hideRechargeModal();
                    document.getElementById('rechargeForm').reset();
                    loadTransactions();
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Connection error. Please try again.');
            }
        });

        // Load transactions on page load
        loadTransactions();
        
        // Refresh transactions every 30 seconds
        setInterval(loadTransactions, 30000);
    </script>
</body>
</html>
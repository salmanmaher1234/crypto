<?php
requireAuth();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SuperCoin - Profile</title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">
            <h2>SuperCoin</h2>
        </div>
        <ul class="nav-menu">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/trading">Trading</a></li>
            <li><a href="/profile" class="active">Profile</a></li>
            <?php if ($_SESSION['user_role'] === 'admin'): ?>
            <li><a href="/admin">Admin</a></li>
            <?php endif; ?>
            <li><a href="#" onclick="logout()">Logout</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="profile-header">
            <h1>User Profile</h1>
        </div>

        <div class="profile-content">
            <div class="profile-card">
                <h2>Account Information</h2>
                <div class="profile-info" id="profileInfo">
                    Loading...
                </div>
                
                <button onclick="showEditModal()" class="btn btn-primary">Edit Profile</button>
            </div>

            <div class="profile-card">
                <h2>Financial Summary</h2>
                <div class="financial-summary" id="financialSummary">
                    Loading...
                </div>
            </div>

            <div class="profile-card">
                <h2>Bank Accounts</h2>
                <div id="bankAccounts">
                    Loading...
                </div>
                <button onclick="showBankAccountModal()" class="btn btn-secondary">Add Bank Account</button>
            </div>

            <div class="profile-card">
                <h2>Transaction History</h2>
                <div class="transactions-table">
                    <table id="transactionHistory">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colspan="5">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Profile Modal -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="hideEditModal()">&times;</span>
            <h2>Edit Profile</h2>
            <form id="editProfileForm">
                <div class="form-group">
                    <label for="editName">Full Name</label>
                    <input type="text" id="editName" name="name" required>
                </div>
                <div class="form-group">
                    <label for="editEmail">Email</label>
                    <input type="email" id="editEmail" name="email" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">New Password (leave blank to keep current)</label>
                    <input type="password" id="newPassword" name="password">
                </div>
                <button type="submit" class="btn btn-primary">Update Profile</button>
            </form>
        </div>
    </div>

    <!-- Bank Account Modal -->
    <div id="bankAccountModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="hideBankAccountModal()">&times;</span>
            <h2>Add Bank Account</h2>
            <form id="bankAccountForm">
                <div class="form-group">
                    <label for="bankName">Bank Name</label>
                    <input type="text" id="bankName" name="bank_name" required>
                </div>
                <div class="form-group">
                    <label for="accountNumber">Account Number</label>
                    <input type="text" id="accountNumber" name="account_number" required>
                </div>
                <div class="form-group">
                    <label for="accountHolder">Account Holder Name</label>
                    <input type="text" id="accountHolder" name="account_holder_name" required>
                </div>
                <div class="form-group">
                    <label for="ifscCode">IFSC Code</label>
                    <input type="text" id="ifscCode" name="ifsc_code" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Account</button>
            </form>
        </div>
    </div>

    <script src="/assets/app.js"></script>
    <script>
        async function loadProfileData() {
            try {
                // Load user profile
                const userResponse = await fetch('/api/auth/me');
                const userData = await userResponse.json();
                
                if (userResponse.ok) {
                    displayProfileInfo(userData.user);
                    displayFinancialSummary(userData.user);
                }

                // Load bank accounts
                const bankResponse = await fetch('/api/bank-accounts');
                const bankData = await bankResponse.json();
                
                if (bankResponse.ok) {
                    displayBankAccounts(bankData.accounts);
                }

                // Load transaction history
                const transResponse = await fetch('/api/transactions');
                const transData = await transResponse.json();
                
                if (transResponse.ok) {
                    displayTransactionHistory(transData.transactions);
                }
            } catch (error) {
                console.error('Error loading profile data:', error);
            }
        }

        function displayProfileInfo(user) {
            const container = document.getElementById('profileInfo');
            container.innerHTML = `
                <div class="info-item">
                    <label>Username:</label>
                    <span>${user.username}</span>
                </div>
                <div class="info-item">
                    <label>Full Name:</label>
                    <span>${user.name}</span>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <span>${user.email}</span>
                </div>
                <div class="info-item">
                    <label>Role:</label>
                    <span class="role-${user.role}">${user.role}</span>
                </div>
                <div class="info-item">
                    <label>Member Since:</label>
                    <span>${formatDate(user.registration_time)}</span>
                </div>
                <div class="info-item">
                    <label>Status:</label>
                    <span class="${user.is_banned ? 'banned' : 'active'}">${user.is_banned ? 'Banned' : 'Active'}</span>
                </div>
            `;
        }

        function displayFinancialSummary(user) {
            const container = document.getElementById('financialSummary');
            container.innerHTML = `
                <div class="financial-item">
                    <label>Available Balance:</label>
                    <span class="balance">${formatCurrency(user.available_balance)}</span>
                </div>
                <div class="financial-item">
                    <label>Total Balance:</label>
                    <span class="balance">${formatCurrency(user.balance)}</span>
                </div>
                <div class="financial-item">
                    <label>Frozen Balance:</label>
                    <span class="balance">${formatCurrency(user.frozen_balance)}</span>
                </div>
                <div class="financial-item">
                    <label>Reputation Score:</label>
                    <span class="reputation">${user.reputation}</span>
                </div>
                <div class="financial-item">
                    <label>Credit Score:</label>
                    <span class="credit-score">${user.credit_score}</span>
                </div>
            `;
        }

        function displayBankAccounts(accounts) {
            const container = document.getElementById('bankAccounts');
            
            if (accounts.length === 0) {
                container.innerHTML = '<p>No bank accounts added</p>';
                return;
            }
            
            container.innerHTML = accounts.map(account => `
                <div class="bank-account-item">
                    <h4>${account.bank_name}</h4>
                    <p>Account: ****${account.account_number.slice(-4)}</p>
                    <p>Holder: ${account.account_holder_name}</p>
                    <p>IFSC: ${account.ifsc_code}</p>
                </div>
            `).join('');
        }

        function displayTransactionHistory(transactions) {
            const tbody = document.querySelector('#transactionHistory tbody');
            tbody.innerHTML = '';
            
            if (transactions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">No transactions found</td></tr>';
                return;
            }
            
            transactions.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${transaction.type}</td>
                    <td class="${transaction.amount >= 0 ? 'positive' : 'negative'}">${formatCurrency(Math.abs(transaction.amount))}</td>
                    <td><span class="status-${transaction.status.toLowerCase()}">${transaction.status}</span></td>
                    <td>${transaction.description || '-'}</td>
                    <td>${formatDate(transaction.created_at)}</td>
                `;
                tbody.appendChild(row);
            });
        }

        function showEditModal() {
            // Pre-fill form with current data
            fetch('/api/auth/me')
                .then(response => response.json())
                .then(data => {
                    if (data.user) {
                        document.getElementById('editName').value = data.user.name;
                        document.getElementById('editEmail').value = data.user.email;
                    }
                });
            
            document.getElementById('editModal').style.display = 'block';
        }

        function hideEditModal() {
            document.getElementById('editModal').style.display = 'none';
        }

        function showBankAccountModal() {
            document.getElementById('bankAccountModal').style.display = 'block';
        }

        function hideBankAccountModal() {
            document.getElementById('bankAccountModal').style.display = 'none';
        }

        // Edit profile form submission
        document.getElementById('editProfileForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('editName').value,
                email: document.getElementById('editEmail').value
            };
            
            const password = document.getElementById('newPassword').value;
            if (password) {
                formData.password = password;
            }

            try {
                const response = await fetch('/api/users/' + '<?php echo $_SESSION['user_id']; ?>', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Profile updated successfully!');
                    hideEditModal();
                    loadProfileData();
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Connection error. Please try again.');
            }
        });

        // Bank account form submission
        document.getElementById('bankAccountForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                bank_name: document.getElementById('bankName').value,
                account_number: document.getElementById('accountNumber').value,
                account_holder_name: document.getElementById('accountHolder').value,
                ifsc_code: document.getElementById('ifscCode').value
            };

            try {
                const response = await fetch('/api/bank-accounts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Bank account added successfully!');
                    hideBankAccountModal();
                    document.getElementById('bankAccountForm').reset();
                    loadProfileData();
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Connection error. Please try again.');
            }
        });

        // Load profile data on page load
        loadProfileData();
    </script>
</body>
</html>
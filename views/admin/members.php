<?php
requireAdmin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SuperCoin - Member Management</title>
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
            <h1>Member Management</h1>
            <div class="admin-breadcrumb">
                <a href="/admin">Admin</a> > Member Management
            </div>
        </div>

        <div class="admin-controls">
            <div class="search-controls">
                <input type="text" id="searchInput" placeholder="Search users..." onkeyup="searchUsers()">
                <button onclick="loadUsers()" class="btn btn-secondary">Refresh</button>
            </div>
            <button onclick="showAddUserModal()" class="btn btn-primary">Add User</button>
        </div>

        <div class="members-table">
            <table id="membersTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Balance</th>
                        <th>Available</th>
                        <th>Reputation</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td colspan="10">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Add User Modal -->
    <div id="addUserModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="hideAddUserModal()">&times;</span>
            <h2>Add New User</h2>
            <form id="addUserForm">
                <div class="form-group">
                    <label for="newUsername">Username</label>
                    <input type="text" id="newUsername" name="username" required>
                </div>
                <div class="form-group">
                    <label for="newEmail">Email</label>
                    <input type="email" id="newEmail" name="email" required>
                </div>
                <div class="form-group">
                    <label for="newName">Full Name</label>
                    <input type="text" id="newName" name="name" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">Password</label>
                    <input type="password" id="newPassword" name="password" required>
                </div>
                <div class="form-group">
                    <label for="newFundPassword">Fund Password</label>
                    <input type="password" id="newFundPassword" name="fund_password" required>
                </div>
                <div class="form-group">
                    <label for="newRole">Role</label>
                    <select id="newRole" name="role">
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Add User</button>
            </form>
        </div>
    </div>

    <!-- Edit User Modal -->
    <div id="editUserModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="hideEditUserModal()">&times;</span>
            <h2>Edit User</h2>
            <form id="editUserForm">
                <input type="hidden" id="editUserId">
                <div class="form-group">
                    <label for="editUserName">Full Name</label>
                    <input type="text" id="editUserName" name="name" required>
                </div>
                <div class="form-group">
                    <label for="editUserEmail">Email</label>
                    <input type="email" id="editUserEmail" name="email" required>
                </div>
                <div class="form-group">
                    <label for="editUserBalance">Balance</label>
                    <input type="number" id="editUserBalance" name="balance" step="0.01">
                </div>
                <div class="form-group">
                    <label for="editUserReputation">Reputation</label>
                    <input type="number" id="editUserReputation" name="reputation" min="0" max="100">
                </div>
                <div class="form-group">
                    <label for="editUserRole">Role</label>
                    <select id="editUserRole" name="role">
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="editUserBanned" name="is_banned">
                        Banned
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="editUserWithdrawalProhibited" name="withdrawal_prohibited">
                        Withdrawal Prohibited
                    </label>
                </div>
                <button type="submit" class="btn btn-primary">Update User</button>
            </form>
        </div>
    </div>

    <script src="/assets/app.js"></script>
    <script>
        let allUsers = [];

        async function loadUsers() {
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                
                if (response.ok) {
                    allUsers = data.users;
                    displayUsers(allUsers);
                }
            } catch (error) {
                console.error('Error loading users:', error);
            }
        }

        function displayUsers(users) {
            const tbody = document.querySelector('#membersTable tbody');
            tbody.innerHTML = '';
            
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="10">No users found</td></tr>';
                return;
            }
            
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="role-${user.role}">${user.role}</span></td>
                    <td>${formatCurrency(user.balance)}</td>
                    <td>${formatCurrency(user.available_balance)}</td>
                    <td>${user.reputation}</td>
                    <td><span class="status-${user.is_banned ? 'banned' : 'active'}">${user.is_banned ? 'Banned' : 'Active'}</span></td>
                    <td class="actions">
                        <button onclick="editUser(${user.id})" class="btn-small">Edit</button>
                        <button onclick="toggleUserBan(${user.id}, ${user.is_banned})" class="btn-small ${user.is_banned ? 'btn-success' : 'btn-danger'}">
                            ${user.is_banned ? 'Unban' : 'Ban'}
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        function searchUsers() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const filteredUsers = allUsers.filter(user => 
                user.username.toLowerCase().includes(searchTerm) ||
                user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm)
            );
            displayUsers(filteredUsers);
        }

        function showAddUserModal() {
            document.getElementById('addUserModal').style.display = 'block';
        }

        function hideAddUserModal() {
            document.getElementById('addUserModal').style.display = 'none';
        }

        function showEditUserModal() {
            document.getElementById('editUserModal').style.display = 'block';
        }

        function hideEditUserModal() {
            document.getElementById('editUserModal').style.display = 'none';
        }

        function editUser(userId) {
            const user = allUsers.find(u => u.id === userId);
            if (!user) return;

            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUserName').value = user.name;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserBalance').value = user.balance;
            document.getElementById('editUserReputation').value = user.reputation;
            document.getElementById('editUserRole').value = user.role;
            document.getElementById('editUserBanned').checked = user.is_banned;
            document.getElementById('editUserWithdrawalProhibited').checked = user.withdrawal_prohibited;
            
            showEditUserModal();
        }

        async function toggleUserBan(userId, currentBanStatus) {
            const action = currentBanStatus ? 'unban' : 'ban';
            if (!confirm(`Are you sure you want to ${action} this user?`)) return;

            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_banned: !currentBanStatus })
                });

                if (response.ok) {
                    alert(`User ${action}ned successfully!`);
                    loadUsers();
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Connection error. Please try again.');
            }
        }

        // Add user form submission
        document.getElementById('addUserForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                username: document.getElementById('newUsername').value,
                email: document.getElementById('newEmail').value,
                name: document.getElementById('newName').value,
                password: document.getElementById('newPassword').value,
                fund_password: document.getElementById('newFundPassword').value,
                role: document.getElementById('newRole').value
            };

            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('User added successfully!');
                    hideAddUserModal();
                    document.getElementById('addUserForm').reset();
                    loadUsers();
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Connection error. Please try again.');
            }
        });

        // Edit user form submission
        document.getElementById('editUserForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const userId = document.getElementById('editUserId').value;
            const formData = {
                name: document.getElementById('editUserName').value,
                email: document.getElementById('editUserEmail').value,
                balance: parseFloat(document.getElementById('editUserBalance').value),
                reputation: parseInt(document.getElementById('editUserReputation').value),
                role: document.getElementById('editUserRole').value,
                is_banned: document.getElementById('editUserBanned').checked,
                withdrawal_prohibited: document.getElementById('editUserWithdrawalProhibited').checked
            };

            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('User updated successfully!');
                    hideEditUserModal();
                    loadUsers();
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                alert('Connection error. Please try again.');
            }
        });

        // Load users on page load
        loadUsers();
    </script>
</body>
</html>
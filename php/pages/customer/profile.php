<?php
require_once 'includes/session.php';
$user = getCurrentUser();
?>

<div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-gray-900">Profile & Bank Accounts</h1>
                <a href="?page=dashboard" class="text-blue-600 hover:text-blue-700">← Back to Dashboard</a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Profile Section -->
        <div class="bg-white rounded-lg shadow mb-6 p-6">
            <h2 class="text-lg font-semibold mb-4">Profile Information</h2>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <p class="mt-1 text-gray-900"><?php echo htmlspecialchars($user['name']); ?></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Username</label>
                    <p class="mt-1 text-gray-900"><?php echo htmlspecialchars($user['username']); ?></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <p class="mt-1 text-gray-900"><?php echo htmlspecialchars($user['email']); ?></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">User Type</label>
                    <p class="mt-1 text-gray-900"><?php echo htmlspecialchars($user['user_type'] ?? 'Normal'); ?></p>
                </div>
            </div>
        </div>

        <!-- Bank Accounts Section -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold">Bank Accounts</h2>
                <button onclick="showAddAccountForm()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add Bank Account
                </button>
            </div>

            <!-- Existing Bank Accounts -->
            <div id="bankAccountsList">
                <p class="text-gray-500">Loading bank accounts...</p>
            </div>

            <!-- Add Bank Account Form (Hidden by default) -->
            <div id="addAccountForm" class="hidden mt-6 border-t pt-6">
                <h3 class="text-md font-semibold mb-4">Add New Bank Account</h3>
                <form id="bankAccountForm" class="space-y-4">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label for="accountHolderName" class="block text-sm font-medium text-gray-700 mb-1">
                                Account Holder Name <span class="text-red-500">*</span>
                            </label>
                            <input type="text" id="accountHolderName" name="accountHolderName" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label for="accountNumber" class="block text-sm font-medium text-gray-700 mb-1">
                                Account Number <span class="text-red-500">*</span>
                            </label>
                            <input type="text" id="accountNumber" name="accountNumber" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label for="bankName" class="block text-sm font-medium text-gray-700 mb-1">
                                Bank Name <span class="text-red-500">*</span>
                            </label>
                            <input type="text" id="bankName" name="bankName" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                   placeholder="e.g., State Bank of India">
                        </div>
                        <div>
                            <label for="branchName" class="block text-sm font-medium text-gray-700 mb-1">
                                Branch Name (Optional)
                            </label>
                            <input type="text" id="branchName" name="branchName" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                   placeholder="e.g., Mumbai Main Branch">
                        </div>
                        <div>
                            <label for="ifscCode" class="block text-sm font-medium text-gray-700 mb-1">
                                IFSC Code (Optional)
                            </label>
                            <input type="text" id="ifscCode" name="ifscCode" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                   placeholder="e.g., SBIN0000456">
                        </div>
                        <div>
                            <label for="currency" class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <select id="currency" name="currency" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="INR" selected>INR</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex space-x-4">
                        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Add Bank Account
                        </button>
                        <button type="button" onclick="hideAddAccountForm()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <div id="message" class="hidden mt-4 p-4 rounded-md"></div>
        </div>
    </div>
</div>

<script>
// Load bank accounts
async function loadBankAccounts() {
    try {
        const response = await fetch('/php/api/bank-accounts');
        const accounts = await response.json();
        
        const container = document.getElementById('bankAccountsList');
        
        if (accounts.length === 0) {
            container.innerHTML = '<p class="text-gray-500">No bank accounts added yet</p>';
            return;
        }
        
        container.innerHTML = accounts.map(account => `
            <div class="border rounded-lg p-4 mb-3">
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <div class="font-medium text-gray-900">${account.bank_name || account.bankName}</div>
                        <div class="text-sm text-gray-600">Account Holder: ${account.account_holder_name || account.accountHolderName}</div>
                        <div class="text-sm text-gray-600">Account: ***${(account.account_number || account.accountNumber).slice(-4)}</div>
                    </div>
                    <div class="text-right">
                        ${account.ifsc_code || account.ifscCode ? `<div class="text-sm text-gray-600">IFSC: ${account.ifsc_code || account.ifscCode}</div>` : ''}
                        ${account.branch_name || account.branchName ? `<div class="text-sm text-gray-600">Branch: ${account.branch_name || account.branchName}</div>` : ''}
                        <div class="text-xs text-blue-600">${account.currency || 'INR'}</div>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        document.getElementById('bankAccountsList').innerHTML = '<p class="text-red-500">Error loading bank accounts</p>';
    }
}

// Show add account form
function showAddAccountForm() {
    document.getElementById('addAccountForm').classList.remove('hidden');
}

// Hide add account form
function hideAddAccountForm() {
    document.getElementById('addAccountForm').classList.add('hidden');
    document.getElementById('bankAccountForm').reset();
}

// Submit bank account form
document.getElementById('bankAccountForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        accountHolderName: document.getElementById('accountHolderName').value,
        accountNumber: document.getElementById('accountNumber').value,
        bankName: document.getElementById('bankName').value,
        branchName: document.getElementById('branchName').value || null,
        ifscCode: document.getElementById('ifscCode').value || null,
        currency: document.getElementById('currency').value,
        bindingType: 'Bank Card'
    };
    
    try {
        const response = await fetch('/php/api/bank-accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Bank account added successfully!', 'success');
            hideAddAccountForm();
            loadBankAccounts();
        } else {
            showMessage(data.error || 'Failed to add bank account', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    }
});

// Show message
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = `mt-4 p-4 rounded-md ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
    messageDiv.textContent = text;
    messageDiv.classList.remove('hidden');
    
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

// Initialize
loadBankAccounts();
</script>
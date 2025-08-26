<?php
require_once 'includes/session.php';
$user = getCurrentUser();
?>

<div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-gray-900">SUP Trading</h1>
                <div class="flex items-center space-x-4">
                    <a href="?page=dashboard" class="text-blue-600 hover:text-blue-700">← Back to Dashboard</a>
                    <span class="text-gray-600">Balance: ₹<?php echo number_format($user['available_balance'], 2); ?></span>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Price Display -->
        <div class="bg-white rounded-lg shadow mb-6 p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">SUP/USDT</h2>
                <div id="cryptoPrices" class="text-right">
                    <div class="text-2xl font-bold" id="supPrice">Loading...</div>
                    <div class="text-sm" id="supChange">--</div>
                </div>
            </div>
            
            <!-- Price Chart Placeholder -->
            <div class="h-48 bg-gray-100 rounded flex items-center justify-center">
                <p class="text-gray-500">Real-time price chart would be displayed here</p>
            </div>
        </div>

        <!-- Trading Form -->
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Place Order</h3>
            
            <form id="tradingForm" class="space-y-4">
                <div class="grid md:grid-cols-2 gap-4">
                    <!-- Direction Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                        <div class="grid grid-cols-2 gap-2">
                            <button type="button" onclick="selectDirection('Buy Up')" 
                                    class="direction-btn p-3 border rounded text-center hover:bg-green-50" 
                                    data-direction="Buy Up">
                                <div class="text-green-600 font-semibold">📈 Buy Up</div>
                                <div class="text-xs text-gray-500">Price will rise</div>
                            </button>
                            <button type="button" onclick="selectDirection('Buy Down')" 
                                    class="direction-btn p-3 border rounded text-center hover:bg-red-50" 
                                    data-direction="Buy Down">
                                <div class="text-red-600 font-semibold">📉 Buy Down</div>
                                <div class="text-xs text-gray-500">Price will fall</div>
                            </button>
                        </div>
                        <input type="hidden" id="direction" name="direction" required>
                    </div>

                    <!-- Duration Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                        <select id="duration" name="duration" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select duration</option>
                            <option value="30">30 seconds</option>
                            <option value="60">1 minute</option>
                            <option value="120">2 minutes</option>
                            <option value="300">5 minutes</option>
                        </select>
                    </div>
                </div>

                <!-- Amount Input -->
                <div>
                    <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">Amount (INR)</label>
                    <input type="number" id="amount" name="amount" min="100" step="10" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           placeholder="Minimum ₹100">
                </div>

                <!-- Submit Button -->
                <button type="submit" id="submitBtn" disabled 
                        class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Place Order
                </button>
            </form>

            <div id="message" class="hidden mt-4 p-4 rounded-md"></div>
        </div>
    </div>
</div>

<script>
let selectedDirection = null;
let currentPrice = null;

// Load crypto prices
async function loadCryptoPrices() {
    try {
        const response = await fetch('/php/api/crypto/prices');
        const prices = await response.json();
        
        if (prices['SUP/USDT']) {
            const supData = prices['SUP/USDT'];
            currentPrice = parseFloat(supData.price);
            
            document.getElementById('supPrice').textContent = '$' + supData.price;
            document.getElementById('supChange').textContent = supData.change;
            document.getElementById('supChange').className = 'text-sm ' + 
                (supData.changeType === 'positive' ? 'text-green-600' : 'text-red-600');
        }
    } catch (error) {
        console.error('Error loading prices:', error);
    }
}

// Direction selection
function selectDirection(direction) {
    selectedDirection = direction;
    document.getElementById('direction').value = direction;
    
    // Update button styles
    document.querySelectorAll('.direction-btn').forEach(btn => {
        btn.classList.remove('bg-green-100', 'bg-red-100', 'border-green-500', 'border-red-500');
        btn.classList.add('border-gray-300');
    });
    
    const selectedBtn = document.querySelector(`[data-direction="${direction}"]`);
    if (direction === 'Buy Up') {
        selectedBtn.classList.add('bg-green-100', 'border-green-500');
    } else {
        selectedBtn.classList.add('bg-red-100', 'border-red-500');
    }
    
    validateForm();
}

// Form validation
function validateForm() {
    const direction = document.getElementById('direction').value;
    const duration = document.getElementById('duration').value;
    const amount = document.getElementById('amount').value;
    
    const isValid = direction && duration && amount && parseFloat(amount) >= 100;
    document.getElementById('submitBtn').disabled = !isValid;
}

// Form submission
document.getElementById('tradingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!currentPrice) {
        showMessage('Error: Current price not available', 'error');
        return;
    }
    
    const formData = {
        asset: 'SUP/USDT',
        direction: document.getElementById('direction').value,
        duration: parseInt(document.getElementById('duration').value),
        amount: parseFloat(document.getElementById('amount').value),
        entryPrice: currentPrice
    };
    
    try {
        const response = await fetch('/php/api/betting-orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Order placed successfully!', 'success');
            document.getElementById('tradingForm').reset();
            selectedDirection = null;
            document.querySelectorAll('.direction-btn').forEach(btn => {
                btn.classList.remove('bg-green-100', 'bg-red-100', 'border-green-500', 'border-red-500');
                btn.classList.add('border-gray-300');
            });
            validateForm();
        } else {
            showMessage(data.error || 'Order failed', 'error');
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

// Event listeners
document.getElementById('duration').addEventListener('change', validateForm);
document.getElementById('amount').addEventListener('input', validateForm);

// Initialize
loadCryptoPrices();
setInterval(loadCryptoPrices, 5000); // Update prices every 5 seconds
</script>
// SuperCoin PHP Application JavaScript

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Authentication functions
async function logout() {
    if (!confirm('Are you sure you want to logout?')) return;
    
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            window.location.href = '/login';
        } else {
            alert('Error logging out. Please try again.');
        }
    } catch (error) {
        alert('Connection error. Please try again.');
    }
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Click outside modal to close
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Number formatting for inputs
function formatNumberInput(input) {
    let value = parseFloat(input.value);
    if (!isNaN(value)) {
        input.value = value.toFixed(2);
    }
}

// Auto-refresh functions
let refreshIntervals = [];

function startAutoRefresh(func, interval = 30000) {
    const intervalId = setInterval(func, interval);
    refreshIntervals.push(intervalId);
    return intervalId;
}

function stopAllRefresh() {
    refreshIntervals.forEach(id => clearInterval(id));
    refreshIntervals = [];
}

// Page visibility API to pause/resume auto-refresh
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAllRefresh();
    } else {
        // Restart auto-refresh when page becomes visible
        setTimeout(() => {
            const currentPage = window.location.pathname;
            initializePageRefresh(currentPage);
        }, 1000);
    }
});

function initializePageRefresh(page) {
    // Initialize auto-refresh based on current page
    switch(page) {
        case '/dashboard':
            if (typeof loadDashboardData === 'function') {
                startAutoRefresh(loadDashboardData, 30000);
            }
            break;
        case '/trading':
            if (typeof loadCryptoPrices === 'function') {
                startAutoRefresh(loadCryptoPrices, 30000);
            }
            if (typeof loadTradingOrders === 'function') {
                startAutoRefresh(loadTradingOrders, 10000);
            }
            break;
        case '/admin':
            if (typeof loadAdminStats === 'function') {
                startAutoRefresh(() => {
                    loadAdminStats();
                    loadRecentActivities();
                }, 30000);
            }
            break;
        case '/admin/orders':
            if (typeof loadOrders === 'function') {
                startAutoRefresh(loadOrders, 15000);
            }
            break;
        case '/admin/transactions':
            if (typeof loadTransactions === 'function') {
                startAutoRefresh(loadTransactions, 30000);
            }
            break;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add notification styles if not already present
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            color: white;
            z-index: 10000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 300px;
            animation: slideIn 0.3s ease-out;
        }
        
        .notification-info {
            background: #17a2b8;
        }
        
        .notification-success {
            background: #28a745;
        }
        
        .notification-warning {
            background: #ffc107;
            color: #333;
        }
        
        .notification-error {
            background: #dc3545;
        }
        
        .notification button {
            background: none;
            border: none;
            color: inherit;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 1rem;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Loading state helpers
function showLoading(element, text = 'Loading...') {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.innerHTML = `<div class="loading">${text}</div>`;
    }
}

function hideLoading(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        const loading = element.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
    }
}

// API request helper with error handling
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return { success: true, data };
    } catch (error) {
        console.error('API Request Error:', error);
        return { success: false, error: error.message };
    }
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    // Initialize auto-refresh for appropriate pages
    initializePageRefresh(currentPage);
    
    // Add form validation classes
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('invalid');
                    isValid = false;
                } else {
                    input.classList.remove('invalid');
                }
                
                if (input.type === 'email' && input.value && !validateEmail(input.value)) {
                    input.classList.add('invalid');
                    isValid = false;
                }
                
                if (input.type === 'password' && input.value && !validatePassword(input.value)) {
                    input.classList.add('invalid');
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
    });
    
    // Add input validation styles
    const validationStyle = document.createElement('style');
    validationStyle.textContent = `
        .invalid {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
    `;
    document.head.appendChild(validationStyle);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        const visibleModals = document.querySelectorAll('.modal[style*="display: block"]');
        visibleModals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Ctrl/Cmd + R for refresh (prevent default and use custom refresh)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        const currentPage = window.location.pathname;
        
        // Call appropriate refresh function based on page
        if (currentPage === '/dashboard' && typeof loadDashboardData === 'function') {
            loadDashboardData();
        } else if (currentPage === '/trading' && typeof loadCryptoPrices === 'function') {
            loadCryptoPrices();
            if (typeof loadTradingOrders === 'function') loadTradingOrders();
        } else if (currentPage.startsWith('/admin')) {
            if (typeof loadUsers === 'function') loadUsers();
            if (typeof loadOrders === 'function') loadOrders();
            if (typeof loadTransactions === 'function') loadTransactions();
            if (typeof loadAdminStats === 'function') loadAdminStats();
        }
        
        showNotification('Page refreshed', 'success');
    }
});

// Copy to clipboard helper
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Copied to clipboard', 'success');
    } catch (err) {
        showNotification('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Export functions for global use
window.SuperCoin = {
    formatCurrency,
    formatDate,
    logout,
    showNotification,
    apiRequest,
    copyToClipboard,
    validateEmail,
    validatePassword
};
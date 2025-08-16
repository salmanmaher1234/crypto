<?php
// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: /dashboard');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SuperCoin - Register</title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body class="login-body">
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <h1>SuperCoin</h1>
                <p>Create Your Account</p>
            </div>
            
            <form id="registerForm" class="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <div class="form-group">
                    <label for="fund_password">Fund Password</label>
                    <input type="password" id="fund_password" name="fund_password" required>
                </div>
                
                <button type="submit" class="btn-primary">Register</button>
                
                <div id="message" class="message"></div>
            </form>
            
            <div class="login-footer">
                <p>Already have an account? <a href="/login">Login here</a></p>
            </div>
        </div>
    </div>
    
    <script src="/assets/app.js"></script>
    <script>
        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                name: document.getElementById('name').value,
                password: document.getElementById('password').value,
                fund_password: document.getElementById('fund_password').value
            };
            
            const messageDiv = document.getElementById('message');
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    messageDiv.innerHTML = '<p class="success">Registration successful! Redirecting to login...</p>';
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    messageDiv.innerHTML = '<p class="error">' + data.message + '</p>';
                }
            } catch (error) {
                messageDiv.innerHTML = '<p class="error">Connection error. Please try again.</p>';
            }
        });
    </script>
</body>
</html>
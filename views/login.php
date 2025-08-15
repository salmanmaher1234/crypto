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
    <title>SuperCoin - Login</title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body class="login-body">
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <h1>SuperCoin</h1>
                <p>Cryptocurrency Investment Platform</p>
            </div>
            
            <form id="loginForm" class="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" class="btn-primary">Login</button>
                
                <div id="message" class="message"></div>
            </form>
            
            <div class="login-footer">
                <p>Don't have an account? <a href="/register">Register here</a></p>
            </div>
        </div>
    </div>
    
    <script src="/assets/app.js"></script>
    <script>
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('message');
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    messageDiv.innerHTML = '<p class="success">Login successful!</p>';
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
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
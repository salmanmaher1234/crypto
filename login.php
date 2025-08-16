<?php
session_start();

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Simple authentication (replace with database when ready)
    if ($username === 'admin' && $password === 'admin123') {
        $_SESSION['user_id'] = 1;
        $_SESSION['username'] = $username;
        $_SESSION['user_role'] = 'admin';
        header('Location: dashboard.php?role=admin');
        exit;
    } elseif ($username === 'sarah' && $password === 'password123') {
        $_SESSION['user_id'] = 2;
        $_SESSION['username'] = $username;
        $_SESSION['user_role'] = 'customer';
        header('Location: dashboard.php?role=customer');
        exit;
    } else {
        header('Location: index.html?error=Invalid credentials');
        exit;
    }
}

// If not POST, redirect to login
header('Location: index.html');
exit;
?>
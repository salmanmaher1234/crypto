<?php
session_start();
require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /?error=Method not allowed');
    exit();
}

if (!isset($_POST['username']) || !isset($_POST['password'])) {
    header('Location: /?error=Username and password required');
    exit();
}

$database = new Database();
$db = $database->getConnection();

// Get user by username
$query = "SELECT * FROM users WHERE username = :username";
$stmt = $db->prepare($query);
$stmt->bindParam(':username', $_POST['username']);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

// For now, use plain text password comparison (will update to hash later)
if (!$user || $user['password'] !== $_POST['password']) {
    header('Location: /?error=Invalid credentials');
    exit();
}

// Check if user is banned
if ($user['is_banned']) {
    header('Location: /?error=Account has been suspended');
    exit();
}

// Set session
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['user_role'] = $user['role'];

// Redirect based on role
if ($user['role'] === 'admin') {
    header('Location: /admin.php');
} else {
    header('Location: /customer.php');
}
?>
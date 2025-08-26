<?php
require_once __DIR__ . '/../config/database.php';

function getCurrentUser() {
    if (!isset($_SESSION['user_id'])) {
        return null;
    }
    
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "SELECT * FROM users WHERE id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $_SESSION['user_id']);
    $stmt->execute();
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function requireLogin() {
    if (!getCurrentUser()) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit();
    }
}

function requireAdmin() {
    $user = getCurrentUser();
    if (!$user || $user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        exit();
    }
}

function authenticateUser($username, $password) {
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "SELECT * FROM users WHERE username = :username";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        return $user;
    }
    
    return false;
}

function logout() {
    session_unset();
    session_destroy();
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}
?>
<?php
require_once '../../config/database.php';
require_once '../../includes/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

requireAdmin();

$database = new Database();
$db = $database->getConnection();

$query = "SELECT 
    id, username, email, name, role, balance, available_balance, frozen_balance,
    reputation, direction, is_banned, withdrawal_prohibited, invitation_code,
    user_type, general_agent, registration_time, remark, created_at
    FROM users 
    ORDER BY id DESC";

$stmt = $db->prepare($query);
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Calculate total balance for display
foreach ($users as &$user) {
    $user['total_balance'] = floatval($user['available_balance']) + floatval($user['frozen_balance']);
}

echo json_encode($users);
?>
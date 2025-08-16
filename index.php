<?php
// SuperCoin PHP Application Entry Point
session_start();
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/routes.php';

// Set headers for API routes only
if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-ID');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = ltrim($path, '/');

// Handle API routes
if (strpos($path, 'api/') === 0) {
    $apiPath = substr($path, 4);
    handleApiRoute($method, $apiPath);
} else {
    // Serve PHP frontend pages
    servePhpFrontend($path);
}

function handleApiRoute($method, $path) {
    global $routes;
    
    $routeKey = $method . ' ' . $path;
    
    // Check for exact match first
    if (isset($routes[$routeKey])) {
        $handler = $routes[$routeKey];
        call_user_func($handler);
        return;
    }
    
    // Check for parameterized routes
    foreach ($routes as $route => $handler) {
        if (strpos($route, $method . ' ') === 0) {
            $routePath = substr($route, strlen($method) + 1);
            if (preg_match('#^' . str_replace('{id}', '(\d+)', $routePath) . '$#', $path, $matches)) {
                if (isset($matches[1])) {
                    $_GET['id'] = $matches[1];
                }
                call_user_func($handler);
                return;
            }
        }
    }
    
    // Route not found
    http_response_code(404);
    echo json_encode(['message' => 'Route not found']);
}

function servePhpFrontend($path) {
    // Route to PHP frontend pages
    switch ($path) {
        case '':
        case 'login':
            require_once __DIR__ . '/views/login.php';
            break;
        case 'register':
            require_once __DIR__ . '/views/register.php';
            break;
        case 'dashboard':
            require_once __DIR__ . '/views/dashboard.php';
            break;
        case 'trading':
            require_once __DIR__ . '/views/trading.php';
            break;
        case 'profile':
            require_once __DIR__ . '/views/profile.php';
            break;
        case 'admin':
            require_once __DIR__ . '/views/admin.php';
            break;
        case 'admin/members':
            require_once __DIR__ . '/views/admin/members.php';
            break;
        case 'admin/orders':
            require_once __DIR__ . '/views/admin/orders.php';
            break;
        case 'admin/transactions':
            require_once __DIR__ . '/views/admin/transactions.php';
            break;
        case 'assets/style.css':
            header('Content-Type: text/css');
            require_once __DIR__ . '/assets/style.css';
            break;
        case 'assets/app.js':
            header('Content-Type: application/javascript');
            require_once __DIR__ . '/assets/app.js';
            break;
        default:
            // Check if it's a static asset
            $filePath = __DIR__ . '/assets/' . $path;
            if (file_exists($filePath)) {
                $mimeType = getMimeType($filePath);
                header('Content-Type: ' . $mimeType);
                readfile($filePath);
            } else {
                // 404 page
                http_response_code(404);
                require_once __DIR__ . '/views/404.php';
            }
            break;
    }
}

function getMimeType($filePath) {
    $extension = pathinfo($filePath, PATHINFO_EXTENSION);
    $mimeTypes = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml'
    ];
    
    return $mimeTypes[$extension] ?? 'application/octet-stream';
}

// Authentication helper function
function requireAuth() {
    if (!isset($_SESSION['user_id'])) {
        header('Location: /login');
        exit;
    }
}

// Check if user is admin
function requireAdmin() {
    requireAuth();
    if ($_SESSION['user_role'] !== 'admin') {
        header('Location: /dashboard');
        exit;
    }
}
?>
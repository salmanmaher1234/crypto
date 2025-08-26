<?php
// Simple test to verify PHP and MySQL connection
echo "<h1>C BOE Platform - PHP + MySQL Test</h1>";

// Test database connection
try {
    $host = 'localhost';
    $dbname = 'cboe';
    $username = 'root';
    $password = '';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p style='color: green;'>✅ MySQL Connection: SUCCESS</p>";
    
    // Test users table
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p style='color: green;'>✅ Users table: " . $result['count'] . " records found</p>";
    
} catch(PDOException $e) {
    echo "<p style='color: red;'>❌ Database Error: " . $e->getMessage() . "</p>";
    echo "<p><strong>To fix this:</strong></p>";
    echo "<ol>";
    echo "<li>Create MySQL database: <code>CREATE DATABASE cboe;</code></li>";
    echo "<li>Import schema: <code>mysql -u root cboe < php/database/schema.sql</code></li>";
    echo "</ol>";
}

echo "<hr>";
echo "<h2>Platform Features:</h2>";
echo "<ul>";
echo "<li>✅ PHP Backend</li>";
echo "<li>✅ MySQL Database</li>";
echo "<li>✅ SUP Cryptocurrency Trading</li>";
echo "<li>✅ INR Currency Support</li>";
echo "<li>✅ Indian Banking System</li>";
echo "</ul>";

echo "<p><a href='/php/api/crypto/prices.php'>Test Crypto API</a></p>";
echo "<p><a href='/php/pages/login.php'>Login Page</a></p>";
?>
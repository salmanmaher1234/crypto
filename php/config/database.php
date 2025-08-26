<?php
// Database configuration for PostgreSQL
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    private $conn;

    public function __construct() {
        // Use environment variables if available, otherwise defaults
        $this->host = $_ENV['PGHOST'] ?? 'localhost';
        $this->port = $_ENV['PGPORT'] ?? '5432';
        $this->db_name = $_ENV['PGDATABASE'] ?? 'cboe';
        $this->username = $_ENV['PGUSER'] ?? 'postgres';
        $this->password = $_ENV['PGPASSWORD'] ?? '';
    }

    public function getConnection() {
        $this->conn = null;
        
        try {
            $dsn = "pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name;
            $this->conn = new PDO(
                $dsn,
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                )
            );
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}
?>
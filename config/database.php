<?php
// Database configuration and connection (MySQL Version)
class Database {
    private static $instance = null;
    private $connection;
    private $host = 'localhost';
    private $database = 'supercoin';
    private $username = 'root';
    private $password = '';
    private $port = 3306;
    private $charset = 'utf8mb4';
    
    private function __construct() {
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->database};charset={$this->charset}";
            $this->connection = new PDO($dsn, $this->username, $this->password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Database query error: " . $e->getMessage());
            throw $e;
        }
    }
    
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }
    
    public function fetchOne($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }
    
    public function insert($table, $data) {
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        
        $this->query($sql, $data);
        
        // For MySQL, get the last inserted ID
        $lastInsertId = $this->connection->lastInsertId();
        
        // If we have an ID, return the inserted record
        if ($lastInsertId) {
            return $this->fetchOne("SELECT * FROM {$table} WHERE id = ?", [$lastInsertId]);
        }
        
        return null;
    }
    
    public function update($table, $data, $where) {
        $setClause = [];
        foreach ($data as $key => $value) {
            $setClause[] = "{$key} = :{$key}";
        }
        $setClause = implode(', ', $setClause);
        
        $whereClause = [];
        $whereParams = [];
        foreach ($where as $key => $value) {
            $whereClause[] = "{$key} = :where_{$key}";
            $whereParams["where_{$key}"] = $value;
        }
        $whereClause = implode(' AND ', $whereClause);
        
        // Merge data and where parameters
        $params = array_merge($data, $whereParams);
        
        $sql = "UPDATE {$table} SET {$setClause} WHERE {$whereClause}";
        $this->query($sql, $params);
        
        // Return the updated record
        if (!empty($where)) {
            $whereConditions = [];
            $whereValues = [];
            foreach ($where as $key => $value) {
                $whereConditions[] = "{$key} = ?";
                $whereValues[] = $value;
            }
            $whereSql = implode(' AND ', $whereConditions);
            
            return $this->fetchOne("SELECT * FROM {$table} WHERE {$whereSql}", $whereValues);
        }
        
        return null;
    }
    
    public function delete($table, $where) {
        $whereClause = [];
        foreach ($where as $key => $value) {
            $whereClause[] = "{$key} = :{$key}";
        }
        $whereClause = implode(' AND ', $whereClause);
        
        $sql = "DELETE FROM {$table} WHERE {$whereClause}";
        $stmt = $this->query($sql, $where);
        return $stmt->rowCount();
    }
    
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }
    
    public function commit() {
        return $this->connection->commit();
    }
    
    public function rollback() {
        return $this->connection->rollback();
    }
    
    // MySQL specific helper methods
    public function getLastInsertId() {
        return $this->connection->lastInsertId();
    }
}

// Initialize database connection
$db = Database::getInstance();
?>
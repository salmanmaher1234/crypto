// server/db.ts
import { createPool } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MySQL connection configuration with defaults
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'crypto',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
};

// Create MySQL connection pool
export const pool = createPool(mysqlConfig);

// Create Drizzle ORM instance for MySQL
export const db = drizzle(pool, { 
  schema, 
  mode: 'default'
});

// Test connection function
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Optional: Add a function to check if database exists, create if not
export async function ensureDatabaseExists() {
  try {
    // Create a connection without specifying database
    const adminPool = createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '3306'),
    });
    
    const dbName = process.env.DB_NAME || 'crypto';
    const [rows] = await adminPool.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [dbName]
    );
    
    if (!rows || (Array.isArray(rows) && rows.length === 0)) {
      console.log(`Database ${dbName} does not exist. Creating...`);
      await adminPool.execute(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully.`);
    }
    
    await adminPool.end();
    return true;
  } catch (error) {
    console.error('Error ensuring database exists:', error);
    return false;
  }
}
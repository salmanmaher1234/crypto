// server/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from "@shared/schema";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// PostgreSQL connection configuration using Replit's DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Create Drizzle ORM instance for PostgreSQL
export const db = drizzle(pool, { 
  schema,
});

// Test connection function
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database successfully!');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Export pool for direct database operations if needed
export { pool };

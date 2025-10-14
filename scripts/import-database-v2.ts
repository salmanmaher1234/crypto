import { db } from "../server/db";
import * as schema from "../shared/schema";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const sqlFile = fs.readFileSync(
  path.join(process.cwd(), "attached_assets/crypto (2)_1760461068865.sql"),
  "utf8"
);

// Parse individual row values from a multi-row INSERT
function parseInsertRows(insertStatement: string): string[] {
  // Extract the VALUES portion
  const match = insertStatement.match(/VALUES\s+(.+);$/s);
  if (!match) return [];
  
  const valuesString = match[1];
  const rows: string[] = [];
  let currentRow = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < valuesString.length; i++) {
    const char = valuesString[i];
    const prevChar = i > 0 ? valuesString[i - 1] : '';
    
    // Track string state
    if ((char === "'" || char === '"') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
    
    // Track parentheses depth
    if (!inString) {
      if (char === '(') depth++;
      if (char === ')') depth--;
    }
    
    currentRow += char;
    
    // When we close a row tuple and we're at depth 0
    if (!inString && char === ')' && depth === 0) {
      rows.push(currentRow.trim());
      currentRow = '';
      // Skip comma and whitespace
      while (i + 1 < valuesString.length && (valuesString[i + 1] === ',' || valuesString[i + 1] === ' ' || valuesString[i + 1] === '\n')) {
        i++;
      }
    }
  }
  
  return rows;
}

// Convert a single row's boolean values based on column positions
function convertRowBooleans(rowValues: string, tableName: string): string {
  // Define boolean column positions for each table (0-indexed within VALUES clause)
  const booleanColumns: { [key: string]: number[] } = {
    'users': [12, 13, 24], // is_banned, withdrawal_prohibited, is_active
    'bank_accounts': [9], // is_default
    'announcements': [4], // is_active
    'messages': [6], // is_read
  };
  
  if (!booleanColumns[tableName]) return rowValues;
  
  // Strip leading ( and trailing )
  let values = rowValues.trim();
  if (values.startsWith('(')) values = values.substring(1);
  if (values.endsWith(')')) values = values.substring(0, values.length - 1);
  
  // Parse values carefully
  const parsedValues: string[] = [];
  let current = '';
  let inString = false;
  let stringChar = '';
  let depth = 0;
  
  for (let i = 0; i < values.length; i++) {
    const char = values[i];
    const prevChar = i > 0 ? values[i - 1] : '';
    
    if ((char === "'" || char === '"') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
    
    if (!inString) {
      if (char === '(') depth++;
      if (char === ')') depth--;
    }
    
    if (!inString && depth === 0 && char === ',') {
      parsedValues.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) parsedValues.push(current.trim());
  
  // Convert boolean columns
  for (const colIndex of booleanColumns[tableName]) {
    if (colIndex < parsedValues.length) {
      const value = parsedValues[colIndex].trim();
      if (value === '0') parsedValues[colIndex] = 'FALSE';
      else if (value === '1') parsedValues[colIndex] = 'TRUE';
    }
  }
  
  return '(' + parsedValues.join(', ') + ')';
}

async function importDatabase() {
  console.log("\n" + "=".repeat(60));
  console.log("DATABASE IMPORT - MySQL to PostgreSQL (v2)");
  console.log("=".repeat(60) + "\n");
  
  try {
    // Step 1: Clear all existing data
    console.log("Step 1: Clearing existing data...");
    await db.delete(schema.messages);
    await db.delete(schema.withdrawalRequests);
    await db.delete(schema.bettingOrders);
    await db.delete(schema.transactions);
    await db.delete(schema.bankAccounts);
    await db.delete(schema.sessions);
    await db.delete(schema.announcements);
    await db.delete(schema.users);
    console.log("  ✓ All tables cleared\n");
    
    // Step 2: Import data
    const tables = [
      'users',
      'announcements',
      'bank_accounts',
      'sessions',
      'transactions',
      'betting_orders',
      'withdrawal_requests',
      'messages',
    ];
    
    console.log("Step 2: Importing data...\n");
    
    for (const tableName of tables) {
      process.stdout.write(`  Importing ${tableName.padEnd(20)}... `);
      
      // Find INSERT statements for this table
      const pattern = new RegExp(`INSERT INTO \`${tableName}\`[^;]+;`, 'gs');
      const inserts = sqlFile.match(pattern) || [];
      
      let successCount = 0;
      let failedCount = 0;
      
      for (const insertStmt of inserts) {
        // Get column names
        const colMatch = insertStmt.match(/INSERT INTO `[^`]+` \(([^)]+)\)/);
        if (!colMatch) continue;
        
        const columns = colMatch[1].replace(/`/g, '"');
        
        // Parse individual rows
        const rows = parseInsertRows(insertStmt);
        
        for (const row of rows) {
          // Handle signature_data base64 images
          let processedRow = row;
          if (tableName === 'users' && row.includes('data:image/png;base64')) {
            processedRow = row.replace(/'data:image\/png;base64[^']*'/g, 'NULL');
          }
          
          // Convert booleans
          const convertedRow = convertRowBooleans(processedRow, tableName);
          
          // Build PostgreSQL INSERT
          const pgInsert = `INSERT INTO "${tableName}" (${columns}) VALUES ${convertedRow};`;
          
          try {
            await db.execute(sql.raw(pgInsert));
            successCount++;
          } catch (error: any) {
            failedCount++;
            if (failedCount <= 2) {
              console.log(`\n    ⚠ Error (row ${successCount + failedCount}): ${error.message.substring(0, 120)}`);
            }
          }
        }
      }
      
      console.log(`✓ ${successCount} rows${failedCount > 0 ? ` (${failedCount} failed)` : ''}`);
    }
    
    // Step 3: Update sequences
    console.log("\nStep 3: Updating ID sequences...");
    await db.execute(sql`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1))`);
    await db.execute(sql`SELECT setval('bank_accounts_id_seq', COALESCE((SELECT MAX(id) FROM bank_accounts), 1))`);
    await db.execute(sql`SELECT setval('transactions_id_seq', COALESCE((SELECT MAX(id) FROM transactions), 1))`);
    await db.execute(sql`SELECT setval('betting_orders_id_seq', COALESCE((SELECT MAX(id) FROM betting_orders), 1))`);
    await db.execute(sql`SELECT setval('withdrawal_requests_id_seq', COALESCE((SELECT MAX(id) FROM withdrawal_requests), 1))`);
    await db.execute(sql`SELECT setval('announcements_id_seq', COALESCE((SELECT MAX(id) FROM announcements), 1))`);
    await db.execute(sql`SELECT setval('messages_id_seq', COALESCE((SELECT MAX(id) FROM messages), 1))`);
    console.log("  ✓ All sequences updated\n");
    
    // Step 4: Get final counts
    const counts = {
      users: (await db.select().from(schema.users)).length,
      announcements: (await db.select().from(schema.announcements)).length,
      bankAccounts: (await db.select().from(schema.bankAccounts)).length,
      sessions: (await db.select().from(schema.sessions)).length,
      transactions: (await db.select().from(schema.transactions)).length,
      bettingOrders: (await db.select().from(schema.bettingOrders)).length,
      withdrawalRequests: (await db.select().from(schema.withdrawalRequests)).length,
      messages: (await db.select().from(schema.messages)).length,
    };
    
    // Print final summary
    console.log("=".repeat(60));
    console.log("IMPORT SUMMARY");
    console.log("=".repeat(60));
    console.log(`Users:               ${counts.users.toString().padStart(6)}`);
    console.log(`Announcements:       ${counts.announcements.toString().padStart(6)}`);
    console.log(`Bank Accounts:       ${counts.bankAccounts.toString().padStart(6)}`);
    console.log(`Sessions:            ${counts.sessions.toString().padStart(6)}`);
    console.log(`Transactions:        ${counts.transactions.toString().padStart(6)}`);
    console.log(`Betting Orders:      ${counts.bettingOrders.toString().padStart(6)}`);
    console.log(`Withdrawal Requests: ${counts.withdrawalRequests.toString().padStart(6)}`);
    console.log(`Messages:            ${counts.messages.toString().padStart(6)}`);
    console.log("=".repeat(60));
    
    console.log("\n✅ Database import completed successfully!\n");
    
    // Show admin credentials
    const adminUser = await db.select().from(schema.users).where(sql`role = 'admin'`).limit(1);
    if (adminUser.length > 0) {
      console.log("Admin Login Credentials:");
      console.log(`  Username: ${adminUser[0].username}`);
      console.log(`  Password: ${adminUser[0].password}\n`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  }
}

importDatabase();

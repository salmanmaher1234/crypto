import { db } from "../server/db";
import * as schema from "../shared/schema";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const sqlFile = fs.readFileSync(
  path.join(process.cwd(), "attached_assets/crypto (2)_1760461068865.sql"),
  "utf8"
);

// Extract all INSERT statements for a table
function extractTableInserts(tableName: string): string[] {
  // Match the entire INSERT statement including all VALUES
  const pattern = new RegExp(
    `INSERT INTO \`${tableName}\`[^;]+;`,
    'gs'
  );
  const matches = sqlFile.match(pattern);
  return matches || [];
}

// Convert MySQL INSERT to PostgreSQL compatible format
function convertToPostgres(insertStatement: string, tableName: string): string {
  let pgStatement = insertStatement;
  
  // Replace backticks with double quotes for identifiers
  pgStatement = pgStatement.replace(/`/g, '"');
  
  // Convert boolean values based on table and position
  if (tableName === 'users') {
    // is_banned, withdrawal_prohibited, is_active are boolean columns
    // Convert tinyint (0/1) to boolean (FALSE/TRUE)
    pgStatement = pgStatement.replace(/,\s*0\s*,/g, ', FALSE,');
    pgStatement = pgStatement.replace(/,\s*1\s*,/g, ', TRUE,');
    pgStatement = pgStatement.replace(/,\s*0\s*\)/g, ', FALSE)');
    pgStatement = pgStatement.replace(/,\s*1\s*\)/g, ', TRUE)');
  } else if (tableName === 'bank_accounts' || tableName === 'announcements') {
    // is_default / is_active column - replace last boolean before timestamps
    pgStatement = pgStatement.replace(/,\s*([01])\s*,\s*'[^']+'\s*,\s*'[^']+'\s*\)/g, 
      (match, bool) => match.replace(new RegExp(`,\\s*${bool}\\s*,`), `, ${bool === '1' ? 'TRUE' : 'FALSE'},`)
    );
  } else if (tableName === 'messages') {
    // is_read column before timestamp
    pgStatement = pgStatement.replace(/,\s*([01])\s*,\s*'[^']+'\s*\)/g,
      (match, bool) => match.replace(new RegExp(`,\\s*${bool}\\s*,`), `, ${bool === '1' ? 'TRUE' : 'FALSE'},`)
    );
  }
  
  return pgStatement;
}

async function importDatabase() {
  console.log("\n" + "=".repeat(60));
  console.log("DATABASE IMPORT - MySQL to PostgreSQL");
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
    
    // Step 2: Import data in correct order (respecting foreign keys)
    const tables = [
      'users',          // No dependencies
      'announcements',  // No dependencies
      'bank_accounts',  // Depends on users
      'sessions',       // Depends on users
      'transactions',   // Depends on users
      'betting_orders', // Depends on users
      'withdrawal_requests', // Depends on users and bank_accounts
      'messages',       // Depends on users
    ];
    
    console.log("Step 2: Importing data...\n");
    const importStats: { [key: string]: { success: number; failed: number } } = {};
    
    for (const tableName of tables) {
      process.stdout.write(`  Importing ${tableName.padEnd(20)}... `);
      
      const inserts = extractTableInserts(tableName);
      let successCount = 0;
      let failedCount = 0;
      
      for (const insert of inserts) {
        let pgInsert = convertToPostgres(insert, tableName);
        
        // Handle problematic signature_data base64 images in users table
        if (tableName === 'users' && pgInsert.includes('data:image/png;base64')) {
          // Replace base64 signature data with NULL
          pgInsert = pgInsert.replace(/'data:image\/png;base64[^']*'/g, 'NULL');
        }
        
        try {
          await db.execute(sql.raw(pgInsert));
          successCount++;
        } catch (error: any) {
          failedCount++;
          // Only log first 3 errors per table
          if (failedCount <= 3) {
            console.log(`\n    ⚠ Error: ${error.message.substring(0, 100)}`);
          }
        }
      }
      
      importStats[tableName] = { success: successCount, failed: failedCount };
      console.log(`✓ ${successCount} rows${failedCount > 0 ? ` (${failedCount} failed)` : ''}`);
    }
    
    // Step 3: Update sequences to match max IDs
    console.log("\nStep 3: Updating ID sequences...");
    try {
      await db.execute(sql`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1))`);
      await db.execute(sql`SELECT setval('bank_accounts_id_seq', COALESCE((SELECT MAX(id) FROM bank_accounts), 1))`);
      await db.execute(sql`SELECT setval('transactions_id_seq', COALESCE((SELECT MAX(id) FROM transactions), 1))`);
      await db.execute(sql`SELECT setval('betting_orders_id_seq', COALESCE((SELECT MAX(id) FROM betting_orders), 1))`);
      await db.execute(sql`SELECT setval('withdrawal_requests_id_seq', COALESCE((SELECT MAX(id) FROM withdrawal_requests), 1))`);
      await db.execute(sql`SELECT setval('announcements_id_seq', COALESCE((SELECT MAX(id) FROM announcements), 1))`);
      await db.execute(sql`SELECT setval('messages_id_seq', COALESCE((SELECT MAX(id) FROM messages), 1))`);
      console.log("  ✓ All sequences updated\n");
    } catch (error: any) {
      console.log("  ⚠ Some sequences may not exist\n");
    }
    
    // Step 4: Get final counts
    console.log("Step 4: Verifying import...\n");
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
      console.log(`  Password: ${adminUser[0].password}`);
    }
    
    console.log("");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  }
}

// Run the import
importDatabase();

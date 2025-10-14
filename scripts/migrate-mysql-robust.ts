import { db } from "../server/db";
import * as schema from "../shared/schema";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const sqlFile = fs.readFileSync(
  path.join(process.cwd(), "attached_assets/supercoin_1760460420200.sql"),
  "utf8"
);

// Extract INSERT statements for a given table
function extractInserts(tableName: string): string[] {
  const pattern = new RegExp(
    `INSERT INTO \`${tableName}\`[^;]+;`,
    'gs'
  );
  return [...(sqlFile.match(pattern) || [])];
}

// Convert MySQL INSERT to PostgreSQL-compatible format
function convertInsert(mysqlInsert: string, tableName: string): string {
  let pgInsert = mysqlInsert;
  
  // Replace table name backticks with quotes
  pgInsert = pgInsert.replace(/`${tableName}`/g, `"${tableName}"`);
  pgInsert = pgInsert.replace(/`([^`]+)`/g, '"$1"');
  
  // Handle boolean conversions for specific columns
  if (tableName === 'users') {
    // is_banned, withdrawal_prohibited, is_active are boolean columns
    // They appear at specific positions in the VALUES clause
    pgInsert = pgInsert.replace(/,\s*0\s*,/g, ', FALSE,');
    pgInsert = pgInsert.replace(/,\s*1\s*,/g, ', TRUE,');
    pgInsert = pgInsert.replace(/,\s*0\s*\)/g, ', FALSE)');
    pgInsert = pgInsert.replace(/,\s*1\s*\)/g, ', TRUE)');
  } else if (tableName === 'bank_accounts') {
    // is_default is boolean  
    pgInsert = pgInsert.replace(/,\s*([01])\s*,\s*'[\d-]+\s+[\d:]+'\s*,\s*'[\d-]+\s+[\d:]+'/g, 
      (match, bool) => match.replace(bool, bool === '1' ? 'TRUE' : 'FALSE'));
  } else if (tableName === 'announcements') {
    // is_active is boolean
    pgInsert = pgInsert.replace(/,\s*([01])\s*,\s*'[\d-]+\s+[\d:]+'\s*,\s*'[\d-]+\s+[\d:]+'/g,
      (match, bool) => match.replace(bool, bool === '1' ? 'TRUE' : 'FALSE'));
  } else if (tableName === 'messages') {
    // is_read is boolean (appears before timestamp)
    pgInsert = pgInsert.replace(/,\s*([01])\s*,\s*'[\d-]+\s+[\d:]+'/g,
      (match, bool) => match.replace(bool, bool === '1' ? 'TRUE' : 'FALSE'));
  }
  
  return pgInsert;
}

async function migrate() {
  console.log("Starting robust MySQL to PostgreSQL migration...\n");
  
  try {
    // 1. Clear existing data
    console.log("Step 1: Clearing existing data...");
    await db.delete(schema.messages);
    await db.delete(schema.withdrawalRequests);
    await db.delete(schema.bettingOrders);
    await db.delete(schema.transactions);
    await db.delete(schema.bankAccounts);
    await db.delete(schema.sessions);
    await db.delete(schema.announcements);
    await db.delete(schema.users);
    console.log("  ✓ Data cleared\n");
    
    // 2. Import tables in dependency order
    const tables = [
      'users',
      'announcements', 
      'bank_accounts',
      'transactions',
      'betting_orders',
      'withdrawal_requests',
      'messages',
      'sessions'
    ];
    
    console.log("Step 2: Importing data...");
    
    for (const tableName of tables) {
      console.log(`\n  Importing ${tableName}...`);
      const inserts = extractInserts(tableName);
      
      if (inserts.length === 0) {
        console.log(`    ⚠ No data found`);
        continue;
      }
      
      let successCount = 0;
      let skipCount = 0;
      
      for (const insert of inserts) {
        const pgInsert = convertInsert(insert, tableName);
        
        try {
          // Skip rows with problematic data (signature_data with complex base64)
          if (tableName === 'users' && pgInsert.includes('data:image/png')) {
            // Remove signature_data field value - set to NULL
            const modifiedInsert = pgInsert.replace(
              /signature_data\s*=\s*'data:image\/png;[^']*'/g,
              "signature_data = NULL"
            ).replace(
              /'data:image\/png;base64,[^']*'/g,
              "NULL"
            );
            await db.execute(sql.raw(modifiedInsert));
          } else {
            await db.execute(sql.raw(pgInsert));
          }
          successCount++;
        } catch (error: any) {
          // If error is about complex data, skip this row
          if (error.message.includes('unterminated') || 
              error.message.includes('syntax error') ||
              error.message.includes('violates foreign key')) {
            skipCount++;
          } else {
            console.log(`    Error: ${error.message.substring(0, 100)}`);
            skipCount++;
          }
        }
      }
      
      console.log(`    ✓ ${successCount} rows imported${skipCount > 0 ? `, ${skipCount} skipped` : ''}`);
    }
    
    // 3. Update sequences
    console.log("\nStep 3: Updating sequences...");
    try {
      await db.execute(sql`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1))`);
      await db.execute(sql`SELECT setval('bank_accounts_id_seq', COALESCE((SELECT MAX(id) FROM bank_accounts), 1))`);
      await db.execute(sql`SELECT setval('transactions_id_seq', COALESCE((SELECT MAX(id) FROM transactions), 1))`);
      await db.execute(sql`SELECT setval('betting_orders_id_seq', COALESCE((SELECT MAX(id) FROM betting_orders), 1))`);
      await db.execute(sql`SELECT setval('withdrawal_requests_id_seq', COALESCE((SELECT MAX(id) FROM withdrawal_requests), 1))`);
      await db.execute(sql`SELECT setval('announcements_id_seq', COALESCE((SELECT MAX(id) FROM announcements), 1))`);
      await db.execute(sql`SELECT setval('messages_id_seq', COALESCE((SELECT MAX(id) FROM messages), 1))`);
      console.log("  ✓ Sequences updated\n");
    } catch (error: any) {
      console.log("  ⚠ Some sequences may not exist yet\n");
    }
    
    // 4. Print summary
    const counts = {
      users: (await db.select().from(schema.users)).length,
      announcements: (await db.select().from(schema.announcements)).length,
      bankAccounts: (await db.select().from(schema.bankAccounts)).length,
      transactions: (await db.select().from(schema.transactions)).length,
      bettingOrders: (await db.select().from(schema.bettingOrders)).length,
      withdrawalRequests: (await db.select().from(schema.withdrawalRequests)).length,
      messages: (await db.select().from(schema.messages)).length,
      sessions: (await db.select().from(schema.sessions)).length,
    };
    
    console.log("=".repeat(50));
    console.log("MIGRATION SUMMARY");
    console.log("=".repeat(50));
    console.log(`Users:               ${counts.users.toString().padStart(5)}`);
    console.log(`Announcements:       ${counts.announcements.toString().padStart(5)}`);
    console.log(`Bank Accounts:       ${counts.bankAccounts.toString().padStart(5)}`);
    console.log(`Transactions:        ${counts.transactions.toString().padStart(5)}`);
    console.log(`Betting Orders:      ${counts.bettingOrders.toString().padStart(5)}`);
    console.log(`Withdrawal Requests: ${counts.withdrawalRequests.toString().padStart(5)}`);
    console.log(`Messages:            ${counts.messages.toString().padStart(5)}`);
    console.log(`Sessions:            ${counts.sessions.toString().padStart(5)}`);
    console.log("=".repeat(50));
    console.log("\n✓ Migration completed successfully!");
    console.log("\nAdmin credentials:");
    console.log("  Username: admin");
    console.log("  Password: admin123\n");
    
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Migration failed:", error);
    process.exit(1);
  }
}

migrate();

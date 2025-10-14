import { db } from "../server/db";
import * as schema from "../shared/schema";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const sqlFile = fs.readFileSync(
  path.join(process.cwd(), "attached_assets/supercoin_1760460420200.sql"),
  "utf8"
);

async function migrate() {
  console.log("Starting migration from MySQL dump...");
  
  try {
    // 1. Clear existing data in reverse order of dependencies
    console.log("Clearing existing data...");
    await db.delete(schema.messages);
    await db.delete(schema.withdrawalRequests);
    await db.delete(schema.bettingOrders);
    await db.delete(schema.transactions);
    await db.delete(schema.bankAccounts);
    await db.delete(schema.sessions);
    await db.delete(schema.announcements);
    await db.delete(schema.users);
    
    // Reset sequences
    await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE bank_accounts_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE transactions_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE betting_orders_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE withdrawal_requests_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE announcements_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE messages_id_seq RESTART WITH 1`);
    
    console.log("Data cleared successfully!");
    
    // 2. Import data table by table with proper transformations
    const tables = [
      { name: 'users', skipForeignKeys: false },
      { name: 'announcements', skipForeignKeys: false },
      { name: 'bank_accounts', skipForeignKeys: false },
      { name: 'sessions', skipForeignKeys: false },
      { name: 'transactions', skipForeignKeys: false },
      { name: 'betting_orders', skipForeignKeys: false },
      { name: 'withdrawal_requests', skipForeignKeys: false },
      { name: 'messages', skipForeignKeys: false },
    ];
    
    for (const table of tables) {
      console.log(`Importing ${table.name}...`);
      const insertMatches = sqlFile.match(new RegExp(`INSERT INTO \`${table.name}\`[^;]+;`, 'gs'));
      if (!insertMatches) {
        console.log(`No data found for ${table.name}`);
        continue;
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const insertStmt of insertMatches) {
        let pgStmt = insertStmt
          // Replace backticks with double quotes
          .replace(/`([^`]+)`/g, '"$1"')
          // Convert MySQL boolean 0/1 to PostgreSQL FALSE/TRUE for specific columns
          .replace(/\(([^)]+)\)/g, (match) => {
            if (table.name === 'users') {
              // Replace boolean values for users table
              return match
                .replace(/,\s*0\s*,/g, ', FALSE,')
                .replace(/,\s*1\s*,/g, ', TRUE,')
                .replace(/,\s*0\s*\)/g, ', FALSE)')
                .replace(/,\s*1\s*\)/g, ', TRUE)');
            } else if (table.name === 'bank_accounts') {
              // is_default is last boolean column before timestamps
              return match.replace(/,\s*([01])\s*,\s*'[\d-]+\s+[\d:]+'/g, (m, bool, ts) => 
                `, ${bool === '1' ? 'TRUE' : 'FALSE'}, '${ts.trim()}'`
              );
            } else if (table.name === 'announcements') {
              // is_active column
              return match.replace(/,\s*([01])\s*,\s*'[\d-]+\s+[\d:]+'/g, (m, bool) => 
                `, ${bool === '1' ? 'TRUE' : 'FALSE'}, '${m.match(/'[^']+'/)?.[0]}'`
              );
            } else if (table.name === 'messages') {
              // is_read column
              return match.replace(/,'(General|System|Alert)',\s*([01])\s*,/g, (m, type, bool) =>
                `,'${type}', ${bool === '1' ? 'TRUE' : 'FALSE'},`
              );
            }
            return match;
          });
        
        try {
          await db.execute(sql.raw(pgStmt));
          successCount++;
        } catch (error: any) {
          errorCount++;
          if (errorCount <= 3) {
            console.error(`  Error: ${error.message.substring(0, 150)}`);
          }
        }
      }
      
      console.log(`  ${table.name}: ${successCount} rows imported, ${errorCount} errors`);
    }
    
    // 3. Update sequences to max IDs
    console.log("\nUpdating sequences...");
    try {
      await db.execute(sql`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1))`);
      await db.execute(sql`SELECT setval('bank_accounts_id_seq', COALESCE((SELECT MAX(id) FROM bank_accounts), 1))`);
      await db.execute(sql`SELECT setval('transactions_id_seq', COALESCE((SELECT MAX(id) FROM transactions), 1))`);
      await db.execute(sql`SELECT setval('betting_orders_id_seq', COALESCE((SELECT MAX(id) FROM betting_orders), 1))`);
      await db.execute(sql`SELECT setval('withdrawal_requests_id_seq', COALESCE((SELECT MAX(id) FROM withdrawal_requests), 1))`);
      await db.execute(sql`SELECT setval('announcements_id_seq', COALESCE((SELECT MAX(id) FROM announcements), 1))`);
      await db.execute(sql`SELECT setval('messages_id_seq', COALESCE((SELECT MAX(id) FROM messages), 1))`);
    } catch (error: any) {
      console.log("  Note: Some sequences may not need updating");
    }
    
    console.log("Migration completed successfully!");
    
    // Print summary
    const userCount = await db.select().from(schema.users);
    const announcementCount = await db.select().from(schema.announcements);
    const bankAccountCount = await db.select().from(schema.bankAccounts);
    const transactionCount = await db.select().from(schema.transactions);
    const bettingCount = await db.select().from(schema.bettingOrders);
    const withdrawalCount = await db.select().from(schema.withdrawalRequests);
    const messageCount = await db.select().from(schema.messages);
    const sessionCount = await db.select().from(schema.sessions);
    
    console.log("\n=== Migration Summary ===");
    console.log(`Users: ${userCount.length}`);
    console.log(`Announcements: ${announcementCount.length}`);
    console.log(`Bank Accounts: ${bankAccountCount.length}`);
    console.log(`Transactions: ${transactionCount.length}`);
    console.log(`Betting Orders: ${bettingCount.length}`);
    console.log(`Withdrawal Requests: ${withdrawalCount.length}`);
    console.log(`Messages: ${messageCount.length}`);
    console.log(`Sessions: ${sessionCount.length}`);
    console.log("========================\n");
    
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();

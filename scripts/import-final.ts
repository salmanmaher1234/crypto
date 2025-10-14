import { db } from "../server/db";
import * as schema from "../shared/schema";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const sqlFile = fs.readFileSync(
  path.join(process.cwd(), "attached_assets/crypto_pg.sql"),
  "utf8"
);

// Extract and convert table INSERT statements for PostgreSQL
function extractInserts(tableName: string): string[] {
  // Match both backtick and double-quote formats
  const pattern = new RegExp(`INSERT INTO [\`"]${tableName}[\`"][^;]+;`, 'gs');
  const inserts = sqlFile.match(pattern) || [];
  
  // Just convert backticks to double quotes and escape single quotes
  return inserts.map(stmt => stmt.replace(/`/g, '"').replace(/\\'/g, "''"));
}

async function importDatabase() {
  console.log("\n" + "=".repeat(60));
  console.log("DATABASE IMPORT - Final");
  console.log("=".repeat(60) + "\n");
  
  try {
    // Clear all data
    console.log("Step 1: Clearing existing data...");
    await db.delete(schema.messages);
    await db.delete(schema.withdrawalRequests);
    await db.delete(schema.bettingOrders);
    await db.delete(schema.transactions);
    await db.delete(schema.bankAccounts);
    await db.delete(schema.sessions);
    await db.delete(schema.announcements);
    await db.delete(schema.users);
    console.log("  ✓ Cleared\n");
    
    // Import in order
    const tables = ['users', 'announcements', 'bank_accounts', 'sessions', 'transactions', 'betting_orders', 'withdrawal_requests', 'messages'];
    
    console.log("Step 2: Importing data...\n");
    
    for (const tableName of tables) {
      process.stdout.write(`  ${tableName.padEnd(22)}... `);
      
      const statements = extractInserts(tableName);
      let totalRows = 0;
      let failedInserts = 0;
      
      for (const stmt of statements) {
        try {
          await db.execute(sql.raw(stmt));
          const match = stmt.match(/VALUES\s+(.+);$/s);
          if (match) {
            totalRows += (match[1].match(/\(/g) || []).length;
          }
        } catch (error: any) {
          failedInserts++;
          if (failedInserts <= 2) {
            console.log(`\n    ⚠ ${error.message.substring(0, 90)}`);
          }
        }
      }
      
      console.log(`✓ ${totalRows} rows${failedInserts > 0 ? ` (${failedInserts} failed)` : ''}`);
    }
    
    // Update sequences
    console.log("\nStep 3: Updating sequences...");
    await db.execute(sql`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1))`);
    await db.execute(sql`SELECT setval('bank_accounts_id_seq', COALESCE((SELECT MAX(id) FROM bank_accounts), 1))`);
    await db.execute(sql`SELECT setval('transactions_id_seq', COALESCE((SELECT MAX(id) FROM transactions), 1))`);
    await db.execute(sql`SELECT setval('betting_orders_id_seq', COALESCE((SELECT MAX(id) FROM betting_orders), 1))`);
    await db.execute(sql`SELECT setval('withdrawal_requests_id_seq', COALESCE((SELECT MAX(id) FROM withdrawal_requests), 1))`);
    await db.execute(sql`SELECT setval('announcements_id_seq', COALESCE((SELECT MAX(id) FROM announcements), 1))`);
    await db.execute(sql`SELECT setval('messages_id_seq', COALESCE((SELECT MAX(id) FROM messages), 1))`);
    console.log("  ✓ Done\n");
    
    // Final counts
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
    
    console.log("\n✅ Database import completed!\n");
    
    const admin = await db.select().from(schema.users).where(sql`role = 'admin'`).limit(1);
    if (admin.length > 0) {
      console.log("Admin credentials:");
      console.log(`  Username: ${admin[0].username}`);
      console.log(`  Password: ${admin[0].password}\n`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  }
}

importDatabase();

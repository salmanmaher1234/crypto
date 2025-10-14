import { db } from "../server/db";
import * as schema from "../shared/schema";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const sqlFile = fs.readFileSync(
  path.join(process.cwd(), "attached_assets/crypto_cleaned.sql"),
  "utf8"
);

// Clean and convert table data for PostgreSQL
function cleanAndConvert(tableName: string): string[] {
  const pattern = new RegExp(`INSERT INTO \`${tableName}\`[^;]+;`, 'gs');
  const inserts = sqlFile.match(pattern) || [];
  
  return inserts.map(insertStmt => {
    // Basic conversions
    let cleaned = insertStmt
      .replace(/`/g, '"') // backticks to double quotes
      .replace(/\\'/g, "''"); // escape single quotes
    
    // For users table: set signature_data to NULL (avoid base64 parsing issues)
    if (tableName === 'users') {
      // Replace any signature_data value with NULL
      cleaned = cleaned.replace(
        /,\s*NULL,\s*'data:image[^']*',\s*'([^']*)'/g,
        ', NULL, NULL, \'$1\''
      );
      cleaned = cleaned.replace(
        /,\s*NULL,\s*'data:image[^']*',\s*NULL/g,
        ', NULL, NULL, NULL'
      );
      cleaned = cleaned.replace(
        /,\s*'[^']*',\s*'data:image[^']*',\s*'([^']*)'/g,
        ', NULL, NULL, \'$1\''
      );
    }
    
    // Convert MySQL boolean values (0/1) to PostgreSQL (FALSE/TRUE)
    // These conversions are position-aware for each table
    if (tableName === 'users') {
      // Pattern-based replacement for is_banned, withdrawal_prohibited (positions 13, 14)
      cleaned = cleaned.replace(
        /(\d+,\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*[\d.]+,\s*[\d.]+,\s*[\d.]+,\s*\d+,\s*'[^']*',\s*'[^']*',\s*)([01]),\s*([01])/g,
        (match, prefix, banned, prohibited) => 
          `${prefix}${banned === '1' ? 'TRUE' : 'FALSE'}, ${prohibited === '1' ? 'TRUE' : 'FALSE'}`
      );
      
      // Convert is_active (appears before credit_score near end of row)
      cleaned = cleaned.replace(
        /(,\s*)([01])(,\s*\d+,\s*'(?:Allowed|Prohibited)')/g,
        (match, prefix, isActive, suffix) =>
          `${prefix}${isActive === '1' ? 'TRUE' : 'FALSE'}${suffix}`
      );
    } else if (tableName === 'bank_accounts' || tableName === 'announcements') {
      // is_default / is_active before timestamps
      cleaned = cleaned.replace(
        /(,\s*)([01])(,\s*'[\d-]+\s+[\d:]+',\s*'[\d-]+\s+[\d:]+'\))/g,
        (match, prefix, bool, suffix) =>
          `${prefix}${bool === '1' ? 'TRUE' : 'FALSE'}${suffix}`
      );
    } else if (tableName === 'messages') {
      // is_read before created_at  
      cleaned = cleaned.replace(
        /(,\s*)([01])(,\s*'[\d-]+\s+[\d:]+',\s*'[\d-]+\s+[\d:]+'\))/g,
        (match, prefix, bool, suffix) =>
          `${prefix}${bool === '1' ? 'TRUE' : 'FALSE'}${suffix}`
      );
    }
    
    return cleaned;
  });
}

async function importDatabase() {
  console.log("\n" + "=".repeat(60));
  console.log("DATABASE IMPORT - MySQL to PostgreSQL");
  console.log("=".repeat(60) + "\n");
  
  try {
    // Step 1: Clear existing data
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
    
    // Step 2: Import in correct order
    const tables = ['users', 'announcements', 'bank_accounts', 'sessions', 'transactions', 'betting_orders', 'withdrawal_requests', 'messages'];
    
    console.log("Step 2: Importing data...\n");
    
    for (const tableName of tables) {
      process.stdout.write(`  Importing ${tableName.padEnd(20)}... `);
      
      const statements = cleanAndConvert(tableName);
      let successCount = 0;
      let failedCount = 0;
      
      for (const stmt of statements) {
        try {
          await db.execute(sql.raw(stmt));
          // Count rows (count opening parens after VALUES)
          const match = stmt.match(/VALUES\s+(.+);$/s);
          if (match) {
            successCount += (match[1].match(/\(/g) || []).length;
          }
        } catch (error: any) {
          failedCount++;
          if (failedCount <= 2) {
            console.log(`\n    ⚠ ${error.message.substring(0, 100)}`);
          }
        }
      }
      
      console.log(`✓ ${successCount} rows${failedCount > 0 ? ` (${failedCount} failed)` : ''}`);
    }
    
    // Step 3: Update sequences
    console.log("\nStep 3: Updating sequences...");
    await db.execute(sql`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1))`);
    await db.execute(sql`SELECT setval('bank_accounts_id_seq', COALESCE((SELECT MAX(id) FROM bank_accounts), 1))`);
    await db.execute(sql`SELECT setval('transactions_id_seq', COALESCE((SELECT MAX(id) FROM transactions), 1))`);
    await db.execute(sql`SELECT setval('betting_orders_id_seq', COALESCE((SELECT MAX(id) FROM betting_orders), 1))`);
    await db.execute(sql`SELECT setval('withdrawal_requests_id_seq', COALESCE((SELECT MAX(id) FROM withdrawal_requests), 1))`);
    await db.execute(sql`SELECT setval('announcements_id_seq', COALESCE((SELECT MAX(id) FROM announcements), 1))`);
    await db.execute(sql`SELECT setval('messages_id_seq', COALESCE((SELECT MAX(id) FROM messages), 1))`);
    console.log("  ✓ Sequences updated\n");
    
    // Step 4: Final counts
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
    
    // Show admin credentials
    const admin = await db.select().from(schema.users).where(sql`role = 'admin'`).limit(1);
    if (admin.length > 0) {
      console.log("Admin Login:");
      console.log(`  Username: ${admin[0].username}`);
      console.log(`  Password: ${admin[0].password}\n`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  }
}

importDatabase();

import { db } from "../server/db";
import * as schema from "../shared/schema";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const sqlFile = fs.readFileSync(
  path.join(process.cwd(), "attached_assets/crypto (2)_1760461068865.sql"),
  "utf8"
);

// Extract table data and convert for PostgreSQL
function extractAndConvertTableData(tableName: string): string[] {
  const pattern = new RegExp(`INSERT INTO \`${tableName}\`[^;]+;`, 'gs');
  const inserts = sqlFile.match(pattern) || [];
  
  const allConvertedRows: string[] = [];
  
  for (const insertStmt of inserts) {
    //  Convert for PostgreSQL
    let converted = insertStmt
      .replace(/`/g, '"') // Replace backticks with double quotes
      .replace(/\\'/g, "''"); // Escape single quotes properly
    
    // Handle signature_data base64 images - replace with NULL
    if (tableName === 'users') {
      converted = converted.replace(/'data:image\/png;base64[^']*'/g, 'NULL');
    }
    
    // Convert boolean values by position for users table
    if (tableName === 'users') {
      // Pattern: find each row tuple and convert booleans at positions 13, 14, and 25
      converted = converted.replace(
        /\((\d+),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*([01]),\s*([01]),/g,
        (match, ...groups) => {
          const [id, username, email, pwd, name, role, bal, avail, frozen, rep, winLose, dir, isBanned, withdrawProhib] = groups;
          return `(${id}, '${username}', '${email}', '${pwd}', '${name}', '${role}', ${bal}, ${avail}, ${frozen}, ${rep}, '${winLose}', '${dir}', ${isBanned === '1' ? 'TRUE' : 'FALSE'}, ${withdrawProhib === '1' ? 'TRUE' : 'FALSE'},`;
        }
      );
      // Convert is_active (position 25) - appears before credit_score
      converted = converted.replace(/,\s*([01]),\s*(\d+),\s*'(Allowed|Prohibited)'/g, (match, isActive, creditScore, tasksBan) => {
        return `, ${isActive === '1' ? 'TRUE' : 'FALSE'}, ${creditScore}, '${tasksBan}'`;
      });
    } else if (tableName === 'bank_accounts') {
      // Convert is_default (position 10 - before timestamps)
      converted = converted.replace(/,\s*([01]),\s*'[\d-]+\s+[\d:]+',\s*'[\d-]+\s+[\d:]+'\)/g, (match, isDefault) => {
        const rest = match.substring(match.indexOf(','));
        return `, ${isDefault === '1' ? 'TRUE' : 'FALSE'}${rest.substring(rest.indexOf(','))}`;
      });
    } else if (tableName === 'announcements') {
      // Convert is_active (position 5 - before timestamps)
      converted = converted.replace(/,\s*([01]),\s*'[\d-]+\s+[\d:]+',\s*'[\d-]+\s+[\d:]+'\)/g, (match, isActive) => {
        const rest = match.substring(match.indexOf(','));
        return `, ${isActive === '1' ? 'TRUE' : 'FALSE'}${rest.substring(rest.indexOf(','))}`;
      });
    } else if (tableName === 'messages') {
      // Convert is_read (position 7 - before created_at)
      converted = converted.replace(/,\s*([01]),\s*'[\d-]+\s+[\d:]+'\)/g, (match, isRead) => {
        const rest = match.substring(match.indexOf(','));
        return `, ${isRead === '1' ? 'TRUE' : 'FALSE'}${rest.substring(rest.indexOf(','))}`;
      });
    }
    
    allConvertedRows.push(converted);
  }
  
  return allConvertedRows;
}

async function importDatabase() {
  console.log("\n" + "=".repeat(60));
  console.log("DATABASE IMPORT - MySQL to PostgreSQL (FINAL)");
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
      
      const convertedInserts = extractAndConvertTableData(tableName);
      let successCount = 0;
      let failedCount = 0;
      
      for (const pgInsert of convertedInserts) {
        try {
          await db.execute(sql.raw(pgInsert));
          // Count rows in this INSERT (count opening parens in VALUES clause)
          const valuesMatch = pgInsert.match(/VALUES\s+(.+);$/s);
          if (valuesMatch) {
            const rowCount = (valuesMatch[1].match(/\(/g) || []).length;
            successCount += rowCount;
          }
        } catch (error: any) {
          failedCount++;
          if (failedCount <= 3) {
            console.log(`\n    ⚠ Error: ${error.message.substring(0, 120)}`);
          }
        }
      }
      
      console.log(`✓ ${successCount} rows${failedCount > 0 ? ` (${failedCount} inserts failed)` : ''}`);
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

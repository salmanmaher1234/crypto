import { db } from "../server/db";
import * as schema from "../shared/schema";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("Starting simplified migration...");
  
  try {
    // 1. Clear existing data
    console.log("Clearing existing data...");
    await db.delete(schema.messages);
    await db.delete(schema.withdrawalRequests);
    await db.delete(schema.bettingOrders);
    await db.delete(schema.transactions);
    await db.delete(schema.bankAccounts);
    await db.delete(schema.sessions);
    await db.delete(schema.announcements);
    await db.delete(schema.users);
    
    console.log("Data cleared!");
    
    // 2. Insert admin user from MySQL dump
    console.log("Creating admin user...");
    await db.execute(sql`
      INSERT INTO users (
        id, username, email, password, name, role, balance, available_balance, 
        frozen_balance, reputation, win_lose_setting, direction, is_banned,
        withdrawal_prohibited, fund_password, agent_invitation_code, invitation_code,
        user_type, general_agent, remark, registration_time, profile_image,
        signature_data, signature_name, is_active, credit_score, tasks_ban
      ) VALUES (
        1, 'admin', 'admin@cryptoinvest.com', 'admin123', 'Administrator', 'admin',
        10400.00, 7367.00, 0.00, 15, 'To Win', 'Actual', FALSE, FALSE,
        NULL, NULL, '100025', 'Agent', 'System', 'admin',
        '2025-07-08 07:06:01', NULL, NULL, NULL, TRUE, 100, 'Allowed'
      )
    `);
    
    // 3. Insert sample announcements
    console.log("Creating announcements...");
    await db.execute(sql`
      INSERT INTO announcements (id, title, content, type, is_active, created_at, updated_at)
      VALUES 
        (1, 'Welcome to SuperCoin', 'Welcome to our cryptocurrency trading platform. Start trading today!', 'News', TRUE, '2025-08-13 09:56:58', '2025-08-13 09:56:58'),
        (2, 'System Maintenance', 'Scheduled maintenance will be performed on Sunday 2:00-4:00 AM UTC.', 'Alert', TRUE, '2025-08-13 09:56:58', '2025-08-13 09:56:58'),
        (3, 'New Features Available', 'We have added new trading pairs and improved our order processing system.', 'Update', TRUE, '2025-08-13 09:56:58', '2025-08-13 09:56:58')
    `);
    
    // 4. Update sequences
    console.log("Updating sequences...");
    await db.execute(sql`SELECT setval('users_id_seq', 1)`);
    await db.execute(sql`SELECT setval('announcements_id_seq', 3)`);
    
    console.log("Migration completed successfully!");
    
    // Print summary
    const userCount = await db.select().from(schema.users);
    const announcementCount = await db.select().from(schema.announcements);
    
    console.log("\n=== Migration Summary ===");
    console.log(`Users: ${userCount.length}`);
    console.log(`Announcements: ${announcementCount.length}`);
    console.log("========================\n");
    console.log("Admin Login:");
    console.log("  Username: admin");
    console.log("  Password: admin123");
    
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();

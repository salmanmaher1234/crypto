import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("customer"), // customer, admin
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  availableBalance: decimal("available_balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  frozenBalance: decimal("frozen_balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  reputation: integer("reputation").notNull().default(85),
  winLoseSetting: text("win_lose_setting").notNull().default("To Win"), // To Win, To Lose, Random
  direction: text("direction").notNull().default("Actual"), // Buy Up, Buy the Dip, Actual
  accountStatus: text("account_status").notNull().default("Active"), // Active, Prohibit
  withdrawalStatus: text("withdrawal_status").notNull().default("Allowed"), // Allowed, Prohibit
  fundPassword: text("fund_password"),
  agentInvitationCode: text("agent_invitation_code"),
  invitationCode: text("invitation_code"),
  profileImage: text("profile_image"),
  signatureData: text("signature_data"),
  signatureName: text("signature_name"),
  isActive: boolean("is_active").notNull().default(true),
});

export const bankAccounts = pgTable("bank_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  accountHolderName: text("account_holder_name").notNull(),
  accountNumber: text("account_number").notNull(),
  bankName: text("bank_name").notNull(),
  ifscCode: text("ifsc_code").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // deposit, withdrawal, trade_win, trade_loss, freeze, unfreeze
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, rejected
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bettingOrders = pgTable("betting_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  orderId: text("order_id").notNull().unique(),
  asset: text("asset").notNull(), // BTC/USD, ETH/USD
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  direction: text("direction").notNull(), // Buy Up, Buy Down
  duration: integer("duration").notNull(), // in seconds: 30, 60, 120, 180, 240
  entryPrice: decimal("entry_price", { precision: 10, scale: 2 }).notNull(),
  exitPrice: decimal("exit_price", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("active"), // active, completed, cancelled
  result: text("result"), // win, loss
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const withdrawalRequests = pgTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bankAccountId: integer("bank_account_id").notNull().references(() => bankAccounts.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("News"), // News, Important, Maintenance, Update
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  balance: true,
  availableBalance: true,
  frozenBalance: true,
  reputation: true,
  winLoseSetting: true,
  direction: true,
  accountStatus: true,
  withdrawalStatus: true,
  isActive: true,
});

export const insertBankAccountSchema = createInsertSchema(bankAccounts).omit({
  id: true,
  isDefault: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertBettingOrderSchema = createInsertSchema(bettingOrders).omit({
  id: true,
  orderId: true,
  exitPrice: true,
  status: true,
  result: true,
  createdAt: true,
  expiresAt: true,
});

export const insertWithdrawalRequestSchema = createInsertSchema(withdrawalRequests).omit({
  id: true,
  status: true,
  createdAt: true,
  processedAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  isActive: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type BettingOrder = typeof bettingOrders.$inferSelect;
export type InsertBettingOrder = z.infer<typeof insertBettingOrderSchema>;
export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type InsertWithdrawalRequest = z.infer<typeof insertWithdrawalRequestSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

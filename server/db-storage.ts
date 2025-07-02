import { db } from "./db";
import { 
  users, 
  bankAccounts, 
  transactions, 
  bettingOrders, 
  withdrawalRequests, 
  announcements 
} from "@shared/schema";
import type { 
  User, 
  InsertUser, 
  BankAccount, 
  InsertBankAccount, 
  Transaction, 
  InsertTransaction, 
  BettingOrder, 
  InsertBettingOrder, 
  WithdrawalRequest, 
  InsertWithdrawalRequest, 
  Announcement, 
  InsertAnnouncement 
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Bank accounts
  async getBankAccountsByUserId(userId: number): Promise<BankAccount[]> {
    return await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
  }

  async createBankAccount(bankAccount: InsertBankAccount): Promise<BankAccount> {
    const result = await db.insert(bankAccounts).values(bankAccount).returning();
    return result[0];
  }

  async getBankAccount(id: number): Promise<BankAccount | undefined> {
    const result = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id)).limit(1);
    return result[0];
  }

  async updateBankAccount(id: number, updates: Partial<BankAccount>): Promise<BankAccount | undefined> {
    const result = await db.update(bankAccounts)
      .set(updates)
      .where(eq(bankAccounts.id, id))
      .returning();
    return result[0];
  }

  // Transactions
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const result = await db.update(transactions).set(updates).where(eq(transactions.id, id)).returning();
    return result[0];
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  // Betting orders
  async getBettingOrdersByUserId(userId: number): Promise<BettingOrder[]> {
    return await db.select().from(bettingOrders).where(eq(bettingOrders.userId, userId)).orderBy(desc(bettingOrders.createdAt));
  }

  async createBettingOrder(order: InsertBettingOrder): Promise<BettingOrder> {
    const result = await db.insert(bettingOrders).values(order).returning();
    return result[0];
  }

  async updateBettingOrder(id: number, updates: Partial<BettingOrder>): Promise<BettingOrder | undefined> {
    const result = await db.update(bettingOrders).set(updates).where(eq(bettingOrders.id, id)).returning();
    return result[0];
  }

  async getAllBettingOrders(): Promise<BettingOrder[]> {
    return await db.select().from(bettingOrders).orderBy(desc(bettingOrders.createdAt));
  }

  async getActiveBettingOrders(): Promise<BettingOrder[]> {
    return await db.select().from(bettingOrders).where(eq(bettingOrders.status, "active")).orderBy(desc(bettingOrders.createdAt));
  }

  // Withdrawal requests
  async getWithdrawalRequestsByUserId(userId: number): Promise<WithdrawalRequest[]> {
    return await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.userId, userId)).orderBy(desc(withdrawalRequests.createdAt));
  }

  async createWithdrawalRequest(request: InsertWithdrawalRequest): Promise<WithdrawalRequest> {
    const result = await db.insert(withdrawalRequests).values(request).returning();
    return result[0];
  }

  async updateWithdrawalRequest(id: number, updates: Partial<WithdrawalRequest>): Promise<WithdrawalRequest | undefined> {
    const result = await db.update(withdrawalRequests).set(updates).where(eq(withdrawalRequests.id, id)).returning();
    return result[0];
  }

  async getPendingWithdrawalRequests(): Promise<WithdrawalRequest[]> {
    return await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.status, "pending")).orderBy(desc(withdrawalRequests.createdAt));
  }

  // Announcements
  async getActiveAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.isActive, true)).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const result = await db.insert(announcements).values(announcement).returning();
    return result[0];
  }

  async updateAnnouncement(id: number, updates: Partial<Announcement>): Promise<Announcement | undefined> {
    const result = await db.update(announcements).set(updates).where(eq(announcements.id, id)).returning();
    return result[0];
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }
}
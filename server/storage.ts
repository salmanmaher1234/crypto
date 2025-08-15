import type { 
  User, InsertUser,
  BettingOrder, InsertBettingOrder,
  Transaction, InsertTransaction,
  BankAccount, InsertBankAccount
} from "@shared/schema";
import { db } from "./db";
import { users, bettingOrders, transactions, bankAccounts } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;

  // Betting Orders
  getBettingOrders(userId?: number): Promise<BettingOrder[]>;
  getBettingOrderById(id: number): Promise<BettingOrder | undefined>;
  createBettingOrder(order: InsertBettingOrder): Promise<BettingOrder>;
  updateBettingOrder(id: number, order: Partial<InsertBettingOrder>): Promise<BettingOrder>;
  deleteBettingOrder(id: number): Promise<void>;

  // Transactions
  getTransactions(userId?: number): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction>;
  deleteTransaction(id: number): Promise<void>;

  // Bank Accounts
  getBankAccounts(userId?: number): Promise<BankAccount[]>;
  getBankAccountById(id: number): Promise<BankAccount | undefined>;
  createBankAccount(account: InsertBankAccount): Promise<BankAccount>;
  updateBankAccount(id: number, account: Partial<InsertBankAccount>): Promise<BankAccount>;
  deleteBankAccount(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserById(id: number): Promise<User | undefined> {
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

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Betting Orders
  async getBettingOrders(userId?: number): Promise<BettingOrder[]> {
    if (userId) {
      return await db.select().from(bettingOrders).where(eq(bettingOrders.userId, userId));
    }
    return await db.select().from(bettingOrders);
  }

  async getBettingOrderById(id: number): Promise<BettingOrder | undefined> {
    const result = await db.select().from(bettingOrders).where(eq(bettingOrders.id, id)).limit(1);
    return result[0];
  }

  async createBettingOrder(order: InsertBettingOrder): Promise<BettingOrder> {
    const result = await db.insert(bettingOrders).values(order).returning();
    return result[0];
  }

  async updateBettingOrder(id: number, order: Partial<InsertBettingOrder>): Promise<BettingOrder> {
    const result = await db.update(bettingOrders).set(order).where(eq(bettingOrders.id, id)).returning();
    return result[0];
  }

  async deleteBettingOrder(id: number): Promise<void> {
    await db.delete(bettingOrders).where(eq(bettingOrders.id, id));
  }

  // Transactions
  async getTransactions(userId?: number): Promise<Transaction[]> {
    if (userId) {
      return await db.select().from(transactions).where(eq(transactions.userId, userId));
    }
    return await db.select().from(transactions);
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
    return result[0];
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction> {
    const result = await db.update(transactions).set(transaction).where(eq(transactions.id, id)).returning();
    return result[0];
  }

  async deleteTransaction(id: number): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  }

  // Bank Accounts
  async getBankAccounts(userId?: number): Promise<BankAccount[]> {
    if (userId) {
      return await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
    }
    return await db.select().from(bankAccounts);
  }

  async getBankAccountById(id: number): Promise<BankAccount | undefined> {
    const result = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id)).limit(1);
    return result[0];
  }

  async createBankAccount(account: InsertBankAccount): Promise<BankAccount> {
    const result = await db.insert(bankAccounts).values(account).returning();
    return result[0];
  }

  async updateBankAccount(id: number, account: Partial<InsertBankAccount>): Promise<BankAccount> {
    const result = await db.update(bankAccounts).set(account).where(eq(bankAccounts.id, id)).returning();
    return result[0];
  }

  async deleteBankAccount(id: number): Promise<void> {
    await db.delete(bankAccounts).where(eq(bankAccounts.id, id));
  }
}
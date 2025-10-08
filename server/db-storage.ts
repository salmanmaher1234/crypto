import { db } from "./db";
import { 
  users, 
  bankAccounts, 
  transactions, 
  bettingOrders, 
  withdrawalRequests, 
  announcements,
  messages,
  sessions 
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
  InsertAnnouncement,
  Message,
  InsertMessage,
  Session,
  InsertSession 
} from "@shared/schema";
import { eq, and, desc, lt } from "drizzle-orm";
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
    await db.insert(users).values(user);
    const [newUser] = await db.select().from(users).where(eq(users.username, user.username)).limit(1);
    if (!newUser) throw new Error('Failed to create user');
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    try {
      await db.update(users).set(updates).where(eq(users.id, id));
      const [updatedUser] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const existingUser = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (existingUser.length === 0) {
        throw new Error("User not found");
      }
      
      if (existingUser[0].role === "admin") {
        throw new Error("Cannot delete admin users");
      }
      
      const userBankAccounts = await db.select({ id: bankAccounts.id })
        .from(bankAccounts)
        .where(eq(bankAccounts.userId, id));
      
      for (const account of userBankAccounts) {
        await db.delete(withdrawalRequests).where(eq(withdrawalRequests.bankAccountId, account.id));
      }
      
      await db.delete(withdrawalRequests).where(eq(withdrawalRequests.userId, id));
      await db.delete(bankAccounts).where(eq(bankAccounts.userId, id));
      await db.delete(transactions).where(eq(transactions.userId, id));
      await db.delete(bettingOrders).where(eq(bettingOrders.userId, id));
      await db.delete(messages).where(eq(messages.fromUserId, id));
      await db.delete(messages).where(eq(messages.toUserId, id));
      await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getBankAccountsByUserId(userId: number): Promise<BankAccount[]> {
    return await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
  }

  async createBankAccount(bankAccount: InsertBankAccount): Promise<BankAccount> {
    await db.insert(bankAccounts).values(bankAccount);
    const [newAccount] = await db.select().from(bankAccounts)
      .where(eq(bankAccounts.accountNumber, bankAccount.accountNumber))
      .limit(1);
    if (!newAccount) throw new Error('Failed to create bank account');
    return newAccount;
  }

  async getBankAccount(id: number): Promise<BankAccount | undefined> {
    const result = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id)).limit(1);
    return result[0];
  }

  async updateBankAccount(id: number, updates: Partial<BankAccount>): Promise<BankAccount | undefined> {
    await db.update(bankAccounts).set(updates).where(eq(bankAccounts.id, id));
    const [updatedAccount] = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id)).limit(1);
    return updatedAccount;
  }

  async deleteBankAccount(id: number): Promise<boolean> {
    await db.delete(bankAccounts).where(eq(bankAccounts.id, id));
    const [deletedAccount] = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id)).limit(1);
    return !deletedAccount;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    await db.insert(transactions).values(transaction);
    const [newTransaction] = await db.select().from(transactions)
      .where(eq(transactions.userId, transaction.userId))
      .orderBy(desc(transactions.createdAt))
      .limit(1);
    if (!newTransaction) throw new Error('Failed to create transaction');
    return newTransaction;
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    await db.update(transactions).set(updates).where(eq(transactions.id, id));
    const [updatedTransaction] = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
    return updatedTransaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getBettingOrdersByUserId(userId: number): Promise<BettingOrder[]> {
    const result = await db
      .select({
        id: bettingOrders.id,
        userId: bettingOrders.userId,
        username: users.username,
        orderId: bettingOrders.orderId,
        asset: bettingOrders.asset,
        amount: bettingOrders.amount,
        direction: bettingOrders.direction,
        duration: bettingOrders.duration,
        entryPrice: bettingOrders.entryPrice,
        exitPrice: bettingOrders.exitPrice,
        status: bettingOrders.status,
        result: bettingOrders.result,
        createdAt: bettingOrders.createdAt,
        expiresAt: bettingOrders.expiresAt,
      })
      .from(bettingOrders)
      .leftJoin(users, eq(bettingOrders.userId, users.id))
      .where(eq(bettingOrders.userId, userId))
      .orderBy(desc(bettingOrders.createdAt));
    
    return result as BettingOrder[];
  }

  async createBettingOrder(orderData: any): Promise<BettingOrder> {
    await db.insert(bettingOrders).values(orderData);
    
    const [newOrder] = await db.select().from(bettingOrders).where(eq(bettingOrders.orderId, orderData.orderId)).limit(1);
    
    if (!newOrder) {
      throw new Error('Failed to create betting order');
    }

    setTimeout(async () => {
      await this.expireOrder(newOrder.id);
    }, orderData.duration * 1000);
    
    return newOrder;
  }

  async checkExpiredOrders(): Promise<void> {
    try {
      const activeOrders = await db.select()
        .from(bettingOrders)
        .where(eq(bettingOrders.status, "active"));

      for (const order of activeOrders) {
        if (order.expiresAt && new Date() > new Date(order.expiresAt)) {
          console.log(`Found expired order: ${order.orderId}, expiring now...`);
          await this.expireOrder(order.id);
        }
      }
    } catch (error) {
      console.error('Error checking expired orders:', error);
    }
  }

  private async expireOrder(orderId: number) {
    try {
      const orderResult = await db.select().from(bettingOrders).where(eq(bettingOrders.id, orderId));
      const order = orderResult[0];
      
      if (!order || order.status !== "active") return;

      const userResult = await db.select().from(users).where(eq(users.id, order.userId));
      const user = userResult[0];
      
      if (!user) return;

      const orderAmount = parseFloat(order.amount);
      const profitPercentage = this.getScaleBasedProfitPercentage(order.duration);
      const baseProfitAmount = orderAmount * (profitPercentage / 100);
      
      let finalProfitAmount = baseProfitAmount;
      let result: "win" | "loss" = "win";
      let balanceImpact = baseProfitAmount;
      
      if (user.direction === "Actual") {
        if (order.direction === "Buy Up") {
          balanceImpact = baseProfitAmount;
          result = "win";
        } else if (order.direction === "Buy Down") {
          balanceImpact = -baseProfitAmount;
          result = "loss";
        } else {
          balanceImpact = baseProfitAmount;
          result = "win";
        }
      } else if (user.direction === "Buy Up") {
        balanceImpact = baseProfitAmount;
        result = "win";
      } else if (user.direction === "Buy Down") {
        balanceImpact = -baseProfitAmount;
        result = "loss";
      }

      const currentAvailable = parseFloat(user.availableBalance || user.balance || "0");
      const currentBalance = parseFloat(user.balance || "0");
      
      const newAvailable = currentAvailable + orderAmount + balanceImpact;
      const newBalance = currentBalance + balanceImpact;

      let newReputation = user.reputation || 100;
      if (user.direction === "Actual") {
        newReputation = user.reputation || 100;
      } else if (balanceImpact > 0) {
        newReputation = Math.min(100, newReputation + 5);
      } else if (balanceImpact < 0) {
        newReputation = Math.max(0, newReputation - 5);
      }

      await db.update(users).set({
        availableBalance: newAvailable.toFixed(2),
        balance: newBalance.toFixed(2),
        reputation: newReputation,
      }).where(eq(users.id, order.userId));

      await db.update(bettingOrders).set({
        status: "completed",
        result,
        exitPrice: order.entryPrice,
      }).where(eq(bettingOrders.id, orderId));

      console.log(`Order ${order.orderId} expired and completed with ${profitPercentage}% profit: +${finalProfitAmount.toFixed(2)}`);
    } catch (error) {
      console.error('Error expiring order:', error);
    }
  }

  private getScaleBasedProfitPercentage(duration: number): number {
    switch (duration) {
      case 30: return 20;
      case 60: return 30;
      case 120: return 40;
      case 180: return 50;
      case 240: return 60;
      default: return 20;
    }
  }

  async updateBettingOrder(id: number, updates: Partial<BettingOrder>): Promise<BettingOrder | undefined> {
    await db.update(bettingOrders).set(updates).where(eq(bettingOrders.id, id));
    const [updatedOrder] = await db.select().from(bettingOrders).where(eq(bettingOrders.id, id)).limit(1);
    return updatedOrder;
  }

  async getAllBettingOrders(): Promise<BettingOrder[]> {
    const result = await db
      .select({
        id: bettingOrders.id,
        userId: bettingOrders.userId,
        username: users.username,
        orderId: bettingOrders.orderId,
        asset: bettingOrders.asset,
        amount: bettingOrders.amount,
        direction: bettingOrders.direction,
        duration: bettingOrders.duration,
        entryPrice: bettingOrders.entryPrice,
        exitPrice: bettingOrders.exitPrice,
        status: bettingOrders.status,
        result: bettingOrders.result,
        createdAt: bettingOrders.createdAt,
        expiresAt: bettingOrders.expiresAt,
      })
      .from(bettingOrders)
      .leftJoin(users, eq(bettingOrders.userId, users.id))
      .orderBy(desc(bettingOrders.createdAt));
    
    return result as BettingOrder[];
  }

  async getActiveBettingOrders(): Promise<BettingOrder[]> {
    const result = await db
      .select({
        id: bettingOrders.id,
        userId: bettingOrders.userId,
        username: users.username,
        orderId: bettingOrders.orderId,
        asset: bettingOrders.asset,
        amount: bettingOrders.amount,
        direction: bettingOrders.direction,
        duration: bettingOrders.duration,
        entryPrice: bettingOrders.entryPrice,
        exitPrice: bettingOrders.exitPrice,
        status: bettingOrders.status,
        result: bettingOrders.result,
        createdAt: bettingOrders.createdAt,
        expiresAt: bettingOrders.expiresAt,
      })
      .from(bettingOrders)
      .leftJoin(users, eq(bettingOrders.userId, users.id))
      .where(eq(bettingOrders.status, "active"))
      .orderBy(desc(bettingOrders.createdAt));
    
    return result as BettingOrder[];
  }

  async getWithdrawalRequestsByUserId(userId: number): Promise<WithdrawalRequest[]> {
    return await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.userId, userId)).orderBy(desc(withdrawalRequests.createdAt));
  }

  async createWithdrawalRequest(request: InsertWithdrawalRequest): Promise<WithdrawalRequest> {
    await db.insert(withdrawalRequests).values(request);
    const [newRequest] = await db.select().from(withdrawalRequests)
      .where(eq(withdrawalRequests.userId, request.userId))
      .orderBy(desc(withdrawalRequests.createdAt))
      .limit(1);
    if (!newRequest) throw new Error('Failed to create withdrawal request');
    return newRequest;
  }

  async updateWithdrawalRequest(id: number, updates: Partial<WithdrawalRequest>): Promise<WithdrawalRequest | undefined> {
    await db.update(withdrawalRequests).set(updates).where(eq(withdrawalRequests.id, id));
    const [updatedRequest] = await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.id, id)).limit(1);
    return updatedRequest;
  }

  async getPendingWithdrawalRequests(): Promise<WithdrawalRequest[]> {
    return await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.status, "pending")).orderBy(desc(withdrawalRequests.createdAt));
  }

  async getActiveAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.isActive, true)).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    await db.insert(announcements).values(announcement);
    const [newAnnouncement] = await db.select().from(announcements)
      .where(eq(announcements.title, announcement.title))
      .orderBy(desc(announcements.createdAt))
      .limit(1);
    if (!newAnnouncement) throw new Error('Failed to create announcement');
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, updates: Partial<Announcement>): Promise<Announcement | undefined> {
    await db.update(announcements).set(updates).where(eq(announcements.id, id));
    const [updatedAnnouncement] = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
    return updatedAnnouncement;
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }

  async getAllBankAccountsWithUsers(): Promise<any[]> {
    return await db
      .select({
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        bankAccountId: bankAccounts.id,
        accountHolderName: bankAccounts.accountHolderName,
        bankName: bankAccounts.bankName,
        accountNumber: bankAccounts.accountNumber,
        branchName: bankAccounts.branchName,
        ifscCode: bankAccounts.ifscCode,
      })
      .from(users)
      .leftJoin(bankAccounts, eq(users.id, bankAccounts.userId))
      .where(eq(users.role, "customer"))
      .orderBy(users.id, bankAccounts.id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    await db.insert(messages).values(insertMessage);
    const [newMessage] = await db.select().from(messages)
      .where(eq(messages.fromUserId, insertMessage.fromUserId))
      .orderBy(desc(messages.createdAt))
      .limit(1);
    if (!newMessage) throw new Error('Failed to create message');
    return newMessage;
  }

  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.toUserId, userId)).orderBy(desc(messages.createdAt));
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    try {
      await db.update(messages).set({ isRead: true }).where(eq(messages.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    await db.insert(sessions).values(insertSession);
    const [row] = await db.select().from(sessions).where(eq(sessions.id, insertSession.id)).limit(1);
    if (!row) throw new Error('Failed to create session');
    return row;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const result = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
    return result[0];
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
      return true;
    } catch (error) {
      return false;
    }
  }

  async cleanupExpiredSessions(): Promise<number> {
    try {
      const now = new Date();
      await db.delete(sessions).where(lt(sessions.expiresAt, now));
      return 1;
    } catch (error) {
      return 0;
    }
  }

  async updateMessage(id: number, updates: Partial<Message>): Promise<Message | undefined> {
    try {
      await db.update(messages).set(updates).where(eq(messages.id, id));
      const [updatedMessage] = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
      return updatedMessage;
    } catch (error) {
      return undefined;
    }
  }
}
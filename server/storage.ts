import {
  users,
  bankAccounts,
  transactions,
  bettingOrders,
  withdrawalRequests,
  announcements,
  type User,
  type InsertUser,
  type BankAccount,
  type InsertBankAccount,
  type Transaction,
  type InsertTransaction,
  type BettingOrder,
  type InsertBettingOrder,
  type WithdrawalRequest,
  type InsertWithdrawalRequest,
  type Announcement,
  type InsertAnnouncement,
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Bank accounts
  getBankAccountsByUserId(userId: number): Promise<BankAccount[]>;
  createBankAccount(bankAccount: InsertBankAccount): Promise<BankAccount>;
  getBankAccount(id: number): Promise<BankAccount | undefined>;
  updateBankAccount(id: number, updates: Partial<BankAccount>): Promise<BankAccount | undefined>;
  
  // Transactions
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined>;
  getAllTransactions(): Promise<Transaction[]>;
  
  // Betting orders
  getBettingOrdersByUserId(userId: number): Promise<BettingOrder[]>;
  createBettingOrder(order: InsertBettingOrder): Promise<BettingOrder>;
  updateBettingOrder(id: number, updates: Partial<BettingOrder>): Promise<BettingOrder | undefined>;
  getAllBettingOrders(): Promise<BettingOrder[]>;
  getActiveBettingOrders(): Promise<BettingOrder[]>;
  
  // Withdrawal requests
  getWithdrawalRequestsByUserId(userId: number): Promise<WithdrawalRequest[]>;
  createWithdrawalRequest(request: InsertWithdrawalRequest): Promise<WithdrawalRequest>;
  updateWithdrawalRequest(id: number, updates: Partial<WithdrawalRequest>): Promise<WithdrawalRequest | undefined>;
  getPendingWithdrawalRequests(): Promise<WithdrawalRequest[]>;
  
  // Announcements
  getActiveAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, updates: Partial<Announcement>): Promise<Announcement | undefined>;
  getAllAnnouncements(): Promise<Announcement[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bankAccounts: Map<number, BankAccount>;
  private transactions: Map<number, Transaction>;
  private bettingOrders: Map<number, BettingOrder>;
  private withdrawalRequests: Map<number, WithdrawalRequest>;
  private announcements: Map<number, Announcement>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.bankAccounts = new Map();
    this.transactions = new Map();
    this.bettingOrders = new Map();
    this.withdrawalRequests = new Map();
    this.announcements = new Map();
    this.currentId = 1;

    // Create admin user with full data
    const adminId = this.currentId++;
    const admin: User = {
      id: adminId,
      username: "admin",
      email: "admin@cryptoinvest.com", 
      password: "admin123",
      name: "Administrator",
      role: "admin",
      balance: "10000.00",
      availableBalance: "10000.00",
      frozenBalance: "0.00",
      reputation: 100,
      winLoseSetting: "To Win",
      direction: "Actual",
      accountStatus: "Active",
      withdrawalStatus: "Allowed",
      fundPassword: null,
      invitationCode: null,
      agentInvitationCode: null,
      isActive: true,
    };
    this.users.set(adminId, admin);

    // Create customer user with full data  
    const customerId = this.currentId++;
    const customer: User = {
      id: customerId,
      username: "sarah",
      email: "sarah@email.com",
      password: "password123", 
      name: "Sarah Johnson",
      role: "customer",
      balance: "10500.00",
      availableBalance: "10000.00",
      frozenBalance: "500.00",
      reputation: 85,
      winLoseSetting: "To Win",
      direction: "Actual",
      accountStatus: "Active",
      withdrawalStatus: "Allowed",
      fundPassword: null,
      invitationCode: null,
      agentInvitationCode: null,
      isActive: true,
    };
    this.users.set(customerId, customer);

    // Add sample betting orders for sarah - use hard-coded ID 2 since that's the second user
    this.addSampleBettingOrders(2);
    
    // Debug: Log the created orders
    console.log(`Created ${this.bettingOrders.size} betting orders for user 2`);
  }

  private addSampleBettingOrders(userId: number) {
    const now = new Date();
    const baseTime = new Date('2025-06-08T13:03:49.000Z');

    // Sample closed orders
    const closedOrder1: BettingOrder = {
      id: this.currentId++,
      userId: userId,
      currency: "BTC/USDT",
      orderType: "down",
      amount: "12000",
      entryPrice: "42150.00",
      duration: "120s",
      status: "completed",
      profit: "14800",
      exitPrice: "41950.00",
      createdAt: baseTime,
      updatedAt: baseTime,
      expiresAt: new Date(baseTime.getTime() + 120000)
    };
    this.bettingOrders.set(closedOrder1.id, closedOrder1);
    console.log(`Added order ${closedOrder1.id} for user ${userId}`);

    const closedOrder2: BettingOrder = {
      id: this.currentId++,
      userId: userId,
      currency: "BTC/USDT",
      orderType: "down", 
      amount: "12000",
      entryPrice: "42200.00",
      duration: "60s",
      status: "completed",
      profit: "16800",
      exitPrice: "41800.00",
      createdAt: new Date(baseTime.getTime() - 3600000),
      updatedAt: new Date(baseTime.getTime() - 3600000),
      expiresAt: new Date(baseTime.getTime() - 3600000 + 60000)
    };
    this.bettingOrders.set(closedOrder2.id, closedOrder2);

    const closedOrder3: BettingOrder = {
      id: this.currentId++,
      userId: userId,
      currency: "BTC/USDT",
      orderType: "up",
      amount: "8000", 
      entryPrice: "41900.00",
      duration: "60s",
      status: "completed",
      profit: "9120",
      exitPrice: "42150.00",
      createdAt: new Date(baseTime.getTime() - 7200000),
      updatedAt: new Date(baseTime.getTime() - 7200000),
      expiresAt: new Date(baseTime.getTime() - 7200000 + 60000)
    };
    this.bettingOrders.set(closedOrder3.id, closedOrder3);

    // Sample pending order
    const pendingOrder: BettingOrder = {
      id: this.currentId++,
      userId: userId,
      currency: "ETH/USDT",
      orderType: "up",
      amount: "5000",
      entryPrice: "2450.00", 
      duration: "180s",
      status: "pending",
      createdAt: new Date(now.getTime() - 1800000),
      updatedAt: new Date(now.getTime() - 1800000),
      expiresAt: new Date(now.getTime() - 1800000 + 180000)
    };
    this.bettingOrders.set(pendingOrder.id, pendingOrder);

    // Sample cancelled order
    const cancelledOrder: BettingOrder = {
      id: this.currentId++,
      userId: userId,
      currency: "SOL/USDT",
      orderType: "down",
      amount: "3000",
      entryPrice: "98.50",
      duration: "90s",
      status: "cancelled", 
      createdAt: new Date(baseTime.getTime() - 86400000),
      updatedAt: new Date(baseTime.getTime() - 86400000),
      expiresAt: new Date(baseTime.getTime() - 86400000 + 90000)
    };
    this.bettingOrders.set(cancelledOrder.id, cancelledOrder);
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name,
      role: insertUser.role || "customer",
      balance: "0.00",
      availableBalance: "0.00",
      frozenBalance: "0.00",
      reputation: 85,
      winLoseSetting: "To Win",
      direction: "Actual",
      accountStatus: "Active",
      withdrawalStatus: "Allowed",
      fundPassword: insertUser.fundPassword || null,
      invitationCode: insertUser.invitationCode || null,
      agentInvitationCode: null,
      isActive: true,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Bank accounts
  async getBankAccountsByUserId(userId: number): Promise<BankAccount[]> {
    return Array.from(this.bankAccounts.values()).filter(account => account.userId === userId);
  }

  async createBankAccount(insertBankAccount: InsertBankAccount): Promise<BankAccount> {
    const id = this.currentId++;
    const bankAccount: BankAccount = {
      ...insertBankAccount,
      id,
      isDefault: false,
    };
    this.bankAccounts.set(id, bankAccount);
    return bankAccount;
  }

  async getBankAccount(id: number): Promise<BankAccount | undefined> {
    return this.bankAccounts.get(id);
  }

  async updateBankAccount(id: number, updates: Partial<BankAccount>): Promise<BankAccount | undefined> {
    const existingAccount = this.bankAccounts.get(id);
    if (!existingAccount) {
      return undefined;
    }
    
    const updatedAccount = { ...existingAccount, ...updates };
    this.bankAccounts.set(id, updatedAccount);
    return updatedAccount;
  }

  // Transactions
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentId++;
    const transaction: Transaction = {
      id,
      userId: insertTransaction.userId,
      type: insertTransaction.type,
      amount: insertTransaction.amount,
      status: insertTransaction.status || "pending",
      description: insertTransaction.description || null,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...updates };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Betting orders
  async getBettingOrdersByUserId(userId: number): Promise<BettingOrder[]> {
    return Array.from(this.bettingOrders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createBettingOrder(insertOrder: InsertBettingOrder): Promise<BettingOrder> {
    const id = this.currentId++;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + insertOrder.duration * 1000);
    
    const order: BettingOrder = {
      ...insertOrder,
      id,
      orderId: `${insertOrder.asset.replace('/', '')}_${id}`,
      status: "active",
      result: null,
      exitPrice: null,
      createdAt: now,
      expiresAt,
    };
    this.bettingOrders.set(id, order);
    return order;
  }

  async updateBettingOrder(id: number, updates: Partial<BettingOrder>): Promise<BettingOrder | undefined> {
    const order = this.bettingOrders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updates };
    this.bettingOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getAllBettingOrders(): Promise<BettingOrder[]> {
    return Array.from(this.bettingOrders.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getActiveBettingOrders(): Promise<BettingOrder[]> {
    return Array.from(this.bettingOrders.values())
      .filter(order => order.status === "active")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Withdrawal requests
  async getWithdrawalRequestsByUserId(userId: number): Promise<WithdrawalRequest[]> {
    return Array.from(this.withdrawalRequests.values())
      .filter(request => request.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createWithdrawalRequest(insertRequest: InsertWithdrawalRequest): Promise<WithdrawalRequest> {
    const id = this.currentId++;
    const request: WithdrawalRequest = {
      ...insertRequest,
      id,
      status: "pending",
      createdAt: new Date(),
      processedAt: null,
    };
    this.withdrawalRequests.set(id, request);
    return request;
  }

  async updateWithdrawalRequest(id: number, updates: Partial<WithdrawalRequest>): Promise<WithdrawalRequest | undefined> {
    const request = this.withdrawalRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.withdrawalRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async getPendingWithdrawalRequests(): Promise<WithdrawalRequest[]> {
    return Array.from(this.withdrawalRequests.values())
      .filter(request => request.status === "pending")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Announcements
  async getActiveAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .filter(announcement => announcement.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = this.currentId++;
    const announcement: Announcement = {
      id,
      title: insertAnnouncement.title,
      content: insertAnnouncement.content,
      type: insertAnnouncement.type || "News",
      isActive: true,
      createdAt: new Date(),
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: number, updates: Partial<Announcement>): Promise<Announcement | undefined> {
    const announcement = this.announcements.get(id);
    if (!announcement) return undefined;
    
    const updatedAnnouncement = { ...announcement, ...updates };
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const storage = new MemStorage();

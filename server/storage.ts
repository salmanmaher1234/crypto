import {
  users,
  bankAccounts,
  transactions,
  bettingOrders,
  withdrawalRequests,
  announcements,
  messages,
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
  type Message,
  type InsertMessage,
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Bank accounts
  getBankAccountsByUserId(userId: number): Promise<BankAccount[]>;
  createBankAccount(bankAccount: InsertBankAccount): Promise<BankAccount>;
  getBankAccount(id: number): Promise<BankAccount | undefined>;
  updateBankAccount(id: number, updates: Partial<BankAccount>): Promise<BankAccount | undefined>;
  deleteBankAccount(id: number): Promise<boolean>;
  
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
  getAllBankAccountsWithUsers(): Promise<any[]>;
  
  // Messages
  getMessagesByUserId(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, updates: Partial<Message>): Promise<Message | undefined>;
  markMessageAsRead(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bankAccounts: Map<number, BankAccount>;
  private transactions: Map<number, Transaction>;
  private bettingOrders: Map<number, BettingOrder>;
  private withdrawalRequests: Map<number, WithdrawalRequest>;
  private announcements: Map<number, Announcement>;
  private messages: Map<number, Message>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.bankAccounts = new Map();
    this.transactions = new Map();
    this.bettingOrders = new Map();
    this.withdrawalRequests = new Map();
    this.announcements = new Map();
    this.messages = new Map();
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
      reputation: 5,
      winLoseSetting: "To Win",
      direction: "Actual",
      accountStatus: "Active",
      withdrawalStatus: "Allowed",
      fundPassword: null,
      invitationCode: null,
      agentInvitationCode: null,
      profileImage: null,
      signatureData: null,
      signatureName: null,
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
      reputation: 5,
      winLoseSetting: "To Win",
      direction: "Actual",
      accountStatus: "Active",
      withdrawalStatus: "Allowed",
      fundPassword: null,
      invitationCode: null,
      agentInvitationCode: null,
      profileImage: null,
      signatureData: null,
      signatureName: null,
      isActive: true,
    };
    this.users.set(customerId, customer);

    // Create additional customer user
    const johnId = this.currentId++;
    const john: User = {
      id: johnId,
      username: "john",
      email: "john@email.com",
      password: "password123",
      name: "John Smith", 
      role: "customer",
      balance: "8500.00",
      availableBalance: "8000.00",
      frozenBalance: "500.00",
      reputation: 5,
      winLoseSetting: "To Win",
      direction: "Actual",
      accountStatus: "Active",
      withdrawalStatus: "Allowed",
      fundPassword: null,
      invitationCode: null,
      agentInvitationCode: null,
      profileImage: null,
      signatureData: null,
      signatureName: null,
      isActive: true,
    };
    this.users.set(johnId, john);

    // Add sample betting orders for sarah - use hard-coded ID 2 since that's the second user
    this.addSampleBettingOrders(2);
    
    // Add sample messages from admin to customer
    this.addSampleMessages(adminId, customerId);
    
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
      reputation: 5, // Always set to 5 for all new users
      winLoseSetting: "To Win",
      direction: "Actual",
      accountStatus: "Active",
      withdrawalStatus: "Allowed",
      fundPassword: insertUser.fundPassword || null,
      invitationCode: insertUser.invitationCode || null,
      agentInvitationCode: null,
      profileImage: null,
      signatureData: null,
      signatureName: null,
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

  async deleteUser(id: number): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;
    
    // Don't allow deleting admin users
    if (user.role === "admin") return false;
    
    // Delete all related data
    this.users.delete(id);
    
    // Remove user's bank accounts
    Array.from(this.bankAccounts.entries())
      .filter(([, account]) => account.userId === id)
      .forEach(([accountId]) => this.bankAccounts.delete(accountId));
    
    // Remove user's transactions
    Array.from(this.transactions.entries())
      .filter(([, transaction]) => transaction.userId === id)
      .forEach(([transactionId]) => this.transactions.delete(transactionId));
    
    // Remove user's betting orders
    Array.from(this.bettingOrders.entries())
      .filter(([, order]) => order.userId === id)
      .forEach(([orderId]) => this.bettingOrders.delete(orderId));
    
    // Remove user's withdrawal requests
    Array.from(this.withdrawalRequests.entries())
      .filter(([, request]) => request.userId === id)
      .forEach(([requestId]) => this.withdrawalRequests.delete(requestId));
    
    // Remove user's messages
    Array.from(this.messages.entries())
      .filter(([, message]) => message.recipientId === id || message.senderId === id)
      .forEach(([messageId]) => this.messages.delete(messageId));
    
    return true;
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

  async deleteBankAccount(id: number): Promise<boolean> {
    return this.bankAccounts.delete(id);
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
      .map(order => {
        const user = this.users.get(order.userId);
        return {
          ...order,
          username: user?.username || `User${order.userId}`
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createBettingOrder(insertOrder: InsertBettingOrder): Promise<BettingOrder> {
    const id = this.currentId++;
    const userId = insertOrder.userId;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + insertOrder.duration * 1000);
    
    // Deduct amount from user's available balance
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const currentAvailable = parseFloat(user.availableBalance || user.balance || "0");
    const orderAmount = parseFloat(insertOrder.amount);
    
    if (orderAmount > currentAvailable) {
      throw new Error("Insufficient balance");
    }
    
    // Simply deduct order amount from available balance
    const newAvailable = currentAvailable - orderAmount;
    
    const updatedUser = {
      ...user,
      availableBalance: newAvailable.toFixed(2),
    };
    this.users.set(userId, updatedUser);
    
    // Generate static order ID that won't change
    const orderNumber = `${insertOrder.asset.replace('/', '')}_${Date.now()}_${id}`;
    
    const order: BettingOrder = {
      ...insertOrder,
      id,
      orderId: orderNumber,
      status: "active",
      result: null,
      exitPrice: null,
      createdAt: now,
      expiresAt,
    };
    this.bettingOrders.set(id, order);
    
    console.log(`Created order ${order.orderId} - deducted ${orderAmount} from available balance`);
    
    // Set up automatic order expiration with precise timing
    setTimeout(() => {
      this.expireOrder(id);
    }, insertOrder.duration * 1000);
    
    return order;
  }

  private getScaleBasedProfitPercentage(duration: number): number {
    // Scale-based profit calculation based on duration
    switch (duration) {
      case 30: return 20;  // 30s = 20% profit
      case 60: return 30;  // 60s = 30% profit
      case 120: return 40; // 120s = 40% profit
      case 180: return 50; // 180s = 50% profit
      case 240: return 60; // 240s = 60% profit
      default: return 20;  // Default to 20%
    }
  }

  private async expireOrder(orderId: number) {
    const order = this.bettingOrders.get(orderId);
    if (!order || order.status !== "active") return;
    
    // Calculate profit based on duration scale (percentage)
    const orderAmount = parseFloat(order.amount);
    const profitPercentage = this.getScaleBasedProfitPercentage(order.duration);
    const baseProfitAmount = orderAmount * (profitPercentage / 100);
    
    // Update user's available balance with original amount + profit
    const user = this.users.get(order.userId);
    if (user) {
      const currentAvailable = parseFloat(user.availableBalance || user.balance || "0");
      const currentBalance = parseFloat(user.balance || "0");
      
      // Apply direction-based profit calculation
      // Customer profits are always positive, but balance impact varies by direction
      let finalProfitAmount = baseProfitAmount; // Always positive for customer display
      let result: "win" | "loss" = "win";
      let balanceImpact = baseProfitAmount; // This affects actual balance calculation
      
      if (user.direction === "Buy Up") {
        // Buy Up = Profit is added to balance (positive impact)
        balanceImpact = baseProfitAmount;
        result = "win";
      } else if (user.direction === "Buy Down") {
        // Buy Down = Profit is subtracted from balance (negative impact) but shown as positive to customer
        balanceImpact = -baseProfitAmount;
        result = "loss"; // For display purposes, but profit amount stays positive
      } else {
        // Default "Actual" behavior - always positive
        balanceImpact = baseProfitAmount;
        result = "win";
      }
      
      // Return original order amount + calculated profit to available balance (using balanceImpact)
      const newAvailable = currentAvailable + orderAmount + balanceImpact;
      // Add/subtract profit to/from total balance (using balanceImpact)
      const newBalance = currentBalance + balanceImpact;
      
      const updatedUser = {
        ...user,
        availableBalance: newAvailable.toFixed(2),
        balance: newBalance.toFixed(2),
      };
      this.users.set(order.userId, updatedUser);
      
      console.log(`User ${user.username} (Direction: ${user.direction}) balance updated: +${finalProfitAmount.toFixed(2)} profit (Balance Impact: ${balanceImpact >= 0 ? '+' : ''}${balanceImpact.toFixed(2)}). New available: ${newAvailable.toFixed(2)}, Total balance: ${newBalance.toFixed(2)}`);
    }
    
    const updatedOrder = {
      ...order,
      status: "completed" as const,
      result, // Dynamic result based on direction
      exitPrice: order.entryPrice, // Using same price for simplicity
    };
    
    this.bettingOrders.set(orderId, updatedOrder);
    console.log(`Order ${order.orderId} expired and completed with ${profitPercentage}% profit: +${finalProfitAmount.toFixed(2)} (User Direction: ${user?.direction}, Balance Impact: ${balanceImpact >= 0 ? '+' : ''}${balanceImpact.toFixed(2)})`);
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
      .map(order => {
        const user = this.users.get(order.userId);
        return {
          ...order,
          username: user?.username || `User${order.userId}`
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getActiveBettingOrders(): Promise<BettingOrder[]> {
    return Array.from(this.bettingOrders.values())
      .filter(order => order.status === "active")
      .map(order => {
        const user = this.users.get(order.userId);
        return {
          ...order,
          username: user?.username || `User${order.userId}`
        };
      })
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

  async getAllBankAccountsWithUsers(): Promise<any[]> {
    const result: any[] = [];
    for (const user of this.users.values()) {
      if (user.role === 'customer') {
        const userBankAccounts = Array.from(this.bankAccounts.values())
          .filter(account => account.userId === user.id);
        
        if (userBankAccounts.length > 0) {
          userBankAccounts.forEach(account => {
            result.push({
              userId: user.id,
              userName: user.name,
              userEmail: user.email,
              bankAccountId: account.id,
              accountHolderName: account.accountHolderName,
              bankName: account.bankName,
              accountNumber: account.accountNumber,
              ifscCode: account.ifscCode,
            });
          });
        } else {
          result.push({
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            bankAccountId: null,
            accountHolderName: null,
            bankName: null,
            accountNumber: null,
            ifscCode: null,
          });
        }
      }
    }
    return result;
  }

  private addSampleMessages(adminId: number, customerId: number) {
    const message1: Message = {
      id: this.currentId++,
      fromUserId: adminId,
      toUserId: customerId,
      title: "Welcome to SuperCoin",
      content: "Welcome to SuperCoin platform! Your account has been successfully activated. You can now start trading cryptocurrencies.",
      type: "General",
      isRead: false,
      createdAt: new Date('2025-07-01T10:00:00.000Z'),
    };
    this.messages.set(message1.id, message1);

    const message2: Message = {
      id: this.currentId++,
      fromUserId: adminId,
      toUserId: customerId,
      title: "Trading Tips",
      content: "Remember to always do your research before making any trades. Use stop-loss orders to manage your risk effectively.",
      type: "Important",
      isRead: false,
      createdAt: new Date('2025-07-02T09:30:00.000Z'),
    };
    this.messages.set(message2.id, message2);

    const message3: Message = {
      id: this.currentId++,
      fromUserId: adminId,
      toUserId: customerId,
      title: "System Maintenance Notice",
      content: "Our system will undergo maintenance on Sunday from 2:00 AM to 4:00 AM UTC. Trading will be temporarily unavailable during this time.",
      type: "System",
      isRead: true,
      createdAt: new Date('2025-06-30T15:00:00.000Z'),
    };
    this.messages.set(message3.id, message3);
  }

  // Message methods
  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.toUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.currentId++,
      fromUserId: insertMessage.fromUserId,
      toUserId: insertMessage.toUserId,
      title: insertMessage.title,
      content: insertMessage.content,
      type: insertMessage.type || "General",
      isRead: false,
      createdAt: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }

  async updateMessage(id: number, updates: Partial<Message>): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, ...updates };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const message = this.messages.get(id);
    if (!message) return false;
    
    const updatedMessage = { ...message, isRead: true };
    this.messages.set(id, updatedMessage);
    return true;
  }
}

export const storage = new MemStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBankAccountSchema, insertTransactionSchema, insertBettingOrderSchema, insertWithdrawalRequestSchema, insertAnnouncementSchema } from "@shared/schema";

// Simple in-memory session store for development
const sessions = new Map<string, { userId: number; expires: number }>();

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getSessionUserId(req: any): number | null {
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
  if (!sessionId) return null;
  
  const session = sessions.get(sessionId);
  if (!session || session.expires < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }
  
  // Refresh session on each request
  refreshSession(sessionId);
  
  return session.userId;
}

function createSession(userId: number): string {
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    userId,
    expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  });
  return sessionId;
}

function refreshSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.expires = Date.now() + (7 * 24 * 60 * 60 * 1000); // Extend for 7 days
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const authenticateUser = (req: any, res: any, next: any) => {
    const userId = getSessionUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    (req as any).userId = userId;
    next();
  };

  const requireAdmin = async (req: any, res: any, next: any) => {
    const userId = getSessionUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    (req as any).userId = userId;
    next();
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const sessionId = createSession(user.id);
      res.cookie('sessionId', sessionId, { 
        httpOnly: true, 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax',
        secure: false // Allow HTTP for development
      });
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, sessionId });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user data", errors: result.error.errors });
      }

      const { username, email } = result.data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser({
        ...result.data,
        role: "customer"
      });

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, message: "Registration successful" });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.clearCookie('sessionId');
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = getSessionUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // User management routes
  app.get("/api/users", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  app.patch("/api/users/:id", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedUser = await storage.updateUser(id, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Bank account routes
  app.get("/api/bank-accounts", authenticateUser, async (req, res) => {
    try {
      const bankAccounts = await storage.getBankAccountsByUserId((req as any).userId);
      res.json(bankAccounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bank accounts" });
    }
  });

  app.post("/api/bank-accounts", authenticateUser, async (req, res) => {
    try {
      const validatedData = insertBankAccountSchema.parse({
        ...req.body,
        userId: (req as any).userId,
      });
      
      const bankAccount = await storage.createBankAccount(validatedData);
      res.json(bankAccount);
    } catch (error) {
      res.status(400).json({ message: "Invalid bank account data" });
    }
  });

  app.patch("/api/bank-accounts/:id", authenticateUser, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as any).userId;
      
      // First check if the bank account belongs to the user
      const existingAccount = await storage.getBankAccount(id);
      if (!existingAccount || existingAccount.userId !== userId) {
        return res.status(404).json({ message: "Bank account not found" });
      }
      
      const validatedData = insertBankAccountSchema.partial().parse(req.body);
      const updatedAccount = await storage.updateBankAccount(id, validatedData);
      
      if (!updatedAccount) {
        return res.status(404).json({ message: "Bank account not found" });
      }
      
      res.json(updatedAccount);
    } catch (error) {
      res.status(400).json({ message: "Invalid bank account data" });
    }
  });

  app.delete("/api/bank-accounts/:id", authenticateUser, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as any).userId;
      
      // First check if the bank account belongs to the user
      const existingAccount = await storage.getBankAccount(id);
      if (!existingAccount || existingAccount.userId !== userId) {
        return res.status(404).json({ message: "Bank account not found" });
      }
      
      const deleted = await storage.deleteBankAccount(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Bank account not found" });
      }
      
      res.json({ message: "Bank account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bank account" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUser((req as any).userId);
      let transactions;
      
      if (user?.role === "admin") {
        transactions = await storage.getAllTransactions();
      } else {
        transactions = await storage.getTransactionsByUserId((req as any).userId);
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  app.post("/api/transactions", authenticateUser, async (req, res) => {
    try {
      console.log("==== TRANSACTION START ====");
      console.log("Transaction data:", req.body);
      
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      console.log("Created transaction:", transaction);
      
      // Update user balance based on transaction type
      const user = await storage.getUser(validatedData.userId);
      console.log("User before transaction update:", user);
      
      if (user) {
        const amount = parseFloat(validatedData.amount);
        let balanceUpdate = {};
        
        switch (validatedData.type) {
          case "deposit":
            balanceUpdate = {
              balance: (parseFloat(user.balance) + amount).toFixed(2),
              availableBalance: (parseFloat(user.availableBalance) + amount).toFixed(2),
            };
            break;
          case "withdrawal":
            balanceUpdate = {
              balance: (parseFloat(user.balance) - amount).toFixed(2),
              availableBalance: (parseFloat(user.availableBalance) - amount).toFixed(2),
            };
            break;
          case "freeze":
            balanceUpdate = {
              availableBalance: (parseFloat(user.availableBalance) - amount).toFixed(2),
              frozenBalance: (parseFloat(user.frozenBalance) + amount).toFixed(2),
            };
            break;
          case "unfreeze":
            balanceUpdate = {
              availableBalance: (parseFloat(user.availableBalance) + amount).toFixed(2),
              frozenBalance: (parseFloat(user.frozenBalance) - amount).toFixed(2),
            };
            break;
        }
        
        console.log("Balance update object:", balanceUpdate);
        const updatedUser = await storage.updateUser(validatedData.userId, balanceUpdate);
        console.log("Updated user after transaction:", updatedUser);
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  // Betting order routes
  app.get("/api/betting-orders", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUser((req as any).userId);
      let orders;
      
      if (user?.role === "admin") {
        orders = await storage.getAllBettingOrders();
      } else {
        orders = await storage.getBettingOrdersByUserId((req as any).userId);
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get betting orders" });
    }
  });

  app.get("/api/betting-orders/active", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUser((req as any).userId);
      let orders;
      
      if (user?.role === "admin") {
        orders = await storage.getActiveBettingOrders();
      } else {
        const userOrders = await storage.getBettingOrdersByUserId((req as any).userId);
        orders = userOrders.filter(order => order.status === "active");
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get active orders" });
    }
  });

  app.post("/api/betting-orders", authenticateUser, async (req, res) => {
    try {
      console.log("==== BETTING ORDER START ====");
      console.log("User ID:", (req as any).userId);
      console.log("Order data:", req.body);
      
      const validatedData = insertBettingOrderSchema.parse({
        ...req.body,
        userId: (req as any).userId,
      });
      console.log("Validated data:", validatedData);
      
      const order = await storage.createBettingOrder(validatedData);
      console.log("Created order:", order);
      
      // Deduct amount from available balance
      const user = await storage.getUser((req as any).userId);
      console.log("Current user before balance update:", user);
      
      if (user) {
        const amount = parseFloat(validatedData.amount);
        const currentBalance = parseFloat(user.availableBalance);
        const newBalance = currentBalance - amount;
        
        console.log(`BALANCE UPDATE: ${currentBalance} - ${amount} = ${newBalance}`);
        
        const updatedUser = await storage.updateUser((req as any).userId, {
          availableBalance: newBalance.toFixed(2),
        });
        console.log("Updated user:", updatedUser);
      }
      
      console.log("==== BETTING ORDER END ====");
      res.json(order);
    } catch (error) {
      console.error("Betting order error:", error);
      res.status(400).json({ message: "Invalid betting order data", error: String(error) });
    }
  });

  app.patch("/api/betting-orders/:id", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedOrder = await storage.updateBettingOrder(id, updates);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Withdrawal request routes
  app.get("/api/withdrawal-requests", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUser((req as any).userId);
      let requests;
      
      if (user?.role === "admin") {
        requests = await storage.getPendingWithdrawalRequests();
      } else {
        requests = await storage.getWithdrawalRequestsByUserId((req as any).userId);
      }
      
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to get withdrawal requests" });
    }
  });

  app.post("/api/withdrawal-requests", authenticateUser, async (req, res) => {
    try {
      const validatedData = insertWithdrawalRequestSchema.parse({
        ...req.body,
        userId: (req as any).userId,
      });
      
      const request = await storage.createWithdrawalRequest(validatedData);
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid withdrawal request data" });
    }
  });

  app.patch("/api/withdrawal-requests/:id", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const updatedRequest = await storage.updateWithdrawalRequest(id, {
        status,
        processedAt: new Date(),
      });
      
      if (!updatedRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      // If approved, create withdrawal transaction
      if (status === "approved") {
        await storage.createTransaction({
          userId: updatedRequest.userId,
          type: "withdrawal",
          amount: updatedRequest.amount,
          status: "completed",
          description: "Withdrawal approved",
        });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to update withdrawal request" });
    }
  });

  // Announcement routes
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getActiveAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get announcements" });
    }
  });

  app.get("/api/announcements/all", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get all announcements" });
    }
  });

  app.post("/api/announcements", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);
      res.json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Invalid announcement data" });
    }
  });

  app.patch("/api/announcements/:id", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedAnnouncement = await storage.updateAnnouncement(id, updates);
      if (!updatedAnnouncement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      
      res.json(updatedAnnouncement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update announcement" });
    }
  });

  // Real-time crypto prices endpoint using CoinGecko API
  app.get("/api/crypto-prices", async (req, res) => {
    try {
      // Fetch real-time data from CoinGecko
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,chiliz,bitcoin-cash,paris-saint-germain-fan-token,juventus-fan-token,atletico-madrid,litecoin,eos,tron,ethereum-classic,bitshares&vs_currencies=usd&include_24hr_change=true'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto prices');
      }
      
      const data = await response.json();
      
      // Transform the data to match our format
      const transformedData = {
        "BTC/USD": {
          price: data.bitcoin.usd.toFixed(2),
          change: data.bitcoin.usd_24h_change ? `${data.bitcoin.usd_24h_change >= 0 ? '+' : ''}${data.bitcoin.usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data.bitcoin.usd_24h_change >= 0 ? "positive" : "negative"
        },
        "ETH/USD": {
          price: data.ethereum.usd.toFixed(2),
          change: data.ethereum.usd_24h_change ? `${data.ethereum.usd_24h_change >= 0 ? '+' : ''}${data.ethereum.usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data.ethereum.usd_24h_change >= 0 ? "positive" : "negative"
        },
        "DOGE/USD": {
          price: data.dogecoin.usd.toFixed(5),
          change: data.dogecoin.usd_24h_change ? `${data.dogecoin.usd_24h_change >= 0 ? '+' : ''}${data.dogecoin.usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data.dogecoin.usd_24h_change >= 0 ? "positive" : "negative"
        },
        "CHZ/USD": {
          price: data.chiliz.usd.toFixed(5),
          change: data.chiliz.usd_24h_change ? `${data.chiliz.usd_24h_change >= 0 ? '+' : ''}${data.chiliz.usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data.chiliz.usd_24h_change >= 0 ? "positive" : "negative"
        },
        "BCH/USD": {
          price: data['bitcoin-cash'].usd.toFixed(2),
          change: data['bitcoin-cash'].usd_24h_change ? `${data['bitcoin-cash'].usd_24h_change >= 0 ? '+' : ''}${data['bitcoin-cash'].usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data['bitcoin-cash'].usd_24h_change >= 0 ? "positive" : "negative"
        },
        "PSG/USD": {
          price: data['paris-saint-germain-fan-token'].usd.toFixed(3),
          change: data['paris-saint-germain-fan-token'].usd_24h_change ? `${data['paris-saint-germain-fan-token'].usd_24h_change >= 0 ? '+' : ''}${data['paris-saint-germain-fan-token'].usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data['paris-saint-germain-fan-token'].usd_24h_change >= 0 ? "positive" : "negative"
        },
        "JUV/USD": {
          price: data['juventus-fan-token'].usd.toFixed(3),
          change: data['juventus-fan-token'].usd_24h_change ? `${data['juventus-fan-token'].usd_24h_change >= 0 ? '+' : ''}${data['juventus-fan-token'].usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data['juventus-fan-token'].usd_24h_change >= 0 ? "positive" : "negative"
        },
        "ATM/USD": {
          price: data['atletico-madrid'].usd.toFixed(3),
          change: data['atletico-madrid'].usd_24h_change ? `${data['atletico-madrid'].usd_24h_change >= 0 ? '+' : ''}${data['atletico-madrid'].usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data['atletico-madrid'].usd_24h_change >= 0 ? "positive" : "negative"
        },
        "LTC/USD": {
          price: data.litecoin.usd.toFixed(2),
          change: data.litecoin.usd_24h_change ? `${data.litecoin.usd_24h_change >= 0 ? '+' : ''}${data.litecoin.usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data.litecoin.usd_24h_change >= 0 ? "positive" : "negative"
        },
        "EOS/USD": {
          price: data.eos.usd.toFixed(4),
          change: data.eos.usd_24h_change ? `${data.eos.usd_24h_change >= 0 ? '+' : ''}${data.eos.usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data.eos.usd_24h_change >= 0 ? "positive" : "negative"
        },
        "TRX/USD": {
          price: data.tron.usd.toFixed(4),
          change: data.tron.usd_24h_change ? `${data.tron.usd_24h_change >= 0 ? '+' : ''}${data.tron.usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data.tron.usd_24h_change >= 0 ? "positive" : "negative"
        },
        "ETC/USD": {
          price: data['ethereum-classic'].usd.toFixed(2),
          change: data['ethereum-classic'].usd_24h_change ? `${data['ethereum-classic'].usd_24h_change >= 0 ? '+' : ''}${data['ethereum-classic'].usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data['ethereum-classic'].usd_24h_change >= 0 ? "positive" : "negative"
        },
        "BTS/USD": {
          price: data.bitshares.usd.toFixed(4),
          change: data.bitshares.usd_24h_change ? `${data.bitshares.usd_24h_change >= 0 ? '+' : ''}${data.bitshares.usd_24h_change.toFixed(2)}%` : "0.00%",
          changeType: data.bitshares.usd_24h_change >= 0 ? "positive" : "negative"
        }
      };
      
      res.json(transformedData);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      // Fallback to static data if API fails
      res.json({
        "BTC/USD": {
          price: "42150.00",
          change: "+2.4%",
          changeType: "positive"
        },
        "ETH/USD": {
          price: "2850.00",
          change: "-1.2%",
          changeType: "negative"
        },
        "DOGE/USD": {
          price: "0.16147",
          change: "-1.87%",
          changeType: "negative"
        },
        "CHZ/USD": {
          price: "0.03457",
          change: "-2.59%",
          changeType: "negative"
        },
        "BCH/USD": {
          price: "502.8",
          change: "0.50%",
          changeType: "positive"
        },
        "PSG/USD": {
          price: "1.417",
          change: "-2.01%",
          changeType: "negative"
        },
        "JUV/USD": {
          price: "0.901",
          change: "-1.42%",
          changeType: "negative"
        },
        "ATM/USD": {
          price: "0.999",
          change: "-1.87%",
          changeType: "negative"
        },
        "LTC/USD": {
          price: "85.13",
          change: "-0.28%",
          changeType: "negative"
        },
        "EOS/USD": {
          price: "0",
          change: "0.00%",
          changeType: "positive"
        },
        "TRX/USD": {
          price: "0.2712",
          change: "0.15%",
          changeType: "positive"
        },
        "ETC/USD": {
          price: "16.19",
          change: "-2.00%",
          changeType: "negative"
        },
        "BTS/USD": {
          price: "502.8",
          change: "0.50%",
          changeType: "positive"
        }
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
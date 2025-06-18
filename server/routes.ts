import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBankAccountSchema, insertTransactionSchema, insertBettingOrderSchema, insertWithdrawalRequestSchema, insertAnnouncementSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const authenticateUser = (req: any, res: any, next: any) => {
    // Simple session-based authentication
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  const requireAdmin = async (req: any, res: any, next: any) => {
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
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

      req.session.userId = user.id;
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
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
      const bankAccounts = await storage.getBankAccountsByUserId(req.session.userId);
      res.json(bankAccounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bank accounts" });
    }
  });

  app.post("/api/bank-accounts", authenticateUser, async (req, res) => {
    try {
      const validatedData = insertBankAccountSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      
      const bankAccount = await storage.createBankAccount(validatedData);
      res.json(bankAccount);
    } catch (error) {
      res.status(400).json({ message: "Invalid bank account data" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      let transactions;
      
      if (user?.role === "admin") {
        transactions = await storage.getAllTransactions();
      } else {
        transactions = await storage.getTransactionsByUserId(req.session.userId);
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  app.post("/api/transactions", authenticateUser, async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      
      // Update user balance based on transaction type
      const user = await storage.getUser(validatedData.userId);
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
        
        await storage.updateUser(validatedData.userId, balanceUpdate);
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  // Betting order routes
  app.get("/api/betting-orders", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      let orders;
      
      if (user?.role === "admin") {
        orders = await storage.getAllBettingOrders();
      } else {
        orders = await storage.getBettingOrdersByUserId(req.session.userId);
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get betting orders" });
    }
  });

  app.get("/api/betting-orders/active", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getActiveBettingOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get active orders" });
    }
  });

  app.post("/api/betting-orders", authenticateUser, async (req, res) => {
    try {
      const validatedData = insertBettingOrderSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      
      const order = await storage.createBettingOrder(validatedData);
      
      // Deduct amount from available balance
      const user = await storage.getUser(req.session.userId);
      if (user) {
        const amount = parseFloat(validatedData.amount);
        await storage.updateUser(req.session.userId, {
          availableBalance: (parseFloat(user.availableBalance) - amount).toFixed(2),
        });
      }
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid betting order data" });
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
      const user = await storage.getUser(req.session.userId);
      let requests;
      
      if (user?.role === "admin") {
        requests = await storage.getPendingWithdrawalRequests();
      } else {
        requests = await storage.getWithdrawalRequestsByUserId(req.session.userId);
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
        userId: req.session.userId,
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

  // Mock crypto prices endpoint
  app.get("/api/crypto-prices", (req, res) => {
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
      "ADA/USD": {
        price: "0.45",
        change: "+5.1%",
        changeType: "positive"
      },
      "DOT/USD": {
        price: "8.20",
        change: "+3.2%",
        changeType: "positive"
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

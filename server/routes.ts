import { Router, Request, Response } from "express";
import { DatabaseStorage } from "./storage.js";
import { insertUserSchema, insertBettingOrderSchema, insertTransactionSchema, insertBankAccountSchema } from "../shared/schema.js";
import bcrypt from "bcrypt";

const router = Router();
const storage = new DatabaseStorage();

// Users routes
router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await storage.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await storage.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/users", async (req: Request, res: Response) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Invalid user data" });
  }
});

// Betting Orders routes
router.get("/betting-orders", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const orders = await storage.getBettingOrders(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch betting orders" });
  }
});

router.post("/betting-orders", async (req: Request, res: Response) => {
  try {
    const orderData = insertBettingOrderSchema.parse(req.body);
    const order = await storage.createBettingOrder(orderData);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: "Invalid betting order data" });
  }
});

// Transactions routes
router.get("/transactions", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const transactions = await storage.getTransactions(userId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.post("/transactions", async (req: Request, res: Response) => {
  try {
    const transactionData = insertTransactionSchema.parse(req.body);
    const transaction = await storage.createTransaction(transactionData);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: "Invalid transaction data" });
  }
});

// Bank Accounts routes
router.get("/bank-accounts", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const accounts = await storage.getBankAccounts(userId);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bank accounts" });
  }
});

router.post("/bank-accounts", async (req: Request, res: Response) => {
  try {
    const accountData = insertBankAccountSchema.parse(req.body);
    const account = await storage.createBankAccount(accountData);
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: "Invalid bank account data" });
  }
});

// Crypto prices endpoint (mock for now)
router.get("/crypto/prices", async (req: Request, res: Response) => {
  try {
    // Mock crypto prices - in production this would fetch from a real API
    const prices = {
      BTC: { price: 45000, change: 2.5 },
      ETH: { price: 3200, change: -1.2 },
      ADA: { price: 0.75, change: 5.8 },
      DOT: { price: 25, change: 0.9 }
    };
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch crypto prices" });
  }
});

export default router;
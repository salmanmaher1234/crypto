import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// Basic homepage for API-only server
app.get("/", (req, res) => {
  res.json({
    message: "Crypto Trading API Server",
    endpoints: {
      users: "/api/users",
      "betting-orders": "/api/betting-orders",
      transactions: "/api/transactions",
      "bank-accounts": "/api/bank-accounts",
      "crypto-prices": "/api/crypto/prices"
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
});

export default app;
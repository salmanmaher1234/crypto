import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes-simple";
import { setupVite, serveStatic, log } from "./vite";
import { testConnection } from "./db";

const app = express();

// 🔹 STRONG HTTPS to HTTP redirect
app.use((req: Request, res: Response, next: NextFunction) => {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  
  if (isHttps) {
    const host = req.headers.host || '127.0.0.1';
    const url = req.url || '/';
    log(`Redirecting HTTPS to HTTP: ${host}${url}`);
    return res.redirect(302, `http://${host}${url}`);
  }
  
  res.setHeader('Strict-Transport-Security', 'max-age=0');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Remove security headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.removeHeader('Strict-Transport-Security');
  res.setHeader('Strict-Transport-Security', 'max-age=0');
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Health check
app.get("/api/health", async (_req: Request, res: Response) => {
  try {
    const dbConnected = await testConnection();
    res.json({ 
      status: "ok", 
      database: dbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      database: "connection failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

(async () => {
  try {
    log("Testing database connection...");
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }
    log("Database connection established successfully!");
  } catch (error) {
    log(`Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    if (app.get("env") === "production") {
      process.exit(1);
    }
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    
    if (app.get("env") === "development") {
      console.error(err);
    }
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 🔹 CHANGE PORT to 80 (HTTP standard port)
  const port = 5000;
  const host = "127.0.0.1";

  server.listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
    log(`Domain: 127.0.0.1`);
    log(`Environment: ${app.get("env")}`);
    log(`Health check: http://127.0.0.1/api/health`);
    log(`Main app: http://127.0.0.1/`);
  });
})();
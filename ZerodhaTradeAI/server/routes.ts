import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { zerodhaService } from "./zerodha";
import { telegramService } from "./telegram";
import { aiTradingService } from "./aiTrading";
import { InsertUser, insertUserSchema, insertRiskSettingsSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import 'express-session';

// Extend the Express Request type to include session
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication and User Management Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Create default risk settings for the user
      await storage.createDefaultRiskSettings(user.id);
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating user" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string()
      }).parse(req.body);
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error during login" });
      }
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ message: "Error logging out" });
        }
        res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      res.status(200).json({ message: "Already logged out" });
    }
  });

  // Zerodha Integration Routes
  app.post("/api/zerodha/connect", async (req, res) => {
    try {
      const { apiKey, apiSecret } = z.object({
        apiKey: z.string(),
        apiSecret: z.string()
      }).parse(req.body);
      
      // Connect to Zerodha
      const isConnected = zerodhaService.connect(apiKey, apiSecret);
      if (!isConnected) {
        return res.status(400).json({ message: "Failed to connect to Zerodha" });
      }
      
      // Get account info
      const account = zerodhaService.getAccountInfo();
      
      // Update user if authenticated
      if (req.session && req.session.userId) {
        await storage.updateUserZerodhaCredentials(req.session.userId, apiKey, apiSecret);
      }
      
      res.status(200).json({ isConnected, account });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error connecting to Zerodha" });
      }
    }
  });

  app.post("/api/zerodha/disconnect", (req, res) => {
    zerodhaService.disconnect();
    
    // Update user if authenticated
    if (req.session && req.session.userId) {
      storage.updateUserZerodhaCredentials(req.session.userId, null, null)
        .catch(err => console.error("Error updating user credentials:", err));
    }
    
    res.status(200).json({ message: "Disconnected from Zerodha" });
  });

  app.get("/api/zerodha/status", (req, res) => {
    const isConnected = zerodhaService.isConnected();
    let account = null;
    
    if (isConnected) {
      account = zerodhaService.getAccountInfo();
    }
    
    res.status(200).json({ isConnected, account });
  });

  app.get("/api/zerodha/market-status", (req, res) => {
    const status = zerodhaService.getMarketStatus();
    res.status(200).json(status);
  });

  app.get("/api/zerodha/market-data", (req, res) => {
    try {
      const symbol = z.string().parse(req.query.symbol);
      const data = zerodhaService.getMarketData(symbol);
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid symbol" });
      } else {
        res.status(500).json({ message: "Error fetching market data" });
      }
    }
  });

  app.post("/api/zerodha/place-order", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const orderData = z.object({
        symbol: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().optional(),
        type: z.enum(["BUY", "SELL"]),
        orderType: z.enum(["MARKET", "LIMIT", "SL", "SL-M"])
      }).parse(req.body);
      
      if (!zerodhaService.isConnected()) {
        return res.status(400).json({ message: "Not connected to Zerodha" });
      }
      
      const order = zerodhaService.placeOrder(
        orderData.symbol,
        orderData.quantity,
        orderData.price ?? null,
        orderData.type,
        orderData.orderType
      );
      
      // Create trade record in database
      const trade = await storage.createTrade({
        userId: req.session.userId,
        symbol: orderData.symbol,
        quantity: orderData.quantity,
        price: orderData.price ?? (await zerodhaService.getQuote(orderData.symbol)).lastPrice,
        tradeType: orderData.type,
        status: "OPEN",
        entryTime: new Date(),
        isAiGenerated: false
      });
      
      // Send notification via Telegram if connected
      try {
        if (telegramService.isConnected()) {
          const message = `${orderData.type} order placed for ${orderData.quantity} ${orderData.symbol} at ${orderData.price ? `₹${orderData.price}` : 'market price'}.`;
          telegramService.sendMessage(message, "ALERT");
        }
      } catch (err) {
        console.log("Telegram notification error:", err);
      }
      
      res.status(200).json({ order, trade });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid order data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error placing order" });
      }
    }
  });

  // Telegram Bot Routes
  app.post("/api/telegram/connect", async (req, res) => {
    try {
      const { botToken, chatId } = z.object({
        botToken: z.string(),
        chatId: z.string()
      }).parse(req.body);
      
      // Connect to Telegram
      const isConnected = telegramService.connect(botToken, chatId);
      if (!isConnected) {
        return res.status(400).json({ message: "Failed to connect to Telegram" });
      }
      
      // Update user if authenticated
      if (req.session && req.session.userId) {
        await storage.updateUserTelegramInfo(req.session.userId, chatId);
      }
      
      res.status(200).json({ isConnected });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error connecting to Telegram" });
      }
    }
  });

  app.post("/api/telegram/disconnect", (req, res) => {
    telegramService.disconnect();
    
    // Update user if authenticated
    if (req.session && req.session.userId) {
      storage.updateUserTelegramInfo(req.session.userId, null)
        .catch(err => console.error("Error updating user telegram info:", err));
    }
    
    res.status(200).json({ message: "Disconnected from Telegram" });
  });

  app.get("/api/telegram/status", (req, res) => {
    try {
      const isConnected = telegramService.isConnected();
      res.status(200).json({ isConnected });
    } catch (err) {
      console.error("Error checking Telegram connection:", err);
      res.status(500).json({ isConnected: false, error: "Error checking connection status" });
    }
  });

  app.get("/api/telegram/messages", (req, res) => {
    const messages = telegramService.getMessages();
    res.status(200).json(messages);
  });

  app.post("/api/telegram/send", async (req, res) => {
    try {
      const { message, type } = z.object({
        message: z.string(),
        type: z.string()
      }).parse(req.body);
      
      try {
        if (!telegramService.isConnected()) {
          return res.status(400).json({ message: "Not connected to Telegram" });
        }
      } catch (err) {
        console.error("Error checking Telegram connection:", err);
        return res.status(500).json({ message: "Error checking Telegram connection" });
      }
      
      const sentMessage = telegramService.sendMessage(message, type);
      
      // Store in database if authenticated
      if (req.session && req.session.userId) {
        await storage.createTelegramNotification({
          userId: req.session.userId,
          message,
          timestamp: new Date(),
          type,
          status: "SENT"
        });
      }
      
      res.status(200).json(sentMessage);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error sending message" });
      }
    }
  });

  app.post("/api/telegram/signal/accept", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { messageId } = z.object({
        messageId: z.string()
      }).parse(req.body);
      
      // Find the message
      const message = telegramService.getMessageById(messageId);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      // Execute the signal (mock implementation)
      const confirmation = telegramService.sendMessage(
        `Signal accepted: ${message.message}. Order will be executed shortly.`,
        "ALERT"
      );
      
      res.status(200).json({ success: true, confirmation });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error accepting signal" });
      }
    }
  });

  app.post("/api/telegram/signal/ignore", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { messageId } = z.object({
        messageId: z.string()
      }).parse(req.body);
      
      // Find the message
      const message = telegramService.getMessageById(messageId);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      // Mark as ignored
      const confirmation = telegramService.sendMessage(
        `Signal ignored: ${message.message}.`,
        "ALERT"
      );
      
      res.status(200).json({ success: true, confirmation });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error ignoring signal" });
      }
    }
  });

  // AI Trading Routes
  app.get("/api/ai/signals", async (req, res) => {
    try {
      const symbol = req.query.symbol ? z.string().parse(req.query.symbol) : undefined;
      
      // Get trading signals
      let signals;
      if (symbol) {
        signals = await aiTradingService.getSignalForSymbol(symbol);
      } else {
        signals = await aiTradingService.getAllSignals();
      }
      
      res.status(200).json(signals);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid symbol" });
      } else {
        res.status(500).json({ message: "Error getting trading signals" });
      }
    }
  });

  app.post("/api/ai/auto-trading", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { enabled } = z.object({
        enabled: z.boolean()
      }).parse(req.body);
      
      // Update user's risk settings
      await storage.updateAutoTradingStatus(req.session.userId, enabled);
      
      // Send notification
      if (telegramService.isConnected()) {
        const message = enabled 
          ? "Auto-trading has been enabled. AI will now execute trades based on your risk parameters."
          : "Auto-trading has been disabled. AI will no longer execute trades automatically.";
        telegramService.sendMessage(message, "ALERT");
      }
      
      res.status(200).json({ success: true, autoTradingEnabled: enabled });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating auto-trading status" });
      }
    }
  });

  app.get("/api/risk-settings", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const settings = await storage.getRiskSettings(req.session.userId);
      if (!settings) {
        return res.status(404).json({ message: "Risk settings not found" });
      }
      
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching risk settings" });
    }
  });

  app.post("/api/risk-settings", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const settingsData = insertRiskSettingsSchema
        .omit({ userId: true })
        .parse(req.body);
      
      // Update risk settings
      const settings = await storage.updateRiskSettings({
        ...settingsData,
        userId: req.session.userId
      });
      
      res.status(200).json(settings);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating risk settings" });
      }
    }
  });

  app.get("/api/trades", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const trades = await storage.getTradesByUserId(req.session.userId);
      res.status(200).json(trades);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trades" });
    }
  });

  app.get("/api/trade/:id", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const tradeId = parseInt(req.params.id);
      if (isNaN(tradeId)) {
        return res.status(400).json({ message: "Invalid trade ID" });
      }
      
      const trade = await storage.getTrade(tradeId);
      if (!trade) {
        return res.status(404).json({ message: "Trade not found" });
      }
      
      // Ensure user can only access their own trades
      if (trade.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.status(200).json(trade);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trade" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

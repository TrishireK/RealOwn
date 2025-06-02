import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  apiKey: text("api_key"),
  apiSecret: text("api_secret"),
  telegramChatId: text("telegram_chat_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  apiKey: true,
  apiSecret: true,
  telegramChatId: true,
});

// Trade schema for storing trades
export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  symbol: text("symbol").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  tradeType: text("trade_type").notNull(), // BUY, SELL
  status: text("status").notNull(), // OPEN, CLOSED
  entryTime: timestamp("entry_time").notNull(),
  exitTime: timestamp("exit_time"),
  exitPrice: real("exit_price"),
  pnl: real("pnl"),
  isAiGenerated: boolean("is_ai_generated").default(false),
});

export const insertTradeSchema = createInsertSchema(trades).pick({
  userId: true,
  symbol: true,
  quantity: true,
  price: true,
  tradeType: true,
  status: true,
  entryTime: true,
  isAiGenerated: true,
});

// Trading signal schema for AI recommendations
export const tradingSignals = pgTable("trading_signals", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  signalType: text("signal_type").notNull(), // BUY, SELL, HOLD
  confidence: real("confidence").notNull(),
  price: real("price").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  metadata: jsonb("metadata"),
});

export const insertTradingSignalSchema = createInsertSchema(tradingSignals).pick({
  symbol: true,
  signalType: true,
  confidence: true,
  price: true,
  timestamp: true,
  metadata: true,
});

// Risk settings schema
export const riskSettings = pgTable("risk_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  maxCapitalPerTrade: real("max_capital_per_trade").notNull(),
  stopLossPercentage: real("stop_loss_percentage").notNull(),
  takeProfitPercentage: real("take_profit_percentage").notNull(),
  aiConfidenceThreshold: real("ai_confidence_threshold").notNull(),
  defaultLotSize: integer("default_lot_size").notNull(),
  instrumentTypes: text("instrument_types").notNull(),
  autoTradingEnabled: boolean("auto_trading_enabled").default(false),
});

export const insertRiskSettingsSchema = createInsertSchema(riskSettings).pick({
  userId: true,
  maxCapitalPerTrade: true,
  stopLossPercentage: true,
  takeProfitPercentage: true,
  aiConfidenceThreshold: true,
  defaultLotSize: true,
  instrumentTypes: true,
  autoTradingEnabled: true,
});

// Telegram notification schema
export const telegramNotifications = pgTable("telegram_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  type: text("type").notNull(), // SIGNAL, ALERT, MARKET_UPDATE
  status: text("status").notNull(), // SENT, PENDING, FAILED
});

export const insertTelegramNotificationSchema = createInsertSchema(telegramNotifications).pick({
  userId: true,
  message: true,
  timestamp: true,
  type: true,
  status: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;

export type TradingSignal = typeof tradingSignals.$inferSelect;
export type InsertTradingSignal = z.infer<typeof insertTradingSignalSchema>;

export type RiskSettings = typeof riskSettings.$inferSelect;
export type InsertRiskSettings = z.infer<typeof insertRiskSettingsSchema>;

export type TelegramNotification = typeof telegramNotifications.$inferSelect;
export type InsertTelegramNotification = z.infer<typeof insertTelegramNotificationSchema>;

// Enums
export const TradeType = {
  BUY: "BUY",
  SELL: "SELL",
} as const;

export const TradeStatus = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export const SignalType = {
  BUY: "BUY",
  SELL: "SELL",
  STOP_LOSS: "STOP_LOSS",
  HOLD: "HOLD",
} as const;

export const NotificationType = {
  SIGNAL: "SIGNAL",
  ALERT: "ALERT",
  MARKET_UPDATE: "MARKET_UPDATE",
} as const;

export const NotificationStatus = {
  SENT: "SENT",
  PENDING: "PENDING",
  FAILED: "FAILED",
} as const;

export const InstrumentType = {
  STOCKS_AND_OPTIONS: "Stocks & Options",
  STOCKS_ONLY: "Stocks Only",
  OPTIONS_ONLY: "Options Only",
  FUTURES_ONLY: "Futures Only",
} as const;

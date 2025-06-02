import { 
  users, 
  type User, 
  type InsertUser, 
  trades, 
  type Trade, 
  type InsertTrade,
  tradingSignals,
  type TradingSignal,
  type InsertTradingSignal,
  riskSettings,
  type RiskSettings,
  type InsertRiskSettings,
  telegramNotifications,
  type TelegramNotification,
  type InsertTelegramNotification,
  InstrumentType
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserZerodhaCredentials(userId: number, apiKey: string | null, apiSecret: string | null): Promise<User>;
  updateUserTelegramInfo(userId: number, chatId: string | null): Promise<User>;
  
  // Trade operations
  getTrade(id: number): Promise<Trade | undefined>;
  getTradesByUserId(userId: number): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTradeStatus(tradeId: number, status: string, exitPrice?: number, exitTime?: Date): Promise<Trade>;
  
  // Trading signal operations
  getTradingSignal(id: number): Promise<TradingSignal | undefined>;
  getTradingSignalsBySymbol(symbol: string): Promise<TradingSignal[]>;
  createTradingSignal(signal: InsertTradingSignal): Promise<TradingSignal>;
  
  // Risk settings operations
  getRiskSettings(userId: number): Promise<RiskSettings | undefined>;
  createDefaultRiskSettings(userId: number): Promise<RiskSettings>;
  updateRiskSettings(settings: InsertRiskSettings): Promise<RiskSettings>;
  updateAutoTradingStatus(userId: number, enabled: boolean): Promise<RiskSettings>;
  
  // Telegram notification operations
  getTelegramNotification(id: number): Promise<TelegramNotification | undefined>;
  getTelegramNotificationsByUserId(userId: number): Promise<TelegramNotification[]>;
  createTelegramNotification(notification: InsertTelegramNotification): Promise<TelegramNotification>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trades: Map<number, Trade>;
  private tradingSignals: Map<number, TradingSignal>;
  private riskSettings: Map<number, RiskSettings>;
  private telegramNotifications: Map<number, TelegramNotification>;
  
  private userIdCounter: number;
  private tradeIdCounter: number;
  private signalIdCounter: number;
  private notificationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.trades = new Map();
    this.tradingSignals = new Map();
    this.riskSettings = new Map();
    this.telegramNotifications = new Map();
    
    this.userIdCounter = 1;
    this.tradeIdCounter = 1;
    this.signalIdCounter = 1;
    this.notificationIdCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample User
    const user: User = {
      id: this.userIdCounter++,
      username: "demo",
      password: "password",
      apiKey: null,
      apiSecret: null,
      telegramChatId: null
    };
    this.users.set(user.id, user);
    
    // Sample Risk Settings
    const settings: RiskSettings = {
      id: 1,
      userId: user.id,
      maxCapitalPerTrade: 5,
      stopLossPercentage: 2,
      takeProfitPercentage: 5,
      aiConfidenceThreshold: 75,
      defaultLotSize: 1,
      instrumentTypes: InstrumentType.STOCKS_AND_OPTIONS,
      autoTradingEnabled: false
    };
    this.riskSettings.set(settings.id, settings);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      apiKey: insertUser.apiKey ?? null,
      apiSecret: insertUser.apiSecret ?? null,
      telegramChatId: insertUser.telegramChatId ?? null 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserZerodhaCredentials(userId: number, apiKey: string | null, apiSecret: string | null): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      apiKey,
      apiSecret
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserTelegramInfo(userId: number, chatId: string | null): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      telegramChatId: chatId
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Trade operations
  async getTrade(id: number): Promise<Trade | undefined> {
    return this.trades.get(id);
  }
  
  async getTradesByUserId(userId: number): Promise<Trade[]> {
    return Array.from(this.trades.values()).filter(
      (trade) => trade.userId === userId
    );
  }
  
  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = this.tradeIdCounter++;
    const trade: Trade = { 
      ...insertTrade, 
      id, 
      exitTime: null, 
      exitPrice: null, 
      pnl: null,
      isAiGenerated: insertTrade.isAiGenerated ?? null
    };
    this.trades.set(id, trade);
    return trade;
  }
  
  async updateTradeStatus(tradeId: number, status: string, exitPrice?: number, exitTime?: Date): Promise<Trade> {
    const trade = await this.getTrade(tradeId);
    if (!trade) {
      throw new Error(`Trade with ID ${tradeId} not found`);
    }
    
    const updatedTrade: Trade = {
      ...trade,
      status,
      exitPrice: exitPrice || trade.exitPrice,
      exitTime: exitTime || trade.exitTime
    };
    
    // Calculate P&L if trade is closed
    if (status === "CLOSED" && exitPrice) {
      const pnl = trade.tradeType === "BUY" 
        ? (exitPrice - trade.price) * trade.quantity
        : (trade.price - exitPrice) * trade.quantity;
      
      updatedTrade.pnl = pnl;
    }
    
    this.trades.set(tradeId, updatedTrade);
    return updatedTrade;
  }

  // Trading signal operations
  async getTradingSignal(id: number): Promise<TradingSignal | undefined> {
    return this.tradingSignals.get(id);
  }
  
  async getTradingSignalsBySymbol(symbol: string): Promise<TradingSignal[]> {
    return Array.from(this.tradingSignals.values()).filter(
      (signal) => signal.symbol === symbol
    );
  }
  
  async createTradingSignal(insertSignal: InsertTradingSignal): Promise<TradingSignal> {
    const id = this.signalIdCounter++;
    const signal: TradingSignal = { 
      ...insertSignal, 
      id,
      metadata: insertSignal.metadata ?? {} 
    };
    this.tradingSignals.set(id, signal);
    return signal;
  }

  // Risk settings operations
  async getRiskSettings(userId: number): Promise<RiskSettings | undefined> {
    return Array.from(this.riskSettings.values()).find(
      (settings) => settings.userId === userId
    );
  }
  
  async createDefaultRiskSettings(userId: number): Promise<RiskSettings> {
    const settings: RiskSettings = {
      id: this.riskSettings.size + 1,
      userId,
      maxCapitalPerTrade: 5,
      stopLossPercentage: 2,
      takeProfitPercentage: 5,
      aiConfidenceThreshold: 75,
      defaultLotSize: 1,
      instrumentTypes: InstrumentType.STOCKS_AND_OPTIONS,
      autoTradingEnabled: false
    };
    
    this.riskSettings.set(settings.id, settings);
    return settings;
  }
  
  async updateRiskSettings(insertSettings: InsertRiskSettings): Promise<RiskSettings> {
    const existingSettings = await this.getRiskSettings(insertSettings.userId);
    
    if (existingSettings) {
      const updatedSettings: RiskSettings = {
        ...existingSettings,
        ...insertSettings
      };
      
      this.riskSettings.set(existingSettings.id, updatedSettings);
      return updatedSettings;
    } else {
      return this.createDefaultRiskSettings(insertSettings.userId);
    }
  }
  
  async updateAutoTradingStatus(userId: number, enabled: boolean): Promise<RiskSettings> {
    const settings = await this.getRiskSettings(userId);
    if (!settings) {
      return this.createDefaultRiskSettings(userId);
    }
    
    const updatedSettings: RiskSettings = {
      ...settings,
      autoTradingEnabled: enabled
    };
    
    this.riskSettings.set(settings.id, updatedSettings);
    return updatedSettings;
  }

  // Telegram notification operations
  async getTelegramNotification(id: number): Promise<TelegramNotification | undefined> {
    return this.telegramNotifications.get(id);
  }
  
  async getTelegramNotificationsByUserId(userId: number): Promise<TelegramNotification[]> {
    return Array.from(this.telegramNotifications.values()).filter(
      (notification) => notification.userId === userId
    );
  }
  
  async createTelegramNotification(insertNotification: InsertTelegramNotification): Promise<TelegramNotification> {
    const id = this.notificationIdCounter++;
    const notification: TelegramNotification = { ...insertNotification, id };
    this.telegramNotifications.set(id, notification);
    return notification;
  }
}

export const storage = new MemStorage();

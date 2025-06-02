// Mock Zerodha API service
// In a real implementation, this would use the KiteConnect API client

import { MarketData, Quote, MarketStatus, ZerodhaAccount, ZerodhaOrder } from "@/lib/zerodha";

// Mock data for demonstration purposes
const MOCK_MARKET_DATA: Record<string, MarketData> = {
  "NIFTY 50": {
    symbol: "NIFTY 50",
    open: 18342.00,
    high: 18623.85,
    low: 18315.30,
    close: 18542.25,
    volume: 267500000,
    lastUpdated: new Date(),
  },
  "RELIANCE": {
    symbol: "RELIANCE",
    open: 2432.50,
    high: 2460.10,
    low: 2430.20,
    close: 2452.30,
    volume: 5670000,
    lastUpdated: new Date(),
  },
  "HDFCBANK": {
    symbol: "HDFCBANK",
    open: 1650.75,
    high: 1662.40,
    low: 1620.10,
    close: 1623.45,
    volume: 8920000,
    lastUpdated: new Date(),
  },
  "INFY": {
    symbol: "INFY",
    open: 1442.00,
    high: 1454.60,
    low: 1430.50,
    close: 1432.60,
    volume: 4560000,
    lastUpdated: new Date(),
  },
};

// Mock account data
const MOCK_ACCOUNT: ZerodhaAccount = {
  availableMargin: 125430,
  usedMargin: 47625,
  username: "John Smith",
};

// Market status - defaults to open during business hours
let marketStatus = true;

class ZerodhaService {
  private isLoggedIn: boolean = false;
  private apiKey: string | null = null;
  private apiSecret: string | null = null;

  constructor() {
    // In a real implementation, we might check for environment variables here
  }

  connect(apiKey: string, apiSecret: string): boolean {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.isLoggedIn = true;
    
    // In a real implementation, we would verify the connection here
    return true;
  }

  disconnect(): void {
    this.apiKey = null;
    this.apiSecret = null;
    this.isLoggedIn = false;
  }

  isConnected(): boolean {
    return this.isLoggedIn as boolean;
  }

  getMarketData(symbol: string): MarketData {
    if (!this.isLoggedIn) {
      throw new Error("Not connected to Zerodha");
    }
    
    if (MOCK_MARKET_DATA[symbol]) {
      return MOCK_MARKET_DATA[symbol];
    } else {
      throw new Error(`Symbol ${symbol} not found`);
    }
  }

  getQuote(symbol: string): Quote {
    if (!this.isLoggedIn) {
      throw new Error("Not connected to Zerodha");
    }
    
    const data = MOCK_MARKET_DATA[symbol];
    if (data) {
      const change = data.close - data.open;
      const changePercent = (change / data.open) * 100;
      
      return {
        symbol: data.symbol,
        lastPrice: data.close,
        change,
        changePercent,
        open: data.open,
        high: data.high,
        low: data.low,
        volume: data.volume,
      };
    } else {
      throw new Error(`Symbol ${symbol} not found`);
    }
  }

  getMarketStatus(): MarketStatus {
    return {
      isOpen: marketStatus,
      nextOpeningTime: marketStatus ? undefined : new Date(new Date().setHours(9, 0, 0, 0)),
      nextClosingTime: marketStatus ? new Date(new Date().setHours(15, 30, 0, 0)) : undefined,
    };
  }

  getAccountInfo(): ZerodhaAccount {
    if (!this.isLoggedIn) {
      throw new Error("Not connected to Zerodha");
    }
    
    return MOCK_ACCOUNT;
  }

  placeOrder(
    symbol: string,
    quantity: number,
    price: number | null,
    type: "BUY" | "SELL",
    orderType: "MARKET" | "LIMIT" | "SL" | "SL-M"
  ): ZerodhaOrder {
    if (!this.isLoggedIn) {
      throw new Error("Not connected to Zerodha");
    }
    
    // In a real implementation, this would call the Zerodha API
    return {
      orderId: Math.random().toString(36).substring(2, 10),
      symbol,
      quantity,
      price: price || MOCK_MARKET_DATA[symbol]?.close || 0,
      type,
      orderType,
      status: "OPEN",
      timestamp: new Date(),
    };
  }

  // Helper method to toggle market status (for demonstration)
  toggleMarketStatus(): boolean {
    marketStatus = !marketStatus;
    return marketStatus;
  }
}

export const zerodhaService = new ZerodhaService();

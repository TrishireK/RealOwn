// AI trading service
// In a real implementation, this would use ML models or external API

import { SignalType, TradingSignal, InsertTradingSignal } from "@shared/schema";
import { zerodhaService } from "./zerodha";
import { storage } from "./storage";
import { telegramService } from "./telegram";

// Stock symbols with company names
const STOCK_DETAILS: Record<string, { name: string, risk: number }> = {
  "RELIANCE": { name: "Reliance Industries Ltd.", risk: 0.6 },
  "HDFCBANK": { name: "HDFC Bank Ltd.", risk: 0.4 },
  "INFY": { name: "Infosys Ltd.", risk: 0.5 },
  "TCS": { name: "Tata Consultancy Services Ltd.", risk: 0.3 },
  "TATASTEEL": { name: "Tata Steel Ltd.", risk: 0.7 },
  "NIFTY 50": { name: "Nifty 50 Index", risk: 0.5 },
  "NIFTY 18500 CE": { name: "NIFTY Call Option", risk: 0.8 },
  "NIFTY 18600 PE": { name: "NIFTY Put Option", risk: 0.8 },
  "BANKNIFTY": { name: "Bank Nifty Index", risk: 0.6 },
  "SBIN": { name: "State Bank of India", risk: 0.5 },
};

// Technical patterns for stock analysis
export const TECHNICAL_PATTERNS = [
  {
    pattern: "Bullish Engulfing",
    symbol: "HDFC Bank",
    significance: "Strong bullish reversal pattern",
    reliability: 85,
  },
  {
    pattern: "Doji Candle",
    symbol: "Reliance Industries",
    significance: "Market indecision, potential reversal",
    reliability: 70,
  },
  {
    pattern: "Head & Shoulders",
    symbol: "Infosys",
    significance: "Bearish reversal pattern",
    reliability: 80,
  },
  {
    pattern: "Double Bottom",
    symbol: "TCS",
    significance: "Bullish reversal pattern",
    reliability: 75,
  },
  {
    pattern: "Hammer",
    symbol: "SBIN",
    significance: "Bullish reversal after downtrend",
    reliability: 65,
  }
];

class AITradingService {
  constructor() {}

  async getSignalForSymbol(symbol: string): Promise<TradingSignal | null> {
    if (!STOCK_DETAILS[symbol]) {
      throw new Error(`Symbol ${symbol} not found`);
    }

    try {
      // Get market data from Zerodha
      const marketData = zerodhaService.getMarketData(symbol);
      
      // Generate signal based on market data
      const signal = this.analyzeMarketData(marketData);
      
      // Store signal in database
      await this.storeSignal(signal);
      
      return signal;
    } catch (error) {
      console.error(`Error generating signal for ${symbol}:`, error);
      return null;
    }
  }

  async getAllSignals(): Promise<TradingSignal[]> {
    const symbols = Object.keys(STOCK_DETAILS);
    const signals: TradingSignal[] = [];
    
    // Generate signals for a subset of symbols
    const selectedSymbols = symbols.slice(0, 4); // Just use first 4 symbols for demo
    
    for (const symbol of selectedSymbols) {
      try {
        const signal = await this.getSignalForSymbol(symbol);
        if (signal) {
          signals.push(signal);
        }
      } catch (error) {
        console.error(`Error generating signal for ${symbol}:`, error);
      }
    }
    
    return signals;
  }

  private analyzeMarketData(data: any): TradingSignal {
    const { symbol } = data;
    
    const change = data.close - data.open;
    const changePercent = (change / data.open) * 100;

    // Simple pattern recognition rules based on price movement
    let signalType: string;
    let confidence: number;

    if (changePercent > 2) {
      signalType = SignalType.BUY;
      confidence = 70 + Math.random() * 15;
    } else if (changePercent < -2) {
      signalType = SignalType.SELL;
      confidence = 75 + Math.random() * 10;
    } else if (changePercent < -1 && data.volume > 5000000) {
      signalType = SignalType.STOP_LOSS;
      confidence = 85 + Math.random() * 10;
    } else if (changePercent > 0) {
      signalType = SignalType.BUY;
      confidence = 60 + Math.random() * 15;
    } else {
      signalType = SignalType.SELL;
      confidence = 60 + Math.random() * 15;
    }

    return {
      id: Math.floor(Math.random() * 1000),
      symbol,
      signalType,
      confidence,
      price: data.close,
      timestamp: new Date(),
      metadata: {
        open: data.open,
        high: data.high,
        low: data.low,
        volume: data.volume,
        changePercent,
        company: STOCK_DETAILS[symbol]?.name || symbol,
      },
    };
  }

  private async storeSignal(signal: TradingSignal): Promise<void> {
    try {
      const insertSignal: InsertTradingSignal = {
        symbol: signal.symbol,
        signalType: signal.signalType,
        confidence: signal.confidence,
        price: signal.price,
        timestamp: signal.timestamp,
        metadata: signal.metadata,
      };
      
      await storage.createTradingSignal(insertSignal);
      
      // If Telegram is connected, send notification
      if (telegramService.isConnected()) {
        const message = this.formatSignalMessage(signal);
        telegramService.sendMessage(message, "SIGNAL");
      }
    } catch (error) {
      console.error("Error storing trading signal:", error);
    }
  }

  private formatSignalMessage(signal: TradingSignal): string {
    const company = STOCK_DETAILS[signal.symbol]?.name || signal.symbol;
    
    if (signal.signalType === SignalType.BUY) {
      return `Buy Signal: ${signal.symbol}. AI detected buying opportunity for ${company}. Current price: ₹${signal.price.toFixed(2)}, confidence: ${signal.confidence.toFixed(1)}%.`;
    } else if (signal.signalType === SignalType.SELL) {
      return `Sell Signal: ${signal.symbol}. AI recommends selling ${company} at current price ₹${signal.price.toFixed(2)}, confidence: ${signal.confidence.toFixed(1)}%.`;
    } else if (signal.signalType === SignalType.STOP_LOSS) {
      return `Stop Loss Alert: ${signal.symbol}. Stop loss recommended for ${company} at ₹${(signal.price * 0.98).toFixed(2)}, current price: ₹${signal.price.toFixed(2)}.`;
    } else {
      return `Market Alert: ${signal.symbol}. AI monitoring ${company}, current price: ₹${signal.price.toFixed(2)}.`;
    }
  }

  // Generate market update
  generateMarketUpdate(): string {
    const updates = [
      "Nifty up 0.8% in morning trade led by banking stocks. IT sector under pressure due to weak global cues.",
      "Markets trading flat amid mixed global signals. Auto stocks outperforming, FMCG under pressure.",
      "Sensex surges 300 points, Nifty above 18,500. Metal stocks leading the gains.",
      "Midcap and smallcap indices underperforming, down 0.5%. Volatility index up 3%.",
      "RBI policy meeting tomorrow, markets cautious. Banking stocks showing divergent trends.",
      "Global markets mixed; Dow up, Nasdaq down. Indian markets following global sentiment.",
      "Oil prices surge 3%, energy stocks rally. ONGC, Reliance top gainers.",
      "IT sector down 1.2% following weak guidance from US tech companies.",
      "Pharma stocks in focus as FDA approvals boost sentiment. Sun Pharma up 2.5%."
    ];
    
    return updates[Math.floor(Math.random() * updates.length)];
  }
}

export const aiTradingService = new AITradingService();

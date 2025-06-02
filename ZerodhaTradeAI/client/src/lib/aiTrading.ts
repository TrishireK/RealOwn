// Mock AI trading signals generator
// In a real implementation, this would use ML models or external API

import { SignalType, TradingSignal } from "@shared/schema";
import { MarketData } from "./zerodha";

export interface AISignal {
  symbol: string;
  company: string;
  signalType: string;
  price: number;
  change: number;
  changePercent: number;
  confidence: number;
  metadata?: Record<string, any>;
}

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
    color: "var(--success)"
  },
  {
    pattern: "Doji Candle",
    symbol: "Reliance Industries",
    significance: "Market indecision, potential reversal",
    reliability: 70,
    color: "var(--warning)"
  },
  {
    pattern: "Head & Shoulders",
    symbol: "Infosys",
    significance: "Bearish reversal pattern",
    reliability: 80,
    color: "var(--destructive)"
  },
  {
    pattern: "Double Bottom",
    symbol: "TCS",
    significance: "Bullish reversal pattern",
    reliability: 75,
    color: "var(--success)"
  },
  {
    pattern: "Hammer",
    symbol: "SBIN",
    significance: "Bullish reversal after downtrend",
    reliability: 65,
    color: "var(--success)"
  }
];

export function analyzeMarketData(data: MarketData): AISignal {
  if (!data || !STOCK_DETAILS[data.symbol]) {
    throw new Error("Invalid market data");
  }

  const { symbol } = data;
  const { name, risk } = STOCK_DETAILS[symbol];
  
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
    symbol,
    company: name,
    signalType,
    price: data.close,
    change,
    changePercent,
    confidence,
    metadata: {
      open: data.open,
      high: data.high,
      low: data.low,
      volume: data.volume,
      risk,
    },
  };
}

export function getSignalsForSymbols(symbols: string[]): AISignal[] {
  return symbols.map(symbol => {
    const isOption = symbol.includes("CE") || symbol.includes("PE");
    const detail = STOCK_DETAILS[symbol] || { name: symbol, risk: 0.5 };
    
    // Generate random changes for the demo
    const basePrice = Math.random() * 3000 + 500;
    const change = (Math.random() * 6 - 3) * (isOption ? 5 : 1);
    const changePercent = change / basePrice * 100;
    
    let signalType: string;
    if (change > 1.5) {
      signalType = SignalType.BUY;
    } else if (change < -1.5) {
      signalType = SignalType.SELL;
    } else if (Math.random() > 0.7) {
      signalType = SignalType.STOP_LOSS;
    } else {
      signalType = Math.random() > 0.5 ? SignalType.BUY : SignalType.SELL;
    }
    
    return {
      symbol,
      company: detail.name,
      signalType,
      price: basePrice,
      change,
      changePercent,
      confidence: 60 + Math.random() * 30,
      metadata: {
        open: basePrice - change / 2,
        high: basePrice + Math.abs(change) / 2,
        low: basePrice - Math.abs(change) / 2,
        volume: Math.floor(Math.random() * 10000000),
        risk: detail.risk,
      }
    };
  });
}

export function generateMarketUpdate(): string {
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

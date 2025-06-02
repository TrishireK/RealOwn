// Utilities for chart generation and handling

export interface CandlestickData {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface ChartOptions {
  height?: number;
  timeframe?: "1D" | "1W" | "1M" | "3M" | "1Y";
  theme?: "dark" | "light";
}

// Market hours (9:15 AM to 3:30 PM)
const MARKET_OPEN_HOUR = 9;
const MARKET_OPEN_MINUTE = 15;
const MARKET_CLOSE_HOUR = 15;
const MARKET_CLOSE_MINUTE = 30;

// Generate random candlestick data for demo purposes
export function generateCandlestickData(
  symbol: string,
  timeframe: "1D" | "1W" | "1M" | "3M" | "1Y" = "1D",
  trend: "up" | "down" | "sideways" = "up"
): CandlestickData[] {
  let points = 0;
  let interval = 0;
  
  switch (timeframe) {
    case "1D":
      points = 75; // 5-minute candles for 6.25 hours
      interval = 5 * 60; // 5 minutes in seconds
      break;
    case "1W":
      points = 5; // Daily candles for a week
      interval = 24 * 60 * 60; // 1 day in seconds
      break;
    case "1M":
      points = 22; // Daily candles for a month
      interval = 24 * 60 * 60; // 1 day in seconds
      break;
    case "3M":
      points = 13; // Weekly candles for 3 months
      interval = 7 * 24 * 60 * 60; // 1 week in seconds
      break;
    case "1Y":
      points = 12; // Monthly candles for a year
      interval = 30 * 24 * 60 * 60; // Approx 1 month in seconds
      break;
  }

  const result: CandlestickData[] = [];
  let baseValue = 10000 + Math.random() * 5000;
  let volatility = 100;

  // Adjust base value for well-known symbols
  if (symbol === "NIFTY 50") baseValue = 18000 + Math.random() * 1000;
  else if (symbol === "RELIANCE") baseValue = 2400 + Math.random() * 100;
  else if (symbol === "HDFCBANK") baseValue = 1600 + Math.random() * 100;
  else if (symbol === "INFY") baseValue = 1400 + Math.random() * 100;
  
  let now = Math.floor(Date.now() / 1000);
  
  // Adjust to market closing time if current time is after market close
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  
  if (currentHour > MARKET_CLOSE_HOUR || 
      (currentHour === MARKET_CLOSE_HOUR && currentMinute >= MARKET_CLOSE_MINUTE)) {
    // Set to today's market close time
    const closeDate = new Date(currentDate);
    closeDate.setHours(MARKET_CLOSE_HOUR, MARKET_CLOSE_MINUTE, 0, 0);
    now = Math.floor(closeDate.getTime() / 1000);
  }
  
  // Set direction based on trend
  let direction = trend === "up" ? 1 : trend === "down" ? -1 : 0;
  
  for (let i = points - 1; i >= 0; i--) {
    const time = now - i * interval;
    
    // Add some randomness to the direction for more realistic charts
    if (Math.random() > 0.7) {
      direction = trend === "sideways" ? (Math.random() > 0.5 ? 0.5 : -0.5) : 
                  trend === "up" ? (Math.random() > 0.7 ? -0.5 : 1) : 
                  (Math.random() > 0.7 ? 0.5 : -1);
    }
    
    const change = direction * (Math.random() * volatility);
    const open = baseValue;
    const close = baseValue + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    baseValue = close;
    
    result.push({
      time,
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });
  }
  
  return result;
}

// Helper function to format money values
export function formatMoney(amount: number): string {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)}K`;
  } else {
    return `₹${amount.toFixed(2)}`;
  }
}

// Helper function to format price values with appropriate commas
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

// Helper function to format percent values
export function formatPercent(percent: number): string {
  return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
}

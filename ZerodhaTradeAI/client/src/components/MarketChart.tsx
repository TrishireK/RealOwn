import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatPrice, formatPercent, generateCandlestickData, CandlestickData } from "@/lib/chartUtils";
import { ZerodhaClient } from "@/lib/zerodha";

interface MarketChartProps {
  symbol?: string;
  initialTimeframe?: "1D" | "1W" | "1M" | "1Y";
}

const MarketChart: React.FC<MarketChartProps> = ({
  symbol = "NIFTY 50",
  initialTimeframe = "1W",
}) => {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y">(initialTimeframe);
  const [data, setData] = useState<CandlestickData[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);
  const [trend, setTrend] = useState<"up" | "down" | "sideways">("up");
  
  // Calculate market data summaries
  const open = data.length > 0 ? data[0].open : 0;
  const close = data.length > 0 ? data[data.length - 1].close : 0;
  const high = data.length > 0 ? Math.max(...data.map(d => d.high)) : 0;
  const low = data.length > 0 ? Math.min(...data.map(d => d.low)) : 0;
  const volume = data.length > 0 ? data.reduce((sum, d) => sum + (d.volume || 0), 0) : 0;
  const change = close - open;
  const changePercent = (change / open) * 100;

  // Load chart data
  useEffect(() => {
    setLoading(true);
    // In a real app, we would fetch this data from an API
    setTimeout(() => {
      const generatedData = generateCandlestickData(symbol, timeframe, trend);
      setData(generatedData);
      setLoading(false);
    }, 500);
  }, [symbol, timeframe, trend]);

  // Create chart background style with the image
  const chartStyle = {
    backgroundImage: "url('https://source.unsplash.com/random/800x400/?stock,chart,candlestick')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: loading ? 0.5 : 1,
  };

  return (
    <Card className="bg-card shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">{symbol}</h3>
            <div className="flex items-center">
              <span className="text-xl font-bold">{formatPrice(close)}</span>
              <span className={`ml-2 ${change >= 0 ? 'text-success' : 'text-destructive'} flex items-center`}>
                {change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {formatPercent(changePercent)}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant={timeframe === "1D" ? "default" : "secondary"} 
              className={`px-3 py-1 text-sm ${timeframe === "1D" ? "bg-accent text-white" : "bg-primary"}`}
              onClick={() => setTimeframe("1D")}
              size="sm"
            >
              1D
            </Button>
            <Button 
              variant={timeframe === "1W" ? "default" : "secondary"} 
              className={`px-3 py-1 text-sm ${timeframe === "1W" ? "bg-accent text-white" : "bg-primary"}`}
              onClick={() => setTimeframe("1W")}
              size="sm"
            >
              1W
            </Button>
            <Button 
              variant={timeframe === "1M" ? "default" : "secondary"} 
              className={`px-3 py-1 text-sm ${timeframe === "1M" ? "bg-accent text-white" : "bg-primary"}`}
              onClick={() => setTimeframe("1M")}
              size="sm"
            >
              1M
            </Button>
            <Button 
              variant={timeframe === "1Y" ? "default" : "secondary"} 
              className={`px-3 py-1 text-sm ${timeframe === "1Y" ? "bg-accent text-white" : "bg-primary"}`}
              onClick={() => setTimeframe("1Y")}
              size="sm"
            >
              1Y
            </Button>
          </div>
        </div>
        
        {/* Candlestick Chart */}
        <div
          ref={chartRef}
          className="candlestick-chart bg-primary transition-opacity duration-300"
          style={chartStyle}
        >
          {loading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Open</p>
            <p className="font-medium">{formatPrice(open)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">High</p>
            <p className="font-medium">{formatPrice(high)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Low</p>
            <p className="font-medium">{formatPrice(low)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Volume</p>
            <p className="font-medium">{(volume / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketChart;

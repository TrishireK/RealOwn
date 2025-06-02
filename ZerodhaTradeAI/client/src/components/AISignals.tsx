import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AISignal, getSignalsForSymbols } from "@/lib/aiTrading";
import { formatPrice, formatPercent } from "@/lib/chartUtils";

const AISignals: React.FC = () => {
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const symbols = ["RELIANCE", "HDFCBANK", "NIFTY 18500 CE", "INFY"];

  useEffect(() => {
    setLoading(true);
    // In a real app, we would fetch this data from an API
    setTimeout(() => {
      const generatedSignals = getSignalsForSymbols(symbols);
      setSignals(generatedSignals);
      setLoading(false);
    }, 800);
  }, []);

  const handleTrade = (signal: AISignal, action: 'buy' | 'sell') => {
    toast({
      title: `${action === 'buy' ? 'Buy' : 'Sell'} order placed`,
      description: `${action === 'buy' ? 'Bought' : 'Sold'} ${signal.symbol} at ${formatPrice(signal.price)}`,
      variant: action === 'buy' ? 'default' : 'destructive',
    });
  };

  const handleAlert = (signal: AISignal) => {
    toast({
      title: "Alert set",
      description: `You'll be notified about ${signal.symbol} price movements`,
      variant: "default",
    });
  };

  const renderSignal = (signal: AISignal) => {
    const isBuy = signal.signalType === "BUY";
    const isSell = signal.signalType === "SELL";
    const isStopLoss = signal.signalType === "STOP_LOSS";
    
    const borderColor = isBuy 
      ? "border-success" 
      : isSell 
        ? "border-destructive" 
        : "border-warning";
    
    const signalBadge = isBuy 
      ? "bg-success bg-opacity-20 text-success" 
      : isSell 
        ? "bg-destructive bg-opacity-20 text-destructive" 
        : "bg-warning bg-opacity-20 text-warning";

    return (
      <div className={`stock-card bg-primary-dark p-4 rounded-lg border-l-4 ${borderColor}`}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <span className="font-bold">{signal.symbol}</span>
              <span className={`ml-2 px-2 py-0.5 ${signalBadge} rounded text-xs`}>
                {signal.signalType}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{signal.company}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">{formatPrice(signal.price)}</p>
            <p className={signal.change >= 0 ? "text-success text-sm" : "text-destructive text-sm"}>
              {formatPercent(signal.changePercent)}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xs text-muted-foreground">
            {isStopLoss ? `SL Price: ${formatPrice(signal.price * 0.99)}` : "AI Confidence"}
          </p>
          <div className="w-full bg-primary rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full ${
                isBuy 
                  ? "bg-success" 
                  : isSell 
                    ? "bg-destructive" 
                    : "bg-warning"
              }`}
              style={{ width: `${signal.confidence}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          {isStopLoss ? (
            <>
              <Button 
                className="bg-warning hover:bg-opacity-80 text-white flex-1 mr-2 text-sm"
                onClick={() => handleAlert(signal)}
              >
                Modify SL
              </Button>
              <Button 
                className="bg-destructive hover:bg-opacity-80 text-white flex-1 text-sm"
                onClick={() => handleTrade(signal, 'sell')}
              >
                Exit Position
              </Button>
            </>
          ) : (
            <>
              <Button 
                className={`${isBuy ? 'bg-success' : 'bg-destructive'} hover:bg-opacity-80 text-white flex-1 mr-2 text-sm`}
                onClick={() => handleTrade(signal, isBuy ? 'buy' : 'sell')}
              >
                {isBuy ? 'Buy Now' : 'Sell Now'}
              </Button>
              <Button 
                className="bg-primary hover:bg-primary-light text-white flex-1 text-sm"
                onClick={() => handleAlert(signal)}
              >
                Set Alert
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>AI Trading Signals</CardTitle>
          <div className="flex items-center">
            <Clock className="text-accent mr-1" size={16} />
            <span className="text-xs text-muted-foreground">Updated 5m ago</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-primary-dark animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signals.map((signal, index) => (
              <React.Fragment key={index}>
                {renderSignal(signal)}
              </React.Fragment>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISignals;

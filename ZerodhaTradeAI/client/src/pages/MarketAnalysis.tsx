import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarketChart from "@/components/MarketChart";
import TechnicalPatterns from "@/components/TechnicalPatterns";
import { Badge } from "@/components/ui/badge";
import { TECHNICAL_PATTERNS } from "@/lib/aiTrading";

const MarketAnalysis: React.FC = () => {
  const stockIndices = [
    { symbol: "NIFTY 50", name: "Nifty 50", trend: "up" as const },
    { symbol: "BANKNIFTY", name: "Bank Nifty", trend: "up" as const },
    { symbol: "NIFTY IT", name: "Nifty IT", trend: "down" as const },
    { symbol: "NIFTY METAL", name: "Nifty Metal", trend: "sideways" as const }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Market Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MarketChart symbol="NIFTY 50" initialTimeframe="1M" />
          
          <Card className="bg-card shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle>Market Indices</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {stockIndices.map((index) => (
                  <div key={index.symbol} className="p-3 bg-primary-dark rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{index.name}</p>
                      <p className="text-sm text-muted-foreground">{index.symbol}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className={`${
                          index.trend === 'up' 
                            ? 'bg-success/10 text-success border-success/20' 
                            : index.trend === 'down' 
                              ? 'bg-destructive/10 text-destructive border-destructive/20' 
                              : 'bg-warning/10 text-warning border-warning/20'
                        }`}
                      >
                        {index.trend === 'up' ? 'Bullish' : index.trend === 'down' ? 'Bearish' : 'Neutral'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
          
        <div className="space-y-6">
          <Card className="bg-card shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle>Pattern Recognition</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {TECHNICAL_PATTERNS.map((pattern, index) => (
                  <div key={index} className="p-3 bg-primary-dark rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: pattern.color }}
                        ></span>
                        {pattern.pattern}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`${
                          pattern.pattern.includes('Bullish') || pattern.pattern.includes('Bottom') 
                            ? 'bg-success/10 text-success border-success/20' 
                            : pattern.pattern.includes('Bearish') || pattern.pattern.includes('Head & Shoulders')
                              ? 'bg-destructive/10 text-destructive border-destructive/20' 
                              : 'bg-warning/10 text-warning border-warning/20'
                        }`}
                      >
                        {pattern.reliability}% Reliable
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Found on {pattern.symbol}
                    </p>
                    <p className="text-sm mt-1">
                      {pattern.significance}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <TechnicalPatterns />
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;

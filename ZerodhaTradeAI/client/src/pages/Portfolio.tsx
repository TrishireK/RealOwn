import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatPercent } from "@/lib/chartUtils";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock portfolio data
const portfolioSummary = {
  totalValue: 345620,
  dayChange: 4523.5,
  dayChangePercent: 1.32,
  allocatedFunds: 298450,
  availableCash: 47170,
};

const portfolioHoldings = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    quantity: 25,
    avgPrice: 2350.75,
    currentPrice: 2452.30,
    value: 61307.5,
    pnl: 2538.75,
    pnlPercent: 4.32,
    allocation: 17.74,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    quantity: 40,
    avgPrice: 1590.60,
    currentPrice: 1623.45,
    value: 64938,
    pnl: 1314,
    pnlPercent: 2.07,
    allocation: 18.79,
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd.",
    quantity: 50,
    avgPrice: 1500.20,
    currentPrice: 1432.60,
    value: 71630,
    pnl: -3380,
    pnlPercent: -4.51,
    allocation: 20.73,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd.",
    quantity: 15,
    avgPrice: 3320.50,
    currentPrice: 3456.80,
    value: 51852,
    pnl: 2044.5,
    pnlPercent: 4.10,
    allocation: 15.00,
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    quantity: 100,
    avgPrice: 482.30,
    currentPrice: 487.25,
    value: 48725,
    pnl: 495,
    pnlPercent: 1.03,
    allocation: 14.10,
  },
  {
    symbol: "TATASTEEL",
    name: "Tata Steel Ltd.",
    quantity: 60,
    avgPrice: 995.40,
    currentPrice: 950.25,
    value: 57015,
    pnl: -2709,
    pnlPercent: -4.54,
    allocation: 16.50,
  }
];

const Portfolio: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Portfolio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card shadow-lg md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Portfolio Summary</CardTitle>
              <div className="flex items-center">
                <span className={`ml-2 ${portfolioSummary.dayChange >= 0 ? 'text-success' : 'text-destructive'} flex items-center`}>
                  {portfolioSummary.dayChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {formatPrice(portfolioSummary.dayChange)} ({formatPercent(portfolioSummary.dayChangePercent)})
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-3xl font-bold">{formatPrice(portfolioSummary.totalValue)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Allocated</p>
                  <p className="text-xl font-medium">{formatPrice(portfolioSummary.allocatedFunds)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Cash</p>
                  <p className="text-xl font-medium">{formatPrice(portfolioSummary.availableCash)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm font-medium">Sector Allocation</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm">Banking & Finance</p>
                    <p className="text-sm font-medium">32.8%</p>
                  </div>
                  <Progress value={32.8} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm">IT</p>
                    <p className="text-sm font-medium">35.7%</p>
                  </div>
                  <Progress value={35.7} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm">Energy</p>
                    <p className="text-sm font-medium">17.7%</p>
                  </div>
                  <Progress value={17.7} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm">Metal</p>
                    <p className="text-sm font-medium">14.5%</p>
                  </div>
                  <Progress value={14.5} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle>Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Portfolio Risk</p>
                <div className="w-full bg-primary rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Low</span>
                  <span className="font-medium">Moderate</span>
                  <span>High</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Risk Factors</p>
                
                <div className="p-3 bg-primary-dark rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Concentration Risk</p>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      Medium
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    IT sector represents 35.7% of portfolio
                  </p>
                </div>
                
                <div className="p-3 bg-primary-dark rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Volatility</p>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Low
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Beta of 0.92 vs market
                  </p>
                </div>
                
                <div className="p-3 bg-primary-dark rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Market Risk</p>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      Medium
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sensitive to interest rate changes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-card shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {portfolioHoldings.map((holding) => (
              <div key={holding.symbol} className="p-4 bg-primary-dark rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{holding.symbol}</p>
                    <p className="text-sm text-muted-foreground">{holding.name}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(holding.currentPrice)}</p>
                    <p className={holding.pnl >= 0 ? "text-success text-sm" : "text-destructive text-sm"}>
                      {formatPercent(holding.pnlPercent)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="font-medium">{holding.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg. Price</p>
                    <p className="font-medium">{formatPrice(holding.avgPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Value</p>
                    <p className="font-medium">{formatPrice(holding.value)}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-muted-foreground">Portfolio Allocation</p>
                    <p className="text-xs font-medium">{formatPercent(holding.allocation)}</p>
                  </div>
                  <div className="w-full bg-primary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${holding.pnl >= 0 ? 'bg-success' : 'bg-destructive'}`}
                      style={{ width: `${holding.allocation}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;

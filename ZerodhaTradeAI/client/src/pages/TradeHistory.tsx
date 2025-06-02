import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, formatPercent } from "@/lib/chartUtils";

// Mock trade data
const mockTrades = [
  {
    id: 1,
    symbol: "RELIANCE",
    type: "BUY",
    quantity: 10,
    entryPrice: 2432.5,
    exitPrice: 2452.3,
    entryTime: new Date('2023-04-10T10:15:00'),
    exitTime: new Date('2023-04-10T14:30:00'),
    pnl: 198.0,
    pnlPercent: 0.81,
    status: "CLOSED",
    isAiGenerated: true,
  },
  {
    id: 2,
    symbol: "HDFCBANK",
    type: "SELL",
    quantity: 15,
    entryPrice: 1662.4,
    exitPrice: 1623.45,
    entryTime: new Date('2023-04-08T11:20:00'),
    exitTime: new Date('2023-04-09T13:15:00'),
    pnl: 584.25,
    pnlPercent: 2.34,
    status: "CLOSED",
    isAiGenerated: false,
  },
  {
    id: 3,
    symbol: "NIFTY 18500 CE",
    type: "BUY",
    quantity: 1,
    entryPrice: 125.6,
    exitPrice: null,
    entryTime: new Date('2023-04-10T09:30:00'),
    exitTime: null,
    pnl: null,
    pnlPercent: null,
    status: "OPEN",
    isAiGenerated: true,
  },
  {
    id: 4,
    symbol: "INFY",
    type: "BUY",
    quantity: 20,
    entryPrice: 1442.0,
    exitPrice: 1430.5,
    entryTime: new Date('2023-04-05T10:05:00'),
    exitTime: new Date('2023-04-06T15:25:00'),
    pnl: -230.0,
    pnlPercent: -0.8,
    status: "CLOSED",
    isAiGenerated: false,
  },
  {
    id: 5,
    symbol: "TCS",
    type: "BUY",
    quantity: 5,
    entryPrice: 3452.7,
    exitPrice: null,
    entryTime: new Date('2023-04-11T11:45:00'),
    exitTime: null,
    pnl: null,
    pnlPercent: null,
    status: "OPEN",
    isAiGenerated: false,
  },
];

const TradeHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredTrades = mockTrades.filter(trade => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return trade.status === "OPEN";
    if (activeTab === "closed") return trade.status === "CLOSED";
    if (activeTab === "ai") return trade.isAiGenerated;
    return true;
  });
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Trade History</h1>
      
      <Card className="bg-card shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Your Trades</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Trades</TabsTrigger>
              <TabsTrigger value="open">Open Positions</TabsTrigger>
              <TabsTrigger value="closed">Closed Trades</TabsTrigger>
              <TabsTrigger value="ai">AI Generated</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Entry Price</TableHead>
                      <TableHead>Exit Price</TableHead>
                      <TableHead>Entry Time</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrades.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          No trades found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTrades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">{trade.symbol}</TableCell>
                          <TableCell>
                            <Badge variant={trade.type === "BUY" ? "default" : "destructive"}>
                              {trade.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{trade.quantity}</TableCell>
                          <TableCell>{formatPrice(trade.entryPrice)}</TableCell>
                          <TableCell>{trade.exitPrice ? formatPrice(trade.exitPrice) : '-'}</TableCell>
                          <TableCell>{formatDate(trade.entryTime)}</TableCell>
                          <TableCell className={
                            trade.pnl === null ? '' : trade.pnl >= 0 ? 'text-success' : 'text-destructive'
                          }>
                            {trade.pnl !== null ? 
                              `${formatPrice(trade.pnl)} (${formatPercent(trade.pnlPercent!)})` : 
                              '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={trade.status === "OPEN" ? "outline" : "secondary"}>
                              {trade.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              trade.isAiGenerated ? 
                                'bg-accent/10 text-accent border-accent/20' : 
                                'bg-muted/10 text-muted-foreground border-muted/20'
                            }>
                              {trade.isAiGenerated ? 'AI' : 'Manual'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="bg-card shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-dark rounded-lg">
              <p className="text-sm text-muted-foreground">Total Trades</p>
              <p className="text-2xl font-bold">{mockTrades.length}</p>
              <p className="text-sm mt-1">
                <span className="text-success">
                  {mockTrades.filter(t => t.pnl !== null && t.pnl > 0).length} profitable
                </span> / 
                <span className="text-destructive ml-1">
                  {mockTrades.filter(t => t.pnl !== null && t.pnl < 0).length} losses
                </span>
              </p>
            </div>
            
            <div className="p-4 bg-primary-dark rounded-lg">
              <p className="text-sm text-muted-foreground">Cumulative P&L</p>
              <p className="text-2xl font-bold text-success">
                {formatPrice(
                  mockTrades
                    .filter(t => t.pnl !== null)
                    .reduce((sum, t) => sum + t.pnl!, 0)
                )}
              </p>
              <p className="text-sm mt-1">
                Win rate: {
                  Math.round(
                    (mockTrades.filter(t => t.pnl !== null && t.pnl > 0).length / 
                    mockTrades.filter(t => t.pnl !== null).length) * 100
                  )
                }%
              </p>
            </div>
            
            <div className="p-4 bg-primary-dark rounded-lg">
              <p className="text-sm text-muted-foreground">AI Generated</p>
              <p className="text-2xl font-bold text-accent">
                {mockTrades.filter(t => t.isAiGenerated).length}
              </p>
              <p className="text-sm mt-1">
                Performance: {
                  formatPercent(
                    (mockTrades
                      .filter(t => t.isAiGenerated && t.pnl !== null)
                      .reduce((sum, t) => sum + t.pnlPercent!, 0)) / 
                    mockTrades.filter(t => t.isAiGenerated && t.pnl !== null).length
                  )
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeHistory;

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const QuickTradePanel: React.FC = () => {
  const [symbol, setSymbol] = useState<string>("");
  const [action, setAction] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT" | "SL" | "SL-M">("MARKET");
  const [quantity, setQuantity] = useState<number>(10);
  const [price, setPrice] = useState<number | null>(null);
  const { toast } = useToast();

  const handlePlaceOrder = () => {
    if (!symbol) {
      toast({
        title: "Error",
        description: "Please enter a valid symbol",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Placed",
      description: `${action} ${quantity} ${symbol} at ${orderType === "MARKET" ? "market price" : `₹${price}`}`,
      variant: action === "BUY" ? "default" : "destructive",
    });
  };

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle>Quick Trade</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="block text-sm mb-1">Symbol</Label>
            <Input 
              type="text" 
              placeholder="Enter stock symbol" 
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-primary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="block text-sm mb-1">Action</Label>
              <div className="flex">
                <Button 
                  type="button"
                  className={`flex-1 ${action === "BUY" ? "bg-success text-white" : "bg-primary border-t border-b border-muted text-foreground"} py-2 rounded-l-lg`}
                  onClick={() => setAction("BUY")}
                >
                  Buy
                </Button>
                <Button 
                  type="button"
                  className={`flex-1 ${action === "SELL" ? "bg-destructive text-white" : "bg-primary border-t border-b border-muted text-foreground"} py-2 rounded-r-lg`}
                  onClick={() => setAction("SELL")}
                >
                  Sell
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm mb-1">Order Type</Label>
              <Select 
                value={orderType}
                onValueChange={(value: any) => {
                  setOrderType(value);
                  if (value === "MARKET") {
                    setPrice(null);
                  }
                }}
              >
                <SelectTrigger className="w-full bg-primary rounded-lg text-white">
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MARKET">Market</SelectItem>
                  <SelectItem value="LIMIT">Limit</SelectItem>
                  <SelectItem value="SL">SL</SelectItem>
                  <SelectItem value="SL-M">SL-M</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="block text-sm mb-1">Quantity</Label>
              <Input 
                type="number" 
                value={quantity} 
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-primary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            
            <div>
              <Label className="block text-sm mb-1">Price (if applicable)</Label>
              <Input 
                type="number" 
                placeholder="Market Price" 
                disabled={orderType === "MARKET"}
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={`w-full px-3 py-2 bg-primary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${orderType === "MARKET" ? "opacity-50" : ""}`}
              />
            </div>
          </div>
          
          <Button 
            onClick={handlePlaceOrder}
            className={`w-full ${action === "BUY" ? "bg-success" : "bg-destructive"} hover:bg-opacity-90 text-white py-2 rounded-lg font-medium`}
          >
            Place Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickTradePanel;

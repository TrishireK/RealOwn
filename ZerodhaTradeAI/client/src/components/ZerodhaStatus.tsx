import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useZerodha } from "@/hooks/useZerodha";
import { CheckCircle } from "lucide-react";
import { formatMoney } from "@/lib/chartUtils";

const ZerodhaStatus: React.FC = () => {
  const { isConnected, account, refreshConnection } = useZerodha();
  const { toast } = useToast();

  const handleRefresh = () => {
    refreshConnection();
    toast({
      title: "Connection refreshed",
      description: "Zerodha connection has been updated",
    });
  };

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle>Zerodha Connection</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="p-3 bg-primary-dark rounded-lg flex items-center mb-4">
          <div className="w-10 h-10 rounded-lg mr-3 bg-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="32" height="32">
              <path d="M0 0h200v200H0z" fill="#387ed1" />
              <path fill="#ffffff" d="M133.8 47.1H66.7L39.4 100l27.3 52.9h67.1l27.3-52.9z" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Zerodha Kite</p>
            <div className="flex items-center text-sm text-success">
              <CheckCircle className="mr-1" size={16} />
              Connected
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-primary-dark p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Available Margin</p>
            <p className="font-bold text-lg">{formatMoney(account?.availableMargin || 0)}</p>
          </div>
          <div className="bg-primary-dark p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Used Margin</p>
            <p className="font-bold text-lg">{formatMoney(account?.usedMargin || 0)}</p>
          </div>
        </div>
        
        <Button 
          onClick={handleRefresh}
          variant="outline" 
          className="w-full bg-primary hover:bg-primary-dark text-foreground border border-muted"
        >
          Refresh Connection
        </Button>
      </CardContent>
    </Card>
  );
};

export default ZerodhaStatus;

import React, { useState, useEffect } from "react";
import { Bell, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useMarketStatus } from "@/hooks/useZerodha";
import { useTelegram } from "@/hooks/useTelegram";

const Topbar: React.FC = () => {
  const { toast } = useToast();
  const { isMarketOpen } = useMarketStatus();
  const { isConnected } = useTelegram();

  const handleNewTrade = () => {
    toast({
      title: "New Trade",
      description: "Trade creation functionality is in development",
    });
  };

  return (
    <div className="h-16 border-b border-primary-light flex items-center justify-between px-4">
      <div className="flex items-center">
        <h2 className="text-xl font-medium">Dashboard</h2>
        <div className="ml-6 flex items-center bg-primary-light rounded-full px-3 py-1">
          <span className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-success' : 'bg-destructive'} mr-2`}></span>
          <span className="text-sm">{isMarketOpen ? 'Market Open' : 'Market Closed'}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative bg-primary-light rounded-full">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-3 h-3 bg-destructive rounded-full border border-primary-light"></span>
        </Button>
        
        <div className="bg-primary-light rounded-full px-4 py-2 flex items-center text-foreground">
          <span className={`w-2 h-2 mr-2 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive'}`}></span>
          <span className="text-sm">{isConnected ? 'Connected to Telegram' : 'Telegram Disconnected'}</span>
        </div>
        
        <Button onClick={handleNewTrade} className="bg-accent hover:bg-accent-light text-white">
          <Plus size={20} className="mr-2" />
          New Trade
        </Button>
      </div>
    </div>
  );
};

export default Topbar;

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTelegram } from "@/hooks/useTelegram";
import { useToast } from "@/hooks/use-toast";
import { NotificationType } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageAction {
  message: string;
  timestamp: Date;
  type: string;
  hasActions?: boolean;
}

const TelegramNotifications: React.FC = () => {
  const { messages, isConnected, acceptSignal, ignoreSignal } = useTelegram();
  const { toast } = useToast();
  
  const handleConfig = () => {
    toast({
      title: "Configure Telegram",
      description: "Telegram configuration functionality is in development",
    });
  };

  const handleViewAll = () => {
    toast({
      title: "View All",
      description: "Full notification history functionality is in development",
    });
  };

  const handleAccept = (message: MessageAction) => {
    acceptSignal(message);
    toast({
      title: "Signal Accepted",
      description: `You've accepted the recommendation for ${message.message.split(':')[1]?.split('.')[0] || 'this asset'}`,
      variant: "default",
    });
  };

  const handleIgnore = (message: MessageAction) => {
    ignoreSignal(message);
    toast({
      title: "Signal Ignored",
      description: "The trading signal has been ignored",
      variant: "destructive",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = (message: MessageAction) => {
    const isSignal = message.type === NotificationType.SIGNAL;
    
    return (
      <div className="telegram-message bg-primary-dark p-3 rounded-lg mb-3">
        <div className="flex justify-between items-center mb-1">
          <p className="font-medium text-sm">{message.message.split(':')[0]}</p>
          <p className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</p>
        </div>
        <p className="text-sm">{message.message.split(':').slice(1).join(':').trim()}</p>
        {message.hasActions && (
          <div className="flex mt-2">
            <Button 
              size="sm" 
              variant="default"
              className="bg-success text-xs px-2 py-1 rounded text-white mr-2"
              onClick={() => handleAccept(message)}
            >
              Accept
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-muted text-xs px-2 py-1 rounded text-white"
              onClick={() => handleIgnore(message)}
            >
              Ignore
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Telegram Notifications</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs px-2 py-1 bg-accent bg-opacity-20 text-accent rounded-full"
            onClick={handleConfig}
          >
            Configure
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <React.Fragment key={index}>
                  {renderMessage(message)}
                </React.Fragment>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            className="text-accent text-sm"
            onClick={handleViewAll}
          >
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramNotifications;

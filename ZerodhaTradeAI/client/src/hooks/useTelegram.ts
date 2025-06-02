import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { NotificationType } from "@shared/schema";

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface TelegramMessage {
  id: string;
  message: string;
  timestamp: Date;
  type: string;
  hasActions?: boolean;
}

export function useTelegram() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const { toast } = useToast();

  // Check connection status and get messages on mount
  useEffect(() => {
    checkConnection();
    fetchMessages();
  }, []);

  async function checkConnection() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/telegram/status');
      if (res.ok) {
        const data = await res.json();
        setIsConnected(data.isConnected);
      }
    } catch (error) {
      console.error("Error checking Telegram connection:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchMessages() {
    try {
      const res = await fetch('/api/telegram/messages');
      if (res.ok) {
        const data = await res.json();
        
        // Transform the data to match our expected format
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          message: msg.message,
          timestamp: new Date(msg.timestamp),
          type: msg.type,
          hasActions: msg.type === NotificationType.SIGNAL
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching Telegram messages:", error);
    }
  }

  async function connect(config: TelegramConfig) {
    try {
      setIsLoading(true);
      const res = await apiRequest(
        'POST',
        '/api/telegram/connect',
        config
      );
      
      if (res.ok) {
        setIsConnected(true);
        fetchMessages(); // Refresh messages after connecting
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error connecting to Telegram:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Telegram. Please check your credentials.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function disconnect() {
    try {
      setIsLoading(true);
      const res = await apiRequest('POST', '/api/telegram/disconnect', {});
      if (res.ok) {
        setIsConnected(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error disconnecting from Telegram:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage(message: string, type: string) {
    try {
      const res = await apiRequest(
        'POST',
        '/api/telegram/send',
        { message, type }
      );
      
      if (res.ok) {
        const data = await res.json();
        // Refresh messages after sending
        await fetchMessages();
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      toast({
        title: "Send Failed",
        description: "Could not send Telegram message.",
        variant: "destructive",
      });
      return null;
    }
  }

  async function acceptSignal(message: TelegramMessage) {
    try {
      await apiRequest(
        'POST',
        '/api/telegram/signal/accept',
        { messageId: message.id }
      );
      
      // Refresh messages list
      await fetchMessages();
    } catch (error) {
      console.error("Error accepting signal:", error);
      toast({
        title: "Action Failed",
        description: "Could not accept the trading signal.",
        variant: "destructive",
      });
    }
  }

  async function ignoreSignal(message: TelegramMessage) {
    try {
      await apiRequest(
        'POST',
        '/api/telegram/signal/ignore',
        { messageId: message.id }
      );
      
      // Refresh messages list
      await fetchMessages();
    } catch (error) {
      console.error("Error ignoring signal:", error);
      toast({
        title: "Action Failed",
        description: "Could not ignore the trading signal.",
        variant: "destructive",
      });
    }
  }

  return {
    isConnected,
    isLoading,
    messages,
    connect,
    disconnect,
    sendMessage,
    acceptSignal,
    ignoreSignal,
    refreshMessages: fetchMessages
  };
}

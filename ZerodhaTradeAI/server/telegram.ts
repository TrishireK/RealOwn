// Mock Telegram bot service
// In a real implementation, this would use the Telegram Bot API

import { TelegramMessage } from "@/hooks/useTelegram";
import { NotificationType, NotificationStatus } from "@shared/schema";

// Mock data for demonstration
const MOCK_MESSAGES: TelegramMessage[] = [
  {
    id: "1",
    type: NotificationType.SIGNAL,
    message: "Buy Signal: INFY. AI detected strong buying opportunity for Infosys Ltd. Current price: ₹1,432.60, target: ₹1,485.00 (3.6%)",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    hasActions: true
  },
  {
    id: "2",
    type: NotificationType.ALERT,
    message: "Stop Loss Triggered: TATASTEEL. Stop loss triggered for Tata Steel at ₹950.25. Position closed automatically. P&L: -₹2,340 (-2.1%)",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    hasActions: false
  },
  {
    id: "3",
    type: NotificationType.MARKET_UPDATE,
    message: "Market Update: Nifty up 0.8% in morning trade led by banking stocks. IT sector under pressure due to weak global cues.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    hasActions: false
  },
  {
    id: "4",
    type: NotificationType.SIGNAL,
    message: "Sell Signal: NIFTY 18600 PE. AI recommends selling NIFTY 18600 PE options at current price ₹95.40 as market expected to move upward.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    hasActions: true
  },
];

class TelegramService {
  private botToken: string | null = null;
  private chatId: string | null = null;
  private _isConnected: boolean = false;
  private messages: TelegramMessage[] = [...MOCK_MESSAGES];

  constructor() {
    // In a real implementation, we might check for environment variables here
  }

  connect(botToken: string, chatId: string): boolean {
    this.botToken = botToken;
    this.chatId = chatId;
    this._isConnected = true;
    
    // In a real implementation, we would verify the connection here
    return true;
  }

  disconnect(): void {
    this.botToken = null;
    this.chatId = null;
    this._isConnected = false;
  }

  isConnected(): boolean {
    return this._isConnected;
  }

  sendMessage(message: string, type: string): TelegramMessage {
    if (!this._isConnected) {
      throw new Error("Telegram bot not connected");
    }
    
    // In a real implementation, this would call the Telegram API
    const newMessage: TelegramMessage = {
      id: Math.random().toString(36).substring(2, 10),
      message,
      type,
      timestamp: new Date(),
      hasActions: type === NotificationType.SIGNAL
    };
    
    this.messages.unshift(newMessage);
    return newMessage;
  }

  getMessages(): TelegramMessage[] {
    return this.messages;
  }

  getMessageById(id: string): TelegramMessage | undefined {
    return this.messages.find(m => m.id === id);
  }

  deleteMessage(id: string): boolean {
    const index = this.messages.findIndex(m => m.id === id);
    if (index >= 0) {
      this.messages.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const telegramService = new TelegramService();

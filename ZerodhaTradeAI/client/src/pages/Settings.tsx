import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Key, MessageSquare, Server, Settings as SettingsIcon } from "lucide-react";
import { useZerodha } from "@/hooks/useZerodha";
import { useTelegram } from "@/hooks/useTelegram";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("zerodha");
  const { connect: connectZerodha, isConnected: isZerodhaConnected } = useZerodha();
  const { connect: connectTelegram, isConnected: isTelegramConnected } = useTelegram();
  
  // Zerodha credentials
  const [zerodhaApiKey, setZerodhaApiKey] = useState("");
  const [zerodhaApiSecret, setZerodhaApiSecret] = useState("");
  
  // Telegram settings
  const [telegramToken, setTelegramToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  
  // Notification settings
  const [enableBuySignals, setEnableBuySignals] = useState(true);
  const [enableSellSignals, setEnableSellSignals] = useState(true);
  const [enableStopLoss, setEnableStopLoss] = useState(true);
  const [enableMarketUpdates, setEnableMarketUpdates] = useState(true);
  
  // App settings
  const [enableDesktopNotifications, setEnableDesktopNotifications] = useState(true);
  const [enableSounds, setEnableSounds] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const handleConnectZerodha = () => {
    if (!zerodhaApiKey || !zerodhaApiSecret) {
      toast({
        title: "Error",
        description: "Please provide both API key and secret",
        variant: "destructive",
      });
      return;
    }
    
    connectZerodha(zerodhaApiKey, zerodhaApiSecret);
    toast({
      title: "Success",
      description: "Zerodha account connected successfully",
    });
  };
  
  const handleConnectTelegram = () => {
    if (!telegramToken || !telegramChatId) {
      toast({
        title: "Error",
        description: "Please provide both Telegram bot token and chat ID",
        variant: "destructive",
      });
      return;
    }
    
    connectTelegram({ botToken: telegramToken, chatId: telegramChatId });
    toast({
      title: "Success",
      description: "Telegram bot connected successfully",
    });
  };
  
  const handleSaveNotificationSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated",
    });
  };
  
  const handleSaveAppSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your application settings have been updated",
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Tabs defaultValue="zerodha" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="zerodha" className="flex items-center">
            <Server className="mr-2 h-4 w-4" />
            Zerodha Integration
          </TabsTrigger>
          <TabsTrigger value="telegram" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Telegram Bot
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="app" className="flex items-center">
            <SettingsIcon className="mr-2 h-4 w-4" />
            App Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="zerodha">
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Zerodha API Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isZerodhaConnected ? (
                <Alert className="bg-success/10 border-success/50 text-success">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connected</AlertTitle>
                  <AlertDescription>
                    Your Zerodha account is successfully connected
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-destructive/10 border-destructive/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Not Connected</AlertTitle>
                  <AlertDescription>
                    Connect your Zerodha account to enable trading
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Zerodha API Key</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type="text"
                      placeholder="Enter your Zerodha API key"
                      value={zerodhaApiKey}
                      onChange={(e) => setZerodhaApiKey(e.target.value)}
                      className="pr-10"
                    />
                    <Key className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can find your API key in the Zerodha developer settings
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-secret">Zerodha API Secret</Label>
                  <Input
                    id="api-secret"
                    type="password"
                    placeholder="Enter your Zerodha API secret"
                    value={zerodhaApiSecret}
                    onChange={(e) => setZerodhaApiSecret(e.target.value)}
                  />
                </div>
                
                <div className="pt-2">
                  <Button onClick={handleConnectZerodha} className="bg-accent hover:bg-accent-light">
                    {isZerodhaConnected ? "Reconnect" : "Connect"} Zerodha Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="telegram">
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Telegram Bot Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isTelegramConnected ? (
                <Alert className="bg-success/10 border-success/50 text-success">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connected</AlertTitle>
                  <AlertDescription>
                    Your Telegram bot is successfully connected
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-destructive/10 border-destructive/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Not Connected</AlertTitle>
                  <AlertDescription>
                    Connect your Telegram bot to receive trading notifications
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bot-token">Telegram Bot Token</Label>
                  <Input
                    id="bot-token"
                    type="password"
                    placeholder="Enter your Telegram bot token"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Create a bot via BotFather to get your token
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="chat-id">Telegram Chat ID</Label>
                  <Input
                    id="chat-id"
                    type="text"
                    placeholder="Enter your Telegram chat ID"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Use @getmyid_bot to find your chat ID
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button onClick={handleConnectTelegram} className="bg-accent hover:bg-accent-light">
                    {isTelegramConnected ? "Reconnect" : "Connect"} Telegram Bot
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="buy-signals">Buy Signals</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for AI buy recommendations
                    </p>
                  </div>
                  <Switch
                    id="buy-signals"
                    checked={enableBuySignals}
                    onCheckedChange={setEnableBuySignals}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sell-signals">Sell Signals</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for AI sell recommendations
                    </p>
                  </div>
                  <Switch
                    id="sell-signals"
                    checked={enableSellSignals}
                    onCheckedChange={setEnableSellSignals}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="stop-loss">Stop Loss Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when stop losses are triggered
                    </p>
                  </div>
                  <Switch
                    id="stop-loss"
                    checked={enableStopLoss}
                    onCheckedChange={setEnableStopLoss}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="market-updates">Market Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive general market updates and news
                    </p>
                  </div>
                  <Switch
                    id="market-updates"
                    checked={enableMarketUpdates}
                    onCheckedChange={setEnableMarketUpdates}
                  />
                </div>
                
                <div className="pt-2">
                  <Button onClick={handleSaveNotificationSettings} className="bg-accent hover:bg-accent-light">
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="app">
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show desktop notifications for important alerts
                    </p>
                  </div>
                  <Switch
                    id="desktop-notifications"
                    checked={enableDesktopNotifications}
                    onCheckedChange={setEnableDesktopNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sounds">Sound Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for important notifications
                    </p>
                  </div>
                  <Switch
                    id="sounds"
                    checked={enableSounds}
                    onCheckedChange={setEnableSounds}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-refresh">Auto-Refresh Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically refresh market data every minute
                    </p>
                  </div>
                  <Switch
                    id="auto-refresh"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                </div>
                
                <div className="pt-2">
                  <Button onClick={handleSaveAppSettings} className="bg-accent hover:bg-accent-light">
                    Save Application Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

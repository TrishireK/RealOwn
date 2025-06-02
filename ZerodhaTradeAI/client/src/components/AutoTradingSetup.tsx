import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InstrumentType } from "@shared/schema";

const AutoTradingSetup: React.FC = () => {
  const [autoTradingEnabled, setAutoTradingEnabled] = useState<boolean>(false);
  const [maxCapital, setMaxCapital] = useState<number>(5);
  const [stopLoss, setStopLoss] = useState<number>(2);
  const [takeProfit, setTakeProfit] = useState<number>(5);
  const [instrumentType, setInstrumentType] = useState<string>(InstrumentType.STOCKS_AND_OPTIONS);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(75);
  const [defaultLotSize, setDefaultLotSize] = useState<number>(1);
  const { toast } = useToast();

  const handleToggleAutoTrading = () => {
    if (!autoTradingEnabled) {
      // Show confirmation before enabling
      if (window.confirm('Are you sure you want to enable AI Auto-Trading? This will allow the system to make trades based on your settings.')) {
        setAutoTradingEnabled(true);
        toast({
          title: "Auto-trading enabled",
          description: "AI will now execute trades based on your risk parameters",
        });
      }
    } else {
      setAutoTradingEnabled(false);
      toast({
        title: "Auto-trading disabled",
        description: "AI trading has been turned off",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your trading parameters have been updated",
    });
  };

  const handleResetDefaults = () => {
    setMaxCapital(5);
    setStopLoss(2);
    setTakeProfit(5);
    setInstrumentType(InstrumentType.STOCKS_AND_OPTIONS);
    setConfidenceThreshold(75);
    setDefaultLotSize(1);
    toast({
      title: "Settings reset",
      description: "Risk parameters have been reset to defaults",
    });
  };

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>AI Auto-Trading Setup</CardTitle>
          <div className="flex items-center">
            <span className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input 
                type="checkbox" 
                name="toggle" 
                id="auto-trading-toggle" 
                checked={autoTradingEnabled}
                onChange={handleToggleAutoTrading}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label 
                htmlFor="auto-trading-toggle" 
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"
              ></label>
            </span>
            <label 
              htmlFor="auto-trading-toggle" 
              className={`text-sm ${autoTradingEnabled ? 'text-success' : 'text-foreground'}`}
            >
              {autoTradingEnabled ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Risk Management</h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm mb-1">Max Capital per Trade (%)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={maxCapital} 
                    min={1}
                    max={50}
                    onChange={(e) => setMaxCapital(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-primary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <span className="absolute right-3 top-2 text-muted-foreground">%</span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm mb-1">Stop Loss (%)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={stopLoss}
                    min={0.5}
                    max={10}
                    onChange={(e) => setStopLoss(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-primary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <span className="absolute right-3 top-2 text-muted-foreground">%</span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm mb-1">Take Profit (%)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={takeProfit}
                    min={1}
                    max={20}
                    onChange={(e) => setTakeProfit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-primary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <span className="absolute right-3 top-2 text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Trading Preferences</h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm mb-1">Instrument Type</Label>
                <Select
                  value={instrumentType}
                  onValueChange={(value) => setInstrumentType(value)}
                >
                  <SelectTrigger className="w-full bg-primary text-white">
                    <SelectValue placeholder="Select instrument type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={InstrumentType.STOCKS_AND_OPTIONS}>Stocks & Options</SelectItem>
                    <SelectItem value={InstrumentType.STOCKS_ONLY}>Stocks Only</SelectItem>
                    <SelectItem value={InstrumentType.OPTIONS_ONLY}>Options Only</SelectItem>
                    <SelectItem value={InstrumentType.FUTURES_ONLY}>Futures Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm mb-1">AI Confidence Threshold</Label>
                <div className="mt-2">
                  <Slider 
                    value={[confidenceThreshold]}
                    min={50}
                    max={100}
                    step={1}
                    onValueChange={(value) => setConfidenceThreshold(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>50%</span>
                    <span>{confidenceThreshold}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm mb-1">Default Lot Size (Options/Futures)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={defaultLotSize}
                    min={1}
                    max={10}
                    onChange={(e) => setDefaultLotSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-primary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <span className="absolute right-3 top-2 text-muted-foreground">lots</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-primary-dark p-3 rounded-lg border border-warning border-opacity-50">
          <div className="flex items-start">
            <AlertTriangle className="text-warning mr-2 mt-0.5" size={20} />
            <p className="text-sm">
              <span className="font-medium text-warning">Important:</span> Auto-trading uses AI to execute real trades with your capital. Review all settings carefully before enabling.
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="secondary" 
            onClick={handleResetDefaults} 
            className="bg-muted hover:bg-muted mr-3"
          >
            Reset Defaults
          </Button>
          <Button 
            variant="default" 
            onClick={handleSaveSettings}
            className="bg-accent hover:bg-accent-light text-white"
          >
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoTradingSetup;

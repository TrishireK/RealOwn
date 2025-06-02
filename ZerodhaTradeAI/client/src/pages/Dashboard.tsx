import React from "react";
import MarketChart from "@/components/MarketChart";
import AISignals from "@/components/AISignals";
import AutoTradingSetup from "@/components/AutoTradingSetup";
import ZerodhaStatus from "@/components/ZerodhaStatus";
import TelegramNotifications from "@/components/TelegramNotifications";
import QuickTradePanel from "@/components/QuickTradePanel";
import TechnicalPatterns from "@/components/TechnicalPatterns";

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Charts & Analysis */}
      <div className="lg:col-span-2 space-y-6">
        <MarketChart />
        <AISignals />
        <AutoTradingSetup />
      </div>
      
      {/* Right Column - Notifications & Quick Actions */}
      <div className="space-y-6">
        <ZerodhaStatus />
        <TelegramNotifications />
        <QuickTradePanel />
        <TechnicalPatterns />
      </div>
    </div>
  );
};

export default Dashboard;

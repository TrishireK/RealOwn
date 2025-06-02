import React from "react";
import { Link, useLocation } from "wouter";
import { TrendingUp, BarChart2, History, Briefcase, Settings } from "lucide-react";

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    { icon: <TrendingUp size={20} />, label: "Dashboard", path: "/" },
    { icon: <BarChart2 size={20} />, label: "Market Analysis", path: "/market-analysis" },
    { icon: <History size={20} />, label: "Trade History", path: "/trade-history" },
    { icon: <Briefcase size={20} />, label: "Portfolio", path: "/portfolio" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-16 md:w-64 bg-sidebar h-screen overflow-y-auto flex flex-col border-r border-primary-light">
      {/* Logo Section */}
      <div className="p-4 flex items-center justify-center md:justify-start">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <TrendingUp className="text-white text-sm" size={16} />
        </div>
        <h1 className="ml-3 text-xl font-bold text-white hidden md:block">TradeSmart AI</h1>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 mt-6">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex items-center px-4 py-3 ${
              isActive(item.path) 
                ? "text-white bg-primary-light" 
                : "text-muted-foreground hover:text-white hover:bg-primary-light"
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="ml-3 hidden md:block">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* User Profile Section */}
      <div className="p-4 border-t border-primary-light flex items-center">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-sm font-medium text-white">JS</span>
        </div>
        <div className="ml-3 hidden md:block">
          <p className="text-sm font-medium text-white">John Smith</p>
          <p className="text-xs text-muted-foreground">Connected to Zerodha</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

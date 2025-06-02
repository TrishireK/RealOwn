import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import MarketAnalysis from "@/pages/MarketAnalysis";
import TradeHistory from "@/pages/TradeHistory";
import Portfolio from "@/pages/Portfolio";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/hooks/useTheme";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/market-analysis" component={MarketAnalysis} />
        <Route path="/trade-history" component={TradeHistory} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;

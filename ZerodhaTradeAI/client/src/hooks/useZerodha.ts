import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ZerodhaAccount } from "@/lib/zerodha";

export function useMarketStatus() {
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);
  const [nextOpenTime, setNextOpenTime] = useState<Date | null>(null);
  const [nextCloseTime, setNextCloseTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/zerodha/market-status');
        if (res.ok) {
          const data = await res.json();
          setIsMarketOpen(data.isOpen);
          setNextOpenTime(data.nextOpeningTime ? new Date(data.nextOpeningTime) : null);
          setNextCloseTime(data.nextClosingTime ? new Date(data.nextClosingTime) : null);
        }
      } catch (error) {
        console.error("Error fetching market status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketStatus();
    // Poll every minute
    const interval = setInterval(fetchMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    isMarketOpen,
    nextOpenTime,
    nextCloseTime,
    isLoading
  };
}

export function useZerodha() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [account, setAccount] = useState<ZerodhaAccount | null>(null);
  const { toast } = useToast();

  // Check connection status on mount
  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/zerodha/status');
      if (res.ok) {
        const data = await res.json();
        setIsConnected(data.isConnected);
        if (data.isConnected && data.account) {
          setAccount(data.account);
        }
      }
    } catch (error) {
      console.error("Error checking Zerodha connection:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function connect(apiKey: string, apiSecret: string) {
    try {
      setIsLoading(true);
      const res = await apiRequest(
        'POST',
        '/api/zerodha/connect',
        { apiKey, apiSecret }
      );
      
      if (res.ok) {
        const data = await res.json();
        setIsConnected(true);
        setAccount(data.account);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error connecting to Zerodha:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Zerodha. Please check your credentials.",
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
      const res = await apiRequest('POST', '/api/zerodha/disconnect', {});
      if (res.ok) {
        setIsConnected(false);
        setAccount(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error disconnecting from Zerodha:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshConnection() {
    return await checkConnection();
  }

  return {
    isConnected,
    isLoading,
    account,
    connect,
    disconnect,
    refreshConnection
  };
}

export function useMarketData(symbol: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/zerodha/market-data?symbol=${encodeURIComponent(symbol)}`);
        if (res.ok) {
          const data = await res.json();
          setData(data);
        } else {
          setError("Failed to fetch market data");
        }
      } catch (err) {
        setError("An error occurred while fetching market data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  return { data, isLoading, error };
}

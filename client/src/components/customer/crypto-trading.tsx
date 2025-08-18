import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, TrendingUp, TrendingDown, Info } from "lucide-react";
import { useCryptoPrices } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import "@/types/tradingview.d.ts";

interface CryptoTradingProps {
  currency: string;
  onBack: () => void;
}

export function CryptoTrading({ currency, onBack }: CryptoTradingProps) {
  const { data: cryptoPrices } = useCryptoPrices();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTime, setSelectedTime] = useState("60S");
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const [amount, setAmount] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);

  const timeOptions = [
    { label: "60S", value: "60S", rate: "Scale:20.00%" },
    { label: "120S", value: "120S", rate: "Scale:30.00%" },
    { label: "180S", value: "180S", rate: "Scale:50.00%" }
  ];

  const currentPrice = cryptoPrices?.[currency]?.price || "0.00";
  const priceChange = cryptoPrices?.[currency]?.change || "0.00";
  const isPositive = parseFloat(priceChange) >= 0;

  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/betting-orders", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Order Placed",
        description: "Your trading order has been placed successfully.",
      });
      setAmount("");
      setDirection(null);
      setShowOrderForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/betting-orders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    },
  });

  const handleOrderSubmit = () => {
    if (!amount || !direction || !selectedTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const orderAmount = parseFloat(amount);
    const userBalance = parseFloat(user?.availableBalance || "0");

    if (orderAmount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough available balance for this order",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate({
      currency,
      amount: orderAmount,
      direction: direction === "up" ? "Buy Up" : "Buy Down",
      duration: selectedTime,
      entryPrice: parseFloat(currentPrice),
    });
  };

  const handleDirectionSelect = (dir: "up" | "down") => {
    setDirection(dir);
    setShowOrderForm(true);
  };

  const expectedEarnings = amount ? 
    (parseFloat(amount) * (selectedTime === "60S" ? 0.2 : selectedTime === "120S" ? 0.3 : 0.5)).toFixed(2) : "0";

  // TradingView Widget Effect
  useEffect(() => {
    // Load TradingView script if not already loaded
    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        createTradingViewWidget();
      };
      document.head.appendChild(script);
    } else {
      createTradingViewWidget();
    }

    function createTradingViewWidget() {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${currency.replace('/USDT', 'USDT')}`,
          interval: "1",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#1a1a1a",
          enable_publishing: false,
          hide_side_toolbar: false,
          container_id: "tradingview_chart"
        });
      }
    }
  }, [currency]);

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white p-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">{currency}</h1>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">24H High: 115305.3000</span>
              <span className="text-gray-400">24H Volume: 152.43M</span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-white border-gray-600">
          Spot Orders
        </Button>
      </div>

      {/* Price Display */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <div>
            <div className="text-2xl font-bold">{currentPrice}</div>
            <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{priceChange}%
            </div>
          </div>
          <div className="text-sm text-gray-400">
            <div>24H Low: 115305.9629</div>
            <div>24H Turnover: 1.31K</div>
          </div>
        </div>
      </div>

      {/* TradingView Chart */}
      <div className="flex-1 relative">
        <div id="tradingview_chart" className="w-full h-full"></div>
        
        {/* Chart Controls */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <Button variant="ghost" size="sm" className="text-xs">1M</Button>
          <Button variant="ghost" size="sm" className="text-xs bg-blue-600">5M</Button>
          <Button variant="ghost" size="sm" className="text-xs">30M</Button>
          <Button variant="ghost" size="sm" className="text-xs">1H</Button>
          <Button variant="ghost" size="sm" className="text-xs">4H</Button>
          <Button variant="ghost" size="sm" className="text-xs">1D</Button>
        </div>
      </div>

      {!showOrderForm ? (
        /* Trading Section */
        <div className="p-4 space-y-4 border-t border-gray-800">
          {/* Trading Time Selection */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm text-gray-400">Trading Time</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {timeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedTime === option.value ? "default" : "outline"}
                  className={`flex flex-col p-4 h-auto ${
                    selectedTime === option.value 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedTime(option.value)}
                >
                  <span className="text-sm font-medium">Time</span>
                  <span className="text-lg font-bold">{option.label}</span>
                  <span className="text-xs text-green-400">{option.rate}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Balance Display */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Available Balance:</span>
            <span className="text-white font-medium">{user?.availableBalance || "0.00"}</span>
          </div>

          {/* Buy Up / Buy Down Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-bold"
              onClick={() => handleDirectionSelect("up")}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Buy Up
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-bold"
              onClick={() => handleDirectionSelect("down")}
            >
              <TrendingDown className="w-5 h-5 mr-2" />
              Buy Down
            </Button>
          </div>
        </div>
      ) : (
        /* Order Form */
        <div className="p-4 space-y-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">
              Product Name: {currency} Direction: {direction === "up" ? "Buy Up" : "Buy Down"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOrderForm(false)}
              className="text-white"
            >
              ×
            </Button>
          </div>
          
          <div className="text-sm text-gray-400">
            Current price: {currentPrice}
          </div>

          {/* Time Selection in Order Form */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm text-gray-400">Trading Time</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {timeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedTime === option.value ? "default" : "outline"}
                  className={`flex flex-col p-4 h-auto ${
                    selectedTime === option.value 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedTime(option.value)}
                >
                  <span className="text-sm font-medium">Time</span>
                  <span className="text-lg font-bold">{option.label}</span>
                  <span className="text-xs text-green-400">{option.rate}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Balance and Earnings */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Available Balance:</span>
            <span className="text-white font-medium">{user?.availableBalance || "0.00"}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Expected Earnings:</span>
            <span className="text-blue-400 font-medium">{expectedEarnings}</span>
          </div>

          {/* Amount Input */}
          <div>
            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white text-center text-lg py-6"
            />
          </div>

          {/* Order Confirmation Button */}
          <Button
            onClick={handleOrderSubmit}
            disabled={createOrderMutation.isPending}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 text-lg"
          >
            {createOrderMutation.isPending ? "Placing Order..." : "Order Confirmation"}
          </Button>
        </div>
      )}
    </div>
  );
}
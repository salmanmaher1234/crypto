import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCreateBettingOrder, useCryptoPrices } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Clock, RefreshCw } from "lucide-react";

interface CryptoTradingProps {
  currency: string;
  onBack: () => void;
  onOrderPlaced?: () => void;
}



export function CryptoTrading({ currency, onBack, onOrderPlaced }: CryptoTradingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const createBettingOrder = useCreateBettingOrder();
  const { data: cryptoPrices } = useCryptoPrices();
  
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderType, setOrderType] = useState<"up" | "down">("up");
  const [selectedPeriod, setSelectedPeriod] = useState("30s");
  const [orderAmount, setOrderAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  const [selectedChartPeriod, setSelectedChartPeriod] = useState("1m");
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick");
  const [chartKey, setChartKey] = useState(0);

  // Real-time chart update effect
  useEffect(() => {
    const interval = setInterval(() => {
      setChartKey(prev => prev + 1); // Force chart re-render for real-time effect
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [selectedChartPeriod, chartType]);

  // Update chart immediately when filters change
  useEffect(() => {
    setChartKey(prev => prev + 1);
  }, [selectedChartPeriod, chartType]);

  // Get real-time crypto data with fallback to static data
  const getCryptoPrice = (cryptoKey: string) => {
    if (!cryptoPrices) return null;
    
    const symbolMap: { [key: string]: string } = {
      "BTC": "BTC/USDT",
      "ETH": "ETH/USDT", 
      "DOGE": "DOGE/USDT",
      "LTC": "LTC/USDT",
      "CHZ": "CHZ/USDT",
      "BCH": "BCH/USDT"
    };
    
    const apiSymbol = symbolMap[cryptoKey];
    return apiSymbol && cryptoPrices[apiSymbol] ? cryptoPrices[apiSymbol] : null;
  };

  const cryptoData: { [key: string]: any } = {
    "BTC": {
      name: "Bitcoin",
      symbol: "BTC/USDT",
      price: getCryptoPrice("BTC")?.price || "107314.24",
      change: getCryptoPrice("BTC")?.change || "-0.41%",
      isPositive: getCryptoPrice("BTC")?.changeType === "positive" || false,
      highestPrice: "107900",
      lowestPrice: "106689.81",
      volume24h: "773548A2C",
      volumeBTC: "7335",
      transactions: "1158259"
    },
    "ETH": {
      name: "Ethereum", 
      symbol: "ETH/USDT",
      price: getCryptoPrice("ETH")?.price || "2449.91",
      change: getCryptoPrice("ETH")?.change || "-1.44%",
      isPositive: getCryptoPrice("ETH")?.changeType === "positive" || false,
      highestPrice: "2580",
      lowestPrice: "2389.33",
      volume24h: "445782B1D",
      volumeBTC: "4521",
      transactions: "892456"
    },
    "DOGE": {
      name: "Dogecoin",
      symbol: "DOGE/USDT",
      price: getCryptoPrice("DOGE")?.price || "0.16147", 
      change: getCryptoPrice("DOGE")?.change || "-1.87%",
      isPositive: getCryptoPrice("DOGE")?.changeType === "positive" || false,
      highestPrice: "0.19200",
      lowestPrice: "0.15100",
      volume24h: "156892C3E",
      volumeBTC: "1205",
      transactions: "445123"
    },
    "LTC": {
      name: "Litecoin",
      symbol: "LTC/USDT",
      price: getCryptoPrice("LTC")?.price || "85.13",
      change: getCryptoPrice("LTC")?.change || "-0.28%",
      isPositive: getCryptoPrice("LTC")?.changeType === "positive" || false,
      highestPrice: "89.50",
      lowestPrice: "84.20",
      volume24h: "234567D4F",
      volumeBTC: "2890",
      transactions: "567892"
    },
    "CHZ": {
      name: "Chiliz",
      symbol: "CHZ/USDT",
      price: getCryptoPrice("CHZ")?.price || "0.03457",
      change: getCryptoPrice("CHZ")?.change || "-2.59%",
      isPositive: getCryptoPrice("CHZ")?.changeType === "positive" || false,
      highestPrice: "0.03650",
      lowestPrice: "0.03350",
      volume24h: "123456E5G",
      volumeBTC: "456",
      transactions: "234567"
    },
    "BCH": {
      name: "Bitcoin Cash",
      symbol: "BCH/USDT",
      price: getCryptoPrice("BCH")?.price || "502.8",
      change: getCryptoPrice("BCH")?.change || "0.50%",
      isPositive: getCryptoPrice("BCH")?.changeType === "positive" || true,
      highestPrice: "515.20",
      lowestPrice: "498.30",
      volume24h: "345678F6H",
      volumeBTC: "3456",
      transactions: "678901"
    },

    "TRX": {
      name: "TRON",
      symbol: "TRX/USDT",
      price: "0.2712",
      change: "0.15%",
      isPositive: true,
      highestPrice: "0.2850",
      lowestPrice: "0.2650",
      volume24h: "890123K1M",
      volumeBTC: "901",
      transactions: "789012"
    },
    "ETC": {
      name: "Ethereum Classic",
      symbol: "ETC/USDT",
      price: "16.19",
      change: "-2.00%",
      isPositive: false,
      highestPrice: "17.20",
      lowestPrice: "15.80",
      volume24h: "901234L2N",
      volumeBTC: "1012",
      transactions: "890123"
    },
    "BTS": {
      name: "BitShares",
      symbol: "BTS/USDT",
      price: "502.8",
      change: "0.50%",
      isPositive: true,
      highestPrice: "515.00",
      lowestPrice: "498.00",
      volume24h: "123450M3O",
      volumeBTC: "1123",
      transactions: "901234"
    }
  };

  const currentCrypto = cryptoData[currency] || cryptoData["BTC"];

  const periods = [
    { label: "30s", value: "30s", payout: "20%" },
    { label: "60s", value: "60s", payout: "30%" },
    { label: "120s", value: "120s", payout: "40%" },
    { label: "180s", value: "180s", payout: "50%" },
    { label: "240s", value: "240s", payout: "60%" }
  ];

  const handleBuyOrder = (type: "up" | "down") => {
    setOrderType(type);
    setShowOrderDialog(true);
  };

  const handleSubmitOrder = () => {
    if (!user || !orderAmount || parseFloat(orderAmount) <= 0) {
      toast({
        title: "Invalid order",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(orderAmount);

    // Minimum order validation
    if (amount < 1000) {
      setValidationError("Amount cannot be less than 1000");
      return;
    }
    
    // Clear validation error if amount is valid
    setValidationError("");

    const availableBalance = parseFloat(user.availableBalance || user.balance || "0");

    if (amount > availableBalance) {
      toast({
        title: "Insufficient balance",
        description: "Amount exceeds available balance",
        variant: "destructive",
      });
      return;
    }

    createBettingOrder.mutate({
      asset: currency,
      amount: orderAmount,
      direction: orderType === "up" ? "Buy Up" : "Buy Down",
      duration: parseInt(selectedPeriod.replace('s', '')),
      entryPrice: currentCrypto.price,
    }, {
      onSuccess: async (data) => {
        // Immediate cache clearing and refresh
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        queryClient.invalidateQueries({ queryKey: ["/api/betting-orders"] });
        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
        
        // Fetch fresh user data immediately
        try {
          const response = await fetch("/api/auth/me", {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-Session-Id": localStorage.getItem('sessionId') || ""
            }
          });
          if (response.ok) {
            const freshUserData = await response.json();
            queryClient.setQueryData(["/api/auth/me"], freshUserData);
            

          }
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        }
        
        toast({
          title: "Order submitted",
          description: `${orderType.toUpperCase()} order for ${currency} submitted successfully`,
        });
        setShowOrderDialog(false);
        setOrderAmount("");
        
        // Redirect to Orders tab if callback is provided
        if (onOrderPlaced) {
          onOrderPlaced();
        }
      },
      onError: () => {
        toast({
          title: "Order failed",
          description: "Failed to submit order. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="space-y-6 pb-16 sm:pb-20 md:pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold">{currentCrypto.name}</h1>
        <div></div>
      </div>

      {/* Price Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Latest Price</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {currentCrypto.price}
              </div>
              <div className="text-sm">
                <span className="text-gray-600">24H Rise Fall</span>
                <div className={`font-medium ${currentCrypto.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {currentCrypto.change}
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">24H Highest Price</span>
                <span className="font-medium">{currentCrypto.highestPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">24H Lowest Price</span>
                <span className="font-medium">{currentCrypto.lowestPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">24H Volume(USDT)</span>
                <span className="font-medium">{currentCrypto.volume24h}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">24H Volume({currency.split('/')[0]})</span>
                <span className="font-medium">{currentCrypto.volumeBTC}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">24H Transactions</span>
                <span className="font-medium">{currentCrypto.transactions}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Chart View */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-1">
              {["1m", "30m", "1h", "1D"].map((period) => (
                <Button
                  key={period}
                  variant={selectedChartPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedChartPeriod(period)}
                  className="text-xs px-2 py-1 h-7"
                >
                  {period}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={chartType === "candlestick" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("candlestick")}
                className="p-1 h-7 w-7"
              >
                <BarChart3 className="w-3 h-3" />
              </Button>
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("line")}
                className="p-1 h-7 w-7"
              >
                📈
              </Button>
              <Button variant="outline" size="sm" className="p-1 h-7 w-7">
                <TrendingUp className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm" className="p-1 h-7 w-7">
                ⚙️
              </Button>
            </div>
          </div>
          
          {/* Interactive Chart */}
          <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg relative overflow-hidden border">
            {/* Chart Header */}
            <div className="absolute top-3 left-3 z-10">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                BINANCE:{currency}
              </div>
              <div className="text-xs text-gray-500">
                {selectedChartPeriod} • {chartType === "candlestick" ? "Candlestick" : "Line"} Chart
              </div>
            </div>
            
            {/* Chart Area */}
            <div className="h-full w-full relative bg-gray-900">
              {chartType === "candlestick" ? (
                <div className="h-full w-full relative">
                  {/* Price Grid and Labels */}
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 800 400">
                      {/* Background Grid */}
                      <defs>
                        <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Horizontal Price Lines */}
                      {[...Array(8)].map((_, i) => {
                        const y = 50 + (i * 40);
                        const price = (parseFloat(currentCrypto.price) * (1.05 - i * 0.015)).toFixed(2);
                        return (
                          <g key={i}>
                            <line x1="0" y1={y} x2="750" y2={y} stroke="#374151" strokeWidth="0.5" opacity="0.5"/>
                            <text x="760" y={y + 4} fill="#9CA3AF" fontSize="10" textAnchor="start">
                              {price}
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* Candlesticks */}
                      {Array.from({ length: 50 }, (_, i) => {
                        const x = 20 + (i * 14);
                        const basePrice = parseFloat(currentCrypto.price);
                        const volatility = 0.02 + (chartKey % 5) * 0.005;
                        
                        // Generate OHLC data
                        const open = basePrice * (0.998 + Math.sin(i * 0.3 + chartKey) * volatility);
                        const close = open * (0.999 + Math.sin(i * 0.5 + chartKey * 1.1) * volatility);
                        const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
                        const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
                        
                        const isGreen = close > open;
                        const color = isGreen ? "#10B981" : "#EF4444";
                        const fillColor = isGreen ? "#10B981" : "#EF4444";
                        
                        // Scale to chart area
                        const priceToY = (price) => 350 - ((price - basePrice * 0.97) / (basePrice * 0.06)) * 300;
                        
                        const highY = priceToY(high);
                        const lowY = priceToY(low);
                        const openY = priceToY(open);
                        const closeY = priceToY(close);
                        
                        return (
                          <g key={i}>
                            {/* High-Low Line */}
                            <line 
                              x1={x + 4} 
                              y1={highY} 
                              x2={x + 4} 
                              y2={lowY} 
                              stroke={color} 
                              strokeWidth="1"
                            />
                            {/* Candle Body */}
                            <rect
                              x={x}
                              y={Math.min(openY, closeY)}
                              width="8"
                              height={Math.abs(closeY - openY) || 1}
                              fill={fillColor}
                              stroke={color}
                              strokeWidth="1"
                            />
                          </g>
                        );
                      })}
                      
                      {/* Current Price Line */}
                      <line 
                        x1="0" 
                        y1="200" 
                        x2="750" 
                        y2="200" 
                        stroke="#F59E0B" 
                        strokeWidth="1" 
                        strokeDasharray="5,5"
                      />
                      <text x="760" y="204" fill="#F59E0B" fontSize="11" fontWeight="bold">
                        {currentCrypto.price}
                      </text>
                    </svg>
                  </div>
                  
                  {/* Volume Chart at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-800 border-t border-gray-700">
                    <div className="flex items-end justify-around h-full px-4 pb-2">
                      {Array.from({ length: 50 }, (_, i) => {
                        const height = Math.random() * 40 + 5 + (chartKey % 3) * 2;
                        const isGreen = (Math.random() + chartKey * 0.1) > 0.5;
                        return (
                          <div 
                            key={i}
                            className={`w-2 ${isGreen ? 'bg-green-500' : 'bg-red-500'} opacity-60`}
                            style={{ height: `${height}px` }}
                          />
                        );
                      })}
                    </div>
                    <div className="absolute top-1 left-4 text-xs text-gray-400">Volume</div>
                  </div>
                  
                  {/* Chart Crosshair */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-24 right-4 bg-gray-800 border border-gray-600 px-2 py-1 rounded text-xs text-gray-300">
                      <div>O: {parseFloat(currentCrypto.price).toFixed(2)}</div>
                      <div>H: {(parseFloat(currentCrypto.price) * 1.005).toFixed(2)}</div>
                      <div>L: {(parseFloat(currentCrypto.price) * 0.995).toFixed(2)}</div>
                      <div>C: {parseFloat(currentCrypto.price).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full relative bg-gray-900">
                  {/* Price Grid and Labels for Line Chart */}
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 800 400">
                      {/* Background Grid */}
                      <defs>
                        <pattern id="gridLine" width="40" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                        </pattern>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.3 }} />
                          <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0 }} />
                        </linearGradient>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#gridLine)" />
                      
                      {/* Horizontal Price Lines */}
                      {[...Array(8)].map((_, i) => {
                        const y = 50 + (i * 40);
                        const price = (parseFloat(currentCrypto.price) * (1.05 - i * 0.015)).toFixed(2);
                        return (
                          <g key={i}>
                            <line x1="0" y1={y} x2="750" y2={y} stroke="#374151" strokeWidth="0.5" opacity="0.5"/>
                            <text x="760" y={y + 4} fill="#9CA3AF" fontSize="10" textAnchor="start">
                              {price}
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* Price Line */}
                      <path
                        d={`M 20 ${150 + (chartKey % 20)} 
                           L 70 ${140 + (chartKey % 15)} 
                           L 120 ${130 + (chartKey % 10)} 
                           L 170 ${120 + (chartKey % 25)} 
                           L 220 ${135 + (chartKey % 30)} 
                           L 270 ${125 + (chartKey % 20)}
                           L 320 ${115 + (chartKey % 35)}
                           L 370 ${130 + (chartKey % 18)}
                           L 420 ${120 + (chartKey % 22)}
                           L 470 ${110 + (chartKey % 28)}
                           L 520 ${125 + (chartKey % 32)}
                           L 570 ${115 + (chartKey % 26)}
                           L 620 ${105 + (chartKey % 24)}
                           L 670 ${120 + (chartKey % 30)}
                           L 720 ${110 + (chartKey % 20)}`}
                        stroke="#10B981"
                        strokeWidth="2"
                        fill="none"
                      />
                      
                      {/* Fill Area */}
                      <path
                        d={`M 20 ${150 + (chartKey % 20)} 
                           L 70 ${140 + (chartKey % 15)} 
                           L 120 ${130 + (chartKey % 10)} 
                           L 170 ${120 + (chartKey % 25)} 
                           L 220 ${135 + (chartKey % 30)} 
                           L 270 ${125 + (chartKey % 20)}
                           L 320 ${115 + (chartKey % 35)}
                           L 370 ${130 + (chartKey % 18)}
                           L 420 ${120 + (chartKey % 22)}
                           L 470 ${110 + (chartKey % 28)}
                           L 520 ${125 + (chartKey % 32)}
                           L 570 ${115 + (chartKey % 26)}
                           L 620 ${105 + (chartKey % 24)}
                           L 670 ${120 + (chartKey % 30)}
                           L 720 ${110 + (chartKey % 20)}
                           L 720 350 L 20 350 Z`}
                        fill="url(#lineGradient)"
                      />
                      
                      {/* Current Price Line */}
                      <line 
                        x1="0" 
                        y1="200" 
                        x2="750" 
                        y2="200" 
                        stroke="#F59E0B" 
                        strokeWidth="1" 
                        strokeDasharray="5,5"
                      />
                      <text x="760" y="204" fill="#F59E0B" fontSize="11" fontWeight="bold">
                        {currentCrypto.price}
                      </text>
                    </svg>
                  </div>
                  
                  {/* Volume Chart at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-800 border-t border-gray-700">
                    <div className="flex items-end justify-around h-full px-4 pb-2">
                      {Array.from({ length: 50 }, (_, i) => {
                        const height = Math.random() * 40 + 5 + (chartKey % 3) * 2;
                        const isGreen = (Math.random() + chartKey * 0.1) > 0.5;
                        return (
                          <div 
                            key={i}
                            className={`w-2 ${isGreen ? 'bg-green-500' : 'bg-red-500'} opacity-60`}
                            style={{ height: `${height}px` }}
                          />
                        );
                      })}
                    </div>
                    <div className="absolute top-1 left-4 text-xs text-gray-400">Volume</div>
                  </div>
                  
                  {/* Price Info */}
                  <div className="absolute top-4 right-4 bg-gray-800 border border-gray-600 px-3 py-2 rounded text-sm text-gray-300">
                    <div className="text-green-400 font-medium">
                      {currentCrypto.price}
                    </div>
                    <div className="text-xs text-gray-400">
                      {currentCrypto.change}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          className="h-12 bg-green-500 hover:bg-green-600 text-white text-base font-medium"
          onClick={() => handleBuyOrder("up")}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Buy Up
        </Button>
        <Button 
          className="h-12 bg-red-500 hover:bg-red-600 text-white text-base font-medium"
          onClick={() => handleBuyOrder("down")}
        >
          <TrendingDown className="w-4 h-4 mr-2" />
          Buy Down
        </Button>
      </div>

      {/* Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm">
              <span className="text-gray-600">Real available balance: </span>
              <span className="font-medium">
                {parseFloat(user?.availableBalance || user?.balance || "0").toFixed(0)}
              </span>
            </div>

            {/* Period Selection */}
            <div>
              <h4 className="text-sm font-medium mb-3">Select order period</h4>
              <div className="grid grid-cols-5 gap-2">
                {periods.map((period) => {
                  const isSelected = selectedPeriod === period.value;
                  const baseColor = "green";
                  const colorClasses = isSelected
                    ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                    : "border-green-300 text-green-600 hover:border-green-400 hover:bg-green-50";
                  
                  return (
                    <Button
                      key={period.value}
                      variant="outline"
                      size="sm"
                      className={`h-12 flex-col text-xs border-2 ${colorClasses}`}
                      onClick={() => setSelectedPeriod(period.value)}
                    >
                      <div>{period.label}</div>
                      <div className={isSelected ? "text-white" : "text-green-500"}>
                        {period.payout}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <h4 className="text-sm font-medium mb-2">Enter order amount</h4>
              <Input
                type="number"
                value={orderAmount}
                onChange={(e) => {
                  setOrderAmount(e.target.value);
                  setValidationError(""); // Clear error when user types
                }}
                placeholder="Enter amount"
                className="text-center"
              />
              {validationError && (
                <p className="text-red-500 text-sm mt-1">{validationError}</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-orange-100 p-3 rounded-lg">
              <div className="grid grid-cols-3 gap-2 text-xs font-medium text-center">
                <div>
                  <div className="text-gray-600">Currency</div>
                  <div>{currency.split('/')[0]}</div>
                </div>
                <div>
                  <div className="text-gray-600">Price</div>
                  <div>{currentCrypto.price}</div>
                </div>
                <div>
                  <div className="text-gray-600">Amount</div>
                  <div>{orderAmount || "0"}</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full h-12 text-white font-medium bg-green-500 hover:bg-green-600"
              onClick={handleSubmitOrder}
              disabled={createBettingOrder.isPending || !orderAmount}
            >
              {createBettingOrder.isPending 
                ? "Submitting..." 
                : "Submit Order"
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
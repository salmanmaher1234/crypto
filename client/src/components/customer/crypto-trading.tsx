import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCreateBettingOrder } from "@/lib/api";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Clock } from "lucide-react";

interface CryptoTradingProps {
  currency: string;
  onBack: () => void;
}

export function CryptoTrading({ currency, onBack }: CryptoTradingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const createBettingOrder = useCreateBettingOrder();
  
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderType, setOrderType] = useState<"up" | "down">("up");
  const [selectedPeriod, setSelectedPeriod] = useState("60s");
  const [orderAmount, setOrderAmount] = useState("");
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

  const cryptoData: { [key: string]: any } = {
    "BTC": {
      name: "Bitcoin",
      symbol: "BTC/USDT",
      price: "107314.24",
      change: "-0.41%",
      isPositive: false,
      highestPrice: "107900",
      lowestPrice: "106689.81",
      volume24h: "773548A2C",
      volumeBTC: "7335",
      transactions: "1158259"
    },
    "ETH": {
      name: "Ethereum", 
      symbol: "ETH/USDT",
      price: "2449.91",
      change: "-1.44%",
      isPositive: false,
      highestPrice: "2580",
      lowestPrice: "2389.33",
      volume24h: "445782B1D",
      volumeBTC: "4521",
      transactions: "892456"
    },
    "DOGE": {
      name: "Dogecoin",
      symbol: "DOGE/USDT",
      price: "0.16147", 
      change: "-1.87%",
      isPositive: false,
      highestPrice: "0.19200",
      lowestPrice: "0.15100",
      volume24h: "156892C3E",
      volumeBTC: "1205",
      transactions: "445123"
    },
    "LTC": {
      name: "Litecoin",
      symbol: "LTC/USDT",
      price: "85.13",
      change: "-0.28%",
      isPositive: false,
      highestPrice: "89.50",
      lowestPrice: "84.20",
      volume24h: "234567D4F",
      volumeBTC: "2890",
      transactions: "567892"
    },
    "CHZ": {
      name: "Chiliz",
      symbol: "CHZ/USDT",
      price: "0.03457",
      change: "-2.59%",
      isPositive: false,
      highestPrice: "0.03650",
      lowestPrice: "0.03350",
      volume24h: "123456E5G",
      volumeBTC: "456",
      transactions: "234567"
    },
    "BCH": {
      name: "Bitcoin Cash",
      symbol: "BCH/USDT",
      price: "502.8",
      change: "0.50%",
      isPositive: true,
      highestPrice: "515.20",
      lowestPrice: "498.30",
      volume24h: "345678F6H",
      volumeBTC: "3456",
      transactions: "678901"
    },
    "PSG": {
      name: "Paris Saint-Germain",
      symbol: "PSG/USDT",
      price: "1.417",
      change: "-2.01%",
      isPositive: false,
      highestPrice: "1.520",
      lowestPrice: "1.380",
      volume24h: "456789G7I",
      volumeBTC: "567",
      transactions: "345678"
    },
    "JUV": {
      name: "Juventus",
      symbol: "JUV/USDT",
      price: "0.901",
      change: "-1.42%",
      isPositive: false,
      highestPrice: "0.950",
      lowestPrice: "0.880",
      volume24h: "567890H8J",
      volumeBTC: "678",
      transactions: "456789"
    },
    "ATM": {
      name: "Atletico Madrid",
      symbol: "ATM/USDT",
      price: "0.999",
      change: "-1.87%",
      isPositive: false,
      highestPrice: "1.050",
      lowestPrice: "0.950",
      volume24h: "678901I9K",
      volumeBTC: "789",
      transactions: "567890"
    },
    "EOS": {
      name: "EOS",
      symbol: "EOS/USDT",
      price: "0",
      change: "0.00%",
      isPositive: true,
      highestPrice: "0.80",
      lowestPrice: "0.70",
      volume24h: "789012J0L",
      volumeBTC: "890",
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

    const availableBalance = parseFloat(user.availableBalance || user.balance || "0");
    const amount = parseFloat(orderAmount);

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
      duration: selectedPeriod.replace('s', ''),
      entryPrice: currentCrypto.price,
    }, {
      onSuccess: () => {
        toast({
          title: "Order submitted",
          description: `${orderType.toUpperCase()} order for ${currency} submitted successfully`,
        });
        setShowOrderDialog(false);
        setOrderAmount("");
        onBack(); // Return to home after successful order
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
    <div className="space-y-6">
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
            <div className="h-full w-full relative">
              {chartType === "candlestick" ? (
                <div className="h-full flex items-end justify-around px-4 pb-4 pt-12">
                  {/* Candlestick Simulation */}
                  {Array.from({ length: 20 }, (_, i) => {
                    const height = Math.random() * 60 + 20 + (chartKey % 10);
                    const isGreen = (Math.random() + chartKey * 0.1) > 0.5;
                    return (
                      <div key={i} className="flex flex-col items-center space-y-1">
                        <div 
                          className={`w-1 ${isGreen ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ height: `${height}px` }}
                        />
                        <div 
                          className={`w-3 border-2 ${isGreen ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'}`}
                          style={{ height: `${Math.random() * 20 + 10}px` }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full relative">
                  {/* Line Chart Simulation */}
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 ${150 + (chartKey % 20)} Q 50 ${120 + (chartKey % 15)} 100 ${100 + (chartKey % 10)} T 200 ${80 + (chartKey % 25)} T 300 ${90 + (chartKey % 30)} T 400 ${70 + (chartKey % 20)}`}
                      stroke="#10b981"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d={`M 0 ${150 + (chartKey % 20)} Q 50 ${120 + (chartKey % 15)} 100 ${100 + (chartKey % 10)} T 200 ${80 + (chartKey % 25)} T 300 ${90 + (chartKey % 30)} T 400 ${70 + (chartKey % 20)} L 400 200 L 0 200 Z`}
                      fill="url(#priceGradient)"
                    />
                  </svg>
                </div>
              )}
              
              {/* Price Overlay */}
              <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-900 rounded px-2 py-1 text-sm border shadow-sm">
                <span className="text-green-600 font-medium">
                  {currentCrypto.price}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  {currentCrypto.change}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          className="h-16 bg-green-500 hover:bg-green-600 text-white text-lg font-medium"
          onClick={() => handleBuyOrder("up")}
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Buy Up
        </Button>
        <Button 
          className="h-16 bg-red-500 hover:bg-red-600 text-white text-lg font-medium"
          onClick={() => handleBuyOrder("down")}
        >
          <TrendingDown className="w-5 h-5 mr-2" />
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
                {periods.map((period) => (
                  <Button
                    key={period.value}
                    variant={selectedPeriod === period.value ? "default" : "outline"}
                    size="sm"
                    className={`h-12 flex-col text-xs ${
                      selectedPeriod === period.value 
                        ? period.value === "60s" 
                          ? "bg-green-500 hover:bg-green-600" 
                          : "bg-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedPeriod(period.value)}
                  >
                    <div>{period.label}</div>
                    <div className="text-red-500">
                      {period.payout}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <h4 className="text-sm font-medium mb-2">Enter order amount</h4>
              <Input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-center"
              />
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
              className={`w-full h-12 text-white font-medium ${
                orderType === "up" 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={handleSubmitOrder}
              disabled={createBettingOrder.isPending || !orderAmount}
            >
              {createBettingOrder.isPending 
                ? "Submitting..." 
                : `Submit Order (${orderType.toUpperCase()})`
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
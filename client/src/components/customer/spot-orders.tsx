import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CryptoPair {
  symbol: string;
  price: string;
  change24h: string;
  volume24h: string;
}

interface OrderBookEntry {
  price: string;
  quantity: string;
  type: 'buy' | 'sell';
}

interface TradeHistoryEntry {
  time: string;
  direction: 'Buy' | 'Sell';
  price: string;
  quantity: string;
}

export function SpotOrders() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1H");
  const [orderAmount, setOrderAmount] = useState("");
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Crypto pairs data
  const cryptoPairs: CryptoPair[] = [
    { symbol: "BTC/USDT", price: "115239.9128", change24h: "2.54", volume24h: "143.25M" },
    { symbol: "ETH/USDT", price: "4247.2503", change24h: "-1.23", volume24h: "89.45M" },
    { symbol: "DOGE/USDT", price: "0.2228", change24h: "5.67", volume24h: "25.12M" },
    { symbol: "CHZ/USDT", price: "0.0397", change24h: "-2.34", volume24h: "12.45M" },
    { symbol: "PSG/USDT", price: "1.6339", change24h: "3.45", volume24h: "8.23M" },
    { symbol: "ATM/USDT", price: "1.4274", change24h: "-0.89", volume24h: "6.78M" },
    { symbol: "JUV/USDT", price: "1.3612", change24h: "1.23", volume24h: "5.67M" },
    { symbol: "K/USDT", price: "14.7080", change24h: "-3.45", volume24h: "15.23M" },
    { symbol: "LTC/USDT", price: "118.6532", change24h: "2.67", volume24h: "45.67M" },
    { symbol: "EOS/USDT", price: "0.7548", change24h: "-1.89", volume24h: "18.45M" },
    { symbol: "BTS/USDT", price: "10.3101", change24h: "4.23", volume24h: "7.89M" },
    { symbol: "LINK/USDT", price: "24.5509", change24h: "-2.45", volume24h: "32.45M" }
  ];

  // Order book data
  const orderBook: OrderBookEntry[] = [
    { price: "115135.50", quantity: "0.0001", type: "buy" },
    { price: "115134.00", quantity: "0.0001", type: "buy" },
    { price: "115132.50", quantity: "0.0001", type: "buy" },
    { price: "115131.00", quantity: "0.0001", type: "buy" },
    { price: "115130.00", quantity: "0.0000", type: "buy" },
    { price: "115127.50", quantity: "0.0001", type: "buy" },
    { price: "115126.00", quantity: "0.0000", type: "buy" },
    { price: "115142.00", quantity: "0.0001", type: "sell" },
    { price: "115143.50", quantity: "0.0001", type: "sell" },
    { price: "115145.00", quantity: "0.0001", type: "sell" },
  ];

  // Trade history data
  const tradeHistory: TradeHistoryEntry[] = [
    { time: "11:56:43", direction: "Buy", price: "115234.1900", quantity: "0.9789" },
    { time: "11:56:02", direction: "Buy", price: "115235.00", quantity: "0.0001" },
    { time: "11:56:41", direction: "Buy", price: "115234.1900", quantity: "0.0025" },
    { time: "11:51:08", direction: "Buy", price: "115235.8600", quantity: "0.0005" },
    { time: "11:56:36", direction: "Sell", price: "115235.8200", quantity: "0.0047" },
    { time: "11:56:45", direction: "Buy", price: "115236.9500", quantity: "0.0052" },
    { time: "11:51:10", direction: "Sell", price: "115236.9000", quantity: "0.0005" },
    { time: "11:51:08", direction: "Buy", price: "115233.8600", quantity: "0.0003" },
    { time: "11:56:43", direction: "Buy", price: "115234.1900", quantity: "0.0012" },
    { time: "11:56:27", direction: "Buy", price: "115230.50", quantity: "0.0001" }
  ];

  const timeframes = ["1M", "5M", "30M", "1H", "4H", "1D"];

  const currentPrice = cryptoPairs.find(p => p.symbol === selectedPair)?.price || "0";
  const currentChange = cryptoPairs.find(p => p.symbol === selectedPair)?.change24h || "0";

  // Create betting order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData: {
      currency: string;
      direction: string;
      amount: number;
      duration: number;
    }) => apiRequest("/api/betting-orders", {
      method: "POST",
      body: orderData
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/betting-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setOrderAmount("");
      setShowBuyForm(false);
      setShowSellForm(false);
    }
  });

  // Enhanced Canvas chart drawing with better grid and professional styling
  useEffect(() => {
    if (!chartRef.current) return;

    const canvas = chartRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size for high DPI
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    // Clear canvas with dark background
    ctx.fillStyle = "#0a0e27";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw enhanced grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 0.5;
    
    // Major vertical grid lines
    const majorVerticalLines = 8;
    for (let i = 0; i <= majorVerticalLines; i++) {
      const x = (rect.width / majorVerticalLines) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height * 0.8); // Don't draw through volume area
      ctx.stroke();
    }

    // Major horizontal grid lines
    const majorHorizontalLines = 8;
    for (let i = 0; i <= majorHorizontalLines; i++) {
      const y = (rect.height * 0.8 / majorHorizontalLines) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Minor grid lines for better precision
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 0.3;
    
    // Minor vertical lines
    for (let i = 0; i <= majorVerticalLines * 2; i++) {
      const x = (rect.width / (majorVerticalLines * 2)) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height * 0.8);
      ctx.stroke();
    }

    // Minor horizontal lines
    for (let i = 0; i <= majorHorizontalLines * 2; i++) {
      const y = (rect.height * 0.8 / (majorHorizontalLines * 2)) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Generate realistic candlestick data
    const candleCount = 80;
    const candleWidth = rect.width / candleCount;
    const basePrice = parseFloat(currentPrice);
    const chartHeight = rect.height * 0.8;
    const priceRange = 4000; // Price range for the chart
    
    let lastClose = basePrice;
    
    for (let i = 0; i < candleCount; i++) {
      const x = i * candleWidth;
      
      // Create more realistic price movement
      const trend = Math.sin(i * 0.1) * 200; // Overall trend
      const volatility = (Math.random() - 0.5) * 400; // Random volatility
      const open = lastClose + (Math.random() - 0.5) * 50;
      const close = open + trend + volatility;
      const high = Math.max(open, close) + Math.random() * 200;
      const low = Math.min(open, close) - Math.random() * 200;
      
      lastClose = close;
      
      const isGreen = close > open;
      
      // Convert prices to Y coordinates
      const highY = chartHeight - ((high - (basePrice - priceRange/2)) / priceRange) * chartHeight;
      const lowY = chartHeight - ((low - (basePrice - priceRange/2)) / priceRange) * chartHeight;
      const openY = chartHeight - ((open - (basePrice - priceRange/2)) / priceRange) * chartHeight;
      const closeY = chartHeight - ((close - (basePrice - priceRange/2)) / priceRange) * chartHeight;

      // Draw wick/shadow
      ctx.strokeStyle = isGreen ? "#26a69a" : "#ef5350";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth/2, highY);
      ctx.lineTo(x + candleWidth/2, lowY);
      ctx.stroke();

      // Draw candle body
      ctx.fillStyle = isGreen ? "#26a69a" : "#ef5350";
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);
      
      if (bodyHeight < 1) {
        // Doji candle - draw thin line
        ctx.fillRect(x + 1, bodyY, candleWidth - 2, 1);
      } else {
        ctx.fillRect(x + 1, bodyY, candleWidth - 2, bodyHeight);
      }
    }

    // Draw volume bars with better styling
    const volumeAreaHeight = rect.height * 0.15;
    const volumeStartY = rect.height * 0.85;
    
    for (let i = 0; i < candleCount; i++) {
      const x = i * candleWidth;
      const volumeHeight = Math.random() * volumeAreaHeight;
      const y = volumeStartY + (volumeAreaHeight - volumeHeight);
      
      // Color volume bars based on price movement
      const isGreenVolume = Math.random() > 0.5;
      ctx.fillStyle = isGreenVolume 
        ? "rgba(38, 166, 154, 0.6)" 
        : "rgba(239, 83, 80, 0.6)";
      ctx.fillRect(x + 1, y, candleWidth - 2, volumeHeight);
    }

    // Draw price scale on the right
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    
    for (let i = 0; i <= 8; i++) {
      const y = (chartHeight / 8) * i;
      const price = basePrice + (priceRange/2) - (i * priceRange / 8);
      ctx.fillText(price.toFixed(0), rect.width - 60, y + 3);
    }

    // Draw time labels at bottom
    ctx.textAlign = "center";
    const timeLabels = ["22:30", "23:30", "00:30", "01:30", "02:30", "03:30", "04:30", "05:30"];
    for (let i = 0; i < timeLabels.length; i++) {
      const x = (rect.width / (timeLabels.length - 1)) * i;
      ctx.fillText(timeLabels[i], x, rect.height - 5);
    }

    // Current price line
    const currentPriceY = chartHeight - ((basePrice - (basePrice - priceRange/2)) / priceRange) * chartHeight;
    ctx.strokeStyle = "#ffeb3b";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, currentPriceY);
    ctx.lineTo(rect.width - 70, currentPriceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current price label
    ctx.fillStyle = "#ffeb3b";
    ctx.fillRect(rect.width - 70, currentPriceY - 10, 65, 20);
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(basePrice.toFixed(2), rect.width - 37, currentPriceY + 3);

  }, [currentPrice, selectedTimeframe]);

  const handleBuyOrder = () => {
    if (!orderAmount || !user) return;
    
    createOrderMutation.mutate({
      currency: selectedPair,
      direction: "Buy Up",
      amount: parseFloat(orderAmount),
      duration: 300 // 5 minutes
    });
  };

  const handleSellOrder = () => {
    if (!orderAmount || !user) return;
    
    createOrderMutation.mutate({
      currency: selectedPair,
      direction: "Buy Down", 
      amount: parseFloat(orderAmount),
      duration: 300 // 5 minutes
    });
  };

  const handleBack = () => {
    setLocation('/customer');
  };

  const handleHome = () => {
    setLocation('/customer');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleHome}
            className="text-white hover:bg-gray-800"
          >
            <Home className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">{selectedPair}</span>
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="text-right">
          <Button 
            variant="ghost" 
            className="text-blue-400 hover:text-blue-300"
            onClick={() => setLocation('/customer')}
          >
            Spot Orders <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Sidebar - Crypto Pairs */}
        <div className="w-full lg:w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Spot</h2>
            <div className="space-y-1">
              {cryptoPairs.map((pair) => (
                <div
                  key={pair.symbol}
                  className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
                    selectedPair === pair.symbol ? 'bg-gray-800' : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedPair(pair.symbol)}
                >
                  <div>
                    <div className="font-medium text-white">{pair.symbol}</div>
                    <div className="text-xs text-gray-400">Vol {pair.volume24h}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-red-400">{pair.price}</div>
                    <div className={`text-xs ${
                      parseFloat(pair.change24h) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {parseFloat(pair.change24h) >= 0 ? '+' : ''}{pair.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Price Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <div className="text-2xl font-bold text-red-400">{currentPrice}</div>
                  <div className="text-sm text-gray-400">
                    24H High: {(parseFloat(currentPrice) * 1.02).toFixed(2)} 
                    <span className="ml-4">24H Low: {(parseFloat(currentPrice) * 0.98).toFixed(2)}</span>
                  </div>
                </div>
                <div className={`text-lg ${parseFloat(currentChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(currentChange) >= 0 ? '+' : ''}{currentChange}%
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <div>24H Volume: 143.25M</div>
                <div>24H Turnover: 1.23K</div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Chart Section with Professional Grid */}
            <div className="flex-1 p-4">
              {/* Enhanced Timeframe Buttons */}
              <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-fit mb-4">
                {timeframes.map((tf) => (
                  <Button
                    key={tf}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${
                      selectedTimeframe === tf 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {tf}
                  </Button>
                ))}
              </div>

              {/* Professional Chart Canvas with Grid Layout */}
              <div className="relative rounded-lg border border-gray-700 mb-4 overflow-hidden" 
                   style={{ 
                     height: '450px',
                     background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)'
                   }}>
                <canvas 
                  ref={chartRef}
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                />
                
                {/* Chart branding and info overlay */}
                <div className="absolute bottom-3 left-3 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-blue-400 font-medium">Chart by TradingView</span>
                  </div>
                </div>
                
                {/* Price info overlay */}
                <div className="absolute top-3 left-3 flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">O</span>
                    <span className="text-white font-mono">{(parseFloat(currentPrice) * 0.999).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">H</span>
                    <span className="text-white font-mono">{(parseFloat(currentPrice) * 1.002).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">L</span>
                    <span className="text-white font-mono">{(parseFloat(currentPrice) * 0.998).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">C</span>
                    <span className="text-white font-mono">{currentPrice}</span>
                  </div>
                </div>
                
                {/* Volume indicator */}
                <div className="absolute top-3 right-3 text-xs text-gray-400">
                  <div>24H Volume: 143.25M</div>
                  <div className="text-right">24H Turnover: 1.56K</div>
                </div>
              </div>

              {/* Enhanced Trade History Table with Better Layout */}
              <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-xl">
                <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 text-sm text-gray-300 font-medium bg-gray-800">
                  <div>Time</div>
                  <div>Direction</div>
                  <div>Price</div>
                  <div>Quantity</div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {tradeHistory.map((trade, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b border-gray-800 text-sm hover:bg-gray-800 transition-colors">
                      <div className="text-gray-400 font-mono">{trade.time}</div>
                      <div className={`font-medium ${trade.direction === 'Buy' ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.direction}
                      </div>
                      <div className="font-mono text-white">{trade.price}</div>
                      <div className="text-gray-300 font-mono">{trade.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Right Sidebar - Order Book */}
            <div className="w-full lg:w-80 p-4 border-l border-gray-700">
              <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-xl mb-4">
                <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-700 text-sm text-gray-300 font-medium bg-gray-800">
                  <div>Price</div>
                  <div>Quantity</div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {orderBook.map((order, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 p-3 hover:bg-gray-800 transition-colors text-sm">
                      <div className={`font-mono ${order.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                        {order.price}
                      </div>
                      <div className="text-gray-300 font-mono">{order.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trading Buttons */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowBuyForm(!showBuyForm)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
              >
                Buy Up
              </Button>
              <Button
                onClick={() => setShowSellForm(!showSellForm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
              >
                Buy Down
              </Button>
            </div>

            {/* Order Forms */}
            {(showBuyForm || showSellForm) && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Amount (USDT)</label>
                  <input
                    type="number"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={showBuyForm ? handleBuyOrder : handleSellOrder}
                    disabled={createOrderMutation.isPending || !orderAmount}
                    className={`flex-1 ${
                      showBuyForm 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    } text-white font-bold py-2 rounded`}
                  >
                    {createOrderMutation.isPending ? 'Placing Order...' : 
                     showBuyForm ? 'Confirm Buy Up' : 'Confirm Buy Down'}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowBuyForm(false);
                      setShowSellForm(false);
                      setOrderAmount("");
                    }}
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
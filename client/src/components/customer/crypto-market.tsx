import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface TradeData {
  time: string;
  direction: 'Buy' | 'Sell';
  price: string;
  quantity: string;
}

export function CryptoMarket() {
  const { user } = useAuth();
  const [currentPrice, setCurrentPrice] = useState<number>(115239.8128);
  const [priceChange, setPriceChange] = useState<number>(-2.54);
  const [highPrice, setHighPrice] = useState<number>(118305.3500);
  const [lowPrice, setLowPrice] = useState<number>(115239.8128);
  const [volume, setVolume] = useState<string>("143.05M");
  const [turnover, setTurnover] = useState<string>("1.33K");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("5M");
  
  const [tradeHistory] = useState<TradeData[]>([
    { time: "11:56:43", direction: "Buy", price: "115234.1900", quantity: "0.9789" },
    { time: "11:56:35", direction: "Buy", price: "115245.60", quantity: "0.0091" },
    { time: "11:56:34", direction: "Buy", price: "115234.1900", quantity: "0.0925" },
    { time: "11:51:05", direction: "Buy", price: "115238.9600", quantity: "0.0605" },
    { time: "11:50:36", direction: "Sell", price: "115235.8200", quantity: "0.0047" },
    { time: "11:56:45", direction: "Buy", price: "115236.9500", quantity: "0.0002" },
    { time: "11:51:10", direction: "Sell", price: "115236.9600", quantity: "0.0005" },
    { time: "11:51:06", direction: "Buy", price: "115238.9600", quantity: "0.0103" },
    { time: "11:58:43", direction: "Buy", price: "115234.1900", quantity: "0.0076" },
    { time: "11:58:35", direction: "Buy", price: "115227.06", quantity: "0.0091" }
  ]);

  const timeframes = ["1M", "5M", "30M", "1H", "4H", "1D"];

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 100; // Random price variation
      setCurrentPrice(prev => Math.max(0, prev + variation));
      setPriceChange((Math.random() - 0.5) * 5);
      setHighPrice(prev => prev + Math.random() * 50);
      setLowPrice(prev => prev - Math.random() * 30);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBuyUp = () => {
    if (user) {
      console.log("Buy Up order placed");
      // Navigate to trading logic
    }
  };

  const handleBuyDown = () => {
    if (user) {
      console.log("Buy Down order placed");
      // Navigate to trading logic
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Home className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">BTC/USDT</span>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Spot Orders</div>
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
            &gt;
          </Button>
        </div>
      </div>

      {/* Price Information */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-red-400">
              {currentPrice.toFixed(4)}
            </div>
            <div className="text-sm text-red-400">
              {priceChange.toFixed(2)}%
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-gray-400">24H High</div>
              <div className="text-white">{highPrice.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-gray-400">24H Low</div>
              <div className="text-white">{lowPrice.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-gray-400">24H Volume</div>
              <div className="text-white">{volume}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400">24H Turnover</div>
            <div className="text-white">{turnover}</div>
          </div>
        </div>
      </div>

      {/* Time Controls */}
      <div className="flex items-center space-x-2 p-4 bg-gray-800 border-b border-gray-700">
        {timeframes.map((timeframe) => (
          <Button
            key={timeframe}
            variant="ghost"
            size="sm"
            className={`px-3 py-1 text-xs ${
              selectedTimeframe === timeframe
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setSelectedTimeframe(timeframe)}
          >
            {timeframe}
          </Button>
        ))}
      </div>

      {/* Chart Area */}
      <div className="relative h-80 bg-gray-900 border-b border-gray-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
            {/* Simulated Chart Grid */}
            <div className="absolute inset-0">
              {/* Horizontal grid lines */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-px bg-gray-700 opacity-30"
                  style={{ top: `${(i + 1) * 12.5}%` }}
                />
              ))}
              {/* Vertical grid lines */}
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-full w-px bg-gray-700 opacity-30"
                  style={{ left: `${(i + 1) * 10}%` }}
                />
              ))}
            </div>
            
            {/* Price levels on right */}
            <div className="absolute right-2 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
              <div>118400.00</div>
              <div>117900.00</div>
              <div>117400.00</div>
              <div>116900.00</div>
              <div className="text-green-400 font-bold">115239.86</div>
              <div>115000.00</div>
              <div>114500.00</div>
              <div>114000.00</div>
            </div>

            {/* Simulated candlestick pattern */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>
              <path
                d="M 0 200 L 50 180 L 100 160 L 150 170 L 200 150 L 250 140 L 300 160 L 350 180 L 400 200 L 450 220 L 500 240 L 550 260 L 600 280 L 650 270 L 700 260 L 750 250 L 800 240"
                stroke="#10B981"
                strokeWidth="2"
                fill="url(#priceGradient)"
              />
            </svg>

            {/* Volume bars at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end space-x-1 px-4">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="bg-blue-500 opacity-60"
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    width: '2px'
                  }}
                />
              ))}
            </div>

            {/* Chart by TradingView label */}
            <div className="absolute bottom-2 left-2 text-xs text-gray-500">
              📊 Chart by TradingView
            </div>
          </div>
        </div>
      </div>

      {/* Trading Table */}
      <div className="flex-1 bg-gray-900">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 p-4 text-xs text-gray-400 bg-gray-800 border-b border-gray-700">
          <div>Time</div>
          <div>Direction</div>
          <div>Price</div>
          <div>Quantity</div>
        </div>

        {/* Table Rows */}
        <div className="max-h-40 overflow-y-auto">
          {tradeHistory.map((trade, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 p-4 text-xs border-b border-gray-800 hover:bg-gray-800/50"
            >
              <div className="text-gray-400">{trade.time}</div>
              <div className={trade.direction === 'Buy' ? 'text-green-400' : 'text-red-400'}>
                {trade.direction}
              </div>
              <div className="text-white">{trade.price}</div>
              <div className="text-gray-300">{trade.quantity}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Trading Buttons */}
      <div className="fixed bottom-0 left-0 right-0 flex bg-gray-900 p-4 space-x-4">
        <Button
          onClick={handleBuyUp}
          className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
        >
          Buy Up
        </Button>
        <Button
          onClick={handleBuyDown}
          className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
        >
          Buy down
        </Button>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Grid3x3,
  Plus,
  LineChart,
  TrendingUpIcon,
  Settings,
  ChevronDown,
  Circle
} from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const timeframes = ["1m", "30m", "1h", "D"];

interface CryptoPriceData {
  price: string;
  change: string;
}

interface CryptoPrices {
  [key: string]: CryptoPriceData;
}

interface SpotOrdersProps {
  selectedCoin?: string | null;
  onNavigateToOrders?: () => void;
}

export function SpotOrders({
  selectedCoin,
  onNavigateToOrders,
}: SpotOrdersProps) {
  const [, setLocation] = useLocation();
  const [activeTimeframe, setActiveTimeframe] = useState("1h");
  const [quantity, setQuantity] = useState("0");
  const [showTradePopup, setShowTradePopup] = useState(false);
  const [tradeDirection, setTradeDirection] = useState<"up" | "down">("up");
  const [selectedDuration, setSelectedDuration] = useState("60");
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const queryClient = useQueryClient();

  // Set crypto based on selectedCoin parameter or default to BTC
  const [selectedCrypto, setSelectedCrypto] = useState(
    selectedCoin ? selectedCoin.replace("/USDT", "") : "BTC",
  );

  // Available cryptocurrency options for the dropdown
  const cryptoOptions = [
    { symbol: "BTC/USDT", name: "Bitcoin" },
    { symbol: "ETH/USDT", name: "Ethereum" },
    { symbol: "DOGE/USDT", name: "Dogecoin" },
    { symbol: "CHZ/USDT", name: "Chiliz" },
    { symbol: "BCH/USDT", name: "Bitcoin Cash" },
    { symbol: "PSG/USDT", name: "Paris Saint-Germain" },
    { symbol: "JUV/USDT", name: "Juventus" },
    { symbol: "ATM/USDT", name: "Atletico Madrid" },
    { symbol: "LTC/USDT", name: "Litecoin" },
    { symbol: "EOS/USDT", name: "EOS" },
    { symbol: "TRX/USDT", name: "Tron" },
    { symbol: "ETC/USDT", name: "Ethereum Classic" },
    { symbol: "BTS/USDT", name: "BitShares" }
  ];

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (numPrice < 1) {
      return numPrice.toFixed(4);
    } else if (numPrice < 100) {
      return numPrice.toFixed(2);
    } else {
      return numPrice.toFixed(2);
    }
  };

  const handleCurrencyChange = (newCurrency: string) => {
    const baseCurrency = newCurrency.split("/")[0];
    setSelectedCrypto(baseCurrency);
  };

  const tradeDurations = [
    { value: "60", label: "60S", seconds: 60, profit: "30%" },
    { value: "120", label: "120S", seconds: 120, profit: "40%" },
    { value: "180", label: "180S", seconds: 180, profit: "50%" },
  ];

  // Get real-time crypto prices
  const { data: cryptoPrices = {} } = useQuery<CryptoPrices>({
    queryKey: ["/api/crypto-prices"],
    refetchInterval: 3000,
  });

  // Get price data for selected crypto
  const cryptoSymbol = `${selectedCrypto}/USDT`;
  const currentPrice = cryptoPrices[cryptoSymbol]?.price || cryptoPrices["BTC/USDT"]?.price || "111814.14";
  const priceChange = cryptoPrices[cryptoSymbol]?.change || cryptoPrices["BTC/USDT"]?.change || "-3.14";
  const isPositive = parseFloat(priceChange) >= 0;

  // Calculate price stats
  const price = parseFloat(currentPrice);
  const change = parseFloat(priceChange);
  const changeAmount = (price * change / 100).toFixed(2);
  const highPrice = (price * 1.035).toFixed(2);
  const lowPrice = (price * 0.965).toFixed(2);
  const volume24h = "278528364.4";
  const volumeBTC = "24378";
  const transactions = "5914608";

  // Trading mutation
  const placeTrade = useMutation({
    mutationFn: async (data: {
      asset: string;
      direction: string;
      amount: number;
      duration: number;
      entryPrice: string;
      profitLoss: number;
    }) => {
      const res = await apiRequest("POST", "/api/betting-orders", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Trade Placed Successfully",
        description: "Your trading order has been placed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/betting-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });

      if (onNavigateToOrders) {
        setTimeout(() => {
          onNavigateToOrders();
        }, 1000);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Trade Failed",
        description: error.message || "Failed to place trade",
        variant: "destructive",
      });
    },
  });

  const handleTradeClick = (direction: "up" | "down") => {
    setTradeDirection(direction);
    setShowTradePopup(true);
  };

  const handlePlaceTrade = () => {
    const duration = tradeDurations.find((d) => d.value === selectedDuration);
    if (!duration || !user) return;

    const amount = parseFloat(quantity);
    let profitLoss = 0;

    // Both Buy Up and Buy Down generate profit
    if (selectedDuration === "60") profitLoss = amount * 0.3;
    else if (selectedDuration === "120") profitLoss = amount * 0.4;
    else if (selectedDuration === "180") profitLoss = amount * 0.5;

    const orderData = {
      asset: `${selectedCrypto}/USDT`,
      direction: tradeDirection === "up" ? "Buy Up" : "Buy Down",
      amount: parseFloat(quantity),
      duration: duration.seconds,
      entryPrice: currentPrice,
      profitLoss: profitLoss,
    };

    placeTrade.mutate(orderData);
    setShowTradePopup(false);
  };

  // Chart drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw simple line chart
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const points = 100;
    const basePrice = parseFloat(currentPrice);
    
    for (let i = 0; i < points; i++) {
      const x = (width / points) * i;
      const randomOffset = (Math.random() - 0.5) * 50;
      const y = height / 2 + randomOffset;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw volume bars at bottom
    ctx.fillStyle = "#e5e7eb";
    for (let i = 0; i < points; i++) {
      const x = (width / points) * i;
      const barHeight = Math.random() * 30;
      ctx.fillRect(x, height - barHeight, width / points - 1, barHeight);
    }
  }, [currentPrice, activeTimeframe]);

  const selectedCryptoName = cryptoOptions.find(c => c.symbol === `${selectedCrypto}/USDT`)?.name || "Bitcoin";

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden pb-16 sm:pb-20 md:pb-24">
      {/* Top Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-gray-900 hover:bg-gray-100 flex items-center space-x-2 px-3 py-2 h-auto font-semibold"
                data-testid="button-currency-selector"
              >
                <Grid3x3 className="w-4 h-4" />
                <span>{selectedCrypto}/USDT</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-gray-200">
              {cryptoOptions.map((crypto) => {
                const cryptoPrice = cryptoPrices[crypto.symbol]?.price || "0.00";
                const cryptoChange = cryptoPrices[crypto.symbol]?.change || "0.00";
                const cryptoIsPositive = !cryptoChange.toString().startsWith("-");

                return (
                  <DropdownMenuItem
                    key={crypto.symbol}
                    className="hover:bg-gray-100 cursor-pointer flex justify-between items-center px-3 py-2"
                    onClick={() => handleCurrencyChange(crypto.symbol)}
                    data-testid={`option-${crypto.symbol.toLowerCase().replace('/', '-')}`}
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {crypto.symbol}
                    </span>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${cryptoIsPositive ? "text-green-600" : "text-red-600"}`}>
                        {formatPrice(cryptoPrice)}
                      </div>
                      <div className={`text-xs ${cryptoIsPositive ? "text-green-600" : "text-red-600"}`}>
                        {cryptoChange}%
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Price Stats */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Side */}
          <div>
            <div className="text-xs text-gray-500 mb-1">Latest Price</div>
            <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatPrice(currentPrice)}
            </div>
            <div className="text-xs text-gray-500 mt-2">24H Rise Fall</div>
            <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{changeAmount} {priceChange}%
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">24H Highest Price</span>
              <span className="text-gray-900 font-medium">{highPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">24H Lowest Price</span>
              <span className="text-gray-900 font-medium">{lowPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">24H Volume(USDT)</span>
              <span className="text-gray-900 font-medium">{volume24h}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">24H Volume({selectedCrypto})</span>
              <span className="text-gray-900 font-medium">{volumeBTC}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">24H Transactions</span>
              <span className="text-gray-900 font-medium">{transactions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeframe Controls */}
      <div className="bg-white px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeTimeframe === tf
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              data-testid={`button-timeframe-${tf}`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <LineChart className="w-4 h-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <TrendingUpIcon className="w-4 h-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Plus className="w-4 h-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Settings className="w-4 h-4 text-gray-600" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                Ind <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>MA</DropdownMenuItem>
              <DropdownMenuItem>MACD</DropdownMenuItem>
              <DropdownMenuItem>RSI</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Ticker Line */}
      <div className="bg-white px-4 py-2 border-b border-gray-100 flex items-center space-x-4 text-xs">
        <div className="flex items-center space-x-2">
          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
          <span className="text-gray-900 font-medium">{selectedCryptoName} / TetherUS</span>
          <span className="text-gray-500">· 1D · Binance</span>
        </div>
        <div className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {formatPrice(currentPrice)}
        </div>
        <div className={`${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{priceChange}%
        </div>
        <div className="text-gray-500">Vol: {selectedCrypto} 8.77K</div>
      </div>

      {/* SMA Indicator Line */}
      <div className="bg-white px-4 py-1 border-b border-gray-100">
        <div className="text-xs text-gray-600">
          <span className="mr-4">SMA 9 close</span>
          <span className="text-blue-600">{(parseFloat(currentPrice) * 1.05).toFixed(2)}</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 bg-white p-4">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>

      {/* MACD Indicator */}
      <div className="bg-white px-4 py-2 border-t border-gray-100">
        <div className="text-xs">
          <span className="text-gray-600 mr-2">MACD 12 26 close</span>
          <span className="text-red-600">-999.78</span>
          <span className="text-red-600 ml-2">-19.39</span>
          <span className="text-orange-500 ml-2">980.39</span>
        </div>
      </div>

      {/* Bottom Buy/Sell Buttons */}
      <div className="bg-white border-t border-gray-200 p-4 pb-20 sm:pb-24">
        <div className="flex space-x-3">
          <Button
            onClick={() => handleTradeClick("up")}
            disabled={placeTrade.isPending}
            className="flex-1 bg-[#7CB342] hover:bg-[#6DA33A] text-white font-semibold py-3 rounded-lg text-base"
            data-testid="button-buy-up"
          >
            Buy Up
          </Button>
          <Button
            onClick={() => handleTradeClick("down")}
            disabled={placeTrade.isPending}
            className="flex-1 bg-[#FF6347] hover:bg-[#E5533D] text-white font-semibold py-3 rounded-lg text-base"
            data-testid="button-buy-down"
          >
            Buy Down
          </Button>
        </div>
      </div>

      {/* Trade Popup */}
      <Dialog open={showTradePopup} onOpenChange={setShowTradePopup}>
        <DialogContent className="sm:max-w-lg bg-white border-gray-200">
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500">Product Name</div>
                  <div className="text-lg font-bold text-gray-900">
                    {selectedCrypto}/USDT
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Direction: {tradeDirection === "up" ? "Buy Up" : "Buy Down"}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Current price</div>
                  <div className="text-lg font-bold text-gray-900">
                    {currentPrice}
                  </div>
                </div>
              </div>
            </div>

            {/* Trading Time Selection */}
            <div>
              <div className="text-sm text-gray-700 font-medium mb-3">Trading Time</div>
              <div className="grid grid-cols-3 gap-3">
                {tradeDurations.map((duration) => (
                  <button
                    key={duration.value}
                    onClick={() => setSelectedDuration(duration.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedDuration === duration.value
                        ? "border-[#7CB342] bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    data-testid={`button-duration-${duration.value}`}
                  >
                    <div className="text-base font-semibold text-gray-900">{duration.label}</div>
                    <div className="text-xs text-green-600 mt-1">{duration.profit}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <div className="text-sm text-gray-700 font-medium mb-2">Amount</div>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342] focus:border-transparent"
                data-testid="input-trade-amount"
              />
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handlePlaceTrade}
              disabled={placeTrade.isPending || !quantity || parseFloat(quantity) <= 0}
              className="w-full bg-[#7CB342] hover:bg-[#6DA33A] text-white font-semibold py-3 rounded-lg"
              data-testid="button-confirm-trade"
            >
              {placeTrade.isPending ? "Placing..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RefreshCw, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useCryptoPrices } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface CryptoMarketplaceProps {
  onSelectCurrency: (currency: string) => void;
}

export function CryptoMarketplace({
  onSelectCurrency,
}: CryptoMarketplaceProps) {
  const { data: cryptoPrices } = useCryptoPrices();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-slide every 5 seconds for banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Type-safe crypto prices access
  const getCryptoPrice = (symbol: string) =>
    (cryptoPrices as any)?.[symbol]?.price || "0.00";
  const getCryptoChange = (symbol: string) =>
    (cryptoPrices as any)?.[symbol]?.change || "0.00";

  // Top 4 cryptos for cards
  const topCryptos = [
    {
      symbol: "BTC/USDT",
      price: getCryptoPrice("BTC/USDT") || "122210.07",
      change: getCryptoChange("BTC/USDT") || "-0.60",
    },
    {
      symbol: "ETH/USDT",
      price: getCryptoPrice("ETH/USDT") || "4351.11",
      change: getCryptoChange("ETH/USDT") || "-3.22",
    },
    {
      symbol: "DOGE/USDT",
      price: getCryptoPrice("DOGE/USDT") || "0.24576",
      change: getCryptoChange("DOGE/USDT") || "-1.77",
    },
    {
      symbol: "CHZ/USDT",
      price: getCryptoPrice("CHZ/USDT") || "0.04099",
      change: getCryptoChange("CHZ/USDT") || "-2.31",
    },
  ];

  // Chart cryptos
  const chartCryptos = [
    { name: "Litecoin", trend: "up", change: "+12" },
    { name: "Bitcoin", trend: "up", change: "+12.8%" },
    { name: "Ripple", trend: "down", change: "" },
    { name: "Ethereum", trend: "up", change: "" },
  ];

  // All crypto data for table
  const cryptoData = [
    {
      symbol: "BTC/USDT",
      name: "Bitcoin",
      icon: "₿",
      price: getCryptoPrice("BTC/USDT") || "115112.9065",
      change: getCryptoChange("BTC/USDT") || "-2.65",
      color: "#F7931A",
    },
    {
      symbol: "ETH/USDT",
      name: "Ethereum",
      icon: "Ξ",
      price: getCryptoPrice("ETH/USDT") || "4239.2141",
      change: getCryptoChange("ETH/USDT") || "-7.08",
      color: "#627EEA",
    },
    {
      symbol: "DOGE/USDT",
      name: "Dogecoin",
      icon: "Ð",
      price: getCryptoPrice("DOGE/USDT") || "0.2223",
      change: getCryptoChange("DOGE/USDT") || "-7.96",
      color: "#C2A633",
    },
    {
      symbol: "CHZ/USDT",
      name: "Chiliz",
      icon: "🌶️",
      price: getCryptoPrice("CHZ/USDT") || "0.0397",
      change: getCryptoChange("CHZ/USDT") || "-6.39",
      color: "#CD212A",
    },
    {
      symbol: "LTC/USDT",
      name: "Litecoin",
      icon: "Ł",
      price: getCryptoPrice("LTC/USDT") || "116.4456",
      change: getCryptoChange("LTC/USDT") || "-4.81",
      color: "#345D9D",
    },
    {
      symbol: "XRP/USDT",
      name: "Ripple",
      icon: "◉",
      price: getCryptoPrice("XRP/USDT") || "0.7240",
      change: getCryptoChange("XRP/USDT") || "-1.23",
      color: "#00AAE4",
    },
  ];

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (numPrice < 1) {
      return numPrice.toFixed(5);
    } else if (numPrice < 100) {
      return numPrice.toFixed(2);
    } else {
      return numPrice.toFixed(2);
    }
  };

  const formatChange = (change: string | number) => {
    const numChange = typeof change === "string" ? parseFloat(change) : change;
    return numChange > 0
      ? `+${numChange.toFixed(2)}%`
      : `${numChange.toFixed(2)}%`;
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header with profile, title, and balance */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profileImage || `/api/placeholder/48/48`} alt={user?.name || 'Profile'} />
            <AvatarFallback className="bg-blue-500 text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold">Home</h1>
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold">
              {user?.availableBalance ? parseFloat(user.availableBalance).toLocaleString() : '0'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-1 h-8 w-8"
            >
              <RefreshCw 
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Banner Slider */}
      <div className="relative h-[180px] sm:h-[200px] overflow-hidden rounded-lg mx-4 mt-4">
        {/* Slide 1: What is a Crypto Exchange */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-between px-8 transition-opacity duration-500 ${currentSlide === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + 2) % 2)}
            className="text-white/70 hover:text-white z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex-1 text-center">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
              What is a
            </h2>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
              Crypto<br/>Exchange
            </h2>
          </div>
          
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % 2)}
            className="text-white/70 hover:text-white z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Slide 2: Payment Card */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-red-400 flex items-center justify-between px-4 sm:px-8 transition-opacity duration-500 ${currentSlide === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + 2) % 2)}
            className="text-white/70 hover:text-white z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex items-center justify-center gap-4 sm:gap-8">
            {/* Card Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-600 to-red-500 rounded-xl p-4 sm:p-6 w-48 sm:w-64 shadow-2xl">
                <div className="text-white space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-8 bg-yellow-400 rounded"></div>
                    <div className="text-2xl">💳</div>
                  </div>
                  <div className="text-sm sm:text-lg font-mono tracking-wider">
                    1307 9113 0592 2711
                  </div>
                  <div className="text-xs opacity-80">11/25</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
                💰
              </div>
            </div>
            
            {/* Shopping Woman Illustration */}
            <div className="hidden sm:block text-6xl">
              🛍️
            </div>
          </div>
          
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % 2)}
            className="text-white/70 hover:text-white z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          <button 
            onClick={() => setCurrentSlide(0)}
            className={`w-2 h-2 rounded-full transition-colors ${currentSlide === 0 ? 'bg-white' : 'bg-white/50'}`}
          />
          <button 
            onClick={() => setCurrentSlide(1)}
            className={`w-2 h-2 rounded-full transition-colors ${currentSlide === 1 ? 'bg-white' : 'bg-white/50'}`}
          />
        </div>
      </div>

      {/* 4 Crypto Cards Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 my-4">
        {topCryptos.map((crypto) => {
          const isPositive = parseFloat(crypto.change) >= 0;
          return (
            <div
              key={crypto.symbol}
              onClick={() => onSelectCurrency(crypto.symbol.split('/')[0])}
              className="bg-white border-2 border-[#FF6B35] rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="text-sm font-bold text-gray-900 mb-2">{crypto.symbol}</div>
              <div className={`text-lg font-bold mb-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {formatPrice(crypto.price)}
              </div>
              <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {formatChange(crypto.change)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 mx-4 my-4 rounded-lg p-4 relative overflow-hidden">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Crypto list with trends */}
        <div className="relative z-10 space-y-2 mb-4">
          {chartCryptos.map((crypto, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className={`font-medium ${index === 0 ? 'text-white' : index === 1 ? 'text-[#FFB84D]' : 'text-gray-400'}`}>
                {crypto.name}
              </span>
              {crypto.change && (
                <div className="flex items-center gap-1">
                  {crypto.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${crypto.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.change}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SVG Chart */}
        <div className="relative h-24">
          <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            {/* Candlestick bars */}
            <rect x="40" y="70" width="8" height="20" fill="#4ADE80" opacity="0.6"/>
            <rect x="70" y="60" width="8" height="30" fill="#4ADE80" opacity="0.6"/>
            <rect x="100" y="50" width="8" height="40" fill="#4ADE80" opacity="0.6"/>
            <rect x="130" y="55" width="8" height="35" fill="#4ADE80" opacity="0.6"/>
            <rect x="160" y="45" width="8" height="45" fill="#4ADE80" opacity="0.6"/>
            <rect x="190" y="40" width="8" height="50" fill="#4ADE80" opacity="0.6"/>
            <rect x="220" y="50" width="8" height="40" fill="#4ADE80" opacity="0.6"/>
            <rect x="250" y="45" width="8" height="45" fill="#4ADE80" opacity="0.6"/>
            <rect x="280" y="35" width="8" height="55" fill="#4ADE80" opacity="0.6"/>
            <rect x="310" y="30" width="8" height="60" fill="#4ADE80" opacity="0.6"/>
            <rect x="340" y="25" width="8" height="65" fill="#4ADE80" opacity="0.6"/>
            <rect x="370" y="20" width="8" height="70" fill="#4ADE80" opacity="0.6"/>

            {/* Trend line */}
            <path
              d="M 0 90 Q 100 80, 200 60 T 400 20"
              stroke="#22C55E"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>

      {/* Currency Table */}
      <div className="px-4">
        <div className="bg-gray-100 rounded-t-lg px-4 py-2 flex justify-between items-center font-semibold text-sm">
          <span className="flex-1">Currency</span>
          <span className="flex-1 text-center">Real Price</span>
          <span className="flex-1 text-right">Rise Fall</span>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-b-lg">
          {cryptoData.map((crypto, index) => {
            const isPositive = parseFloat(crypto.change) >= 0;
            return (
              <div
                key={crypto.symbol}
                onClick={() => onSelectCurrency(crypto.symbol.split('/')[0])}
                className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: crypto.color }}
                  >
                    {crypto.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {crypto.symbol}
                  </div>
                </div>

                <div className="flex-1 text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(crypto.price)}
                  </div>
                </div>

                <div className="flex-1 text-right">
                  <div className={`inline-block text-xs px-2 py-1 rounded ${
                    isPositive 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {formatChange(crypto.change)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";
import { useCryptoPrices } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import cryptoExchangeImg from "@assets/1000000575770863_1751631239841.png";
import paymentCardImg from "@assets/1000001387435998_1751631239844.jpg";
import bannerTradingImg from "@assets/ats_middle_1751631513890.jpg";

interface CryptoHomeProps {
  onSelectCurrency: (currency: string) => void;
  onNavigateToProfile?: () => void;
}

export function CryptoHome({
  onSelectCurrency,
  onNavigateToProfile,
}: CryptoHomeProps) {
  const { data: cryptoPrices } = useCryptoPrices();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cryptoSlideIndex, setCryptoSlideIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Slider images
  const sliderImages = [
    cryptoExchangeImg, // 1st image - Crypto Exchange
    paymentCardImg, // 2nd image - Payment Card (was 3rd)
  ];

  // Auto-slide every 5 seconds for banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // Auto-refresh balance every 2 minutes (120 seconds)
  useEffect(() => {
    const balanceRefreshInterval = setInterval(() => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      }
    }, 120000); // 2 minutes

    return () => clearInterval(balanceRefreshInterval);
  }, [user, queryClient]);

  // Manual refresh balance function
  const handleManualRefresh = async () => {
    if (user && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        // Add a small delay to show the refresh animation
        setTimeout(() => {
          setIsRefreshing(false);
        }, 500);
      } catch (error) {
        setIsRefreshing(false);
      }
    }
  };

  const cryptoData = [
    {
      symbol: "BTC/USDT",
      name: "Bitcoin",
      price: cryptoPrices?.["BTC/USD"]?.price || "42150.00",
      change: cryptoPrices?.["BTC/USD"]?.change || "+2.4%",
      isPositive: cryptoPrices?.["BTC/USD"]?.change
        ? !cryptoPrices["BTC/USD"].change.startsWith("-")
        : true,
      icon: "₿",
      color: "orange",
    },
    {
      symbol: "ETH/USDT",
      name: "Ethereum",
      price: cryptoPrices?.["ETH/USD"]?.price || "2850.00",
      change: cryptoPrices?.["ETH/USD"]?.change || "-1.2%",
      isPositive: cryptoPrices?.["ETH/USD"]?.change
        ? !cryptoPrices["ETH/USD"].change.startsWith("-")
        : false,
      icon: "⧫",
      color: "blue",
    },
    {
      symbol: "SUP/USDT",
      name: "SuperCoin",
      price: cryptoPrices?.["SUP/USD"]?.price || "0.18",
      change: cryptoPrices?.["SUP/USD"]?.change || "-1.3%",
      isPositive: cryptoPrices?.["SUP/USD"]?.change
        ? !cryptoPrices["SUP/USD"].change.startsWith("-")
        : false,
      icon: "Ⓢ",
      color: "yellow",
    },

    {
      symbol: "LTC/USDT",
      name: "Litecoin",
      price: cryptoPrices?.["LTC/USD"]?.price || "412.89",
      change: cryptoPrices?.["LTC/USD"]?.change || "+2.1%",
      isPositive: cryptoPrices?.["LTC/USD"]?.change
        ? !cryptoPrices["LTC/USD"].change.startsWith("-")
        : true,
      icon: "Ł",
      color: "gray",
    },

    {
      symbol: "CHZ/USDT",
      name: "Chiliz",
      price: cryptoPrices?.["CHZ/USD"]?.price || "0.03457",
      change: cryptoPrices?.["CHZ/USD"]?.change || "-2.59%",
      isPositive: cryptoPrices?.["CHZ/USD"]?.change
        ? !cryptoPrices["CHZ/USD"].change.startsWith("-")
        : false,
      icon: "⚽",
      color: "red",
    },
    {
      symbol: "BCH/USDT",
      name: "Bitcoin Cash",
      price: cryptoPrices?.["BCH/USD"]?.price || "502.8",
      change: cryptoPrices?.["BCH/USD"]?.change || "+0.50%",
      isPositive: cryptoPrices?.["BCH/USD"]?.change
        ? !cryptoPrices["BCH/USD"].change.startsWith("-")
        : true,
      icon: "₿",
      color: "green",
    },

    {
      symbol: "TRX/USDT",
      name: "TRON",
      price: cryptoPrices?.["TRX/USD"]?.price || "0.2712",
      change: cryptoPrices?.["TRX/USD"]?.change || "+0.15%",
      isPositive: cryptoPrices?.["TRX/USD"]?.change
        ? !cryptoPrices["TRX/USD"].change.startsWith("-")
        : true,
      icon: "⬢",
      color: "green",
    },
    {
      symbol: "ETC/USDT",
      name: "Ethereum Classic",
      price: cryptoPrices?.["ETC/USD"]?.price || "16.19",
      change: cryptoPrices?.["ETC/USD"]?.change || "-2.00%",
      isPositive: cryptoPrices?.["ETC/USD"]?.change
        ? !cryptoPrices["ETC/USD"].change.startsWith("-")
        : false,
      icon: "⧫",
      color: "green",
    },
    {
      symbol: "BTS/USDT",
      name: "BitShares",
      price: cryptoPrices?.["BTS/USD"]?.price || "0.0045",
      change: cryptoPrices?.["BTS/USD"]?.change || "+0.50%",
      isPositive: cryptoPrices?.["BTS/USD"]?.change
        ? !cryptoPrices["BTS/USD"].change.startsWith("-")
        : true,
      icon: "◆",
      color: "blue",
    },
  ];

  // Auto-slide crypto boxes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoSlideIndex((prev) => (prev + 1) % cryptoData.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [cryptoData.length]);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-2 sm:px-3 lg:px-4 space-y-2 pb-16 sm:pb-20 md:pb-24">
      {/* Header */}
      <div className="flex items-center justify-between py-1">
        <Avatar
          className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
          onClick={onNavigateToProfile}
        >
          <AvatarImage
            src={user?.profileImage || `/api/placeholder/40/40`}
            alt={user?.name || "Profile"}
          />
          <AvatarFallback className="bg-blue-500 text-white font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() ||
              user?.username?.charAt(0)?.toUpperCase() ||
              "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold">Home</h1>
        </div>
        <div className="text-right flex items-center gap-1">
          <p className="text-xs text-gray-600">
            {user?.availableBalance
              ? parseFloat(user.availableBalance).toLocaleString()
              : "0"}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-1 h-6 w-6"
          >
            <RefreshCw
              className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Banner Slider */}
      <div className="relative h-[180px] sm:h-[200px] rounded-lg overflow-hidden">
        {/* Slide 1: What is a Crypto Exchange */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-between px-8 transition-opacity duration-500 ${currentSlide === 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
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
              Crypto
              <br />
              Exchange
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
          className={`absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-red-400 flex items-center justify-between px-4 sm:px-8 transition-opacity duration-500 ${currentSlide === 1 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
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
            <div className="hidden sm:block text-6xl">🛍️</div>
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
            className={`w-2 h-2 rounded-full transition-colors ${currentSlide === 0 ? "bg-white" : "bg-white/50"}`}
          />
          <button
            onClick={() => setCurrentSlide(1)}
            className={`w-2 h-2 rounded-full transition-colors ${currentSlide === 1 ? "bg-white" : "bg-white/50"}`}
          />
        </div>
      </div>

      {/* Crypto Slider */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${cryptoSlideIndex * (100 / 4)}%)`,
            }}
          >
            {/* Create duplicated array for seamless infinite loop */}
            {[...cryptoData, ...cryptoData].map((crypto, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-1/4 lg:w-1/5 xl:w-1/6"
              >
                <div className="px-1.5">
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 border-[#FF6B35] bg-white"
                    onClick={() =>
                      onSelectCurrency(crypto.symbol.split("/")[0])
                    }
                  >
                    <CardContent className="p-1 sm:p-1.5 lg:p-2">
                      <div className="text-center space-y-0.5 sm:space-y-1">
                        <div>
                          <p className="font-semibold text-[9px] sm:text-[10px] lg:text-xs text-center">
                            {crypto.symbol}
                          </p>
                        </div>

                        <div className="space-y-0.5">
                          <p className="text-[9px] sm:text-[10px] lg:text-xs font-bold text-center">
                            {crypto.price}
                          </p>
                          <div className="flex items-center justify-center space-x-0.5">
                            {crypto.isPositive ? (
                              <TrendingUp className="w-1.5 h-1.5 lg:w-2 lg:h-2 text-green-500" />
                            ) : (
                              <TrendingDown className="w-1.5 h-1.5 lg:w-2 lg:h-2 text-red-500" />
                            )}
                            <span
                              className={`text-[8px] sm:text-[9px] lg:text-[10px] ${crypto.isPositive ? "text-green-500" : "text-red-500"}`}
                            >
                              {crypto.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cryptocurrency Trend Chart Section */}
      <Card className="overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 relative">
        <div className="h-[180px] sm:h-[200px] md:h-[220px] relative">
          {/* Chart Background with Grid */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Cryptocurrency List */}
          <div className="absolute left-2 sm:left-4 top-4 space-y-2 sm:space-y-3 z-10">
            {[
              { name: "Litecoin", trend: "up", change: "+1%" },
              { name: "Bitcoin", trend: "up", change: "+12.8%" },
              { name: "Ripple", trend: "down", change: "" },
              { name: "Ethereum", trend: "", change: "" },
            ].map((crypto, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className={`text-xs sm:text-sm font-medium ${index === 0 ? "text-gray-400" : index === 1 ? "text-orange-400" : "text-blue-400"}`}
                >
                  {crypto.name}
                </span>
                {crypto.trend === "up" && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">
                      {crypto.change}
                    </span>
                  </div>
                )}
                {crypto.trend === "down" && (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
              </div>
            ))}
          </div>

          {/* Chart Line Overlay */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
          >
            {/* Candlestick bars */}
            <rect
              x="50"
              y="120"
              width="8"
              height="60"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="80"
              y="100"
              width="8"
              height="80"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="110"
              y="90"
              width="8"
              height="90"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="140"
              y="110"
              width="8"
              height="70"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="170"
              y="80"
              width="8"
              height="100"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="200"
              y="95"
              width="8"
              height="85"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="230"
              y="105"
              width="8"
              height="75"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="260"
              y="85"
              width="8"
              height="95"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="290"
              y="75"
              width="8"
              height="105"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="320"
              y="95"
              width="8"
              height="85"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="350"
              y="70"
              width="8"
              height="110"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="380"
              y="90"
              width="8"
              height="90"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="410"
              y="60"
              width="8"
              height="120"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="440"
              y="80"
              width="8"
              height="100"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="470"
              y="50"
              width="8"
              height="130"
              fill="#4ade80"
              opacity="0.6"
            />
            <rect
              x="500"
              y="70"
              width="8"
              height="110"
              fill="#4ade80"
              opacity="0.6"
            />

            {/* Trend Line */}
            <path
              d="M 20 150 Q 150 120, 300 80 T 580 40"
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              opacity="0.8"
            />

            {/* Dots on line */}
            <circle cx="150" cy="120" r="4" fill="#22c55e" />
            <circle cx="300" cy="80" r="4" fill="#22c55e" />
            <circle cx="450" cy="60" r="4" fill="#22c55e" />
          </svg>
        </div>
      </Card>

      {/* Currency List */}
      <div className="space-y-1 sm:space-y-2">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 py-1.5 sm:py-2 px-1.5 sm:px-3 bg-gray-50 rounded-lg border">
          <div className="text-[10px] sm:text-xs font-semibold text-gray-700">
            Currency
          </div>
          <div className="text-[10px] sm:text-xs font-semibold text-gray-700 text-center">
            Real Price
          </div>
          <div className="text-[10px] sm:text-xs font-semibold text-gray-700 text-center">
            Rise Fall
          </div>
        </div>

        {cryptoData.map((crypto) => (
          <Card
            key={crypto.symbol}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectCurrency(crypto.symbol)}
          >
            <CardContent className="p-1.5 sm:p-2">
              <div className="grid grid-cols-3 gap-1 sm:gap-2 items-center">
                {/* Currency Column */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center text-white font-bold text-[8px] sm:text-[10px] lg:text-xs
                    ${
                      crypto.color === "orange"
                        ? "bg-orange-500"
                        : crypto.color === "blue"
                          ? "bg-blue-500"
                          : crypto.color === "yellow"
                            ? "bg-yellow-500"
                            : crypto.color === "red"
                              ? "bg-red-500"
                              : "bg-gray-500"
                    }`}
                  >
                    {crypto.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[10px] sm:text-xs lg:text-sm truncate">
                      {crypto.symbol}
                    </div>
                    <div className="text-[8px] sm:text-[10px] lg:text-xs text-gray-600 truncate">
                      {crypto.name}
                    </div>
                  </div>
                </div>

                {/* Real Price Column */}
                <div className="text-center">
                  <div className="font-medium text-[10px] sm:text-xs lg:text-sm">
                    {crypto.price}
                  </div>
                </div>

                {/* Rise Fall Column */}
                <div className="text-center">
                  <Badge
                    variant={crypto.isPositive ? "default" : "destructive"}
                    className={`text-[8px] sm:text-[10px] px-1 py-0.5 ${crypto.isPositive ? "bg-green-500" : "bg-red-500"}`}
                  >
                    {crypto.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

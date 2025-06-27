import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, TrendingUp, TrendingDown, RotateCcw, ChevronLeft } from "lucide-react";
import { useCryptoPrices } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface CryptoHomeProps {
  onSelectCurrency: (currency: string) => void;
  onNavigateToProfile?: () => void;
}

export function CryptoHome({ onSelectCurrency, onNavigateToProfile }: CryptoHomeProps) {
  const { data: cryptoPrices, refetch } = useCryptoPrices();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cryptoSlideIndex, setCryptoSlideIndex] = useState(0);

  // Slider images
  const sliderImages = [
    "/slider-banner-1.svg",
    "/slider-banner-2.svg"
  ];

  // Auto-slide every 5 seconds for banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);



  const cryptoData = [
    {
      symbol: "BTC/USDT",
      name: "Bitcoin",
      price: cryptoPrices?.["BTC/USD"]?.price || "42150.00",
      change: cryptoPrices?.["BTC/USD"]?.change || "+2.4%",
      isPositive: cryptoPrices?.["BTC/USD"]?.change ? !cryptoPrices["BTC/USD"].change.startsWith('-') : true,
      icon: "₿",
      color: "orange"
    },
    {
      symbol: "ETH/USDT", 
      name: "Ethereum",
      price: cryptoPrices?.["ETH/USD"]?.price || "2850.00",
      change: cryptoPrices?.["ETH/USD"]?.change || "-1.2%",
      isPositive: cryptoPrices?.["ETH/USD"]?.change ? !cryptoPrices["ETH/USD"].change.startsWith('-') : false,
      icon: "⧫",
      color: "blue"
    },
    {
      symbol: "DOGE/USDT",
      name: "Dogecoin", 
      price: cryptoPrices?.["DOGE/USD"]?.price || "0.18",
      change: cryptoPrices?.["DOGE/USD"]?.change || "-1.3%",
      isPositive: cryptoPrices?.["DOGE/USD"]?.change ? !cryptoPrices["DOGE/USD"].change.startsWith('-') : false,
      icon: "Ð",
      color: "yellow"
    },
    {
      symbol: "ADA/USDT",
      name: "Cardano",
      price: cryptoPrices?.["ADA/USD"]?.price || "0.45",
      change: cryptoPrices?.["ADA/USD"]?.change || "+5.1%",
      isPositive: cryptoPrices?.["ADA/USD"]?.change ? !cryptoPrices["ADA/USD"].change.startsWith('-') : true,
      icon: "₳",
      color: "blue"
    },
    {
      symbol: "SOL/USDT",
      name: "Solana",
      price: cryptoPrices?.["SOL/USD"]?.price || "215.67",
      change: cryptoPrices?.["SOL/USD"]?.change || "+3.2%",
      isPositive: cryptoPrices?.["SOL/USD"]?.change ? !cryptoPrices["SOL/USD"].change.startsWith('-') : true,
      icon: "◎",
      color: "purple"
    },
    {
      symbol: "LTC/USDT",
      name: "Litecoin",
      price: cryptoPrices?.["LTC/USD"]?.price || "412.89",
      change: cryptoPrices?.["LTC/USD"]?.change || "+2.1%",
      isPositive: cryptoPrices?.["LTC/USD"]?.change ? !cryptoPrices["LTC/USD"].change.startsWith('-') : true,
      icon: "Ł",
      color: "gray"
    },
    {
      symbol: "XRP/USDT", 
      name: "Ripple",
      price: cryptoPrices?.["XRP/USD"]?.price || "1.89",
      change: cryptoPrices?.["XRP/USD"]?.change || "-0.8%",
      isPositive: cryptoPrices?.["XRP/USD"]?.change ? !cryptoPrices["XRP/USD"].change.startsWith('-') : false,
      icon: "◊",
      color: "blue"
    },
    {
      symbol: "CHZ/USDT",
      name: "Chiliz",
      price: cryptoPrices?.["CHZ/USD"]?.price || "0.037",
      change: cryptoPrices?.["CHZ/USD"]?.change || "-1.5%",
      isPositive: cryptoPrices?.["CHZ/USD"]?.change ? !cryptoPrices["CHZ/USD"].change.startsWith('-') : false,
      icon: "⚽",
      color: "red"
    }
  ];



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Avatar 
          className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
          onClick={onNavigateToProfile}
        >
          <AvatarImage src={`/api/placeholder/40/40`} alt={user?.name || 'Profile'} />
          <AvatarFallback className="bg-blue-500 text-white font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">1393050</p>
        </div>
      </div>

      {/* Image Slider */}
      <Card className="overflow-hidden">
        <div className="relative h-32 sm:h-40 md:h-48 lg:h-56">
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image} 
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
          
          {/* Slide indicators */}
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Crypto Market Banner */}
      <div className="relative">
        <div 
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-lg p-6 relative overflow-hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 20' fill='none' stroke='%23475569' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E")`
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Crypto listings */}
            <div className="space-y-3">
              {cryptoData.slice(0, 4).map((crypto, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between text-white cursor-pointer hover:bg-slate-700/30 p-2 rounded transition-colors"
                  onClick={() => onSelectCurrency(crypto.symbol.split('/')[0])}
                >
                  <span className="font-semibold text-base">{crypto.name}</span>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-bold ${crypto.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.isPositive ? '▲' : '▼'} {crypto.change}
                    </span>
                    <span className="text-gray-300 font-medium min-w-[80px] text-right">
                      ${crypto.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right side - Chart visualization */}
            <div className="relative">
              <div className="absolute inset-0 bg-slate-800/50 rounded-md p-4">
                <svg viewBox="0 0 300 120" className="w-full h-full">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="chartGrid" width="30" height="15" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 15" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="300" height="120" fill="url(#chartGrid)"/>
                  
                  {/* Chart area background */}
                  <rect x="20" y="10" width="260" height="100" fill="#1e293b" opacity="0.6" rx="4"/>
                  
                  {/* Price trend line */}
                  <path 
                    d="M 30 90 Q 80 70 130 60 Q 180 45 230 35 Q 260 30 280 25" 
                    stroke="#22c55e" 
                    strokeWidth="2.5" 
                    fill="none"
                  />
                  
                  {/* Area under curve */}
                  <path 
                    d="M 30 90 Q 80 70 130 60 Q 180 45 230 35 Q 260 30 280 25 L 280 110 L 30 110 Z" 
                    fill="url(#chartGradient)"
                  />
                  
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#22c55e', stopOpacity: 0.4}} />
                      <stop offset="100%" style={{stopColor: '#22c55e', stopOpacity: 0.1}} />
                    </linearGradient>
                  </defs>
                  
                  {/* Trend arrow */}
                  <path d="M 270 30 L 280 25 L 275 35 Z" fill="#22c55e"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Overview Chart Area */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Market Overview</h3>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+12.8</span>
              </div>
              <div className="flex items-center space-x-1 text-red-600">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm">-5.2</span>
              </div>
            </div>
          </div>
          <div className="h-24 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/30 to-transparent transform skew-x-12"></div>
            <span className="text-gray-600 text-sm">Market Chart Visualization</span>
          </div>
          <div className="flex justify-center space-x-4 mt-4 text-sm text-gray-600">
            <span>Litecoin</span>
            <span>Bitcoin</span>
            <span>Ripple</span>
            <span>Ethereum</span>
          </div>
        </CardContent>
      </Card>

      {/* Currency List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Currency</h3>
          <div className="grid grid-cols-2 gap-8 text-sm font-medium text-gray-600">
            <span>Real Price</span>
            <span>Rise Fall</span>
          </div>
        </div>
        
        {cryptoData.map((crypto) => (
          <Card 
            key={crypto.symbol}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectCurrency(crypto.symbol)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                    ${crypto.color === 'orange' ? 'bg-orange-500' :
                      crypto.color === 'blue' ? 'bg-blue-500' :
                      crypto.color === 'yellow' ? 'bg-yellow-500' :
                      crypto.color === 'red' ? 'bg-red-500' :
                      'bg-gray-500'}`}>
                    {crypto.icon}
                  </div>
                  <div>
                    <div className="font-medium">{crypto.symbol}</div>
                    <div className="text-sm text-gray-600">{crypto.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{crypto.price}</div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={crypto.isPositive ? "default" : "destructive"}
                    className={crypto.isPositive ? "bg-green-500" : "bg-red-500"}
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
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
      price: cryptoPrices?.["CHZ/USD"]?.price || "0.03457",
      change: cryptoPrices?.["CHZ/USD"]?.change || "-2.59%",
      isPositive: cryptoPrices?.["CHZ/USD"]?.change ? !cryptoPrices["CHZ/USD"].change.startsWith('-') : false,
      icon: "⚽",
      color: "red"
    },
    {
      symbol: "BCH/USDT",
      name: "Bitcoin Cash",
      price: cryptoPrices?.["BCH/USD"]?.price || "502.8",
      change: cryptoPrices?.["BCH/USD"]?.change || "+0.50%",
      isPositive: cryptoPrices?.["BCH/USD"]?.change ? !cryptoPrices["BCH/USD"].change.startsWith('-') : true,
      icon: "₿",
      color: "green"
    },
    {
      symbol: "PSG/USDT",
      name: "Paris Saint-Germain",
      price: cryptoPrices?.["PSG/USD"]?.price || "1.417",
      change: cryptoPrices?.["PSG/USD"]?.change || "-2.01%",
      isPositive: cryptoPrices?.["PSG/USD"]?.change ? !cryptoPrices["PSG/USD"].change.startsWith('-') : false,
      icon: "⚽",
      color: "blue"
    },
    {
      symbol: "JUV/USDT",
      name: "Juventus",
      price: cryptoPrices?.["JUV/USD"]?.price || "0.901",
      change: cryptoPrices?.["JUV/USD"]?.change || "-1.42%",
      isPositive: cryptoPrices?.["JUV/USD"]?.change ? !cryptoPrices["JUV/USD"].change.startsWith('-') : false,
      icon: "⚽",
      color: "black"
    },
    {
      symbol: "ATM/USDT",
      name: "Atletico Madrid",
      price: cryptoPrices?.["ATM/USD"]?.price || "0.999",
      change: cryptoPrices?.["ATM/USD"]?.change || "-1.87%",
      isPositive: cryptoPrices?.["ATM/USD"]?.change ? !cryptoPrices["ATM/USD"].change.startsWith('-') : false,
      icon: "⚽",
      color: "red"
    },
    {
      symbol: "EOS/USDT",
      name: "EOS",
      price: cryptoPrices?.["EOS/USD"]?.price || "0.75",
      change: cryptoPrices?.["EOS/USD"]?.change || "0.00%",
      isPositive: cryptoPrices?.["EOS/USD"]?.change ? !cryptoPrices["EOS/USD"].change.startsWith('-') : true,
      icon: "◉",
      color: "gray"
    },
    {
      symbol: "TRX/USDT",
      name: "TRON",
      price: cryptoPrices?.["TRX/USD"]?.price || "0.2712",
      change: cryptoPrices?.["TRX/USD"]?.change || "+0.15%",
      isPositive: cryptoPrices?.["TRX/USD"]?.change ? !cryptoPrices["TRX/USD"].change.startsWith('-') : true,
      icon: "⬢",
      color: "green"
    },
    {
      symbol: "ETC/USDT",
      name: "Ethereum Classic",
      price: cryptoPrices?.["ETC/USD"]?.price || "16.19",
      change: cryptoPrices?.["ETC/USD"]?.change || "-2.00%",
      isPositive: cryptoPrices?.["ETC/USD"]?.change ? !cryptoPrices["ETC/USD"].change.startsWith('-') : false,
      icon: "⧫",
      color: "green"
    },
    {
      symbol: "BTS/USDT",
      name: "BitShares",
      price: cryptoPrices?.["BTS/USD"]?.price || "0.0045",
      change: cryptoPrices?.["BTS/USD"]?.change || "+0.50%",
      isPositive: cryptoPrices?.["BTS/USD"]?.change ? !cryptoPrices["BTS/USD"].change.startsWith('-') : true,
      icon: "◆",
      color: "blue"
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

      {/* Crypto Slider */}
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${cryptoSlideIndex * (100 / 4)}%)` }}
          >
            {/* Create duplicated array for seamless infinite loop */}
            {[...cryptoData, ...cryptoData].map((crypto, index) => (
              <div key={index} className="flex-shrink-0" style={{ width: '25%' }}>
                <div className="px-1.5">
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow border-green-200"
                    onClick={() => onSelectCurrency(crypto.symbol.split('/')[0])}
                  >
                    <CardContent className="p-3">
                      <div className="text-center space-y-2">
                        <div>
                          <p className="font-semibold text-sm text-center">{crypto.symbol}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-center">${crypto.price}</p>
                          <div className="flex items-center justify-center space-x-1">
                            {crypto.isPositive ? (
                              <TrendingUp className="w-3 h-3 text-green-500" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-500" />
                            )}
                            <span className={`text-xs ${crypto.isPositive ? 'text-green-500' : 'text-red-500'}`}>
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

      {/* Investment Banner */}
      <div className="relative">
        <div 
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden"
          style={{
            backgroundImage: `url('/trading-chart-bg.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 rounded-xl"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">SuperCoin Investment</h2>
              <p className="text-blue-100 max-w-md">
                Start your crypto journey with professional trading tools and real-time market data
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-100">Live Market Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-yellow-100">24/7 Trading</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-10 h-10 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Currency List */}
      <div className="space-y-3">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 py-3 px-4 bg-gray-50 rounded-lg border">
          <div className="text-sm font-semibold text-gray-700">Currency</div>
          <div className="text-sm font-semibold text-gray-700 text-center">Real Price</div>
          <div className="text-sm font-semibold text-gray-700 text-center">Rise Fall</div>
        </div>
        
        {cryptoData.map((crypto) => (
          <Card 
            key={crypto.symbol}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectCurrency(crypto.symbol)}
          >
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                {/* Currency Column */}
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
                
                {/* Real Price Column */}
                <div className="text-center">
                  <div className="font-medium">${crypto.price}</div>
                </div>
                
                {/* Rise Fall Column */}
                <div className="text-center">
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
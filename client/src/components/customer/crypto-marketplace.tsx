import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, CreditCard, UserCheck, Headphones } from "lucide-react";
import { useCryptoPrices } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface CryptoMarketplaceProps {
  onSelectCurrency: (currency: string) => void;
}

export function CryptoMarketplace({ onSelectCurrency }: CryptoMarketplaceProps) {
  const { data: cryptoPrices } = useCryptoPrices();
  const { user } = useAuth();

  // Real crypto data with proper icons and names from the image
  const cryptoData = [
    {
      symbol: "BTC/USDT",
      name: "Bitcoin",
      icon: "₿",
      price: cryptoPrices?.["BTC/USDT"]?.price || "115112.9065",
      change: cryptoPrices?.["BTC/USDT"]?.change || "-2.65",
      color: "#F7931A"
    },
    {
      symbol: "ETH/USDT", 
      name: "Ethereum",
      icon: "Ξ",
      price: cryptoPrices?.["ETH/USDT"]?.price || "4239.2141",
      change: cryptoPrices?.["ETH/USDT"]?.change || "-7.08",
      color: "#627EEA"
    },
    {
      symbol: "DOGE/USDT",
      name: "Dogecoin", 
      icon: "Ð",
      price: cryptoPrices?.["DOGE/USDT"]?.price || "0.2223",
      change: cryptoPrices?.["DOGE/USDT"]?.change || "-7.96",
      color: "#C2A633"
    },
    {
      symbol: "CHZ/USDT",
      name: "Chiliz",
      icon: "🌶️",
      price: cryptoPrices?.["CHZ/USDT"]?.price || "0.0397",
      change: cryptoPrices?.["CHZ/USDT"]?.change || "-6.39",
      color: "#CD212A"
    },
    {
      symbol: "PSG/USDT",
      name: "Paris Saint-Germain",
      icon: "⚽",
      price: cryptoPrices?.["PSG/USDT"]?.price || "1.8354",
      change: cryptoPrices?.["PSG/USDT"]?.change || "-2.87",
      color: "#004170"
    },
    {
      symbol: "ATM/USDT",
      name: "Atletico Madrid",
      icon: "⚽",
      price: cryptoPrices?.["ATM/USDT"]?.price || "1.4263",
      change: cryptoPrices?.["ATM/USDT"]?.change || "-5.63",
      color: "#CE3524"
    },
    {
      symbol: "JUV/USDT",
      name: "Juventus",
      icon: "⚽",
      price: cryptoPrices?.["JUV/USDT"]?.price || "1.3628",
      change: cryptoPrices?.["JUV/USDT"]?.change || "-4.91",
      color: "#000000"
    },
    {
      symbol: "KSM/USDT",
      name: "Kusama",
      icon: "🔗",
      price: cryptoPrices?.["KSM/USDT"]?.price || "14.6653",
      change: cryptoPrices?.["KSM/USDT"]?.change || "-7.50",
      color: "#000000"
    },
    {
      symbol: "LTC/USDT",
      name: "Litecoin",
      icon: "Ł",
      price: cryptoPrices?.["LTC/USDT"]?.price || "116.4456",
      change: cryptoPrices?.["LTC/USDT"]?.change || "-4.81",
      color: "#345D9D"
    },
    {
      symbol: "EOS/USDT",
      name: "EOS",
      icon: "📡",
      price: cryptoPrices?.["EOS/USDT"]?.price || "0.7240",
      change: cryptoPrices?.["EOS/USDT"]?.change || "-1.23",
      color: "#443F54"
    },
    {
      symbol: "BTS/USDT",
      name: "BitShares",
      icon: "💎",
      price: cryptoPrices?.["BTS/USDT"]?.price || "10.2999",
      change: cryptoPrices?.["BTS/USDT"]?.change || "-9.28",
      color: "#35BAFF"
    },
    {
      symbol: "LINK/USDT",
      name: "Chainlink",
      icon: "🔗",
      price: cryptoPrices?.["LINK/USDT"]?.price || "24.4868",
      change: cryptoPrices?.["LINK/USDT"]?.change || "-6.86",
      color: "#375BD2"
    }
  ];

  // Top 3 cryptocurrencies for header display
  const topCryptos = cryptoData.slice(0, 3);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (numPrice < 1) {
      return numPrice.toFixed(4);
    } else if (numPrice < 100) {
      return numPrice.toFixed(2);
    } else {
      return numPrice.toFixed(0);
    }
  };

  const formatChange = (change: string | number) => {
    const numChange = typeof change === 'string' ? parseFloat(change) : change;
    return numChange > 0 ? `+${numChange.toFixed(2)}%` : `${numChange.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top crypto prices header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between space-x-4">
          {topCryptos.map((crypto) => (
            <div key={crypto.symbol} className="text-center flex-1">
              <div className="text-xs font-medium text-gray-900">{crypto.symbol}</div>
              <div className="text-sm font-bold text-red-600">{formatPrice(crypto.price)}</div>
              <div className="text-xs text-red-600">{formatChange(crypto.change)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="bg-white px-4 py-6 border-b border-gray-200">
        <div className="flex justify-between space-x-4">
          <Link href="/recharge" className="flex-1">
            <Button variant="ghost" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
              <RotateCcw className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-600">Recharge</span>
            </Button>
          </Link>
          
          <Link href="/withdrawal" className="flex-1">
            <Button variant="ghost" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
              <CreditCard className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-600">Withdrawal</span>
            </Button>
          </Link>
          
          <Link href="/customer-service" className="flex-1">
            <Button variant="ghost" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
              <Headphones className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-600">Customer Service</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Crypto list */}
      <div className="bg-white">
        {cryptoData.map((crypto, index) => (
          <div
            key={crypto.symbol}
            onClick={() => onSelectCurrency(crypto.symbol)}
            className="flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: crypto.color }}
              >
                {crypto.icon}
              </div>
              <div className="text-sm font-medium text-gray-900">{crypto.symbol}</div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-red-600">{formatPrice(crypto.price)}</div>
              <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                {formatChange(crypto.change)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Button variant="ghost" className="flex-1 flex flex-col items-center py-3">
            <span className="text-xs text-blue-600 font-medium">Home</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col items-center py-3">
            <span className="text-xs text-gray-600">Order</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col items-center py-3">
            <span className="text-xs text-gray-600">Market</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col items-center py-3">
            <span className="text-xs text-gray-600">Asset</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col items-center py-3">
            <span className="text-xs text-gray-600">My</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
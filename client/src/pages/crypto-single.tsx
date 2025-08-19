import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { useCryptoPrices } from "@/lib/api";

// Crypto data matching the home page
const cryptoData: { [key: string]: any } = {
  "BTC": {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    icon: "₿",
    color: "#F7931A",
  },
  "ETH": {
    symbol: "ETH/USDT", 
    name: "Ethereum",
    icon: "Ξ",
    color: "#627EEA",
  },
  "DOGE": {
    symbol: "DOGE/USDT",
    name: "Dogecoin", 
    icon: "Ð",
    color: "#C2A633",
  },
  "CHZ": {
    symbol: "CHZ/USDT",
    name: "Chiliz",
    icon: "🌶️",
    color: "#CD212A",
  },
  "PSG": {
    symbol: "PSG/USDT",
    name: "Paris Saint-Germain",
    icon: "⚽",
    color: "#004170",
  },
  "ATM": {
    symbol: "ATM/USDT",
    name: "Atletico Madrid",
    icon: "⚽", 
    color: "#CE3524",
  },
  "JUV": {
    symbol: "JUV/USDT",
    name: "Juventus",
    icon: "⚽",
    color: "#000000",
  },
  "KSM": {
    symbol: "KSM/USDT",
    name: "Kusama",
    icon: "🔗",
    color: "#000000",
  },
  "LTC": {
    symbol: "LTC/USDT",
    name: "Litecoin",
    icon: "Ł",
    color: "#345D9D",
  },
  "EOS": {
    symbol: "EOS/USDT",
    name: "EOS",
    icon: "📡",
    color: "#443F54",
  },
  "BTS": {
    symbol: "BTS/USDT",
    name: "BitShares",
    icon: "💎",
    color: "#35BAFF",
  },
  "LINK": {
    symbol: "LINK/USDT",
    name: "Chainlink",
    icon: "🔗",
    color: "#375BD2",
  },
};

export function CryptoSingle() {
  const [match, params] = useRoute("/crypto/:cryptoId");
  const cryptoId = params?.cryptoId?.toUpperCase() || null;
  const { data: cryptoPrices } = useCryptoPrices();
  
  const crypto = cryptoId ? cryptoData[cryptoId] : null;
  
  if (!crypto) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Cryptocurrency Not Found</h1>
          <Link href="/">
            <Button className="bg-blue-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get real-time price data
  const getCryptoPrice = () =>
    (cryptoPrices as any)?.[crypto.symbol]?.price || "0.00";
  const getCryptoChange = () =>
    (cryptoPrices as any)?.[crypto.symbol]?.change || "0.00";

  const price = getCryptoPrice();
  const change = getCryptoChange();
  const isPositive = parseFloat(change) >= 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">{crypto.name}</h1>
          <div></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Price Card */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: crypto.color }}
                >
                  {crypto.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{crypto.name}</h2>
                  <p className="text-gray-500">{crypto.symbol}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">{price}</div>
                <div className={`flex items-center text-lg font-medium ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {change}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart Placeholder */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Chart</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Price chart visualization</p>
                <p className="text-sm">Real-time data: {crypto.symbol}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{price}</div>
              <div className="text-sm text-gray-500">Current Price</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {change}%
              </div>
              <div className="text-sm text-gray-500">24h Change</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">
                {crypto.symbol}
              </div>
              <div className="text-sm text-gray-500">Trading Pair</div>
            </CardContent>
          </Card>
        </div>

        {/* Trading Info */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">About {crypto.name}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Symbol</span>
                <span className="font-medium">{crypto.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Price</span>
                <span className="font-medium">{price} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">24h Change</span>
                <span className={`font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {change}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call-to-action for trading */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Start Trading {crypto.name}</h3>
            <p className="mb-4 opacity-90">Join thousands of traders and start your journey</p>
            <Link href="/login">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Login to Trade
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
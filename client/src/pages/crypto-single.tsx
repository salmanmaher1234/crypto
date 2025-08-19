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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header - Market Tab Style */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="text-center">
            <div 
              className="w-8 h-8 rounded-full inline-flex items-center justify-center text-white text-sm font-bold mr-2"
              style={{ backgroundColor: crypto.color }}
            >
              {crypto.icon}
            </div>
            <span className="text-lg font-bold">{crypto.name}</span>
          </div>
          <div></div>
        </div>
      </div>

      {/* Price Display - Market Tab Style */}
      <div className="bg-gray-900 px-4 py-4 border-b border-gray-800">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">{price}</div>
          <div className={`text-lg font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? '+' : ''}{change}%
          </div>
          <div className="text-sm text-gray-400 mt-1">{crypto.symbol}</div>
        </div>
      </div>

      {/* Chart Section - Market Tab Style */}
      <div className="bg-gray-900 px-4 py-6 border-b border-gray-800">
        <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📈</div>
            <p className="text-gray-400">Price Chart</p>
            <p className="text-sm text-gray-500">Coming Soon</p>
          </div>
        </div>
      </div>

      {/* Trading Actions - Market Tab Style */}
      <div className="bg-gray-900 px-4 py-4 border-b border-gray-800">
        <div className="grid grid-cols-2 gap-4">
          <Link href={`/?tab=market&coin=${crypto.symbol.split('/')[0].toLowerCase()}`}>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-bold rounded-lg">
              <TrendingUp className="w-5 h-5 mr-2" />
              Buy Up
            </Button>
          </Link>
          <Link href={`/?tab=market&coin=${crypto.symbol.split('/')[0].toLowerCase()}`}>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-bold rounded-lg">
              <TrendingDown className="w-5 h-5 mr-2" />
              Buy Down
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section - Market Tab Style */}
      <div className="bg-gray-900 px-4 py-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Current Price</p>
            <p className="text-white text-lg font-bold">{price}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">24h Change</p>
            <p className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{change}%
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Trading Pair</p>
            <p className="text-white text-lg font-bold">{crypto.symbol}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Status</p>
            <p className="text-green-400 text-lg font-bold">Active</p>
          </div>
        </div>

        {/* Call to Action - Market Tab Style */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold text-white mb-2">Start Trading {crypto.name}</h2>
          <p className="text-blue-100 mb-4">Login to access live trading features</p>
          <Link href="/login">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg">
              Login to Trade
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
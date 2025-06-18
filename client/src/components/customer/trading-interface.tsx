import { useState } from "react";
import { useCreateBettingOrder } from "@/lib/api";
import { useCryptoPrices } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const durations = [30, 60, 120, 180, 240];

export function TradingInterface() {
  const [selectedAsset, setSelectedAsset] = useState("BTC/USD");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(60);
  const { data: prices } = useCryptoPrices();
  const createOrder = useCreateBettingOrder();
  const { toast } = useToast();

  const handleTrade = (direction: "Buy Up" | "Buy Down") => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid trading amount",
        variant: "destructive",
      });
      return;
    }

    const entryPrice = prices?.[selectedAsset]?.price || "0";
    
    createOrder.mutate({
      asset: selectedAsset,
      amount,
      direction,
      duration,
      entryPrice,
    }, {
      onSuccess: () => {
        toast({
          title: "Order placed",
          description: `${direction} order for ${selectedAsset} placed successfully`,
        });
        setAmount("");
      },
      onError: () => {
        toast({
          title: "Order failed",
          description: "Failed to place order. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const assets = prices ? Object.keys(prices) : ["BTC/USD", "ETH/USD"];

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Quick Trade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Asset Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset</label>
            <div className="grid grid-cols-2 gap-2">
              {assets.map((asset) => {
                const priceData = prices?.[asset];
                const isSelected = selectedAsset === asset;
                return (
                  <button
                    key={asset}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      isSelected
                        ? "border-primary bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{asset}</div>
                    <div className={`text-sm ${
                      priceData?.changeType === "positive" ? "text-success" : "text-destructive"
                    }`}>
                      ${priceData?.price || "0"}
                    </div>
                    <div className={`text-xs ${
                      priceData?.changeType === "positive" ? "text-success" : "text-destructive"
                    }`}>
                      {priceData?.change || "0%"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
            />
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trading Duration</label>
            <div className="grid grid-cols-5 gap-2">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-2 px-3 text-sm rounded-lg border-2 transition-colors ${
                    duration === d
                      ? "border-primary bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* Direction Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleTrade("Buy Up")}
              disabled={createOrder.isPending}
              className="bg-success hover:bg-success/90 text-success-foreground h-16 flex flex-col"
            >
              <TrendingUp className="w-5 h-5 mb-1" />
              <div className="font-medium">Buy Up</div>
              <div className="text-xs opacity-90">Price will rise</div>
            </Button>
            <Button
              onClick={() => handleTrade("Buy Down")}
              disabled={createOrder.isPending}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-16 flex flex-col"
            >
              <TrendingDown className="w-5 h-5 mb-1" />
              <div className="font-medium">Buy Down</div>
              <div className="text-xs opacity-90">Price will fall</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

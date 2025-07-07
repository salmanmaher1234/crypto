import { useState } from "react";
import { useCreateBettingOrder } from "@/lib/api";
import { useCryptoPrices } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const durations = [30, 60, 120, 180, 240];

// Commission rates based on duration
const getCommissionRate = (duration: number): number => {
  switch (duration) {
    case 30: return 20; // 20%
    case 60: return 30; // 30%
    case 120: return 40; // 40%
    case 180: return 50; // 50%
    case 240: return 60; // 60%
    default: return 20; // Default to 20%
  }
};

export function TradingInterface() {
  const [selectedAsset, setSelectedAsset] = useState("BTC/USD");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(60);
  const [validationError, setValidationError] = useState("");
  const { data: prices } = useCryptoPrices();
  const createOrder = useCreateBettingOrder();
  const { toast } = useToast();

  // Calculate commission amount
  const commissionRate = getCommissionRate(duration);
  const commissionAmount = amount ? (parseFloat(amount) * commissionRate / 100) : 0;

  const handleTrade = (direction: "Buy Up" | "Buy Down") => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid trading amount",
        variant: "destructive",
      });
      return;
    }

    // Minimum order validation
    if (parseFloat(amount) < 1000) {
      setValidationError("Amount cannot be less than 1000");
      return;
    }
    
    // Clear validation error if amount is valid
    setValidationError("");

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
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl lg:text-2xl">Quick Trade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Asset Selection */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Select Asset</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {assets.map((asset) => {
                const priceData = prices?.[asset];
                const isSelected = selectedAsset === asset;
                return (
                  <button
                    key={asset}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-colors ${
                      isSelected
                        ? "border-primary bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm sm:text-base">{asset}</div>
                    <div className={`text-sm sm:text-base ${
                      priceData?.changeType === "positive" ? "text-success" : "text-destructive"
                    }`}>
                      ${priceData?.price || "0"}
                    </div>
                    <div className={`text-xs sm:text-sm ${
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
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Investment Amount</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setValidationError(""); // Clear error when user types
              }}
              step="0.01"
              className="text-sm sm:text-base"
            />
            {validationError && (
              <p className="text-red-500 text-sm mt-1">{validationError}</p>
            )}
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Trading Duration</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-lg border-2 transition-colors ${
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

          {/* Commission Information */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Commission Details</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Investment Amount:</span>
                  <span className="font-medium">{parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commission Rate ({duration}s):</span>
                  <span className="font-medium text-green-600">{commissionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commission Amount:</span>
                  <span className="font-medium text-green-600">+{commissionAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-blue-300 pt-2 flex justify-between font-medium">
                  <span className="text-gray-700">Net Amount (Investment - Commission):</span>
                  <span className="text-blue-600">{(parseFloat(amount) - commissionAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Direction Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Button
              onClick={() => handleTrade("Buy Up")}
              disabled={createOrder.isPending}
              className="bg-success hover:bg-success/90 text-success-foreground h-16 sm:h-20 flex flex-col"
            >
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
              <div className="font-medium text-sm sm:text-base">Buy Up</div>
              <div className="text-xs sm:text-sm opacity-90">Price will rise</div>
            </Button>
            <Button
              onClick={() => handleTrade("Buy Down")}
              disabled={createOrder.isPending}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-16 sm:h-20 flex flex-col"
            >
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
              <div className="font-medium text-sm sm:text-base">Buy Down</div>
              <div className="text-xs sm:text-sm opacity-90">Price will fall</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

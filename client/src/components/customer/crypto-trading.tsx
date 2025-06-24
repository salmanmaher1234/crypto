import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCreateBettingOrder } from "@/lib/api";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Clock } from "lucide-react";

interface CryptoTradingProps {
  currency: string;
  onBack: () => void;
}

export function CryptoTrading({ currency, onBack }: CryptoTradingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const createBettingOrder = useCreateBettingOrder();
  
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderType, setOrderType] = useState<"up" | "down">("up");
  const [selectedPeriod, setSelectedPeriod] = useState("60s");
  const [orderAmount, setOrderAmount] = useState("");

  const cryptoData: { [key: string]: any } = {
    "BTC/USDT": {
      name: "Bitcoin",
      price: "105445.42",
      change: "+470.19 +0.45%",
      isPositive: true,
      highestPrice: "105900",
      lowestPrice: "104689.81",
      volume24h: "773548A2C",
      volumeBTC: "7335",
      transactions: "1158259"
    },
    "ETH/USDT": {
      name: "Ethereum", 
      price: "2513.72",
      change: "+20.15 +0.80%",
      isPositive: true,
      highestPrice: "2580",
      lowestPrice: "2489.33",
      volume24h: "445782B1D",
      volumeBTC: "4521",
      transactions: "892456"
    },
    "DOGE/USDT": {
      name: "Dogecoin",
      price: "0.18371", 
      change: "-0.0023 -1.26%",
      isPositive: false,
      highestPrice: "0.19200",
      lowestPrice: "0.18100",
      volume24h: "156892C3E",
      volumeBTC: "1205",
      transactions: "445123"
    }
  };

  const currentCrypto = cryptoData[currency] || cryptoData["BTC/USDT"];

  const periods = [
    { label: "30s", value: "30s", payout: "20%" },
    { label: "60s", value: "60s", payout: "40%" },
    { label: "120s", value: "120s", payout: "40%" },
    { label: "180s", value: "180s", payout: "50%" },
    { label: "240s", value: "240s", payout: "60%" }
  ];

  const handleBuyOrder = (type: "up" | "down") => {
    setOrderType(type);
    setShowOrderDialog(true);
  };

  const handleSubmitOrder = () => {
    if (!user || !orderAmount || parseFloat(orderAmount) <= 0) {
      toast({
        title: "Invalid order",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const availableBalance = parseFloat(user.availableBalance || user.balance || "0");
    const amount = parseFloat(orderAmount);

    if (amount > availableBalance) {
      toast({
        title: "Insufficient balance",
        description: "Amount exceeds available balance",
        variant: "destructive",
      });
      return;
    }

    createBettingOrder.mutate({
      userId: user.id,
      currency: currency,
      orderType: orderType,
      amount: orderAmount,
      duration: selectedPeriod,
      entryPrice: currentCrypto.price,
    }, {
      onSuccess: () => {
        toast({
          title: "Order submitted",
          description: `${orderType.toUpperCase()} order for ${currency} submitted successfully`,
        });
        setShowOrderDialog(false);
        setOrderAmount("");
        onBack(); // Return to home after successful order
      },
      onError: () => {
        toast({
          title: "Order failed",
          description: "Failed to submit order. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold">{currency}</h1>
        <div></div>
      </div>

      {/* Price Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Latest Price</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {currentCrypto.price}
              </div>
              <div className="text-sm">
                <span className="text-gray-600">24H Rise Fall</span>
                <div className={`font-medium ${currentCrypto.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {currentCrypto.change}
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">24H Highest Price</span>
                <span className="font-medium">{currentCrypto.highestPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">24H Lowest Price</span>
                <span className="font-medium">{currentCrypto.lowestPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">24H Volume(USDT)</span>
                <span className="font-medium">{currentCrypto.volume24h}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">24H Volume(BTC)</span>
                <span className="font-medium">{currentCrypto.volumeBTC}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">24H Transactions</span>
                <span className="font-medium">{currentCrypto.transactions}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2 text-sm">
              <Button variant="outline" size="sm">1m</Button>
              <Button variant="outline" size="sm">30m</Button>
              <Button variant="outline" size="sm">1h</Button>
              <Button variant="outline" size="sm">D</Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">📈</Button>
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent"></div>
            <div className="text-center">
              <div className="text-lg font-medium mb-2">BINANCE:{currency}</div>
              <div className="text-sm text-gray-600">Trading Chart View</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          className="h-16 bg-green-500 hover:bg-green-600 text-white text-lg font-medium"
          onClick={() => handleBuyOrder("up")}
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Buy Up
        </Button>
        <Button 
          className="h-16 bg-red-500 hover:bg-red-600 text-white text-lg font-medium"
          onClick={() => handleBuyOrder("down")}
        >
          <TrendingDown className="w-5 h-5 mr-2" />
          Buy Down
        </Button>
      </div>

      {/* Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm">
              <span className="text-gray-600">Real available balance: </span>
              <span className="font-medium">
                {parseFloat(user?.availableBalance || user?.balance || "0").toFixed(0)}
              </span>
            </div>

            {/* Period Selection */}
            <div>
              <h4 className="text-sm font-medium mb-3">Select order period</h4>
              <div className="grid grid-cols-5 gap-2">
                {periods.map((period) => (
                  <Button
                    key={period.value}
                    variant={selectedPeriod === period.value ? "default" : "outline"}
                    size="sm"
                    className={`h-12 flex-col text-xs ${
                      selectedPeriod === period.value 
                        ? period.value === "60s" 
                          ? "bg-green-500 hover:bg-green-600" 
                          : "bg-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedPeriod(period.value)}
                  >
                    <div>{period.label}</div>
                    <div className={
                      period.value === "120s" || period.value === "180s" 
                        ? "text-red-500" 
                        : period.value === "240s"
                        ? "text-gray-600"
                        : ""
                    }>
                      {period.payout}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <h4 className="text-sm font-medium mb-2">Enter order amount</h4>
              <Input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-center"
              />
            </div>

            {/* Order Summary */}
            <div className="bg-orange-100 p-3 rounded-lg">
              <div className="grid grid-cols-3 gap-2 text-xs font-medium text-center">
                <div>
                  <div className="text-gray-600">Currency</div>
                  <div>{currency.split('/')[0]}</div>
                </div>
                <div>
                  <div className="text-gray-600">Price</div>
                  <div>{currentCrypto.price}</div>
                </div>
                <div>
                  <div className="text-gray-600">Amount</div>
                  <div>{orderAmount || "0"}</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className={`w-full h-12 text-white font-medium ${
                orderType === "up" 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={handleSubmitOrder}
              disabled={createBettingOrder.isPending || !orderAmount}
            >
              {createBettingOrder.isPending 
                ? "Submitting..." 
                : `Submit Order (${orderType.toUpperCase()})`
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export function BalanceCard() {
  const { user } = useAuth();

  const balance = parseFloat(user?.balance || "0");
  const availableBalance = parseFloat(user?.availableBalance || "0");
  const tradingBalance = balance - availableBalance;

  return (
    <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
      <div className="text-center">
        <div className="text-sm opacity-90 mb-1">Total Balance</div>
        <div className="text-3xl font-bold mb-4">${balance.toFixed(2)}</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-xs opacity-90">Available</div>
            <div className="text-lg font-semibold">${availableBalance.toFixed(2)}</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-xs opacity-90">In Trading</div>
            <div className="text-lg font-semibold">${tradingBalance.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useTransactions } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Minus, TrendingUp, TrendingDown } from "lucide-react";

export function TransactionHistory() {
  const { data: transactions, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Skeleton className="w-8 h-8 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <Plus className="w-4 h-4 text-success" />;
      case "withdrawal":
        return <Minus className="w-4 h-4 text-destructive" />;
      case "trade_win":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "trade_loss":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return "Deposit";
      case "withdrawal":
        return "Withdrawal";
      case "trade_win":
        return "Trade Win";
      case "trade_loss":
        return "Trade Loss";
      case "freeze":
        return "Funds Frozen";
      case "unfreeze":
        return "Funds Unfrozen";
      default:
        return "Transaction";
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "trade_win":
      case "unfreeze":
        return "text-success";
      case "withdrawal":
      case "trade_loss":
      case "freeze":
        return "text-destructive";
      default:
        return "text-gray-900";
    }
  };

  const getAmountPrefix = (type: string) => {
    switch (type) {
      case "deposit":
      case "trade_win":
      case "unfreeze":
        return "+";
      case "withdrawal":
      case "trade_loss":
      case "freeze":
        return "-";
      default:
        return "";
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {!transactions || transactions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {getTransactionLabel(transaction.type)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className={`font-medium ${getAmountColor(transaction.type)}`}>
                    {getAmountPrefix(transaction.type)}${parseFloat(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

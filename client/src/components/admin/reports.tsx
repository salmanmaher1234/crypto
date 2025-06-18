import { useTransactions } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp, Users, BarChart3 } from "lucide-react";

export function Reports() {
  const { data: transactions, isLoading } = useTransactions();

  // Calculate statistics
  const stats = transactions ? {
    totalDeposits: transactions
      .filter(t => t.type === "deposit" && t.status === "completed")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    totalWithdrawals: transactions
      .filter(t => t.type === "withdrawal" && t.status === "completed")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    activeCustomers: new Set(transactions.map(t => t.userId)).size,
    platformProfit: transactions
      .filter(t => t.type === "trade_loss")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0) * 0.1, // 10% commission on losses
  } : { totalDeposits: 0, totalWithdrawals: 0, activeCustomers: 0, platformProfit: 0 };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deposits</p>
                <p className="text-2xl font-bold text-success">${stats.totalDeposits.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingDown className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
                <p className="text-2xl font-bold text-destructive">${stats.totalWithdrawals.toFixed(2)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <TrendingUp className="w-5 h-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-primary">{stats.activeCustomers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Profit</p>
                <p className="text-2xl font-bold text-accent">${stats.platformProfit.toFixed(2)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {!transactions || transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No transactions found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 10).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()} {new Date(transaction.createdAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      Customer #{transaction.userId}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          transaction.type === "deposit" ? "default" :
                          transaction.type === "withdrawal" ? "destructive" :
                          transaction.type === "trade_win" ? "default" :
                          "secondary"
                        }
                      >
                        {transaction.type.replace("_", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>${parseFloat(transaction.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          transaction.status === "completed" ? "default" :
                          transaction.status === "pending" ? "secondary" :
                          "destructive"
                        }
                      >
                        {transaction.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

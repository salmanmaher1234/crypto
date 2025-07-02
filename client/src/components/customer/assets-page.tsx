import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTransactions, useWithdrawalRequests } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Wallet, 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  CreditCard,
  History
} from "lucide-react";

export function AssetsPage() {
  const { user } = useAuth();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const { data: withdrawalRequests, isLoading: withdrawalsLoading } = useWithdrawalRequests();
  
  const [activeTab, setActiveTab] = useState("overview");

  // Balance overview
  const totalBalance = parseFloat(user?.balance || "0");
  const availableBalance = parseFloat(user?.availableBalance || "0");
  const frozenBalance = parseFloat(user?.frozenBalance || "0");

  // Filter transactions by type
  const deposits = transactions?.filter(t => t.type === "deposit") || [];
  const withdrawals = transactions?.filter(t => t.type === "withdrawal") || [];
  const tradeWins = transactions?.filter(t => t.type === "trade_win") || [];
  const tradeLosses = transactions?.filter(t => t.type === "trade_loss") || [];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle className="w-4 h-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUpCircle className="w-4 h-4 text-red-500" />;
      case "trade_win":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "trade_loss":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Rejected</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Approved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (transactionsLoading || withdrawalsLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
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

  return (
    <div className="p-4 space-y-6">
      {/* Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wallet className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">${availableBalance.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Frozen</p>
                <p className="text-2xl font-bold text-orange-600">${frozenBalance.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            Assets & Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deposits">Recharges</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdraws</TabsTrigger>
              <TabsTrigger value="trading">Trading</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <ArrowDownCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Deposits</p>
                  <p className="text-lg font-bold">{deposits.length}</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <ArrowUpCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Withdrawals</p>
                  <p className="text-lg font-bold">{withdrawals.length}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Winning Trades</p>
                  <p className="text-lg font-bold">{tradeWins.length}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <TrendingDown className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Losing Trades</p>
                  <p className="text-lg font-bold">{tradeLosses.length}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Recent Activity</h3>
                {transactions && transactions.length > 0 ? (
                  <div className="space-y-2">
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          {getTransactionIcon(transaction.type)}
                          <div className="ml-3">
                            <p className="font-medium capitalize">{transaction.type.replace('_', ' ')}</p>
                            <p className="text-sm text-gray-500">{transaction.description}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${
                            transaction.type === 'deposit' || transaction.type === 'trade_win' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {transaction.type === 'deposit' || transaction.type === 'trade_win' ? '+' : '-'}
                            ${parseFloat(transaction.amount).toFixed(2)}
                          </p>
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No transaction history</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="deposits" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Recharge History</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Recharge
                </Button>
              </div>
              {deposits.length > 0 ? (
                <div className="space-y-2">
                  {deposits.map((deposit) => (
                    <div key={deposit.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <ArrowDownCircle className="w-5 h-5 text-green-500" />
                        <div className="ml-3">
                          <p className="font-medium">Deposit</p>
                          <p className="text-sm text-gray-500">{deposit.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(deposit.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">+${parseFloat(deposit.amount).toFixed(2)}</p>
                        {getStatusBadge(deposit.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Plus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No recharge history</p>
                  <p className="text-sm text-gray-500">Your deposit transactions will appear here</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="withdrawals" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Withdrawal History</h3>
                <Button size="sm">
                  <Minus className="w-4 h-4 mr-2" />
                  New Withdrawal
                </Button>
              </div>
              {withdrawals.length > 0 ? (
                <div className="space-y-2">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center">
                        <ArrowUpCircle className="w-5 h-5 text-red-500" />
                        <div className="ml-3">
                          <p className="font-medium">Withdrawal</p>
                          <p className="text-sm text-gray-500">{withdrawal.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">-${parseFloat(withdrawal.amount).toFixed(2)}</p>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Minus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No withdrawal history</p>
                  <p className="text-sm text-gray-500">Your withdrawal transactions will appear here</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trading" className="space-y-4">
              <h3 className="font-medium">Trading History</h3>
              {[...tradeWins, ...tradeLosses].length > 0 ? (
                <div className="space-y-2">
                  {[...tradeWins, ...tradeLosses]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((trade) => (
                    <div key={trade.id} className={`flex items-center justify-between p-3 rounded-lg ${
                      trade.type === 'trade_win' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <div className="flex items-center">
                        {trade.type === 'trade_win' ? 
                          <TrendingUp className="w-5 h-5 text-green-500" /> :
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        }
                        <div className="ml-3">
                          <p className="font-medium">{trade.type === 'trade_win' ? 'Trade Win' : 'Trade Loss'}</p>
                          <p className="text-sm text-gray-500">{trade.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(trade.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${trade.type === 'trade_win' ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.type === 'trade_win' ? '+' : '-'}${parseFloat(trade.amount).toFixed(2)}
                        </p>
                        {getStatusBadge(trade.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No trading history</p>
                  <p className="text-sm text-gray-500">Your trading profits and losses will appear here</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="requests" className="space-y-4">
              <h3 className="font-medium">Withdrawal Requests</h3>
              {withdrawalRequests && withdrawalRequests.length > 0 ? (
                <div className="space-y-2">
                  {withdrawalRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                        <div className="ml-3">
                          <p className="font-medium">Withdrawal Request</p>
                          <p className="text-sm text-gray-500">
                            Amount: ${parseFloat(request.amount).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No withdrawal requests</p>
                  <p className="text-sm text-gray-500">Your withdrawal requests will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTransactions } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, ChevronDown } from "lucide-react";

export function AssetsPage() {
  const [activeTab, setActiveTab] = useState("recharges");
  const [timeFilter, setTimeFilter] = useState("today");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();

  // Filter transactions by type
  const deposits = transactions?.filter(t => t.type === "deposit") || [];
  const withdrawals = transactions?.filter(t => t.type === "withdrawal") || [];
  const allFunds = transactions || [];

  if (transactionsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-medium">Asset</h1>
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium text-gray-900">Asset</h1>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-20 h-8 text-sm border-gray-300">
              <SelectValue />
              <ChevronDown className="w-4 h-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-none h-12">
                <TabsTrigger 
                  value="recharges" 
                  className="text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none"
                >
                  Recharges
                </TabsTrigger>
                <TabsTrigger 
                  value="withdraws" 
                  className="text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none"
                >
                  Withdraws
                </TabsTrigger>
                <TabsTrigger 
                  value="funds" 
                  className="text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none"
                >
                  Funds
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="recharges" className="mt-0 pt-8">
                {deposits.length > 0 ? (
                  <div className="space-y-0">
                    {deposits.map((deposit) => (
                      <div key={deposit.id} className="py-4 px-2 border-b border-gray-100 last:border-b-0">
                        <div className="grid grid-cols-3 gap-4">
                          {/* Amount Column */}
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Amount</div>
                            <div className="text-sm font-medium">{parseFloat(deposit.amount).toFixed(0)}</div>
                          </div>
                          
                          {/* Status Column */}
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Status</div>
                            <div className="text-sm text-blue-600 font-medium">
                              {deposit.status === 'completed' ? 'Applied' : 
                               deposit.status === 'pending' ? 'Applied' : 
                               deposit.status}
                            </div>
                          </div>
                          
                          {/* Checkout Column */}
                          <div>
                            <div className="text-sm text-gray-600 mb-1">&nbsp;</div>
                            <div>
                              {(deposit.status === 'completed' || deposit.status === 'pending') && (
                                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded inline-block">
                                  Checkout
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Apply Time - full width below */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Apply Time: {new Date(deposit.createdAt).toLocaleString('en-CA', {
                              year: 'numeric',
                              month: '2-digit', 
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false
                            }).replace(',', '')}
                            
                            {/* Show Transaction Number if it exists */}
                            {deposit.description?.includes('Transaction No:') && (
                              <div className="mt-1 text-xs text-green-600 font-medium">
                                {deposit.description?.split('Transaction No:')[1]?.split('|')[0]?.trim() && (
                                  <>✓ Transaction No: {deposit.description?.split('Transaction No:')[1]?.split('|')[0]?.trim()}</>
                                )}
                              </div>
                            )}
                          </div>
                          <button 
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setLocation(`/recharge-detail/${deposit.id}`);
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <ClipboardList className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="withdraws" className="mt-0 pt-8">
                {withdrawals.length > 0 ? (
                  <div className="space-y-3">
                    {withdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Withdrawal</p>
                          <p className="text-sm text-gray-500">{withdrawal.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">-${parseFloat(withdrawal.amount).toFixed(2)}</p>
                          <p className="text-xs text-gray-500 capitalize">{withdrawal.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <ClipboardList className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="funds" className="mt-0 pt-8">
                {allFunds.length > 0 ? (
                  <div className="space-y-3">
                    {allFunds.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{transaction.type.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-500">{transaction.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
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
                          <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <ClipboardList className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
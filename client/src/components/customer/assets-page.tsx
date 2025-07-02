import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTransactions, useWithdrawalRequests } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ClipboardList, ChevronDown, ChevronRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AssetsPage() {
  const [activeTab, setActiveTab] = useState("recharges");
  const [timeFilter, setTimeFilter] = useState("today");
  const [currentView, setCurrentView] = useState<'main' | 'withdrawDetail'>('main');
  const [selectedWithdraw, setSelectedWithdraw] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const { data: withdrawalRequests, isLoading: withdrawalsLoading } = useWithdrawalRequests();
  const { toast } = useToast();

  // Handle time filter change
  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    // Reset dates when switching away from conditional
    if (value !== "conditional") {
      setStartDate("");
      setEndDate("");
    }
  };

  // Copy functionality
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied successfully",
    });
  };

  // Time filtering logic
  const applyTimeFilter = (items: any[]) => {
    if (!items || items.length === 0) return [];
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return items.filter(item => {
      const itemDate = new Date(item.createdAt);
      
      switch (timeFilter) {
        case "today":
          return itemDate >= todayStart;
        case "yesterday":
          const yesterdayStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          yesterdayStart.setHours(0, 0, 0, 0);
          const yesterdayEnd = new Date(yesterdayStart.getTime() + 24 * 60 * 60 * 1000);
          return itemDate >= yesterdayStart && itemDate < yesterdayEnd;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemDate >= monthAgo;
        case "3months":
          const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return itemDate >= threeMonthsAgo;
        case "conditional":
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include the entire end date
            return itemDate >= start && itemDate <= end;
          }
          return true;
        case "all":
        default:
          return true;
      }
    });
  };

  // Filter transactions by type and time
  const deposits = applyTimeFilter(transactions?.filter(t => t.type === "deposit") || []);
  const withdrawals = applyTimeFilter(withdrawalRequests || []);
  const allFunds = applyTimeFilter([...(transactions || []), ...(withdrawalRequests || [])]);

  if (transactionsLoading || withdrawalsLoading) {
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

  // Withdrawal Detail View
  if (currentView === 'withdrawDetail' && selectedWithdraw) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-medium text-center flex-1">Withdraw Detail</h1>
          </div>

          {/* Withdrawal Details */}
          <Card className="border border-gray-200">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="text-blue-600 font-medium">{selectedWithdraw.amount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="text-blue-600 font-medium">{selectedWithdraw.status}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="text-gray-900">Bank Card</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Address</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900">Bank - 1 Name - 1 A/C No - 1 IFSC Code - 1</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard("Bank - 1 Name - 1 A/C No - 1 IFSC Code - 1")}>
                      <Copy className="w-4 h-4 text-blue-600" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Apply Time</span>
                  <span className="text-gray-900">{new Date(selectedWithdraw.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Review Time</span>
                  <span className="text-gray-900">-</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Approve Amt.</span>
                  <span className="text-gray-900">-</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Comment</span>
                  <span className="text-gray-900">-</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Asset</h1>
            <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="conditional">Conditional Query</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Conditional Date Inputs */}
          {timeFilter === "conditional" && (
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="startDate" className="text-sm text-gray-600">Start date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="endDate" className="text-sm text-gray-600">End date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
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
                            {deposit.description && deposit.description.includes('Transaction No:') && (
                              <div className="mt-1 text-xs text-green-600 font-medium">
                                {deposit.description.split('Transaction No:')[1]?.split('|')[0]?.trim() && (
                                  <>✓ Transaction No: {deposit.description.split('Transaction No:')[1]?.split('|')[0]?.trim()}</>
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
                  <div className="space-y-0">
                    {withdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="py-4 px-2 border-b border-gray-100 last:border-b-0">
                        <div className="grid grid-cols-3 gap-4">
                          {/* Amount Column */}
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Amount</div>
                            <div className="text-sm font-medium">{parseFloat(withdrawal.amount).toFixed(0)}</div>
                          </div>
                          
                          {/* Status Column */}
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Status</div>
                            <div className="text-sm text-blue-600 font-medium">
                              {withdrawal.status === 'pending' ? 'Applied' : withdrawal.status}
                            </div>
                          </div>
                          
                          {/* Empty third column for alignment */}
                          <div></div>
                        </div>
                        
                        {/* Apply Time and Arrow - full width below */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Apply Time: {new Date(withdrawal.createdAt).toLocaleString('en-CA', {
                              year: 'numeric',
                              month: '2-digit', 
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false
                            }).replace(',', '')}
                          </div>
                          <button 
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setSelectedWithdraw(withdrawal);
                              setCurrentView('withdrawDetail');
                            }}
                          >
                            <ChevronRight className="w-5 h-5" />
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
              
              <TabsContent value="funds" className="mt-0 pt-8">
                {(transactions && transactions.length > 0) || (withdrawals && withdrawals.length > 0) ? (
                  <div className="space-y-0">
                    {/* Show transactions (deposits) */}
                    {transactions?.map((transaction) => (
                      <div key={`tx-${transaction.id}`} className="py-4 px-2 border-b border-gray-100 last:border-b-0">
                        <div className="grid grid-cols-3 gap-4">
                          {/* Amount Column */}
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Amount</div>
                            <div className="text-sm font-medium">{parseFloat(transaction.amount).toFixed(0)}</div>
                          </div>
                          
                          {/* Status Column */}
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Status</div>
                            <div className="text-sm text-blue-600 font-medium">
                              {transaction.status === 'completed' ? 'Applied' : 
                               transaction.status === 'pending' ? 'Applied' : 
                               transaction.status}
                            </div>
                          </div>
                          
                          {/* Type Column */}
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Type</div>
                            <div className="text-sm text-green-600 font-medium">
                              {transaction.type === 'deposit' ? 'Deposit' : transaction.type}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          Apply Time: {new Date(transaction.createdAt).toLocaleString('en-CA', {
                            year: 'numeric',
                            month: '2-digit', 
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                          }).replace(',', '')}
                        </div>
                      </div>
                    ))}
                    
                    {/* Show withdrawal requests */}
                    {withdrawals?.map((withdrawal) => (
                      <div key={`wd-${withdrawal.id}`} className="py-4 px-2 border-b border-gray-100 last:border-b-0">
                        <div className="grid grid-cols-3 gap-4">
                          {/* Amount Column */}
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Amount</div>
                            <div className="text-sm font-medium">{parseFloat(withdrawal.amount).toFixed(0)}</div>
                          </div>
                          
                          {/* Status Column */}
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Status</div>
                            <div className="text-sm text-blue-600 font-medium">
                              {withdrawal.status === 'pending' ? 'Applied' : withdrawal.status}
                            </div>
                          </div>
                          
                          {/* Type Column */}
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Type</div>
                            <div className="text-sm text-red-600 font-medium">
                              Withdrawal
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          Apply Time: {new Date(withdrawal.createdAt).toLocaleString('en-CA', {
                            year: 'numeric',
                            month: '2-digit', 
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                          }).replace(',', '')}
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
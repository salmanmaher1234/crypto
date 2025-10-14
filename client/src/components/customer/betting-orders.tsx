import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useBettingOrders, useUpdateBettingOrder } from "@/lib/api";
import { FileText, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { queryClient } from "@/lib/queryClient";

const parseUTCTimestamp = (timestamp: Date | string): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  const timestampStr = timestamp.toString();
  if (!timestampStr.includes('Z') && !timestampStr.includes('+') && !timestampStr.includes('-', 10)) {
    return new Date(timestampStr + 'Z');
  }
  
  return new Date(timestampStr);
};

export function CustomerBettingOrders() {
  const { user } = useAuth();
  const { data: allBettingOrders, isLoading } = useBettingOrders();
  const updateBettingOrder = useUpdateBettingOrder();
  
  const urlParams = new URLSearchParams(window.location.search);
  const tabFromUrl = urlParams.get('tab') as 'pending' | 'closed' | 'cancelled' | null;
  
  const [activeTab, setActiveTab] = useState<"pending" | "closed" | "cancelled">(tabFromUrl || "pending");
  const [timeFilter, setTimeFilter] = useState("today");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderStartTimes, setOrderStartTimes] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.refetchQueries({ queryKey: ["/api/betting-orders"] });
      queryClient.refetchQueries({ queryKey: ["/api/auth/me"] });
      queryClient.refetchQueries({ queryKey: ["/api/users"] });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPayoutPercentage = (duration: number) => {
    const payoutMap: { [key: number]: string } = {
      30: "20%",
      60: "30%", 
      120: "40%",
      180: "50%",
      240: "60%"
    };
    return payoutMap[duration] || "30%";
  };

  // Track when we first see each active order for display countdown
  useEffect(() => {
    if (allBettingOrders) {
      setOrderStartTimes(prev => {
        const newMap = new Map(prev);
        allBettingOrders.forEach(order => {
          if (order.status === 'active' && !newMap.has(order.id)) {
            // Store the current time as display start time for this order
            newMap.set(order.id, Date.now());
          }
          if (order.status !== 'active' && newMap.has(order.id)) {
            // Remove completed orders from tracking
            newMap.delete(order.id);
          }
        });
        return newMap;
      });
    }
  }, [allBettingOrders]);

  const getRemainingTime = (order: any) => {
    const now = Date.now();
    const durationMs = order.duration * 1000;
    
    // Get the display start time (when we first saw this order)
    const displayStartTime = orderStartTimes.get(order.id);
    
    if (!displayStartTime) {
      // First time seeing this order - show full duration
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Calculate remaining time from when we first displayed this order
    const elapsed = now - displayStartTime;
    const remaining = Math.max(0, durationMs - elapsed);
    
    if (remaining <= 0) return "00:00";
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateProfit = (order: any) => {
    const orderAmount = parseFloat(order.amount);
    const profitPercentageMap: { [key: number]: number } = {
      30: 0.20,
      60: 0.30,
      120: 0.40,
      180: 0.50,
      240: 0.60
    };
    
    const profitRate = profitPercentageMap[order.duration] || 0.30;
    
    if (order.status === "active") {
      return orderAmount * profitRate;
    }
    
    if (order.status === "completed" && order.profitLoss) {
      return Math.abs(parseFloat(order.profitLoss));
    }
    
    return orderAmount * profitRate;
  };

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    if (value !== "conditional") {
      setStartDate("");
      setEndDate("");
    }
  };

  const userBettingOrders = allBettingOrders?.filter(order => order.userId === user?.id) || [];

  const filteredOrders = userBettingOrders.filter(order => {
    const statusMatch = activeTab === "pending" ? order.status === "active" :
                       activeTab === "closed" ? order.status === "completed" :
                       activeTab === "cancelled" ? order.status === "cancelled" :
                       false;

    const orderDate = parseUTCTimestamp(order.createdAt);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let timeMatch = true;
    if (timeFilter === "today") {
      timeMatch = orderDate >= todayStart;
    } else if (timeFilter === "yesterday") {
      const yesterdayStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      yesterdayStart.setHours(0, 0, 0, 0);
      const yesterdayEnd = new Date(yesterdayStart.getTime() + 24 * 60 * 60 * 1000);
      timeMatch = orderDate >= yesterdayStart && orderDate < yesterdayEnd;
    } else if (timeFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeMatch = orderDate >= weekAgo;
    } else if (timeFilter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeMatch = orderDate >= monthAgo;
    } else if (timeFilter === "3months") {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      timeMatch = orderDate >= threeMonthsAgo;
    } else if (timeFilter === "conditional" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      timeMatch = orderDate >= start && orderDate <= end;
    } else if (timeFilter === "all") {
      timeMatch = true;
    }

    return statusMatch && timeMatch;
  });

  const copyOrderDetails = (order: any) => {
    const orderNumber = order.orderId || `B${Date.now().toString().slice(-12)}${order.id.toString().padStart(3, '0')}`;
    navigator.clipboard.writeText(orderNumber);
    console.log("Order No. copied:", orderNumber);
  };

  const openDetailView = (order: any) => {
    setSelectedOrder(order);
    setShowDetailView(true);
  };

  if (isLoading) {
    return <div className="p-4">Loading orders...</div>;
  }

  if (showDetailView && selectedOrder) {
    const orderNumber = selectedOrder.orderId || `${selectedOrder.id}`;
    const profit = calculateProfit(selectedOrder);
    
    return (
      <div className="p-4 bg-white min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setShowDetailView(false)}
            className="flex items-center text-gray-600"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            variant="ghost"
            onClick={() => copyOrderDetails(selectedOrder)}
            className="text-blue-600"
            data-testid="button-copy-order"
          >
            Copy Order No.
          </Button>
        </div>

        <div className="space-y-4">
          {[
            { label: "Order No.", value: orderNumber },
            { label: "Currency", value: selectedOrder.asset.includes("/") ? selectedOrder.asset : `${selectedOrder.asset}/USDT` },
            { label: "Buy Price", value: selectedOrder.entryPrice },
            { label: "Close Price", value: selectedOrder.exitPrice || selectedOrder.entryPrice },
            { label: "Buy Time", value: format(parseUTCTimestamp(selectedOrder.createdAt), 'yyyy-MM-dd HH:mm:ss') },
            { label: "Close Time", value: selectedOrder.status === 'completed' ? format(parseUTCTimestamp(selectedOrder.expiresAt), 'yyyy-MM-dd HH:mm:ss') : 'Pending' },
            { label: "Billing Time", value: `${selectedOrder.duration}s` },
            { label: "Order Amount", value: selectedOrder.amount },
            { label: "Order Status", value: selectedOrder.status === 'active' ? 'Pending' : selectedOrder.status },
            { label: "Profit Amount", value: `${profit > 0 ? '+' : ''}${profit.toFixed(0)}`, isProfit: true },
            { label: "Scale", value: `${selectedOrder.duration === 60 ? '30' : selectedOrder.duration === 120 ? '40' : '50'}%` },
            { label: "Buy Direction", value: user?.direction === "Actual" ? (selectedOrder.direction || "Buy Up") : user?.direction === "Buy Up" ? "Buy Up" : "Buy Down", isDirection: true },
            { label: "Actual Rise Fall", value: selectedOrder.result === 'win' ? 'Rise' : selectedOrder.result === 'loss' ? 'Fall' : 'Rise', isActual: true },
            { label: "Order Time", value: format(parseUTCTimestamp(selectedOrder.createdAt), 'yyyy-MM-dd HH:mm:ss') }
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">{item.label}</span>
              <span className={`text-sm font-medium ${
                item.isProfit ? (profit > 0 ? 'text-red-500' : 'text-green-500') :
                item.isDirection ? (
                  user?.direction === "Actual" ? 
                    (selectedOrder.direction === "Buy Up" ? 'text-green-500' : 'text-red-500') :
                    (user?.direction === 'Buy Up' ? 'text-green-500' : 'text-red-500')
                ) :
                item.isActual ? 'text-red-500' :
                'text-gray-900'
              }`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-16 sm:pb-20 md:pb-24 bg-gray-50 min-h-screen">
      {/* Header with Title and Time Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Order</h1>
          <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
            <SelectTrigger className="w-32 bg-white" data-testid="select-time-filter">
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
        
        {timeFilter === "conditional" && (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="headerStartDate" className="text-sm text-gray-600">Start date</Label>
              <Input
                id="headerStartDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white"
                data-testid="input-start-date"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="headerEndDate" className="text-sm text-gray-600">End date</Label>
              <Input
                id="headerEndDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white"
                data-testid="input-end-date"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs - Matching Screenshot Design */}
      <div className="flex justify-center space-x-8 border-b border-gray-200 pb-0">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
            activeTab === "pending"
              ? "text-gray-900"
              : "text-gray-500"
          }`}
          data-testid="tab-pending"
        >
          Pending
          {activeTab === "pending" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7CB342]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("closed")}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
            activeTab === "closed"
              ? "text-gray-900"
              : "text-gray-500"
          }`}
          data-testid="tab-closed"
        >
          Closed
          {activeTab === "closed" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7CB342]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("cancelled")}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
            activeTab === "cancelled"
              ? "text-gray-900"
              : "text-gray-500"
          }`}
          data-testid="tab-cancelled"
        >
          Cancelled
          {activeTab === "cancelled" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7CB342]" />
          )}
        </button>
      </div>

      {/* Orders Content */}
      <div className="min-h-[400px] bg-white rounded-lg">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <FileText className="w-16 h-16 mb-3 text-gray-300" strokeWidth={1.5} />
            <p className="text-gray-500 text-sm">No data available</p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {filteredOrders.map((order) => {
              const orderNumber = order.orderId || `${order.id}`;
              const profit = calculateProfit(order);
              const isProfit = profit > 0;
              
              return (
                <Card key={order.id} className="bg-white border border-gray-200" data-testid={`card-order-${order.id}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900" data-testid={`text-asset-${order.id}`}>
                          {order.asset.includes("/") ? order.asset : `${order.asset}/USDT`}
                        </h3>
                      </div>
                      <div className="text-right text-sm text-gray-600" data-testid={`text-created-${order.id}`}>
                        {format(parseUTCTimestamp(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <div className="text-sm text-gray-600 mb-1">Settlement Timing</div>
                      <div className="text-lg font-bold text-gray-900" data-testid={`text-timing-${order.id}`}>
                        {order.status === 'active' ? 
                          getRemainingTime(order) : 
                          `${order.duration}s`
                        }
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="space-y-3">
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Investment Amount</div>
                          <div className="font-medium" data-testid={`text-amount-${order.id}`}>{order.amount}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Buy Price</div>
                          <div className="font-medium" data-testid={`text-entry-price-${order.id}`}>{order.entryPrice}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Closing Price</div>
                          <div className="font-medium" data-testid={`text-exit-price-${order.id}`}>{order.exitPrice || order.entryPrice}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Profit</div>
                          <div className={`font-medium ${isProfit ? 'text-red-500' : 'text-green-500'}`} data-testid={`text-profit-${order.id}`}>
                            {order.status === 'active' ? '0.00' : (isProfit ? '+' : '') + profit.toFixed(0)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-gray-500 text-xs mb-1">Direction</div>
                          <div className={`font-medium text-lg ${
                            user?.direction === "Actual" ? 
                              (order.direction === "Buy Up" ? 'text-green-500' : 'text-red-500') :
                              (user?.direction === 'Buy Up' ? 'text-green-500' : 'text-red-500')
                          }`} data-testid={`text-direction-${order.id}`}>
                            {order.direction === "Buy Up" ? "Up" : "Down"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-gray-500 text-xs mb-1">Scale</div>
                          <div className="font-medium" data-testid={`text-scale-${order.id}`}>
                            {order.duration === 60 ? '30.00%' : 
                             order.duration === 120 ? '40.00%' : '50.00%'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-gray-500 text-xs mb-1">Investment Time</div>
                        <div className="font-medium text-xs" data-testid={`text-duration-${order.id}`}>{order.duration}s</div>
                        <div className="font-medium text-xs mt-2">
                          {parseFloat(order.entryPrice).toFixed(4)}
                        </div>
                        <div className="font-medium text-xs">
                          {order.exitPrice ? parseFloat(order.exitPrice).toFixed(4) : '0.0000'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ——————
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

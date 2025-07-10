import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useBettingOrders, useUpdateBettingOrder } from "@/lib/api";
import { FileText, Copy, ChevronRight, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { queryClient } from "@/lib/queryClient";
// import { useToast } from "@/hooks/use-toast";

export function CustomerBettingOrders() {
  const { user } = useAuth();
  const { data: allBettingOrders, isLoading, error } = useBettingOrders();
  const updateBettingOrder = useUpdateBettingOrder();
  // const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"pending" | "closed" | "cancelled">("pending");
  const [timeFilter, setTimeFilter] = useState("today");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Auto-refresh betting orders every 2 seconds to catch completed orders
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/betting-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    }, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to get payout percentage based on duration
  const getPayoutPercentage = (duration: number) => {
    const payoutMap: { [key: number]: string } = {
      30: "20%",
      60: "30%", 
      120: "40%",
      180: "50%",
      240: "60%"
    };
    return payoutMap[duration] || "30%"; // Default to 30% if duration not found
  };

  // Handle time filter change
  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    // Reset dates when switching away from conditional
    if (value !== "conditional") {
      setStartDate("");
      setEndDate("");
    }
  };





  // Filter orders for current user
  const userBettingOrders = allBettingOrders?.filter(order => order.userId === user?.id) || [];

  // Auto-expire orders when their duration is reached
  useEffect(() => {
    const checkExpiredOrders = () => {
      const now = new Date();
      userBettingOrders.forEach(order => {
        if (order.status === "active" && order.expiresAt && new Date(order.expiresAt) <= now) {
          // Calculate profit based on direction and random outcome
          const isWin = Math.random() > 0.5; // 50% win rate simulation
          const profitAmount = isWin ? parseFloat(order.amount) * 0.8 : -parseFloat(order.amount);
          
          updateBettingOrder.mutate({
            id: order.id,
            updates: {
              status: "completed",
              result: isWin ? "win" : "loss",
              exitPrice: order.entryPrice, // Using same price for simplicity
            }
          });
        }
      });
    };

    const interval = setInterval(checkExpiredOrders, 1000); // Check every second
    return () => clearInterval(interval);
  }, [userBettingOrders, updateBettingOrder]);

  // Filter by status and time
  const filteredOrders = userBettingOrders.filter(order => {
    const statusMatch = activeTab === "pending" ? order.status === "active" :
                       activeTab === "closed" ? order.status === "completed" :
                       order.status === "cancelled";

    // Time filtering logic
    const orderDate = new Date(order.createdAt);
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
      end.setHours(23, 59, 59, 999); // Include full end date
      timeMatch = orderDate >= start && orderDate <= end;
    } else if (timeFilter === "all") {
      timeMatch = true;
    }

    return statusMatch && timeMatch;
  });

  const copyOrderDetails = (order: any) => {
    const orderNumber = order.orderId || `B${Date.now().toString().slice(-12)}${order.id.toString().padStart(3, '0')}`;
    
    // Only copy Order No.
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

  // Detailed order view
  if (showDetailView && selectedOrder) {
    const orderNumber = (selectedOrder as any).username || `User${selectedOrder.userId}`;
    
    // Calculate profit using same scale-based logic
    const getScaleProfitPercentage = (duration: number) => {
      const profitMap: { [key: number]: number } = {
        30: 20,   // 20%
        60: 30,   // 30%
        120: 40,  // 40%
        180: 50,  // 50%
        240: 60   // 60%
      };
      return profitMap[duration] || 30; // Default to 30%
    };
    
    const profitPercentage = getScaleProfitPercentage(selectedOrder.duration);
    // Customer profits are always positive regardless of result
    const profit = selectedOrder.status === "completed" ? parseFloat(selectedOrder.amount) * (profitPercentage / 100) : 0;
    
    return (
      <div className="p-4 bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setShowDetailView(false)}
            className="flex items-center text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            variant="ghost"
            onClick={() => copyOrderDetails(selectedOrder)}
            className="text-blue-600"
          >
            Copy Order No.
          </Button>
        </div>

        {/* Order Details */}
        <div className="space-y-4">
          {[
            { label: "Order No.", value: orderNumber },
            { label: "Currency", value: `${selectedOrder.asset}/USDT` },
            { label: "Buy Price", value: selectedOrder.entryPrice },
            { label: "Close Price", value: selectedOrder.exitPrice || selectedOrder.entryPrice },
            { label: "Buy Time", value: format(new Date(selectedOrder.createdAt), 'yyyy-MM-dd HH:mm:ss') },
            { label: "Close Time", value: selectedOrder.status === 'completed' ? format(new Date(selectedOrder.expiresAt), 'yyyy-MM-dd HH:mm:ss') : 'Pending' },
            { label: "Billing Time", value: `${selectedOrder.duration}s` },
            { label: "Order Amount", value: selectedOrder.amount },
            { label: "Order Status", value: selectedOrder.status === 'active' ? 'Pending' : selectedOrder.status },
            { label: "Profit Amount", value: `${profit > 0 ? '+' : ''}{profit.toFixed(0)}`, isProfit: true },
            { label: "Scale", value: "20%" },
            { label: "Buy Direction", value: user?.direction === "Buy Up" ? "Buy Up" : "Buy Down", isDirection: true },
            { label: "Actual Rise Fall", value: selectedOrder.result === 'win' ? 'Rise' : selectedOrder.result === 'loss' ? 'Fall' : 'Rise', isActual: true },
            { label: "Order Time", value: format(new Date(selectedOrder.createdAt), 'yyyy-MM-dd HH:mm:ss') }
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">{item.label}</span>
              <span className={`text-sm font-medium ${
                item.isProfit ? (profit > 0 ? 'text-red-500' : 'text-green-500') :
                item.isDirection ? (user?.direction === 'Buy Up' ? 'text-green-500' : 'text-red-500') :
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
    <div className="p-4 space-y-4 pb-16 sm:pb-20 md:pb-24">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Order</h1>
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
              <Label htmlFor="headerStartDate" className="text-sm text-gray-600">Start date</Label>
              <Input
                id="headerStartDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="headerEndDate" className="text-sm text-gray-600">End date</Label>
              <Input
                id="headerEndDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <Button
          variant="ghost"
          className={`flex-1 ${activeTab === "pending" ? "bg-white shadow-sm text-black" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 ${activeTab === "closed" ? "bg-white shadow-sm text-black" : ""}`}
          onClick={() => setActiveTab("closed")}
        >
          Closed
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 ${activeTab === "cancelled" ? "bg-white shadow-sm text-black" : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </Button>
      </div>

      {/* Orders Content */}
      <div className="min-h-96">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <FileText className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No data available</h3>
            <p className="text-sm text-center">
              {activeTab === "pending" && "You have no pending orders"}
              {activeTab === "closed" && "You have no completed orders"}
              {activeTab === "cancelled" && "You have no cancelled orders"}
            </p>
            <div className="w-8 h-8 bg-yellow-400 rounded-full mt-4"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const orderNumber = (order as any).username || `User${order.userId}`;
              
              // Calculate profit using scale-based percentages
              const getScaleProfitPercentage = (duration: number) => {
                const profitMap: { [key: number]: number } = {
                  30: 20,   // 20%
                  60: 30,   // 30%
                  120: 40,  // 40%
                  180: 50,  // 50%
                  240: 60   // 60%
                };
                return profitMap[duration] || 30; // Default to 30%
              };
              
              const profitPercentage = getScaleProfitPercentage(order.duration);
              // Customer profits are always positive regardless of result  
              const profit = order.status === "completed" ? parseFloat(order.amount) * (profitPercentage / 100) : 0;
              const isProfit = profit > 0;
              
              return (
                <Card key={order.id} className="bg-white border border-gray-200">
                  <CardContent className="p-4">
                    {/* Table Layout without borders */}
                    <div className="flex">
                      {/* Left side: Data table */}
                      <div className="flex-1">
                        <table className="w-full">
                          <tbody>
                            <tr className="h-8">
                              <td className="text-xs text-gray-500 py-1 pr-4 w-24">Currency</td>
                              <td className="font-medium text-sm py-1">{order.asset}/USDT</td>
                            </tr>
                            <tr className="h-8">
                              <td className="text-xs text-gray-500 py-1 pr-4">Order No.</td>
                              <td className="font-medium text-xs py-1">{orderNumber}</td>
                            </tr>
                            <tr className="h-8">
                              <td className="text-xs text-gray-500 py-1 pr-4">Order Amount</td>
                              <td className="font-medium text-sm py-1">{order.amount}</td>
                            </tr>
                            <tr className="h-8">
                              <td className="text-xs text-gray-500 py-1 pr-4">Profit Amount</td>
                              <td className={`font-medium text-sm py-1 ${isProfit ? 'text-red-500' : 'text-green-500'}`}>
                                {isProfit ? '+' : ''}{profit.toFixed(0)}
                              </td>
                            </tr>
                            <tr className="h-8">
                              <td className="text-xs text-gray-500 py-1 pr-4">Buy Direction</td>
                              <td className={`font-medium text-sm py-1 ${user?.direction === 'Buy Up' ? 'text-green-500' : 'text-red-500'}`}>
                                {user?.direction === "Buy Up" ? "Buy Up" : "Buy Down"}
                              </td>
                            </tr>
                            <tr className="h-8">
                              <td className="text-xs text-gray-500 py-1 pr-4">Scale</td>
                              <td className="font-medium text-sm py-1">{getPayoutPercentage(order.duration)}</td>
                            </tr>
                            <tr className="h-8">
                              <td className="text-xs text-gray-500 py-1 pr-4">Billing Time</td>
                              <td className="font-medium text-sm py-1">{order.duration}s</td>
                            </tr>
                            <tr className="h-8">
                              <td className="text-xs text-gray-500 py-1 pr-4">Order Time</td>
                              <td className="font-medium text-sm py-1">
                                {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Right side: Actions */}
                      <div className="flex flex-col items-end justify-start space-y-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 text-xs h-auto p-1"
                          onClick={() => copyOrderDetails(order)}
                        >
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
                          onClick={() => openDetailView(order)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
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
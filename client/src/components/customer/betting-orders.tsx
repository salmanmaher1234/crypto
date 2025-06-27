import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useBettingOrders, useUpdateBettingOrder } from "@/lib/api";
import { FileText, Copy, ChevronRight, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
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
    }

    return statusMatch && timeMatch;
  });

  const copyOrderDetails = (order: any) => {
    const orderNumber = `B${Date.now().toString().slice(-12)}${order.id.toString().padStart(3, '0')}`;
    const profit = order.result === "win" ? parseFloat(order.amount) * 0.8 : 
                   order.result === "loss" ? -parseFloat(order.amount) : 100;
    
    const details = `Order No.: ${orderNumber}
Currency: ${order.asset}/USDT
Buy Price: ${order.entryPrice}
Close Price: ${order.exitPrice || order.entryPrice}
Buy Time: ${format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}
Close Time: ${order.status === 'completed' ? format(new Date(order.expiresAt), 'yyyy-MM-dd HH:mm:ss') : 'Pending'}
Billing Time: ${order.duration}s
Order Amount: ${order.amount}
Order Status: ${order.status === 'active' ? 'Pending' : order.status}
Profit Amount: ${profit > 0 ? '+' : ''}${profit.toFixed(0)}
Scale: ${order.duration}s
Buy Direction: ${order.direction}
Actual Rise Fall: ${order.result === 'win' ? 'Rise' : order.result === 'loss' ? 'Fall' : 'Rise'}
Order Time: ${format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}`;
    
    navigator.clipboard.writeText(details);
    console.log("Order details copied:", details);
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
    const orderNumber = `B${Date.now().toString().slice(-12)}${selectedOrder.id.toString().padStart(3, '0')}`;
    const profit = selectedOrder.result === "win" ? parseFloat(selectedOrder.amount) * 0.8 : 
                   selectedOrder.result === "loss" ? -parseFloat(selectedOrder.amount) : 1200;
    
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
            Copy
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
            { label: "Profit Amount", value: `${profit > 0 ? '+' : ''}${profit.toFixed(0)}`, isProfit: true },
            { label: "Scale", value: "20%" },
            { label: "Buy Direction", value: selectedOrder.direction, isDirection: true },
            { label: "Actual Rise Fall", value: selectedOrder.result === 'win' ? 'Rise' : selectedOrder.result === 'loss' ? 'Fall' : 'Rise', isActual: true },
            { label: "Order Time", value: format(new Date(selectedOrder.createdAt), 'yyyy-MM-dd HH:mm:ss') }
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">{item.label}</span>
              <span className={`text-sm font-medium ${
                item.isProfit ? (profit > 0 ? 'text-red-500' : 'text-green-500') :
                item.isDirection ? (selectedOrder.direction === 'Buy Up' ? 'text-green-500' : 'text-red-500') :
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
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Order</h1>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <Button
          variant={activeTab === "pending" ? "default" : "ghost"}
          className={`flex-1 ${activeTab === "pending" ? "bg-white shadow-sm" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </Button>
        <Button
          variant={activeTab === "closed" ? "default" : "ghost"}
          className={`flex-1 ${activeTab === "closed" ? "bg-white shadow-sm" : ""}`}
          onClick={() => setActiveTab("closed")}
        >
          Closed
        </Button>
        <Button
          variant={activeTab === "cancelled" ? "default" : "ghost"}
          className={`flex-1 ${activeTab === "cancelled" ? "bg-white shadow-sm" : ""}`}
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
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Direction</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scale</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Time</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const orderNumber = `B${Date.now().toString().slice(-12)}${order.id.toString().padStart(3, '0')}`;
                    const profit = order.result === "win" ? parseFloat(order.amount) * 0.8 : 
                               order.result === "loss" ? -parseFloat(order.amount) : 100;
                    const isProfit = profit > 0;
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.asset}/USDT
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {orderNumber}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.amount}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={isProfit ? 'text-red-500' : 'text-green-500'}>
                            {isProfit ? '+' : ''}{profit.toFixed(0)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={order.direction === 'Buy Up' ? 'text-green-500' : 'text-red-500'}>
                            {order.direction}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.duration}s
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 text-xs h-auto px-2 py-1"
                              onClick={() => copyOrderDetails(order)}
                            >
                              Copy
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-gray-600 h-8 w-8 p-0"
                              onClick={() => openDetailView(order)}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
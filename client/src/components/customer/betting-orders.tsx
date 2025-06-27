import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useBettingOrders, useUpdateBettingOrder } from "@/lib/api";
import { FileText, Copy } from "lucide-react";
import { format } from "date-fns";
// import { useToast } from "@/hooks/use-toast";

export function CustomerBettingOrders() {
  const { user } = useAuth();
  const { data: allBettingOrders, isLoading } = useBettingOrders();
  const updateBettingOrder = useUpdateBettingOrder();
  // const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"pending" | "closed" | "cancelled">("pending");
  const [timeFilter, setTimeFilter] = useState("today");

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

  const copyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    console.log("Order number copied:", orderNumber);
  };

  if (isLoading) {
    return <div className="p-4">Loading orders...</div>;
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
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const orderNumber = `B${Date.now().toString().slice(-12)}${order.id.toString().padStart(3, '0')}`;
              const profit = order.result === "win" ? parseFloat(order.amount) * 0.8 : 
                           order.result === "loss" ? -parseFloat(order.amount) : 100;
              const isProfit = profit > 0;
              
              return (
                <Card key={order.id} className="bg-white border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-end mb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
                      >
                        <span className="text-lg">›</span>
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Row 1: Currency and Copy */}
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Currency</div>
                          <div className="font-medium text-sm">{order.asset}/USDT</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 text-xs h-auto p-1"
                          onClick={() => copyOrderNumber(orderNumber)}
                        >
                          Copy
                        </Button>
                      </div>
                      
                      {/* Row 2: Order No. and Order Amount */}
                      <div className="flex justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Order No.</div>
                          <div className="font-medium text-xs">{orderNumber}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Order Amount</div>
                          <div className="font-medium text-sm">{order.amount}</div>
                        </div>
                      </div>

                      {/* Row 3: Profit Amount and Buy Direction */}
                      <div className="flex justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Profit Amount</div>
                          <div className={`font-medium text-sm ${isProfit ? 'text-red-500' : 'text-green-500'}`}>
                            {isProfit ? '+' : ''}{profit.toFixed(0)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Buy Direction</div>
                          <div className={`font-medium text-sm ${order.direction === 'Buy Up' ? 'text-green-500' : 'text-red-500'}`}>
                            {order.direction}
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Scale and Billing Time */}
                      <div className="flex justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Scale</div>
                          <div className="font-medium text-sm">{order.duration}s</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Billing Time</div>
                          <div className="font-medium text-sm">{order.duration}s</div>
                        </div>
                      </div>

                      {/* Row 5: Order Time */}
                      <div className="flex justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Order Time</div>
                          <div className="font-medium text-sm">
                            {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                          </div>
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
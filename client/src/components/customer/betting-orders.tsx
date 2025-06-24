import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useBettingOrders } from "@/lib/api";
import { FileText, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function CustomerBettingOrders() {
  const { user } = useAuth();
  const { data: allBettingOrders, isLoading } = useBettingOrders();
  const [activeTab, setActiveTab] = useState<"pending" | "closed" | "cancelled">("pending");
  const [timeFilter, setTimeFilter] = useState("today");

  // Filter orders for current user
  const userBettingOrders = allBettingOrders?.filter(order => order.userId === user?.id) || [];

  // Filter by status and time
  const filteredOrders = userBettingOrders.filter(order => {
    const statusMatch = activeTab === "pending" ? order.status === "pending" :
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
    // Add more time filters as needed

    return statusMatch && timeMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getOrderTypeIcon = (orderType: string) => {
    return orderType === "up" ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
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
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="bg-gray-50 border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-end mb-3">
                    <button className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs">›</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 text-xs">Currency</span>
                        <div className="font-medium">{order.currency}</div>
                      </div>
                      <div className="text-right">
                        <button className="text-blue-600 text-xs font-medium">Copy</button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 text-xs">Order No.</span>
                        <div className="font-medium text-xs">B{order.id.toString().padStart(15, '0')}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Order Amount</span>
                        <div className="font-medium">{parseFloat(order.amount).toFixed(0)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 text-xs">Profit Amount</span>
                        <div className="font-medium text-red-600">
                          {order.profit ? parseFloat(order.profit).toFixed(0) : "0"}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Buy Direction</span>
                        <div className={`font-medium ${order.orderType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {order.orderType === 'up' ? 'Buy Up' : 'Buy Down'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 text-xs">Scale</span>
                        <div className="font-medium">{order.duration.replace('s', '%')}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Billing Time</span>
                        <div className="font-medium">{order.duration}</div>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 text-xs">Order Time</span>
                      <div className="font-medium text-xs">
                        {new Date(order.createdAt).toLocaleString('en-GB', {
                          year: 'numeric',
                          month: '2-digit', 
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  {order.status === "pending" && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Order is being processed...</span>
                      </div>
                    </div>
                  )}

                  {order.status === "completed" && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-gray-600">Exit Price:</span>
                          <span className="font-medium ml-1">{order.exitPrice || "N/A"}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Profit/Loss:</span>
                          <span className={`font-medium ml-1 ${
                            order.profit && parseFloat(order.profit) > 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {order.profit ? `$${parseFloat(order.profit).toFixed(2)}` : "$0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
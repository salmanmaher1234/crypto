import { useActiveBettingOrders, useUpdateBettingOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const durations = [30, 60, 120, 180, 240];

export function BettingOrders() {
  const { data: orders, isLoading } = useActiveBettingOrders();
  const updateOrder = useUpdateBettingOrder();
  const { toast } = useToast();

  const handleUpdateDuration = (orderId: number, newDuration: number) => {
    const newExpiresAt = new Date(Date.now() + newDuration * 1000);
    
    updateOrder.mutate({ 
      id: orderId, 
      updates: { 
        duration: newDuration,
        expiresAt: newExpiresAt
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Order updated",
          description: "Order duration has been updated successfully",
        });
      },
      onError: () => {
        toast({
          title: "Update failed",
          description: "Failed to update order duration",
          variant: "destructive",
        });
      },
    });
  };

  const handleCancelOrder = (orderId: number) => {
    updateOrder.mutate({ 
      id: orderId, 
      updates: { status: "cancelled" }
    }, {
      onSuccess: () => {
        toast({
          title: "Order cancelled",
          description: "Order has been cancelled successfully",
        });
      },
      onError: () => {
        toast({
          title: "Cancellation failed",
          description: "Failed to cancel order",
          variant: "destructive",
        });
      },
    });
  };

  const getRemainingTime = (expiresAt: Date) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const remaining = Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / 1000));
    return remaining;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Betting Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
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
    <div className="p-1 h-full">
      <Card className="h-full">
        <CardHeader className="p-2">
          <CardTitle>Active Betting Orders</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm">All Orders</Button>
            {durations.map((duration) => (
              <Button key={duration} variant="outline" size="sm">
                {duration}s
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {!orders || orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No active orders</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Timer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const remainingTime = getRemainingTime(order.expiresAt);
                  const progressPercent = Math.max(0, (remainingTime / order.duration) * 100);
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}-{(order as any).username || `User${order.userId}`}</TableCell>
                      <TableCell className="font-medium">{(order as any).username || `User${order.userId}`}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.asset}</div>
                          <div className="text-sm text-gray-500">{parseFloat(order.entryPrice).toFixed(2)}</div>
                        </div>
                      </TableCell>
                      <TableCell>{parseFloat(order.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={order.direction === "Buy Up" ? "default" : "destructive"}
                          className="flex items-center w-fit"
                        >
                          {order.direction === "Buy Up" ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {order.direction}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium text-warning">
                            {remainingTime}s
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                            <div 
                              className="bg-warning h-1 rounded-full transition-all duration-1000"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Select 
                            value={order.duration.toString()} 
                            onValueChange={(value) => handleUpdateDuration(order.id, parseInt(value))}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {durations.map((duration) => (
                                <SelectItem key={duration} value={duration.toString()}>
                                  {duration}s
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

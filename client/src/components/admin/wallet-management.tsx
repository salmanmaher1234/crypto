import { useUsers, useWithdrawalRequests, useUpdateWithdrawalRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WalletManagement() {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: withdrawalRequests, isLoading: requestsLoading } = useWithdrawalRequests();
  const updateWithdrawalRequest = useUpdateWithdrawalRequest();
  const { toast } = useToast();

  const handleWithdrawalAction = (requestId: number, status: "approved" | "rejected") => {
    updateWithdrawalRequest.mutate({ id: requestId, status }, {
      onSuccess: () => {
        toast({
          title: "Request processed",
          description: `Withdrawal request has been ${status}`,
        });
      },
      onError: () => {
        toast({
          title: "Action failed",
          description: `Failed to ${status} withdrawal request`,
          variant: "destructive",
        });
      },
    });
  };

  const customers = users?.filter(user => user.role === "customer") || [];

  if (usersLoading || requestsLoading) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Digital Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center">
                    <Skeleton className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-20" />
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
    <div className="p-6 space-y-6">
      {/* Digital Wallets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Digital Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No customer wallets</p>
              </div>
            ) : (
              <div className="space-y-4">
                {customers.map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">Digital Balance</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{parseFloat(user.balance).toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        Available: {parseFloat(user.availableBalance).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bank Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Bank account management coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {!withdrawalRequests || withdrawalRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No pending withdrawal requests</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank Account</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalRequests.map((request) => {
                  const customer = customers.find(u => u.id === request.userId);
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-3">
                            {customer?.name?.charAt(0) || "?"}
                          </div>
                          <div className="font-medium">{customer?.name || "Unknown"}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${parseFloat(request.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        Bank Account #{request.bankAccountId}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-success hover:bg-success/90"
                            onClick={() => handleWithdrawalAction(request.id, "approved")}
                            disabled={updateWithdrawalRequest.isPending}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleWithdrawalAction(request.id, "rejected")}
                            disabled={updateWithdrawalRequest.isPending}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
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

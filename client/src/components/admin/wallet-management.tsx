import { useUsers, useWithdrawalRequests, useUpdateWithdrawalRequest, useBankAccounts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, Wallet, CreditCard, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function WalletManagement() {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: withdrawalRequests, isLoading: requestsLoading } = useWithdrawalRequests();
  const { data: bankAccounts, isLoading: bankAccountsLoading } = useBankAccounts();
  const updateWithdrawalRequest = useUpdateWithdrawalRequest();
  const { toast } = useToast();
  const [rejectionNote, setRejectionNote] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);

  const handleWithdrawalAction = (requestId: number, status: "approved" | "rejected", note?: string) => {
    updateWithdrawalRequest.mutate(
      { id: requestId, status, ...(note && { note }) }, 
      {
        onSuccess: () => {
          toast({
            title: "Request processed",
            description: `Withdrawal request has been ${status}`,
          });
          setShowNoteDialog(false);
          setRejectionNote("");
          setSelectedRequestId(null);
        },
        onError: () => {
          toast({
            title: "Action failed",
            description: `Failed to ${status} withdrawal request`,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleRejectWithNote = (requestId: number) => {
    setSelectedRequestId(requestId);
    setShowNoteDialog(true);
  };

  const confirmRejection = () => {
    if (selectedRequestId) {
      handleWithdrawalAction(selectedRequestId, "rejected", rejectionNote);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
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
                      <div className="font-semibold">{(parseFloat(user.availableBalance) + parseFloat(user.frozenBalance || "0")).toFixed(2)}</div>
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
            {bankAccountsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-48 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                ))}
              </div>
            ) : !bankAccounts || bankAccounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No bank accounts added by members yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bankAccounts.map((account) => {
                  const accountOwner = customers.find(user => user.id === account.userId);
                  return (
                    <div key={account.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{account.accountHolderName}</div>
                            <div className="text-sm text-gray-500">Owner: {accountOwner?.name || "Unknown"}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {account.bankName}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 mb-1">Account Number</div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{account.accountNumber}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(account.accountNumber)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">IFSC Code</div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{account.ifscCode}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(account.ifscCode)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleWithdrawalAction(request.id, "approved")}
                            disabled={updateWithdrawalRequest.isPending}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectWithNote(request.id)}
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

      {/* Rejection Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Withdrawal Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionNote">Rejection Reason (Note)</Label>
              <Textarea
                id="rejectionNote"
                placeholder="Enter reason for rejection..."
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNoteDialog(false);
                  setRejectionNote("");
                  setSelectedRequestId(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRejection}
                disabled={!rejectionNote.trim() || updateWithdrawalRequest.isPending}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-1" />
                Reject Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { useUsers, useUpdateUser, useCreateTransaction } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Wallet, Lock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export function MemberManagement() {
  const { data: users, isLoading } = useUsers();
  const updateUser = useUpdateUser();
  const createTransaction = useCreateTransaction();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter(user =>
    user.role === "customer" &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!selectedUser) return;

    updateUser.mutate({ id: selectedUser.id, updates }, {
      onSuccess: () => {
        toast({
          title: "User updated",
          description: "User information has been updated successfully",
        });
        setEditDialogOpen(false);
      },
      onError: () => {
        toast({
          title: "Update failed",
          description: "Failed to update user information",
          variant: "destructive",
        });
      },
    });
  };

  const handleBalanceAction = (action: string, amount: string) => {
    if (!selectedUser || !amount || parseFloat(amount) <= 0) return;

    createTransaction.mutate({
      userId: selectedUser.id,
      type: action,
      amount,
      description: `Admin ${action}: $${amount}`,
    }, {
      onSuccess: () => {
        toast({
          title: "Transaction completed",
          description: `${action} of $${amount} completed successfully`,
        });
      },
      onError: () => {
        toast({
          title: "Transaction failed",
          description: `Failed to process ${action}`,
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <div className="flex gap-4">
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Reputation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${parseFloat(user.balance).toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        Available: ${parseFloat(user.availableBalance).toFixed(2)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{user.reputation}</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-success rounded-full"
                          style={{ width: `${user.reputation}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.accountStatus === "Active" ? "default" : "destructive"}>
                      {user.accountStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog open={editDialogOpen && selectedUser?.id === user.id} onOpenChange={setEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Customer: {user.name}</DialogTitle>
                          </DialogHeader>
                          {selectedUser && <CustomerEditForm user={selectedUser} onUpdate={handleUpdateUser} onBalanceAction={handleBalanceAction} />}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerEditForm({ 
  user, 
  onUpdate, 
  onBalanceAction 
}: { 
  user: User; 
  onUpdate: (updates: Partial<User>) => void;
  onBalanceAction: (action: string, amount: string) => void;
}) {
  const [formData, setFormData] = useState({
    reputation: user.reputation,
    winLoseSetting: user.winLoseSetting,
    direction: user.direction,
    accountStatus: user.accountStatus,
    withdrawalStatus: user.withdrawalStatus,
  });

  const [balanceActions, setBalanceActions] = useState({
    deposit: "",
    deduct: "",
    freeze: "",
    unfreeze: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reputation">Reputation (0-100)</Label>
            <Input
              id="reputation"
              type="number"
              min="0"
              max="100"
              value={formData.reputation}
              onChange={(e) => setFormData({ ...formData, reputation: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="winLose">Win/Lose Setting</Label>
            <Select value={formData.winLoseSetting} onValueChange={(value) => setFormData({ ...formData, winLoseSetting: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Win">To Win</SelectItem>
                <SelectItem value="To Lose">To Lose</SelectItem>
                <SelectItem value="Random">Random</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="direction">Direction</Label>
            <Select value={formData.direction} onValueChange={(value) => setFormData({ ...formData, direction: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Buy Up">Buy Up</SelectItem>
                <SelectItem value="Buy the Dip">Buy the Dip</SelectItem>
                <SelectItem value="Actual">Actual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="accountStatus">Account Status</Label>
            <Select value={formData.accountStatus} onValueChange={(value) => setFormData({ ...formData, accountStatus: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Prohibit">Prohibit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="withdrawalStatus">Withdrawal Status</Label>
            <Select value={formData.withdrawalStatus} onValueChange={(value) => setFormData({ ...formData, withdrawalStatus: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Allowed">Allowed</SelectItem>
                <SelectItem value="Prohibit">Prohibit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full">Save Changes</Button>
      </form>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Balance Actions</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Deposit</Label>
            <div className="flex">
              <Input
                type="number"
                placeholder="Amount"
                value={balanceActions.deposit}
                onChange={(e) => setBalanceActions({ ...balanceActions, deposit: e.target.value })}
                className="rounded-r-none"
              />
              <Button
                type="button"
                onClick={() => {
                  onBalanceAction("deposit", balanceActions.deposit);
                  setBalanceActions({ ...balanceActions, deposit: "" });
                }}
                className="rounded-l-none bg-success hover:bg-success/90"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Deduct</Label>
            <div className="flex">
              <Input
                type="number"
                placeholder="Amount"
                value={balanceActions.deduct}
                onChange={(e) => setBalanceActions({ ...balanceActions, deduct: e.target.value })}
                className="rounded-r-none"
              />
              <Button
                type="button"
                onClick={() => {
                  onBalanceAction("withdrawal", balanceActions.deduct);
                  setBalanceActions({ ...balanceActions, deduct: "" });
                }}
                className="rounded-l-none bg-destructive hover:bg-destructive/90"
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Freeze</Label>
            <div className="flex">
              <Input
                type="number"
                placeholder="Amount"
                value={balanceActions.freeze}
                onChange={(e) => setBalanceActions({ ...balanceActions, freeze: e.target.value })}
                className="rounded-r-none"
              />
              <Button
                type="button"
                onClick={() => {
                  onBalanceAction("freeze", balanceActions.freeze);
                  setBalanceActions({ ...balanceActions, freeze: "" });
                }}
                className="rounded-l-none bg-warning hover:bg-warning/90"
              >
                <Lock className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Unfreeze</Label>
            <div className="flex">
              <Input
                type="number"
                placeholder="Amount"
                value={balanceActions.unfreeze}
                onChange={(e) => setBalanceActions({ ...balanceActions, unfreeze: e.target.value })}
                className="rounded-r-none"
              />
              <Button
                type="button"
                onClick={() => {
                  onBalanceAction("unfreeze", balanceActions.unfreeze);
                  setBalanceActions({ ...balanceActions, unfreeze: "" });
                }}
                className="rounded-l-none bg-primary hover:bg-primary/90"
              >
                <Unlock className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

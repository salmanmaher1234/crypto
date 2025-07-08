import { useState, useEffect } from "react";
import { useUsers, useUpdateUser, useCreateUser, useCreateTransaction, useTransactions, useUpdateTransaction, useDeleteUser, useCreateMessage } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Edit, Wallet, Lock, Eye, Plus, Minus, LockOpen, UserPlus, Settings, Ban, CheckCircle, XCircle, AlertTriangle, Unlock, Trash2, Send, Key, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export function MemberManagement() {
  const { data: users, isLoading } = useUsers();
  const { data: transactions } = useTransactions();
  const updateUser = useUpdateUser();
  const createUser = useCreateUser();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteUser = useDeleteUser();
  const createMessage = useCreateMessage();
  const { toast } = useToast();

  // Auto-refresh user data every 5 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/betting-orders"] });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [deductionDialogOpen, setDeductionDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [deductionAmount, setDeductionAmount] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [freezeAmount, setFreezeAmount] = useState("");
  const [unfreezeDialogOpen, setUnfreezeDialogOpen] = useState(false);
  const [unfreezeAmount, setUnfreezeAmount] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    reputation: 100
  });

  // Filter and sort users based on search term, ID descending (newest first)
  const filteredUsers = users?.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.id - a.id) || [];

  const handleQuickUpdate = (user: User, updates: Partial<User>) => {
    updateUser.mutate(
      { id: user.id, updates },
      {
        onSuccess: () => {
          toast({ title: "User updated successfully" });
        },
        onError: () => {
          toast({ title: "Failed to update user", variant: "destructive" });
        },
      }
    );
  };

  const handleFreezeAmount = (user: User, amount: number) => {
    const currentAvailable = parseFloat(user.availableBalance || "0");
    const currentFrozen = parseFloat(user.frozenBalance || "0");
    
    if (amount > currentAvailable) {
      toast({ title: "Insufficient available balance", variant: "destructive" });
      return;
    }

    const newAvailable = currentAvailable - amount;
    const newFrozen = currentFrozen + amount;

    handleQuickUpdate(user, {
      availableBalance: newAvailable.toString(),
      frozenBalance: newFrozen.toString(),
    });
    setFreezeAmount("");
    setFreezeDialogOpen(false);
  };

  const handleUnfreezeAmount = (user: User, amount: number) => {
    const currentAvailable = parseFloat(user.availableBalance || "0");
    const currentFrozen = parseFloat(user.frozenBalance || "0");
    
    if (amount > currentFrozen) {
      toast({ title: "Insufficient frozen balance", variant: "destructive" });
      return;
    }

    const newAvailable = currentAvailable + amount;
    const newFrozen = currentFrozen - amount;

    handleQuickUpdate(user, {
      availableBalance: newAvailable.toString(),
      frozenBalance: newFrozen.toString(),
    });
    setUnfreezeAmount("");
    setUnfreezeDialogOpen(false);
  };

  const handleDepositWithdraw = (type: "deposit" | "withdraw", amount: number) => {
    if (!selectedUser || amount <= 0) return;

    const currentBalance = parseFloat(selectedUser.balance || "0");
    const currentAvailable = parseFloat(selectedUser.availableBalance || "0");
    
    let newBalance, newAvailable;
    
    if (type === "deposit") {
      newBalance = currentBalance + amount;
      newAvailable = currentAvailable + amount;
    } else {
      if (amount > currentAvailable) {
        toast({ title: "Insufficient available balance", variant: "destructive" });
        return;
      }
      newBalance = currentBalance - amount;
      newAvailable = currentAvailable - amount;
    }

    handleQuickUpdate(selectedUser, {
      balance: newBalance.toString(),
      availableBalance: newAvailable.toString(),
    });

    // Reset states
    setDepositAmount("");
    setDeductionAmount("");
    setDepositDialogOpen(false);
    setDeductionDialogOpen(false);
  };

  const handleDeleteUser = (user: User) => {
    deleteUser.mutate(user.id, {
      onSuccess: () => {
        toast({ title: "User deleted successfully" });
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      },
      onError: () => {
        toast({ title: "Failed to delete user", variant: "destructive" });
      },
    });
  };

  const handleSendMessage = () => {
    if (!selectedUser || !messageTitle || !messageContent) return;

    createMessage.mutate({
      recipientId: selectedUser.id,
      title: messageTitle,
      content: messageContent,
    }, {
      onSuccess: () => {
        toast({ title: "Message sent successfully" });
        setMessageTitle("");
        setMessageContent("");
        setMessageDialogOpen(false);
      },
      onError: () => {
        toast({ title: "Failed to send message", variant: "destructive" });
      },
    });
  };

  const handleAddMember = () => {
    createUser.mutate({
      ...newMemberData,
      role: "customer",
      availableBalance: "0.00",
      frozenBalance: "0.00",
    }, {
      onSuccess: () => {
        toast({ title: "Member added successfully" });
        setAddMemberDialogOpen(false);
        setNewMemberData({
          username: "",
          email: "",
          password: "",
          name: "",
          reputation: 100
        });
      },
      onError: () => {
        toast({ title: "Failed to add member", variant: "destructive" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Member Management</CardTitle>
          <div className="flex gap-4 justify-between">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Username</Label>
                    <Input 
                      value={newMemberData.username}
                      onChange={(e) => setNewMemberData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      value={newMemberData.email}
                      onChange={(e) => setNewMemberData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input 
                      type="password"
                      value={newMemberData.password}
                      onChange={(e) => setNewMemberData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <Input 
                      value={newMemberData.name}
                      onChange={(e) => setNewMemberData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label>VIP Level (Reputation)</Label>
                    <Input 
                      type="number"
                      value={newMemberData.reputation}
                      onChange={(e) => setNewMemberData(prev => ({ ...prev, reputation: parseInt(e.target.value) || 100 }))}
                      placeholder="Enter reputation (1-100)"
                      min="1"
                      max="100"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setAddMemberDialogOpen(false);
                        setNewMemberData({
                          username: "",
                          email: "",
                          password: "",
                          name: "",
                          reputation: 100
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddMember}
                      disabled={!newMemberData.username || !newMemberData.email || !newMemberData.password || !newMemberData.name}
                    >
                      Add Member
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[120px]">Username</TableHead>
                  <TableHead className="w-[150px]">Balance</TableHead>
                  <TableHead className="w-[100px]">VIP Level</TableHead>
                  <TableHead className="w-[100px]">Direction</TableHead>
                  <TableHead className="w-[80px]">Ban</TableHead>
                  <TableHead className="w-[100px]">Withdraw</TableHead>
                  <TableHead className="min-w-[600px]">Operate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-sm">{user.id}</TableCell>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          Total: {(parseFloat(user.availableBalance || "0") + parseFloat(user.frozenBalance || "0")).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Available: {parseFloat(user.availableBalance || "0").toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Frozen: {parseFloat(user.frozenBalance || "0").toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{user.reputation || 100}/100</span>
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${((user.reputation || 100) / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.direction || "Buy Up"}
                        onValueChange={(value) => handleQuickUpdate(user, { direction: value })}
                      >
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Buy Up">Buy Up</SelectItem>
                          <SelectItem value="Buy Down">Buy Down</SelectItem>
                          <SelectItem value="Actual">Actual</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.isBanned || false}
                        onCheckedChange={(checked) => handleQuickUpdate(user, { isBanned: checked })}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.withdrawalProhibited || false}
                        onCheckedChange={(checked) => handleQuickUpdate(user, { withdrawalProhibited: checked })}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {/* Password Management Button */}
                        <Dialog open={passwordDialogOpen && selectedUser?.id === user.id} onOpenChange={setPasswordDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Key className="w-3 h-3 mr-1" />
                              Confidential
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Password Management</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="new-password">New Password</Label>
                                  <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="confirm-password">Confirm Password</Label>
                                  <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setPasswordDialogOpen(false);
                                      setNewPassword("");
                                      setConfirmPassword("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      if (newPassword !== confirmPassword) {
                                        toast({ title: "Passwords do not match", variant: "destructive" });
                                        return;
                                      }
                                      if (newPassword.length < 4) {
                                        toast({ title: "Password must be at least 4 characters", variant: "destructive" });
                                        return;
                                      }
                                      if (selectedUser) {
                                        handleQuickUpdate(selectedUser, { password: newPassword });
                                        setPasswordDialogOpen(false);
                                        setNewPassword("");
                                        setConfirmPassword("");
                                        toast({ title: "Password updated successfully" });
                                      }
                                    }}
                                    disabled={!newPassword || !confirmPassword}
                                  >
                                    Update Password
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Details Button */}
                        <Dialog open={detailsDialogOpen && selectedUser?.id === user.id} onOpenChange={setDetailsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                              onClick={() => setSelectedUser(user)}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">User ID</Label>
                                    <p className="text-sm">{selectedUser.id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Username</Label>
                                    <p className="text-sm">{selectedUser.username}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                                    <p className="text-sm">{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                                    <p className="text-sm">{selectedUser.name}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Role</Label>
                                    <Badge>{selectedUser.role}</Badge>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Total Balance</Label>
                                    <p className="text-sm font-semibold">{(parseFloat(selectedUser.availableBalance || "0") + parseFloat(selectedUser.frozenBalance || "0")).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Available Balance</Label>
                                    <p className="text-sm">{parseFloat(selectedUser.availableBalance || "0").toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Frozen Balance</Label>
                                    <p className="text-sm">{parseFloat(selectedUser.frozenBalance || "0").toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Reputation</Label>
                                    <p className="text-sm">{selectedUser.reputation}/100</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Account Status</Label>
                                    <Badge variant={selectedUser.isActive ? "default" : "destructive"}>
                                      {selectedUser.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>



                        {/* Deposit Button */}
                        <Dialog open={depositDialogOpen && selectedUser?.id === user.id} onOpenChange={setDepositDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Deposit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Deposit Funds</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Current Balance: {(parseFloat(user.availableBalance || "0") + parseFloat(user.frozenBalance || "0")).toFixed(2)}</Label>
                              </div>
                              <div>
                                <Label>Deposit Amount</Label>
                                <Input 
                                  type="number"
                                  value={depositAmount}
                                  onChange={(e) => setDepositAmount(e.target.value)}
                                  placeholder="Enter amount to deposit"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDepositDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={() => handleDepositWithdraw("deposit", parseFloat(depositAmount))} disabled={!depositAmount}>
                                  Deposit {depositAmount || "0"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Deduction Button */}
                        <Dialog open={deductionDialogOpen && selectedUser?.id === user.id} onOpenChange={setDeductionDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Minus className="w-3 h-3 mr-1" />
                              Deduction
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Deduct Funds</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Current Balance: {(parseFloat(user.availableBalance || "0") + parseFloat(user.frozenBalance || "0")).toFixed(2)}</Label>
                              </div>
                              <div>
                                <Label>Deduction Amount</Label>
                                <Input 
                                  type="number"
                                  value={deductionAmount}
                                  onChange={(e) => setDeductionAmount(e.target.value)}
                                  placeholder="Enter amount to deduct"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDeductionDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={() => handleDepositWithdraw("withdraw", parseFloat(deductionAmount))} disabled={!deductionAmount} variant="destructive">
                                  Deduct {deductionAmount || "0"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>



                        {/* Freeze Button */}
                        <Dialog open={freezeDialogOpen && selectedUser?.id === user.id} onOpenChange={setFreezeDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Lock className="w-3 h-3 mr-1" />
                              Freeze
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Freeze Balance</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="freezeAmount">Amount to Freeze</Label>
                                <Input
                                  id="freezeAmount"
                                  type="number"
                                  placeholder="Enter amount to freeze"
                                  value={freezeAmount}
                                  onChange={(e) => setFreezeAmount(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                  Available Balance: {user.availableBalance}
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setFreezeDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={() => handleFreezeAmount(user, parseFloat(freezeAmount))} 
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Freeze Amount
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Unfreeze Button */}
                        <Dialog open={unfreezeDialogOpen && selectedUser?.id === user.id} onOpenChange={setUnfreezeDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Unlock className="w-3 h-3 mr-1" />
                              Unfreeze
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Unfreeze Balance</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="unfreezeAmount">Amount to Unfreeze</Label>
                                <Input
                                  id="unfreezeAmount"
                                  type="number"
                                  placeholder="Enter amount to unfreeze"
                                  value={unfreezeAmount}
                                  onChange={(e) => setUnfreezeAmount(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                  Frozen Balance: {user.frozenBalance}
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setUnfreezeDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={() => handleUnfreezeAmount(user, parseFloat(unfreezeAmount))} className="bg-green-600 hover:bg-green-700">
                                  Unfreeze Amount
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Send Message Button */}
                        <Dialog open={messageDialogOpen && selectedUser?.id === user.id} onOpenChange={setMessageDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Send a letter
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Send Message to {selectedUser?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Message Title</Label>
                                <Input 
                                  value={messageTitle}
                                  onChange={(e) => setMessageTitle(e.target.value)}
                                  placeholder="Enter message title"
                                />
                              </div>
                              <div>
                                <Label>Message Content</Label>
                                <Textarea 
                                  value={messageContent}
                                  onChange={(e) => setMessageContent(e.target.value)}
                                  placeholder="Enter your message here..."
                                  rows={4}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleSendMessage} disabled={!messageTitle || !messageContent}>
                                  Send Message
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Button */}
                        <Dialog open={deleteDialogOpen && selectedUser?.id === user.id} onOpenChange={setDeleteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Delete User</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="text-center py-4">
                                <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-red-500" />
                                <p className="text-lg font-semibold">Are you sure?</p>
                                <p className="text-sm text-gray-600">
                                  This will permanently delete user "{selectedUser?.name}" and all associated data.
                                </p>
                                <p className="text-sm text-red-600 font-medium">
                                  This action cannot be undone.
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={() => selectedUser && handleDeleteUser(selectedUser)}
                                  variant="destructive"
                                >
                                  Delete User
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
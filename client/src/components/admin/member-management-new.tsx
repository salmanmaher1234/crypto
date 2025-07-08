import { useState, useEffect } from "react";
import { useUsers, useUpdateUser, useCreateUser, useCreateTransaction, useTransactions, useUpdateTransaction } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Edit, Wallet, Lock, Eye, Plus, Minus, LockOpen, UserPlus, Settings, Ban, CheckCircle, XCircle, AlertTriangle, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export function MemberManagement() {
  const { data: users, isLoading } = useUsers();
  const { data: transactions } = useTransactions();
  const updateUser = useUpdateUser();
  const createUser = useCreateUser();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const { toast } = useToast();

  // Auto-refresh user data every 30 seconds to catch balance updates
  // Reduced frequency to prevent interference with manual toggles
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [deductionDialogOpen, setDeductionDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [deductionAmount, setDeductionAmount] = useState("");
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [freezeAmount, setFreezeAmount] = useState("");
  const [unfreezeDialogOpen, setUnfreezeDialogOpen] = useState(false);
  const [unfreezeAmount, setUnfreezeAmount] = useState("");
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    reputation: 100 // Default VIP Level to 100
  });
  const [bankAccountData, setBankAccountData] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: ""
  });

  const filteredUsers = users?.filter(user =>
    user.role === "customer" &&
    ((user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
     (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
     (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!selectedUser) return;

    updateUser.mutate({ id: selectedUser.id, updates }, {
      onSuccess: () => {
        // Invalidate users cache to refresh data instantly
        queryClient.invalidateQueries({ queryKey: ['/api/users'] });
        
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

  const handleQuickUpdate = (user: User, updates: Partial<User>) => {
    // Optimistic update - immediately update the local data
    queryClient.setQueryData(['/api/users'], (oldData: User[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map(u => 
        u.id === user.id ? { ...u, ...updates } : u
      );
    });

    updateUser.mutate({ id: user.id, updates }, {
      onSuccess: () => {
        toast({
          title: "Updated successfully",
          description: "User setting has been updated",
        });
      },
      onError: () => {
        // Revert optimistic update on error
        queryClient.invalidateQueries({ queryKey: ['/api/users'] });
        toast({
          title: "Update failed",
          description: "Failed to update user setting",
          variant: "destructive",
        });
      },
    });
  };

  const handleBalanceAction = (action: string, amount: string, userId: number) => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    const user = users?.find(u => u.id === userId);
    if (!user) return;

    const amountNum = parseFloat(amount);
    const currentBalance = parseFloat(user.balance || "0");
    const currentAvailable = parseFloat(user.availableBalance || "0");

    let newBalance = currentBalance;
    let newAvailable = currentAvailable;

    if (action === "deposit") {
      newBalance = currentBalance + amountNum;
      newAvailable = currentAvailable + amountNum;
    } else if (action === "withdrawal") {
      if (currentAvailable < amountNum) {
        toast({
          title: "Insufficient balance",
          description: "Cannot deduct more than available balance",
          variant: "destructive",
        });
        return;
      }
      newBalance = currentBalance - amountNum;
      newAvailable = currentAvailable - amountNum;
    }

    // Direct balance update
    updateUser.mutate({
      id: userId,
      updates: { 
        balance: newBalance.toString(),
        availableBalance: newAvailable.toString()
      }
    }, {
      onSuccess: () => {
        toast({
          title: `${action.charAt(0).toUpperCase() + action.slice(1)} successful`,
          description: `${action === "deposit" ? "Added" : "Deducted"} $${amount}`,
        });
        setDepositAmount("");
        setDeductionAmount("");
        setDepositDialogOpen(false);
        setDeductionDialogOpen(false);
      },
      onError: () => {
        toast({
          title: `${action.charAt(0).toUpperCase() + action.slice(1)} failed`,
          description: `Failed to process ${action}`,
          variant: "destructive",
        });
      },
    });
  };

  const handleDeposit = () => {
    if (!selectedUser || !depositAmount) return;
    handleBalanceAction("deposit", depositAmount, selectedUser.id);
  };

  const handleDeduction = () => {
    if (!selectedUser || !deductionAmount) return;
    handleBalanceAction("withdrawal", deductionAmount, selectedUser.id);
  };

  const handleFreezeAmount = (user: User, amount: number) => {
    const currentAvailable = parseFloat(user.availableBalance || "0");
    const currentFrozen = parseFloat(user.frozenBalance || "0");
    
    if (currentAvailable < amount) {
      toast({
        title: "Insufficient balance",
        description: "Cannot freeze more than available balance",
        variant: "destructive",
      });
      return;
    }

    // Direct balance update without creating transaction
    updateUser.mutate({
      id: user.id,
      updates: { 
        availableBalance: (currentAvailable - amount).toString(),
        frozenBalance: (currentFrozen + amount).toString()
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Balance frozen",
          description: `$${amount} has been frozen`,
        });
      },
      onError: () => {
        toast({
          title: "Freeze failed",
          description: "Failed to freeze balance",
          variant: "destructive",
        });
      }
    });
  };

  const handleUnfreezeAmount = (user: User, amount: number) => {
    const currentAvailable = parseFloat(user.availableBalance || "0");
    const currentFrozen = parseFloat(user.frozenBalance || "0");
    
    if (currentFrozen === 0) {
      toast({
        title: "No frozen balance",
        description: "User has no frozen balance to unfreeze",
        variant: "destructive",
      });
      return;
    }
    
    const unfreezeAmount = Math.min(amount, currentFrozen);
    
    // Direct balance update without creating transaction
    updateUser.mutate({
      id: user.id,
      updates: { 
        availableBalance: (currentAvailable + unfreezeAmount).toString(),
        frozenBalance: (currentFrozen - unfreezeAmount).toString()
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Balance unfrozen",
          description: `$${unfreezeAmount} has been unfrozen`,
        });
      },
      onError: () => {
        toast({
          title: "Unfreeze failed",
          description: "Failed to unfreeze balance",
          variant: "destructive",
        });
      }
    });
  };

  const handleFreezeSubmit = () => {
    if (!selectedUser || !freezeAmount) return;
    const amount = parseFloat(freezeAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to freeze",
        variant: "destructive",
      });
      return;
    }
    handleFreezeAmount(selectedUser, amount);
    setFreezeAmount("");
    setFreezeDialogOpen(false);
  };

  const handleUnfreezeSubmit = () => {
    if (!selectedUser || !unfreezeAmount) return;
    const amount = parseFloat(unfreezeAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid amount", 
        description: "Please enter a valid amount to unfreeze",
        variant: "destructive",
      });
      return;
    }
    handleUnfreezeAmount(selectedUser, amount);
    setUnfreezeAmount("");
    setUnfreezeDialogOpen(false);
  };

  const handleAddMember = () => {
    const { username, email, password, name, reputation } = newMemberData;
    
    if (!username || !email || !password || !name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createUser.mutate({
      username,
      email,
      password,
      name,
      reputation, // Will default to 100
      role: "customer"
    }, {
      onSuccess: () => {
        toast({
          title: "Member added successfully",
          description: `${name} has been added with VIP Level ${reputation}`,
        });
        setNewMemberData({
          username: "",
          email: "",
          password: "",
          name: "",
          reputation: 100
        });
        setAddMemberDialogOpen(false);
      },
      onError: (error: any) => {
        toast({
          title: "Failed to add member",
          description: error.message || "Please check the information and try again",
          variant: "destructive",
        });
      }
    });
  };



  const handleBankAccountSave = () => {
    if (!selectedUser) return;
    
    // Here you would typically call an API to save bank account
    toast({
      title: "Bank account updated",
      description: "Bank account information has been saved successfully",
    });
    setBankDialogOpen(false);
    setBankAccountData({
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: ""
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
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
          <div className="flex justify-between items-center">
            <CardTitle>Member Management</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter username"
                        value={newMemberData.username}
                        onChange={(e) => setNewMemberData({...newMemberData, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={newMemberData.email}
                        onChange={(e) => setNewMemberData({...newMemberData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={newMemberData.password}
                        onChange={(e) => setNewMemberData({...newMemberData, password: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newMemberData.name}
                        onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reputation">VIP Level (Reputation)</Label>
                      <Input
                        id="reputation"
                        type="number"
                        placeholder="100"
                        value={newMemberData.reputation}
                        onChange={(e) => setNewMemberData({...newMemberData, reputation: parseInt(e.target.value) || 100})}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Default VIP Level is set to 100
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setAddMemberDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMember} className="bg-primary hover:bg-primary/90">
                        Add Member
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance | Freeze</TableHead>
                  <TableHead>Reputation | VIP Level</TableHead>
                  <TableHead>Win or Lose</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Ban</TableHead>
                  <TableHead>Withdrawal is prohibited</TableHead>
                  <TableHead>General Agent</TableHead>
                  <TableHead>Invitation Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Registration Time</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead>Operate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input type="checkbox" className="rounded" />
                    </TableCell>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
                          {(user.username || user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{user.name || user.username}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={user.isActive} 
                        onCheckedChange={(checked) => handleQuickUpdate(user, { isActive: checked })}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Total: {(parseFloat(user.availableBalance || "0") + parseFloat(user.frozenBalance || "0")).toFixed(2)}</div>
                        <div className="text-xs text-green-600">Available: {parseFloat(user.availableBalance || "0").toFixed(2)}</div>
                        <div className="text-xs text-red-500">Frozen: {parseFloat(user.frozenBalance || "0").toFixed(2)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{user.reputation || 85}/100</span>
                          <div className="w-12 h-1 bg-gray-200 rounded-full">
                            <div
                              className="h-1 bg-success rounded-full"
                              style={{ width: `${user.reputation || 85}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">VIP 0</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={user.winLoseSetting || "To Win"} 
                        onValueChange={(value) => handleQuickUpdate(user, { winLoseSetting: value })}
                      >
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="To Win">To Win</SelectItem>
                          <SelectItem value="To Lose">To Lose</SelectItem>
                          <SelectItem value="Random">Random</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={user.direction || "Actual"} 
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
                        checked={user.accountStatus === "Prohibit"} 
                        onCheckedChange={(checked) => handleQuickUpdate(user, { accountStatus: checked ? "Prohibit" : "Active" })}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={user.withdrawalStatus === "Prohibit"} 
                        onCheckedChange={(checked) => handleQuickUpdate(user, { withdrawalStatus: checked ? "Prohibit" : "Allowed" })}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-500">-</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">{user.invitationCode || "-"}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {user.role === "admin" ? "Admin" : "Member"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-500">-</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {/* 1. Change Bank Dialog */}
                        <Dialog open={bankDialogOpen && selectedUser?.id === user.id} onOpenChange={setBankDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              Change a bank
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Change Bank Account</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Account Holder Name</Label>
                                <Input 
                                  value={bankAccountData.accountHolderName}
                                  onChange={(e) => setBankAccountData({...bankAccountData, accountHolderName: e.target.value})}
                                  placeholder="Enter account holder name"
                                />
                              </div>
                              <div>
                                <Label>Account Number</Label>
                                <Input 
                                  value={bankAccountData.accountNumber}
                                  onChange={(e) => setBankAccountData({...bankAccountData, accountNumber: e.target.value})}
                                  placeholder="Enter account number"
                                />
                              </div>
                              <div>
                                <Label>Bank Name</Label>
                                <Input 
                                  value={bankAccountData.bankName}
                                  onChange={(e) => setBankAccountData({...bankAccountData, bankName: e.target.value})}
                                  placeholder="Enter bank name"
                                />
                              </div>
                              <div>
                                <Label>IFSC Code</Label>
                                <Input 
                                  value={bankAccountData.ifscCode}
                                  onChange={(e) => setBankAccountData({...bankAccountData, ifscCode: e.target.value})}
                                  placeholder="Enter IFSC code"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setBankDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleBankAccountSave}>
                                  Save Bank Account
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Details Dialog */}
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
                                    <p className="text-sm font-semibold">${parseFloat(selectedUser.balance || "0").toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Available Balance</Label>
                                    <p className="text-sm">${parseFloat(selectedUser.availableBalance || "0").toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Frozen Balance</Label>
                                    <p className="text-sm">${parseFloat(selectedUser.frozenBalance || "0").toFixed(2)}</p>
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

                        {/* Order Dialog */}
                        <Dialog open={orderDialogOpen && selectedUser?.id === user.id} onOpenChange={setOrderDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Wallet className="w-3 h-3 mr-1" />
                              Order
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>User Orders: {selectedUser?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="text-center py-8 text-gray-500">
                                <Wallet className="w-12 h-12 mx-auto mb-2" />
                                <p>No orders found for this user</p>
                                <p className="text-sm">Orders and trading history will appear here</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* 3. Deposit Dialog */}
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
                                <Label>Current Balance: ${parseFloat(user.balance || "0").toFixed(2)}</Label>
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
                                <Button onClick={handleDeposit} disabled={!depositAmount}>
                                  Deposit ${depositAmount || "0"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* 4. Deduction Dialog */}
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
                                <Label>Current Balance: ${parseFloat(user.balance || "0").toFixed(2)}</Label>
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
                                <Button onClick={handleDeduction} disabled={!deductionAmount} variant="destructive">
                                  Deduct ${deductionAmount || "0"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* 5. Other/Edit Dialog */}
                        <Dialog open={editDialogOpen && selectedUser?.id === user.id} onOpenChange={setEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Other
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit User: {selectedUser?.name}</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Name</Label>
                                    <Input defaultValue={selectedUser.name} />
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <Input defaultValue={selectedUser.email} />
                                  </div>
                                  <div>
                                    <Label>Reputation</Label>
                                    <Input defaultValue={selectedUser.reputation?.toString()} />
                                  </div>
                                  <div>
                                    <Label>Win/Lose Setting</Label>
                                    <Select defaultValue={selectedUser.winLoseSetting}>
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
                                    <Label>Direction</Label>
                                    <Select defaultValue={selectedUser.direction}>
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
                                    <Label>Account Status</Label>
                                    <Select defaultValue={selectedUser.accountStatus}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Prohibit">Prohibit</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => {
                                    handleUpdateUser({});
                                    setEditDialogOpen(false);
                                  }}>
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* 6. Freeze Dialog */}
                        <Dialog open={freezeDialogOpen && selectedUser?.id === user.id} onOpenChange={setFreezeDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
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
                                <Button onClick={handleFreezeSubmit} className="bg-red-600 hover:bg-red-700">
                                  Freeze Amount
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* 7. Unfreeze Dialog */}
                        <Dialog open={unfreezeDialogOpen && selectedUser?.id === user.id} onOpenChange={setUnfreezeDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 px-2 text-xs bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                              onClick={() => setSelectedUser(user)}
                              disabled={parseFloat(user.frozenBalance || "0") === 0}
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
                                <Button onClick={handleUnfreezeSubmit} className="bg-green-600 hover:bg-green-700">
                                  Unfreeze Amount
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* 8. Change group Button */}
                        <Button size="sm" variant="outline" className="h-6 px-2 text-xs bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Change group
                        </Button>
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
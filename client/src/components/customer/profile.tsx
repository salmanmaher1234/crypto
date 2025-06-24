import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useBankAccounts, useCreateBankAccount, useAnnouncements } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Wallet, 
  Shield, 
  CreditCard, 
  Bell, 
  MessageSquare, 
  Info, 
  LogOut,
  Copy,
  Eye,
  ChevronRight,
  ArrowLeft,
  Plus,
  Lock
} from "lucide-react";

export function Profile() {
  const { user, logout } = useAuth();
  const { data: bankAccounts } = useBankAccounts();
  const { data: announcements } = useAnnouncements();
  const createBankAccount = useCreateBankAccount();
  const { toast } = useToast();
  
  const [currentView, setCurrentView] = useState<'main' | 'personal' | 'wallet' | 'digitalwallet' | 'security' | 'platform' | 'announcement' | 'message' | 'about'>('main');
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showBankDialog, setShowBankDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showFundPasswordDialog, setShowFundPasswordDialog] = useState(false);
  const [showPlatformWallet, setShowPlatformWallet] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [fundPasswordData, setFundPasswordData] = useState({
    currentFundPassword: "",
    newFundPassword: "",
    confirmFundPassword: ""
  });
  const [bankFormData, setBankFormData] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: ""
  });

  const userBankAccounts = bankAccounts?.filter(account => account.userId === user?.id) || [];

  const copyUsername = () => {
    if (user?.username) {
      navigator.clipboard.writeText(user.username);
      toast({
        title: "Copied",
        description: "Username copied to clipboard",
      });
    }
  };

  const handleBankAccountSave = () => {
    if (!user) return;
    
    createBankAccount.mutate({
      ...bankFormData,
      userId: user.id,
    }, {
      onSuccess: () => {
        toast({
          title: "Bank account added",
          description: "Bank account has been added successfully",
        });
        setShowBankDialog(false);
        setBankFormData({
          accountHolderName: "",
          bankName: "",
          accountNumber: "",
          ifscCode: ""
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to add bank account",
          variant: "destructive",
        });
      },
    });
  };

  const handleLogout = () => {
    logout.mutate();
  };

  if (!user) return null;

  // Main Profile View
  if (currentView === 'main') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg font-medium">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Info Section */}
            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/api/placeholder/64/64" />
                  <AvatarFallback className="bg-blue-500 text-white text-lg">
                    {user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-1">
                  V1
                </Badge>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-gray-600">UserName:</span>
                  <span className="font-medium">{user.username}</span>
                  <Button variant="ghost" size="sm" onClick={copyUsername}>
                    <Copy className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Real Balance: {parseFloat(user.balance || "0").toFixed(0)}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Frozen Amount: {parseFloat(user.frozenBalance || "0").toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">
                  Credit Score: {user.reputation || 80}
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 text-gray-500" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Recharge
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Recharge Account</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Current Balance: ${parseFloat(user?.balance || "0").toFixed(2)}</Label>
                    </div>
                    <div>
                      <Label>Recharge Amount</Label>
                      <Input 
                        placeholder="Enter amount" 
                        type="number" 
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" onClick={() => setRechargeAmount("100")}>
                        $100
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRechargeAmount("500")}>
                        $500
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRechargeAmount("1000")}>
                        $1000
                      </Button>
                    </div>
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() => {
                        if (rechargeAmount && parseFloat(rechargeAmount) > 0) {
                          toast({
                            title: "Recharge successful",
                            description: `$${rechargeAmount} has been added to your account`,
                          });
                          setRechargeAmount("");
                          setShowRechargeDialog(false);
                        }
                      }}
                      disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
                    >
                      Confirm Recharge ${rechargeAmount || "0"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Available Balance: ${parseFloat(user?.availableBalance || user?.balance || "0").toFixed(2)}</Label>
                    </div>
                    <div>
                      <Label>Withdrawal Amount</Label>
                      <Input 
                        placeholder="Enter amount" 
                        type="number" 
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" onClick={() => setWithdrawAmount("50")}>
                        $50
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setWithdrawAmount("100")}>
                        $100
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setWithdrawAmount("500")}>
                        $500
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Withdrawal fee: 2% • Processing time: 1-3 business days
                    </div>
                    <Button 
                      className="w-full bg-purple-500 hover:bg-purple-600"
                      onClick={() => {
                        const amount = parseFloat(withdrawAmount);
                        const available = parseFloat(user?.availableBalance || user?.balance || "0");
                        if (withdrawAmount && amount > 0 && amount <= available) {
                          toast({
                            title: "Withdrawal requested",
                            description: `$${withdrawAmount} withdrawal request submitted`,
                          });
                          setWithdrawAmount("");
                          setShowWithdrawDialog(false);
                        } else if (amount > available) {
                          toast({
                            title: "Insufficient funds",
                            description: "Amount exceeds available balance",
                            variant: "destructive",
                          });
                        }
                      }}
                      disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                    >
                      Confirm Withdrawal ${withdrawAmount || "0"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Menu Options */}
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-between h-12"
                onClick={() => setCurrentView('personal')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Personal Information</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-between h-12"
                onClick={() => setCurrentView('wallet')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span>My Wallet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-between h-12"
                onClick={() => setCurrentView('security')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Security Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-between h-12"
                onClick={() => setCurrentView('platform')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-red-600" />
                  </div>
                  <span>Platform Wallet</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-between h-12"
                onClick={() => setCurrentView('announcement')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Bell className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span>Site Announcement</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-between h-12"
                onClick={() => setCurrentView('message')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>Site Message</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-between h-12"
                onClick={() => setCurrentView('about')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Info className="w-4 h-4 text-cyan-600" />
                  </div>
                  <span>About Company</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            {/* Logout Button */}
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white mt-6"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Wallet View
  if (currentView === 'wallet') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="flex-1 text-center text-lg font-medium">My Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">$</span>
                    </div>
                    <span className="font-medium">Digital Wallet</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Balance:</span>
                    <span className="font-medium">${parseFloat(user?.balance || "0").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium text-green-600">${parseFloat(user?.availableBalance || "0").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frozen:</span>
                    <span className="font-medium text-red-600">${parseFloat(user?.frozenBalance || "0").toFixed(2)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => setCurrentView('digitalwallet')}>
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowWithdrawDialog(true)}>
                    Withdraw
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              variant="ghost" 
              className="w-full justify-between h-12 bg-white"
              onClick={() => setShowBankDialog(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <span>Bank Wallet</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </Button>

            {/* Show existing bank accounts */}
            {userBankAccounts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">Your Bank Accounts</h3>
                {userBankAccounts.map((account) => (
                  <div key={account.id} className="p-3 bg-white rounded-lg border">
                    <div className="font-medium">{account.bankName}</div>
                    <div className="text-sm text-gray-600">{account.accountHolderName}</div>
                    <div className="text-sm text-gray-600">****{account.accountNumber.slice(-4)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Bank Account Dialog */}
        <Dialog open={showBankDialog} onOpenChange={setShowBankDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">Add Bank Wallet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Please enter holder's name"
                  value={bankFormData.accountHolderName}
                  onChange={(e) => setBankFormData({...bankFormData, accountHolderName: e.target.value})}
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Input
                  placeholder="Please enter bank name"
                  value={bankFormData.bankName}
                  onChange={(e) => setBankFormData({...bankFormData, bankName: e.target.value})}
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Input
                  placeholder="Please enter A/C No"
                  value={bankFormData.accountNumber}
                  onChange={(e) => setBankFormData({...bankFormData, accountNumber: e.target.value})}
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Input
                  placeholder="Please enter IFSC Code"
                  value={bankFormData.ifscCode}
                  onChange={(e) => setBankFormData({...bankFormData, ifscCode: e.target.value})}
                  className="bg-gray-50"
                />
              </div>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={handleBankAccountSave}
                disabled={createBankAccount.isPending}
              >
                {createBankAccount.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Digital Wallet View
  if (currentView === 'digitalwallet') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('wallet')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="flex-1 text-center text-lg font-medium">Digital Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userBankAccounts.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Wallet Added</h3>
                <p className="text-sm text-gray-500 mb-6">Add a bank account to start using your digital wallet</p>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => setShowBankDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bank Account
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white">
                  <h3 className="font-medium mb-2">Digital Wallet Balance</h3>
                  <div className="text-2xl font-bold">${parseFloat(user?.balance || "0").toFixed(2)}</div>
                  <div className="text-sm opacity-90">Available: ${parseFloat(user?.availableBalance || "0").toFixed(2)}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-green-500 hover:bg-green-600" onClick={() => setShowRechargeDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Deposit
                  </Button>
                  <Button variant="outline" onClick={() => setShowWithdrawDialog(true)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Withdraw
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Linked Bank Accounts</h4>
                  {userBankAccounts.map((account) => (
                    <div key={account.id} className="p-3 bg-white rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{account.bankName}</div>
                          <div className="text-sm text-gray-600">{account.accountHolderName}</div>
                          <div className="text-sm text-gray-500">****{account.accountNumber.slice(-4)}</div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowBankDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Bank Account
                  </Button>
                </div>
              </div>
            )}

            {/* Add Bank Account Dialog */}
            <Dialog open={showBankDialog} onOpenChange={setShowBankDialog}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle className="text-center">Add Bank Wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Please enter holder's name"
                      value={bankFormData.accountHolderName}
                      onChange={(e) => setBankFormData({...bankFormData, accountHolderName: e.target.value})}
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Please enter bank name"
                      value={bankFormData.bankName}
                      onChange={(e) => setBankFormData({...bankFormData, bankName: e.target.value})}
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Please enter A/C No"
                      value={bankFormData.accountNumber}
                      onChange={(e) => setBankFormData({...bankFormData, accountNumber: e.target.value})}
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Please enter IFSC Code"
                      value={bankFormData.ifscCode}
                      onChange={(e) => setBankFormData({...bankFormData, ifscCode: e.target.value})}
                      className="bg-gray-50"
                    />
                  </div>
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleBankAccountSave}
                    disabled={createBankAccount.isPending}
                  >
                    {createBankAccount.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Other views (Personal Info, Security, etc.)
  const renderSubView = (title: string, content: React.ReactNode) => (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center space-y-0 pb-4">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="flex-1 text-center text-lg font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    </div>
  );

  if (currentView === 'personal') {
    return renderSubView('Personal Information', (
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-gray-600">Username</Label>
            <div className="p-3 bg-gray-50 rounded border">{user.username}</div>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Email</Label>
            <div className="p-3 bg-gray-50 rounded border">{user.email}</div>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Name</Label>
            <div className="p-3 bg-gray-50 rounded border">{user.name}</div>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Account Status</Label>
            <div className="p-3 bg-gray-50 rounded border">
              <Badge variant={user.isActive ? "default" : "destructive"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  if (currentView === 'security') {
    return renderSubView('Security Settings', (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full justify-start h-12"
          onClick={() => setShowPasswordDialog(true)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <span>Change Login Password</span>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start h-12"
          onClick={() => setShowFundPasswordDialog(true)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Lock className="w-4 h-4 text-green-600" />
            </div>
            <span>Change Fund Password</span>
          </div>
        </Button>
        
        <Button variant="outline" className="w-full justify-start h-12">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <span>Two-Factor Authentication</span>
          </div>
        </Button>
        
        <Button variant="outline" className="w-full justify-start h-12">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Eye className="w-4 h-4 text-orange-600" />
            </div>
            <span>Login History</span>
          </div>
        </Button>

        {/* Change Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Change Login Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                />
              </div>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  if (passwordData.newPassword === passwordData.confirmPassword) {
                    toast({
                      title: "Password updated",
                      description: "Login password has been changed successfully",
                    });
                    setShowPasswordDialog(false);
                    setPasswordData({currentPassword: "", newPassword: "", confirmPassword: ""});
                  } else {
                    toast({
                      title: "Error",
                      description: "Passwords don't match",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Update Password
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Change Fund Password Dialog */}
        <Dialog open={showFundPasswordDialog} onOpenChange={setShowFundPasswordDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Change Fund Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Fund Password</Label>
                <Input
                  type="password"
                  value={fundPasswordData.currentFundPassword}
                  onChange={(e) => setFundPasswordData({...fundPasswordData, currentFundPassword: e.target.value})}
                  placeholder="Enter current fund password"
                />
              </div>
              <div>
                <Label>New Fund Password</Label>
                <Input
                  type="password"
                  value={fundPasswordData.newFundPassword}
                  onChange={(e) => setFundPasswordData({...fundPasswordData, newFundPassword: e.target.value})}
                  placeholder="Enter new fund password"
                />
              </div>
              <div>
                <Label>Confirm New Fund Password</Label>
                <Input
                  type="password"
                  value={fundPasswordData.confirmFundPassword}
                  onChange={(e) => setFundPasswordData({...fundPasswordData, confirmFundPassword: e.target.value})}
                  placeholder="Confirm new fund password"
                />
              </div>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => {
                  if (fundPasswordData.newFundPassword === fundPasswordData.confirmFundPassword) {
                    toast({
                      title: "Fund password updated",
                      description: "Fund password has been changed successfully",
                    });
                    setShowFundPasswordDialog(false);
                    setFundPasswordData({currentFundPassword: "", newFundPassword: "", confirmFundPassword: ""});
                  } else {
                    toast({
                      title: "Error",
                      description: "Fund passwords don't match",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Update Fund Password
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    ));
  }

  if (currentView === 'platform') {
    return renderSubView('Platform Wallet', (
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-8 h-8" />
              <span className="font-medium text-lg">Platform Wallet</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Platform Balance:</span>
              <span className="font-bold">${parseFloat(user?.balance || "0").toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Rewards Earned:</span>
              <span className="font-bold">$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Trading Bonus:</span>
              <span className="font-bold">$0.00</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-purple-500 hover:bg-purple-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Top Up
          </Button>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Transfer
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Recent Platform Transactions</h3>
          <div className="space-y-2">
            <div className="p-3 bg-white rounded-lg border flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">Welcome Bonus</div>
                <div className="text-xs text-gray-500">Platform reward</div>
              </div>
              <div className="text-green-600 font-medium">+$10.00</div>
            </div>
            <div className="p-3 bg-white rounded-lg border flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">Trading Fee</div>
                <div className="text-xs text-gray-500">Platform charge</div>
              </div>
              <div className="text-red-600 font-medium">-$2.50</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Platform Benefits</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Lower trading fees</li>
            <li>• Priority customer support</li>
            <li>• Exclusive investment opportunities</li>
            <li>• Enhanced security features</li>
          </ul>
        </div>
      </div>
    ));
  }

  if (currentView === 'announcement') {
    return renderSubView('Site Announcements', (
      <div className="space-y-4">
        {announcements && announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement.id} className="p-4 bg-white rounded-lg border">
              <h3 className="font-medium mb-2">{announcement.title}</h3>
              <p className="text-sm text-gray-600">{announcement.content}</p>
              <div className="text-xs text-gray-400 mt-2">
                {new Date(announcement.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No announcements</p>
          </div>
        )}
      </div>
    ));
  }

  if (currentView === 'message') {
    return renderSubView('Site Messages', (
      <div className="space-y-4">
        <div className="text-center py-8">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No messages</p>
          <p className="text-sm text-gray-500">You'll see important messages here</p>
        </div>
      </div>
    ));
  }

  if (currentView === 'about') {
    return renderSubView('About Company', (
      <div className="space-y-4">
        <div className="text-center py-4">
          <h3 className="text-lg font-medium mb-4">CryptoInvest Pro</h3>
          <p className="text-sm text-gray-600 mb-4">
            Leading cryptocurrency investment platform providing secure and reliable trading services.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Version: 1.0.0</p>
            <p>Support: support@cryptoinvest.pro</p>
            <p>© 2024 CryptoInvest Pro. All rights reserved.</p>
          </div>
        </div>
      </div>
    ));
  }

  return null;
}
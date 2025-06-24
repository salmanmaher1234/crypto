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
  Plus
} from "lucide-react";

export function Profile() {
  const { user, logout } = useAuth();
  const { data: bankAccounts } = useBankAccounts();
  const { data: announcements } = useAnnouncements();
  const createBankAccount = useCreateBankAccount();
  const { toast } = useToast();
  
  const [currentView, setCurrentView] = useState<'main' | 'personal' | 'wallet' | 'security' | 'platform' | 'announcement' | 'message' | 'about'>('main');
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showBankDialog, setShowBankDialog] = useState(false);
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
                      <Label>Amount</Label>
                      <Input placeholder="Enter amount" type="number" />
                    </div>
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      Confirm Recharge
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
                      <Label>Amount</Label>
                      <Input placeholder="Enter amount" type="number" />
                    </div>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600">
                      Confirm Withdrawal
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
            <Button 
              variant="ghost" 
              className="w-full justify-between h-12 bg-white"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">$</span>
                </div>
                <span>Digital Wallet</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>

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
        <Button variant="outline" className="w-full justify-start">
          Change Login Password
        </Button>
        <Button variant="outline" className="w-full justify-start">
          Change Fund Password
        </Button>
        <Button variant="outline" className="w-full justify-start">
          Two-Factor Authentication
        </Button>
        <Button variant="outline" className="w-full justify-start">
          Login History
        </Button>
      </div>
    ));
  }

  if (currentView === 'platform') {
    return renderSubView('Platform Wallet', (
      <div className="space-y-4">
        <div className="text-center py-8">
          <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Platform wallet features</p>
          <p className="text-sm text-gray-500">Manage your platform payments and earnings</p>
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
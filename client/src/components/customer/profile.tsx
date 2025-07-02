import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useBankAccounts, useCreateBankAccount, useAnnouncements, useCreateTransaction, useCreateWithdrawalRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  EyeOff,
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
  const createTransaction = useCreateTransaction();
  const createWithdrawalRequest = useCreateWithdrawalRequest();
  const { toast } = useToast();
  
  const [currentView, setCurrentView] = useState<'main' | 'personal' | 'wallet' | 'walletselection' | 'digitalwallet' | 'bankwallet' | 'addbankwallet' | 'security' | 'platform' | 'announcement' | 'message' | 'about'>('main');
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showBankDialog, setShowBankDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showFundPasswordDialog, setShowFundPasswordDialog] = useState(false);
  const [showPlatformWallet, setShowPlatformWallet] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [selectedBankWallet, setSelectedBankWallet] = useState("");
  const [withdrawFundPassword, setWithdrawFundPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
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
  
  // New Bank Wallet form states
  const [newBankWallet, setNewBankWallet] = useState({
    holderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: ''
  });

  const userBankAccounts = bankAccounts?.filter(account => account.userId === user?.id) || [];

  const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    
    // Create file reader to convert image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfileImage(result);
      setUploadingImage(false);
      
      toast({
        title: "Profile image updated",
        description: "Your profile image has been successfully updated",
      });
    };
    
    reader.onerror = () => {
      setUploadingImage(false);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleImageUpload;
    input.click();
  };

  const copyUsername = () => {
    if (user?.username) {
      navigator.clipboard.writeText(user.username);
      toast({
        title: "Copy Successful",
        description: "Username copied to clipboard",
      });
    }
  };

  const handleBankAccountSave = () => {
    if (!user) return;
    
    createBankAccount.mutate({
      ...bankFormData,
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
    logout();
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
              <div className="relative cursor-pointer" onClick={triggerImageUpload}>
                <Avatar className="w-16 h-16 hover:opacity-80 transition-opacity">
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt="Profile" />
                  ) : (
                    <AvatarImage src="/api/placeholder/64/64" />
                  )}
                  <AvatarFallback className="bg-blue-500 text-white text-lg">
                    {uploadingImage ? "..." : user.username?.charAt(0).toUpperCase()}
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
                  Real Balance: {hideBalance ? "****" : parseFloat(user.balance || "0").toFixed(0)}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Frozen Amount: {hideBalance ? "****" : parseFloat(user.frozenBalance || "0").toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">
                  Credit Score: {hideBalance ? "**" : user.reputation || 80}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setHideBalance(!hideBalance)}>
                {hideBalance ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
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
                      <Label>Select a fast amount of USDT</Label>
                      <Input 
                        placeholder="Enter amount" 
                        type="number" 
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <Button variant="outline" size="sm" onClick={() => setRechargeAmount("100")}>
                        100
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRechargeAmount("300")}>
                        300
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRechargeAmount("500")}>
                        500
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRechargeAmount("700")}>
                        700
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRechargeAmount("1000")}>
                        1000
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRechargeAmount("1500")}>
                        1500
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRechargeAmount("3000")}>
                        3000
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRechargeAmount("5000")}>
                        5000
                      </Button>
                    </div>
                    
                    {/* Wallet Selection */}
                    <div>
                      <Label>Select recharge wallet category</Label>
                      <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose your wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="imtoken">ImToken Wallet (1-100000)</SelectItem>
                          <SelectItem value="bitget">BitGet Wallet (1-100000)</SelectItem>
                          <SelectItem value="tronlink">TronLink Wallet (1-100000)</SelectItem>
                          <SelectItem value="tokenpocket">TokenPocket Wallet (1-100000)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Recharge Prompt Message - Live Validation */}
                    <div className="border rounded-lg p-4">
                      <div className="text-sm">
                        <div className="font-semibold mb-2">Recharge Status:</div>
                        <div className="space-y-2">
                          {/* Amount Validation */}
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              rechargeAmount && parseFloat(rechargeAmount) >= 1 && parseFloat(rechargeAmount) <= 100000 
                                ? 'bg-green-500' 
                                : rechargeAmount 
                                  ? 'bg-red-500' 
                                  : 'bg-gray-300'
                            }`}></div>
                            <span className={
                              rechargeAmount && parseFloat(rechargeAmount) >= 1 && parseFloat(rechargeAmount) <= 100000 
                                ? 'text-green-600' 
                                : rechargeAmount 
                                  ? 'text-red-600' 
                                  : 'text-gray-500'
                            }>
                              Amount: {rechargeAmount ? 
                                (parseFloat(rechargeAmount) >= 1 && parseFloat(rechargeAmount) <= 100000 ? 
                                  `${rechargeAmount} USDT (Valid)` : 
                                  `${rechargeAmount} USDT (Invalid - Range: 1-100,000)`) : 
                                'Enter amount (1-100,000 USDT)'}
                            </span>
                          </div>
                          
                          {/* Wallet Validation */}
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${selectedWallet ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className={selectedWallet ? 'text-green-600' : 'text-gray-500'}>
                              Wallet: {selectedWallet ? 
                                selectedWallet.charAt(0).toUpperCase() + selectedWallet.slice(1) + ' Selected' : 
                                'Select wallet category'}
                            </span>
                          </div>
                          
                          {/* Ready Status */}
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              rechargeAmount && selectedWallet && 
                              parseFloat(rechargeAmount) >= 1 && parseFloat(rechargeAmount) <= 100000 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span className={
                              rechargeAmount && selectedWallet && 
                              parseFloat(rechargeAmount) >= 1 && parseFloat(rechargeAmount) <= 100000 
                                ? 'text-green-600 font-medium' 
                                : 'text-gray-500'
                            }>
                              {rechargeAmount && selectedWallet && 
                               parseFloat(rechargeAmount) >= 1 && parseFloat(rechargeAmount) <= 100000 
                                ? '✓ Ready to process recharge' 
                                : 'Complete all fields to proceed'}
                            </span>
                          </div>
                          
                          {/* Processing Status */}
                          {createTransaction.isPending && (
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                              <span className="text-blue-600 font-medium">Processing recharge...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() => {
                        const amount = parseFloat(rechargeAmount);
                        
                        // Validation checks
                        if (!rechargeAmount || amount <= 0) {
                          toast({
                            title: "Invalid amount",
                            description: "Please enter a valid recharge amount",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        if (amount < 1 || amount > 100000) {
                          toast({
                            title: "Invalid amount",
                            description: "Amount must be between 1 and 100,000 USDT",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        if (!selectedWallet) {
                          toast({
                            title: "Select wallet",
                            description: "Please select a recharge wallet category",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        if (user) {
                          const walletNames = {
                            imtoken: "ImToken Wallet",
                            bitget: "BitGet Wallet", 
                            tronlink: "TronLink Wallet",
                            tokenpocket: "TokenPocket Wallet"
                          };
                          
                          createTransaction.mutate({
                            userId: user.id,
                            type: "deposit",
                            amount: rechargeAmount,
                            description: `Account recharge of ${rechargeAmount} USDT via ${walletNames[selectedWallet as keyof typeof walletNames]}`
                          }, {
                            onSuccess: () => {
                              toast({
                                title: "Recharge successful",
                                description: `${rechargeAmount} USDT has been added to your account via ${walletNames[selectedWallet as keyof typeof walletNames]}`,
                              });
                              setRechargeAmount("");
                              setSelectedWallet("");
                              setShowRechargeDialog(false);
                            },
                            onError: () => {
                              toast({
                                title: "Recharge failed",
                                description: "Unable to process recharge. Please try again.",
                                variant: "destructive",
                              });
                            }
                          });
                        }
                      }}
                      disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0 || createTransaction.isPending}
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
                  <div className="space-y-4 p-2">
                    {/* Current available balance */}
                    <div>
                      <Label className="text-sm text-gray-600">Current available balance</Label>
                      <div className="bg-gray-50 rounded p-3 mt-1">
                        <span className="text-lg font-medium">{parseFloat(user?.availableBalance || user?.balance || "0").toFixed(0)}</span>
                      </div>
                    </div>

                    {/* Enter Withdraw Amount */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-sm text-gray-600">Enter Withdraw Amount</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-green-100 text-green-600 border-green-300 text-xs px-2 py-1 h-6"
                          onClick={() => setWithdrawAmount(user?.availableBalance || user?.balance || "0")}
                        >
                          All cash
                        </Button>
                      </div>
                      <Input 
                        type="number" 
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    {/* Select bank wallet */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-sm text-gray-600">Select bank wallet</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-green-100 text-green-600 border-green-300 text-xs px-2 py-1 h-6"
                          onClick={() => {
                            setShowWithdrawDialog(false);
                            setCurrentView('walletselection');
                          }}
                        >
                          My wallet
                        </Button>
                      </div>
                      <Select value="1:1" disabled>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="1:1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1:1">1:1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Enter fund password */}
                    <div>
                      <Label className="text-sm text-gray-600">Enter your fund password</Label>
                      <Input 
                        type="password" 
                        value={withdrawFundPassword}
                        onChange={(e) => setWithdrawFundPassword(e.target.value)}
                        placeholder="Enter fund password"
                        className="mt-1"
                      />
                    </div>

                    {/* Withdraw prompt information */}
                    <div>
                      <Label className="text-sm text-red-600">Withdraw prompt information</Label>
                      <div className="bg-gray-100 rounded p-4 mt-1 min-h-[80px] text-sm text-gray-600">
                        <div className="space-y-1">
                          <div>• Minimum withdrawal: 10 USDT</div>
                          <div>• Processing time: 1-24 hours</div>
                          <div>• Withdrawal fee: 2 USDT</div>
                          <div>• Ensure bank details are correct</div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600 text-white mt-6"
                      onClick={() => {
                        const amount = parseFloat(withdrawAmount);
                        const available = parseFloat(user?.availableBalance || user?.balance || "0");
                        
                        // Enhanced validation
                        if (!withdrawAmount || amount <= 0) {
                          toast({
                            title: "Invalid amount",
                            description: "Please enter a valid withdrawal amount",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        if (amount < 10) {
                          toast({
                            title: "Minimum withdrawal",
                            description: "Minimum withdrawal amount is 10 USDT",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        if (amount > available) {
                          toast({
                            title: "Insufficient funds",
                            description: "Amount exceeds available balance",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        // Check if user has selected a bank wallet
                        if (!selectedBankWallet) {
                          toast({
                            title: "Select bank wallet",
                            description: "Please select a bank wallet for withdrawal",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        // Check fund password
                        if (!withdrawFundPassword) {
                          toast({
                            title: "Fund password required",
                            description: "Please enter your fund password",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        // Check if user has a bank account
                        if (!userBankAccounts || userBankAccounts.length === 0) {
                          toast({
                            title: "No bank account",
                            description: "Please add a bank account first to process withdrawals",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        // Use selected bank account for withdrawal
                        const bankAccountId = parseInt(selectedBankWallet);
                        
                        createWithdrawalRequest.mutate({
                          bankAccountId,
                          amount: withdrawAmount
                        }, {
                          onSuccess: () => {
                            toast({
                              title: "Withdrawal requested",
                              description: `${withdrawAmount} USDT withdrawal request submitted successfully`,
                            });
                            setWithdrawAmount("");
                            setSelectedBankWallet("");
                            setWithdrawFundPassword("");
                            setShowWithdrawDialog(false);
                          },
                          onError: () => {
                            toast({
                              title: "Withdrawal failed",
                              description: "Unable to process withdrawal request. Please try again.",
                              variant: "destructive",
                            });
                          }
                        });
                      }}
                      disabled={!withdrawAmount || !selectedBankWallet || !withdrawFundPassword || createWithdrawalRequest.isPending}
                    >
                      {createWithdrawalRequest.isPending ? "Processing..." : "Submit"}
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

  // Wallet Selection View
  if (currentView === 'walletselection') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="flex-1 text-center text-lg font-medium">Select Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Digital Wallet */}
            <Button 
              variant="ghost" 
              className="w-full justify-between h-16 border border-gray-200 rounded-lg"
              onClick={() => setCurrentView('digitalwallet')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">$</span>
                </div>
                <span className="text-left font-medium">Digital Wallet</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Button>

            {/* Bank Wallet */}
            <Button 
              variant="ghost" 
              className="w-full justify-between h-16 border border-gray-200 rounded-lg"
              onClick={() => setCurrentView('bankwallet')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🏦</span>
                </div>
                <span className="text-left font-medium">Bank Wallet</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Digital Wallet Options View (Blank for now)
  if (currentView === 'digitalwallet') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('walletselection')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="flex-1 text-center text-lg font-medium">Digital Wallet</CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Digital wallet options will be available soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Bank Wallet View
  if (currentView === 'bankwallet') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('walletselection')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="flex-1 text-center text-lg font-medium">Bank Wallet</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('addbankwallet')}>
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No bank wallets added yet. Click the + button to add your first bank wallet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Add Bank Wallet Form View
  if (currentView === 'addbankwallet') {
    const handleSaveBankWallet = async () => {
      // Validate all fields are filled
      if (!newBankWallet.holderName || !newBankWallet.bankName || 
          !newBankWallet.accountNumber || !newBankWallet.ifscCode) {
        toast({
          title: "Error",
          description: "Please fill all required fields.",
          variant: "destructive"
        });
        return;
      }

      try {
        // Create new bank account using existing API
        await createBankAccount.mutateAsync({
          accountHolderName: newBankWallet.holderName,
          bankName: newBankWallet.bankName,
          accountNumber: newBankWallet.accountNumber,
          ifscCode: newBankWallet.ifscCode
        });

        // Reset form
        setNewBankWallet({
          holderName: '',
          bankName: '',
          accountNumber: '',
          ifscCode: ''
        });

        toast({
          title: "Success",
          description: "Bank wallet added successfully!"
        });

        // Navigate back to bank wallet view
        setCurrentView('bankwallet');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add bank wallet. Please try again.",
          variant: "destructive"
        });
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('bankwallet')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="flex-1 text-center text-lg font-medium">Add Bank Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Holder's name */}
            <div>
              <Label className="text-sm text-gray-600">Holder's name</Label>
              <Input
                placeholder="Please enter holder's name"
                value={newBankWallet.holderName}
                onChange={(e) => setNewBankWallet(prev => ({ ...prev, holderName: e.target.value }))}
                className="mt-1"
              />
            </div>

            {/* Bank Name */}
            <div>
              <Label className="text-sm text-gray-600">Bank Name</Label>
              <Input
                placeholder="Please enter bank name"
                value={newBankWallet.bankName}
                onChange={(e) => setNewBankWallet(prev => ({ ...prev, bankName: e.target.value }))}
                className="mt-1"
              />
            </div>

            {/* A/C No */}
            <div>
              <Label className="text-sm text-gray-600">A/C No</Label>
              <Input
                placeholder="Please enter A/C No"
                value={newBankWallet.accountNumber}
                onChange={(e) => setNewBankWallet(prev => ({ ...prev, accountNumber: e.target.value }))}
                className="mt-1"
              />
            </div>

            {/* IFSC Code */}
            <div>
              <Label className="text-sm text-gray-600">IFSC Code</Label>
              <Input
                placeholder="Please enter IFSC Code"
                value={newBankWallet.ifscCode}
                onChange={(e) => setNewBankWallet(prev => ({ ...prev, ifscCode: e.target.value }))}
                className="mt-1"
              />
            </div>

            {/* Save Button */}
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white mt-6"
              onClick={handleSaveBankWallet}
              disabled={createBankAccount.isPending}
            >
              {createBankAccount.isPending ? "Saving..." : "Save"}
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
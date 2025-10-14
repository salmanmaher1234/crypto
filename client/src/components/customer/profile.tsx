import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User,
  Wallet,
  Shield,
  CreditCard,
  Megaphone,
  MessageCircle,
  Info,
  ArrowRight,
  Eye,
  EyeOff,
  Copy,
  Home,
  Key,
  Globe
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BankAccount } from "@shared/schema";
import { UserMessages } from "./user-messages";
import { useLocation } from "wouter";

export function Profile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<'main' | 'settings' | 'collection' | 'authentication' | 'userMessage' | 'helpCenter' | 'loginPassword' | 'switchLanguage' | 'capitalCode' | 'addBank'>('main');
  const [fundsPassword, setFundsPassword] = useState<string[]>(Array(6).fill(''));
  const [showBalance, setShowBalance] = useState(true);
  const [bankForm, setBankForm] = useState({
    bindingType: 'Bank Card',
    currency: 'INR',
    accountNumber: '',
    accountHolderName: '',
    bankName: '',
    branchName: '',
    ifscCode: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(user.username);
    toast({
      title: "Copied!",
      description: "Username copied to clipboard",
    });
  };

  // Fetch user's bank accounts
  const { data: bankAccounts = [], isLoading: bankAccountsLoading } = useQuery<BankAccount[]>({
    queryKey: ["/api/bank-accounts"],
    enabled: currentView === 'collection'
  });

  // Create bank account mutation
  const createBankAccount = useMutation({
    mutationFn: async (data: typeof bankForm) => {
      const res = await apiRequest('POST', '/api/bank-accounts', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Bank Account Added",
        description: "Your bank account has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bank-accounts"] });
      setBankForm({
        bindingType: 'Bank Card',
        currency: 'INR',
        accountNumber: '',
        accountHolderName: '',
        bankName: '',
        branchName: '',
        ifscCode: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add bank account",
        variant: "destructive",
      });
    }
  });

  const handleCreateBankAccount = () => {
    if (!bankForm.accountHolderName || !bankForm.accountNumber || !bankForm.bankName) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createBankAccount.mutate(bankForm);
  };

  // Collection Information Page
  if (currentView === 'collection') {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 sm:pb-20 md:pb-24">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('main')}
              className="p-1 mr-2"
              data-testid="button-back"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          <h1 className="text-lg font-medium text-gray-900">Platform Wallet</h1>
          <div className="w-8"></div>
        </div>

        {/* Content */}
        <div className="p-4 pb-24">
          {bankAccountsLoading ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-sm">Loading bank accounts...</div>
            </div>
          ) : (
            <>
              {/* Existing Bank Accounts */}
              {bankAccounts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Your Bank Accounts</h3>
                  <div className="space-y-3">
                    {bankAccounts.map((account) => (
                      <div key={account.id} className="bg-white rounded-lg border border-gray-200 p-4" data-testid={`bank-account-${account.id}`}>
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900">{account.bankName}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Account Holder:</span>
                              <div className="text-gray-800">{account.accountHolderName}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Account Number:</span>
                              <div className="text-gray-800">***{account.accountNumber.slice(-4)}</div>
                            </div>
                            {account.ifscCode && (
                              <div>
                                <span className="text-gray-500">IFSC Code:</span>
                                <div className="text-gray-800">{account.ifscCode}</div>
                              </div>
                            )}
                            {account.branchName && (
                              <div>
                                <span className="text-gray-500">Branch:</span>
                                <div className="text-gray-800">{account.branchName}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Bank Account Form */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Add New Bank Account</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Binding Type
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={bankForm.bindingType === 'Bank Card' ? 'default' : 'outline'}
                        onClick={() => setBankForm({ ...bankForm, bindingType: 'Bank Card' })}
                        className="px-4 py-2 rounded"
                        style={{
                          background: bankForm.bindingType === 'Bank Card' ? '#7CB342' : 'transparent',
                          color: bankForm.bindingType === 'Bank Card' ? 'white' : '#666',
                          border: '1px solid #ddd'
                        }}
                        data-testid="button-bank-card"
                      >
                        Bank Card
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={bankForm.currency === 'INR' ? 'default' : 'outline'}
                        onClick={() => setBankForm({ ...bankForm, currency: 'INR' })}
                        className="px-4 py-2 rounded"
                        style={{
                          background: bankForm.currency === 'INR' ? '#7CB342' : 'transparent',
                          color: bankForm.currency === 'INR' ? 'white' : '#666',
                          border: '1px solid #ddd'
                        }}
                        data-testid="button-currency"
                      >
                        INR
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number
                    </label>
                    <Input
                      type="text"
                      value={bankForm.accountNumber}
                      onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                      placeholder=""
                      className="w-full"
                      data-testid="input-account-number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Holder
                    </label>
                    <Input
                      type="text"
                      value={bankForm.accountHolderName}
                      onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                      placeholder=""
                      className="w-full"
                      data-testid="input-account-holder"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <Input
                      type="text"
                      value={bankForm.bankName}
                      onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                      placeholder=""
                      className="w-full"
                      data-testid="input-bank-name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Name
                    </label>
                    <Input
                      type="text"
                      value={bankForm.branchName}
                      onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })}
                      placeholder=""
                      className="w-full"
                      data-testid="input-branch-name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IFSC Code
                    </label>
                    <Input
                      type="text"
                      value={bankForm.ifscCode}
                      onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value })}
                      placeholder=""
                      className="w-full"
                      data-testid="input-ifsc-code"
                    />
                  </div>

                  <Button
                    onClick={handleCreateBankAccount}
                    disabled={createBankAccount.isPending}
                    className="w-full h-12 text-white font-medium rounded-lg bg-[#7CB342] hover:bg-[#6DA33A]"
                    data-testid="button-add-bank"
                  >
                    {createBankAccount.isPending ? "Adding..." : "Add Bank Account"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Authentication Page
  if (currentView === 'authentication') {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 sm:pb-20 md:pb-24">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('main')}
              className="p-1 mr-2"
              data-testid="button-back"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          <h1 className="text-lg font-medium text-gray-900">Security Settings</h1>
          <div className="w-8"></div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Basic Authentication */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">Basic Authentication</h3>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Completed</span>
            </div>
            <p className="text-xs text-gray-500">
              Complete basic email or mobile phone authentication, therefore, the fund transaction will be automatically notified by e-mail or mobile phone, and the market dynamics will be immediately tracked
            </p>
          </div>

          {/* Identity Authentication */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">Identity Authentication</h3>
              <span className="text-xs text-gray-500">Not authenticated</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Authentication of True Identity Information. We will arrange a 7*24 hour dedicated VIP customer service manager to analysis for you
            </p>
            
            <Button
              className="w-full h-12 text-white font-medium rounded-lg bg-[#7CB342] hover:bg-[#6DA33A]"
              data-testid="button-start-auth"
            >
              Start Authentication
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User Message Page
  if (currentView === 'userMessage') {
    return <UserMessages onBack={() => setCurrentView('main')} />;
  }

  // Help Center Page
  if (currentView === 'helpCenter') {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 sm:pb-20 md:pb-24">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('main')}
              className="p-1 mr-2"
              data-testid="button-back"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          <h1 className="text-lg font-medium text-gray-900">About Company</h1>
          <div className="w-8"></div>
        </div>

        {/* Empty Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <div className="text-lg mb-2">About Company</div>
            <div className="text-sm">Information about the company.</div>
          </div>
        </div>
      </div>
    );
  }

  // Settings Page
  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 sm:pb-20 md:pb-24">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('main')}
              className="p-1 mr-2"
              data-testid="button-back"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          <h1 className="text-lg font-medium text-gray-900">Site Announcement</h1>
          <div className="w-8"></div>
        </div>

        {/* Empty Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <div className="text-lg mb-2">No Announcements</div>
            <div className="text-sm">Check back later for updates.</div>
          </div>
        </div>
      </div>
    );
  }

  // Main Profile Page
  return (
    <div className="min-h-screen bg-white pb-16 sm:pb-20 md:pb-24">
      {/* Header Section with User Info */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          {/* Left - Avatar and User Info */}
          <div className="flex items-start space-x-3">
            <div className="relative">
              <Avatar className="w-16 h-16 border-4 border-[#7CB342]">
                <AvatarImage src="/fish-avatar.png" alt="Profile" />
                <AvatarFallback className="bg-gray-200">
                  <img src="/fish-avatar.png" alt="Profile Avatar" className="w-full h-full rounded-full object-cover" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-[#7CB342] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                V1
              </div>
            </div>
            <div className="flex-1 pt-1">
              <div className="text-sm text-gray-600">UserName: <span className="text-gray-900">{user.username}</span></div>
              <div className="text-sm text-gray-600">Real Balance: <span className="text-gray-900">{showBalance ? parseFloat(user.availableBalance || user.balance || "0").toFixed(0) : '****'}</span></div>
              <div className="text-sm text-gray-600">Frozen Amount: <span className="text-gray-900">{showBalance ? parseFloat(user.frozenBalance || "0").toFixed(0) : '****'}</span></div>
              <div className="text-sm text-gray-600">Credit Score: <span className="text-gray-900">{user.creditScore || 100}</span></div>
            </div>
          </div>

          {/* Right - Copy and Eye Icons */}
          <div className="flex flex-col items-end space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyUsername}
              className="text-gray-600 hover:text-gray-900 p-1 h-auto"
              data-testid="button-copy"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-600 hover:text-gray-900 p-1 h-auto"
              data-testid="button-toggle-balance"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            onClick={() => setLocation('/recharge')}
            className="flex-1 h-12 text-white font-medium rounded-lg bg-[#7CB342] hover:bg-[#6DA33A]"
            data-testid="button-recharge"
          >
            Recharge
          </Button>
          <Button
            onClick={() => setLocation('/withdrawal-request')}
            className="flex-1 h-12 text-white font-medium rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9]"
            data-testid="button-withdraw"
          >
            Withdraw
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-3">
        {/* Personal Information */}
        <button
          onClick={() => setLocation('/personal-information')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          data-testid="button-personal-info"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-900 font-medium">Personal Information</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* My Wallet */}
        <button
          onClick={() => setLocation('/funding-information')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          data-testid="button-my-wallet"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-gray-900 font-medium">My Wallet</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Security Settings */}
        <button
          onClick={() => setCurrentView('authentication')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          data-testid="button-security"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-900 font-medium">Security Settings</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Platform Wallet */}
        <button
          onClick={() => setCurrentView('collection')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          data-testid="button-platform-wallet"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-gray-900 font-medium">Platform Wallet</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Site Announcement */}
        <button
          onClick={() => setCurrentView('settings')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          data-testid="button-announcement"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-gray-900 font-medium">Site Announcement</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Site Message */}
        <button
          onClick={() => setCurrentView('userMessage')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          data-testid="button-site-message"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-gray-900 font-medium">Site Message</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* About Company */}
        <button
          onClick={() => setCurrentView('helpCenter')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          data-testid="button-about-company"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
              <Info className="w-5 h-5 text-cyan-600" />
            </div>
            <span className="text-gray-900 font-medium">About Company</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6">
        <Button
          onClick={handleLogout}
          className="w-full h-12 text-white font-medium rounded-lg bg-[#7CB342] hover:bg-[#6DA33A]"
          data-testid="button-logout"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

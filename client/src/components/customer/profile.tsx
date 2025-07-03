import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useBankAccounts, useCreateBankAccount, useUpdateBankAccount, useDeleteBankAccount, useAnnouncements, useCreateTransaction, useCreateWithdrawalRequest, useUpdateProfile, useChangePassword, useChangeFundPassword, useMessages, useMarkMessageAsRead } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
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
  Lock,
  UserCheck,
  PenTool
} from "lucide-react";

export function Profile() {
  const { user, logout } = useAuth();
  const { data: bankAccounts } = useBankAccounts();
  const { data: announcements } = useAnnouncements();
  const { data: messages } = useMessages();
  const createBankAccount = useCreateBankAccount();
  const updateBankAccount = useUpdateBankAccount();
  const deleteBankAccount = useDeleteBankAccount();
  const createTransaction = useCreateTransaction();
  const createWithdrawalRequest = useCreateWithdrawalRequest();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const changeFundPassword = useChangeFundPassword();
  const markMessageAsRead = useMarkMessageAsRead();
  const queryClient = useQueryClient();
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
  const [selectedChannel, setSelectedChannel] = useState("");
  const [showRechargeConfirmDialog, setShowRechargeConfirmDialog] = useState(false);
  const [isProcessingRecharge, setIsProcessingRecharge] = useState(false);
  const [rechargeStep, setRechargeStep] = useState<'idle' | 'validating' | 'submitting' | 'processing'>('idle');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'idle' | 'validating' | 'submitting' | 'processing'>('idle');
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
  
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [showGenderDialog, setShowGenderDialog] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [selectedGender, setSelectedGender] = useState('Confidential');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureName, setSignatureName] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  
  // Platform Wallet hooks
  const walletAddress = "TCbugWAXVppkCmBbHaE8UkaFEtgVZqHLbw";
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  const userBankAccounts = bankAccounts?.filter(account => account.userId === user?.id) || [];

  // Initialize signature data from user profile
  useEffect(() => {
    if (user?.signatureData) {
      setSignatureData(user.signatureData);
    }
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user]);

  // Platform Wallet QR code generation
  useEffect(() => {
    if (currentView === 'platform') {
      const generateQRCode = async () => {
        try {
          const QRCode = (await import('qrcode')).default;
          const canvas = qrCanvasRef.current;
          if (canvas) {
            await QRCode.toCanvas(canvas, walletAddress, {
              width: 192,
              margin: 1,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            });
            const dataUrl = canvas.toDataURL('image/png');
            setQrCodeDataUrl(dataUrl);
          }
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      };
      generateQRCode();
    }
  }, [currentView, walletAddress]);

  // Auto-select Bank Wallet as default
  useEffect(() => {
    if (!selectedBankWallet) {
      setSelectedBankWallet("bank-wallet");
    }
  }, [selectedBankWallet]);

  // File upload handler for avatar
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error", 
        description: "Please select a valid image file",
        variant: "destructive"
      });
      return;
    }

    setUploadingImage(true);
    
    try {
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        // Save to database via API
        updateProfile.mutate({
          profileImage: base64String
        }, {
          onSuccess: () => {
            setProfileImage(base64String);
            // Force refresh user data to show updated profile image
            queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
            toast({
              title: "Success",
              description: "Profile image updated successfully!"
            });
            setUploadingImage(false);
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to save profile image. Please try again.",
              variant: "destructive"
            });
            setUploadingImage(false);
          }
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      setUploadingImage(false);
    }
  };

  // Gender selection handler
  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    setShowGenderDialog(false);
    toast({
      title: "Success",
      description: `Gender updated to ${gender}`
    });
  };

  // Drawing functions for signature canvas
  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef) return { x: 0, y: 0 };
    const rect = canvasRef.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef) return;
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getEventPos(e);
    
    const ctx = canvasRef.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef) return;
    e.preventDefault();
    const { x, y } = getEventPos(e);
    
    const ctx = canvasRef.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (e) e.preventDefault();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    }
  };

  // Delete saved signature from database
  const deleteSavedSignature = () => {
    updateProfile.mutate({
      signatureData: "",
      signatureName: ""
    }, {
      onSuccess: () => {
        setSignatureData(null);
        setSignatureName('');
        clearSignature();
        
        // Force refresh user data to show removed signature
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        
        toast({
          title: "Success", 
          description: "Signature deleted successfully!"
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete signature. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  // Signature save handler
  const handleSignatureSave = () => {
    if (!canvasRef) {
      toast({
        title: "Error",
        description: "No signature to save",
        variant: "destructive"
      });
      return;
    }

    if (!signatureName.trim()) {
      toast({
        title: "Error", 
        description: "Please enter a name for the signature",
        variant: "destructive"
      });
      return;
    }

    // Convert canvas to base64 image
    const signatureImage = canvasRef.toDataURL();
    
    // Save to database via API
    updateProfile.mutate({
      signatureData: signatureImage,
      signatureName: signatureName.trim()
    }, {
      onSuccess: () => {
        setSignatureData(signatureImage);
        setShowSignatureDialog(false);
        setSignatureName('');
        clearSignature();
        
        // Force refresh user data to show updated signature
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        
        toast({
          title: "Success", 
          description: "Signature saved successfully!"
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to save signature. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

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
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      
      try {
        // Update user profile image on server
        const response = await fetch('/api/user/profile-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-ID': localStorage.getItem('sessionId') || '',
          },
          body: JSON.stringify({ profileImage: result }),
        });

        if (response.ok) {
          // Update local state
          setProfileImage(result);
          
          // Invalidate user cache to refresh everywhere
          queryClient.invalidateQueries({ queryKey: ['/api/user'] });
          
          toast({
            title: "Profile image updated",
            description: "Your profile image has been successfully updated",
          });
        } else {
          throw new Error('Failed to update profile image');
        }
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to update profile image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploadingImage(false);
      }
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

  // Platform Wallet functions
  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = `wallet-qr-${walletAddress.substring(0, 8)}.png`;
      link.href = qrCodeDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Download Started",
        description: "QR code image has been downloaded",
      });
    } else {
      toast({
        title: "Error",
        description: "QR code is still generating, please wait",
        variant: "destructive",
      });
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
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
                  <AvatarImage src={user?.profileImage || "/api/placeholder/64/64"} alt="Profile" />
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
                  Credit Score: {hideBalance ? "**" : user.reputation || 85}
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
                  <div className="space-y-2">
                    <div>
                      <Label>Current Balance: ${parseFloat(user?.balance || "0").toFixed(2)}</Label>
                    </div>
                    
                    {/* Select a fast amount of USDT */}
                    <div>
                      <Label className="text-sm text-gray-600">Select a fast amount of USDT</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
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
                    </div>
                    
                    {/* Enter recharge amount of USDT */}
                    <div>
                      <Label className="text-sm text-gray-600">Enter recharge amount of USDT</Label>
                      <Input 
                        placeholder="500" 
                        type="number" 
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    {/* Select recharge wallet category */}
                    <div>
                      <Label className="text-sm text-gray-600">Select recharge wallet category</Label>
                      <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="ImToken Wallet (1-100000)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="channel01">Channel 01</SelectItem>
                          <SelectItem value="channel02">Channel 02</SelectItem>
                          <SelectItem value="channel03">Channel 03</SelectItem>
                          <SelectItem value="channel04">Channel 04</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Dynamic Recharge prompt message */}
                    <div>
                      <Label className="text-sm text-red-500">Recharge prompt message</Label>
                      <div className={`mt-1 p-2 rounded-lg border text-xs transition-all duration-500 ${
                        rechargeStep === 'idle' 
                          ? 'bg-gray-50 border-gray-200' 
                          : rechargeStep === 'validating'
                          ? 'bg-yellow-50 border-yellow-200 animate-pulse'
                          : rechargeStep === 'submitting'
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-blue-50 border-blue-200 animate-pulse'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {rechargeStep !== 'idle' && (
                            <div className={`w-2 h-2 rounded-full ${
                              rechargeStep === 'validating' ? 'bg-yellow-500 animate-ping' :
                              rechargeStep === 'submitting' ? 'bg-orange-500 animate-bounce' :
                              'bg-blue-500 animate-spin'
                            }`}></div>
                          )}
                          <span className={`transition-colors duration-300 ${
                            rechargeStep === 'idle' ? 'text-gray-600' :
                            rechargeStep === 'validating' ? 'text-yellow-700 font-medium' :
                            rechargeStep === 'submitting' ? 'text-orange-700 font-semibold' :
                            'text-blue-600 font-semibold'
                          }`}>
                            {rechargeStep === 'idle' 
                              ? 'Select correct channel and enter exact amount for successful processing.'
                              : rechargeStep === 'validating'
                              ? 'Validating details...'
                              : rechargeStep === 'submitting'
                              ? 'Submitting form...'
                              : 'Processing transaction...'
                            }
                          </span>
                        </div>
                        
                        {/* Progress bar for active states */}
                        {rechargeStep !== 'idle' && (
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full transition-all duration-1000 ${
                              rechargeStep === 'validating' ? 'w-1/4 bg-yellow-500' :
                              rechargeStep === 'submitting' ? 'w-2/3 bg-orange-500' :
                              'w-full bg-blue-500'
                            }`}></div>
                          </div>
                        )}
                      </div>
                    </div>



                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600 mt-3"
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
                        
                        if (user) {
                          // Stage 1: Validation
                          setRechargeStep('validating');
                          setIsProcessingRecharge(true);
                          
                          setTimeout(() => {
                            // Stage 2: Submitting
                            setRechargeStep('submitting');
                            
                            setTimeout(() => {
                              // Stage 3: Processing
                              setRechargeStep('processing');
                              
                              createTransaction.mutate({
                                userId: user.id,
                                type: "deposit",
                                amount: rechargeAmount,
                                description: `Account recharge of ${rechargeAmount} USDT via bank wallet`
                              }, {
                                onSuccess: () => {
                                  // Reset states
                                  setRechargeStep('idle');
                                  setIsProcessingRecharge(false);
                                  
                                  toast({
                                    title: "Recharge successful",
                                    description: `${rechargeAmount} USDT has been added to your account via ${selectedChannel || 'bank wallet'}`,
                                  });
                                  setRechargeAmount("");
                                  setSelectedChannel("");
                                  setShowRechargeDialog(false);
                                  // Show confirmation popup after successful transaction
                                  setTimeout(() => {
                                    setShowRechargeConfirmDialog(true);
                                  }, 500);
                                },
                                onError: () => {
                                  // Reset states on error
                                  setRechargeStep('idle');
                                  setIsProcessingRecharge(false);
                                  
                                  toast({
                                    title: "Recharge failed",
                                    description: "Unable to process recharge. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              });
                            }, 1000); // 1 second for submitting stage
                          }, 800); // 800ms for validation stage
                        }
                      }}
                      disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0 || createTransaction.isPending || isProcessingRecharge}
                    >
                      {rechargeStep === 'idle' ? (
                        'Submit'
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 border-2 border-white rounded-full ${
                            rechargeStep === 'validating' ? 'border-t-transparent animate-pulse' :
                            rechargeStep === 'submitting' ? 'border-t-transparent animate-spin' :
                            'border-t-transparent animate-spin'
                          }`}></div>
                          <span>
                            {rechargeStep === 'validating' ? 'Validating...' :
                             rechargeStep === 'submitting' ? 'Submitting...' :
                             'Processing...'}
                          </span>
                        </div>
                      )}
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
                  <div className="space-y-2 p-2">
                    {/* Current available balance */}
                    <div>
                      <Label className="text-sm text-gray-600">Current available balance</Label>
                      <div className="bg-gray-50 rounded p-2 mt-1">
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
                      <Select value={selectedBankWallet} onValueChange={setSelectedBankWallet}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select wallet type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="digital-wallet">Digital Wallet</SelectItem>
                          <SelectItem value="bank-wallet">Bank Wallet</SelectItem>
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


                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600 text-white mt-3"
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
                            description: "Minimum withdrawal amount is $10",
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
                        
                        // Fund password is optional - no validation needed
                        
                        // Check if user has a bank account
                        if (!userBankAccounts || userBankAccounts.length === 0) {
                          toast({
                            title: "No bank account",
                            description: "Please add a bank account first to process withdrawals",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        // Stage 1: Validation
                        setWithdrawStep('validating');
                        setIsProcessingWithdraw(true);
                        
                        setTimeout(() => {
                          // Stage 2: Submitting
                          setWithdrawStep('submitting');
                          
                          setTimeout(() => {
                            // Stage 3: Processing
                            setWithdrawStep('processing');
                            
                            // Handle withdrawal for both digital and bank wallets
                            if (selectedBankWallet === "digital-wallet") {
                              // For digital wallet, use a default bank account or create one
                              const defaultBankAccountId = userBankAccounts?.[0]?.id || 1;
                              
                              createWithdrawalRequest.mutate({
                                bankAccountId: defaultBankAccountId,
                                amount: withdrawAmount
                              }, {
                                onSuccess: () => {
                                  // Reset states
                                  setWithdrawStep('idle');
                                  setIsProcessingWithdraw(false);
                                  
                                  // Invalidate withdrawal requests cache to refresh Assets page
                                  queryClient.invalidateQueries({ queryKey: ["/api/withdrawal-requests"] });
                                  
                                  toast({
                                    title: "Withdrawal requested",
                                    description: `${withdrawAmount} USDT withdrawal request submitted successfully via Digital Wallet`,
                                  });
                                  setWithdrawAmount("");
                                  setSelectedBankWallet("bank-wallet");
                                  setWithdrawFundPassword("");
                                  setShowWithdrawDialog(false);
                                },
                                onError: () => {
                                  // Reset states on error
                                  setWithdrawStep('idle');
                                  setIsProcessingWithdraw(false);
                                  
                                  toast({
                                    title: "Withdrawal failed",
                                    description: "Unable to process withdrawal request. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              });
                            } else if (selectedBankWallet === "bank-wallet") {
                              // For bank wallet, use the first available bank account
                              const bankAccountId = userBankAccounts?.[0]?.id || 1;
                              
                              createWithdrawalRequest.mutate({
                                bankAccountId: bankAccountId,
                                amount: withdrawAmount
                              }, {
                                onSuccess: () => {
                                  // Reset states
                                  setWithdrawStep('idle');
                                  setIsProcessingWithdraw(false);
                                  
                                  // Invalidate withdrawal requests cache to refresh Assets page
                                  queryClient.invalidateQueries({ queryKey: ["/api/withdrawal-requests"] });
                                  
                                  toast({
                                    title: "Withdrawal requested",
                                    description: `${withdrawAmount} USDT withdrawal request submitted successfully via Bank Wallet`,
                                  });
                                  setWithdrawAmount("");
                                  setSelectedBankWallet("bank-wallet");
                                  setWithdrawFundPassword("");
                                  setShowWithdrawDialog(false);
                                },
                                onError: () => {
                                  // Reset states on error
                                  setWithdrawStep('idle');
                                  setIsProcessingWithdraw(false);
                                  
                                  toast({
                                    title: "Withdrawal failed",
                                    description: "Unable to process withdrawal request. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              });
                            }
                          }, 1000); // 1 second for submitting stage
                        }, 800); // 800ms for validation stage
                      }}
                      disabled={
                        !withdrawAmount || 
                        withdrawAmount.trim() === "" ||
                        parseFloat(withdrawAmount) < 10 ||
                        !selectedBankWallet || 
                        selectedBankWallet.trim() === "" ||
                        createWithdrawalRequest.isPending || 
                        isProcessingWithdraw
                      }
                    >
                      {withdrawStep === 'idle' ? (
                        'Submit'
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 border-2 border-white rounded-full ${
                            withdrawStep === 'validating' ? 'border-t-transparent animate-pulse' :
                            withdrawStep === 'submitting' ? 'border-t-transparent animate-spin' :
                            'border-t-transparent animate-spin'
                          }`}></div>
                          <span>
                            {withdrawStep === 'validating' ? 'Validating...' :
                             withdrawStep === 'submitting' ? 'Submitting...' :
                             'Processing...'}
                          </span>
                        </div>
                      )}
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

        {/* Global Recharge Confirmation Dialog */}
        <Dialog open={showRechargeConfirmDialog} onOpenChange={setShowRechargeConfirmDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Recharge Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-center">
              <p className="text-sm text-gray-700 leading-relaxed">
                Hello, Please contact teacher to get the latest channels for recharging. 
                Thank you for your support and trust. Please return to the previous page.
              </p>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  setShowRechargeConfirmDialog(false);
                }}
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
    const handleCopyBankDetail = (value: string, field: string) => {
      navigator.clipboard.writeText(value);
      toast({
        title: "Copy Successful",
        description: `${field} copied to clipboard`
      });
    };

    const handleModifyBankAccount = (account: any) => {
      // Set form data for editing
      setNewBankWallet({
        holderName: account.accountHolderName,
        bankName: account.bankName,
        accountNumber: account.accountNumber,
        ifscCode: account.ifscCode
      });
      // Set editing mode
      setEditingAccountId(account.id);
      // Navigate to edit form (reuse add form)
      setCurrentView('addbankwallet');
    };

    const handleDeleteBankAccount = async (accountId: number) => {
      try {
        await deleteBankAccount.mutateAsync(accountId);
        toast({
          title: "Success",
          description: "Bank wallet deleted successfully!"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete bank wallet. Please try again.",
          variant: "destructive"
        });
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('walletselection')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="flex-1 text-center text-lg font-medium">Bank Wallet</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              // Clear form and reset editing mode for new account
              setNewBankWallet({
                holderName: '',
                bankName: '',
                accountNumber: '',
                ifscCode: ''
              });
              setEditingAccountId(null);
              setCurrentView('addbankwallet');
            }}>
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {userBankAccounts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No bank wallets added yet. Click the + button to add your first bank wallet.</p>
              </div>
            ) : (
              userBankAccounts.map((account) => (
                <Card key={account.id} className="border border-gray-200">
                  <CardContent className="p-4 space-y-3">
                    {/* Holder's name */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">Holder's name</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{account.accountHolderName}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 p-0 h-auto text-xs"
                          onClick={() => handleCopyBankDetail(account.accountHolderName, "Holder's name")}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* Bank Name */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">Bank Name</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{account.bankName}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 p-0 h-auto text-xs"
                          onClick={() => handleCopyBankDetail(account.bankName, "Bank Name")}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* A/c No */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">A/c No</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{account.accountNumber}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 p-0 h-auto text-xs"
                          onClick={() => handleCopyBankDetail(account.accountNumber, "Account Number")}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* IFSC Code */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">IFSC Code</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{account.ifscCode}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 p-0 h-auto text-xs"
                          onClick={() => handleCopyBankDetail(account.ifscCode, "IFSC Code")}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 mt-4">
                      <Button 
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleModifyBankAccount(account)}
                      >
                        Modify
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => handleDeleteBankAccount(account.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
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
        if (editingAccountId) {
          // Update existing bank account
          await updateBankAccount.mutateAsync({
            id: editingAccountId,
            accountHolderName: newBankWallet.holderName,
            bankName: newBankWallet.bankName,
            accountNumber: newBankWallet.accountNumber,
            ifscCode: newBankWallet.ifscCode
          });

          toast({
            title: "Success",
            description: "Bank wallet updated successfully!"
          });
        } else {
          // Create new bank account using existing API
          await createBankAccount.mutateAsync({
            accountHolderName: newBankWallet.holderName,
            bankName: newBankWallet.bankName,
            accountNumber: newBankWallet.accountNumber,
            ifscCode: newBankWallet.ifscCode
          });

          toast({
            title: "Success",
            description: "Bank wallet added successfully!"
          });
        }

        // Reset form
        setNewBankWallet({
          holderName: '',
          bankName: '',
          accountNumber: '',
          ifscCode: ''
        });
        setEditingAccountId(null);

        // Navigate back to bank wallet view
        setCurrentView('bankwallet');
      } catch (error) {
        toast({
          title: "Error",
          description: editingAccountId ? "Failed to modify bank wallet." : "Failed to add bank wallet. Please try again.",
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
            <CardTitle className="flex-1 text-center text-lg font-medium">
              {editingAccountId ? "Edit Bank Wallet" : "Add Bank Wallet"}
            </CardTitle>
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
            <CardTitle className="flex-1 text-center text-lg font-medium">Select Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="flex-1 text-center text-lg font-medium">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {/* Avatar */}
            <div 
              className="flex items-center justify-between p-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Avatar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={user?.profileImage || '/api/placeholder/32/32'} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            {/* Hidden file input for avatar upload */}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />

            {/* Username */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium">UserName</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{user?.username || 'AmitKumar'}</span>
              </div>
            </div>

            {/* Gender */}
            <div 
              className="flex items-center justify-between p-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"
              onClick={() => setShowGenderDialog(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 text-sm">♀♂</span>
                </div>
                <span className="text-sm font-medium">Gender</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedGender}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Signature */}
            <div 
              className="flex items-center justify-between p-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"
              onClick={() => setShowSignatureDialog(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Signature</span>
              </div>
              <div className="flex items-center space-x-2">
                {user?.signatureData ? (
                  <div className="text-right">
                    <div className="text-xs text-green-600 font-medium">✓ Saved</div>
                    {user?.signatureName && (
                      <div className="text-xs text-gray-500">{user.signatureName}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">Not set</div>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gender Selection Dialog */}
        <Dialog open={showGenderDialog} onOpenChange={setShowGenderDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">Select Gender</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleGenderSelect('Male')}
              >
                Male
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleGenderSelect('Female')}
              >
                Female
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleGenderSelect('Confidential')}
              >
                Confidential
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setShowGenderDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Signature Drawing Dialog */}
        <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">Create Signature</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Canvas drawing area */}
              <div className="w-full">
                <canvas
                  ref={(el) => {
                    setCanvasRef(el);
                    if (el) {
                      const ctx = el.getContext('2d');
                      if (ctx) {
                        ctx.strokeStyle = '#000000';
                        ctx.lineWidth = 2;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                      }
                    }
                  }}
                  width={280}
                  height={120}
                  className="w-full h-30 border-2 border-gray-300 rounded-lg bg-white cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <p className="text-xs text-gray-500 mt-1 text-center">Draw your signature above</p>
              </div>

              {/* Name input field */}
              <div>
                <Label htmlFor="signature-name" className="text-sm font-medium">
                  Signature Name
                </Label>
                <Input
                  id="signature-name"
                  type="text"
                  placeholder="Enter signature name..."
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={user?.signatureData ? deleteSavedSignature : clearSignature}
                >
                  {user?.signatureData ? 'Delete Saved' : 'Clear'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowSignatureDialog(false);
                    setSignatureName('');
                    clearSignature();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleSignatureSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
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
                  if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                    toast({
                      title: "Error",
                      description: "Please fill all fields",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  if (passwordData.newPassword !== passwordData.confirmPassword) {
                    toast({
                      title: "Error",
                      description: "Passwords don't match",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  changePassword.mutate({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                  }, {
                    onSuccess: () => {
                      toast({
                        title: "Password updated",
                        description: "Login password has been changed successfully",
                      });
                      setShowPasswordDialog(false);
                      setPasswordData({currentPassword: "", newPassword: "", confirmPassword: ""});
                    },
                    onError: () => {
                      toast({
                        title: "Error",
                        description: "Failed to update password. Please check your current password.",
                        variant: "destructive",
                      });
                    }
                  });
                }}
                disabled={changePassword.isPending}
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
                  if (!fundPasswordData.currentFundPassword || !fundPasswordData.newFundPassword || !fundPasswordData.confirmFundPassword) {
                    toast({
                      title: "Error",
                      description: "Please fill all fields",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  if (fundPasswordData.newFundPassword !== fundPasswordData.confirmFundPassword) {
                    toast({
                      title: "Error",
                      description: "Fund passwords don't match",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  changeFundPassword.mutate({
                    currentFundPassword: fundPasswordData.currentFundPassword,
                    newFundPassword: fundPasswordData.newFundPassword
                  }, {
                    onSuccess: () => {
                      toast({
                        title: "Fund password updated",
                        description: "Fund password has been changed successfully",
                      });
                      setShowFundPasswordDialog(false);
                      setFundPasswordData({currentFundPassword: "", newFundPassword: "", confirmFundPassword: ""});
                    },
                    onError: () => {
                      toast({
                        title: "Error",
                        description: "Failed to update fund password. Please check your current fund password.",
                        variant: "destructive",
                      });
                    }
                  });
                }}
                disabled={changeFundPassword.isPending}
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
      <div className="flex flex-col items-center justify-center space-y-6 p-6 bg-gray-50 min-h-[400px]">
        {/* Currency Label */}
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-700">TRC20</h2>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="w-48 h-48 bg-white flex items-center justify-center">
            <canvas 
              ref={qrCanvasRef}
              width={192}
              height={192}
              className="border border-gray-200"
              style={{ display: qrCodeDataUrl ? 'block' : 'none' }}
            />
            {!qrCodeDataUrl && (
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Generating QR Code...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Wallet Address */}
        <div className="text-center">
          <p className="text-sm text-gray-600 font-mono break-all px-4">
            {walletAddress}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 w-full max-w-xs">
          <Button 
            onClick={downloadQRCode}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3"
          >
            Download Picture
          </Button>
          <Button 
            onClick={copyAddress}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3"
          >
            Copy Address
          </Button>
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
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="p-4 bg-white rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{message.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    message.type === 'Important' ? 'bg-red-100 text-red-700' :
                    message.type === 'System' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {message.type}
                  </span>
                  {!message.isRead && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{message.content}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleDateString()}
                </div>
                {!message.isRead && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markMessageAsRead.mutate(message.id)}
                    className="text-xs"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No messages</p>
            <p className="text-sm text-gray-500">Admin messages will appear here</p>
          </div>
        )}
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
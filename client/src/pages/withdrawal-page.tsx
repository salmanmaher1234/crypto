import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const tabs = [
  { id: "usdt", label: "USDT" },
  { id: "bdt", label: "BDT" }
];

export default function WithdrawalPage() {
  const [activeTab, setActiveTab] = useState("bdt");
  const [amount, setAmount] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's bank accounts
  const { data: bankAccounts = [] } = useQuery({
    queryKey: ["/api/bank-accounts"],
    enabled: activeTab === "bdt"
  });

  // Get user data to show available balance
  const { data: userData } = useQuery({
    queryKey: ["/api/auth/me"]
  });

  const createWithdrawalMutation = useMutation({
    mutationFn: (data: { amount: string; bankAccountId: number }) =>
      apiRequest("/api/withdrawal-requests", "POST", data),
    onSuccess: () => {
      toast({
        title: "Withdrawal Request Submitted",
        description: "Your withdrawal request has been submitted for review",
      });
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ["/api/withdrawal-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit withdrawal request",
        variant: "destructive",
      });
    },
  });

  const handleWithdrawal = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === "bdt" && bankAccounts.length === 0) {
      toast({
        title: "No Bank Account",
        description: "Please add a bank account first",
        variant: "destructive",
      });
      return;
    }

    const availableBalance = parseFloat(userData?.availableBalance || "0");
    if (parseFloat(amount) > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Withdrawal amount exceeds available balance",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === "bdt") {
      createWithdrawalMutation.mutate({
        amount,
        bankAccountId: bankAccounts[0].id // Use first bank account
      });
    }
  };

  const defaultBankAccount = bankAccounts[0];

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/customer">
                <Button variant="ghost" size="sm" className="mr-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-lg font-medium text-gray-900">Request for Withdrawal</h1>
            </div>
            <Link href="/top-up-records">
              <Button variant="ghost" size="sm" className="text-blue-600">
                Withdrawal Record
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {/* Currency Selection */}
          <div>
            <div className="text-sm text-gray-600 mb-2">Currency withdrawal ( Currency Account)</div>
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Collection Information - Only show for BDT */}
          {activeTab === "bdt" && (
            <div>
              <div className="text-sm text-gray-600 mb-3">Collection Information</div>
              {defaultBankAccount ? (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Account Holder:</span>
                      <span className="text-sm font-medium text-right">{defaultBankAccount.accountHolderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Account Number:</span>
                      <span className="text-sm font-medium text-right">{defaultBankAccount.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bank Name:</span>
                      <span className="text-sm font-medium text-right">{defaultBankAccount.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">IFSC Code:</span>
                      <span className="text-sm font-medium text-right">{defaultBankAccount.ifscCode}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <div className="text-sm text-red-600">
                    No bank account found. Please add a bank account to proceed with withdrawal.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Withdrawal Amount */}
          <div>
            <div className="text-sm text-gray-600 mb-3">Quantity of Withdrawal</div>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="text-lg h-12"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600"
                  onClick={() => setAmount(userData?.availableBalance || "0")}
                >
                  All
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                Available Balance: {parseFloat(userData?.availableBalance || "0").toFixed(2)}
              </div>
            </div>
          </div>

          {/* Withdrawal Button */}
          <div className="pt-4">
            <Button
              onClick={handleWithdrawal}
              disabled={createWithdrawalMutation.isPending || !amount}
              className="w-full h-12 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-medium"
            >
              {createWithdrawalMutation.isPending ? "Processing..." : "Determine Withdrawal"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
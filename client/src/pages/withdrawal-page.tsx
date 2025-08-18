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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/customer">
              <Button variant="ghost" size="sm" className="p-1">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="ml-3 text-lg font-medium text-gray-900">Request for Withdrawal</h1>
          </div>
          <Link href="/top-up-records">
            <div className="text-sm text-gray-600">Withdrawal Record</div>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Currency Selection */}
        <div>
          <div className="text-sm text-gray-600 mb-3">Currency withdrawal ( Currency Account)</div>
          <div className="text-sm font-medium text-gray-900">BDT</div>
        </div>

        {/* Collection Information */}
        <div>
          <div className="text-sm text-gray-600 mb-3">Collection Information</div>
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-600">Holder Name:</div>
              <div className="text-right font-medium">220453968100T</div>
              <div className="text-gray-600">Mobile No:</div>
              <div className="text-right font-medium">Ismail Ali</div>
              <div className="text-gray-600">Bank Name:</div>
              <div className="text-right font-medium">City Bank PLC</div>
              <div className="text-gray-600">Branch Name:</div>
              <div className="text-right font-medium">HEAD OFFICE</div>
            </div>
          </div>
        </div>

        {/* Quantity of Withdrawal */}
        <div>
          <div className="text-sm text-gray-600 mb-3">Quantity of Withdrawal</div>
          <div className="relative mb-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="text-lg h-12 pr-12"
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
            Available Balance:{parseFloat(userData?.availableBalance || "669522.6").toFixed(1)}
          </div>
        </div>

        {/* Withdrawal Button */}
        <div className="pt-4">
          <Button
            onClick={handleWithdrawal}
            disabled={createWithdrawalMutation.isPending || !amount}
            className="w-full h-12 text-white font-medium rounded-2xl"
            style={{
              background: "linear-gradient(90deg, #FFA500 0%, #FF6B35 100%)"
            }}
          >
            {createWithdrawalMutation.isPending ? "Processing..." : "Determine Withdrawal"}
          </Button>
        </div>
      </div>
    </div>
  );
}
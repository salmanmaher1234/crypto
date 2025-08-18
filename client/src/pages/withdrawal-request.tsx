import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function WithdrawalRequest() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [withdrawalAmount, setWithdrawalAmount] = useState("0");
  const queryClient = useQueryClient();

  // Create withdrawal mutation
  const createWithdrawal = useMutation({
    mutationFn: async (data: { amount: number; currency: string }) => {
      return apiRequest('/api/withdrawal-requests', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawal-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      // Navigate to withdrawal record page
      setLocation('/withdrawal-record');
    }
  });

  const handleBack = () => {
    setLocation('/withdrawal');
  };

  const handleWithdrawalRecord = () => {
    setLocation('/withdrawal-record');
  };

  const handleMaxAmount = () => {
    const availableBalance = parseFloat(user?.availableBalance || user?.balance || "669522.6");
    setWithdrawalAmount(availableBalance.toString());
  };

  const handleDetermineWithdrawal = () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) return;
    
    // Submit withdrawal request
    createWithdrawal.mutate({
      amount: parseFloat(withdrawalAmount),
      currency: "BDT"
    });
  };

  const availableBalance = parseFloat(user?.availableBalance || user?.balance || "669522.6");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="p-1 mr-2"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
        <h1 className="text-lg font-medium text-gray-900">Request for Withdrawal</h1>
        <div className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWithdrawalRecord}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Withdrawal Record
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Currency Withdrawal Section */}
        <div>
          <div className="text-gray-700 text-sm mb-2">Currency withdrawal ( Currency Account)</div>
          <div className="text-gray-600 text-sm font-medium mb-4">BDT</div>
        </div>

        {/* Collection Information */}
        <div>
          <div className="text-gray-900 text-base font-medium mb-3">Collection Information</div>
          <div 
            className="rounded-lg p-4 border-l-4"
            style={{
              background: "linear-gradient(90deg, #F59E0B 0%, #F97316 100%)",
              borderLeftColor: "#F59E0B"
            }}
          >
            <div className="flex justify-between items-start">
              <div className="text-white space-y-1">
                <div className="text-sm">Account Holder</div>
                <div className="text-sm">Bank Name</div>
                <div className="text-sm">Branch Name</div>
                <div className="text-sm">Account Number</div>
                <div className="text-sm">Routing Number</div>
              </div>
              <div className="text-white text-right space-y-1">
                <div className="text-sm">220453981001</div>
                <div className="text-sm">Ismail Ali</div>
                <div className="text-sm">City Bank PLC</div>
                <div className="text-sm font-medium">HEAD OFFICE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quantity of Withdrawal */}
        <div>
          <div className="text-gray-900 text-base font-medium mb-3">Quantity of Withdrawal</div>
          <div className="relative">
            <input
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              className="w-full px-4 py-3 text-xl font-medium text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="0"
            />
            <Button
              onClick={handleMaxAmount}
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 text-sm"
            >
              All
            </Button>
          </div>
          <div className="text-gray-500 text-sm mt-2">
            Available Balance: {availableBalance.toFixed(1)}
          </div>
        </div>

        {/* Determine Withdrawal Button */}
        <div className="pt-8">
          <Button
            onClick={handleDetermineWithdrawal}
            disabled={createWithdrawal.isPending || !withdrawalAmount || parseFloat(withdrawalAmount) <= 0}
            className="w-full h-12 text-white font-medium rounded-full text-base disabled:opacity-50"
            style={{
              background: "linear-gradient(90deg, #F59E0B 0%, #F97316 100%)"
            }}
          >
            {createWithdrawal.isPending ? 'Processing...' : 'Determine Withdrawal'}
          </Button>
        </div>
      </div>
    </div>
  );
}
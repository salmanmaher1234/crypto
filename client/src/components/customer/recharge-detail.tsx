import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Copy } from "lucide-react";
import { useTransactions } from "@/lib/api";

export function RechargeDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: transactions } = useTransactions();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    transactionNo: "",
    approveAmt: "",
    comment: "",
    rechargeInfo: ""
  });

  // Find the specific transaction
  const transaction = transactions?.find(t => t.id === parseInt(id || "0") && t.type === "deposit");

  if (!transaction) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="flex items-center mb-6">
          <button onClick={() => setLocation("/customer#assets")} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">Recharge Detail</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">Transaction not found</p>
        </div>
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copy Successful",
      description: "Text copied to clipboard",
    });
  };

  const handleSubmit = () => {
    if (!formData.transactionNo.trim()) {
      toast({
        title: "Validation Error",
        description: "Transaction No. zarori hai",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically submit the form data
    toast({
      title: "Success",
      description: "Recharge information submitted successfully",
    });
  };

  // Generate a mock order number for display
  const orderNo = `T-X${transaction.id}7514474469${Math.floor(Math.random() * 100)}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={() => setLocation("/customer#assets")} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">Recharge Detail</h1>
        </div>

        {/* Transaction Details Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          {/* Transaction No. */}
          <div className="mb-4">
            <Label className="text-sm text-gray-600">Transaction No.</Label>
            <Input 
              value={formData.transactionNo}
              onChange={(e) => setFormData({...formData, transactionNo: e.target.value})}
              placeholder="Enter transaction number"
              className="mt-1"
            />
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Amount</span>
            <span className="text-sm font-medium">{parseFloat(transaction.amount).toFixed(0)}</span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Status</span>
            <span className="text-sm text-blue-600 font-medium">Applied</span>
          </div>

          {/* Order No. */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Order No.</span>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{orderNo}</span>
              <button 
                onClick={() => handleCopy(orderNo)}
                className="text-red-500 hover:text-red-600"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Apply Time */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Apply Time</span>
            <span className="text-sm text-gray-700">
              {new Date(transaction.createdAt).toLocaleString('en-CA', {
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              }).replace(',', '')}
            </span>
          </div>

          {/* Review Time */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Review Time</span>
            <span className="text-sm text-gray-700">-</span>
          </div>

          {/* Approve Amt. */}
          <div className="mt-4 mb-4">
            <Label className="text-sm text-gray-600">Approve Amt.</Label>
            <Input 
              value={formData.approveAmt}
              onChange={(e) => setFormData({...formData, approveAmt: e.target.value})}
              placeholder="Enter approve amount"
              className="mt-1"
            />
          </div>

          {/* Comment */}
          <div className="mb-4">
            <Label className="text-sm text-gray-600">Comment</Label>
            <Textarea 
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              placeholder="Enter comment"
              className="mt-1 min-h-[60px]"
            />
          </div>

          {/* Recharge Info */}
          <div className="mb-6">
            <Label className="text-sm text-gray-600">Recharge Info.</Label>
            <Textarea 
              value={formData.rechargeInfo}
              onChange={(e) => setFormData({...formData, rechargeInfo: e.target.value})}
              placeholder="Enter recharge information"
              className="mt-1 min-h-[100px]"
            />
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Supply Recharge Info.
          </Button>
        </div>
      </div>
    </div>
  );
}
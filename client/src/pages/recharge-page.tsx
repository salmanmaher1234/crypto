import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RechargePage() {
  const [, setLocation] = useLocation();
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState("5000");
  const [selectedChannel, setSelectedChannel] = useState("channel-01");
  const [showDialog, setShowDialog] = useState(false);

  const fastAmounts = [1000, 3000, 5000, 7000, 10000, 15000, 30000, 50000];

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setSelectedAmount(numValue);
    }
  };

  const handleSubmit = () => {
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center">
          <button
            onClick={() => setLocation('/profile')}
            className="mr-4 p-1"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Recharge</h1>
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        {/* Fast Amount Selection */}
        <div className="mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-3">Select a fast amount</h2>
          <div className="grid grid-cols-4 gap-3">
            {fastAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountClick(amount)}
                className={`py-3 px-2 rounded-lg font-medium transition-colors ${
                  selectedAmount === amount
                    ? "bg-[#7CB342] text-white"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
                data-testid={`button-amount-${amount}`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Enter Recharge Amount */}
        <div className="mb-6">
          <label className="block text-base font-medium text-gray-900 mb-3">
            Enter recharge amount
          </label>
          <input
            type="number"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7CB342] focus:border-transparent"
            placeholder="Enter amount"
            data-testid="input-recharge-amount"
          />
        </div>

        {/* Select Recharge Channel */}
        <div className="mb-6">
          <label className="block text-base font-medium text-gray-900 mb-3">
            Select recharge channel
          </label>
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger 
              className="w-full h-12 bg-white border-gray-300"
              data-testid="select-channel"
            >
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="channel-01">Channel:01(100-100000)</SelectItem>
              <SelectItem value="channel-02">Channel:02(100-100000)</SelectItem>
              <SelectItem value="channel-03">Channel:03(100-100000)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recommended Recharge Amount */}
        <div className="mb-6">
          <p className="text-sm text-red-600">
            Recommended recharge amount: 100-100000
          </p>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full h-14 bg-[#2d5016] hover:bg-[#1f3810] text-white text-lg font-medium rounded-lg"
          data-testid="button-submit-recharge"
        >
          Submit
        </Button>
      </main>

      {/* Information Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-center">Information</DialogTitle>
            <DialogDescription className="text-center pt-4 text-gray-700 text-base leading-relaxed">
              Hello, Please contact teacher to get the latest channels for recharging. 
              Thank you for your support and trust. Please return to the previous page.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => {
                setShowDialog(false);
                setLocation('/profile');
              }}
              className="bg-[#7CB342] hover:bg-[#6DA33A] text-white px-8"
              data-testid="button-close-dialog"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

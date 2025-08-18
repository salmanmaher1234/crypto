import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { RotateCcw, CreditCard } from "lucide-react";

export function AssetsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"recharge" | "withdrawal">("recharge");
  
  return (
    <div className="min-h-screen bg-white">
      {/* Blue Gradient Header Section */}
      <div 
        className="px-4 py-8"
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
        }}
      >
        {/* Asset Information Title */}
        <div className="text-center mb-6">
          <h1 className="text-white text-lg font-medium">Asset Information</h1>
        </div>

        {/* Total Assets */}
        <div className="mb-6">
          <div className="text-white text-sm mb-1">Total Assets</div>
          <div className="text-white text-2xl font-bold mb-1">5508.749673 <span className="text-sm font-normal">USDT</span></div>
          <div className="flex items-center text-white text-sm">
            <span>≈ 669512.60</span>
            <span className="ml-1">BDT</span>
            <Button variant="ghost" size="sm" className="p-0 ml-2 h-auto">
              <span className="text-white text-xs">▼</span>
            </Button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-t-3xl px-4 py-4">
          <div className="flex justify-center space-x-16">
            {/* Recharge Tab */}
            <Button
              variant="ghost"
              className={`flex flex-col items-center space-y-2 p-3 ${
                activeTab === "recharge" ? "text-blue-600" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("recharge")}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeTab === "recharge" ? "bg-blue-100" : "bg-gray-100"
              }`}>
                <RotateCcw className={`w-5 h-5 ${
                  activeTab === "recharge" ? "text-blue-600" : "text-gray-600"
                }`} />
              </div>
              <span className="text-xs">Recharge</span>
            </Button>

            {/* Withdrawal Tab */}
            <Button
              variant="ghost"
              className={`flex flex-col items-center space-y-2 p-3 ${
                activeTab === "withdrawal" ? "text-red-600" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("withdrawal")}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeTab === "withdrawal" ? "bg-red-100" : "bg-gray-100"
              }`}>
                <CreditCard className={`w-5 h-5 ${
                  activeTab === "withdrawal" ? "text-red-600" : "text-gray-600"
                }`} />
              </div>
              <span className="text-xs">Withdrawal of Currency</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50 px-4 py-6">
        {/* BDT Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-lg font-medium text-gray-900 mb-2">BDT</div>
              <div className="space-y-1">
                <div>
                  <div className="text-2xl font-bold text-blue-600">669512.600000</div>
                  <div className="text-xs text-gray-500">Available Balance</div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">0.0000</div>
                <div className="text-xs text-gray-500">Frozen</div>
              </div>
            </div>
            
            <div className="text-right">
              <div>
                <div className="text-2xl font-bold text-blue-600">669512.600000</div>
                <div className="text-xs text-gray-500">Balance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
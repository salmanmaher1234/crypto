import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

const tabs = [
  { id: "recharges", label: "Recharges" },
  { id: "withdraws", label: "Withdraws" },
  { id: "funds", label: "Funds" }
];

export default function TopUpRecordsPage() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("recharges");

  // Check for URL parameters to set default tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'withdrawal') {
      setActiveTab('withdraws');
    } else if (tab === 'funds') {
      setActiveTab('funds');
    } else {
      setActiveTab('recharges');
    }
  }, [location]);

  // Get transactions for recharges
  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: activeTab === "recharges"
  });

  // Get withdrawal requests for withdraws
  const { data: withdrawalRequests = [] } = useQuery({
    queryKey: ["/api/withdrawal-requests"],
    enabled: activeTab === "withdraws"
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'approved':
        return <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">Success</span>;
      case 'rejected':
        return <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">Failure</span>;
      case 'pending':
      default:
        return <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">Under review</span>;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 py-3">
          <div className="flex items-center">
            <Link href="/recharge">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-medium text-gray-900">
              Asset
            </h1>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-2">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-[#7CB342] text-gray-900"
                    : "border-transparent text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-gray-100">
        {activeTab === "recharges" && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-gray-400 text-lg mb-2">📄</div>
            <div className="text-gray-400 text-sm">No data available</div>
          </div>
        )}
        
        {activeTab === "withdraws" && (
          <div className="p-0">
            {(withdrawalRequests as any[]).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-gray-400 text-lg mb-2">📄</div>
                <div className="text-gray-400 text-sm">No data available</div>
              </div>
            ) : (
              <div className="space-y-0">
                {(withdrawalRequests as any[]).map((request: any) => (
                  <div key={request.id} className="bg-white border-b border-gray-100 p-4">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-medium text-black">INR</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(request.createdAt)}
                      </div>
                    </div>
                    <div className="space-y-0">
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-black">Quantity of Withdrawal</span>
                        <span className="text-sm font-bold text-black">{parseFloat(request.amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-black">Actual quantity</span>
                        <span className="text-sm font-bold text-black">{parseFloat(request.amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 items-center">
                        <span className="text-sm text-black">Withdrawal Status</span>
                        {getStatusBadge(request.status)}
                      </div>
                      {request.status === 'rejected' && request.note && (
                        <div className="flex justify-between py-1">
                          <span className="text-sm text-black">Rejection Reason</span>
                          <span className="text-sm text-red-600 max-w-[200px] text-right">{request.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="bg-white p-4 text-center">
                  <div className="text-gray-400 text-sm">No More</div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "funds" && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-gray-400 text-lg mb-2">📄</div>
            <div className="text-gray-400 text-sm">No data available</div>
          </div>
        )}
      </main>
    </div>
  );
}
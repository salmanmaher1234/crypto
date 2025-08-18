import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

const tabs = [
  { id: "withdrawal", label: "Withdrawal Record" }
];

export default function TopUpRecordsPage() {
  const [activeTab, setActiveTab] = useState("withdrawal");

  // Get transactions for top-up records
  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: activeTab === "top-up"
  });

  // Get withdrawal requests for withdrawal records
  const { data: withdrawalRequests = [] } = useQuery({
    queryKey: ["/api/withdrawal-requests"],
    enabled: activeTab === "withdrawal"
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
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Success</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Failure</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Under Review</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{status}</span>;
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
              Withdrawal Record
            </h1>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="px-4 py-2">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          {withdrawalRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
              <div className="text-gray-400 text-sm">No More</div>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawalRequests.map((request: any) => (
                <div key={request.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium">BDT</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(request.createdAt)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Quantity of Withdrawal</span>
                      <span className="text-sm font-medium">{parseFloat(request.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Actual quantity</span>
                      <span className="text-sm font-medium">{parseFloat(request.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Withdrawal Status</span>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
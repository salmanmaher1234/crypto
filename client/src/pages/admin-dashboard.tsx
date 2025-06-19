import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberManagement } from "@/components/admin/member-management";
import { BettingOrders } from "@/components/admin/betting-orders";
import { WalletManagement } from "@/components/admin/wallet-management";
import { Reports } from "@/components/admin/reports";
import { Announcements } from "@/components/admin/announcements";
import { Users, ChartLine, Wallet, BarChart3, Megaphone, Smartphone, LogOut } from "lucide-react";
import { useLocation } from "wouter";

const sections = [
  { id: "members", label: "Member Management", icon: Users },
  { id: "orders", label: "Betting Orders", icon: ChartLine },
  { id: "wallets", label: "Wallet Management", icon: Wallet },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "announcements", label: "Announcements", icon: Megaphone },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("members");
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const renderSection = () => {
    switch (activeSection) {
      case "members":
        return <MemberManagement />;
      case "orders":
        return <BettingOrders />;
      case "wallets":
        return <WalletManagement />;
      case "reports":
        return <Reports />;
      case "announcements":
        return <Announcements />;
      default:
        return <MemberManagement />;
    }
  };

  const getSectionTitle = () => {
    return sections.find(s => s.id === activeSection)?.label || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">CryptoInvest Admin</h1>
          <p className="text-sm text-gray-600">Management Dashboard</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-primary hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{getSectionTitle()}</h2>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setLocation("/customer")}
                className="flex items-center space-x-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Customer View</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  {user?.username?.charAt(0).toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-gray-700">{user?.name || user?.username}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="ml-2"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

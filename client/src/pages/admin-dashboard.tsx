import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberManagement } from "@/components/admin/member-management-new";
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
    <div className="h-screen w-screen bg-gray-50 flex admin-dashboard">
      {/* Sidebar */}
      <div className="w-48 sm:w-56 lg:w-64 xl:w-72 bg-white shadow-lg responsive-padding">
        <div className="p-4 lg:p-6 xl:p-8 border-b responsive-padding">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">SuperCoin Admin</h1>
          <p className="text-xs sm:text-sm text-gray-600">Management Dashboard</p>
        </div>
        
        <nav className="mt-4 lg:mt-6 xl:mt-8">
          <div className="px-4 lg:px-6 xl:px-8 space-y-1 lg:space-y-2 responsive-margin">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left rounded-lg transition-colors text-sm lg:text-base xl:text-lg responsive-padding ${
                    activeSection === section.id
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-primary hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 mr-2 lg:mr-3 xl:mr-4 flex-shrink-0" />
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <div className="w-full flex flex-col flex-1">
          {/* Header */}
          <div className="bg-white shadow-sm border-b p-4 lg:p-6 xl:p-8 responsive-padding">
            <div className="flex justify-between items-center">
              <h2 className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 truncate">{getSectionTitle()}</h2>
              <div className="flex items-center space-x-2 lg:space-x-4 xl:space-x-6">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/customer")}
                  className="flex items-center space-x-1 text-xs sm:text-sm"
                  size="sm"
                >
                  <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Customer View</span>
                  <span className="sm:hidden">Customer</span>
                </Button>
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs sm:text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base hidden md:inline truncate">{user?.name || user?.username}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => logout()}
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-3 lg:p-6 xl:p-8 responsive-padding">
            <div className="responsive-margin">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

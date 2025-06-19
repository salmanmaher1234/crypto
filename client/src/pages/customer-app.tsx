import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { BalanceCard } from "@/components/customer/balance-card";
import { TradingInterface } from "@/components/customer/trading-interface";
import { TransactionHistory } from "@/components/customer/transaction-history";
import { Home, TrendingUp, Wallet, User, Settings, LogOut } from "lucide-react";
import { useLocation } from "wouter";

const sections = [
  { id: "home", label: "Home", icon: Home },
  { id: "trade", label: "Trade", icon: TrendingUp },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "profile", label: "Profile", icon: User },
];

export default function CustomerApp() {
  const [activeSection, setActiveSection] = useState("home");
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-6">
            <BalanceCard />
            <TradingInterface />
            <TransactionHistory />
          </div>
        );
      case "trade":
        return <TradingInterface />;
      case "wallet":
        return (
          <div className="space-y-6">
            <BalanceCard />
            <TransactionHistory />
          </div>
        );
      case "profile":
        return (
          <div className="p-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="text-gray-900">{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reputation Score</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-medium">{user?.reputation}/100</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-success rounded-full"
                        style={{ width: `${user?.reputation}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <BalanceCard />
            <TradingInterface />
            <TransactionHistory />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-3">
                {user?.username?.charAt(0).toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{user?.name || user?.username}</div>
                <div className="text-xs text-gray-500">Welcome back</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user?.role === "admin" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/admin")}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {renderSection()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 py-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col items-center py-2 px-1 ${
                  activeSection === section.id
                    ? "text-primary"
                    : "text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{section.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

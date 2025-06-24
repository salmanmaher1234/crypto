import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { BalanceCard } from "@/components/customer/balance-card";
import { TradingInterface } from "@/components/customer/trading-interface";
import { TransactionHistory } from "@/components/customer/transaction-history";
import { Profile } from "@/components/customer/profile";
import { CryptoHome } from "@/components/customer/crypto-home";
import { CryptoTrading } from "@/components/customer/crypto-trading";
import { CustomerBettingOrders } from "@/components/customer/betting-orders";
import { Home, TrendingUp, Wallet, User, FileText, Settings, LogOut } from "lucide-react";
import { useLocation } from "wouter";

const sections = [
  { id: "home", label: "Home", icon: Home },
  { id: "trade", label: "Trade", icon: TrendingUp },
  { id: "orders", label: "Orders", icon: FileText },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "profile", label: "Profile", icon: User },
];

export default function CustomerApp() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const renderSection = () => {
    // If a currency is selected, show the trading page
    if (selectedCurrency) {
      return (
        <CryptoTrading 
          currency={selectedCurrency}
          onBack={() => setSelectedCurrency(null)}
        />
      );
    }

    switch (activeSection) {
      case "home":
        return (
          <CryptoHome onSelectCurrency={setSelectedCurrency} />
        );
      case "trade":
        return <TradingInterface />;
      case "orders":
        return <CustomerBettingOrders />;
      case "wallet":
        return (
          <div className="space-y-6">
            <BalanceCard />
            <TransactionHistory />
          </div>
        );
      case "profile":
        return <Profile />;
      default:
        return (
          <CryptoHome onSelectCurrency={setSelectedCurrency} />
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
        <div className="grid grid-cols-5 py-2">
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
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-xs">{section.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

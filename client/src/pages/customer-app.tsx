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
import { AssetsPage } from "@/components/customer/assets-page";
import { Home, TrendingUp, CreditCard, User, FileText, Settings, LogOut } from "lucide-react";
import { useLocation } from "wouter";

const sections = [
  { id: "home", label: "Home", icon: Home },
  { id: "orders", label: "Orders", icon: FileText },
  { id: "market", label: "Market", icon: TrendingUp },
  { id: "assets", label: "Assets", icon: CreditCard },
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
          onOrderPlaced={() => {
            setSelectedCurrency(null);
            setActiveSection("orders");
          }}
        />
      );
    }

    switch (activeSection) {
      case "home":
        return (
          <CryptoHome 
            onSelectCurrency={setSelectedCurrency}
            onNavigateToProfile={() => setActiveSection("profile")}
          />
        );
      case "market":
        return (
          <CryptoTrading 
            currency="BTC/USD"
            onBack={() => setActiveSection("home")}
            onOrderPlaced={() => {
              setActiveSection("orders");
            }}
          />
        );
      case "orders":
        return <CustomerBettingOrders />;
      case "assets":
        return (
          <AssetsPage />
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
    <div className="h-screen w-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-3">
                  {user?.username?.charAt(0).toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-gray-900">{user?.name || user?.username}</div>
                <div className="text-xs text-gray-500">Welcome back</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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
      <main className="flex-1 overflow-auto pb-20 sm:pb-24 md:pb-16">
        <div className="w-full h-full">
          <div className="pb-4 sm:pb-6 md:pb-8">
            {renderSection()}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset">
        <div className="w-full max-w-screen-xl mx-auto">
          <div className="grid grid-cols-5 py-2 sm:py-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedCurrency(null);
                    setActiveSection(section.id);
                  }}
                  className={`flex flex-col items-center py-2 px-1 transition-colors duration-200 ${
                    activeSection === section.id && !selectedCurrency
                      ? "text-primary bg-primary/5"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                  <span className="text-xs sm:text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

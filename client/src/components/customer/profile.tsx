import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CreditCard, 
  Shield, 
  MessageSquare, 
  HelpCircle, 
  Settings,
  ArrowLeft,
  LogOut,
  Home,
  Key,
  Globe
} from "lucide-react";

export function Profile() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'main' | 'settings'>('main');

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  // Settings Page
  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('main')}
              className="p-1 mr-2"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          <h1 className="text-lg font-medium text-gray-900">Settings</h1>
          <div className="w-8"></div>
        </div>

        {/* Settings Menu */}
        <div className="p-4 space-y-1">
          {/* Login Password */}
          <div className="bg-white rounded-lg border border-gray-200">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-14 px-4"
            >
              <div className="flex items-center space-x-3">
                <Key className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Login Password</span>
              </div>
            </Button>
          </div>

          {/* Capital Code */}
          <div className="bg-white rounded-lg border border-gray-200">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-14 px-4"
            >
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Capital Code</span>
              </div>
            </Button>
          </div>

          {/* Switch Language */}
          <div className="bg-white rounded-lg border border-gray-200">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-14 px-4"
            >
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Switch Language</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Exit Login Button */}
        <div className="p-4 mt-8">
          <Button
            onClick={handleLogout}
            className="w-full h-14 text-white font-medium rounded-2xl"
            style={{
              background: "linear-gradient(90deg, #FFA500 0%, #FF6B35 100%)"
            }}
          >
            Exit Login
          </Button>
        </div>
      </div>
    );
  }

  // Main Profile Page
  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      {/* Header Section with User Info */}
      <div className="px-4 py-8">
        <div className="flex items-center space-x-4 text-white">
          <Avatar className="w-12 h-12">
            <AvatarImage src="/api/placeholder/64/64" alt="Profile" />
            <AvatarFallback className="bg-white bg-opacity-20 text-white">
              {user.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-medium">{user.email || user.username}</div>
            <div className="text-sm opacity-90">UID:{user.id}00100102J</div>
            <div className="text-sm opacity-90">Credit Score:{user.creditScore || 80}</div>
            <div className="text-sm opacity-90">Available Balance:{parseFloat(user.availableBalance || user.balance || "0").toFixed(2)} BDT</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-gray-50 flex-1 px-4 py-4 space-y-1">
        {/* Collection Information */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start h-14 px-4"
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Collection Information</span>
            </div>
          </Button>
        </div>

        {/* Authentication */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start h-14 px-4"
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Authentication</span>
            </div>
          </Button>
        </div>

        {/* User Message */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start h-14 px-4"
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">User Message</span>
            </div>
          </Button>
        </div>

        {/* Help Center */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start h-14 px-4"
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Help Center</span>
            </div>
          </Button>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start h-14 px-4"
            onClick={() => setCurrentView('settings')}
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Settings</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
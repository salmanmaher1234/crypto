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
  Globe,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function Profile() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'main' | 'settings' | 'collection' | 'authentication' | 'userMessage' | 'helpCenter' | 'loginPassword' | 'switchLanguage'>('main');

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  // Collection Information Page
  if (currentView === 'collection') {
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
          <h1 className="text-lg font-medium text-gray-900">Collection Information</h1>
          <div className="w-8"></div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">City Bank PLC</div>
              <div className="text-sm text-gray-600">2204***1001</div>
            </div>
          </div>
        </div>

        {/* Add Collection Information Button */}
        <div className="p-4 fixed bottom-4 left-4 right-4">
          <Button
            className="w-full h-12 text-white font-medium rounded-2xl"
            style={{
              background: "linear-gradient(90deg, #FFA500 0%, #FF6B35 100%)"
            }}
          >
            Add Collection Information
          </Button>
        </div>
      </div>
    );
  }

  // Authentication Page
  if (currentView === 'authentication') {
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
          <h1 className="text-lg font-medium text-gray-900">Authentication</h1>
          <div className="w-8"></div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Basic Authentication */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">Basic Authentication</h3>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Completed</span>
            </div>
            <p className="text-xs text-gray-500">
              Complete basic email or mobile phone authentication, therefore, the fund transaction will be automatically notified by e-mail or mobile phone, and the market dynamics will be immediately tracked
            </p>
          </div>

          {/* Identity Authentication */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">Identity Authentication</h3>
              <span className="text-xs text-gray-500">Not authenticated</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Authentication of True Identity Information. We will arrange a 7*24 hour dedicated VIP customer service manager to analysis for you
            </p>
            
            <Button
              className="w-full h-12 text-white font-medium rounded-2xl"
              style={{
                background: "linear-gradient(90deg, #FFA500 0%, #FF6B35 100%)"
              }}
            >
              Start Authentication
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User Message Page (Empty)
  if (currentView === 'userMessage') {
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
          <h1 className="text-lg font-medium text-gray-900">User Message</h1>
          <div className="w-8"></div>
        </div>

        {/* Empty Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <div className="text-lg mb-2">No Messages</div>
            <div className="text-sm">You have no messages at this time.</div>
          </div>
        </div>
      </div>
    );
  }

  // Help Center Page (Empty)
  if (currentView === 'helpCenter') {
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
          <h1 className="text-lg font-medium text-gray-900">Help Center</h1>
          <div className="w-8"></div>
        </div>

        {/* Empty Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <div className="text-lg mb-2">Help Center</div>
            <div className="text-sm">Contact support for assistance.</div>
          </div>
        </div>
      </div>
    );
  }

  // Login Password Page
  if (currentView === 'loginPassword') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('settings')}
              className="p-1 mr-2"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          <h1 className="text-lg font-medium text-gray-900">Login Password</h1>
          <div className="w-8"></div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Old login password */}
          <div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Old login password"
                className="h-12 pr-12 text-gray-600 placeholder-gray-500"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Eye className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
          </div>

          {/* New Login Password */}
          <div>
            <div className="relative">
              <Input
                type="password"
                placeholder="New Login Password"
                className="h-12 pr-12 text-gray-600 placeholder-gray-500"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Eye className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
          </div>

          {/* confirm new password */}
          <div>
            <div className="relative">
              <Input
                type="password"
                placeholder="confirm new password"
                className="h-12 pr-12 text-gray-600 placeholder-gray-500"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Eye className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Submit Settings Button */}
          <div className="pt-6">
            <Button
              className="w-full h-12 text-white font-medium rounded-2xl"
              style={{
                background: "linear-gradient(90deg, #FFA500 0%, #FF6B35 100%)"
              }}
            >
              Submit Settings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Switch Language Page
  if (currentView === 'switchLanguage') {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'rupiah', name: 'Rupiah' },
      { code: 'bangla', name: 'বাংলা' },
      { code: 'de', name: 'Deutsch' },
      { code: 'ru', name: 'Russian' },
      { code: 'vi', name: 'Tiếng Việt' },
      { code: 'es', name: 'Español' },
      { code: 'it', name: 'Italian' },
      { code: 'ja', name: '日本語' },
      { code: 'fr', name: 'Français' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'zh', name: '简体中文' },
      { code: 'ar', name: 'عربي' }
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('settings')}
              className="p-1 mr-2"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          <h1 className="text-lg font-medium text-gray-900">Switch Language</h1>
          <div className="w-8"></div>
        </div>

        {/* Language Options */}
        <div className="p-4">
          {languages.map((language, index) => (
            <div key={language.code} className="mb-3">
              <Button
                variant="ghost"
                className={`w-full h-12 justify-center text-gray-900 bg-white border border-gray-200 rounded-full hover:bg-gray-50 ${
                  language.code === 'en' ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                {language.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
              onClick={() => setCurrentView('loginPassword')}
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
              onClick={() => setCurrentView('switchLanguage')}
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
            <AvatarFallback className="bg-white bg-opacity-20 text-white flex items-center justify-center">
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 8C8.55 8 9 8.45 9 9C9 9.55 8.55 10 8 10C7.45 10 7 9.55 7 9C7 8.45 7.45 8 8 8ZM16 8C16.55 8 17 8.45 17 9C17 9.55 16.55 10 16 10C15.45 10 15 9.55 15 9C15 8.45 15.45 8 16 8ZM12 19C9.79 19 7.79 17.79 6.79 16C7.29 14.5 9.5 13.5 12 13.5C14.5 13.5 16.71 14.5 17.21 16C16.21 17.79 14.21 19 12 19Z"/>
                <path d="M12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6Z" opacity="0.7"/>
              </svg>
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
            onClick={() => setCurrentView('collection')}
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
            onClick={() => setCurrentView('authentication')}
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
            onClick={() => setCurrentView('userMessage')}
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
            onClick={() => setCurrentView('helpCenter')}
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
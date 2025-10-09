import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RegisterModal } from "./register-modal";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export function LoginModal() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { login, isLoginPending } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password }, {
      onError: () => {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-3">
            {/* Gradient S Logo */}
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#5B9FFF', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#7B68EE', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#9D5CFF', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <text 
                  x="50" 
                  y="70" 
                  fontSize="72" 
                  fontWeight="bold" 
                  fill="url(#logo-gradient)" 
                  textAnchor="middle"
                  fontFamily="Arial, sans-serif"
                >
                  S
                </text>
                {/* Decorative dots */}
                <circle cx="22" cy="35" r="5" fill="#5B9FFF" />
                <circle cx="30" cy="28" r="4" fill="#7B68EE" />
                <circle cx="15" cy="45" r="4" fill="#9D5CFF" />
                <circle cx="20" cy="55" r="3" fill="#5B9FFF" />
              </svg>
            </div>
            {/* Super Coin Text */}
            <h1 className="text-4xl font-bold" style={{ color: '#4FC3C3' }}>
              Super Coin
            </h1>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your UserName"
              className="h-14 pl-12 pr-4 border-2 border-gray-300 rounded-lg focus:border-[#7CB342] focus:ring-0 text-base"
              required
              data-testid="input-username"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password Length 6~30"
              className="h-14 pl-12 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#7CB342] focus:ring-0 text-base"
              required
              data-testid="input-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Login Button */}
          <Button 
            type="submit" 
            className="w-full h-14 text-white font-semibold text-lg rounded-lg transition-all duration-200 shadow-md hover:shadow-lg" 
            style={{ backgroundColor: '#7CB342' }}
            disabled={isLoginPending}
            data-testid="button-login"
          >
            {isLoginPending ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <span className="text-gray-600">No UserName? </span>
          <button
            type="button"
            onClick={() => setShowRegister(true)}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            data-testid="link-register"
          >
            Register Now
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-gray-500 text-sm">
          <p>Super Coin Technology</p>
          <p>All Rights Reserved</p>
          <p>©2021-2025</p>
        </div>
      </div>

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    </div>
  );
}

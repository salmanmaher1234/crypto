import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RegisterModal } from "./register-modal";

export function LoginModal() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const { login, isLoginPending, loginError } = useAuth();
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">SuperCoin</CardTitle>
          <CardDescription>Sign in to your investment account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoginPending}
            >
              {isLoginPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          


          {/* Register Link */}
          <div className="text-center mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Register Now
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    </div>
  );
}

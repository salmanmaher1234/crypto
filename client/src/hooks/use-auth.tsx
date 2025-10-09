import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { useEffect, useMemo } from "react";

interface AuthResponse {
  user: User;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const sessionId = useMemo(() => localStorage.getItem('sessionId'), []);

  // Auto-refresh balance every 30 seconds when user is logged in (reduced frequency)
  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) return;
    
    const interval = setInterval(() => {
      // Only invalidate if the user is currently authenticated
      const currentAuth = queryClient.getQueryData(["/api/auth/me"]);
      if (currentAuth) {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      }
    }, 30000); // Refresh every 30 seconds instead of 10
    
    return () => clearInterval(interval);
  }, [queryClient]);

  const { data: authData, isLoading } = useQuery<AuthResponse | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const storedSessionId = localStorage.getItem('sessionId');
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (storedSessionId) {
        headers["X-Session-Id"] = storedSessionId;
      }

      const response = await fetch("/api/auth/me", {
        credentials: "include",
        headers,
      });

      if (response.status === 401) {
        // Session is invalid or expired - clear it
        console.log("Session unauthorized, clearing localStorage");
        localStorage.removeItem('sessionId');
        queryClient.setQueryData(["/api/auth/me"], null);
        return null;
      }

      if (!response.ok) {
        throw new Error("Auth check failed");
      }

      return await response.json();
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 24 * 60 * 60 * 1000, // 30 days
    enabled: !!sessionId, // Enable if sessionId exists
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      const data = await response.json();
      
      // Store sessionId for header-based authentication
      if (data.sessionId) {
        localStorage.setItem('sessionId', data.sessionId);
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Set auth data directly
      queryClient.setQueryData(["/api/auth/me"], data);
      // Force a re-query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      // Trigger a page reload to ensure the app re-initializes with the new session
      window.location.href = '/';
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const storedSessionId = localStorage.getItem('sessionId');
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedSessionId && { "X-Session-Id": storedSessionId })
        },
        credentials: "include",
      });
      localStorage.removeItem('sessionId');
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.clear();
      // Reload page to clear all state
      window.location.href = '/';
    },
  });

  return {
    user: authData?.user,
    isLoading: isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}

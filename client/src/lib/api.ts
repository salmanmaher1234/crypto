import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User, Transaction, BettingOrder, WithdrawalRequest, Announcement, BankAccount } from "@shared/schema";

// Users API
export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["/api/users"],
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<User> }) => {
      const response = await apiRequest("PATCH", `/api/users/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });
}

// Transactions API
export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transaction: { userId: number; type: string; amount: string; description?: string }) => {
      const response = await apiRequest("POST", "/api/transactions", transaction);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });
}

// Betting Orders API
export function useBettingOrders() {
  return useQuery<BettingOrder[]>({
    queryKey: ["/api/betting-orders"],
  });
}

export function useActiveBettingOrders() {
  return useQuery<BettingOrder[]>({
    queryKey: ["/api/betting-orders/active"],
  });
}

export function useCreateBettingOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (order: { asset: string; amount: string; direction: string; duration: number; entryPrice: string }) => {
      const response = await apiRequest("POST", "/api/betting-orders", order);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/betting-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/betting-orders/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });
}

export function useUpdateBettingOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<BettingOrder> }) => {
      const response = await apiRequest("PATCH", `/api/betting-orders/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/betting-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/betting-orders/active"] });
    },
  });
}

// Withdrawal Requests API
export function useWithdrawalRequests() {
  return useQuery<WithdrawalRequest[]>({
    queryKey: ["/api/withdrawal-requests"],
  });
}

export function useCreateWithdrawalRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: { bankAccountId: number; amount: string }) => {
      const response = await apiRequest("POST", "/api/withdrawal-requests", request);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/withdrawal-requests"] });
    },
  });
}

export function useUpdateWithdrawalRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/withdrawal-requests/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/withdrawal-requests"] });
    },
  });
}

// Announcements API
export function useAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });
}

export function useAllAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ["/api/announcements/all"],
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (announcement: { title: string; content: string; type: string }) => {
      const response = await apiRequest("POST", "/api/announcements", announcement);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements/all"] });
    },
  });
}

// Bank Accounts API
export function useBankAccounts() {
  return useQuery<BankAccount[]>({
    queryKey: ["/api/bank-accounts"],
  });
}

export function useCreateBankAccount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bankAccount: { accountHolderName: string; accountNumber: string; bankName: string; ifscCode: string }) => {
      const response = await apiRequest("POST", "/api/bank-accounts", bankAccount);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bank-accounts"] });
    },
  });
}

// Crypto Prices API
export function useCryptoPrices() {
  return useQuery({
    queryKey: ["/api/crypto-prices"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

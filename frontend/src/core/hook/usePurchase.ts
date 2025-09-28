"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { purchaseApi } from "@/core/api/purchaseApi";
import toast from "react-hot-toast";
import { useAuthQuery } from "./useAuth";
import { Order } from "../models/Order";

export function usePurchase(eventId: string) {
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading, refreshUser } = useAuthQuery() as {
    user: { accessToken?: string } | null;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
  };

  // GET tickets for event (wait for auth to finish and token available)
  const purchaseQuery = useQuery<Order[], Error>({
    queryKey: ["purchase", ticketId],
    queryFn: async () => {
      if (!user?.accessToken) throw new Error("Not authenticated");
      return purchaseApi.listPurchaseByTicket(ticketId, user.accessToken);
    },
    enabled: !!ticketId && !authLoading && !!user?.accessToken,
    onError: (err: Error) => toast.error(err.message || "Failed to fetch tickets"),
  });

  // Wrapper to refresh token before mutation
  const mutateWithToken = async (mutationFn: (token: string) => Promise<any>) => {
    if (!user?.accessToken) {
      await refreshUser(); // refresh token if null
    }
    if (!user?.accessToken) throw new Error("Not authenticated");
    return mutationFn(user.accessToken);
  };

  const purchaseTicket = useMutation({
    mutationFn: (payload: Partial<Order>) => mutateWithToken((token) => purchaseApi.purchaseTicket(payload, token)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["purchase", ticketId] }),
    onError: (err: any) => toast.error(err.message || "Failed to create ticket"),
  });

  return {
    tickets: purchaseQuery.data ?? [],
    isLoading: purchaseQuery.isLoading || authLoading,
    isError: purchaseQuery.isError,
    error: purchaseQuery.error,
    purchaseTicket: purchaseTicket.mutateAsync
  };
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { purchaseApi } from "@/core/api/purchaseApi";
import toast from "react-hot-toast";
import { Order } from "../models/Order";

export function usePurchase(ticketId: string, token: string | null) {
  const queryClient = useQueryClient();

  // GET purchase list
  const purchaseQuery = useQuery<Order[], Error>({
    queryKey: ["purchase", ticketId],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");
      return purchaseApi.listPurchaseByTicket(ticketId);
    },
    enabled: !!ticketId && !!token,
    onError: (err: Error) =>
      toast.error(err.message || "Failed to fetch purchases"),
  });

  // MUTATION: purchase order
  const purchaseOrder = useMutation({
    mutationFn: (payload: Partial<Order>) => {
      if (!token) throw new Error("Not authenticated");
      return purchaseApi.purchaseTicket(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets_byId", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["availableTickets"] });
    },
    onError: (err: any) =>
      toast.error(err.message || "Failed to create purchase"),
  });

  return {
    ticket: purchaseQuery.data ?? [],
    isLoading: purchaseQuery.isLoading,
    isError: purchaseQuery.isError,
    error: purchaseQuery.error,
    purchaseOrders: purchaseOrder.mutateAsync,
  };
}

// "use client";

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { purchaseApi } from "@/core/api/purchaseApi";
// import toast from "react-hot-toast";
// import { useAuthQuery } from "./useAuth";
// import { Order } from "../models/Order";

// export function usePurchase(ticketId: string, token: string) {
//   const queryClient = useQueryClient();
//   const { user, isLoading: authLoading, refreshUser } = useAuthQuery() as {
//     user: { accessToken?: string } | null;
//     isLoading: boolean;
//     refreshUser: () => Promise<void>;
//   };

//   // GET tickets for event (wait for auth to finish and token available)
//   const purchaseQuery = useQuery<Order[], Error>({
//     queryKey: ["purchase", ticketId],
//     queryFn: async () => {
//       if (!user?.accessToken) throw new Error("Not authenticated");
//       return purchaseApi.listPurchaseByTicket(ticketId);
//     },
//     enabled: !!ticketId && !authLoading && !!user?.accessToken,
//     onError: (err: Error) => toast.error(err.message || "Failed to fetch tickets"),
//   });

//   // Wrapper to refresh token before mutation
//   const mutateWithToken = async (mutationFn: (token: string) => Promise<any>) => {
//     if (!user?.accessToken) {
//       await refreshUser(); // refresh token if null
//     }
//     if (!user?.accessToken) throw new Error("Not authenticated");
//     return mutationFn(user.accessToken);
//   };

//   const purchaseOrder = useMutation({
//     mutationFn: (payload: Partial<Order>) => mutateWithToken((token) => purchaseApi.purchaseTicket(payload, token)),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["purchase", ticketId] }),
//       queryClient.invalidateQueries({ queryKey: ["tickets_byId", ticketId] }),
//       queryClient.invalidateQueries({ queryKey: ["avail_tickets"] })
//     },
//     onError: (err: any) => toast.error(err.message || "Failed to create ticket"),
//   });

//   return {
//     ticket: purchaseQuery.data ?? [],
//     isLoading: purchaseQuery.isLoading || authLoading,
//     isError: purchaseQuery.isError,
//     error: purchaseQuery.error,
//     purchaseOrders: purchaseOrder.mutateAsync
//   };
// }

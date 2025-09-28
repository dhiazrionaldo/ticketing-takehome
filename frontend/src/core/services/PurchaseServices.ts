// src/core/hook/useTicket.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { purchaseApi } from "@/core/api/purchaseApi";
import { Ticket } from "@/core/models/Ticket";
import { Event } from "@/core/models/Event";

/**
 * usePurchase
 *
 * Purpose:
 *  - Encapsulate TanStack Query for purchase ticket
 *  - Cache purchase per-ticket
 */
export function usePurchase(ticketId: string) {
  const queryClient = useQueryClient();

  // list tickets for one event
  const purchaseQuery = useQuery<Ticket[], Error>({
    queryKey: ["purchase", ticketId],
    queryFn: () => purchaseApi.listPurchaseByTicket(ticketId),
  });

  // purchase
  const purchaseTicket = useMutation({
    mutationFn: (payload: Partial<Ticket>) => purchaseApi.purchaseTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase", ticketId] });
    },
  });

  return {
    order: purchaseQuery.data ?? [],
    isLoading: purchaseQuery.isLoading,
    error: purchaseQuery.error,
    createTicket: purchaseTicket.mutateAsync
  };
}

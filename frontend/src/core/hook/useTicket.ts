"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ticketApi } from "@/core/api/ticketApi";
import { Ticket } from "@/core/models/Ticket";
import toast from "react-hot-toast";
import { useAuthQuery } from "./useAuth";

export function useTickets(eventId: string) {
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading, refreshUser } = useAuthQuery();

  // Wait for user token before doing anything
  const ticketsQuery = useQuery<Ticket[], Error>({
    queryKey: ["tickets", eventId],
    queryFn: async () => {
      // refresh user if token not ready
      if (!user?.accessToken) {
        await refreshUser();
        if (!user?.accessToken) throw new Error("Not authenticated");
      }
      return ticketApi.listTicketsByEvent(eventId);
    },
    enabled: !!eventId, // only if eventId exists
    onError: (err: Error) => toast.error(err.message || "Failed to fetch tickets"),
  });

  // CREATE ticket
  const createTicket = useMutation({
    mutationFn: async (payload: Partial<Ticket>) => {
      if (!user?.accessToken) await refreshUser();
      if (!user?.accessToken) throw new Error("Not authenticated");
      return ticketApi.createTicket(payload, user.accessToken);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets", eventId] }),
  });

  // UPDATE ticket
  const updateTicket = useMutation({
    mutationFn: async (payload: Partial<Ticket>) => {
      if (!user?.accessToken) await refreshUser();
      if (!user?.accessToken) throw new Error("Not authenticated");
      return ticketApi.updateTicket(payload, user.accessToken);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets", eventId] }),
  });

  // DELETE ticket
  const deleteTicket = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.accessToken) await refreshUser();
      if (!user?.accessToken) throw new Error("Not authenticated");
      return ticketApi.deleteTicket(id, user.accessToken);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets", eventId] }),
  });

  return {
    tickets: ticketsQuery.data ?? [],
    isLoading: ticketsQuery.isLoading || authLoading,
    isError: ticketsQuery.isError,
    error: ticketsQuery.error,
    createTicket: createTicket.mutateAsync,
    updateTicket: updateTicket.mutateAsync,
    deleteTicket: deleteTicket.mutateAsync,
  };
}
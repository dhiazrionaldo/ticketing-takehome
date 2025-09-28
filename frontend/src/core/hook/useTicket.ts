"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ticketApi } from "@/core/api/ticketApi";
import { Ticket } from "@/core/models/Ticket";
import toast from "react-hot-toast";
import { useAuthQuery } from "./useAuth";

export function useAvailableTickets() {
  const { user, isLoading: authLoading, refreshUser } = useAuthQuery() as {
    user: { accessToken?: string } | null;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
  };

  // GET tickets for event (wait for auth to finish and token available)
  const ticketsAvailableQuery = useQuery<Ticket[], Error>({
    queryKey: ["avail_tickets"],
    queryFn: async () => {
      if (!user?.accessToken) throw new Error("Not authenticated");
      return ticketApi.listTickets();
    },
    enabled: !authLoading && !!user?.accessToken,
    onError: (err: Error) => toast.error(err.message || "Failed to fetch tickets"),
  });

  return {
    availableTickets: ticketsAvailableQuery.data ?? [],
  };
}
export function useTickets(eventId: string) {
  const { user, isLoading: authLoading, refreshUser } = useAuthQuery() as {
    user: { accessToken?: string } | null;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
  };

  // GET tickets for event (wait for auth to finish and token available)
  const ticketsQuery = useQuery<Ticket[], Error>({
    queryKey: ["tickets", eventId],
    queryFn: async () => {
      if (!user?.accessToken) throw new Error("Not authenticated");
      return ticketApi.listTicketsByEvent(eventId, user.accessToken);
    },
    enabled: !!eventId && !authLoading && !!user?.accessToken,
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

  const createTicket = useMutation({
    mutationFn: (payload: Partial<Ticket>) => mutateWithToken((token) => ticketApi.createTicket(payload, token)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets", eventId] }),
    onError: (err: any) => toast.error(err.message || "Failed to create ticket"),
  });

  const updateTicket = useMutation({
    mutationFn: (payload: Partial<Ticket>) => mutateWithToken((token) => ticketApi.updateTicket(payload, token)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets", eventId] }),
    onError: (err: any) => toast.error(err.message || "Failed to update ticket"),
  });

  const deleteTicket = useMutation({
    mutationFn: (id: string) => mutateWithToken((token) => ticketApi.deleteTicket(id, token)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets", eventId] }),
    onError: (err: any) => toast.error(err.message || "Failed to delete ticket"),
  });

  return {
    tickets: ticketsQuery.data ?? [],
    availableTickets: ticketsAvailableQuery.data ?? [],
    isLoading: ticketsQuery.isLoading || authLoading,
    isError: ticketsQuery.isError,
    error: ticketsQuery.error,
    createTicket: createTicket.mutateAsync,
    updateTicket: updateTicket.mutateAsync,
    deleteTicket: deleteTicket.mutateAsync,
  };
}

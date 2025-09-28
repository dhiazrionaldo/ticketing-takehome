// src/core/hook/useTicket.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ticketApi } from "@/core/api/ticketApi";
import { Ticket } from "@/core/models/Ticket";

/**
 * useTickets
 *
 * Purpose:
 *  - Encapsulate TanStack Query for Ticket CRUD
 *  - Cache tickets per-event
 */

export function useTicketById(ticketId: string) {
 // list tickets for one event
  const TicketsByIdQuery = useQuery<Ticket[], Error>({
    queryKey: ["tickets_byId",ticketId],
    queryFn: () => ticketApi.listTicketsById(ticketId),
  });
  return {
    tickets: TicketsByIdQuery.data ?? [],
    isLoading: TicketsByIdQuery.isLoading,
    error: TicketsByIdQuery.error,
  };
}
export function useTickets(eventId: string) {
  const queryClient = useQueryClient();
  
   // list tickets for one event
  const availTicketsQuery = useQuery<Ticket[], Error>({
    queryKey: ["avail_tickets"],
    queryFn: () => ticketApi.listTickets(),
  });

    
  // list tickets for one event
  const ticketsQuery = useQuery<Ticket[], Error>({
    queryKey: ["tickets", eventId],
    queryFn: () => ticketApi.listTicketsByEvent(eventId),
  });

  // create
  const createTicket = useMutation({
    mutationFn: (payload: Partial<Ticket>) => ticketApi.createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets", eventId] });
    },
  });

  // update
  const updateTicket = useMutation({
    mutationFn: (payload: Partial<Ticket>) => ticketApi.updateTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets", eventId] });
    },
  });

  // delete
  const deleteTicket = useMutation({
    mutationFn: (id: string) => ticketApi.deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets", eventId] });
    },
  });

  return {
    tickets: ticketsQuery.data ?? [],
    availTickets: availTicketsQuery.data ?? [],
    isLoading: ticketsQuery.isLoading,
    error: ticketsQuery.error,
    createTicket: createTicket.mutateAsync,
    updateTicket: updateTicket.mutateAsync,
    deleteTicket: deleteTicket.mutateAsync,
  };
}

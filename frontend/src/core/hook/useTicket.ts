"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ticketApi } from "@/core/api/ticketApi";
import { Ticket } from "@/core/models/Ticket";
import toast from "react-hot-toast";
import { useAuthQuery } from "./useAuth";

function useAuthenticatedQuery<TData>(
  queryKey: any[],
  queryFn: (token: string) => Promise<TData>,
  enabled: boolean,
  onErrorMessage: string
) {
  const { user, isLoading: isAuthLoading, refreshUser } = useAuthQuery() as {
    user: { accessToken?: string } | null;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
  };

  return useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      let token = user?.accessToken;
      if (!token) {
        await refreshUser();
        token = user?.accessToken;
      }
      if (!token) throw new Error("Authentication failed: no token found");
      return queryFn(token);
    },
    enabled: enabled && !isAuthLoading,
    onError: (error: Error) => toast.error(error.message || onErrorMessage),
  });
}

function useAuthenticatedMutation<TPayload, TResult>(
  mutationFn: (payload: TPayload, token: string) => Promise<TResult>,
  queryClient: ReturnType<typeof useQueryClient>,
  invalidateKey: any[],
  errorMessage: string
) {
  const { user, refreshUser } = useAuthQuery() as {
    user: { accessToken?: string } | null;
    refreshUser: () => Promise<void>;
  };

  return useMutation({
    mutationFn: async (payload: TPayload) => {
      let token = user?.accessToken;
      if (!token) {
        await refreshUser();
        token = user?.accessToken;
      }
      if (!token) throw new Error("Authentication failed: no token found");
      return mutationFn(payload, token);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invalidateKey }),
    onError: (error: any) => toast.error(error.message || errorMessage),
  });
}

export function useAvailableTickets() {
  const ticketsQuery = useAuthenticatedQuery<Ticket[]>(
    ["availableTickets"],
    () => ticketApi.listTickets(),
    true,
    "Failed to fetch available tickets"
  );

  return {
    availableTickets: ticketsQuery.data ?? [],
    isLoading: ticketsQuery.isLoading,
    isError: ticketsQuery.isError,
  };
}

export function useTicketById(ticketId: string) {
  const ticketsQuery = useAuthenticatedQuery<Ticket[]>(
    ["ticketById", ticketId],
    (token) => ticketApi.listTicketsByEvent(ticketId),
    !!ticketId,
    "Failed to fetch ticket by ID"
  );

  return {
    ticketById: ticketsQuery.data ?? [],
    isLoading: ticketsQuery.isLoading,
    isError: ticketsQuery.isError,
  };
}

export function useTickets(eventId: string, token: string) {
  const queryClient = useQueryClient();

  const ticketsQuery = useAuthenticatedQuery<Ticket[]>(
    ["tickets", eventId],
    (token) => ticketApi.listTicketsByEvent(eventId, token),
    !!eventId,
    "Failed to fetch tickets"
  );

  const createTicketMutation = useAuthenticatedMutation<Partial<Ticket>, Ticket>(
    (payload, token) => ticketApi.createTicket(payload, token),
    queryClient,
    ["tickets", eventId],
    "Failed to create ticket"
  );

  const updateTicketMutation = useAuthenticatedMutation<Partial<Ticket>, Ticket>(
    (payload, token) => ticketApi.updateTicket(payload, token),
    queryClient,
    ["tickets", eventId],
    "Failed to update ticket"
  );

  const deleteTicketMutation = useAuthenticatedMutation<string, void>(
    (id, token) => ticketApi.deleteTicket(id, token),
    queryClient,
    ["tickets", eventId],
    "Failed to delete ticket"
  );

  return {
    tickets: ticketsQuery.data ?? [],
    isLoading: ticketsQuery.isLoading,
    isError: ticketsQuery.isError,
    error: ticketsQuery.error,
    createTicket: createTicketMutation.mutateAsync,
    updateTicket: updateTicketMutation.mutateAsync,
    deleteTicket: deleteTicketMutation.mutateAsync,
  };
}

// "use client";

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { ticketApi } from "@/core/api/ticketApi";
// import { Ticket } from "@/core/models/Ticket";
// import toast from "react-hot-toast";
// import { useAuthQuery } from "./useAuth";

// export function useAvailableTickets() {
//   const { user, isLoading: authLoading, refreshUser } = useAuthQuery() as {
//     user: { accessToken?: string } | null;
//     isLoading: boolean;
//     refreshUser: () => Promise<void>;
//   };

//   // GET tickets for event (wait for auth to finish and token available)
//   const ticketsAvailableQuery = useQuery<Ticket[], Error>({
//     queryKey: ["avail_tickets"],
//     queryFn: async () => {
//       if (!user?.accessToken) throw new Error("Not authenticated");
//       return ticketApi.listTickets();
//     },
//     enabled: !authLoading && !!user?.accessToken,
//     onError: (err: Error) => toast.error(err.message || "Failed to fetch tickets"),
//   });

//   return {
//     availableTickets: ticketsAvailableQuery.data ?? [],
//   };
// }

// export function useTicketById(ticketId: string) {
//   const { user, isLoading: authLoading, refreshUser } = useAuthQuery() as {
//     user: { accessToken?: string } | null;
//     isLoading: boolean;
//     refreshUser: () => Promise<void>;
//   };

//   // GET tickets for event (wait for auth to finish and token available)
//   const ticketsIdQuery = useQuery<Ticket[], Error>({
//     queryKey: ["tickets_id", ticketId],
//     queryFn: async () => {
//       if (!user?.accessToken) throw new Error("Not authenticated");
//       return ticketApi.listTicketsByEvent(ticketId, user.accessToken);
//     },
//     enabled: !!ticketId && !authLoading && !!user?.accessToken,
//     onError: (err: Error) => toast.error(err.message || "Failed to fetch tickets"),
//   });

//   return {
//     ticketById: ticketsIdQuery.data ?? [],
//   };
// }

// export function useTickets(eventId: string) {
//   const queryClient = useQueryClient();
//   const { user, isLoading: authLoading, refreshUser } = useAuthQuery() as {
//     user: { accessToken?: string } | null;
//     isLoading: boolean;
//     refreshUser: () => Promise<void>;
//   };

  
//   // GET tickets for event (wait for auth to finish and token available)
//   const ticketsQuery = useQuery<Ticket[], Error>({
//     queryKey: ["tickets", eventId],
//     queryFn: async () => {
//       if (!user?.accessToken) throw new Error("Not authenticated");
//       return ticketApi.listTicketsByEvent(eventId, user.accessToken);
//     },
//     enabled: !!eventId && !authLoading && !!user?.accessToken,
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

//   const createTicket = useMutation({
//     mutationFn: (payload: Partial<Ticket>) => mutateWithToken((token) => ticketApi.createTicket(payload, token)),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets", eventId] }),
//     onError: (err: any) => toast.error(err.message || "Failed to create ticket"),
//   });

//   const updateTicket = useMutation({
//     mutationFn: (payload: Partial<Ticket>) => mutateWithToken((token) => ticketApi.updateTicket(payload, token)),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets", eventId] }),
//     onError: (err: any) => toast.error(err.message || "Failed to update ticket"),
//   });

//   const deleteTicket = useMutation({
//     mutationFn: (id: string) => mutateWithToken((token) => ticketApi.deleteTicket(id, token)),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets", eventId] }),
//     onError: (err: any) => toast.error(err.message || "Failed to delete ticket"),
//   });

//   return {
//     tickets: ticketsQuery.data ?? [],
//     isLoading: ticketsQuery.isLoading || authLoading,
//     isError: ticketsQuery.isError,
//     error: ticketsQuery.error,
//     createTicket: createTicket.mutateAsync,
//     updateTicket: updateTicket.mutateAsync,
//     deleteTicket: deleteTicket.mutateAsync,
//   };
// }

// src/core/hook/useEvent.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../api/eventApi";
import { Event } from "../models/Event";
import { useAuthQuery } from "./useAuth";
import toast from "react-hot-toast";

export function useEvents() {
  const queryClient = useQueryClient();
  const { user } = useAuthQuery() as { user: { accessToken?: string } };
  const token = user?.accessToken;

  // GET events (public)
  const {
    data: events = [],
    isError,
    error,
    isLoading,
  } = useQuery<Event[], Error>({
    queryKey: ["events"],
    queryFn: () => eventApi.listEvents(),
    onError: (err: Error) => {
      toast.error(err.message || "Failed to fetch events ❌");
    },
  });

  // CREATE
  const createEvent = useMutation({
    mutationFn: (payload: Partial<Event>) => {
      if (!token) throw new Error("Not authenticated");
      return eventApi.createEvent(payload, token);
    },
    onSuccess: () => {
      toast.success("Event created 🎉");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to create event ❌");
    },
  });

  // UPDATE
  const updateEvent = useMutation({
    mutationFn: (payload: Partial<Event>) => {
      if (!token) throw new Error("Not authenticated");
      return eventApi.updateEvent(payload, token);
    },
    onSuccess: () => {
      toast.success("Event updated ✅");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to update event ❌");
    },
  });

  // DELETE
  const deleteEvent = useMutation({
    mutationFn: (payload: Partial<Event>) => {
      if (!token) throw new Error("Not authenticated");
      return eventApi.deleteEvent(payload, token);
    },
    onSuccess: () => {
      toast.success("Event deleted 🗑️");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to delete event ❌");
    },
  });

  return {
    events,
    isLoading,
    isError,
    error,
    createEvent: createEvent.mutateAsync,
    updateEvent: updateEvent.mutateAsync,
    deleteEvent: deleteEvent.mutateAsync,
  };
}

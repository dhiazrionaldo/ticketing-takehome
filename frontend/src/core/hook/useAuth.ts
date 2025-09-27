"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/core/services/AuthServices";
import { User } from "@/core/models/User";

/**
 * useAuthQuery
 *
 * Purpose:
 *  - Provide a single source of truth for auth using TanStack Query.
 *  - Keep React Query cache in sync with Supabase auth events.
 *
 * Returns:
 *  - user: User | null
 *  - isAuthenticated: boolean
 *  - isLoading: boolean
 *  - error: unknown
 *  - signUp({email,password})
 *  - signIn({email,password})
 *  - signOut()
 *  - refreshUser()  // revalidate current user
 *
 * TODO (learning notes):
 *  - TODO: add revalidate-on-focus / retry policies based on app needs.
 *  - TODO: add persisted storage for tokens if you want longer sessions (supabase handles refresh).
 *  - TODO: add role checks / authorization helpers here (e.g. isAdmin).
 */

export function useAuthQuery() {
  const queryClient = useQueryClient();

  // ---------- user query ----------
  // TODO: tune staleTime / cacheTime if you want less/more frequent refetches.
  const userQuery = useQuery<User | null, unknown>({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      // TODO: consider returning a lightweight User DTO instead of full supabase user
      return authService.getCurrentUser();
    },
    // keep data for 5 minutes by default
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    // we don't want automatic refetch intervals here; manual refresh via refreshUser is fine
    refetchOnWindowFocus: false,
  });

  // ---------- Subscribe to Supabase auth events ----------
  useEffect(() => {
    // TODO: examine events ('SIGNED_IN','SIGNED_OUT','TOKEN_REFRESH') for custom logic
    const sub = authService.onAuthStateChange((event, user: User | null) => {
      // When Supabase emits an auth event, update the React Query cache
      // so all components using ["auth","user"] see the new state.
      queryClient.setQueryData(["auth", "user"], user ?? null);

      // Optional: on SIGNED_IN, you might want to refresh other user-scoped queries:
      if (event === "SIGNED_IN") {
        queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
        // TODO: invalidate other user-specific queries (orders, profile, etc.)
      }

      // Optional: on SIGNED_OUT clear sensitive caches
      if (event === "SIGNED_OUT") {
        // clear user-specific caches if any
        queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "events" });
      }
    });

    // unsubscribe safely on unmount
    return () => {
      try {
        // Supabase v2 returns an object with subscription: { unsubscribe() }
        // handle different shapes defensively
        if ((sub as any)?.subscription?.unsubscribe) {
          (sub as any).subscription.unsubscribe();
        } else if ((sub as any)?.unsubscribe) {
          (sub as any).unsubscribe();
        } else if ((sub as any)?.data?.subscription?.unsubscribe) {
          (sub as any).data.subscription.unsubscribe();
        }
      } catch (err) {
        // swallow unsubscribe errors in dev only
        // console.warn("Failed to unsubscribe from auth events", err);
      }
    };
  }, [queryClient]);

  // ---------- Mutations: signup / signin / signout ----------
  const signUpMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      // TODO: handle OTP / magic link flows separately if you use them
      authService.signUp(email, password),
    onSuccess: (user) => {
      // update cached user after signup if session available
      queryClient.setQueryData(["auth", "user"], user ?? null);
    },
  });

  const signInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: (user) => {
      // set logged-in user in cache
      queryClient.setQueryData(["auth", "user"], user ?? null);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "user"], null);
      // TODO: clear or invalidate user-scoped queries, keep public caches like ["events"]
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "events" });
    },
  });

  // ---------- helpers ----------
  function refreshUser() {
    // revalidate user query (refetch from Supabase)
    return queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
  }

  const isAuthenticated = !!userQuery.data;

  return {
    // state
    user: userQuery.data ?? null,
    isAuthenticated,
    isLoading: userQuery.isLoading,
    error: userQuery.error,

    // actions
    signUp: signUpMutation.mutateAsync,
    signIn: signInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    refreshUser,
  };
}

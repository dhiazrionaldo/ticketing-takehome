"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/hook/useAuth";

/**
 * ProtectedRoute component
 *
 * Purpose:
 *  - Wraps pages/components that require authentication.
 *  - Redirects to /login if user is not logged in.
 *
 * TODO:
 *  - Add role-based access (e.g., admin only).
 *  - Add loading spinner while checking auth state.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // TODO: handle loading state (e.g., show spinner)
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return <>{children}</>;
}

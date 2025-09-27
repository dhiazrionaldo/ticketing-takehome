"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuthQuery } from "@/core/hook/useAuth";

/**
 * HomeButton component
 *
 * Purpose:
 *  - Show the correct entry button based on user authentication and role.
 *
 * TODO:
 *  - TODO: Add redirect logic after successful login (e.g., auto-navigate to /home).
 *  - TODO: Make role check more robust (support multiple roles, RBAC).
 *  - TODO: Replace hardcoded text with i18n/localized strings.
 */
export default function HomeButton() {
  const { user, isAuthenticated, isLoading } = useAuthQuery();
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return <p>Loading user data...</p>;
  }

  if (!isAuthenticated) {
    return <div />; // TODO: maybe show login CTA here
  }

  const isAdmin = user?.role === "admin";

  return (
    <div>
      {loading ? (
        <Button disabled>
          Proceed to App <Loader2 className="animate-spin" />
        </Button>
      ) : isAdmin ? (
        <Link href="/event" onClick={() => setLoading(true)}>
          <Button onClick={() => setLoading(true)}>
            Proceed to App <ArrowRight />
          </Button>
        </Link>
      ) : (
        <p>Please ask your administrator to assign your account</p>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuthQuery } from "@/core/hook/useAuth";
import profile from "@/asset/profile.png";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Profile Component
 *
 * Purpose:
 *  - Display user avatar & email if logged in
 *  - Provide Sign In button if logged out
 *  - Handle logout via Supabase + TanStack Query
 *
 * TODO:
 *  - TODO: Replace placeholder profile.png with user avatar from Supabase metadata
 *  - TODO: Add dropdown menu (Profile, Settings, Logout) instead of direct logout on avatar click
 *  - TODO: Add redirect after logout (e.g., router.push to /login or /home)
 */
export default function Profile() {
  const { user, isAuthenticated, signOut } = useAuthQuery();
  const router = useRouter();
  const handleLogout = async () => {
    // TODO: add confirmation modal before logout
    try {
      await signOut(); // Supabase signOut via useAuthQuery
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      router.push("/"); // Redirect to login after logout
    }
  };

  return (
    <div>
      {!isAuthenticated ? (
        <Link href="/login">
          <Button variant="outline">Sign In</Button>
        </Link>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          {/* Avatar - triggers logout for now */}
          {signOut.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Image
              src={profile}
              alt={user?.fullName ?? "User Avatar"}
              width={30}
              height={30}
              className="rounded-full cursor-pointer"
              onClick={handleLogout}
            />
          )}

          {/* User info */}
          <div>
            <p className="text-xs">{user?.fullName ?? "Anonymous"}</p>
            <p className="text-xs">{user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}

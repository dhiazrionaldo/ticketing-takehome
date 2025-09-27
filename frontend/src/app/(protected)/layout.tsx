'use client'

import { Sidebar } from "@/components/sidebar"
import { Toaster } from "react-hot-toast"
import { usePathname } from "next/navigation"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const maxDuration = 60
export const fetchCache = "force-no-store"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Optional: hide sidebar for some routes (like login/signup inside protected if any)
  const hideSidebarRoutes = ["/login", "/signup"]
  const [client] = useState(() => new QueryClient());
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname)

  return (
    <main className="mx-3 mt-16 sm:ml-[250px] sm:mt-0">
      <Toaster />
      {!shouldHideSidebar && <Sidebar />}
      {children}
    </main>
  )
}

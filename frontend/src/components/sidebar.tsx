"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LineChartIcon, PlaneIcon, TicketIcon, ShoppingCartIcon } from "lucide-react";
import { SidebarDesktop } from "./sidebar-desktop";
import { SidebarMobile } from "./sidebar-mobile";
import { useMediaQuery } from "usehooks-ts";
import { SidebarItems } from "@/types";
import { useAuthQuery } from "@/core/hook/useAuth";

/**
 * Sidebar component
 *
 * Purpose:
 *  - Render role-based navigation
 *  - Admin → Event, Purchase, Ticket
 *  - Non-admin → only Purchase
 *
 * TODO:
 *  - TODO: Extend roles to support vendor-specific sidebars
 *  - TODO: Add collapsible groups for better UX when menu grows
 *  - TODO: Sync selected state with current route (highlight active link)
 */
export function Sidebar() {
  const isDesktop = useMediaQuery("(min-width: 640px)", {
    initializeWithValue: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useAuthQuery();

  const handleNavigation = async (href: string) => {
    setLoading(true);
    await router.push(href);
    setLoading(false);
  };

  // Role-based sidebar configuration
  let sidebarItems: SidebarItems;

  if (user?.role === "admin") {
    sidebarItems = {
      links: [
        { label: "Purchase", href: "/purchase", icon: ShoppingCartIcon },
        { label: "Events", href: "/event", icon: LineChartIcon },
        { label: "Tickets", href: "/ticket", icon: TicketIcon },
      ],
    };
  } else {
    // Non-admin: only purchase
    sidebarItems = {
      links: [{ label: "Purchase", href: "/purchase", icon: ShoppingCartIcon }],
    };
  }

  const sidebarItemsWithOnClick = {
    ...sidebarItems,
    links: sidebarItems.links.map((item) => ({
      ...item,
      onClick: () => handleNavigation(item.href),
    })),
  };

  if (isLoading) {
    return <p>Loading menu...</p>;
  }

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItemsWithOnClick} loading={loading} />;
  }

  return <SidebarMobile sidebarItems={sidebarItemsWithOnClick} />;
}

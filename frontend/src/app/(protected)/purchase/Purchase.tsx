"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

/**
 * PurchasePage
 *
 * Purpose:
 *  - Example of a protected page.
 *  - Only logged-in users can access this.
 *
 * TODO:
 *  - Integrate with TicketService (create order).
 *  - Add ticket selection UI.
 */
export default function PurchasePage() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-xl font-semibold">Purchase Ticket</h1>
        <p>This page is protected. Only logged-in users can see this.</p>
      </div>
    </ProtectedRoute>
  );
}

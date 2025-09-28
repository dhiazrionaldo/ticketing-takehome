"use client";

import { useState } from "react";
import { Order } from "@/core/models/Order"; // Using Order because tickets are in Order model now
import { DataTable } from "@/components/ui/data-table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { purchaseTicketColumns } from "@/components/ticket/PurchaseTicketColumn";
import { PurchaseForm, PurchaseFormValues } from "./PurchaseForm";
import { useAuthQuery } from "@/core/hook/useAuth";

interface PurchaseTicketListProps {
  tickets: Order[];
  onPurchase: (ticket: Order, qty: number) => Promise<void>;
}

export function PurchaseTicketList({ tickets, onPurchase }: PurchaseTicketListProps) {
  const { user, isLoading: authLoading } = useAuthQuery();
  const [selectedTicket, setSelectedTicket] = useState<Order | null>(null);
  const [openPurchase, setOpenPurchase] = useState(false);

  const columns = purchaseTicketColumns(
    (ticket) => {
      if (!ticket || ticket.qty_total <= 0) return;
      setSelectedTicket(ticket);
      setOpenPurchase(true);
    },
    () => {} // no delete for purchase
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Available Tickets</h2>
      {authLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : (
        <DataTable columns={columns} data={tickets} />
      )}

      {/* Purchase Sheet */}
      <Sheet open={openPurchase} onOpenChange={setOpenPurchase}>
        <SheetContent forceMount>
          <SheetHeader>
            <SheetTitle>Purchase Ticket</SheetTitle>
          </SheetHeader>
          {selectedTicket && (
            <PurchaseForm
              ticket={selectedTicket}
              user={user}
              onSubmit={async (values: PurchaseFormValues) => {
                if (!user?.accessToken) return;
                await onPurchase(selectedTicket, values.qty);
                setOpenPurchase(false);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

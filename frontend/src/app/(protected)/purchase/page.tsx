"use client";

import { useEffect, useState } from "react";
import { useAvailableTickets, useTickets } from "@/core/hook/useTicket";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TicketList } from "@/components/ticket/TicketList";
import { EventForm, EventFormValues } from "@/components/events/EventForm";
import { useAuthQuery } from "@/core/hook/useAuth";
import { useQueryClient } from "@tanstack/react-query";

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
  const { availableTickets, isLoading } = useAvailableTickets();
  const { user, isLoading: authLoading } = useAuthQuery();
  const token = user?.accessToken;

  // Sheet state for creating new events
  const [openCreateEvent, setOpenCreateEvent] = useState(false);

  // Sheet state for managing tickets per event
  const [openTicketSheet, setOpenTicketSheet] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string>("");

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
  },[queryClient]);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Purchase Tickets</h1>
      </div>

      {/* Event List Stub */}
      {isLoading ? (
        <div className="flex items-center gap-2">
          Loading ...
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {availableTickets.map((ticket) => (
            <div key={ticket.id} className="p-4 border rounded-md">
              {/* Event Header */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-lg font-semibold">Event : {ticket.event.title}</h2>
                  <h4 className="text-md">Ticket : {ticket.name}</h4>
                  <h4 className="text-lg font-bold">Price : {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(ticket.price)}</h4>
                  <p className="text-sm text-muted-foreground">Available: {ticket.qty_total}</p>
                </div>
                <Button
                  disabled={!token || authLoading}
                  size="sm"
                  onClick={() => {
                    setSelectedEventId(event.id);
                    setSelectedEventTitle(event.title);
                    setOpenTicketSheet(true);
                    
                  }}
                >
                  Buy Tickets
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Sheet */}
      <Sheet open={openCreateEvent} onOpenChange={setOpenCreateEvent}>
        <SheetContent forceMount>
          <SheetHeader>
            <SheetTitle>Create Event</SheetTitle>
          </SheetHeader>
          <EventForm
            onSubmit={async (values: EventFormValues) => {
              await createEvent(values); // Hook will handle API call
              setOpenCreateEvent(false);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Ticket Sheet */}
      <Sheet open={openTicketSheet} onOpenChange={setOpenTicketSheet}>
        <SheetContent forceMount className="!w-[95vw] !max-w-[900px] !h-[95vh] !p-6">
          <SheetHeader>
            <SheetTitle>Tickets for: {selectedEventTitle}</SheetTitle>
          </SheetHeader>
          {selectedEventId && (
            <TicketList eventId={selectedEventId} /> // Stub: Handles create/edit/delete
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

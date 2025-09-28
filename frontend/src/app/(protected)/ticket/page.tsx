"use client";

import { useEffect, useState } from "react";
import { useEvents } from "@/core/hook/useEvent";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TicketList } from "@/components/ticket/TicketList";
import { EventForm, EventFormValues } from "@/components/events/EventForm";
import { useAuthQuery } from "@/core/hook/useAuth";
import { useQueryClient } from "@tanstack/react-query";

/**
 * TicketPage Stub
 *
 * Purpose:
 *  - Display list of events
 *  - Add/Edit Events via ShadCN Sheet
 *  - Manage tickets per event (inline or via Sheet)
 *
 * Notes:
 *  - Event & Ticket data come from hooks (useEvents, useTickets)
 *  - TicketList handles all ticket CRUD per event
 */

export default function TicketPage() {
  const { events, isLoading, createEvent, refresh } = useEvents();
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
        <h1 className="text-2xl font-semibold">Events & Tickets</h1>
        <Button onClick={() => setOpenCreateEvent(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      {/* Event List Stub */}
      {isLoading ? (
        <div className="flex items-center gap-2">
          Loading ...
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="p-4 border rounded-md">
              {/* Event Header */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-lg font-semibold">{event.title}</h2>
                  <p className="text-sm text-muted-foreground">{event.venue}</p>
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
                  Manage Tickets
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

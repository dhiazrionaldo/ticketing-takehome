"use client";

import { useState } from "react";
import { useEvents } from "@/core/hook/useEvent";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { EventForm } from "@/components/events/EventForm";
import { EventList } from "@/components/events/EventList";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

/**
 * EventPage
 *
 * Purpose:
 *  - Display list of events
 *  - Provide CRUD (Create, Edit, Delete) using ShadCN UI
 *
 * TODO:
 *  - TODO: Add pagination for large dataset
 *  - TODO: Add search/filter
 *  - TODO: Restrict access by role (admin only)
 */
export default function EventPage() {
  const { events, isLoading, createEvent, refresh } = useEvents();
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Button onClick={() => setOpenCreate(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>
       {isLoading ? <div>Loading ... <Loader2 className="animate-spin" /></div> : <EventList events={events} refresh={refresh} />}

      {/* Create Event Sheet */}
      <Sheet open={openCreate} onOpenChange={setOpenCreate}>
        <SheetContent forceMount >
          <SheetHeader>
            <SheetTitle>Create Event</SheetTitle>
          </SheetHeader>
          <EventForm
            onSubmit={async (event) => {
              await createEvent(event);
              setOpenCreate(false);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

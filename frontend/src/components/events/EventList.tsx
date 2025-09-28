"use client";

import { Event } from "@/core/models/Event";
import { useEvents } from "@/core/hook/useEvent";
import { useState } from "react";
import { eventColumns } from "./EventColumn";
import { EventForm, EventFormValues } from "./EventForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

/**
 * EventList
 *
 * Purpose:
 *  - Shows events in a ShadCN DataTable
 *  - Handles Create (Sheet), Edit (Sheet), Delete (AlertDialog)
 *
 * TODO:
 *  - TODO: Add global search bar
 *  - TODO: Add server-side pagination
 *  - TODO: Add optimistic updates for smoother UX
 */
export function EventList({ events, refresh }: { events: Event[]; refresh: () => void }) {
  const { createEvent, updateEvent, deleteEvent } = useEvents();
  const [selected, setSelected] = useState<Event | null>(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const columns = eventColumns(
    (event) => {
      setSelected(event);
      setOpenEdit(true);
    },
    (event) => {
      setSelected(event);
      setOpenDelete(true);
    }
  );

  return (
    <div className="space-y-4">

      {/* Data Table */}
      <DataTable columns={columns} data={events} />

      {/* Edit Event Sheet */}
      <Sheet open={openEdit} onOpenChange={setOpenEdit}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Event</SheetTitle>
          </SheetHeader>
          {selected && (
            <EventForm
              event={selected}
              onSubmit={async (values: EventFormValues) => {
                await updateEvent({ ...selected, ...values });
                setOpenEdit(false);
                // refresh();
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Event Dialog */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete{" "}
              <span className="font-bold">{selected?.title}</span>?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDelete(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selected) {
                  await deleteEvent(selected);
                  refresh();
                }
                setOpenDelete(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

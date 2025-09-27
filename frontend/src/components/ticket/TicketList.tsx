"use client";

import { useState } from "react";
import { Ticket } from "@/core/models/Ticket";
import { useTickets } from "@/core/hook/useTicket";
import { TicketForm, TicketFormValues } from "./TicketForm";
import { DataTable } from "@/components/ui/data-table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ticketColumns } from "@/components/ticket/TicketColumn";
import { useAuthQuery } from "@/core/hook/useAuth";

interface TicketListProps {
  eventId: string;
}

export function TicketList({ eventId }: TicketListProps) {
  const { tickets, createTicket, updateTicket, deleteTicket } = useTickets(eventId);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { user, isLoading: authLoading } = useAuthQuery();
  
  const columns = ticketColumns(
    (ticket) => {
      setSelected(ticket);
      setOpenEdit(true);
    },
    (ticket) => {
      setSelected(ticket);
      setOpenDelete(true);
    }
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tickets</h2>
        <Button onClick={() => setOpenCreate(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Ticket
        </Button>
      </div>

      <DataTable columns={columns} data={tickets} />

      {/* Create Ticket */}
      <Sheet open={openCreate} onOpenChange={setOpenCreate}>
        <SheetContent forceMount>
          <SheetHeader>
            <SheetTitle>Create Ticket</SheetTitle>
          </SheetHeader>
          <TicketForm
            onSubmit={async (values: TicketFormValues) => {
              if (!user?.accessToken) return; // safety check
              await createTicket({ ...values, event_id: eventId });
              setOpenCreate(false);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Edit Ticket */}
      <Sheet open={openEdit} onOpenChange={setOpenEdit}>
        <SheetContent forceMount>
          <SheetHeader>
            <SheetTitle>Edit Ticket</SheetTitle>
          </SheetHeader>
          {selected && (
            <TicketForm
              ticket={selected}
              onSubmit={async (values: TicketFormValues) => {
                await updateTicket({ ...selected, ...values });
                setOpenEdit(false);
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Ticket */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete ticket <b>{selected?.name}</b>?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selected) await deleteTicket(selected.id);
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

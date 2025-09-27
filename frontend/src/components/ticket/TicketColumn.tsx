"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Ticket } from "@/core/models/Ticket";
import { Button } from "@/components/ui/button";

/**
 * TicketColumns
 * 
 * Purpose:
 *  - Defines how tickets are displayed in ShadCN DataTable
 *  - Provides Edit & Delete actions
 */
export const ticketColumns = (
  onEdit: (ticket: Ticket) => void,
  onDelete: (ticket: Ticket) => void
): ColumnDef<Ticket>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `Rp. ${row.original.price.toLocaleString()}`,
  },
  {
    accessorKey: "qty_total",
    header: "Total Qty",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) =>
      row.original.created_at
        ? new Date(row.original.created_at).toLocaleString()
        : "-",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const ticket = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(ticket)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(ticket)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];

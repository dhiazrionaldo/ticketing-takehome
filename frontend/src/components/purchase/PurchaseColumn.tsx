"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/core/models/Order";
import { Button } from "@/components/ui/button";

/**
 * PurchaseTicketColumns
 *
 * Purpose:
 *  - Shows ticket info along with remaining quantity and event name
 */
export const purchaseTicketColumns = (
  onEdit: (ticket: Order) => void,
  onDelete: (ticket: Order) => void
): ColumnDef<Order>[] => [
  {
    accessorKey: "name",
    header: "Ticket Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `Rp. ${row.original.price.toLocaleString()}`,
  },
  {
    accessorKey: "qty_total",
    accessorFn: (row) => row.ticket?.qty_total ?? "N/A",
    header: "Remaining Qty",
  },
  {
    accessorFn: (row) => row.event?.title ?? "-",
    header: "Event Name",
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

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Event } from "@/core/models/Event";
import { Button } from "@/components/ui/button";

/**
 * EventColumns
 *
 * Purpose:
 *  - Defines how events are displayed in ShadCN DataTable
 *  - Provides action buttons (Edit, Delete)
 *
 * TODO:
 *  - TODO: Add column filters (search by title, venue)
 *  - TODO: Add formatting for date/time
 */
export const eventColumns = (
  onEdit: (event: Event) => void,
  onDelete: (event: Event) => void
): ColumnDef<Event>[] => [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "venue",
    header: "Venue",
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: ({ row }) => new Date(row.original.start_time).toLocaleString(),
  },
  {
    accessorKey: "end_time",
    header: "End Time",
    cell: ({ row }) => new Date(row.original.end_time).toLocaleString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(event)}>
            Delete
          </Button>
        </div>
      );
    },
  },
];

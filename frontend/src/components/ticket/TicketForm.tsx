"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/core/models/Ticket";

// Schema for TicketForm validation
const ticketSchema = z.object({
  name: z.string().min(3, "Ticket name must be at least 3 characters"),
  price: z.coerce.number().min(0, "Price must be greater than or equal 0"),
  qty_total: z.coerce.number().min(0, "Total quantity must be greater than or equal 0"),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;

interface TicketFormProps {
  ticket?: Ticket;
  onSubmit: (values: TicketFormValues) => Promise<void>;
}

export function TicketForm({ ticket, onSubmit }: TicketFormProps) {
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: ticket?.name ?? "",
      price: ticket?.price ?? 0,
      qty_total: ticket?.qty_total ?? 0,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter ticket name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" min={0} placeholder="Enter price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="qty_total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Quantity</FormLabel>
              <FormControl>
                <Input type="number" min={0} placeholder="Enter total quantity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {ticket ? "Update Ticket" : "Create Ticket"}
        </Button>
      </form>
    </Form>
  );
}

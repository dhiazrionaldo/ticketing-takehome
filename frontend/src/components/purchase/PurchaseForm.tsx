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
import { usePurchase } from "@/core/hook/usePurchase";
import { useTicketById, useTickets } from "@/core/services/TicketServices";
import toast from "react-hot-toast";

const purchaseSchema = z.object({
  qty: z.coerce.number().min(1, "Quantity must be at least 1"),
});

export type PurchaseFormValues = z.infer<typeof purchaseSchema>;

interface PurchaseFormProps {
  ticketId: string;
  token: string | undefined;
  onSuccess?: () => void;
}

export function PurchaseForm({ ticketId, token, onSuccess }: PurchaseFormProps) {
  const { tickets, isLoading } = useTicketById(ticketId);
  const ticket = tickets?.[0]; 
  const {purchaseOrders, isLoading: purchaseLoading} = usePurchase(ticketId, token);
  
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      qty: 1,
    },
  });

  const handleSubmit = async (values: PurchaseFormValues) => {
    if (!ticket) return;

    if (values.qty > ticket.qty_total) {
      toast.error(`Quantity cannot exceed remaining tickets (${ticket.qty_total})`);
      return;
    }

    await purchaseOrders({
      ticket_id: ticket.id,
      qty: values.qty,
    });

    toast.success("Purchase successful!");
    form.reset({ qty: 1 });

    if (onSuccess) onSuccess();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{ticket.name}</h3>
          <p>Event: {ticket.event?.title}</p>
          <p>
            Price:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(ticket.price)}
          </p>
          <p>Remaining Tickets: {ticket.qty_total}</p>
        </div>

        <FormField
          control={form.control}
          name="qty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={ticket.qty_total}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Purchase
        </Button>
      </form>
    </Form>
  );
}

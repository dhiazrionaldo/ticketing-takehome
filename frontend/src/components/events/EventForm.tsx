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
import { Event } from "@/core/models/Event";

/**
 * EventForm
 *
 * Purpose:
 *  - Handles creating & editing Event entities
 *  - Uses ShadCN Form + Input components with validation
 *
 * TODO:
 *  - TODO: Replace start/end time inputs with a DateTimePicker (ShadCN calendar + time)
 *  - TODO: Add capacity validation (>= 1)
 */
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  venue: z.string().min(2, "Venue required"),
  start_time: z.string().nonempty("Start time required"),
  end_time: z.string().nonempty("End time required"),
  capacity: z.coerce.number().min(1, "Capacity must be greater than 0"),
});

export type EventFormValues = z.infer<typeof eventSchema>;

export function EventForm({
  event,
  onSubmit,
}: {
  event?: Event;
  onSubmit: (values: EventFormValues) => Promise<void>;
}) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      venue: event?.venue ?? "",
      start_time: event?.start_time
        ? new Date(event.start_time).toISOString().slice(0, 16)
        : "",
      end_time: event?.end_time
        ? new Date(event.end_time).toISOString().slice(0, 16)
        : "",
      capacity: event?.capacity ?? 1,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Event description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input placeholder="Event venue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {event ? "Update Event" : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}

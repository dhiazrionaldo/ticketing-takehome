//data transfer object for creating an event
export interface CreateEventDto {
  title: string;
  description?: string;
  venue?: string;
  start_time?: string;
  end_time?: string;
  capacity?: number;
}

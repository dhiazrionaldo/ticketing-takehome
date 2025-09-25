//data transfer object for Delete an event
export interface DeleteEventDto {
  id: string;
  title: string;
  description?: string;
  venue?: string;
  start_time?: string;
  end_time?: string;
  capacity?: number;
}

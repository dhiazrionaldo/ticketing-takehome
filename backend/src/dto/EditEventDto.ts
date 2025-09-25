//data transfer object for Edit an event
export interface EditEventDto {
  id: string
  title: string;
  description?: string;
  venue?: string;
  start_time?: string;
  end_time?: string;
  capacity?: number;
}

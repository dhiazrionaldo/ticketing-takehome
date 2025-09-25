//Data model for Event
export class Event {
  constructor(
    public id: string,
    public title: string,
    public description: string | null,
    public venue: string | null,
    public start_time: string | null,
    public end_time: string | null,
    public capacity: number,
    public created_by: string | null,
    public created_at: string | null
  ) {}
}


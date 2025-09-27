//TODO: Model data for Event
export class Event {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public venue: string,
    public start_time: string,
    public end_time?: string,
    public capacity?: number
  ) {}
}

//Data model for Profile
export class Profile {
  constructor(
    public id: string,
    public full_name: string | null,
    public role: string,
    public created_at: string | null
  ) {}
}

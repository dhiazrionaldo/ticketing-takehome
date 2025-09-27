//TODO: Model for User
export class User {
  constructor(
    public id: string,
    public email: string,
    public role?: string,
    public fullName?: string,
    public accessToken?: string
  ) {}
}
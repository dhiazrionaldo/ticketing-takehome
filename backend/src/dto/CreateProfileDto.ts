//data transfer object for creating a profile
export interface CreateProfileDto {
  full_name?: string;
  role?: 'user' | 'admin' | string;
}

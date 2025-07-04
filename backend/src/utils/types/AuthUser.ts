export interface AuthUser {
  id: number;
  created_at: Date;
  updated_at: Date;
  email: string;
  first_name: string;
  last_name: string;
  google_id: string;
  display_name: string;
  avatar_url: string;
}
